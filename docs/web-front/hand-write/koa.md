# Koa

Koa 源码中主要有 4 个文件，application, context, request 和 response。

## app.js

在使用 Koa 的时候我们知道，最常用的方法有 use 和 listen，因此，首先创建一个 app.js。

```javascript
const MyKoa = require("./lib/application");

const app = new MyKoa();

// 定义中间件1
app.use(async (ctx, next) => {
  console.log("入口1");
  await next();
  console.log("出口1");
});

// 定义中间件2
app.use(async (ctx, next) => {
  console.log("入口2");
  await next();
  console.log("出口2");
});

//在3000端口启动服务
app.listen(3000, () => {
  console.log("服务启动成功");
});
```

接下来就是实现 application

## application

```javascript
// Koa所有的报错机制，都是基于事件的Emitter
const Emitter = require("events");

const http = require("http");

// 对外需要提供use和listen方法
class Application extends Emitter {
  constructor() {
    super();

    // 存储所有的中间件
    this.middwares = [];
  }

  use(middware) {
    this.middwares.push(middware);
  }

  listen(...args) {
    const server = http.createServer(this.callback());
    server.listen(...args);
  }

  //   app.use(async (ctx, next) => {
  //     console.log("入口1");
  //     await next();
  //     console.log("出口1");
  //   });

  //   app.use(async (ctx, next) => {
  //     console.log("入口2");
  //     await next();
  //     console.log("出口2");
  //   });

  // 1. 从middlewares末尾开始循环，
  // 2. 取出数组最后一项 执行
  compose() {
    return async (ctx) => {
      console.log("this.middwares ---> ", this.middwares);
      // 将所有的middware递归合并

      function createNext(middleware, oldNext) {
        return async () => {
          // 执行传进来的中间件
          await middleware(ctx, oldNext);
        };
      }

      let len = this.middwares.length;
      console.log("当前middwares长度", len);
      let next = async () => {
        return Promise.resolve();
      }; // 把最后一个中间件变成  await Promise.resolve()

      for (let i = len - 1; i >= 0; i--) {
        let currentMiddware = this.middwares[i];
        next = createNext(currentMiddware, next);
      }
      // 最终的next
      // async (ctx, next) => {
      //     console.log("入口1");
      //     await async () => {
      //         await async (ctx, next) => {
      //             console.log("入口2");
      //             await Promise.resolve();
      //             console.log("出口2");
      //         }
      //     }
      //     console.log("出口1");
      // }

      await next();
    };
  }

  onrror(err, ctx) {
    this.emit(err);
  }

  // 最终要去输出的内容
  // 把middare一层一层取出来，然后返回结果
  callback() {
    return (req, res) => {
      // 由http返回

      let fn = this.compose();

      const ctx = this.createContext(req, res);
      const onerror = this.onerror();
      return fn(ctx)
        .then(() => {
          // 全局的response
          res.end("hello world");
        })
        .catch(onerror);
    };
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
}

module.exports = Application;
```

上面就是 koa 的核心代码了。request 和 response 是处理我们的请求和响应的 js。

## request

