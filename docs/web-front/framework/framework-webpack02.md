# Webpack 核心原理分析（二）执行流程

## Webpack4

### webpack/bin

执行 webpack 首先会走到 nodemodules/webpack/bin 下的 webpack.js。

webpack.js 里主要判断了是否安装了 webpack-cli，如果没安装就提示安装，如果安装了，就走 webpack-cli。

```javascript
const runCommand = (command, args) => {
  const cp = require("child_process");
  return new Promise((resolve, reject) => {
    const executedCommand = cp.spawn(command, args, {
      stdio: "inherit",
      shell: true,
    });

    executedCommand.on("error", (error) => {
      reject(error);
    });

    executedCommand.on("exit", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject();
      }
    });
  });
};
const CLIs = [
  {
    name: "webpack-cli",
    package: "webpack-cli",
    binName: "webpack-cli",
    alias: "cli",
    installed: isInstalled("webpack-cli"),
    recommended: true,
    url: "https://github.com/webpack/webpack-cli",
    description: "The original webpack full-featured CLI.",
  },
  {
    name: "webpack-command",
    package: "webpack-command",
    binName: "webpack-command",
    alias: "command",
    installed: isInstalled("webpack-command"),
    recommended: false,
    url: "https://github.com/webpack-contrib/webpack-command",
    description: "A lightweight, opinionated webpack CLI.",
  },
];

const installedClis = CLIs.filter((cli) => cli.installed);
//判断有没有cli
if (installedClis.length === 0) {
  const path = require("path");
  const fs = require("fs");
  const readLine = require("readline");

  let notify =
    "One CLI for webpack must be installed. These are recommended choices, delivered as separate packages:";

  for (const item of CLIs) {
    if (item.recommended) {
      notify += `\n - ${item.name} (${item.url})\n   ${item.description}`;
    }
  }

  console.error(notify);

  //是否有Yarn
  const isYarn = fs.existsSync(path.resolve(process.cwd(), "yarn.lock"));

  const packageManager = isYarn ? "yarn" : "npm";
  const installOptions = [isYarn ? "add" : "install", "-D"];

  console.error(
    `We will use "${packageManager}" to install the CLI via "${packageManager} ${installOptions.join(
      " "
    )}".`
  );

  let question = `Do you want to install 'webpack-cli' (yes/no): `;

  const questionInterface = readLine.createInterface({
    input: process.stdin,
    output: process.stderr,
  });
  // 安装webpack-cli
  questionInterface.question(question, (answer) => {
    questionInterface.close();

    const normalizedAnswer = answer.toLowerCase().startsWith("y");

    if (!normalizedAnswer) {
      console.error(
        "You need to install 'webpack-cli' to use webpack via CLI.\n" +
          "You can also install the CLI manually."
      );
      process.exitCode = 1;

      return;
    }

    const packageName = "webpack-cli";

    console.log(
      `Installing '${packageName}' (running '${packageManager} ${installOptions.join(
        " "
      )} ${packageName}')...`
    );

    runCommand(packageManager, installOptions.concat(packageName))
      .then(() => {
        // 装完cli require webpack-cli
        require(packageName); //eslint-disable-line
      })
      .catch((error) => {
        console.error(error);
        process.exitCode = 1;
      });
  });
} else if (installedClis.length === 1) {
  const path = require("path");
  const pkgPath = require.resolve(`${installedClis[0].package}/package.json`);
  // eslint-disable-next-line node/no-missing-require
  const pkg = require(pkgPath);
  // eslint-disable-next-line node/no-missing-require
  require(path.resolve(
    path.dirname(pkgPath),
    pkg.bin[installedClis[0].binName]
  ));
}
```

### webpack-cli

webpack-cli 主要做了下面几件事

1. 检查输入参数正确性
2. 找回 webpack，真正的处理还是在 webpack 中，执行 nodemodules/webpack/lib/webpack.js 函数

```javascript
#!/usr/bin/env node

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

const { NON_COMPILATION_ARGS } = require("./utils/constants");

