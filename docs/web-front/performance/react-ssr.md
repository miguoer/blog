# React Isomorphic

所谓同构，就是一个 web 应用在浏览器端和 Node 端共用一套代码。同构直出可以加快首屏渲染速度，提供友好的 SEO。

既然我们已经有了服务端渲染，为什么还需要同构？这是因为，传统 MPA 应用的服务端渲染每次切页都会重新加载资源，并且 html 标签先回来，再由客户端去请求加载 js 等资源，虽然可见但不一定可操作。

接到同构任务时，一开始觉得这东西既然 react 官方已经提供了解决方案，应该不会太难。但是实际重构的过程却是非常难受的。下面是这次重构过程的总结。

## 项目使用的主要框架

- webpack
- react
- react-router
- redux
- styled-components
- @material-ui
- koa
- koa-router
- koa-swig

## 同构需要解决的问题

- webpack改造
- 组件同构
- 样式同构
- 路由同构
- 数据同构

## webpack改造
webpack改造这部分和项目相关系太大。我们项目是MPA的，主要工作是把多页变成同构应用，最终把组件都打到一个html中去。服务端用的gulp打包，也用了一些ioc框架。用gulp打包会遇到组件依赖问题，用webpack打包ioc会报错，没有找到好的解决办法，于是重构了一下路由，把ioc去掉了。有时间还是需要继续看看这块怎么把ioc保留。最终的方案是，服务端去掉ioc全部用webpack打包，打成一个server.bundle.js。用Node启动这个server.bundle.js。

接下来来看下组件同构。

## 组件同构

组件同构要解决的问题是在服务端将我们编写的 jsx 或者 tsx 组件渲染出来，再塞到模板里吐回给客户端。
这部分 react 官方已经给出解决方案，只需要使用 react-dom/server 提供的 renderToString 方法，就可以将 react 组件渲染成字符串。代码如下：

```javascript
//server端
import { renderToString } from "react-dom/server";
import routes from "../webapp/shared/Routes";
import XXXApp from "../webapp/shared/XXXApp";//y应用主路由入口
const router = new Router();
router.get(CONTROLLER_PATH, async (ctx, next) => {
    const isomorphicBody = renderToString(
        <StaticRouter location={ctx.req.url}>
            <XXXApp></XXXApp>
        </StaticRouter>)
}

//client端 入口
ReactDOM.hydrate(<BrowserRouter>
          <XXXApp></XXXApp>
        </BrowserRouter>, document.querySelector("#app-root"));
```

### 处理静态资源

一开始项目是用的 gulp 打包服务端代码，如果按 react 官方推荐的这种写法，编译之后运行会报错。因为我们组件中可能会引入了图片资源，如果没有配置 gulp 不认识这些资源。

解决办法就是用 webpack 先把<XXXApp />这个组件编译成一个 node 端的 js 组件。这种办法到目前为止是能解决我们的问题，但是在后续的同构步骤中会发现这种办法不能解决所有问题。这部分后面再介绍。

### DOM API

组件同构过程中还会碰到的一个问题就是组件中如果用了 window、document、fetch 这些 DOM API 时，启动服务端服务会报错。这是因为服务端没有这些 API。

解决办法就是判断代码的执行环境，如果是 Node 端就不使用或者加载这些 DOM API。

```javascript
export function isNode() {
  return typeof window === "undefined";
}

if (!isNode()) {
  const { $APP } = window;
}
```

## 样式同构

样式同构是碰到的比较头疼的问题。我们用的是 styled-components, styled-component 官方给我们提供了一套服务端渲染的机制。
于是，一顿操作：

```javascript
//server端
import { ServerStyleSheet } from "styled-components";
// ... 省略代码
router.get(CONTROLLER_PATH, async (ctx, next) => {
    const styleSheets = new ServerStyleSheet();
    styleSheets.collectStyles(
        <StaticRouter location={ctx.req.url}>
          <XXXApp></XXXApp>
        </StaticRouter>
  );

  const styles = styleSheets.getStyleTags();

  var html = await ctx.render("xxxapp/pages/index");//拿到html模板

  if (html.indexOf("<!-- IsmorphicInjectCSS -->") != -1) {
    html = html.replace("<!-- IsmorphicInjectCSS -->", styles);//动态替换css
  }

  // ... 省略代码
    ctx.body = html;
}
```

