# Webpack 核心原理分析（一）打包

## 文件指纹区别

Hash: 和整个项目的构建相关，只要项目文件有修改，整个项目的 hash 值就会更改

Chunkhash: 和 Webpack 打包的 chunk 有关，不同的 entry 会生成不同的 chunkhash 值

Contenthash: 根据文件内容来定义，文件内容不变，则 contenthash 值不变

## watch

如果开了 watch 会轮询判断文件的最后编辑时间是否变化，某个文件发生了变化，不会立刻告诉监听这，而是先缓存起来，等 aggregateTimeout。webpack 中的 watch 是使用了一个第三方的 watch 库

## plugin

Webpack 实现插件机制的大体方式是:

1. 创建 -- webpack 在其内部对象上创建各种勾子
2. 注册 -- 插件将自己的方法注册到对应的勾子上
3. 调用 -- webpack 编译过程中，会适时地触发相应的勾子，也就触发了插件的方法

### 如何编写自己的插件

Webpack 利用 tapable 这个库来协助实现对于整个构建流程各个步骤的控制。tapable 定义主要构建流程后，使用 tapable 添加了各种各样的勾子方法来将 Webpack 扩展至功能十分丰富，这就是 Plugin 机制。

```javascript
const pluginName = "ConsoleLogOnBuildWebpackPlugin";

class ConsoleLogOnBuildWebpackPlugin {
  apply(compiler) {
    compiler.hooks.run.tap(pluginName, (compilation) => {
      console.log("The webpack build process is starting!!!");
    });
  }
}

module.exports = ConsoleLogOnBuildWebpackPlugin;
```

## 走进 entry

### webpack4 单 entry

假设 entryjs 文件如下:

```javascript
// index.js
const result = "我最帅";
console.log(result);
```

经过 webpack 编译之后生成的代码为:

```javascript
(function(modules) {
  // webpackBootstrap
  /******/ // The module cache
  /******/ var installedModules = {}; // The require function
  /******/
  /******/ /******/ function __webpack_require__(moduleId) {
    /******/
    /******/ // Check if module is in cache
    /******/ if (installedModules[moduleId]) {
      /******/ return installedModules[moduleId].exports;
      /******/
    } // Create a new module (and put it into the cache)
    /******/ /******/ var module = (installedModules[moduleId] = {
      /******/ i: moduleId,
      /******/ l: false,
      /******/ exports: {},
      /******/
    }); // Execute the module function
    /******/
    /******/ /******/ modules[moduleId].call(
      module.exports,
      module,
      module.exports,
      __webpack_require__
    ); // Flag the module as loaded
    /******/
    /******/ /******/ module.l = true; // Return the exports of the module
    /******/
    /******/ /******/ return module.exports;
    /******/
  } // expose the modules object (__webpack_modules__)
  /******/
  /******/
  /******/ /******/ __webpack_require__.m = modules; // expose the module cache
  /******/
  /******/ /******/ __webpack_require__.c = installedModules; // define getter function for harmony exports
  /******/
  /******/ /******/ __webpack_require__.d = function(exports, name, getter) {
    /******/ if (!__webpack_require__.o(exports, name)) {
      /******/ Object.defineProperty(exports, name, {
        enumerable: true,
        get: getter,
      });
      /******/
    }
    /******/
  }; // define __esModule on exports
  /******/
  /******/ /******/ __webpack_require__.r = function(exports) {
    /******/ if (typeof Symbol !== "undefined" && Symbol.toStringTag) {
      /******/ Object.defineProperty(exports, Symbol.toStringTag, {
        value: "Module",
      });
      /******/
    }
    /******/ Object.defineProperty(exports, "__esModule", { value: true });
    /******/
  }; // create a fake namespace object // mode & 1: value is a module id, require it // mode & 2: merge all properties of value into the ns // mode & 4: return value when already ns object // mode & 8|1: behave like require
  /******/
  /******/ /******/ /******/ /******/ /******/ /******/ __webpack_require__.t = function(
    value,
    mode
  ) {
    /******/ if (mode & 1) value = __webpack_require__(value);
    /******/ if (mode & 8) return value;
    /******/ if (
      mode & 4 &&
      typeof value === "object" &&
      value &&
      value.__esModule
    )
      return value;
    /******/ var ns = Object.create(null);
    /******/ __webpack_require__.r(ns);
    /******/ Object.defineProperty(ns, "default", {
      enumerable: true,
      value: value,
    });
    /******/ if (mode & 2 && typeof value != "string")
      for (var key in value)
        __webpack_require__.d(
          ns,
          key,
          function(key) {
            return value[key];
          }.bind(null, key)
        );
    /******/ return ns;
    /******/
  }; // getDefaultExport function for compatibility with non-harmony modules
  /******/
  /******/ /******/ __webpack_require__.n = function(module) {
    /******/ var getter =
      module && module.__esModule
        ? /******/ function getDefault() {
            return module["default"];
          }
        : /******/ function getModuleExports() {
            return module;
          };
    /******/ __webpack_require__.d(getter, "a", getter);
    /******/ return getter;
    /******/
  }; // Object.prototype.hasOwnProperty.call
  /******/
  /******/ /******/ __webpack_require__.o = function(object, property) {
    return Object.prototype.hasOwnProperty.call(object, property);
  }; // __webpack_public_path__
  /******/
  /******/ /******/ __webpack_require__.p = ""; // Load entry module and return exports
  /******/
  /******/
  /******/ /******/ return __webpack_require__(
    (__webpack_require__.s = "./src/index.js")
  );
  /******/
})({
  "./src/index.js": function(module, exports) {
    eval(
      'const result = "我最帅";\nconsole.log(result);\n\n\n//# sourceURL=webpack:///./src/index.js?'
    );
  },
});
```

