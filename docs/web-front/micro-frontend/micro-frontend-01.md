# System.js 方案

主站需要设计的东西:

1. 路由注册机制
2. 组件通信机制
3. 子应用打包格式：使用 webpack-system-register 这个 plugin
4. 生命周期如何管理

如何实现：

1. 主站可以用 react 或 Vue 编写
2. 子应用编写好之后打包成 JS，上传到服务器。
3. 主站初始化先拉配置，动态把路由和组件注册上
4. 主站定义好路由，使用 System.import 引入组件
5. 子应用之间如何通信? 在主站中建立发布订阅机制。