// 是个大闭包
(function() {
  // wrap in IIFE to be able to use return

  const importLocal = require("import-local");
  // Prefer the local installation of webpack-cli
  if (importLocal(__filename)) {
    return;
  }

  // v8编译缓存
  require("v8-compile-cache");

  const ErrorHelpers = require("./utils/errorHelpers");

  const NON_COMPILATION_CMD = process.argv.find((arg) => {
    if (arg === "serve") {
      global.process.argv = global.process.argv.filter((a) => a !== "serve");
      process.argv = global.process.argv;
    }
    return NON_COMPILATION_ARGS.find((a) => a === arg);
  });

  if (NON_COMPILATION_CMD) {
    return require("./utils/prompt-command")(
      NON_COMPILATION_CMD,
      ...process.argv
    );
  }

  const yargs = require("yargs").usage(`webpack-cli ${
    require("../package.json").version
  }

Usage: webpack-cli [options]
       webpack-cli [options] --entry <entry> --output <output>
       webpack-cli [options] <entries...> --output <output>
       webpack-cli <command> [options]

For more information, see https://webpack.js.org/api/cli/.`);

  require("./config/config-yargs")(yargs);

  // yargs will terminate the process early when the user uses help or version.
  // This causes large help outputs to be cut short (https://github.com/nodejs/node/wiki/API-changes-between-v0.10-and-v4#process).
  // To prevent this we use the yargs.parse API and exit the process normally
  // yargs处理传参
  yargs.parse(process.argv.slice(2), (err, argv, output) => {
    Error.stackTraceLimit = 30;

    // arguments validation failed
    if (err && output) {
      console.error(output);
      process.exitCode = 1;
      return;
    }

    // help or version info
    if (output) {
      console.log(output);
      return;
    }

    if (argv.verbose) {
      argv["display"] = "verbose";
    }

    let options;
    try {
      options = require("./utils/convert-argv")(argv);
    } catch (err) {
      if (err.code === "MODULE_NOT_FOUND") {
        const moduleName = err.message.split("'")[1];
        let instructions = "";
        let errorMessage = "";

        if (moduleName === "webpack") {
          errorMessage = `\n${moduleName} not installed`;
          instructions = `Install webpack to start bundling: \u001b[32m\n  $ npm install --save-dev ${moduleName}\n`;

          if (
            process.env.npm_execpath !== undefined &&
            process.env.npm_execpath.includes("yarn")
          ) {
            instructions = `Install webpack to start bundling: \u001b[32m\n $ yarn add ${moduleName} --dev\n`;
          }
          Error.stackTraceLimit = 1;
          console.error(`${errorMessage}\n\n${instructions}`);
          process.exitCode = 1;
          return;
        }
      }

      if (err.name !== "ValidationError") {
        throw err;
      }

      const stack = ErrorHelpers.cleanUpWebpackOptions(err.stack, err.message);
      const message = err.message + "\n" + stack;

      if (argv.color) {
        console.error(`\u001b[1m\u001b[31m${message}\u001b[39m\u001b[22m`);
      } else {
        console.error(message);
      }

      process.exitCode = 1;
      return;
    }

    /**
     * When --silent flag is present, an object with a no-op write method is
     * used in place of process.stout
     */
    const stdout = argv.silent ? { write: () => {} } : process.stdout;

    function ifArg(name, fn, init) {
      if (Array.isArray(argv[name])) {
        if (init) init();
        argv[name].forEach(fn);
      } else if (typeof argv[name] !== "undefined") {
        if (init) init();
        fn(argv[name], -1);
      }
    }

    function processOptions(options) {
      // process Promise
      if (typeof options.then === "function") {
        options.then(processOptions).catch(function(err) {
          console.error(err.stack || err);
          // eslint-disable-next-line no-process-exit
          process.exit(1);
        });
        return;
      }

      const firstOptions = [].concat(options)[0];
      const statsPresetToOptions = require("webpack").Stats.presetToOptions;

      let outputOptions = options.stats;
      if (
        typeof outputOptions === "boolean" ||
        typeof outputOptions === "string"
      ) {
        outputOptions = statsPresetToOptions(outputOptions);
      } else if (!outputOptions) {
        outputOptions = {};
      }

      ifArg("display", function(preset) {
        outputOptions = statsPresetToOptions(preset);
      });

      outputOptions = Object.create(outputOptions);
      if (Array.isArray(options) && !outputOptions.children) {
        outputOptions.children = options.map((o) => o.stats);
      }
      if (typeof outputOptions.context === "undefined")
        outputOptions.context = firstOptions.context;

      ifArg("env", function(value) {
        if (outputOptions.env) {
          outputOptions._env = value;
        }
      });

      ifArg("json", function(bool) {
        if (bool) {
          outputOptions.json = bool;
          outputOptions.modules = bool;
        }
      });

      if (typeof outputOptions.colors === "undefined")
        outputOptions.colors = require("supports-color").stdout;

      ifArg("sort-modules-by", function(value) {
        outputOptions.modulesSort = value;
      });

      ifArg("sort-chunks-by", function(value) {
        outputOptions.chunksSort = value;
      });

      ifArg("sort-assets-by", function(value) {
        outputOptions.assetsSort = value;
      });

      ifArg("display-exclude", function(value) {
        outputOptions.exclude = value;
      });

      if (!outputOptions.json) {
        if (typeof outputOptions.cached === "undefined")
          outputOptions.cached = false;
        if (typeof outputOptions.cachedAssets === "undefined")
          outputOptions.cachedAssets = false;

        ifArg("display-chunks", function(bool) {
          if (bool) {
            outputOptions.modules = false;
            outputOptions.chunks = true;
            outputOptions.chunkModules = true;
          }
        });

        ifArg("display-entrypoints", function(bool) {
          outputOptions.entrypoints = bool;
        });

        ifArg("display-reasons", function(bool) {
          if (bool) outputOptions.reasons = true;
        });

        ifArg("display-depth", function(bool) {
          if (bool) outputOptions.depth = true;
        });

        ifArg("display-used-exports", function(bool) {
          if (bool) outputOptions.usedExports = true;
        });

        ifArg("display-provided-exports", function(bool) {
          if (bool) outputOptions.providedExports = true;
        });

        ifArg("display-optimization-bailout", function(bool) {
          if (bool) outputOptions.optimizationBailout = bool;
        });

        ifArg("display-error-details", function(bool) {
          if (bool) outputOptions.errorDetails = true;
        });

        ifArg("display-origins", function(bool) {
          if (bool) outputOptions.chunkOrigins = true;
        });

        ifArg("display-max-modules", function(value) {
          outputOptions.maxModules = +value;
        });

        ifArg("display-cached", function(bool) {
          if (bool) outputOptions.cached = true;
        });

        ifArg("display-cached-assets", function(bool) {
          if (bool) outputOptions.cachedAssets = true;
        });

        if (!outputOptions.exclude)
          outputOptions.exclude = [
            "node_modules",
            "bower_components",
            "components",
          ];

        if (argv["display-modules"]) {
          outputOptions.maxModules = Infinity;
          outputOptions.exclude = undefined;
          outputOptions.modules = true;
        }
      }

      ifArg("hide-modules", function(bool) {
        if (bool) {
          outputOptions.modules = false;
          outputOptions.chunkModules = false;
        }
      });

      ifArg("info-verbosity", function(value) {
        outputOptions.infoVerbosity = value;
      });

      ifArg("build-delimiter", function(value) {
        outputOptions.buildDelimiter = value;
      });

      // 找回webpack，真正的处理还是在webpack中
      //webpack-cli主要完成参数处理、命令UI交互
      const webpack = require("webpack");

      let lastHash = null;
      let compiler;
      try {
        // compiler是整个webpack编译的核心
        compiler = webpack(options);
      } catch (err) {
        if (err.name === "WebpackOptionsValidationError") {
          if (argv.color)
            console.error(
              `\u001b[1m\u001b[31m${err.message}\u001b[39m\u001b[22m`
            );
          else console.error(err.message);
          // eslint-disable-next-line no-process-exit
          process.exit(1);
        }

        throw err;
      }

      if (argv.progress) {
        const ProgressPlugin = require("webpack").ProgressPlugin;
        new ProgressPlugin({
          profile: argv.profile,
        }).apply(compiler);
      }
      if (outputOptions.infoVerbosity === "verbose") {
        // 执行watchRun/beforeRun勾子

        if (argv.w) {
          compiler.hooks.watchRun.tap("WebpackInfo", (compilation) => {
            const compilationName = compilation.name ? compilation.name : "";
            console.error("\nCompilation " + compilationName + " starting…\n");
          });
        } else {
          compiler.hooks.beforeRun.tap("WebpackInfo", (compilation) => {
            const compilationName = compilation.name ? compilation.name : "";
            console.error("\nCompilation " + compilationName + " starting…\n");
          });
        }
        compiler.hooks.done.tap("WebpackInfo", (compilation) => {
          const compilationName = compilation.name ? compilation.name : "";
          console.error("\nCompilation " + compilationName + " finished\n");
        });
      }

      // 编译回调函数
      function compilerCallback(err, stats) {
        if (!options.watch || err) {
          // Do not keep cache anymore
          compiler.purgeInputFileSystem();
        }
        if (err) {
          lastHash = null;
          console.error(err.stack || err);
          if (err.details) console.error(err.details);
          process.exitCode = 1;
          return;
        }
        if (outputOptions.json) {
          stdout.write(
            JSON.stringify(stats.toJson(outputOptions), null, 2) + "\n"
          );
        } else if (stats.hash !== lastHash) {
          lastHash = stats.hash;
          if (stats.compilation && stats.compilation.errors.length !== 0) {
            const errors = stats.compilation.errors;
            if (errors[0].name === "EntryModuleNotFoundError") {
              console.error(
                "\n\u001b[1m\u001b[31mInsufficient number of arguments or no entry found."
              );
              console.error(
                "\u001b[1m\u001b[31mAlternatively, run 'webpack(-cli) --help' for usage info.\u001b[39m\u001b[22m\n"
              );
            }
          }
          const statsString = stats.toString(outputOptions);
          const delimiter = outputOptions.buildDelimiter
            ? `${outputOptions.buildDelimiter}\n`
            : "";
          if (statsString) stdout.write(`${statsString}\n${delimiter}`);
        }
        if (!options.watch && stats.hasErrors()) {
          process.exitCode = 2;
        }
      }
      if (firstOptions.watch || options.watch) {
        // 如果是watch模式， 执行compiler.watch
        const watchOptions =
          firstOptions.watchOptions ||
          options.watchOptions ||
          firstOptions.watch ||
          options.watch ||
          {};
        if (watchOptions.stdin) {
          process.stdin.on("end", function(_) {
            process.exit(); // eslint-disable-line
          });
          process.stdin.resume();
        }
        compiler.watch(watchOptions, compilerCallback);
        if (outputOptions.infoVerbosity !== "none")
          console.error("\nwebpack is watching the files…\n");
      } else {
        // 如果不是watch模式，执行compiler.run
        compiler.run((err, stats) => {
          if (compiler.close) {
            compiler.close((err2) => {
              compilerCallback(err || err2, stats);
            });
          } else {
            compilerCallback(err, stats);
          }
        });
      }
    }
    processOptions(options);
  });
})();
```

在 webpck-cli 中，首先检查了参数的正确性----> const webpack = require("webpack");----> compiler = webpack(options) ---->如果是 watch 模式， 执行 compiler.watch, 如果不是 watch 模式，执行 compiler.run

### 执行 webpack(options)函数

webpack(options)函数，主要做了下面几件事：

1. compiler = new Compiler()
2. 遍历所有的 Plugin，并对插件初始化，判断 plugin 是否是一个函数,如果是函数执行 call,不是函数执行 plugin 的 apply
3. return compiler

### new Compiler()

new Compiler 做的事很简单，就是初始化各种 hooks。Compiler 继承自 Tapable，Tapable 可以算是 Webpack 的核心和灵魂。

```javascript
// tapable是Webpack的核心，灵魂
const {
	Tapable,
	SyncHook, // 同步串行hook 不关心返回值 就是event bug
	SyncBailHook, // 同步串行hook,只要监听函数有一个返回不为null, 就跳过剩下的
	AsyncParallelHook,// 异步并发Hook
	AsyncSeriesHook // 异步串行hook
} = require("tapable");