可以看到 业务代码被放在了闭包里面执行，并且使用了 eval。注意，开发环境有 eval，打生产包的时候就没有了。生产环境编译之后为:

```javascript
!(function(e) {
  var t = {};
  function n(r) {
    if (t[r]) return t[r].exports;
    var o = (t[r] = { i: r, l: !1, exports: {} });
    return e[r].call(o.exports, o, o.exports, n), (o.l = !0), o.exports;
  }
  (n.m = e),
    (n.c = t),
    (n.d = function(e, t, r) {
      n.o(e, t) || Object.defineProperty(e, t, { enumerable: !0, get: r });
    }),
    (n.r = function(e) {
      "undefined" != typeof Symbol &&
        Symbol.toStringTag &&
        Object.defineProperty(e, Symbol.toStringTag, { value: "Module" }),
        Object.defineProperty(e, "__esModule", { value: !0 });
    }),
    (n.t = function(e, t) {
      if ((1 & t && (e = n(e)), 8 & t)) return e;
      if (4 & t && "object" == typeof e && e && e.__esModule) return e;
      var r = Object.create(null);
      if (
        (n.r(r),
        Object.defineProperty(r, "default", { enumerable: !0, value: e }),
        2 & t && "string" != typeof e)
      )
        for (var o in e)
          n.d(
            r,
            o,
            function(t) {
              return e[t];
            }.bind(null, o)
          );
      return r;
    }),
    (n.n = function(e) {
      var t =
        e && e.__esModule
          ? function() {
              return e.default;
            }
          : function() {
              return e;
            };
      return n.d(t, "a", t), t;
    }),
    (n.o = function(e, t) {
      return Object.prototype.hasOwnProperty.call(e, t);
    }),
    (n.p = ""),
    n((n.s = 0));
})([
  function(e, t) {
    console.log("我最帅");
  },
]);
```

### Webpack5 单 entry

来看下，与上面例子相同的代码 webpack5 会编译成什么样。

```javascript
(() => {
  eval(
    "// import data from './data.js';\n// console.log(data);\n// console.log('---------');\n// console.log('京程一灯');\nconst result = \"我最帅\";\nconsole.log(result);\n\n// import('./index.wasm').then(() => {});\n// import wasm from './index.wasm';\n// console.log(wasm);\n\n\n//# sourceURL=webpack://yd-webpack/./src/index.js?"
  );
})();
```

Webpack5 非常简洁，就一个 eval，执行代码。

Webpack5 有两个非常重要的变化， 第一个是当文件没有额外的 import 时，就不用模块化的规范，直接 eval 执行。第二是，在 Webpack4 时，在生成的过程中，带了很多浏览器的 polyfill，由于 Webpack 在开发的过程中，浏览器已经发生了翻天覆地的变化，就把很多 polyfill 干掉了，可以显示的指定带或者不带。

### Webpack4 带 import

```javascript
//index.js
import data from "./data.js";
console.log(data);
console.log("---------");
console.log("我最帅");

//data.js
const result = "我是文件2";

export default result;
```

打包之后的代码：

