# 项目
这节会把一些项目中用到的技术点总结出来。

## type=module
有了babel这个工具之后，可以尽情的写js最新的语法，通过babel编译后可以让代码在不支持新语法的浏览器上也能正常运行。但是这里一个常见的不友好的地方是不管三七二十一，把所有js全部用babel编译，这样在支持新语法的浏览器上跑得仍然是es5之前的代码，浪费了性能。那么我们应该怎么做呢？

使用script的type属性。

```javascript
    //阻止支持module但不支持nomodule时加载两次的问题
    <script>
        (function () {
            var check = document.createElement('script');
            if (!('noModule' in check) && 'onbeforeload' in check) {
                var support = false;
                document.addEventListener('beforeload', function (e) {
                    if (e.target === check) {
                        support = true;
                    } else if (!e.target.hasAttribute('nomodule') || !support) {
                        return;
                    }
                    e.preventDefault();
                }, true);

                check.type = 'module';
                check.src = '.';
                document.head.appendChild(check);
                check.remove();
            }
        }());
    </script>

    <script type="module">
        import("./scripts/data.js").then((_) => {
            console.log(_.default)
        })
    </script>
    <script nomodule src="https://cdn.staticfile.org/systemjs/6.3.3/system.js"></script>
    <script nomodule>
        // 1.支持module 支持nomodule
        // 2.支持module 不支持nomodule xx 代码会执行2次
        // 3.不支持module 不支持nomodule 下面
        System.import("./scripts/data_bundle.js").then((_) => {
            console.log(_.default)
        });
    </script>

```
那在项目中如何打出这样的两份代码？答案是用webpack，一份用webpack不带babel编译，一份带babel编译。然后把不支持nomodule的代码动态插入到模板的头里面。

### webpack怎么配置


## 兼容Android5.0的配置
- display grid
- overflow:auto

- babel配置


```javascript
{
  "presets": [
    ["@babel/preset-react"],
    [
      "@babel/preset-env",
      { "targets": { "android": "4.4.1" }, "modules": false }
    ]
  ],
  "plugins": [
    "@babel/plugin-syntax-dynamic-import",
    ["@babel/plugin-proposal-decorators", { "legacy": true }],
    ["@babel/plugin-proposal-class-properties", { "loose": true }],
    "@babel/plugin-transform-runtime",
    ["import", { "libraryName": "antd-mobile", "style": "css" }] // `style: true` 会加载 less 文件
  ]
}


```

## 热部署

## Webpack5升级问题
1. 默认输出的是es6语法的js，需要配置 target:['web', 'es5']，兼容低版本
2. 解决打包mjs库文件报错
```javascript
    rules: [
      {
        test: /\.m?js/,
        resolve: {
          fullySpecified: false,
        },
      },
```

3. 单独抽取assets
```javascript
  module: {
    {
        test: /\.(png|jpg|jpeg|gif|eot|woff|woff2|ttf|svg|otf)$/,
        type: 'asset',
      }, 
  }
  experiments: {
    asset: true,
  },
```