```javascript
"use strict";

/**
 * Module dependencies.
 */

const URL = require("url").URL;
const net = require("net");
const accepts = require("accepts");
const contentType = require("content-type");
const stringify = require("url").format;
const parse = require("parseurl");
const qs = require("querystring");
const typeis = require("type-is");
const fresh = require("fresh");
const only = require("only");
const util = require("util");

const IP = Symbol("context#ip");

/**
 * Prototype.
 */

module.exports = {
  /**
   * Return request header.
   *
   * @return {Object}
   * @api public
   */

  get header() {
    return this.req.headers;
  },

  /**
   * Set request header.
   *
   * @api public
   */

  set header(val) {
    this.req.headers = val;
  },

  /**
   * Return request header, alias as request.header
   *
   * @return {Object}
   * @api public
   */

  get headers() {
    return this.req.headers;
  },

  /**
   * Set request header, alias as request.header
   *
   * @api public
   */

  set headers(val) {
    this.req.headers = val;
  },

  /**
   * Get request URL.
   *
   * @return {String}
   * @api public
   */

  get url() {
    return this.req.url;
  },

  /**
   * Set request URL.
   *
   * @api public
   */

  set url(val) {
    this.req.url = val;
  },

  /**
   * Get origin of URL.
   *
   * @return {String}
   * @api public
   */

  get origin() {
    return `${this.protocol}://${this.host}`;
  },

  /**
   * Get full request URL.
   *
   * @return {String}
   * @api public
   */

  get href() {
    // support: `GET http://example.com/foo`
    if (/^https?:\/\//i.test(this.originalUrl)) return this.originalUrl;
    return this.origin + this.originalUrl;
  },

  /**
   * Get request method.
   *
   * @return {String}
   * @api public
   */

  get method() {
    return this.req.method;
  },

  /**
   * Set request method.
   *
   * @param {String} val
   * @api public
   */

  set method(val) {
    this.req.method = val;
  },

  /**
   * Get request pathname.
   *
   * @return {String}
   * @api public
   */

  get path() {
    return parse(this.req).pathname;
  },

  /**
   * Set pathname, retaining the query string when present.
   *
   * @param {String} path
   * @api public
   */

  set path(path) {
    const url = parse(this.req);
    if (url.pathname === path) return;

    url.pathname = path;
    url.path = null;

    this.url = stringify(url);
  },

  /**
   * Get parsed query string.
   *
   * @return {Object}
   * @api public
   */

  get query() {
    const str = this.querystring;
    const c = (this._querycache = this._querycache || {});
    return c[str] || (c[str] = qs.parse(str));
  },

  /**
   * Set query string as an object.
   *
   * @param {Object} obj
   * @api public
   */

  set query(obj) {
    this.querystring = qs.stringify(obj);
  },

  /**
   * Get query string.
   *
   * @return {String}
   * @api public
   */

  get querystring() {
    if (!this.req) return "";
    return parse(this.req).query || "";
  },

  /**
   * Set query string.
   *
   * @param {String} str
   * @api public
   */

  set querystring(str) {
    const url = parse(this.req);
    if (url.search === `?${str}`) return;

    url.search = str;
    url.path = null;

    this.url = stringify(url);
  },

  /**
   * Get the search string. Same as the query string
   * except it includes the leading ?.
   *
   * @return {String}
   * @api public
   */

  get search() {
    if (!this.querystring) return "";
    return `?${this.querystring}`;
  },

  /**
   * Set the search string. Same as
   * request.querystring= but included for ubiquity.
   *
   * @param {String} str
   * @api public
   */

  set search(str) {
    this.querystring = str;
  },

  /**
   * Parse the "Host" header field host
   * and support X-Forwarded-Host when a
   * proxy is enabled.
   *
   * @return {String} hostname:port
   * @api public
   */

  get host() {
    const proxy = this.app.proxy;
    let host = proxy && this.get("X-Forwarded-Host");
    if (!host) {
      if (this.req.httpVersionMajor >= 2) host = this.get(":authority");
      if (!host) host = this.get("Host");
    }
    if (!host) return "";
    return host.split(/\s*,\s*/, 1)[0];
  },

  /**
   * Parse the "Host" header field hostname
   * and support X-Forwarded-Host when a
   * proxy is enabled.
   *
   * @return {String} hostname
   * @api public
   */

  get hostname() {
    const host = this.host;
    if (!host) return "";
    if ("[" === host[0]) return this.URL.hostname || ""; // IPv6
    return host.split(":", 1)[0];
  },

  /**
   * Get WHATWG parsed URL.
   * Lazily memoized.
   *
   * @return {URL|Object}
   * @api public
   */

  get URL() {
    /* istanbul ignore else */
    if (!this.memoizedURL) {
      const originalUrl = this.originalUrl || ""; // avoid undefined in template string
      try {
        this.memoizedURL = new URL(`${this.origin}${originalUrl}`);
      } catch (err) {
        this.memoizedURL = Object.create(null);
      }
    }
    return this.memoizedURL;
  },

  /**
   * Check if the request is fresh, aka
   * Last-Modified and/or the ETag
   * still match.
   *
   * @return {Boolean}
   * @api public
   */

  get fresh() {
    const method = this.method;
    const s = this.ctx.status;

    // GET or HEAD for weak freshness validation only
    if ("GET" !== method && "HEAD" !== method) return false;

    // 2xx or 304 as per rfc2616 14.26
    if ((s >= 200 && s < 300) || 304 === s) {
      return fresh(this.header, this.response.header);
    }

    return false;
  },

  /**
   * Check if the request is stale, aka
   * "Last-Modified" and / or the "ETag" for the
   * resource has changed.
   *
   * @return {Boolean}
   * @api public
   */

  get stale() {
    return !this.fresh;
  },

  /**
   * Check if the request is idempotent.
   *
   * @return {Boolean}
   * @api public
   */

  get idempotent() {
    const methods = ["GET", "HEAD", "PUT", "DELETE", "OPTIONS", "TRACE"];
    return !!~methods.indexOf(this.method);
  },

  /**
   * Return the request socket.
   *
   * @return {Connection}
   * @api public
   */

  get socket() {
    return this.req.socket;
  },

  /**
   * Get the charset when present or undefined.
   *
   * @return {String}
   * @api public
   */

  get charset() {
    try {
      const { parameters } = contentType.parse(this.req);
      return parameters.charset || "";
    } catch (e) {
      return "";
    }
  },

  /**
   * Return parsed Content-Length when present.
   *
   * @return {Number}
   * @api public
   */

  get length() {
    const len = this.get("Content-Length");
    if (len === "") return;
    return ~~len;
  },

  /**
   * Return the protocol string "http" or "https"
   * when requested with TLS. When the proxy setting
   * is enabled the "X-Forwarded-Proto" header
   * field will be trusted. If you're running behind
   * a reverse proxy that supplies https for you this
   * may be enabled.
   *
   * @return {String}
   * @api public
   */

  get protocol() {
    if (this.socket.encrypted) return "https";
    if (!this.app.proxy) return "http";
    const proto = this.get("X-Forwarded-Proto");
    return proto ? proto.split(/\s*,\s*/, 1)[0] : "http";
  },

  /**
   * Shorthand for:
   *
   *    this.protocol == 'https'
   *
   * @return {Boolean}
   * @api public
   */

  get secure() {
    return "https" === this.protocol;
  },

  /**
   * When `app.proxy` is `true`, parse
   * the "X-Forwarded-For" ip address list.
   *
   * For example if the value was "client, proxy1, proxy2"
   * you would receive the array `["client", "proxy1", "proxy2"]`
   * where "proxy2" is the furthest down-stream.
   *
   * @return {Array}
   * @api public
   */

  get ips() {
    const proxy = this.app.proxy;
    const val = this.get(this.app.proxyIpHeader);
    let ips = proxy && val ? val.split(/\s*,\s*/) : [];
    if (this.app.maxIpsCount > 0) {
      ips = ips.slice(-this.app.maxIpsCount);
    }
    return ips;
  },

  /**
   * Return request's remote address
   * When `app.proxy` is `true`, parse
   * the "X-Forwarded-For" ip address list and return the first one
   *
   * @return {String}
   * @api public
   */

  get ip() {
    if (!this[IP]) {
      this[IP] = this.ips[0] || this.socket.remoteAddress || "";
    }
    return this[IP];
  },

  set ip(_ip) {
    this[IP] = _ip;
  },

  /**
   * Return subdomains as an array.
   *
   * Subdomains are the dot-separated parts of the host before the main domain
   * of the app. By default, the domain of the app is assumed to be the last two
   * parts of the host. This can be changed by setting `app.subdomainOffset`.
   *
   * For example, if the domain is "tobi.ferrets.example.com":
   * If `app.subdomainOffset` is not set, this.subdomains is
   * `["ferrets", "tobi"]`.
   * If `app.subdomainOffset` is 3, this.subdomains is `["tobi"]`.
   *
   * @return {Array}
   * @api public
   */

  get subdomains() {
    const offset = this.app.subdomainOffset;
    const hostname = this.hostname;
    if (net.isIP(hostname)) return [];
    return hostname
      .split(".")
      .reverse()
      .slice(offset);
  },

  /**
   * Get accept object.
   * Lazily memoized.
   *
   * @return {Object}
   * @api private
   */

  get accept() {
    return this._accept || (this._accept = accepts(this.req));
  },

  /**
   * Set accept object.
   *
   * @param {Object}
   * @api private
   */

  set accept(obj) {
    this._accept = obj;
  },

  /**
   * Check if the given `type(s)` is acceptable, returning
   * the best match when true, otherwise `false`, in which
   * case you should respond with 406 "Not Acceptable".
   *
   * The `type` value may be a single mime type string
   * such as "application/json", the extension name
   * such as "json" or an array `["json", "html", "text/plain"]`. When a list
   * or array is given the _best_ match, if any is returned.
   *
   * Examples:
   *
   *     // Accept: text/html
   *     this.accepts('html');
   *     // => "html"
   *
   *     // Accept: text/*, application/json
   *     this.accepts('html');
   *     // => "html"
   *     this.accepts('text/html');
   *     // => "text/html"
   *     this.accepts('json', 'text');
   *     // => "json"
   *     this.accepts('application/json');
   *     // => "application/json"
   *
   *     // Accept: text/*, application/json
   *     this.accepts('image/png');
   *     this.accepts('png');
   *     // => false
   *
   *     // Accept: text/*;q=.5, application/json
   *     this.accepts(['html', 'json']);
   *     this.accepts('html', 'json');
   *     // => "json"
   *
   * @param {String|Array} type(s)...
   * @return {String|Array|false}
   * @api public
   */

  accepts(...args) {
    return this.accept.types(...args);
  },

  /**
   * Return accepted encodings or best fit based on `encodings`.
   *
   * Given `Accept-Encoding: gzip, deflate`
   * an array sorted by quality is returned:
   *
   *     ['gzip', 'deflate']
   *
   * @param {String|Array} encoding(s)...
   * @return {String|Array}
   * @api public
   */

  acceptsEncodings(...args) {
    return this.accept.encodings(...args);
  },

  /**
   * Return accepted charsets or best fit based on `charsets`.
   *
   * Given `Accept-Charset: utf-8, iso-8859-1;q=0.2, utf-7;q=0.5`
   * an array sorted by quality is returned:
   *
   *     ['utf-8', 'utf-7', 'iso-8859-1']
   *
   * @param {String|Array} charset(s)...
   * @return {String|Array}
   * @api public
   */

  acceptsCharsets(...args) {
    return this.accept.charsets(...args);
  },

  /**
   * Return accepted languages or best fit based on `langs`.
   *
   * Given `Accept-Language: en;q=0.8, es, pt`
   * an array sorted by quality is returned:
   *
   *     ['es', 'pt', 'en']
   *
   * @param {String|Array} lang(s)...
   * @return {Array|String}
   * @api public
   */

  acceptsLanguages(...args) {
    return this.accept.languages(...args);
  },

  /**
   * Check if the incoming request contains the "Content-Type"
   * header field and if it contains any of the given mime `type`s.
   * If there is no request body, `null` is returned.
   * If there is no content type, `false` is returned.
   * Otherwise, it returns the first `type` that matches.
   *
   * Examples:
   *
   *     // With Content-Type: text/html; charset=utf-8
   *     this.is('html'); // => 'html'
   *     this.is('text/html'); // => 'text/html'
   *     this.is('text/*', 'application/json'); // => 'text/html'
   *
   *     // When Content-Type is application/json
   *     this.is('json', 'urlencoded'); // => 'json'
   *     this.is('application/json'); // => 'application/json'
   *     this.is('html', 'application/*'); // => 'application/json'
   *
   *     this.is('html'); // => false
   *
   * @param {String|String[]} [type]
   * @param {String[]} [types]
   * @return {String|false|null}
   * @api public
   */

  is(type, ...types) {
    return typeis(this.req, type, ...types);
  },

  /**
   * Return the request mime type void of
   * parameters such as "charset".
   *
   * @return {String}
   * @api public
   */

  get type() {
    const type = this.get("Content-Type");
    if (!type) return "";
    return type.split(";")[0];
  },

  /**
   * Return request header.
   *
   * The `Referrer` header field is special-cased,
   * both `Referrer` and `Referer` are interchangeable.
   *
   * Examples:
   *
   *     this.get('Content-Type');
   *     // => "text/plain"
   *
   *     this.get('content-type');
   *     // => "text/plain"
   *
   *     this.get('Something');
   *     // => ''
   *
   * @param {String} field
   * @return {String}
   * @api public
   */

  get(field) {
    const req = this.req;
    switch ((field = field.toLowerCase())) {
      case "referer":
      case "referrer":
        return req.headers.referrer || req.headers.referer || "";
      default:
        return req.headers[field] || "";
    }
  },

  /**
   * Inspect implementation.
   *
   * @return {Object}
   * @api public
   */

  inspect() {
    if (!this.req) return;
    return this.toJSON();
  },

  /**
   * Return JSON representation.
   *
   * @return {Object}
   * @api public
   */

  toJSON() {
    return only(this, ["method", "url", "header"]);
  },
};