```javascript
(function(modules) {
  // webpackBootstrap
  // The module cache
  var installedModules = {};

  // The require function
  function __webpack_require__(moduleId) {
    // Check if module is in cache
    if (installedModules[moduleId]) {
      return installedModules[moduleId].exports;
    }
    // Create a new module (and put it into the cache)
    var module = (installedModules[moduleId] = {
      i: moduleId,
      l: false,
      exports: {},
    });

    // Execute the module function
    modules[moduleId].call(
      module.exports,
      module,
      module.exports,
      __webpack_require__
    );

    // Flag the module as loaded
    module.l = true;

    // Return the exports of the module
    return module.exports;
  }

  // expose the modules object (__webpack_modules__)
  __webpack_require__.m = modules;

  // expose the module cache
  __webpack_require__.c = installedModules;

  // define getter function for harmony exports
  __webpack_require__.d = function(exports, name, getter) {
    if (!__webpack_require__.o(exports, name)) {
      Object.defineProperty(exports, name, { enumerable: true, get: getter });
    }
  };

  // define __esModule on exports
  __webpack_require__.r = function(exports) {
    if (typeof Symbol !== "undefined" && Symbol.toStringTag) {
      Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
    }
    Object.defineProperty(exports, "__esModule", { value: true });
  };

  // create a fake namespace object
  // mode & 1: value is a module id, require it
  // mode & 2: merge all properties of value into the ns
  // mode & 4: return value when already ns object
  // mode & 8|1: behave like require
  __webpack_require__.t = function(value, mode) {
    if (mode & 1) value = __webpack_require__(value);
    if (mode & 8) return value;
    if (mode & 4 && typeof value === "object" && value && value.__esModule)
      return value;
    var ns = Object.create(null);
    __webpack_require__.r(ns);
    Object.defineProperty(ns, "default", { enumerable: true, value: value });
    if (mode & 2 && typeof value != "string")
      for (var key in value)
        __webpack_require__.d(
          ns,
          key,
          function(key) {
            return value[key];
          }.bind(null, key)
        );
    return ns;
  };

  // getDefaultExport function for compatibility with non-harmony modules
  __webpack_require__.n = function(module) {
    var getter =
      module && module.__esModule
        ? function getDefault() {
            return module["default"];
          }
        : function getModuleExports() {
            return module;
          };
    __webpack_require__.d(getter, "a", getter);
    return getter;
  };

  // Object.prototype.hasOwnProperty.call
  __webpack_require__.o = function(object, property) {
    return Object.prototype.hasOwnProperty.call(object, property);
  };

  // __webpack_public_path__
  __webpack_require__.p = "";

  // Load entry module and return exports
  return __webpack_require__((__webpack_require__.s = "./src/index.js"));
})({
  "./src/data.js":
    /*! exports provided: default */
    function(module, __webpack_exports__, __webpack_require__) {
      "use strict"; // 自动加严格模式
      // eval(
      __webpack_require__.r(__webpack_exports__);
      const result = "我是文件2";
      /* harmony default export */
      // 通过将result挂到module.exports的default上 module.exports["default"]
      __webpack_exports__["default"] = result;
      // );
    },

  "./src/index.js":
    /*! no exports provided */
    function(module, __webpack_exports__, __webpack_require__) {
      "use strict";
      //实际包裹在eval('')里
      __webpack_require__.r(__webpack_exports__);
      /* harmony import */
      var _data_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
        /*! ./data.js */ "./src/data.js"
      );
      console.log(_data_js__WEBPACK_IMPORTED_MODULE_0__["default"]);
      console.log("---------");
      console.log("我最帅");
    },
});
```

当 index.js 中有 import 依赖时，会逐个调用**webpack_require**去执行 import 依赖函数。拿到依赖后，再往下执行 js 代码。

### Webpack5 单 entry 带 import

```javascript
(() => {
  // webpackBootstrap
  "use strict";
  // 就是webpack4里的installedMoudles
  // __webpack_modules__保存所有的module 每个import文件都对应了一个module
  var __webpack_modules__ = {
    "./src/data.js": (
      __unused_webpack_module,
      __webpack_exports__,
      __webpack_require__
    ) => {
      // 函数体
      // eval(
      __webpack_require__.r(__webpack_exports__);
      /* harmony export */

      // d就是defineProperty
      __webpack_require__.d(__webpack_exports__, {
        default: () => __WEBPACK_DEFAULT_EXPORT__,
      });
      const result = "我是文件2";
      /* harmony default export */
      const __WEBPACK_DEFAULT_EXPORT__ = result;
      // );
    },

    "./src/index.js": (
      __unused_webpack_module,
      __webpack_exports__,
      __webpack_require__
    ) => {
      __webpack_require__.r(__webpack_exports__);
      /* harmony import */
      var _data_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
        "./src/data.js"
      );
      console.log(_data_js__WEBPACK_IMPORTED_MODULE_0__.default);
      console.log("---------");
      console.log("我最帅");
    },
  };
  // The module cache
  var __webpack_module_cache__ = {};

  // The require function
  // require函数主要做了下面几件事
  // 1. 在__webpack_modules__里查找moduleId对应的module, 如果找到直接返回module.exports
  // 2. 如果没有找到，会新建一个module, 在module上挂了一个exports空对象
  // 3. 执行模块 也就是__webpack_modules__[moduleId]函数
  // 4. __webpack_modules__[moduleId]函数里会执行相应的js 例如./src/index.js
  // 然后会根据每个文件的import依赖继续向下执行__webpack_require__ 函数， 如果import的js有
  // 返回值，那么会通过Object.defineProperty 将返回值挂到module的
  // __webpack_exports__.exports的default上
  function __webpack_require__(moduleId) {
    // Check if module is in cache
    if (__webpack_module_cache__[moduleId]) {
      return __webpack_module_cache__[moduleId].exports;
    }
    // Create a new module (and put it into the cache)
    // 创建新的module并放到cache里，并在module上挂一个exports空对象
    var module = (__webpack_module_cache__[moduleId] = {
      // no module.id needed
      // no module.loaded needed
      exports: {},
    });

    // Execute the module function
    // 执行模块 不再call执行了
    __webpack_modules__[moduleId](module, module.exports, __webpack_require__);

    // Return the exports of the module
    return module.exports;
  }

  /* webpack/runtime/define property getters */
  (() => {
    // define getter functions for harmony exports
    __webpack_require__.d = (exports, definition) => {
      // 遍历 default 上的key
      for (var key in definition) {
        if (
          __webpack_require__.o(definition, key) &&
          !__webpack_require__.o(exports, key)
        ) {
          Object.defineProperty(exports, key, {
            enumerable: true, // 当且仅当该属性的 enumerable 键值为 true 时，该属性才会出现在对象的枚举属性中
            get: definition[key],
          });
        }
      }
    };
  })();

  /* webpack/runtime/hasOwnProperty shorthand */
  (() => {
    __webpack_require__.o = (obj, prop) =>
      Object.prototype.hasOwnProperty.call(obj, prop);
  })();

  /* webpack/runtime/make namespace object */
  (() => {
    // define __esModule on exports
    __webpack_require__.r = (exports) => {
      if (typeof Symbol !== "undefined" && Symbol.toStringTag) {
        Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
      }
      Object.defineProperty(exports, "__esModule", { value: true });
    };
  })();

  // startup
  // Load entry module
  __webpack_require__("./src/index.js");
  // This entry module used 'exports' so it can't be inlined
})();
```