打包编译重新启动服务之后，样式确实已经出来了。然而，定睛一看，有部分样式仍然很奇怪。进入代码查看这些样式有什么不一样的地方，发现了一个问题，所有出问题的地方都使用了@material-ui 组件。我们知道 material-ui 本身也是基于 styled-components，使用了其中很多的特性。大胆的猜想，styled-components 的服务端渲染方案对 material-ui 并不适用。于是去 material-ui 官网查找服务端渲染方案。([@material-ui 服务端渲染方案](https://material-ui.com/zh/guides/server-rendering/))。

material-ui 官方提供了一套类似 styled-components 的服务端渲染方案：

```javascript
import { ServerStyleSheets, ThemeProvider } from "@material-ui/core/styles";
function handleRender(req, res) {
  const sheets = new ServerStyleSheets();

  // 将组件渲染成字符串。
  const html = ReactDOMServer.renderToString(
    sheets.collect(
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    )
  );

  // 从 sheet 中抓取 CSS。
  const css = sheets.toString();

  // 将渲染的页面发送回客户端。
  res.send(renderFullPage(html, css));
}
```

既然 styled-components 的服务端渲染方案无法兼容 material-ui，那 material-ui 的方案可以兼容 styled-components 吗？遗憾的是，一顿操作之后，发现还是 Too Young。

styled-components 的服务端渲染给我们提供了一个返回 styledComponents 的方法，根据这个继续大胆猜想，那如果先用 styled-components 处理一遍，把返回的组件再交给 material-ui 呢？所幸，这个方法完美运行：

```javascript
// server

import { ServerStyleSheets, ThemeProvider } from "@material-ui/core/styles";
import { ServerStyleSheet } from "styled-components";
const router = new Router();

// ...
router.get(CONTROLLER_PATH, async (ctx, next) => {
      var html = await ctx.render("XXXApp/pages/index");//获取到html模板

  const sheet = new ServerStyleSheets();
  const styleSheets = new ServerStyleSheet();
  styleSheets.collectStyles(
        <StaticRouter location={ctx.req.url}>
          <XXXApp></XXXApp>
    </StaticRouter>
  );

const isomorphicBody = renderToString(
    sheet.collect(styleSheets.getStyleElement())
  );

  const styles = sheet.toString();
  if (html.indexOf("<!-- IsmorphicInjectCSS -->") != -1) {
    var injectCss = `<style id="jss-server-side">${styles}</style>`;
    html = html.replace("<!-- IsmorphicInjectCSS -->", injectCss);
  }
  if (html.indexOf("<!-- IsmorphicInject -->") != -1) {
    html = html.replace("<!-- IsmorphicInject -->", isomorphicBody);
  }
  ctx.body = html;
}

```

如果组件中引入了第三方的css库，可以判断运行环境，Node端不加载，浏览器端再加载。但要用require加载。
```javascript
//一个轮播组件.js
import {isNode} from '../utils/BrowserUtil';

if(!isNode()) {
  require("react-responsive-carousel/lib/styles/carousel.min.css");
}
```

## 路由同构
使用react-router官方提供的同构方案即可。
```javascript
//server
router.get(CONTROLLER_PATH, async (ctx, next) => {
      var html = await ctx.render("XXXApp/pages/index");//获取到html模板

  const sheet = new ServerStyleSheets();
  const styleSheets = new ServerStyleSheet();
  styleSheets.collectStyles(
        <StaticRouter location={ctx.req.url}>
          <XXXApp></XXXApp>
    </StaticRouter>
  );
   // ...
}

//client
ReactDOM.hydrate(<BrowserRouter>
          <XXXApp></XXXApp>
        </BrowserRouter>, document.querySelector("#panda-app-root"));
```

## 数据同构
数据同构是将组件初始化过程中涉及到的网络请求放到服务端去请求，服务端等待所有请求完成之后，将数据注入到组件中，也就是俗称的“注水”操作。

数据同构的好处是可以加快首屏渲染速度，减少首屏网络请求。尤其是像我们现在这个项目，首页90%的内容都是需要经过网络请求后再加载的，这个时候做数据同构会极大提升用户体验。

数据同构主要用到的技术是redux。实现整套redux的过程步骤多，难度不大。这里主要遇到的问题是数据按项目之前的构建方式，只把XXXAPP这个组件打成一个js的方式行不通了，因此我们引入了路由，路由中定义了组件，直接在node端引入组件就会遇到之前的图片等资源的问题。解决办法就是把server端的入口app.js作为打server.bundle.js的入口，服务端代码全部打到一个js中。

最后贴一下最终服务端同构的完整代码，以及客户端入口代码，redux剩下的代码可以按官网操作。

1. 服务端
```javascript
import Koa from "koa";
import historyApiFallback from "koa2-connect-history-api-fallback";
import co from "co";
import render from "koa-swig";
import serve from "koa-static";
import errorHandler from "./middlewares/ErrorHandler";
import log4js from "log4js";
import config from "./config";
import Router from "@koa/router";
var path = require("path");
import { StaticRouter, matchPath } from "react-router-dom";
import React from "react";
import { renderToString } from "react-dom/server";
import { ServerStyleSheets, ThemeProvider } from "@material-ui/core/styles";
import { Provider } from "react-redux";
import XXXApp from "../webapp/shared/XXXApp";
import { createServerStore } from "../webapp/shared/store";
import routes from "../webapp/shared/Routes";
import CONTROLLER_PATH from "./ControllerPath";
import Theme from "../webapp/common/Theme";
import { ServerStyleSheet } from "styled-components";
const app = new Koa();
const router = new Router();

app.use(serve(config.staticDir));
app.use(historyApiFallback({ whiteList: ["/lpn", "/lpn/api"] }));
app.context.render = co.wrap(
  render({
    root: path.join(__dirname, "views"),
    autoescape: true,
    cache: config.memoryFlag,
    ext: "html",
    varControls: ["[[", "]]"],
    writeBody: false,
  })
);
//逻辑和业务错误 http日志
log4js.configure({
  pm2: true,
  disableClustering: true,
  appenders: {
    cheese: {
      type: "file",
      filename: "logs/panda-front.log",
    },
  },
  categories: {
    default: {
      appenders: ["cheese"],
      level: "info",
    },
  },
});
const logger = log4js.getLogger("cheese");
errorHandler.error(app, logger);

router.get(CONTROLLER_PATH, async (ctx, next) => {
  const promises = [];
  const store = createServerStore();
  routes.some((route) => {
    const match = matchPath(ctx.request.path, route);
    if (match && route.loadData) {
      promises.push(route.loadData(store));
    }
  });
  var html = await ctx.render("XXXApp/pages/index");

  await Promise.all(promises);
  const sheet = new ServerStyleSheets();
  const styleSheets = new ServerStyleSheet();
  styleSheets.collectStyles(
    <Provider store={store}>
      <ThemeProvider theme={Theme}>
        <StaticRouter location={ctx.req.url}>
          <XXXApp></XXXApp>
        </StaticRouter>
      </ThemeProvider>
    </Provider>
  );

  const isomorphicBody = renderToString(
    sheet.collect(styleSheets.getStyleElement())
  );

  const styles = sheet.toString();
  if (html.indexOf("<!-- IsmorphicInjectCSS -->") != -1) {
    var injectCss = `<style id="jss-server-side">${styles}</style>`;
    html = html.replace("<!-- IsmorphicInjectCSS -->", injectCss);
  }

  if (html.indexOf("<!-- IsmorphicInjectReduxStore -->") != -1) {
    var storeString = `<script>window.REDUX_STATE = ${JSON.stringify(
      store.getState()
    )}</script>`;
    html = html.replace("<!-- IsmorphicInjectReduxStore -->", storeString);
  }

  if (html.indexOf("<!-- IsmorphicInject -->") != -1) {
    html = html.replace("<!-- IsmorphicInject -->", isomorphicBody);
  }
  ctx.body = html;
});

app.use(router.routes()).use(router.allowedMethods());

app.listen(config.port, () => {
  console.log("服务已启动🍺🍞", config.port);
});

```

2. 客户端
```javascript
"use strict";
/**
 * APP主入口
 */
import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { ThemeProvider } from "styled-components";
import Theme from "../../common/Theme";
import XXXApp from "../../shared/XXXApp";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { createClientStore } from "../../shared/store";

function Main() {
  React.useEffect(() => {
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  return (
    <Provider store={createClientStore()}>
      <ThemeProvider theme={Theme}>
        <BrowserRouter>
          <XXXApp></XXXApp>
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  );
}
ReactDOM.hydrate(<Main />, document.querySelector("#panda-app-root"));

```
