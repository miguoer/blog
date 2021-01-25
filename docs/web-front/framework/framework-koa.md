# Koa 源码

Koa 源码总共 4 个 js 文件

- application.js。核心文件，完成 server 创建, 中间处理等
- context。 全局上下文
- request。定义请求
- response.定义响应

## application

application 里主要是洋葱模型的实现，核心源码如下

```javascript
const response = require("./response");
const compose = require("koa-compose");
const context = require("./context");
const request = require("./request");
const Emitter = require("events");
const Stream = require("stream");
const http = require("http");
const only = require("only");
const convert = require("koa-convert");
const deprecate = require("depd")("koa");
const { HttpError } = require("http-errors");

module.exports = class Application extends Emitter {
  constructor(options) {
    this.middleware = [];

    this.context = Object.create(context);
    this.request = Object.create(request);
    this.response = Object.create(response);
  }

  // listen完成服务创建功能
  listen(...args) {
    debug("listen");
    const server = http.createServer(this.callback());
    return server.listen(...args);
  }

  // callback是http创建服务成功后的回调
  // 1. 合并所有的middware
  // 2. 在服务启动成功后创建全局上下文，调用 handleRequest
  callback() {
    // 处理所有中间件，生成洋葱模型代码
    const fn = compose(this.middleware);

    if (!this.listenerCount("error")) this.on("error", this.onerror);

    const back = (req, res) => {
      const ctx = this.createContext(req, res);
      return this.handleRequest(ctx, fn);
    };

    return back;
  }

  // 创建上下文
  // 把request 和response挂到context上
  createContext(req, res) {
    const context = Object.create(this.context);
    const request = (context.request = Object.create(this.request));
    const response = (context.response = Object.create(this.response));
    context.app = request.app = response.app = this;
    context.req = request.req = response.req = req;
    context.res = request.res = response.res = res;
    request.ctx = response.ctx = context;
    request.response = response;
    response.request = request;
    context.originalUrl = request.originalUrl = req.url;
    context.state = {};
    return context;
  }

  // 执行所有middware，返回结果
  handleRequest(ctx, fnMiddleware) {
    const res = ctx.res;
    res.statusCode = 404;
    const onerror = (err) => ctx.onerror(err);
    const handleResponse = () => respond(ctx);
    onFinished(res, onerror);
    return fnMiddleware(ctx)
      .then(handleResponse)
      .catch(onerror);
  }
};

function respond(ctx) {
  // allow bypassing koa
  if (false === ctx.respond) return;

  if (!ctx.writable) return;

  const res = ctx.res;
  let body = ctx.body;
  const code = ctx.status;

  // ignore body
  if (statuses.empty[code]) {
    // strip headers
    ctx.body = null;
    return res.end();
  }

  if ("HEAD" === ctx.method) {
    if (!res.headersSent && !ctx.response.has("Content-Length")) {
      const { length } = ctx.response;
      if (Number.isInteger(length)) ctx.length = length;
    }
    return res.end();
  }

  // status body
  if (null == body) {
    if (ctx.response._explicitNullBody) {
      ctx.response.remove("Content-Type");
      ctx.response.remove("Transfer-Encoding");
      return res.end();
    }
    if (ctx.req.httpVersionMajor >= 2) {
      body = String(code);
    } else {
      body = ctx.message || String(code);
    }
    if (!res.headersSent) {
      ctx.type = "text";
      ctx.length = Buffer.byteLength(body);
    }
    return res.end(body);
  }

  // responses
  if (Buffer.isBuffer(body)) return res.end(body);
  if ("string" === typeof body) return res.end(body);
  if (body instanceof Stream) return body.pipe(res);

  // body: json
  body = JSON.stringify(body);
  if (!res.headersSent) {
    ctx.length = Buffer.byteLength(body);
  }
  res.end(body);
}
```

## compose

洋葱模型的关键代码在 compose 里，下面看看里面的处理逻辑

```javascript
// koa-compose/index.js

module.exports = compose;

function compose(middleware) {
  return function(context, next) {
    // last called middleware #
    let index = -1;
    // 使用递归
    return dispatch(0);

    function dispatch(i) {
      if (i <= index)
        return Promise.reject(new Error("next() called multiple times"));
      index = i;
      // i = 0，取第一个middware出来
      let fn = middleware[i];

      // 所有的middware执行完毕，返回最后的next
      if (i === middleware.length) fn = next;

      // 最后一个next 执行，返回Promise.resolve()
      if (!fn) return Promise.resolve();

      try {
        // 执行第i个中间件，返回执行结果
        return Promise.resolve(fn(context, dispatch.bind(null, i + 1)));
      } catch (err) {
        return Promise.reject(err);
      }
    }
  };
}
```