## Webpack5 新特性

### 支持 Top Level Await

可以先看下面的代码

```javascript
// demo/index.js
let output;

async function main() {
  const dynamic = await import("./data.js");
  output = dynamic + "🍊";
}
main();

export { output };

//src/index.js
import { output } from "./demo";

console.log(output);
```

这段代码执行的结果是 undefined,因为是 main 是异步的。如果我们想要得到 `output = dynamic + "🍊";`这段的结果返回，要怎么办？

有两种办法。

1. 第一种写法

```javascript
//
// demo/index.js
const dynamic = await import("./data.js");

const output = dynamic.default + "🍊";
export default output;

//src/index.js
import output from "./demo";

console.log(output);
```

这种代码在 webpack4 时不支持，编译不通过。但是 Webpack5 是支持的。支持需要在 webpack.config.js 中配置如下属性

```javascript
//webpack.config.js

module.exports = {
  experiments: {
    topLevelAwait: true,
  },
};
```

2. 第二种写法

```javascript
// demo/index.js
const dynamic = import("./data.js");

const output = (await dynamic).default + "🍊";
export default output;
```

### Webpack5 缓存优化

使用 cache 配置，提升打包速度

```javascript
module.exports = {
  cache: {
    type: "memory | filesystem",
  },
};
```

### 废弃了很多 loader

- 废弃 url-loader 和 file-loader
  改用:

```javascript
module.exports = {
  output: {
    assetModuleFilename: "media/[name].[contenthash:5][ext]",
  },
  module: {
    test: /\.(png|jpg|jpeg|gif|eot|woff|woff2|ttf|svg|otf)$/,
    type: "asset",
  },
  experiments: {
    asset: true,
  },
};
```

-

### 废弃 webpack-dev-server

改用 webapckServe

### minSize 和 maxSize 开始管 css 大小了

Webpack4 是不管 css 的，Webpack5 开始可以管了

```javascript
module.exports = {
  optimization: {
    minSize: {
      javascript: 0,
      style: 0,
    },
    maxSize: {
      style: 300000,
    },
  },
};
```

### 异步文件支持自定义 chunckName

Webpack4 中异步模块生成的 js 是数字序号。

会有个问题。 0.js -> about.js, 1.js -> data.js。当 abort.js 注释了，data.js 就会变成 0.js。这就会破坏了缓存机制。

Webpack5 异步包有名字了。

```javascript
// webpack.config.js

module.exports = {
  optimization: {
    chunksIds: "named",
    moduleIds: "named",
  },
};
```

### 如果在 web 目录里引入了 node 模块

之前会默认带 polyfill。webpack5 支持把这些 polyfill 给去掉。配置如下

```javascript
module.exports = {
  resolve: {
    alias: {
      crypto: false,
    },
  },
};
```

### 变量预执行

Webpack 在 production 模式下回对一些没有必要的变量会预处理，替换成执行好的结果。

```javascript
//index.js
import { data } from "./data";

console.log(data);

// data.js
const data = "外部数据";
const data2 = "额外的数据";

export { data, data2 };
```

处理之后的代码为

```javascript
// index.js
console.log("外部数据");
```

## 异步模块处理机制

本节主要分析 Webpack 如何处理异步包。

### Webpack4

首先来看下 Webpack4 对异步包的处理。

```javascript
// index.js
import("./async.js").then(() => {});

import { data } from "./data";

console.log(data);

// async.js
const data2 = "我是异步数据🍊";
export default data2;

//data.js
```

打 dev 包后，会生成两个 js 文件，一个 main.js 一个 0.js

```javascript
// 0.js
// window["webpackJsonp"]是个二维数组
//
(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[0],{

  // 和同步代码一致
 "./src/async.js":(function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
const data2 = "我是异步数据🍊";
/* harmony default export */
// 把输出的data2挂到module.exports.default上
 __webpack_exports__["default"] = (data2);
 }

}]);
```

再来看下 main.js 有什么不同

