# Webpack4优化
Webpack5更新之后，有很多Webpack4的优化框架已经帮我们做了。这里记录一下Webpack4的优化手段。

- terser-webpack-plugin 压缩JS 官方维护
- optimizi-css-assets-webpack-plugin CSS多核压缩 配合cssnano很好用
- speed-measure-webpack-plugin 打包速度分析
- progress-bar-webpack-plugin 打包进度提示
- hard-source-webpack-plugin 对整个工程开启缓存 已经不维护了  被webpack5集成了其优秀特性
- webpack-bundle-analyzer 可视化包分析
- optimization 配置
  
  ```javascript
    optimization: {
    runtimeChunk: {
      name: 'runtime',
    },
    splitChunks: {
      chunks: 'async',
      minSize: 30000,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      name: false,
      cacheGroups: {
        commons: {
          chunks: 'initial',
          minChunks: 2,
          maxInitialRequests: 5,
          minSize: 0,
          name: 'commons',
        },
      },
    },
  },
  
  ```
  - cache-loader 哪里慢就放哪里。
  ```javascript
    module:{
        rules:[
        {
        test: /\.css$/i,
        use: [
          'cache-loader',
          MiniCssExtractPlugin.loader,
          { loader: 'css-loader', options: { importLoaders: 1 } },
          'postcss-loader',
        ],
      },
        ]
    }

  ```
  - externals 将通用库排除。可以极大的提升速度。
- image-webpack-loader 压缩图片
- htmp-webpack-plugin推荐压缩选项
  ```javascript
        new HtmlWebpackPlugin({
        filename: `../views/${dist}/pages/${template}.html`,
        template: `src/web/views/${dist}/pages/${template}.html`,
        chunks: ['runtime', entryKey],
        inject: false,
        minify: {
          removeComments: false,
          collapseWhitespace: true,
        },
      })
  
  ```

- @babel/plugin-syntax-dynamic-import 动态引入

- 集群编译。多页可以根据entry拆，单页根据组件拆。

工程化
- lerna
- snowpack
- gulp
- rome typescript
- brunch
- friendly-errors-webpack-plugin
- node-bash-title 改bash窗口title
- set-iterm2-badge
- webpack-build-notifier 发通知
- 使用动态polyfill
  尽量不用babel的polyfill
  <script src="https://cnd.polyfill.io/v2/polyfill.min.js?features=Map,Set"></script>
  它会根据浏览器的UA头，判断是否支持某些特性，从而返回一个合适的polyfill
  - type = module
  - 集成到CI 监控⽂件的⼤⼩ https://github.com/siddharthkp/bundlesize
