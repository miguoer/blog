# 微前端概念

微前端是将微服务理念应用于前端技术后的相关实践，使得一个前端项目可以由多个团队独立开发以及独立部署。

## 微前端的特性

- 技术无关

各个开发团队可以自行选择技术栈，不受同一项目中其它团队影响。

- 代码独立
  各个交付的产物都可以被独立使用，避免和其它交付产物耦合。

- 样式隔离
  各个交付产物中的样式不会污染到其它组件。

- 原生支持
  各个交付产物都可以自由使用浏览器原生 API，而非要求使用封装后的 API。

## 微前端解决的核心问题和步骤

- 一个前端需要对应多个后端

- 提供一套应用注册机制，完成应用的无缝整合

- 在应用之前对开发者要指定好使用 CSR 或 SSR 的技术方案

- 构建时集成应用和应用独立发布部署

具体来说：

1. 微应用的注册、异步加载和生命周期管理
2. 微应用之间、主从之间的消息机制
3. 微应用之间的安全隔离措施
4. 微应用的框架无关、版本无关
5. 微应用之间、主从之间的公共依赖的库、业务逻辑（utils）以及版本怎么管理
6. 微应用独立调试、和主应用联调的方式，快速定位报错
7. 微应用的发布流程
8. 微应用打包优化问题
9. 微应用专有云场景的出包方案
10. 渐进式升级。用微应用方案平滑重构老项目

## 微前端交付产物

- 发布静态资源+后台路由和服务
- 发布组件启动时机全由父级决定
- 发布局部应用配置过程由自身决定

## 常见的部署方式

- 大仓库拆分成独立的模块，统一构建
- 大仓库通过 monorepo methodology 做成 npm 包，集成到主项目
- 大仓库拆分成子仓库，构建出独立的服务/应用
- 大仓库拆分成多仓库，构建后集成到主应用

## 微前端常见方案

### iframe

#### 优点

改造成本低，可以快速上线

#### 缺点

- 不可控制。iframe 嵌入的显示区大小不容易控制，存在一定的局限性
- 刷新问题。URL 的记录完全无效，页面刷新不能被记忆，刷新会返回首页，iframe 功能之间跳转也无效
- 兼容性差。iframe 的样式显示、兼容性都具有局限性
- 性能开销。iframe 阻塞 onload、占用连接池、多层嵌套页面崩溃、内存占用大（每开一个 iframe 相当于多创建了一个进程）。实测在 Android 手机上多开 iframe 内存从 90M 飙升到了 400 多 M。

### 百度 FIS

百度的 fis 其实是一个不错的解决方案。只是缺少更新维护了。

### System.js

目前为止较好的方案。
各个子应用独立开发部署，唯一需要改变的地方就是 webpack 的配置，侵入性很小。主项目通过 system.js 引入子应用。

### Webpack5

Webpack5 原生支持微前端，通过`ModuleFederationPlugin`配置主项目

### WebComponents

通过 webcomponents，需要哪个组件，直接引入即可，自动的 CSS 沙箱隔离。缺点是旧的浏览器兼容性差，但是是未来趋势。

### 流行的库

- bifrost

- single-spa

- qiankun
  乾坤提供了样式隔离（scope），JS 沙箱隔离（proxy）。
  1.vue react 项目配合自己 暴露生命周期 全局的把你的项目名字 通过 Window 暴露出来 2.获取子应用的 HTML 填充到 HTML 里面 3.创建沙箱运行环节 Proxy 代理了 window 上的内容 填了一层 4.执行自定义的生命周期 挂载到沙箱 5.卸载沙箱 生命周期注册流程 single-spa

- 基于 serverless 的服务
- omi
