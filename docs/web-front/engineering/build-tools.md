# 构建工具

前端打包构建主要用 webpack。下面分别介绍一下手配过程中的一些关键点。
webpack5 简化了很多配置，但是还没有正式发版，本文还是基于 webpack4 来配置。

## webpack

### 打包脚本配置

正常打包脚本配置在 package.json 的 scripts 属性内。当脚本变多时，将会变得"又丑又长"。如何使打包的脚本变得更加简洁强大？
这里要使用两个库，一个是`scripty`。scripty 会找到项目根目录 /scripts/目录下的 shell 文件，执行相应的命令。通过它可以简化 scripts 配置，同时让脚本可以执行 shell 命令，也可以做更多事情。还有一个库是`npm-run-all`。`npm-run-all`顾名思义，可以让我们串行或者并行执行 npm 命令。一个项目的通用配置可以如下：

```javascript
//package.json
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "client:dev": "scripty",
    "client:devServer": "scripty",
    "client:prod": "scripty",
    "server:dev": "scripty",
    "server:start": "scripty",
    "build": "npm-run-all --parallel client:prod server:prod",
    "build:dev":"npm-run-all --parallel client:dev server:dev"
  },

```

### 分离 webpack.config 为 dev 和 prod

dev 开发环境时，我们为了让打包更快，会省略掉一些压缩合并的操作。但是在生产环境，我们是需要压缩合并的。因此要做 config 分离。
这里用到的库是`webpack-merge`

例：

```javascript
//webpack.config.js
const { merge } = require("webpack-merge");

const argv = require("yargs-parser")(process.argv.slice(2));
const _mode = argv.mode || "development";
const _modeflag = _mode === "production" ? true : false;
//找到对应环境的webpack.config.js文件
const _mergeConfig = require(`./config/webpack.${_mode}.js`);
//...

module.exports = merge(webpackConfig, _mergeConfig);
```

### 多环境打包

webpack 默认只能打 development 和 production 两种环境的包，在实际开发过程中我们可能还需要打出测试环境的包，或者别的自定义环境的包。要实现这个功能，需要用到 webpack 的 DefinePlugin 插件，再配合 cross-env 实现。

首先在 webpack.config.js 中配置打包的插件。这个插件可以在编译时将 process.env.NODE_ENV 动态替换为我们定义的变量。

```javascript
//webpack.config.js
const webpack = require("webpack");

...

module.exports = {
  plugins:[
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    }),
  ]
}
```

然后，配置打包脚本

```javascript
//开发环境
  cross-env NODE_ENV=development webpack
//测试环境
  cross-env NODE_ENV=test webpack

```

### 自定义插件

项目使用的模板引擎是 koa-swig 模板引擎。正常使用 html-webpack-plugin 打包之后，js 插入的位置如下：

```javascript
{% extends '@layouts/layout.html' %} 
{% block title %} 首页 {%endblock%} 
{% block head %} {% endblock %} 
{% block content %} {% include "@components/home/home.html" %} {% endblock %} 
{% block scripts %}{% endblock %}
<script src="/scripts/runtime.bundle.js"></script><script src="/scripts/index-home.bundle.js"></script>

```
很明显，js插入的位置错误了，本来应该放在block scripts标签里面的，现在插入到了最后。为了解决这个问题，需要在webpack编译的过程动态的替换掉注入的css和js。

解决步骤：
1. 在模板中定义魔法字符串
```javascript
{% extends '@layouts/layout.html' %} 

{% block title %} 首页 {%endblock%} 
{% block head %}
<!--injectcss-->
{% endblock %} 
{% block content %} 
{% include "@components/home/home.html" %}

{% endblock %} 

{% block scripts %}
<!--injectjs-->
{% endblock %}

```
`<!--injectcss-->`和 `<!--injectjs-->`是我们定义的魔法字符串，用于后面动态替换。

2. 设置html-webpack-plugin不注入css和js
```javascript
    _plugins.push(
      new HtmlWebpackPlugin({
        filename: `../views/${dist}/pages/${template}.html`,
        template: `src/web/views/${dist}/pages/${template}.html`,
        chunks: ['runtime', entryKey],
        inject: false,//放弃自动插入css js，因为自动插入位置不对
        minify: {
          removeComments: false,
          collapseWhitespace: true,
        },
      })

```

