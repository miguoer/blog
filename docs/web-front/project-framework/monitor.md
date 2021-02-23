# 如何做一个监控 SDK

监控 SDK 主要完成性能监控、错误监控和用户操作轨迹+sourcemap 回溯的功能。

## SDK 开发准备

1. 准备编译环境 ts/js 文件
2. 选择构建工具。可供选择的有 rollup, esbuild, swc 等。rollup 是老大哥。
3. 目标是要编译成兼容 umd cmd amd esmodule commonjs1 commonjs2 等规范的 min.js 文件。rollup 可以方便的生成这些模块化的 js。缺点就是有点繁琐。

还有一个小而美的框架叫 microbundle，可以不用像 rollup 一样配置各种，简单的就可以生成各种规范的 js。

4. 使用 api-extractor 合并分散的.d.ts 文件，输出到 dist/typings 下
5. 生成 ts-doc 文件。可以使用 typedoc

## 性能监控

性能监控，可以使用 performance.timing API 和 web-vitals 库来完成

## 错误监控

- 使用 window.onerror 捕获 JS 执行报错
- 使用 window.addEventListener('unhandledrejection', ()=> {}) 用于捕获未处理的 Promise 报错

## 上报

使用如果支持 navigator.sendBeacon，就使用
navigator.sendBeacon(logurl, JSON.stringify(msg));

如果不支持就用 fetch