class Compiler extends Tapable {
    	constructor(context) {
		super();
		this.hooks = {
			/** @type {SyncBailHook<Compilation>} */
			shouldEmit: new SyncBailHook(["compilation"]),
			/** @type {AsyncSeriesHook<Stats>} */
			done: new AsyncSeriesHook(["stats"]),
			/** @type {AsyncSeriesHook<>} */
			additionalPass: new AsyncSeriesHook([]),
			/** @type {AsyncSeriesHook<Compiler>} */
			beforeRun: new AsyncSeriesHook(["compiler"]),
			/** @type {AsyncSeriesHook<Compiler>} */
			run: new AsyncSeriesHook(["compiler"]),
			/** @type {AsyncSeriesHook<Compilation>} */
			emit: new AsyncSeriesHook(["compilation"]),
			/** @type {AsyncSeriesHook<Compilation>} */
			afterEmit: new AsyncSeriesHook(["compilation"]),

			/** @type {SyncHook<Compilation, CompilationParams>} */
			thisCompilation: new SyncHook(["compilation", "params"]),
			/** @type {SyncHook<Compilation, CompilationParams>} */
			compilation: new SyncHook(["compilation", "params"]),
			/** @type {SyncHook<NormalModuleFactory>} */
			normalModuleFactory: new SyncHook(["normalModuleFactory"]),
			/** @type {SyncHook<ContextModuleFactory>}  */
			contextModuleFactory: new SyncHook(["contextModulefactory"]),

			/** @type {AsyncSeriesHook<CompilationParams>} */
			beforeCompile: new AsyncSeriesHook(["params"]),
			/** @type {SyncHook<CompilationParams>} */
			compile: new SyncHook(["params"]),
			/** @type {AsyncParallelHook<Compilation>} */
			make: new AsyncParallelHook(["compilation"]),
			/** @type {AsyncSeriesHook<Compilation>} */
			afterCompile: new AsyncSeriesHook(["compilation"]),

			/** @type {AsyncSeriesHook<Compiler>} */
			watchRun: new AsyncSeriesHook(["compiler"]),
			/** @type {SyncHook<Error>} */
			failed: new SyncHook(["error"]),
			/** @type {SyncHook<string, string>} */
			invalid: new SyncHook(["filename", "changeTime"]),
			/** @type {SyncHook} */
			watchClose: new SyncHook([]),

			// TODO the following hooks are weirdly located here
			// TODO move them for webpack 5
			/** @type {SyncHook} */
			environment: new SyncHook([]),
			/** @type {SyncHook} */
			afterEnvironment: new SyncHook([]),
			/** @type {SyncHook<Compiler>} */
			afterPlugins: new SyncHook(["compiler"]),
			/** @type {SyncHook<Compiler>} */
			afterResolvers: new SyncHook(["compiler"]),
			/** @type {SyncBailHook<string, Entry>} */
			entryOption: new SyncBailHook(["context", "entry"])
		};
}
```

### lib/webpack.js compiler.run

```javascript
	// 主要做了下面几件事
	// 1. 定义编译过程的回调函数 finalCallback和onCompiled
	// 2. 执行beforeRun勾子，在完成回调中执行 this.compile(onCompiled)方法
	run(callback) {
		// 如果当前编译器已经在跑了，返回error
		if (this.running) return callback(new ConcurrentCompilationError());

		const finalCallback = (err, stats) => {
			this.running = false;

			if (err) {
				this.hooks.failed.call(err);
			}

			if (callback !== undefined) return callback(err, stats);
		};

		const startTime = Date.now();

		this.running = true;

		// 定义onCompiled函数 后续调用
		const onCompiled = (err, compilation) => {
			if (err) return finalCallback(err);

			if (this.hooks.shouldEmit.call(compilation) === false) {
				const stats = new Stats(compilation);
				stats.startTime = startTime;
				stats.endTime = Date.now();
				this.hooks.done.callAsync(stats, err => {
					if (err) return finalCallback(err);
					return finalCallback(null, stats);
				});
				return;
			}
			// 提交资源时
			this.emitAssets(compilation, err => {
				if (err) return finalCallback(err);

				if (compilation.hooks.needAdditionalPass.call()) {
					compilation.needAdditionalPass = true;

					const stats = new Stats(compilation);
					stats.startTime = startTime;
					stats.endTime = Date.now();
					this.hooks.done.callAsync(stats, err => {
						if (err) return finalCallback(err);

						this.hooks.additionalPass.callAsync(err => {
							if (err) return finalCallback(err);
							this.compile(onCompiled);
						});
					});
					return;
				}

				this.emitRecords(err => {
					if (err) return finalCallback(err);

					const stats = new Stats(compilation);
					stats.startTime = startTime;
					stats.endTime = Date.now();
					this.hooks.done.callAsync(stats, err => {
						if (err) return finalCallback(err);
						return finalCallback(null, stats);
					});
				});
			});
		};

		// 执行this.hooks.beforeRun
		this.hooks.beforeRun.callAsync(this, err => {
			if (err) return finalCallback(err);

			this.hooks.run.callAsync(this, err => {
				if (err) return finalCallback(err);

				this.readRecords(err => {
					if (err) return finalCallback(err);

					// 执行编译方法，并把onCompiled传进去
					this.compile(onCompiled);
				});
			});
		});
	}
```

### this.compile(onCompiled)

```javascript
	// compile主要做了下面几件事
	// 1. 执行beforeCompile勾子
	// 2. 创建compilation，在compilation中完成chunk分析，创建chunkjs
	// 3. Parser解析chunk，分析module/dependency，管理代码模块之间依赖关系
	// 4. 使用template基于compilation结果生成结果代码
	compile(callback) {
		const params = this.newCompilationParams();
		// 1. 执行beforeCompile勾子
		this.hooks.beforeCompile.callAsync(params, err => {
			if (err) return callback(err);

			// 执行hooks.compile的call方法 其实就是执行一个函数的call方法
			this.hooks.compile.call(params);

			// 创建compilation， 代表了每一次的编译流程
			// 它会基于配置开始创建chunk
			const compilation = this.newCompilation(params);

			this.hooks.make.callAsync(compilation, err => {
				if (err) return callback(err);

				compilation.finish(err => {
					if (err) return callback(err);

					compilation.seal(err => {
						if (err) return callback(err);

						this.hooks.afterCompile.callAsync(compilation, err => {
							if (err) return callback(err);
							// 编译完成执行完成回调
							return callback(null, compilation);
						});
					});
				});
			});
		});
	}
```

### loader 原理

Webpack 各个 loader 之间联系是这样的，file -> ast -> 处理完把处理的 file 内容 下一个 loader， 每个 loader 里 file 转 ast 的过程其实是浪费时间的。

webpack 中配置的 Loader 是按相反的顺序执行的，最后的 loader 最早调用，传入原始的资源内容（可能是代码，也可能是二进制文件，用 buffer 处理），第一个 loader 最后调用，期望返回的是 JS 代码和 sourceMap(可选)对象，中间的 loader 执行时传入的是上一个 loader 执行的结果。

还有一个场景是 Loader 中的异步处理，有一些 loader 在执行过程中可能依赖于外部 I/O 的结果，导致它必须用异步的方式来处理，这时候需要在 loader 执行时使用 this.async() 来表示该 loader 是异步处理的。然后使用 this.callback 来返回 loader 处理结果。不能自己写异步的处理方式，webpack 不支持。

1. 如何编写自定义 Loader
   以自定义 babelloader 为例

```javascript
//babel-index.js

// 手写babel-loader

"use strict";

const loaderUtils = require("loader-utils");
const acorn = require("acorn"); // 一个好用的转ast的工具
const walk = require("acorn-walk");
const MagicString = require("magic-string");

module.exports = function(context) {
  console.log("前置勾子--->", this.data.value);
  const options = loaderUtils.getOptions(this);
  console.log("options--->", options);
  const ast = acorn.parse(context);
  console.log(ast);
  const code = new MagicString(context);

  walk.simple(ast, {
    VariableDeclaration(node) {
      console.log("node--->", node);
      const { start } = node;
      // 把所有的const 替换为var
      code.overwrite(start, start + 5, "var");
    },
  });
  return code.toString();
};

module.exports.pitch = function(r, p, data) {
  data.value = "前置勾子";
};

//webpack.config.js
const path = require("path");
module.exports = {
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: path.resolve("./loader/babel-index.js"),
          options: {
            data: "我是自定义配置",
          },
        },
      },
    ],
  },
};
```

### AST

AST 是抽象语法树(Abstract Syntax Tree)的缩写，它是源代码的抽象语法结构的树状表现形式。树上的每个节点都表示源代码中的一种结构。之所以说语法是抽象的，是因为这里的语法并不会表示出真实语法中出现的每个细节。

Webpack 提供的一个很大的遍历就是能将所有的资源整合成模块，不仅仅是 js 稳健。所以需要一些 Loader,比如 url-loader 等等来让我们可以直接在源文件中引用各类资源。最后调用 acorn()解析经 loader 处理后的源文件，生成抽象语法树。 不同的 AST 处理器生成的 AST 会不太一样。大体遵循以下格式:

```javascript
type: 描述该语句的类型 -- 例如是变量声明的语句
kind: 变量声明的关键字 -- var
declaration: 声明的内容数组，里面的每一项也是一个对象
    type: 描述该语句的类型
    id: 描述该名称的对象
    init 初始化变量值得对象

