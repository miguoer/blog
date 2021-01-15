# Webpack5和4的核心原理分析（一）

## 文件指纹区别

Hash: 和整个项目的构建相关，只要项目文件有修改，整个项目的hash值就会更改

Chunkhash: 和Webpack打包的chunk有关，不同的entry会生成不同的chunkhash值

Contenthash: 根据文件内容来定义，文件内容不变，则contenthash值不变

## watch
如果开了watch会轮询判断文件的最后编辑时间是否变化，某个文件发生了变化，不会立刻告诉监听这，而是先缓存起来，等 aggregateTimeout。webpack中的watch是使用了一个第三方的watch库

## 走进entry

### webpack4 单entry
假设entryjs文件如下:
```javascript
// index.js
const result = "我最帅";
console.log(result);
```

经过webpack编译之后生成的代码为:
```javascript
(function (modules) {
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
  /******/ /******/ __webpack_require__.d = function (exports, name, getter) {
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
  /******/ /******/ __webpack_require__.r = function (exports) {
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
  /******/ /******/ /******/ /******/ /******/ /******/ __webpack_require__.t = function (
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
          function (key) {
            return value[key];
          }.bind(null, key)
        );
    /******/ return ns;
    /******/
  }; // getDefaultExport function for compatibility with non-harmony modules
  /******/
  /******/ /******/ __webpack_require__.n = function (module) {
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
  /******/ /******/ __webpack_require__.o = function (object, property) {
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
  "./src/index.js": function (module, exports) {
    eval(
      'const result = "我最帅";\nconsole.log(result);\n\n\n//# sourceURL=webpack:///./src/index.js?'
    );
  },
});
```
可以看到 业务代码被放在了闭包里面执行，并且使用了eval。注意，开发环境有eval，打生产包的时候就没有了。生产环境编译之后为:

```javascript
!(function (e) {
  var t = {};
  function n(r) {
    if (t[r]) return t[r].exports;
    var o = (t[r] = { i: r, l: !1, exports: {} });
    return e[r].call(o.exports, o, o.exports, n), (o.l = !0), o.exports;
  }
  (n.m = e),
    (n.c = t),
    (n.d = function (e, t, r) {
      n.o(e, t) || Object.defineProperty(e, t, { enumerable: !0, get: r });
    }),
    (n.r = function (e) {
      "undefined" != typeof Symbol &&
        Symbol.toStringTag &&
        Object.defineProperty(e, Symbol.toStringTag, { value: "Module" }),
        Object.defineProperty(e, "__esModule", { value: !0 });
    }),
    (n.t = function (e, t) {
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
            function (t) {
              return e[t];
            }.bind(null, o)
          );
      return r;
    }),
    (n.n = function (e) {
      var t =
        e && e.__esModule
          ? function () {
              return e.default;
            }
          : function () {
              return e;
            };
      return n.d(t, "a", t), t;
    }),
    (n.o = function (e, t) {
      return Object.prototype.hasOwnProperty.call(e, t);
    }),
    (n.p = ""),
    n((n.s = 0));
})([
  function (e, t) {
    console.log("我最帅");
  },
]);
```
### Webpack5 单entry
来看下，与上面例子相同的代码webpack5会编译成什么样。
```javascript
(() => {
  eval(
    "// import data from './data.js';\n// console.log(data);\n// console.log('---------');\n// console.log('京程一灯');\nconst result = \"我最帅\";\nconsole.log(result);\n\n// import('./index.wasm').then(() => {});\n// import wasm from './index.wasm';\n// console.log(wasm);\n\n\n//# sourceURL=webpack://yd-webpack/./src/index.js?"
  );
})();

```
Webpack5非常简洁，就一个eval，执行代码。

Webpack5有两个非常重要的变化， 第一个是当文件没有额外的import时，就不用模块化的规范，直接eval执行。第二是，在Webpack4时，在生成的过程中，带了很多浏览器的polyfill，由于Webpack在开发的过程中，浏览器已经发生了翻天覆地的变化，就把很多polyfill干掉了，可以显示的指定带或者不带。


### Webpack4 带import

```javascript
//index.js
import data from "./data.js";
console.log(data);
console.log("---------");
console.log("我最帅");

//data.js
const result = '我是文件2';

export default result;
```

打包之后的代码：
```javascript
(function (modules) {
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
  __webpack_require__.d = function (exports, name, getter) {
    if (!__webpack_require__.o(exports, name)) {
      Object.defineProperty(exports, name, { enumerable: true, get: getter });
    }
  };

  // define __esModule on exports
  __webpack_require__.r = function (exports) {
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
  __webpack_require__.t = function (value, mode) {
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
          function (key) {
            return value[key];
          }.bind(null, key)
        );
    return ns;
  };

  // getDefaultExport function for compatibility with non-harmony modules
  __webpack_require__.n = function (module) {
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
  __webpack_require__.o = function (object, property) {
    return Object.prototype.hasOwnProperty.call(object, property);
  };

  // __webpack_public_path__
  __webpack_require__.p = "";

  // Load entry module and return exports
  return __webpack_require__((__webpack_require__.s = "./src/index.js"));
})({
  "./src/data.js":
    /*! exports provided: default */
    function (module, __webpack_exports__, __webpack_require__) {
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
    function (module, __webpack_exports__, __webpack_require__) {
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
当index.js中有import依赖时，会逐个调用__webpack_require__去执行import依赖函数。拿到依赖后，再往下执行js代码。

### Webpack5单entry 带import
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

## Webpack5新特性

### 支持Top Level Await
可以先看下面的代码
```javascript
// demo/index.js
let output;

async function main() {
  const dynamic = await import("./data.js");
  output = dynamic + "🍊";
}
main()

export { output };

//src/index.js
import { output } from "./demo";

console.log(output);


```
这段代码执行的结果是undefined,因为是main是异步的。如果我们想要得到 `output = dynamic + "🍊";`这段的结果返回，要怎么办？

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
这种代码在webpack4时不支持，编译不通过。但是Webpack5是支持的。支持需要在webpack.config.js中配置如下属性
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

const output = (await dynamic).default + "🍊"
export default output;
```

### Webpack5缓存优化
使用cache配置，提升打包速度
```javascript
 module.exports = {
   cache:{
     type:"memory | filesystem"
   }
 }

```

### 废弃了很多loader
- 废弃url-loader和file-loader
改用: 
```javascript

module.exports = {
  output:{
        assetModuleFilename: 'media/[name].[contenthash:5][ext]',

  },
  module: {
        test: /\.(png|jpg|jpeg|gif|eot|woff|woff2|ttf|svg|otf)$/,
        type: 'asset',
      },
   experiments: {
    asset: true,
  },     
  
}

```

- 

### 废弃webpack-dev-server
改用webapckServe

### minSize和maxSize开始管css大小了
Webpack4是不管css的，Webpack5开始可以管了

```javascript
module.exports = {
  optimization: {
    minSize:{
      javascript:0,
      style:0
    },
    maxSize:{
      style: 300000
    }

  }
}

```

### 异步文件支持自定义chunckName
Webpack4中异步模块生成的js是数字序号。

会有个问题。 0.js -> about.js, 1.js -> data.js。当abort.js注释了，data.js就会变成0.js。这就会破坏了缓存机制。

Webpack5异步包有名字了。

```javascript
// webpack.config.js

module.exports = {
  optimization: {
    chunksIds: 'named',
    moduleIds: 'named'
  }
}
```