```javascript
(function(modules) {
  // webpackBootstrap
  // install a JSONP callback for chunk loading
  // 异步比同步多了webpackJsonp
  // webpackJsonpCallback主要完成
  // 1. 异步模块加载数据格式的处理， 读取window['webpackJsonp']
  // 2. 把异步模块用到的chunk存缓存
  function webpackJsonpCallback(data) {
    var chunkIds = data[0]; //取异步模块的chunkId数组
    var moreModules = data[1]; // 异步模块的module数组

    // add "moreModules" to the modules object,
    // then flag all "chunkIds" as loaded and fire callback
    var moduleId,
      chunkId,
      i = 0,
      resolves = [];
    for (; i < chunkIds.length; i++) {
      chunkId = chunkIds[i];
      if (installedChunks[chunkId]) {
        resolves.push(installedChunks[chunkId][0]);
      }
      installedChunks[chunkId] = 0;
    }
    for (moduleId in moreModules) {
      if (Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
        modules[moduleId] = moreModules[moduleId];
      }
    }
    if (parentJsonpFunction) parentJsonpFunction(data);

    while (resolves.length) {
      resolves.shift()();
    }
  }

  // The module cache
  // 模块缓存
  var installedModules = {};

  // object to store loaded and loading chunks
  // undefined = chunk not loaded, null = chunk preloaded/prefetched
  // Promise = chunk loading, 0 = chunk loaded
  // 用于存储已经加载和正在加载的chunks
  // 主要有4种状态  not loaded, preloaded/prefetched , loading 和loaded
  var installedChunks = {
    main: 0,
  };

  // script path function
  function jsonpScriptSrc(chunkId) {
    return __webpack_require__.p + "" + ({}[chunkId] || chunkId) + ".js";
  }

  // The require function
  function __webpack_require__(moduleId) {
    // Check if module is in cache
    if (installedModules[moduleId]) {
      return installedModules[moduleId].exports;
    }
    // Create a new module (and put it into the cache)
    var module = (installedModules[moduleId] = {
      i: moduleId,
      l: false, // 判断加载状态的标志位
      exports: {},
    });

    // Execute the module function
    modules[moduleId].call(
      module.exports,
      module,
      module.exports,
      __webpack_require__
    );

    // Flag the module as loaded
    module.l = true;

    // Return the exports of the module
    return module.exports;
  }

  // This file contains only the entry chunk.
  // The chunk loading function for additional chunks

  __webpack_require__.e = function requireEnsure(chunkId) {
    var promises = [];

    // JSONP chunk loading for javascript

    // 在installedChunks查找异步模块包
    var installedChunkData = installedChunks[chunkId];
    if (installedChunkData !== 0) {
      // 0表示这个chunk已经加载完成
      // 0 means "already installed".

      // a Promise means "currently loading".
      if (installedChunkData) {
        // 当前chunk正在加载， 0、undefined和null都不会到这里来
        //nstalledChunkData[2] = 当前的Promise
        promises.push(installedChunkData[2]);
      } else {
        // setup Promise in chunk cache
        // 新建一个promise， 用于Install一个chunk
        var promise = new Promise(function(resolve, reject) {
          installedChunkData = installedChunks[chunkId] = [resolve, reject];
        });
        promises.push((installedChunkData[2] = promise));

        // start chunk loading
        // 开始load chunk.js
        // 1. 创建script标签 并拼装好src
        var script = document.createElement("script");
        var onScriptComplete;

        script.charset = "utf-8";
        script.timeout = 120;
        if (__webpack_require__.nc) {
          script.setAttribute("nonce", __webpack_require__.nc);
        }
        script.src = jsonpScriptSrc(chunkId);

        // 2. 定义chunk js加载完成之后的回调
        onScriptComplete = function(event) {
          // avoid mem leaks in IE.
          script.onerror = script.onload = null;
          clearTimeout(timeout);
          var chunk = installedChunks[chunkId];
          if (chunk !== 0) {
            // chunk != 0 表示，load失败 处理失败回调
            if (chunk) {
              var errorType =
                event && (event.type === "load" ? "missing" : event.type);
              var realSrc = event && event.target && event.target.src;
              var error = new Error(
                "Loading chunk " +
                  chunkId +
                  " failed.\n(" +
                  errorType +
                  ": " +
                  realSrc +
                  ")"
              );
              error.type = errorType;
              error.request = realSrc;
              chunk[1](error);
            }
            installedChunks[chunkId] = undefined;
          }
        };
        var timeout = setTimeout(function() {
          // 如果120s后还没加载完成 自动回调onScriptComplete
          onScriptComplete({ type: "timeout", target: script });
        }, 120000);
        script.onerror = script.onload = onScriptComplete;
        // 把script append到head后执行
        document.head.appendChild(script);
      }
    }
    return Promise.all(promises);
  };

  // expose the modules object (__webpack_modules__)
  __webpack_require__.m = modules;

  // expose the module cache
  __webpack_require__.c = installedModules;

  // define getter function for harmony exports
  __webpack_require__.d = function(exports, name, getter) {
    if (!__webpack_require__.o(exports, name)) {
      Object.defineProperty(exports, name, { enumerable: true, get: getter });
    }
  };

  // define __esModule on exports
  __webpack_require__.r = function(exports) {
    if (typeof Symbol !== "undefined" && Symbol.toStringTag) {
      Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
    }
    Object.defineProperty(exports, "__esModule", { value: true });
  };

  // create a fake namespace object
  // mode & 1: value is a module id, require it
  // mode & 2: merge all properties of value into the ns
  // mode & 4: return value when already ns object
  // mode & 8|1: behave like require
  __webpack_require__.t = function(value, mode) {
    if (mode & 1) value = __webpack_require__(value);
    if (mode & 8) return value;
    if (mode & 4 && typeof value === "object" && value && value.__esModule)
      return value;
    var ns = Object.create(null);
    __webpack_require__.r(ns);
    Object.defineProperty(ns, "default", { enumerable: true, value: value });
    if (mode & 2 && typeof value != "string")
      for (var key in value)
        __webpack_require__.d(
          ns,
          key,
          function(key) {
            return value[key];
          }.bind(null, key)
        );
    return ns;
  };

  // getDefaultExport function for compatibility with non-harmony modules
  __webpack_require__.n = function(module) {
    var getter =
      module && module.__esModule
        ? function getDefault() {
            return module["default"];
          }
        : function getModuleExports() {
            return module;
          };
    __webpack_require__.d(getter, "a", getter);
    return getter;
  };

  // __webpack_public_path__
  __webpack_require__.p = "";

  // on error function for async loading
  __webpack_require__.oe = function(err) {
    console.error(err);
    throw err;
  };

  // 初始化window["webpackJsonp"] 赋值给jsonpArray
  // 因为异步的包需要调用window["webpackJsonp"].push([[chunkId], [modules]])
  var jsonpArray = (window["webpackJsonp"] = window["webpackJsonp"] || []);

  // 劫持push函数 指定到自己的函数中.保存一份老的push函数
  var oldJsonpFunction = jsonpArray.push.bind(jsonpArray);

  // 重写jsonpArray.push
  jsonpArray.push = webpackJsonpCallback;
  jsonpArray = jsonpArray.slice(); // 复制一份jsonpArray
  for (var i = 0; i < jsonpArray.length; i++)
    // 执行webpackJsonpCallback  完成异步模块解析
    webpackJsonpCallback(jsonpArray[i]);
  var parentJsonpFunction = oldJsonpFunction;

  // Load entry module and return exports
  return __webpack_require__((__webpack_require__.s = "./src/index.js"));
})({
  "./src/data.js":
    /*! exports provided: data, data2 */
    function(module, __webpack_exports__, __webpack_require__) {
      "use strict";
      __webpack_require__.r(__webpack_exports__);
      /* harmony export (binding) */
      __webpack_require__.d(__webpack_exports__, "data", function() {
        return data;
      });
      /* harmony export (binding) */
      __webpack_require__.d(__webpack_exports__, "data2", function() {
        return data2;
      });
      const data = "外部数据";
      const data2 = "额外的数据";
    },

  "./src/index.js":
    /*! no exports provided */
    function(module, __webpack_exports__, __webpack_require__) {
      "use strict";
      // eval(
      __webpack_require__.r(__webpack_exports__);
      /* harmony import */
      // 同步包
      var _data__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
        "./src/data.js"
      );

      //异步包用__webpack_require__.e加载
      __webpack_require__
        .e(0) // 返回的Promise.all(promises) 这一步完成load chunk
        .then(__webpack_require__.bind(null, "./src/async.js")) //拿到chunk后 执行chunk
        .then(() => {});
      console.log(_data__WEBPACK_IMPORTED_MODULE_0__["data"]);
      // );
    },
});
```