3. 自定义打包插件`HtmlAfterPlugin`
首先来看下html-webpack-plugin给我们提供的勾子
![](https://github.com/jantimon/html-webpack-plugin/blob/master/flow.puml)
'
- `beforeAssetTagGeneration` 。走到这个勾子html-webpack-plugin已经为我们编译好了模板，并且把资源文件 js和css找到了
- `alterAssetTags`。 到这个勾子，已经创建好了script 样式和meta标签。
- `alterAssetTagGroups`。到这个勾子，已经将所有的标签按插入的位置分好组。
- `afterTemplateExecution`。到这个勾子，提交分组标签，执行完模板编译。
- `beforeEmit`。到这个勾子，已经生成html，并插入了js、css等标签。
- `afterEmit`。将生成的文件保存到本地。

由于我们禁用了webpack的自动inject。因此步骤5、6、10不会执行。我们只需要在beforeAssetTagGeneration后将找到的js css保存下来，在berforeEmit的时候动态插入到生产的html中。这个插件实现如下：

```javascript
const HtmlWebpackPlugin = require('html-webpack-plugin');
const pluginName = 'HtmlAfterPlugin';

const assetsHelp = (data) => {
  const js = [];
  const css = [];
  const getAssetsName = {
    css: (item) => `<link rel="stylesheet" href="${item}">`,
    js: (item) => `<script class="lazyload-js" src="${item}"></script>`,
  };
  for (let jsitem of data.js) {
    js.push(getAssetsName.js(jsitem));
  }
  for (let cssitem of data.css) {
    css.push(getAssetsName.css(cssitem));
  }
  return {
    js,
    css,
  };
};

class HtmlAfterPlugin {
  constructor() {
    this.jsarr = [];
    this.cssarr = [];
  }
  apply(compiler) {
    compiler.hooks.compilation.tap(pluginName, (compilation) => {
      HtmlWebpackPlugin.getHooks(compilation).beforeAssetTagGeneration.tapAsync(
        pluginName,
        (htmlPligunData, cb) => {
          const { js, css } = assetsHelp(htmlPligunData.assets);
          this.cssarr = css;
          this.jsarr = js;
          cb(null, htmlPligunData);
        }
      );
      HtmlWebpackPlugin.getHooks(compilation).beforeEmit.tapAsync(
        pluginName,
        (data, cb) => {
          let _html = data.html;
          _html = _html.replace('<!--injectjs-->', this.jsarr.join(''));
          _html = _html.replace('<!--injectcss-->', this.cssarr.join(''));
          _html = _html.replace(/@components/g, '../../../components');
          _html = _html.replace(/@layouts/g, '../../layouts');
          data.html = _html;
          cb(null, data);
        }
      );
    });
  }
}

module.exports = HtmlAfterPlugin;

```

4. 在webpack中配置plugin
```javascript
  //webpack.config.js
  plugins:[
    new HtmlWebpackPlugin(),

    ...

    //放在HtmlWebpackPlugin的后面
    new HtmlAfterPlugin(),

  ]
```

## webpack打包Node端
做react isomorphic的时候，需要用到webpack为我们生成Node端的代码。打node端代码时有几个特别注意的点：

1. target设置
target一定要设置为node端。
```javascript
//webpack.server.js

  module.exports = {
      target: "node",
  }

```

2. 如果打包的组件，要设置libraryTarget
```javascript
  module.exports = {
    output: {
      path: path.resolve(__dirname, "dist/"),
      filename: "server.bundle.js",
      libraryTarget: "umd",
    },
  }

```

3. 如果使用了__dirname需要配置node选项，避免路径问题

```javascript
  module.exports = {
    node: {
      __dirname: false,
      __filename: false
    },
  }

```

我的一份完整的配置
```javascript
// webpack.server.js
const path = require("path");
const merge = require("webpack-merge");
const nodeExternals = require("webpack-node-externals");
const TerserPlugin = require("terser-webpack-plugin");
const { join, resolve } = require("path");
const postcssNormalize = require('postcss-normalize');
const webpack = require("webpack");

const serverConfig = {
  target: "node",
  entry: path.resolve("./src/server/app.js"),
  output: {
    path: path.resolve(__dirname, "dist/"),
    filename: "server.bundle.js",
    libraryTarget: "umd",
  },
  plugins:[
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    })
  ],
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif|svg)$/,
        use: [
          {
            loader: "url-loader",
          },
        ],
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: "css-loader",
            options: {
              importLoaders: 1,
            },
          },
          {
            // Options for PostCSS as we reference these options twice
            // Adds vendor prefixing based on your specified browser support in
            // package.json
            loader: require.resolve('postcss-loader'),
            options: {
              // Necessary for external CSS imports to work
              // https://github.com/facebook/create-react-app/issues/2677
              ident: 'postcss',
              plugins: () => [
                require('postcss-flexbugs-fixes'),
                require('postcss-preset-env')({
                  autoprefixer: {
                    flexbox: 'no-2009',
                  },
                  stage: 3,
                }),
                // Adds PostCSS Normalize as the reset css with default options,
                // so that it honors browserslist config in package.json
                // which in turn let's users customize the target behavior as per their needs.
                postcssNormalize(),
              ],
              sourceMap: false,
            },
          }
        ],
      },

      {
        test: /\.js$/,
        enforce: "pre",
        use: {
          loader: "babel-loader",
          options: {
            cacheDirectory: false,
            presets: ["@babel/preset-env", "@babel/preset-react"],
            plugins: [

              "@babel/plugin-proposal-class-properties",
              [
                "@babel/plugin-proposal-decorators",
                {
                  legacy: true,
                },
              ]
            ],
          },
        },
        exclude: /(node_modules|bower_components)/,
      },
    ],
  },

  //   optimization: {
  //     minimize: true,
  //     minimizer: [
  //         new TerserPlugin({
  //             parallel: 4, // 开启几个进程来处理压缩，默认是 os.cpus().length - 1
  //         }),
  //     ],
  // },
  // 避免把 node_Modules 打包进去
  externals: [nodeExternals()],
  resolve: {
    alias: {
      "^": resolve("src/webapp"),
      "@": resolve("src/webapp/components")

    },
  },
  node: {
    __dirname: false,
    __filename: false

  },
};

module.exports = serverConfig;
```