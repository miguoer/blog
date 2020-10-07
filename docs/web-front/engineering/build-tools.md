# 构建工具
前端打包构建主要用webpack，Node端的用Gulp构建。下面分别介绍一下手配过程中的一些关键点。
webpack5简化了很多配置，但是还没有正式发版，本文还是基于webpack4来配置。

## webpack
### 打包脚本配置
正常打包脚本配置在package.json的scripts属性内。当脚本变多时，将会变得"又丑又长"。如何使打包的脚本变得更加简洁强大？
这里要使用两个库，一个是`scripty`。scripty会找到项目根目录 /scripts/目录下的shell文件，执行相应的命令。通过它可以简化scripts配置，同时让脚本可以执行shell命令，也可以做更多事情。还有一个库是`npm-run-all`。`npm-run-all`顾名思义，可以让我们串行或者并行执行npm命令。一个项目的通用配置可以如下：

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

### 分离webpack.config为dev和prod
dev开发环境时，我们为了让打包更快，会省略掉一些压缩合并的操作。但是在生产环境，我们是需要压缩合并的。因此要做config分离。
这里用到的库是`webpack-merge`

例：
```javascript
//webpack.config.js
const { merge } = require('webpack-merge');

const argv = require('yargs-parser')(process.argv.slice(2));
const _mode = argv.mode || 'development';
const _modeflag = _mode === 'production' ? true : false;
//找到对应环境的webpack.config.js文件
const _mergeConfig = require(`./config/webpack.${_mode}.js`);
//...

module.exports = merge(webpackConfig, _mergeConfig);

```
### 多entry打包
