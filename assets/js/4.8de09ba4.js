(window.webpackJsonp=window.webpackJsonp||[]).push([[4],{379:function(s,t,a){s.exports=a.p+"assets/img/nodejs_system.473717bb.png"},380:function(s,t,a){s.exports=a.p+"assets/img/async_io.9e7abbf2.png"},381:function(s,t,a){s.exports=a.p+"assets/img/scavenge.ff175e4c.jpg"},382:function(s,t,a){s.exports=a.p+"assets/img/gc_time.94bd51cf.png"},383:function(s,t,a){s.exports=a.p+"assets/img/gc_paralle.b4675a54.png"},384:function(s,t,a){s.exports=a.p+"assets/img/mark.1d402511.jpg"},385:function(s,t,a){s.exports=a.p+"assets/img/service_jq.3acbd232.jpg"},509:function(s,t,a){"use strict";a.r(t);var n=a(42),e=Object(n.a)({},(function(){var s=this,t=s.$createElement,n=s._self._c||t;return n("ContentSlotsDistributor",{attrs:{"slot-key":s.$parent.slotKey}},[n("h1",{attrs:{id:"nodejs-初探"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#nodejs-初探"}},[s._v("#")]),s._v(" Nodejs 初探")]),s._v(" "),n("h2",{attrs:{id:"nodejs-异步-io-原理浅析及优化方案"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#nodejs-异步-io-原理浅析及优化方案"}},[s._v("#")]),s._v(" Nodejs 异步 IO 原理浅析及优化方案")]),s._v(" "),n("h3",{attrs:{id:"异步-io-的好处"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#异步-io-的好处"}},[s._v("#")]),s._v(" 异步 IO 的好处")]),s._v(" "),n("ul",[n("li",[s._v("前端通过异步 IO 消除 UI 阻塞")]),s._v(" "),n("li",[s._v("并发请求耗时短")]),s._v(" "),n("li",[s._v("I/O 是昂贵的，分布式 I/O 是更昂贵的")]),s._v(" "),n("li",[s._v("Nodejs 适用于 IO 密集型，不适用 CPU 密集型。适用于 IO 密集型是因为 nodejs 是异步的，不适用 CPU 密集型是因为 nodejs 是单线程的。")])]),s._v(" "),n("p",[s._v("异步 IO 虽然好，但也不是所有的东西都用异步就好，同步和异步有一个平衡点。")]),s._v(" "),n("h3",{attrs:{id:"nodejs-对异步-io-的实现"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#nodejs-对异步-io-的实现"}},[s._v("#")]),s._v(" Nodejs 对异步 IO 的实现")]),s._v(" "),n("p",[s._v("完美的异步 IO 应该是应用程序发起非阻塞调用，无需通过遍历等方式轮询。\n"),n("img",{attrs:{src:a(379),alt:""}})]),s._v(" "),n("ol",[n("li",[s._v("application 是我们写的应用")]),s._v(" "),n("li",[s._v("V8：用来解析、执行 js 代码的运行环境。")]),s._v(" "),n("li",[s._v("node bindings: nodejs 程序的 main 函数入口。这一层由 C++编写，是 js 与底层 C/C++沟通的桥梁。")]),s._v(" "),n("li",[s._v("libuv:管理异步 IO，封装了自定义的线程池。")])]),s._v(" "),n("p",[s._v("异步 IO 的流程：\n"),n("img",{attrs:{src:a(380),alt:""}})]),s._v(" "),n("h3",{attrs:{id:"宏任务和微任务"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#宏任务和微任务"}},[s._v("#")]),s._v(" 宏任务和微任务")]),s._v(" "),n("p",[s._v("异步任务分为宏任务和微任务。\n能够触发宏任务的操作有：")]),s._v(" "),n("ul",[n("li",[s._v("script 整体代码")]),s._v(" "),n("li",[s._v("I/O 操作（网络、读文件等）")]),s._v(" "),n("li",[s._v("setTimeout")]),s._v(" "),n("li",[s._v("setInterval")]),s._v(" "),n("li",[s._v("UI rendering(js 绑定事件等)")])]),s._v(" "),n("p",[s._v("触发微任务的操作有：")]),s._v(" "),n("ul",[n("li",[s._v("Promise")]),s._v(" "),n("li",[s._v("Objct.oberve")]),s._v(" "),n("li",[s._v("MutationObserver")]),s._v(" "),n("li",[s._v("process.nextTick")])]),s._v(" "),n("p",[s._v("这些任务的优先级如下：\n同步任务执行 > idle 观察者 > Promise.then > io 观察者 > check 观察者")]),s._v(" "),n("h3",{attrs:{id:"宏任务与微任务的执行顺序"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#宏任务与微任务的执行顺序"}},[s._v("#")]),s._v(" 宏任务与微任务的执行顺序")]),s._v(" "),n("p",[s._v("在 Node11 之前 Node 的宏任务微任务执行顺序不一样，在 Node11 之后就是一样的。")]),s._v(" "),n("p",[s._v("顺序为： 初始宏任务(js 的执行) -> 执行所有的微任务 -> 执行下一个宏任务 -> 所有的微任务。")]),s._v(" "),n("div",{staticClass:"language-javascript line-numbers-mode"},[n("pre",{pre:!0,attrs:{class:"language-javascript"}},[n("code",[s._v("console"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),n("span",{pre:!0,attrs:{class:"token function"}},[s._v("log")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),n("span",{pre:!0,attrs:{class:"token string"}},[s._v('"js脚本"')]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n"),n("span",{pre:!0,attrs:{class:"token function"}},[s._v("setTimeout")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),n("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("function")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n  console"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),n("span",{pre:!0,attrs:{class:"token function"}},[s._v("log")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),n("span",{pre:!0,attrs:{class:"token string"}},[s._v('"timeout1:宏任务"')]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n  "),n("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("new")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token class-name"}},[s._v("Promise")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),n("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("function")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),n("span",{pre:!0,attrs:{class:"token parameter"}},[s._v("resolve"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v(" reject")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n    "),n("span",{pre:!0,attrs:{class:"token function"}},[s._v("resolve")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n  "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),n("span",{pre:!0,attrs:{class:"token function"}},[s._v("then")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=>")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n    console"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),n("span",{pre:!0,attrs:{class:"token function"}},[s._v("log")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),n("span",{pre:!0,attrs:{class:"token string"}},[s._v('"promise1:微任务"')]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n  "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n  "),n("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("new")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token class-name"}},[s._v("Promise")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),n("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("function")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),n("span",{pre:!0,attrs:{class:"token parameter"}},[s._v("resolve"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v(" reject")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n    "),n("span",{pre:!0,attrs:{class:"token function"}},[s._v("resolve")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n  "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),n("span",{pre:!0,attrs:{class:"token function"}},[s._v("then")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=>")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n    console"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),n("span",{pre:!0,attrs:{class:"token function"}},[s._v("log")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),n("span",{pre:!0,attrs:{class:"token string"}},[s._v('"promise2:微任务"')]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n  "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n\n"),n("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("new")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token class-name"}},[s._v("Promise")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),n("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("function")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),n("span",{pre:!0,attrs:{class:"token parameter"}},[s._v("resolve"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v(" reject")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n  "),n("span",{pre:!0,attrs:{class:"token function"}},[s._v("resolve")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),n("span",{pre:!0,attrs:{class:"token function"}},[s._v("then")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=>")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n  console"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),n("span",{pre:!0,attrs:{class:"token function"}},[s._v("log")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),n("span",{pre:!0,attrs:{class:"token string"}},[s._v('"promise3:微任务"')]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n\nprocess"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),n("span",{pre:!0,attrs:{class:"token function"}},[s._v("nextTick")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),n("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("function")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n  console"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),n("span",{pre:!0,attrs:{class:"token function"}},[s._v("log")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),n("span",{pre:!0,attrs:{class:"token string"}},[s._v('"nextTick1:微任务"')]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n\n"),n("span",{pre:!0,attrs:{class:"token function"}},[s._v("setTimeout")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),n("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("function")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n  console"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),n("span",{pre:!0,attrs:{class:"token function"}},[s._v("log")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),n("span",{pre:!0,attrs:{class:"token string"}},[s._v('"timeout2:宏任务"')]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n\n"),n("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("new")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token class-name"}},[s._v("Promise")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),n("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("function")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),n("span",{pre:!0,attrs:{class:"token parameter"}},[s._v("resolve"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v(" reject")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n  "),n("span",{pre:!0,attrs:{class:"token function"}},[s._v("resolve")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),n("span",{pre:!0,attrs:{class:"token function"}},[s._v("then")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=>")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n  console"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),n("span",{pre:!0,attrs:{class:"token function"}},[s._v("log")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),n("span",{pre:!0,attrs:{class:"token string"}},[s._v('"promise4:微任务"')]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n")])]),s._v(" "),n("div",{staticClass:"line-numbers-wrapper"},[n("span",{staticClass:"line-number"},[s._v("1")]),n("br"),n("span",{staticClass:"line-number"},[s._v("2")]),n("br"),n("span",{staticClass:"line-number"},[s._v("3")]),n("br"),n("span",{staticClass:"line-number"},[s._v("4")]),n("br"),n("span",{staticClass:"line-number"},[s._v("5")]),n("br"),n("span",{staticClass:"line-number"},[s._v("6")]),n("br"),n("span",{staticClass:"line-number"},[s._v("7")]),n("br"),n("span",{staticClass:"line-number"},[s._v("8")]),n("br"),n("span",{staticClass:"line-number"},[s._v("9")]),n("br"),n("span",{staticClass:"line-number"},[s._v("10")]),n("br"),n("span",{staticClass:"line-number"},[s._v("11")]),n("br"),n("span",{staticClass:"line-number"},[s._v("12")]),n("br"),n("span",{staticClass:"line-number"},[s._v("13")]),n("br"),n("span",{staticClass:"line-number"},[s._v("14")]),n("br"),n("span",{staticClass:"line-number"},[s._v("15")]),n("br"),n("span",{staticClass:"line-number"},[s._v("16")]),n("br"),n("span",{staticClass:"line-number"},[s._v("17")]),n("br"),n("span",{staticClass:"line-number"},[s._v("18")]),n("br"),n("span",{staticClass:"line-number"},[s._v("19")]),n("br"),n("span",{staticClass:"line-number"},[s._v("20")]),n("br"),n("span",{staticClass:"line-number"},[s._v("21")]),n("br"),n("span",{staticClass:"line-number"},[s._v("22")]),n("br"),n("span",{staticClass:"line-number"},[s._v("23")]),n("br"),n("span",{staticClass:"line-number"},[s._v("24")]),n("br"),n("span",{staticClass:"line-number"},[s._v("25")]),n("br"),n("span",{staticClass:"line-number"},[s._v("26")]),n("br"),n("span",{staticClass:"line-number"},[s._v("27")]),n("br"),n("span",{staticClass:"line-number"},[s._v("28")]),n("br"),n("span",{staticClass:"line-number"},[s._v("29")]),n("br"),n("span",{staticClass:"line-number"},[s._v("30")]),n("br"),n("span",{staticClass:"line-number"},[s._v("31")]),n("br"),n("span",{staticClass:"line-number"},[s._v("32")]),n("br"),n("span",{staticClass:"line-number"},[s._v("33")]),n("br"),n("span",{staticClass:"line-number"},[s._v("34")]),n("br")])]),n("p",[s._v("输出结果：")]),s._v(" "),n("div",{staticClass:"language-javascript line-numbers-mode"},[n("pre",{pre:!0,attrs:{class:"language-javascript"}},[n("code",[s._v("js脚本"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\nnextTick1"),n("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" 微任务"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\npromise3"),n("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" 微任务"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\npromise4"),n("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" 微任务"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\ntimeout1"),n("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" 宏任务"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\npromise1"),n("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" 微任务"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\npromise2"),n("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" 微任务"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\ntimeout2"),n("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" 宏任务"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n")])]),s._v(" "),n("div",{staticClass:"line-numbers-wrapper"},[n("span",{staticClass:"line-number"},[s._v("1")]),n("br"),n("span",{staticClass:"line-number"},[s._v("2")]),n("br"),n("span",{staticClass:"line-number"},[s._v("3")]),n("br"),n("span",{staticClass:"line-number"},[s._v("4")]),n("br"),n("span",{staticClass:"line-number"},[s._v("5")]),n("br"),n("span",{staticClass:"line-number"},[s._v("6")]),n("br"),n("span",{staticClass:"line-number"},[s._v("7")]),n("br"),n("span",{staticClass:"line-number"},[s._v("8")]),n("br")])]),n("h3",{attrs:{id:"几个特殊的-api"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#几个特殊的-api"}},[s._v("#")]),s._v(" 几个特殊的 API")]),s._v(" "),n("p",[s._v("这几个 API 线程池不参与。")]),s._v(" "),n("ul",[n("li",[s._v("setTimeout 和 setInterval")]),s._v(" "),n("li",[s._v("process.nextTick()。实现类似 setTimeout(function(){}, 0)。每次放入队列中，在下一个循环中取出。")]),s._v(" "),n("li",[s._v("setImmediate()。比 process.nextTick()优先级低。")])]),s._v(" "),n("p",[s._v("这几个不受 event loop 管，那谁负责？Nodejs 中有三个观察者：idle 观察者，IO 观察者和 check 观察者。idle 观察者负责 process.nextTick(), IO 观察者负责 setTimeOut(), check 观察者负责 setImmdiate()。")]),s._v(" "),n("h3",{attrs:{id:"实现一个-sleep"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#实现一个-sleep"}},[s._v("#")]),s._v(" 实现一个 sleep")]),s._v(" "),n("div",{staticClass:"language-javascript line-numbers-mode"},[n("pre",{pre:!0,attrs:{class:"language-javascript"}},[n("code",[n("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("function")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token function"}},[s._v("sleep")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),n("span",{pre:!0,attrs:{class:"token parameter"}},[s._v("ms")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n  "),n("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("return")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("new")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token class-name"}},[s._v("Promise")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),n("span",{pre:!0,attrs:{class:"token parameter"}},[s._v("resolve")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=>")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token function"}},[s._v("setTimeout")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),s._v("resolve"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v(" ms"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n\n"),n("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("async")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("function")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token function"}},[s._v("test")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n  console"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),n("span",{pre:!0,attrs:{class:"token function"}},[s._v("log")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),n("span",{pre:!0,attrs:{class:"token string"}},[s._v('"hello"')]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n  "),n("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("await")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token function"}},[s._v("sleep")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),n("span",{pre:!0,attrs:{class:"token number"}},[s._v("1000")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n  console"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),n("span",{pre:!0,attrs:{class:"token function"}},[s._v("log")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),n("span",{pre:!0,attrs:{class:"token string"}},[s._v('"world"')]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n\n"),n("span",{pre:!0,attrs:{class:"token function"}},[s._v("test")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n")])]),s._v(" "),n("div",{staticClass:"line-numbers-wrapper"},[n("span",{staticClass:"line-number"},[s._v("1")]),n("br"),n("span",{staticClass:"line-number"},[s._v("2")]),n("br"),n("span",{staticClass:"line-number"},[s._v("3")]),n("br"),n("span",{staticClass:"line-number"},[s._v("4")]),n("br"),n("span",{staticClass:"line-number"},[s._v("5")]),n("br"),n("span",{staticClass:"line-number"},[s._v("6")]),n("br"),n("span",{staticClass:"line-number"},[s._v("7")]),n("br"),n("span",{staticClass:"line-number"},[s._v("8")]),n("br"),n("span",{staticClass:"line-number"},[s._v("9")]),n("br"),n("span",{staticClass:"line-number"},[s._v("10")]),n("br"),n("span",{staticClass:"line-number"},[s._v("11")]),n("br")])]),n("h3",{attrs:{id:"函数式编程在-node-中的应用"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#函数式编程在-node-中的应用"}},[s._v("#")]),s._v(" 函数式编程在 Node 中的应用")]),s._v(" "),n("ol",[n("li",[s._v("高阶函数：将函数作为输入或者返回值，形成一种后续传递风格的结果接收方式，而非单一的返回值形式。后续传递风格的程序将函数业务重点从返回值传递到回调函数中。\n如：")])]),s._v(" "),n("div",{staticClass:"language-javascript line-numbers-mode"},[n("pre",{pre:!0,attrs:{class:"language-javascript"}},[n("code",[s._v("app"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),n("span",{pre:!0,attrs:{class:"token function"}},[s._v("use")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),n("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("function")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),n("span",{pre:!0,attrs:{class:"token comment"}},[s._v("//todo});")]),s._v("\n"),n("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("var")]),s._v(" emitter "),n("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("new")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token class-name"}},[s._v("events"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("EventEmitter")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\nemitter"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),n("span",{pre:!0,attrs:{class:"token function"}},[s._v("on")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),n("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("function")]),n("span",{pre:!0,attrs:{class:"token operator"}},[s._v("*")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n")])]),s._v(" "),n("div",{staticClass:"line-numbers-wrapper"},[n("span",{staticClass:"line-number"},[s._v("1")]),n("br"),n("span",{staticClass:"line-number"},[s._v("2")]),n("br"),n("span",{staticClass:"line-number"},[s._v("3")]),n("br")])]),n("ol",{attrs:{start:"2"}},[n("li",[s._v("偏函数：指定部分函数产生一个新的定制函数的形式就是偏函数。Node 中异步编程非常常见，underscore,after 变量。")])]),s._v(" "),n("h3",{attrs:{id:"常用-node-控制异步技术手段"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#常用-node-控制异步技术手段"}},[s._v("#")]),s._v(" 常用 Node 控制异步技术手段")]),s._v(" "),n("ul",[n("li",[s._v("step, wind, bigpipe, Qjs")]),s._v(" "),n("li",[s._v("async, await")]),s._v(" "),n("li",[s._v("Promise/Defferred")]),s._v(" "),n("li",[s._v("由于 Node 基于 V8 的原因，目前还不支持协程")]),s._v(" "),n("li",[s._v("协程相对独立，有自己的上下文，其切换由自己控制。线程的切换受系统控制。")])]),s._v(" "),n("h2",{attrs:{id:"nodejs-内存管理及内存优化"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#nodejs-内存管理及内存优化"}},[s._v("#")]),s._v(" Nodejs 内存管理及内存优化")]),s._v(" "),n("h3",{attrs:{id:"v8-垃圾回收机制-1"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#v8-垃圾回收机制-1"}},[s._v("#")]),s._v(" V8 垃圾回收机制 1")]),s._v(" "),n("ul",[n("li",[s._v("Node 使用 Javascript， 在服务端最大操作内存对象受到了一定得限制（堆区），64 位系统下约为 1.4GB, 栈区 32 位操作系统下是 0.7G, 新生代 64 位是 32M，32 位是 16M")])]),s._v(" "),n("div",{staticClass:"language-javascript line-numbers-mode"},[n("pre",{pre:!0,attrs:{class:"language-javascript"}},[n("code",[s._v("node "),n("span",{pre:!0,attrs:{class:"token operator"}},[s._v("--")]),s._v("max"),n("span",{pre:!0,attrs:{class:"token operator"}},[s._v("-")]),n("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("new")]),n("span",{pre:!0,attrs:{class:"token operator"}},[s._v("-")]),s._v("space"),n("span",{pre:!0,attrs:{class:"token operator"}},[s._v("-")]),s._v("size app"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("js\n"),n("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// --max-lod-space-size")]),s._v("\n")])]),s._v(" "),n("div",{staticClass:"line-numbers-wrapper"},[n("span",{staticClass:"line-number"},[s._v("1")]),n("br"),n("span",{staticClass:"line-number"},[s._v("2")]),n("br")])]),n("ul",[n("li",[s._v("Process.memoryUsage -> rss、heapTotal、heapUsed")]),s._v(" "),n("li",[s._v("V8 的垃圾回收策略主要基于分代式垃圾回收机制。在自动垃圾回收的演变过程中没有一种垃圾回收算法能够胜任所有场景。V8 中内存分为新生代和老生代两代。新生代为存活时间较短对象，老生代中为存活时间较长的对象。")])]),s._v(" "),n("h3",{attrs:{id:"v8-垃圾回收机制-2"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#v8-垃圾回收机制-2"}},[s._v("#")]),s._v(" V8 垃圾回收机制 2")]),s._v(" "),n("ul",[n("li",[n("p",[s._v("目前 V8 采用了两个垃圾回收器，主垃圾回收器-Major GC - 主要负责老生代的垃圾回收，副垃圾回收器 - Minor GC--Scavenger 主要负责新生代的垃圾回收。两代的设计受到”代际假说“的影响。")])]),s._v(" "),n("li",[n("p",[s._v("第一个是大部分对象都是朝生夕死的。形容有些变量存活时间很短。\n第二个是不死的对象，会活的很久，比如全局的 window、DOM，webapi 等对象。")])])]),s._v(" "),n("p",[s._v("新生代和老生代的垃圾回收有各自的策略：")]),s._v(" "),n("h3",{attrs:{id:"新生代垃圾回收"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#新生代垃圾回收"}},[s._v("#")]),s._v(" 新生代垃圾回收")]),s._v(" "),n("p",[s._v("新生代垃圾回收主要通过 Scavenge 算法进行，具体实现采用了 Cheney 算法。Cheney 算法是一种采用复制的方式实现的垃圾回收算法。它将内存一分为二，每一个空间称为 semispace。这两个 semispace 一个处于使用，一个处于闲置。处于使用的称之为 From，闲置的称为 To。分配对象时先分配到 From，当开始进行垃圾回收时，检查 From 存活对象复制到 To。非存活对象被释放。然后互换位置。再次进行回收，发现被回收过直接晋升到老生代，或者发现 To 空间已经使用了超过 25%。")]),s._v(" "),n("p",[n("img",{attrs:{src:a(381),alt:""}})]),s._v(" "),n("p",[s._v("它的缺点是只能使用堆内存的一半，这是一个典型的空间换时间的办法，但是新生代声明周期较短，很适合这个算法。")]),s._v(" "),n("h3",{attrs:{id:"老生代垃圾回收"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#老生代垃圾回收"}},[s._v("#")]),s._v(" 老生代垃圾回收")]),s._v(" "),n("p",[s._v("老生代主要采用 Mark-Sweep 和 Mark-Compact。使用 Scavenge 不合适，一个是对象较多需要赋值量太大，二是没能解决空间问题。")]),s._v(" "),n("p",[s._v("Mark-Sweep 是标记清除，标记那些死亡的对象然后清除。但是清除之后会出现内存不连续的情况。所以要使用 Mark-Compact。")]),s._v(" "),n("p",[s._v("Mark-Compact 是基于 Mark-Sweep 演变而来，它先将活着的对象移到一边，移动完成后，直接清理边界外的内存。当 CPU 空间不足时会非常的高效。")]),s._v(" "),n("p",[s._v("V8 后续还引入了延迟处理、增量处理，计划引入并行标记处理。")]),s._v(" "),n("h3",{attrs:{id:"什么时候启动-gc"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#什么时候启动-gc"}},[s._v("#")]),s._v(" 什么时候启动 GC")]),s._v(" "),n("p",[s._v("如下图所示，在新生代中有两个指针，扫描指针和分配指针。最开始扫描指针和分配指针重叠。然后扫描指针采用广度优先的方式遍历 GC_ROOT，不停地拷贝对象到 To。")]),s._v(" "),n("p",[s._v("老生代中只有一个指针扫描老生代空间，通过标记清除合并方法管理资源。浏览器的 Memory 快照中的 distance 就是引用计数清除的依据。")]),s._v(" "),n("p",[n("img",{attrs:{src:a(382),alt:""}})]),s._v(" "),n("p",[s._v("垃圾回收是通过扫描 GC_Root(全局的 window 对象（位于每个 iframe 中）， 文档 dom 对象，存放栈上变量)标记空间中活动对象和非活动对象，从 GC_Root 对象出发，遍历 GC_Root 中的所有对象，能遍历到的是可访问的，应保证这些对象在内存中保留；通过 GC_Root 没有遍历到的对象是不可访问对象，被称为非活动对象，可能被回收。")]),s._v(" "),n("h3",{attrs:{id:"v8-垃圾回收执行效率"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#v8-垃圾回收执行效率"}},[s._v("#")]),s._v(" V8 垃圾回收执行效率")]),s._v(" "),n("p",[s._v("如主线程停下来 GC，会造成卡顿。V8 内部提供了并行、并发、增量等垃圾回收技术")]),s._v(" "),n("ul",[n("li",[s._v("并行回收。在执行一个完整的垃圾回收过程中，垃圾回收器会使用多个辅助线程来并行执行垃圾回收。")]),s._v(" "),n("li",[s._v("增量回收。垃圾回收器将标记工作分解为更小的块，并且穿插在主线程不同的任务之间执行。")]),s._v(" "),n("li",[s._v("并发回收。回收线程在执行 js 的过程，辅助线程能够在后台完成执行垃圾回收的操作。")])]),s._v(" "),n("p",[n("img",{attrs:{src:a(383),alt:""}})]),s._v(" "),n("h3",{attrs:{id:"v8-怎么执行标记"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#v8-怎么执行标记"}},[s._v("#")]),s._v(" V8 怎么执行标记")]),s._v(" "),n("p",[s._v("V8 提出了三色标记法。黑色、白色和灰色。黑色表示这个节点被 GC_Root 引用到了，而且该节点的子节点都已经标记完成了。白色表示这个节点没有被访问到。如果在本轮遍历结束时还是白色，那么这块数据就会被收回。灰色表示这个节点被 GC_Root 引用到，但子节点还没被垃圾回收器标记处理，也表明目前正在处理这个节点。")]),s._v(" "),n("p",[s._v("为什么会有灰色？window.a={};window.a.b={};window.a.b.c={}。下图二扫描完一遍后，window.a.b=[]，导致 b 切开了，d 确实是闲置。增量垃圾回收器添加了一个约束条件：不能让黑色节点指向白色节点。写屏障机制(write-barrier)会强制将被引用的白色节点变成灰色的，这样就保证了黑色节点不能指向白色节点的约束条件。这个方法也称为强三色不变性。因为在标记结束时的所有白色对象，对于垃圾回收器来说，都是不可到达的，可以安全释放。在 V8 中每次执行如 window.a.b=value 的写操作之后，V8 会插入写屏障代码，强制将 value 这块内存标记为灰色。下一次遍历会从灰色节点开始遍历。")]),s._v(" "),n("p",[n("img",{attrs:{src:a(384),alt:""}})]),s._v(" "),n("h2",{attrs:{id:"服务集群管理与-node-集群的应用"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#服务集群管理与-node-集群的应用"}},[s._v("#")]),s._v(" 服务集群管理与 Node 集群的应用")]),s._v(" "),n("h3",{attrs:{id:"上线预备流程"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#上线预备流程"}},[s._v("#")]),s._v(" 上线预备流程")]),s._v(" "),n("ul",[n("li",[s._v("前端工程化的搭载动态文件的 MAP 分析压缩打包合并至 CDN")]),s._v(" "),n("li",[s._v("单测、压测 性能分析工具发现 bug")]),s._v(" "),n("li",[s._v("编写 nginx-conf 实现负载均衡和反向代理")]),s._v(" "),n("li",[s._v("pm2 启动应用程序小流量灰度上线")])]),s._v(" "),n("h3",{attrs:{id:"服务器集群"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#服务器集群"}},[s._v("#")]),s._v(" 服务器集群")]),s._v(" "),n("p",[n("img",{attrs:{src:a(385),alt:""}})]),s._v(" "),n("h2",{attrs:{id:"pm2-拉起进程的原理"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#pm2-拉起进程的原理"}},[s._v("#")]),s._v(" pm2 拉起进程的原理")]),s._v(" "),n("p",[s._v("nodejs 擅长处理 io 密集型程序，用 pm2 的 cluster 模式启动程序时，会在每个 CPU 上 fork 一个子进程。主进程监控子进程的运行，如果子进程挂了会重新拉起。")]),s._v(" "),n("p",[s._v("一个进程 fork 后，进程的代码、数据、文件、寄存器都会复制一遍，所以子进程也会执行下面的代码，子进程执行的时候就会启动应用服务。")]),s._v(" "),n("div",{staticClass:"language-javascript line-numbers-mode"},[n("pre",{pre:!0,attrs:{class:"language-javascript"}},[n("code",[n("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// master")]),s._v("\n"),n("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("var")]),s._v(" cluster "),n("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token function"}},[s._v("require")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),n("span",{pre:!0,attrs:{class:"token string"}},[s._v('"cluster"')]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token comment"}},[s._v("//进程相关")]),s._v("\n"),n("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("var")]),s._v(" numCPUs "),n("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token function"}},[s._v("require")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),n("span",{pre:!0,attrs:{class:"token string"}},[s._v('"os"')]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),n("span",{pre:!0,attrs:{class:"token function"}},[s._v("cpus")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("length"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token comment"}},[s._v("//获取CPU数目，返回cpu核数")]),s._v("\n\n"),n("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("if")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),s._v("cluster"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("isMaster"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n  "),n("span",{pre:!0,attrs:{class:"token comment"}},[s._v("//判断当前进程是不是主进程")]),s._v("\n  console"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),n("span",{pre:!0,attrs:{class:"token function"}},[s._v("log")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),s._v("numCPUs"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n  "),n("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("for")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),n("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("var")]),s._v(" i "),n("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token number"}},[s._v("0")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v(" i "),n("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),s._v(" numCPUs"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v(" i"),n("span",{pre:!0,attrs:{class:"token operator"}},[s._v("++")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n    "),n("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("var")]),s._v(" worker "),n("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" cluster"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),n("span",{pre:!0,attrs:{class:"token function"}},[s._v("fork")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n  "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("else")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n  "),n("span",{pre:!0,attrs:{class:"token function"}},[s._v("require")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),n("span",{pre:!0,attrs:{class:"token string"}},[s._v('"./app.js"')]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token comment"}},[s._v("//不是主进程，起服务")]),s._v("\n"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n")])]),s._v(" "),n("div",{staticClass:"line-numbers-wrapper"},[n("span",{staticClass:"line-number"},[s._v("1")]),n("br"),n("span",{staticClass:"line-number"},[s._v("2")]),n("br"),n("span",{staticClass:"line-number"},[s._v("3")]),n("br"),n("span",{staticClass:"line-number"},[s._v("4")]),n("br"),n("span",{staticClass:"line-number"},[s._v("5")]),n("br"),n("span",{staticClass:"line-number"},[s._v("6")]),n("br"),n("span",{staticClass:"line-number"},[s._v("7")]),n("br"),n("span",{staticClass:"line-number"},[s._v("8")]),n("br"),n("span",{staticClass:"line-number"},[s._v("9")]),n("br"),n("span",{staticClass:"line-number"},[s._v("10")]),n("br"),n("span",{staticClass:"line-number"},[s._v("11")]),n("br"),n("span",{staticClass:"line-number"},[s._v("12")]),n("br"),n("span",{staticClass:"line-number"},[s._v("13")]),n("br")])])])}),[],!1,null,null,null);t.default=e.exports}}]);