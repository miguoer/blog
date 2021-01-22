# 如何做一个监控 SDK

监控 SDK 主要完成性能监控和错误监控的功能。

## 性能监控

性能监控，可以使用 performance.timing API 和 web-vitals 库来完成

## 错误监控

- 使用 window.onerror 捕获 JS 执行报错
- 使用 window.addEventListener('unhandledrejection', ()=> {}) 用于捕获未处理的 Promise 报错

## 上报

使用如果支持 navigator.sendBeacon，就使用
navigator.sendBeacon(logurl, JSON.stringify(msg));

如果不支持就用 fetch
