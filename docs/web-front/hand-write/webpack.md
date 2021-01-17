# 手写 Webpack

Webpack 几个核心的类， Compile, Compilation, Parser。主要实现这几个类

1. 配置自己的 webpack.config.js mypack.config.js

```javascript
const { join } = require("path");
const ConsoleLogOnBuildWebpackPlugin = require("./plugins/ConsoleLogOnBuildWebpackPlugin");
module.exports = {
  entry: join(__dirname, "./src/index.js"),
  output: {
    path: join(__dirname, "./dist"),
    filename: "main.js",
  },
  plugins: [new ConsoleLogOnBuildWebpackPlugin()],
};
```

2. 创建 pack 库的 index.js

```javascript
const Compiler = require("./Compiler");
const options = require("../mypack.config");
const plugins = options.plugins;
const compiler = new Compiler(options);
for (const plugin of plugins) {
  plugin.apply(compiler);
}
compiler.run();
```

3. 创建 Compiler
   通过源码分析我们知道外面是通过 compile.run 方法进来的

```javascript
const { SyncHook } = require("tapable");
const Compilation = require("./Compilation");
class Compiler {
  constructor(options) {
    this.hooks = {
      run: new SyncHook(["compilation"]),
    };
    this.modules = [];
    this.options = options;
  }
  run() {
    const onCompiled = (err, compilation) => {};
    this.compile(onCompiled);
  }
  compile(callback) {
    const compilation = this.newCompilation();
    // 执行插件
    this.hooks.run.call(compilation);
    //通过得到入口的文件
    const entryMoudle = compilation.buildModule(this.options.entry, true);
    this.modules.push(entryMoudle);
    this.modules.map((_module) => {
      _module.dependencies.map((dependency) => {
        // console.log('✨', _module);
        this.modules.push(compilation.buildModule(dependency, false));
      });
    });
    compilation.emitFiles();
  }
  createCompilation() {
    return new Compilation(this);
  }

  newCompilation() {
    const compilation = this.createCompilation();
    // this.hooks.compilation.call(compilation, params);
    return compilation;
  }
}
module.exports = Compiler;
```

3. 完成 Compilation

```javascript
const { SyncHook } = require("tapable");
const { join } = require("path");
const Parser = require("./Parser");
const { writeFileSync } = require("fs");
class Compilation {
  constructor(compiler) {
    const { options, modules } = compiler;
    //webpack的配置
    this.options = options;
    this.modules = modules;
  }
  seal() {
    this.buildModule();
  }
  buildModule(fileName, isEntry) {
    let ast = "";
    let absoutPath = "";
    if (!isEntry) {
      absoutPath = join(process.cwd(), "./src/", fileName);
      ast = Parser.ast(absoutPath);
    } else {
      ast = Parser.ast(fileName);
    }
    const dependencies = Parser.getDependency(ast);
    const transformCode = Parser.transform(ast);
    return {
      fileName,
      dependencies,
      transformCode,
    };
  }
  emitFiles() {
    let _modules = "";
    const outputPath = join(
      this.options.output.path,
      this.options.output.filename
    );
    this.modules.map((_module) => {
      _modules += ` '${_module.fileName}': function (module, exports, require) {
        ${_module.transformCode}
      },`;
    });
    const template = `(function (modules) {
      var installedModules = {};
      function __webpack_require__(moduleId) {
        // Check if module is in cache
        if (installedModules[moduleId]) {
          return installedModules[moduleId].exports;
        }
        // module.exports = {};
        //构建一个新的模块化规范 并 将moduleId放入缓存
        var module = (installedModules[moduleId] = {
          exports: {},
        });
        modules[moduleId].call(
          module.exports,
          module,
          module.exports,
          __webpack_require__
        );
        //小心机
        return module.exports;
      }
      return __webpack_require__('${this.options.entry}');
    })({
     ${_modules}
    });
    `;
    console.log("🐻", outputPath);
    writeFileSync(outputPath, template, "utf-8");
  }
}
module.exports = Compilation;
```

4. 处理 Parser

```javascript
const babylon = require("babylon");
const traverse = require("babel-traverse").default;
const { transformFromAst } = require("@babel/core");
const fs = require("fs");
class Parser {
  static ast(path) {
    const content = fs.readFileSync(path, "utf-8");
    return babylon.parse(content, {
      sourceType: "module",
    });
  }
  static getDependency(ast) {
    const dependencies = [];
    traverse(ast, {
      ImportDeclaration: ({ node }) => {
        dependencies.push(node.source.value);
      },
    });
    return dependencies;
  }

  static transform(ast) {
    const { code } = transformFromAst(ast, null, {
      presets: ["@babel/preset-env"],
    });
    return code;
  }
}
module.exports = Parser;
```