可以看到 Webpack4 对异步包的主要处理流程就是，**webpack_require**.e 去网络请求异步 chunk.js，然后用**webpack_require**执行 chunk.js 内容，再返回执行结果，而这中间用 webpackJsonp 存储异步模块信息。

### Webpack5

同样，首先先看异步 aysnc.js

```javascript
// webpackJsonp变成了webpackChunkyd_webpack
(self["webpackChunkyd_webpack"] = self["webpackChunkyd_webpack"] || []).push([
  ["src_async_js"],
  {
    "./src/async.js": (
      __unused_webpack_module,
      __webpack_exports__,
      __webpack_require__
    ) => {
      "use strict";
      __webpack_require__.r(__webpack_exports__);
      /* harmony export */
      __webpack_require__.d(__webpack_exports__, {
        default: () => __WEBPACK_DEFAULT_EXPORT__,
      });
      const data2 = "我是异步数据🍊";
      /* harmony default export */
      const __WEBPACK_DEFAULT_EXPORT__ = data2;
    },
  },
]);
```

异步 chunk 变化不大。接下来看 main.js

```javascript
(() => {
  // webpackBootstrap
  "use strict";
  var __webpack_modules__ = {
    "./src/data.js": (
      __unused_webpack_module,
      __webpack_exports__,
      __webpack_require__
    ) => {
      eval(
        '__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   "data": () => /* binding */ data,\n/* harmony export */   "data2": () => /* binding */ data2\n/* harmony export */ });\nconst data = "外部数据";\nconst data2 = "额外的数据";\n\n\n\n\n//# sourceURL=webpack://yd-webpack/./src/data.js?'
      );
    },

    "./src/index.js": (
      __unused_webpack_module,
      __webpack_exports__,
      __webpack_require__
    ) => {
      __webpack_require__.r(__webpack_exports__);
      /* harmony import */
      var _data__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
        /*! ./data */ "./src/data.js"
      );
      __webpack_require__
        .e("src_async_js") // load 异步js
        .then(__webpack_require__.bind(__webpack_require__, "./src/async.js")) // 执行异步js
        .then(() => {});
      console.log(_data__WEBPACK_IMPORTED_MODULE_0__.data);
    },
  };
  // The module cache
  var __webpack_module_cache__ = {};

  // The require function
  // 和同步包没区别
  function __webpack_require__(moduleId) {
    // Check if module is in cache
    if (__webpack_module_cache__[moduleId]) {
      return __webpack_module_cache__[moduleId].exports;
    }
    // Create a new module (and put it into the cache)
    var module = (__webpack_module_cache__[moduleId] = {
      // no module.id needed
      // no module.loaded needed
      exports: {},
    });

    // Execute the module function
    __webpack_modules__[moduleId](module, module.exports, __webpack_require__);

    // Return the exports of the module
    return module.exports;
  }

  // expose the modules object (__webpack_modules__)
  __webpack_require__.m = __webpack_modules__;

  /************************************************************************/
  /* webpack/runtime/define property getters */
  (() => {
    // define getter functions for harmony exports
    __webpack_require__.d = (exports, definition) => {
      for (var key in definition) {
        if (
          __webpack_require__.o(definition, key) &&
          !__webpack_require__.o(exports, key)
        ) {
          Object.defineProperty(exports, key, {
            enumerable: true,
            get: definition[key],
          });
        }
      }
    };
  })();

  /* webpack/runtime/ensure chunk */
  (() => {
    __webpack_require__.f = {};
    // This file contains only the entry chunk.
    // The chunk loading function for additional chunks
    __webpack_require__.e = (chunkId) => {
      return Promise.all(
        Object.keys(__webpack_require__.f).reduce((promises, key) => {
          //__webpack_require__.f
          __webpack_require__.f[key](chunkId, promises);
          return promises;
        }, [])
      );
    };
  })();

  /* webpack/runtime/get javascript chunk filename */
  (() => {
    // This function allow to reference async chunks
    __webpack_require__.u = (chunkId) => {
      // return url for filenames based on template
      return "" + chunkId + ".js";
    };
  })();

  /* webpack/runtime/global */
  (() => {
    __webpack_require__.g = (function() {
      if (typeof globalThis === "object") return globalThis;
      try {
        return this || new Function("return this")();
      } catch (e) {
        if (typeof window === "object") return window;
      }
    })();
  })();

  /* webpack/runtime/hasOwnProperty shorthand */
  (() => {
    __webpack_require__.o = (obj, prop) =>
      Object.prototype.hasOwnProperty.call(obj, prop);
  })();

  /* webpack/runtime/load script */
  (() => {
    var inProgress = {};
    var dataWebpackPrefix = "yd-webpack:";
    // loadScript function to load a script via script tag
    __webpack_require__.l = (url, done, key) => {
      if (inProgress[url]) {
        inProgress[url].push(done);
        return;
      }
      var script, needAttach;
      if (key !== undefined) {
        var scripts = document.getElementsByTagName("script");
        for (var i = 0; i < scripts.length; i++) {
          var s = scripts[i];
          if (
            s.getAttribute("src") == url ||
            s.getAttribute("data-webpack") == dataWebpackPrefix + key
          ) {
            script = s;
            break;
          }
        }
      }
      if (!script) {
        needAttach = true;
        script = document.createElement("script");

        script.charset = "utf-8";
        script.timeout = 120;
        if (__webpack_require__.nc) {
          script.setAttribute("nonce", __webpack_require__.nc);
        }
        script.setAttribute("data-webpack", dataWebpackPrefix + key);
        script.src = url;
      }
      inProgress[url] = [done];
      var onScriptComplete = (prev, event) => {
        // avoid mem leaks in IE.
        script.onerror = script.onload = null;
        clearTimeout(timeout);
        var doneFns = inProgress[url];
        delete inProgress[url];
        script.parentNode && script.parentNode.removeChild(script);
        doneFns && doneFns.forEach((fn) => fn(event));
        if (prev) return prev(event);
      };
      var timeout = setTimeout(
        onScriptComplete.bind(null, undefined, {
          type: "timeout",
          target: script,
        }),
        120000
      );
      script.onerror = onScriptComplete.bind(null, script.onerror);
      script.onload = onScriptComplete.bind(null, script.onload);
      needAttach && document.head.appendChild(script);
    };
  })();

  /* webpack/runtime/make namespace object */
  (() => {
    // define __esModule on exports
    __webpack_require__.r = (exports) => {
      if (typeof Symbol !== "undefined" && Symbol.toStringTag) {
        Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
      }
      Object.defineProperty(exports, "__esModule", { value: true });
    };
  })();

  /* webpack/runtime/publicPath */
  (() => {
    var scriptUrl;
    if (__webpack_require__.g.importScripts)
      scriptUrl = __webpack_require__.g.location + "";
    var document = __webpack_require__.g.document;
    if (!scriptUrl && document) {
      if (document.currentScript) scriptUrl = document.currentScript.src;
      if (!scriptUrl) {
        var scripts = document.getElementsByTagName("script");
        if (scripts.length) scriptUrl = scripts[scripts.length - 1].src;
      }
    }
    // When supporting browsers where an automatic publicPath is not supported you must specify an output.publicPath manually via configuration
    // or pass an empty string ("") and set the __webpack_public_path__ variable from your code to use your own logic.
    if (!scriptUrl)
      throw new Error("Automatic publicPath is not supported in this browser");
    scriptUrl = scriptUrl
      .replace(/#.*$/, "")
      .replace(/\?.*$/, "")
      .replace(/\/[^\/]+$/, "/");
    __webpack_require__.p = scriptUrl;
  })();

  /* webpack/runtime/jsonp chunk loading */
  (() => {
    // no baseURI

    // object to store loaded and loading chunks
    // undefined = chunk not loaded, null = chunk preloaded/prefetched
    // Promise = chunk loading, 0 = chunk loaded
    var installedChunks = {
      main: 0,
    };

    __webpack_require__.f.j = (chunkId, promises) => {
      // JSONP chunk loading for javascript
      var installedChunkData = __webpack_require__.o(installedChunks, chunkId)
        ? installedChunks[chunkId]
        : undefined;
      if (installedChunkData !== 0) {
        // 0 means "already installed".

        // a Promise means "currently loading".
        if (installedChunkData) {
          promises.push(installedChunkData[2]);
        } else {
          if (true) {
            // all chunks have JS
            // setup Promise in chunk cache
            var promise = new Promise((resolve, reject) => {
              installedChunkData = installedChunks[chunkId] = [resolve, reject];
            });
            promises.push((installedChunkData[2] = promise));

            // start chunk loading
            var url = __webpack_require__.p + __webpack_require__.u(chunkId);
            // create error before stack unwound to get useful stacktrace later
            var error = new Error();
            var loadingEnded = (event) => {
              if (__webpack_require__.o(installedChunks, chunkId)) {
                installedChunkData = installedChunks[chunkId];
                if (installedChunkData !== 0)
                  installedChunks[chunkId] = undefined;
                if (installedChunkData) {
                  var errorType =
                    event && (event.type === "load" ? "missing" : event.type);
                  var realSrc = event && event.target && event.target.src;
                  error.message =
                    "Loading chunk " +
                    chunkId +
                    " failed.\n(" +
                    errorType +
                    ": " +
                    realSrc +
                    ")";
                  error.name = "ChunkLoadError";
                  error.type = errorType;
                  error.request = realSrc;
                  installedChunkData[1](error);
                }
              }
            };
            __webpack_require__.l(url, loadingEnded, "chunk-" + chunkId);
          } else installedChunks[chunkId] = 0;
        }
      }
    };

    // no prefetching

    // no preloaded

    // no HMR

    // no HMR manifest

    // no deferred startup

    // install a JSONP callback for chunk loading
    var webpackJsonpCallback = (data) => {
      var [chunkIds, moreModules, runtime] = data;
      // add "moreModules" to the modules object,
      // then flag all "chunkIds" as loaded and fire callback
      var moduleId,
        chunkId,
        i = 0,
        resolves = [];
      for (; i < chunkIds.length; i++) {
        chunkId = chunkIds[i];
        if (
          __webpack_require__.o(installedChunks, chunkId) &&
          installedChunks[chunkId]
        ) {
          resolves.push(installedChunks[chunkId][0]);
        }
        installedChunks[chunkId] = 0;
      }
      for (moduleId in moreModules) {
        if (__webpack_require__.o(moreModules, moduleId)) {
          __webpack_require__.m[moduleId] = moreModules[moduleId];
        }
      }
      if (runtime) runtime(__webpack_require__);
      parentChunkLoadingFunction(data);
      while (resolves.length) {
        resolves.shift()();
      }
    };

    var chunkLoadingGlobal = (self["webpackChunkyd_webpack"] =
      self["webpackChunkyd_webpack"] || []);

    // 劫持push
    var parentChunkLoadingFunction = chunkLoadingGlobal.push.bind(
      chunkLoadingGlobal
    );
    chunkLoadingGlobal.push = webpackJsonpCallback;
  })();
  // startup
  // Load entry module
  __webpack_require__("./src/index.js");
  // This entry module used 'exports' so it can't be inlined
})();
```

Webpack5 里和 Webpack4 对异步包的流程基本一致。只是有些方法写法变了。
