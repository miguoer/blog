web_front = [
  {
    title: "HTML核心知识",
    collapsable: false,
    children: ["html-core/html-core", "html-core/cross-origin"],
  },
  {
    title: "JavaScript核心知识",
    collapsable: false,
    children: [
      "js-core/js-core",
      "js-core/this",
      "js-core/closure",
      "js-core/call&apply",
      "js-core/prototype",
      "js-core/es6-es10",
      "js-core/easy-error",
    ],
  },
  {
    title: "函数式编程",
    collapsable: false,
    children: [
      "function-program/function-program",
      "function-program/fp-functor",
    ],
  },

  {
    title: "Nodejs",
    collapsable: false,
    children: [
      "nodejs/nodejs",
      "nodejs/http-cache",
      "nodejs/https",
      "nodejs/http-next",
      "nodejs/node-part-one",
    ],
  },

  {
    title: "前端工程化",
    collapsable: false,
    children: [
      "engineering/engineering",
      "engineering/build-tools",
      "engineering/node-di",
      "engineering/ci-cd",
      "engineering/quality",
      "engineering/test",
    ],
  },
  {
    title: "前端性能优化",
    collapsable: false,
    children: [
      "performance/basic-server",
      "performance/chrome-render-mechanic",
      "performance/performance",
      "performance/browser-render-process",
      "performance/browser-render-param",
      "performance/nodejs-promote",
      "performance/promote-deep",
      "performance/webpack-promote",
      "performance/react-ssr",
    ],
  },
  {
    title: "框架源码理解",
    collapsable: false,
    children: [
      "framework/framework-react",
      "framework/framework-react02",
      "framework/framework-react03",
      "framework/framework-react04",
      "framework/framework-react05",
      "framework/framework-redux",
      "framework/framework-redux02",
      "framework/framework-recoil",
      "framework/framework-webpack01",
      "framework/framework-webpack02",
      "framework/framework-webpack03",
      "framework/framework-webpack04",
      "framework/framework-koa",
      "framework/framework-v8-01",
      "framework/framework-v8-02",
      "framework/framework-v8-03",
      "framework/framework-jsstack",
      "framework/framework-jsobject",

      "framework/framework-vue3",
      "framework/framework-vuex",
    ],
  },
  {
    title: "微前端",
    collapsable: false,
    children: [
      "micro-frontend/micro-frontend",
      "micro-frontend/micro-frontend-01",
      "micro-frontend/micro-frontend-02",
    ],
  },
  {
    title: "CSS",
    collapsable: false,
    children: [
      "css/css",
      "css/css-houdini",
      "css/css-matrix",
      "css/css-technics",
      "css/css-lib",
      "css/css-compatiable",
    ],
  },
  {
    title: "手写系列",
    collapsable: false,
    children: [
      "hand-write/hand-write",
      "hand-write/json",
      "hand-write/call",
      "hand-write/bind",
      "hand-write/extend",
      "hand-write/curry",
      "hand-write/promise",
      "hand-write/throttle",
      "hand-write/clone",
      "hand-write/instanceof",
      "hand-write/drag",
      "hand-write/settimeout",
      "hand-write/object",
      "hand-write/event",
      "hand-write/redux",
      "hand-write/koa",
    ],
  },
  {
    title: "项目架子",
    collapsable: false,
    children: [
      "project-framework/project-framework",
      "project-framework/monitor",
    ],
  },
];

const algorithm = [
  {
    title: "leetcode",
    collapsable: false,
    children: ["leetcode/leetcode", "leetcode/tree"],
  },
];

const design_pattern = {
  title: "设计模式",
};

const android = {
  title: "安卓",
};

module.exports = {
  "/web-front/": web_front,
  "/algorithm/": algorithm,
};