// 一个真实的
Node {
  type: 'VariableDeclaration',
  start: 109,
  end: 128,
  declarations: [
    Node {
      type: 'VariableDeclarator',
      start: 115,
      end: 127,
      id: [Node],
      init: [Node]
    }
  ],
  kind: 'const'
}

```

### Webpack 整体运行流程总结

1. Compiler 是 webpack 的运行入口，compiler 对象代表了完整的 webpack 环境配置。这个对象在启动 Webpack 时被第一次建立，并配置好所有可操作的设置，包括 options,loader 和 plugin。当在 webpack 环境中应用一个插件时，插件将接收到此 compiler 对象的引用，可以使用它来访问 webpack 的主环境
2. Compilation 对象代表了一次资源版本构建，当运行 webpack 开发环境中间件时，每当检测到一个文件编号，就会创建一个新的 compilation,从而生成一组新的编译资源，一个 compilation 对象表现了当前的模块资源、编译生成的资源、变化的文件以及被跟踪依赖的状态信息。compilation 对象也提供了很多关键步骤的回调，以供插件做自定义处理时选择使用
3. Chunk， 用于表示 chunk 的类，对于构建时需要的 chunk 对象由 Compilation 创建后保存管理
4. Module。用于表示代码模块的基础类，衍生出很多子类用于处理不同的情况，关于代码模块的所有信息都会存在 module 实例中，例如 dependencies 记录代码模块的依赖等

当一个 Module 实例被创建后，比较重要的是 compilation.buildModule 方法，它会调用 Module 实例的 build 方法来创建 Module 实例需要的一些东西，然后调用自身的 runLoaders 方法。runLoaders: loader-runner， 将代码源码内容一一交由配置中指定的 loader 处理后，再把处理的结果保存起来

5. Parser。其中相对复杂的一部分，基于 acorn 来分析 AST 语法树，解析出代码模块的依赖
6. Dependency, 解析时用于保存代码模块对应的依赖使用的对象。Module 实例的 build 方法在执行完对应的 Loader 时，处理完模块代码自身的转换后，继续调用 Parser 的实例来解析自身依赖的模块，解析后的结果存放在 module.dependencies 中。首先保存的是依赖的路径，后续会经由 compilation.processModuleDependencies 方法，处理各个依赖的模块，递归地建立整个依赖
7. Template, 生成最终的代码要使用到的代码模板。

webpack 的勾子按一下顺序执行

entry-option -> run -> make -> before-resolve -> build-module -> normal-module-loader(将 Loader 加载完成的 module 进行编译，生成 AST 树) -> program -> seal -> emit