/**
 * Custom inspection implementation for newer Node.js versions.
 *
 * @return {Object}
 * @api public
 */

/* istanbul ignore else */
if (util.inspect.custom) {
  module.exports[util.inspect.custom] = module.exports.inspect;
}
```

## response

````javascript
"use strict";

/**
 * Module dependencies.
 */

const contentDisposition = require("content-disposition");
const getType = require("cache-content-type");
const onFinish = require("on-finished");
const escape = require("escape-html");
const typeis = require("type-is").is;
const statuses = require("statuses");
const destroy = require("destroy");
const assert = require("assert");
const extname = require("path").extname;
const vary = require("vary");
const only = require("only");
const util = require("util");
const encodeUrl = require("encodeurl");
const Stream = require("stream");

/**
 * Prototype.
 */

module.exports = {
  /**
   * Return the request socket.
   *
   * @return {Connection}
   * @api public
   */

  get socket() {
    return this.res.socket;
  },

  /**
   * Return response header.
   *
   * @return {Object}
   * @api public
   */

  get header() {
    const { res } = this;
    return typeof res.getHeaders === "function"
      ? res.getHeaders()
      : res._headers || {}; // Node < 7.7
  },

  /**
   * Return response header, alias as response.header
   *
   * @return {Object}
   * @api public
   */

  get headers() {
    return this.header;
  },

  /**
   * Get response status code.
   *
   * @return {Number}
   * @api public
   */

  get status() {
    return this.res.statusCode;
  },

  /**
   * Set response status code.
   *
   * @param {Number} code
   * @api public
   */

  set status(code) {
    if (this.headerSent) return;

    assert(Number.isInteger(code), "status code must be a number");
    assert(code >= 100 && code <= 999, `invalid status code: ${code}`);
    this._explicitStatus = true;
    this.res.statusCode = code;
    if (this.req.httpVersionMajor < 2) this.res.statusMessage = statuses[code];
    if (this.body && statuses.empty[code]) this.body = null;
  },

  /**
   * Get response status message
   *
   * @return {String}
   * @api public
   */

  get message() {
    return this.res.statusMessage || statuses[this.status];
  },

  /**
   * Set response status message
   *
   * @param {String} msg
   * @api public
   */

  set message(msg) {
    this.res.statusMessage = msg;
  },

  /**
   * Get response body.
   *
   * @return {Mixed}
   * @api public
   */

  get body() {
    return this._body;
  },

  /**
   * Set response body.
   *
   * @param {String|Buffer|Object|Stream} val
   * @api public
   */

  set body(val) {
    const original = this._body;
    this._body = val;

    // no content
    if (null == val) {
      if (!statuses.empty[this.status]) this.status = 204;
      if (val === null) this._explicitNullBody = true;
      this.remove("Content-Type");
      this.remove("Content-Length");
      this.remove("Transfer-Encoding");
      return;
    }

    // set the status
    if (!this._explicitStatus) this.status = 200;

    // set the content-type only if not yet set
    const setType = !this.has("Content-Type");

    // string
    if ("string" === typeof val) {
      if (setType) this.type = /^\s*</.test(val) ? "html" : "text";
      this.length = Buffer.byteLength(val);
      return;
    }

    // buffer
    if (Buffer.isBuffer(val)) {
      if (setType) this.type = "bin";
      this.length = val.length;
      return;
    }

    // stream
    if (val instanceof Stream) {
      onFinish(this.res, destroy.bind(null, val));
      if (original != val) {
        val.once("error", (err) => this.ctx.onerror(err));
        // overwriting
        if (null != original) this.remove("Content-Length");
      }

      if (setType) this.type = "bin";
      return;
    }

    // json
    this.remove("Content-Length");
    this.type = "json";
  },

  /**
   * Set Content-Length field to `n`.
   *
   * @param {Number} n
   * @api public
   */

  set length(n) {
    this.set("Content-Length", n);
  },

  /**
   * Return parsed response Content-Length when present.
   *
   * @return {Number}
   * @api public
   */

  get length() {
    if (this.has("Content-Length")) {
      return parseInt(this.get("Content-Length"), 10) || 0;
    }

    const { body } = this;
    if (!body || body instanceof Stream) return undefined;
    if ("string" === typeof body) return Buffer.byteLength(body);
    if (Buffer.isBuffer(body)) return body.length;
    return Buffer.byteLength(JSON.stringify(body));
  },

  /**
   * Check if a header has been written to the socket.
   *
   * @return {Boolean}
   * @api public
   */

  get headerSent() {
    return this.res.headersSent;
  },

  /**
   * Vary on `field`.
   *
   * @param {String} field
   * @api public
   */

  vary(field) {
    if (this.headerSent) return;

    vary(this.res, field);
  },

  /**
   * Perform a 302 redirect to `url`.
   *
   * The string "back" is special-cased
   * to provide Referrer support, when Referrer
   * is not present `alt` or "/" is used.
   *
   * Examples:
   *
   *    this.redirect('back');
   *    this.redirect('back', '/index.html');
   *    this.redirect('/login');
   *    this.redirect('http://google.com');
   *
   * @param {String} url
   * @param {String} [alt]
   * @api public
   */

  redirect(url, alt) {
    // location
    if ("back" === url) url = this.ctx.get("Referrer") || alt || "/";
    this.set("Location", encodeUrl(url));

    // status
    if (!statuses.redirect[this.status]) this.status = 302;

    // html
    if (this.ctx.accepts("html")) {
      url = escape(url);
      this.type = "text/html; charset=utf-8";
      this.body = `Redirecting to <a href="${url}">${url}</a>.`;
      return;
    }

    // text
    this.type = "text/plain; charset=utf-8";
    this.body = `Redirecting to ${url}.`;
  },

  /**
   * Set Content-Disposition header to "attachment" with optional `filename`.
   *
   * @param {String} filename
   * @api public
   */

  attachment(filename, options) {
    if (filename) this.type = extname(filename);
    this.set("Content-Disposition", contentDisposition(filename, options));
  },

  /**
   * Set Content-Type response header with `type` through `mime.lookup()`
   * when it does not contain a charset.
   *
   * Examples:
   *
   *     this.type = '.html';
   *     this.type = 'html';
   *     this.type = 'json';
   *     this.type = 'application/json';
   *     this.type = 'png';
   *
   * @param {String} type
   * @api public
   */

  set type(type) {
    type = getType(type);
    if (type) {
      this.set("Content-Type", type);
    } else {
      this.remove("Content-Type");
    }
  },

  /**
   * Set the Last-Modified date using a string or a Date.
   *
   *     this.response.lastModified = new Date();
   *     this.response.lastModified = '2013-09-13';
   *
   * @param {String|Date} type
   * @api public
   */

  set lastModified(val) {
    if ("string" === typeof val) val = new Date(val);
    this.set("Last-Modified", val.toUTCString());
  },

  /**
   * Get the Last-Modified date in Date form, if it exists.
   *
   * @return {Date}
   * @api public
   */

  get lastModified() {
    const date = this.get("last-modified");
    if (date) return new Date(date);
  },

  /**
   * Set the ETag of a response.
   * This will normalize the quotes if necessary.
   *
   *     this.response.etag = 'md5hashsum';
   *     this.response.etag = '"md5hashsum"';
   *     this.response.etag = 'W/"123456789"';
   *
   * @param {String} etag
   * @api public
   */

  set etag(val) {
    if (!/^(W\/)?"/.test(val)) val = `"${val}"`;
    this.set("ETag", val);
  },

  /**
   * Get the ETag of a response.
   *
   * @return {String}
   * @api public
   */

  get etag() {
    return this.get("ETag");
  },

  /**
   * Return the response mime type void of
   * parameters such as "charset".
   *
   * @return {String}
   * @api public
   */

  get type() {
    const type = this.get("Content-Type");
    if (!type) return "";
    return type.split(";", 1)[0];
  },

  /**
   * Check whether the response is one of the listed types.
   * Pretty much the same as `this.request.is()`.
   *
   * @param {String|String[]} [type]
   * @param {String[]} [types]
   * @return {String|false}
   * @api public
   */

  is(type, ...types) {
    return typeis(this.type, type, ...types);
  },

  /**
   * Return response header.
   *
   * Examples:
   *
   *     this.get('Content-Type');
   *     // => "text/plain"
   *
   *     this.get('content-type');
   *     // => "text/plain"
   *
   * @param {String} field
   * @return {String}
   * @api public
   */

  get(field) {
    return this.header[field.toLowerCase()] || "";
  },

  /**
   * Returns true if the header identified by name is currently set in the outgoing headers.
   * The header name matching is case-insensitive.
   *
   * Examples:
   *
   *     this.has('Content-Type');
   *     // => true
   *
   *     this.get('content-type');
   *     // => true
   *
   * @param {String} field
   * @return {boolean}
   * @api public
   */

  has(field) {
    return typeof this.res.hasHeader === "function"
      ? this.res.hasHeader(field)
      : // Node < 7.7
        field.toLowerCase() in this.headers;
  },

  /**
   * Set header `field` to `val` or pass
   * an object of header fields.
   *
   * Examples:
   *
   *    this.set('Foo', ['bar', 'baz']);
   *    this.set('Accept', 'application/json');
   *    this.set({ Accept: 'text/plain', 'X-API-Key': 'tobi' });
   *
   * @param {String|Object|Array} field
   * @param {String} val
   * @api public
   */

  set(field, val) {
    if (this.headerSent) return;

    if (2 === arguments.length) {
      if (Array.isArray(val))
        val = val.map((v) => (typeof v === "string" ? v : String(v)));
      else if (typeof val !== "string") val = String(val);
      this.res.setHeader(field, val);
    } else {
      for (const key in field) {
        this.set(key, field[key]);
      }
    }
  },

  /**
   * Append additional header `field` with value `val`.
   *
   * Examples:
   *
   * ```
   * this.append('Link', ['<http://localhost/>', '<http://localhost:3000/>']);
   * this.append('Set-Cookie', 'foo=bar; Path=/; HttpOnly');
   * this.append('Warning', '199 Miscellaneous warning');
   * ```
   *
   * @param {String} field
   * @param {String|Array} val
   * @api public
   */

  append(field, val) {
    const prev = this.get(field);

    if (prev) {
      val = Array.isArray(prev) ? prev.concat(val) : [prev].concat(val);
    }

    return this.set(field, val);
  },

  /**
   * Remove header `field`.
   *
   * @param {String} name
   * @api public
   */

  remove(field) {
    if (this.headerSent) return;

    this.res.removeHeader(field);
  },

  /**
   * Checks if the request is writable.
   * Tests for the existence of the socket
   * as node sometimes does not set it.
   *
   * @return {Boolean}
   * @api private
   */

  get writable() {
    // can't write any more after response finished
    // response.writableEnded is available since Node > 12.9
    // https://nodejs.org/api/http.html#http_response_writableended
    // response.finished is undocumented feature of previous Node versions
    // https://stackoverflow.com/questions/16254385/undocumented-response-finished-in-node-js
    if (this.res.writableEnded || this.res.finished) return false;

    const socket = this.res.socket;
    // There are already pending outgoing res, but still writable
    // https://github.com/nodejs/node/blob/v4.4.7/lib/_http_server.js#L486
    if (!socket) return true;
    return socket.writable;
  },

  /**
   * Inspect implementation.
   *
   * @return {Object}
   * @api public
   */

  inspect() {
    if (!this.res) return;
    const o = this.toJSON();
    o.body = this.body;
    return o;
  },

  /**
   * Return JSON representation.
   *
   * @return {Object}
   * @api public
   */

  toJSON() {
    return only(this, ["status", "message", "header"]);
  },

  /**
   * Flush any set headers and begin the body
   */

  flushHeaders() {
    this.res.flushHeaders();
  },
};

/**
 * Custom inspection implementation for node 6+.
 *
 * @return {Object}
 * @api public
 */

/* istanbul ignore else */
if (util.inspect.custom) {
  module.exports[util.inspect.custom] = module.exports.inspect;
}
````
