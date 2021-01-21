# Webpack5 方案

使用 learn 管理所有的包，并进行统一的 build。

例子：假设有两个应用，app1 和 app2

## app2

将我们想对外暴露的包，暴露出去

```javascript
// webpack.config.js
// module federation
const ModuleFederationPlugin = require("webpack").container
  .ModuleFederationPlugin;
const HtmlWebpackPlugin = require("html-webpack-plugin");
/**
 *  @type {import ('webpack').Configuration)}
 */
module.exports = {
  mode: "development",
  output: {
    publicPath: "http://localhost:3002/",
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-react"],
          },
        },
      },
    ],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "app2",
      library: { type: "var", name: "app2" },
      exposes: {
        "./Button": "./src/Button",
      },
      filename: "remoteEntry.js",
      // shared: ['react', 'react-dom'],
      shared: {
        react: {
          singleton: true,
          eager: true,
        },
        "react-dom": {
          singleton: true,
          eager: true,
        },
      },
    }),
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
  ],
};
```

在 app1,在 webpack 定义引入外部的包

```javascript
// module federation
const ModuleFederationPlugin = require("webpack").container
  .ModuleFederationPlugin;
const HtmlWebpackPlugin = require("html-webpack-plugin");
/**
 *  @type {import ('webpack').Configuration)}
 */
module.exports = {
  mode: "development",
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-react"],
          },
        },
      },
    ],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "app1",
      library: { type: "var", name: "app1" },
      remotes: { app2: "app2" },
      shared: {
        react: {
          singleton: true,
          eager: true,
        },
        "react-dom": {
          singleton: true,
          eager: true,
        },
      },
    }),
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
  ],
};
```

然后在 app1 中就可以用了

```javascript
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>🐻 项目一</title>
    <script src="http://localhost:3002/remoteEntry.js"></script>
  </head>
  <body>
    <h1>独立的APP1</h1>
    <hr />
    <div id="root"></div>
  </body>
</html>

const RemoteButton = lazy(() => import("app2/Button"));

const APP = () => {
  <Suppense>
    <RemoteButton />
  </Suppense>;
};
export default APP;
```

## 疑问

1. 如何做到 CSS 隔离?
2. 如何处理生命周期？
