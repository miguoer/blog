(window.webpackJsonp=window.webpackJsonp||[]).push([[3],{362:function(s,t,a){s.exports=a.p+"assets/img/v8_04.59c16c89.jpg"},363:function(s,t,a){s.exports=a.p+"assets/img/v8_05.8714b49d.jpg"},364:function(s,t,a){s.exports=a.p+"assets/img/v8_06.e265bcb3.jpg"},365:function(s,t,a){s.exports=a.p+"assets/img/v8_07.73304eb3.jpg"},366:function(s,t,a){s.exports=a.p+"assets/img/v8_09.ae8b9030.jpg"},367:function(s,t,a){s.exports=a.p+"assets/img/v8_10.91165ca5.jpg"},368:function(s,t,a){s.exports=a.p+"assets/img/v8_11.522b75fc.jpg"},369:function(s,t,a){s.exports=a.p+"assets/img/v8_12.c4f68f06.jpg"},370:function(s,t,a){s.exports=a.p+"assets/img/v8_13.e6fe4de5.jpg"},371:function(s,t,a){s.exports=a.p+"assets/img/v8_08.84bc9a79.jpg"},466:function(s,t,a){"use strict";a.r(t);var n=a(42),e=Object(n.a)({},(function(){var s=this,t=s.$createElement,n=s._self._c||t;return n("ContentSlotsDistributor",{attrs:{"slot-key":s.$parent.slotKey}},[n("h1",{attrs:{id:"v8-源码分析-三-执行过程"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#v8-源码分析-三-执行过程"}},[s._v("#")]),s._v(" V8 源码分析（三）- 执行过程")]),s._v(" "),n("h2",{attrs:{id:"libuv"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#libuv"}},[s._v("#")]),s._v(" libuv")]),s._v(" "),n("p",[s._v("libuv 不属于 V8，但是在执行过程中扮演了一个很重要的角色。")]),s._v(" "),n("p",[s._v("在 node.js 启动时，创建了⼀个类似 while(true)的循环体，每次执⾏⼀次循环体称为⼀次 tick，类似于饭店的厨师。每个 tick 的过程就是查看是否有事件等待处理，如果有，则取出事件极及其相关的\n回调函数并执⾏，然后执⾏下⼀次 tick。它的执⾏逻辑是，先询问事件观察者当前是否有任务需要执⾏？观察者回答“有”，于是取出\nA 执⾏，A 是否有回调函数？如果有（如果没有则继续询问当前是否有任务需要执⾏），则取出回调函数并执⾏(注意：回调函数的执⾏基本都是异步的，可能不⽌⼀个回调)，执⾏完回调后通过某种⽅式通知调⽤者，我执⾏完了，并把执⾏结果给你，主函数不需要不断询问回调函数执⾏结果，回调函数会以通知的⽅式告知调⽤者我执⾏完了，⽽这个过程主线程并不需要等待回调函数执⾏完成，它会继续向前执⾏，直到观察者回答没有了，线程结束。")]),s._v(" "),n("p",[n("img",{attrs:{src:a(362),alt:""}})]),s._v(" "),n("p",[s._v("事件循环是⼀个典型的⽣产者、消费者模型。异步 IO、⽹络请求等则是事件的⽣产者，源源不断为 Node 提供不同类型事件，这些事件被传到观察者哪⾥，事件则从观察者哪⾥取出事件并处理。")]),s._v(" "),n("p",[s._v("需要注意的是浏览器的 Event Loop 和 Nodejs 中的 Event Loop 是不一样的。")]),s._v(" "),n("p",[s._v("浏览器的是同步执行队列和异步调用栈，事件循环主要就是栈的出栈入栈过程。")]),s._v(" "),n("p",[s._v("Node 中靠的是观察者。")]),s._v(" "),n("div",{staticClass:"language-javascript line-numbers-mode"},[n("pre",{pre:!0,attrs:{class:"language-javascript"}},[n("code",[s._v("    "),n("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// main.c")]),s._v("\nint "),n("span",{pre:!0,attrs:{class:"token function"}},[s._v("main")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n    "),n("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// 创建一个default_loop")]),s._v("\n    loop "),n("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token function"}},[s._v("uv_default_loop")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n\n    uv_tcp_t server"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n    "),n("span",{pre:!0,attrs:{class:"token function"}},[s._v("uv_tcp_init")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),s._v("loop"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token operator"}},[s._v("&")]),s._v("server"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n\n    struct sockaddr_in bind_addr"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n    "),n("span",{pre:!0,attrs:{class:"token function"}},[s._v("uv_ip4_addr")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),n("span",{pre:!0,attrs:{class:"token string"}},[s._v('"0.0.0.0"')]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token number"}},[s._v("7000")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token operator"}},[s._v("&")]),s._v("bind_addr"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n    "),n("span",{pre:!0,attrs:{class:"token function"}},[s._v("uv_tcp_bind")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),n("span",{pre:!0,attrs:{class:"token operator"}},[s._v("&")]),s._v("server"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),n("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("const")]),s._v(" struct sockaddr "),n("span",{pre:!0,attrs:{class:"token operator"}},[s._v("*")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),n("span",{pre:!0,attrs:{class:"token operator"}},[s._v("&")]),s._v("bind_addr"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token number"}},[s._v("0")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n    int r "),n("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token function"}},[s._v("uv_listen")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),s._v("uv_stream_t"),n("span",{pre:!0,attrs:{class:"token operator"}},[s._v("*")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token operator"}},[s._v("&")]),s._v("server"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token number"}},[s._v("128")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v(" on_new_connection"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n    "),n("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("if")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),s._v("r"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n        "),n("span",{pre:!0,attrs:{class:"token function"}},[s._v("fprintf")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),s._v("stderr"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token string"}},[s._v('"Listen error %s\\n"')]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token function"}},[s._v("uv_err_name")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),s._v("r"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n        "),n("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("return")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token number"}},[s._v("1")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n    "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n    "),n("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// 启动")]),s._v("\n    "),n("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("return")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token function"}},[s._v("uv_run")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),s._v("loop"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token constant"}},[s._v("UV_RUN_DEFAULT")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n\n"),n("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// uv_run")]),s._v("\n\n\nint "),n("span",{pre:!0,attrs:{class:"token function"}},[s._v("uv_run")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),n("span",{pre:!0,attrs:{class:"token parameter"}},[s._v("uv_loop_t"),n("span",{pre:!0,attrs:{class:"token operator"}},[s._v("*")]),s._v(" loop"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v(" uv_run_mode mode")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n  int timeout"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n  int r"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n  int ran_pending"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n\n  "),n("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// 检查Loop是否还有异步任务")]),s._v("\n  r "),n("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token function"}},[s._v("uv__loop_alive")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),s._v("loop"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n  "),n("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("if")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),n("span",{pre:!0,attrs:{class:"token operator"}},[s._v("!")]),s._v("r"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v("\n    "),n("span",{pre:!0,attrs:{class:"token function"}},[s._v("uv__update_time")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),s._v("loop"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n  "),n("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// while true 不断从事件循环里取")]),s._v("\n  "),n("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("while")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),s._v("r "),n("span",{pre:!0,attrs:{class:"token operator"}},[s._v("!=")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token number"}},[s._v("0")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token operator"}},[s._v("&&")]),s._v(" loop"),n("span",{pre:!0,attrs:{class:"token operator"}},[s._v("-")]),n("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v("stop_flag "),n("span",{pre:!0,attrs:{class:"token operator"}},[s._v("==")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token number"}},[s._v("0")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n    "),n("span",{pre:!0,attrs:{class:"token function"}},[s._v("uv__update_time")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),s._v("loop"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n    "),n("span",{pre:!0,attrs:{class:"token function"}},[s._v("uv__run_timers")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),s._v("loop"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n    ran_pending "),n("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token function"}},[s._v("uv__run_pending")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),s._v("loop"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n    "),n("span",{pre:!0,attrs:{class:"token function"}},[s._v("uv__run_idle")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),s._v("loop"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n    "),n("span",{pre:!0,attrs:{class:"token function"}},[s._v("uv__run_prepare")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),s._v("loop"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n\n    timeout "),n("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token number"}},[s._v("0")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n    "),n("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("if")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),s._v("mode "),n("span",{pre:!0,attrs:{class:"token operator"}},[s._v("==")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token constant"}},[s._v("UV_RUN_ONCE")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token operator"}},[s._v("&&")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token operator"}},[s._v("!")]),s._v("ran_pending"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token operator"}},[s._v("||")]),s._v(" mode "),n("span",{pre:!0,attrs:{class:"token operator"}},[s._v("==")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token constant"}},[s._v("UV_RUN_DEFAULT")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v("\n      timeout "),n("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token function"}},[s._v("uv_backend_timeout")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),s._v("loop"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n\n    "),n("span",{pre:!0,attrs:{class:"token function"}},[s._v("uv__io_poll")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),s._v("loop"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v(" timeout"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n\n    "),n("span",{pre:!0,attrs:{class:"token comment"}},[s._v("/* Run one final update on the provider_idle_time in case uv__io_poll\n     * returned because the timeout expired, but no events were received. This\n     * call will be ignored if the provider_entry_time was either never set (if\n     * the timeout == 0) or was already updated b/c an event was received.\n     */")]),s._v("\n    "),n("span",{pre:!0,attrs:{class:"token function"}},[s._v("uv__metrics_update_idle_time")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),s._v("loop"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n\n    "),n("span",{pre:!0,attrs:{class:"token function"}},[s._v("uv__run_check")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),s._v("loop"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n    "),n("span",{pre:!0,attrs:{class:"token function"}},[s._v("uv__run_closing_handles")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),s._v("loop"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n\n    "),n("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("if")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),s._v("mode "),n("span",{pre:!0,attrs:{class:"token operator"}},[s._v("==")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token constant"}},[s._v("UV_RUN_ONCE")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n      "),n("span",{pre:!0,attrs:{class:"token comment"}},[s._v("/* UV_RUN_ONCE implies forward progress: at least one callback must have\n       * been invoked when it returns. uv__io_poll() can return without doing\n       * I/O (meaning: no callbacks) when its timeout expires - which means we\n       * have pending timers that satisfy the forward progress constraint.\n       *\n       * UV_RUN_NOWAIT makes no guarantees about progress so it's omitted from\n       * the check.\n       */")]),s._v("\n      "),n("span",{pre:!0,attrs:{class:"token function"}},[s._v("uv__update_time")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),s._v("loop"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n      "),n("span",{pre:!0,attrs:{class:"token function"}},[s._v("uv__run_timers")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),s._v("loop"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n    "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n\n    r "),n("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token function"}},[s._v("uv__loop_alive")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),s._v("loop"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n    "),n("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("if")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),s._v("mode "),n("span",{pre:!0,attrs:{class:"token operator"}},[s._v("==")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token constant"}},[s._v("UV_RUN_ONCE")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token operator"}},[s._v("||")]),s._v(" mode "),n("span",{pre:!0,attrs:{class:"token operator"}},[s._v("==")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token constant"}},[s._v("UV_RUN_NOWAIT")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v("\n      "),n("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("break")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n  "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n\n  "),n("span",{pre:!0,attrs:{class:"token comment"}},[s._v("/* The if statement lets gcc compile it to a conditional store. Avoids\n   * dirtying a cache line.\n   */")]),s._v("\n  "),n("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("if")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),s._v("loop"),n("span",{pre:!0,attrs:{class:"token operator"}},[s._v("-")]),n("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v("stop_flag "),n("span",{pre:!0,attrs:{class:"token operator"}},[s._v("!=")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token number"}},[s._v("0")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v("\n    loop"),n("span",{pre:!0,attrs:{class:"token operator"}},[s._v("-")]),n("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v("stop_flag "),n("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token number"}},[s._v("0")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n\n  "),n("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("return")]),s._v(" r"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n\n\n")])]),s._v(" "),n("div",{staticClass:"line-numbers-wrapper"},[n("span",{staticClass:"line-number"},[s._v("1")]),n("br"),n("span",{staticClass:"line-number"},[s._v("2")]),n("br"),n("span",{staticClass:"line-number"},[s._v("3")]),n("br"),n("span",{staticClass:"line-number"},[s._v("4")]),n("br"),n("span",{staticClass:"line-number"},[s._v("5")]),n("br"),n("span",{staticClass:"line-number"},[s._v("6")]),n("br"),n("span",{staticClass:"line-number"},[s._v("7")]),n("br"),n("span",{staticClass:"line-number"},[s._v("8")]),n("br"),n("span",{staticClass:"line-number"},[s._v("9")]),n("br"),n("span",{staticClass:"line-number"},[s._v("10")]),n("br"),n("span",{staticClass:"line-number"},[s._v("11")]),n("br"),n("span",{staticClass:"line-number"},[s._v("12")]),n("br"),n("span",{staticClass:"line-number"},[s._v("13")]),n("br"),n("span",{staticClass:"line-number"},[s._v("14")]),n("br"),n("span",{staticClass:"line-number"},[s._v("15")]),n("br"),n("span",{staticClass:"line-number"},[s._v("16")]),n("br"),n("span",{staticClass:"line-number"},[s._v("17")]),n("br"),n("span",{staticClass:"line-number"},[s._v("18")]),n("br"),n("span",{staticClass:"line-number"},[s._v("19")]),n("br"),n("span",{staticClass:"line-number"},[s._v("20")]),n("br"),n("span",{staticClass:"line-number"},[s._v("21")]),n("br"),n("span",{staticClass:"line-number"},[s._v("22")]),n("br"),n("span",{staticClass:"line-number"},[s._v("23")]),n("br"),n("span",{staticClass:"line-number"},[s._v("24")]),n("br"),n("span",{staticClass:"line-number"},[s._v("25")]),n("br"),n("span",{staticClass:"line-number"},[s._v("26")]),n("br"),n("span",{staticClass:"line-number"},[s._v("27")]),n("br"),n("span",{staticClass:"line-number"},[s._v("28")]),n("br"),n("span",{staticClass:"line-number"},[s._v("29")]),n("br"),n("span",{staticClass:"line-number"},[s._v("30")]),n("br"),n("span",{staticClass:"line-number"},[s._v("31")]),n("br"),n("span",{staticClass:"line-number"},[s._v("32")]),n("br"),n("span",{staticClass:"line-number"},[s._v("33")]),n("br"),n("span",{staticClass:"line-number"},[s._v("34")]),n("br"),n("span",{staticClass:"line-number"},[s._v("35")]),n("br"),n("span",{staticClass:"line-number"},[s._v("36")]),n("br"),n("span",{staticClass:"line-number"},[s._v("37")]),n("br"),n("span",{staticClass:"line-number"},[s._v("38")]),n("br"),n("span",{staticClass:"line-number"},[s._v("39")]),n("br"),n("span",{staticClass:"line-number"},[s._v("40")]),n("br"),n("span",{staticClass:"line-number"},[s._v("41")]),n("br"),n("span",{staticClass:"line-number"},[s._v("42")]),n("br"),n("span",{staticClass:"line-number"},[s._v("43")]),n("br"),n("span",{staticClass:"line-number"},[s._v("44")]),n("br"),n("span",{staticClass:"line-number"},[s._v("45")]),n("br"),n("span",{staticClass:"line-number"},[s._v("46")]),n("br"),n("span",{staticClass:"line-number"},[s._v("47")]),n("br"),n("span",{staticClass:"line-number"},[s._v("48")]),n("br"),n("span",{staticClass:"line-number"},[s._v("49")]),n("br"),n("span",{staticClass:"line-number"},[s._v("50")]),n("br"),n("span",{staticClass:"line-number"},[s._v("51")]),n("br"),n("span",{staticClass:"line-number"},[s._v("52")]),n("br"),n("span",{staticClass:"line-number"},[s._v("53")]),n("br"),n("span",{staticClass:"line-number"},[s._v("54")]),n("br"),n("span",{staticClass:"line-number"},[s._v("55")]),n("br"),n("span",{staticClass:"line-number"},[s._v("56")]),n("br"),n("span",{staticClass:"line-number"},[s._v("57")]),n("br"),n("span",{staticClass:"line-number"},[s._v("58")]),n("br"),n("span",{staticClass:"line-number"},[s._v("59")]),n("br"),n("span",{staticClass:"line-number"},[s._v("60")]),n("br"),n("span",{staticClass:"line-number"},[s._v("61")]),n("br"),n("span",{staticClass:"line-number"},[s._v("62")]),n("br"),n("span",{staticClass:"line-number"},[s._v("63")]),n("br"),n("span",{staticClass:"line-number"},[s._v("64")]),n("br"),n("span",{staticClass:"line-number"},[s._v("65")]),n("br"),n("span",{staticClass:"line-number"},[s._v("66")]),n("br"),n("span",{staticClass:"line-number"},[s._v("67")]),n("br"),n("span",{staticClass:"line-number"},[s._v("68")]),n("br"),n("span",{staticClass:"line-number"},[s._v("69")]),n("br"),n("span",{staticClass:"line-number"},[s._v("70")]),n("br"),n("span",{staticClass:"line-number"},[s._v("71")]),n("br"),n("span",{staticClass:"line-number"},[s._v("72")]),n("br"),n("span",{staticClass:"line-number"},[s._v("73")]),n("br"),n("span",{staticClass:"line-number"},[s._v("74")]),n("br"),n("span",{staticClass:"line-number"},[s._v("75")]),n("br"),n("span",{staticClass:"line-number"},[s._v("76")]),n("br"),n("span",{staticClass:"line-number"},[s._v("77")]),n("br"),n("span",{staticClass:"line-number"},[s._v("78")]),n("br"),n("span",{staticClass:"line-number"},[s._v("79")]),n("br"),n("span",{staticClass:"line-number"},[s._v("80")]),n("br"),n("span",{staticClass:"line-number"},[s._v("81")]),n("br"),n("span",{staticClass:"line-number"},[s._v("82")]),n("br"),n("span",{staticClass:"line-number"},[s._v("83")]),n("br"),n("span",{staticClass:"line-number"},[s._v("84")]),n("br")])]),n("h3",{attrs:{id:"观察者"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#观察者"}},[s._v("#")]),s._v(" 观察者")]),s._v(" "),n("p",[s._v("libuv 中的观察者分为 idle 观察者，IO 观察者和 Check 观察者。\n"),n("img",{attrs:{src:a(363),alt:""}}),s._v("\n这几个观察者的优先级为： idle 观察者>Promise.then> IO 观察者> check 观察者。")]),s._v(" "),n("p",[s._v("事件循环中的异步队列有两种，macro task(宏任务)和 micro task（微任务）。宏任务可以有多个，微任务队列只有一个。")]),s._v(" "),n("ul",[n("li",[s._v("macro task: script(整体代码)、setTimeout、setInteval、setImmediate，I/O, UI rendering")]),s._v(" "),n("li",[s._v("micro-task: process.nextTick，Promise（原生）、Object.observe、MutationObserver。")])]),s._v(" "),n("h3",{attrs:{id:"libuv-的-7-个执行阶段"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#libuv-的-7-个执行阶段"}},[s._v("#")]),s._v(" Libuv 的 7 个执行阶段")]),s._v(" "),n("ol",[n("li",[n("p",[s._v("update_time\n为了获取系统时间，以保证之后的 timer 有计时的目标，避免过多的系统调用影响性能")])]),s._v(" "),n("li",[n("p",[s._v("timers\n要检查是否有到期的 timer，也就是 setTimeout 和 setInterval 的 timer")])]),s._v(" "),n("li",[n("p",[s._v("I/O callbacks(epoll, kqueue,IOCP)\nI/O 异步事件的回调，比如文件读取 I/O，网络 IO，当这些 IO 动作都结束时调用。")])]),s._v(" "),n("li",[n("p",[s._v("idle,prepare。\n这个阶段内部做一些动作，如果节点处理为 active 状态，每个时间循环都会被执行。也就是 process.nextTick 中。")])]),s._v(" "),n("li",[n("p",[s._v("I/O poll\n调用各平台提供的 IO 多路复用接口，最多等待 timerout 时间，记录 timeout 自己维护状态，在适当的条件下进行了阻塞。")])]),s._v(" "),n("li",[n("p",[s._v("check\n执行 setImmediate 操作")])]),s._v(" "),n("li",[n("p",[s._v("close callbacks\n关闭 I/O 的动作，比如文件描述符的关闭，连接断开等等。")])])]),s._v(" "),n("p",[n("img",{attrs:{src:a(364),alt:""}})]),s._v(" "),n("p",[n("img",{attrs:{src:a(365),alt:""}})]),s._v(" "),n("h2",{attrs:{id:"dsl-nlp-ast"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#dsl-nlp-ast"}},[s._v("#")]),s._v(" DSL NLP AST")]),s._v(" "),n("ol",[n("li",[s._v("领域特定语⾔指的是专注于某个应⽤程序领域的计算机语\n⾔。")])]),s._v(" "),n("p",[s._v("外部 DSL：宿主应⽤的代码采⽤⽂本解析技术对外部 DSL 编写的脚本进⾏解析。如：正则表达式、SQL、配置⽂件、\nkoa-swig 模板引擎如 mustache 以及 React、Vue ⽀持的 JSX 语法都属于外部 DSL 等")]),s._v(" "),n("p",[s._v("内部 DSL：通⽤语⾔的特定语法，⽤内部 DSL 写成的脚本是⼀段合法的程序。⽐如 PHP C# Java、 jQuery 就可以认为是针对 DOM 操作的⼀种内部 DSL。")]),s._v(" "),n("p",[s._v("语法噪⾳：(2).weeks().ago() -> (2).weeks.ago ，(Lambda 表达式本质上是⼀种直观易读且延迟执⾏的逻辑表达能⼒，从⽽避免额外的解析⼯作，不过它强依托宿主的语⾔特性⽀持(匿名函数 + 箭头表示)，并且也会引⼊⼀定的语法噪⾳)")]),s._v(" "),n("ol",{attrs:{start:"2"}},[n("li",[n("p",[s._v("抽象语法树（abstract syntax tree 或者缩写为 AST），或者语法树（syntax tree），是 DSL 的抽象语法结构的树状表现形式。")])]),s._v(" "),n("li",[n("p",[s._v("NLP 是自然语言处理")])])]),s._v(" "),n("p",[n("img",{attrs:{src:a(366),alt:""}})]),s._v(" "),n("h2",{attrs:{id:"v8-运行原理-浏览器"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#v8-运行原理-浏览器"}},[s._v("#")]),s._v(" V8 运行原理（浏览器）")]),s._v(" "),n("p",[s._v("V8 引擎由两个主要部分组成")]),s._v(" "),n("ol",[n("li",[s._v("memory heap(内存堆)。这是内存分配地址的地方。闭包，原型链，对象都在内存堆中。")]),s._v(" "),n("li",[s._v("Call Stack(调用堆栈)。代码执行的地方。")]),s._v(" "),n("li",[s._v("堆外内存。主要是 buffer")])]),s._v(" "),n("p",[s._v("有些浏览器的 API 经常被使用，比如 setTimeout，但是这些 API 并不是引擎提供的。所以我们还有很多引擎之外的 API，我们把这些 API 称为 Web APIs，比如说 DOM、AJAX、setTimeout 等。")]),s._v(" "),n("p",[n("img",{attrs:{src:a(367),alt:""}})]),s._v(" "),n("h2",{attrs:{id:"v8-重要的概念"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#v8-重要的概念"}},[s._v("#")]),s._v(" V8 重要的概念")]),s._v(" "),n("ol",[n("li",[s._v("闭包")]),s._v(" "),n("li",[s._v("一等公民")]),s._v(" "),n("li",[s._v("惰性解析")])]),s._v(" "),n("ul",[n("li",[n("p",[s._v("在 C/C++ 中，你不可以在⼀个函数中定义另外⼀个函数，JavaScript 中函数是⼀等公⺠，本质是因为 JavaScript 函数在 V8 中是 JSFunction 的实例，它实际是 V8 中的⼀个 C++ 对象。C++ 对象是 C++ 世界中当之⽆愧的⼀等公⺠，JavaScript 函数当然也是。（你可以在函数中声明⼀个变量，当然你也可以在函数中声明⼀个函数。C 语⾔编译器把 C 语⾔函数编译成机器码，V8 把 JavaScript 函数编译成 C++ 对象）")])]),s._v(" "),n("li",[n("p",[s._v("惰性解析是指解析器在解析的过程中，如果遇到函数声明，那么会跳过函数内部的代码，并不会为\n其⽣成 AST 和字节码，⽽仅仅⽣成顶层代码的 AST 和字节码。利⽤惰性解析可以加速 JavaScript 代码的启动速度，如果要将所有的代码⼀次性解析编译完成，那么会⼤⼤增加⽤户的等待时间。（现在已经不用了，中间版本用过）")])]),s._v(" "),n("li",[n("p",[s._v("JavaScript 是⼀⻔天⽣⽀持闭包的语⾔，闭包会引⽤当前函数作⽤域之外的变量，所以当 V8 解析⼀个函数的时候，还需要判断该函数的内部函数是否引⽤了当前函数内部声明的变量，如果引⽤了，需要将该变量存放到堆中，即便当前函数执⾏结束之后，也不会释放该变量（称预解析）。")])])]),s._v(" "),n("ul",[n("li",[s._v("V8 第⼀次执⾏⼀段代码时，会编译源 JavaScript 代码，并将编译后的⼆进制代码缓存在内存中，内存缓存（in-memory cache)。然后通过 JavaScript 源⽂件的字符串在内存中查找对应的编译后的⼆进制代码。V8 除了采⽤将代码缓存在内存中策略之外，还会将代码缓存到硬盘上。")])]),s._v(" "),n("h3",{attrs:{id:"v8-历史"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#v8-历史"}},[s._v("#")]),s._v(" V8 历史")]),s._v(" "),n("p",[s._v("在 V8 5.9 之前 V8 引擎用了两个编译器，没有解释器，全部直接生成机器码。")]),s._v(" "),n("p",[s._v("5.9 发布以后，其中的 Ignition 字节码解释器将默认启动，v8 自此回到了字节码的怀抱。这次 V8 引入字节码却是向着相反的方向后退。因为之前所有 js 代码编译成机器码缓存下来，因为这样不仅缓存占用的内存、磁盘空间很大，而且退出 Chrome 再打开时序列化、反序列化缓存所花费的时间也很长，时间、空间成本都接受不了。所以 V8 退而求其次，只编译最外层的 js 代码，也就是下图这个例子里面绿色的部分。那么内部的代码（如下图中的黄色、红色的部分）是什么时候编译的呢？v8 推迟到第一次被调用的时候再编译。这时间上的推导致被解析多次——绿色的代码一次、黄色的代码再解析一次（当 new Person 被调用）、红色的代码再解析一次（当 doWork() 被调用）。因此，如果你的 js 代码的闭包套了 n 层，那么最终他们至少会被 v8 解析 n 次。所以http://crbug.com/593477第二次执行时间会变长（发\n现第一次加载时 v8.CompileScript 花费了 165 ms，再次加载加入 V8.ParseLazy 居然依然花费了 376 ms。）")]),s._v(" "),n("p",[s._v("V8 为了减轻机器码占用的内存空间，提高代码的启动速度，对 V8 进行了重构。有了字节码，v8 可以朝着简化的架构方向发展，消除 Cranshaft 这个旧的编译器，并让新的 Turbofan 直接从字节码来优化代码，并当需要进行反优化的时候直接反优化到字节码，而不需要再考虑 JS 源代码。Ignition + TurboFan 的组合，就是字节码解释器 + JIT 编译器的黄金组合。")]),s._v(" "),n("p",[n("img",{attrs:{src:a(368),alt:""}})]),s._v(" "),n("h2",{attrs:{id:"v8-落叶归根"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#v8-落叶归根"}},[s._v("#")]),s._v(" V8 落叶归根")]),s._v(" "),n("p",[n("img",{attrs:{src:a(369),alt:""}})]),s._v(" "),n("ol",[n("li",[s._v("源代码->词法分析->生成 token -> 语法分析-> AST -> AST 优化 -> 字节码 -> 字节码优化 -> 优化完成交给 run bytecode(JIT)（callee stack, ao, vo , go 就在这里生成的）-> 字节码执行完成产生 callee stack -> AO VO GO 和 scope 作用域链 -> 执行 Javascript 代码。在执行 script 代码过程，如果发现有异步任务，会推到异步队列中。")]),s._v(" "),n("li",[s._v("marcotask: setTimeout, setInterval, setImmdiate, Message Channel, I/O, UI rendering, network")]),s._v(" "),n("li",[s._v("mircotask: process.netxTick, Promise, MutationObserver")])]),s._v(" "),n("p",[s._v("例子:\n"),n("img",{attrs:{src:a(370),alt:""}})]),s._v(" "),n("h2",{attrs:{id:"v8-性能调优"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#v8-性能调优"}},[s._v("#")]),s._v(" V8 性能调优")]),s._v(" "),n("p",[s._v("V8 为什么这个高效？如下图:")]),s._v(" "),n("p",[n("img",{attrs:{src:a(371),alt:""}})]),s._v(" "),n("h3",{attrs:{id:"类型检查、优化去优化"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#类型检查、优化去优化"}},[s._v("#")]),s._v(" 类型检查、优化去优化")]),s._v(" "),n("p",[s._v("V8 使用 type feedback 做动态检查，一般而言会在编译阶段提前检查。检查之后，使用该类型作为动态类型，如果检查失败了，就会去优化。去优化之后，可能会中解释器运行中间码。")]),s._v(" "),n("div",{staticClass:"language-javascript line-numbers-mode"},[n("pre",{pre:!0,attrs:{class:"language-javascript"}},[n("code",[n("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("function")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token function"}},[s._v("t")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),n("span",{pre:!0,attrs:{class:"token parameter"}},[s._v("a"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v(" b")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n  "),n("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("this")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("a "),n("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" a"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n\n"),n("span",{pre:!0,attrs:{class:"token function"}},[s._v("f")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),n("span",{pre:!0,attrs:{class:"token number"}},[s._v("1")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token number"}},[s._v("1")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n"),n("span",{pre:!0,attrs:{class:"token function"}},[s._v("f")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),n("span",{pre:!0,attrs:{class:"token number"}},[s._v("1")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token number"}},[s._v("2")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n"),n("span",{pre:!0,attrs:{class:"token function"}},[s._v("f")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),n("span",{pre:!0,attrs:{class:"token number"}},[s._v("1")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token number"}},[s._v("0.1")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// 去优化")]),s._v("\n")])]),s._v(" "),n("div",{staticClass:"line-numbers-wrapper"},[n("span",{staticClass:"line-number"},[s._v("1")]),n("br"),n("span",{staticClass:"line-number"},[s._v("2")]),n("br"),n("span",{staticClass:"line-number"},[s._v("3")]),n("br"),n("span",{staticClass:"line-number"},[s._v("4")]),n("br"),n("span",{staticClass:"line-number"},[s._v("5")]),n("br"),n("span",{staticClass:"line-number"},[s._v("6")]),n("br"),n("span",{staticClass:"line-number"},[s._v("7")]),n("br")])]),n("h3",{attrs:{id:"隐藏类和内联缓存"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#隐藏类和内联缓存"}},[s._v("#")]),s._v(" 隐藏类和内联缓存")]),s._v(" "),n("p",[s._v("有三种不同的命名属性类型: 对象内， 快速/慢速词典。")]),s._v(" "),n("p",[s._v("对象属性直接存储在对象本身上，并提供最快的访问权限。快属性位于属性存储中，所有元信息都存储在 HiddenClass 的描述符数组中。慢属性存储在独立的属性字典中，不再通过 HiddenClass 共享元信息。")]),s._v(" "),n("p",[s._v("慢属性允许高效的删除和添加属性，但访问速度比其它两种类型慢。")]),s._v(" "),n("p",[s._v("V8 利用了另一种优化动态类型语言的技术，称为内联缓存。内联缓存依赖于这样一种观察，即对同一方法的重复调用往往发生在同一类型的对\n象上。")]),s._v(" "),n("p",[s._v("那么隐藏类和内联缓存的概念如何相关呢？无论何时在特定对象上调用方法时，V8 引擎都必须执行对该对象的隐藏类的查找，以确定访问特定属性的偏移量。在同一个隐藏类的两次成功的调用之后，V8 省略了隐藏类的查找，并简单地将该属\n性的偏移量添加到对象指针本身。如果你创建两个相同类型和不同隐藏类的对象，V8 将无法使用内联缓存，因为即使这两个对象属于同一类型，它们对应的隐藏类为其属性分配不同的偏移量。")]),s._v(" "),n("div",{staticClass:"language-javascript line-numbers-mode"},[n("pre",{pre:!0,attrs:{class:"language-javascript"}},[n("code",[n("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("function")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token function"}},[s._v("Point")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),n("span",{pre:!0,attrs:{class:"token parameter"}},[s._v("x"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v(" y")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n  "),n("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("this")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("x "),n("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" x"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n  "),n("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("this")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("y "),n("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" y"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n\n"),n("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("var")]),s._v(" p1 "),n("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("new")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token class-name"}},[s._v("Point")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),n("span",{pre:!0,attrs:{class:"token number"}},[s._v("11")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token number"}},[s._v("12")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n"),n("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("var")]),s._v(" p2 "),n("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("new")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token class-name"}},[s._v("Point")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),n("span",{pre:!0,attrs:{class:"token number"}},[s._v("11")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token number"}},[s._v("32")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n"),n("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// 此时p1和p2其实使用的是同一个类")]),s._v("\n\n"),n("span",{pre:!0,attrs:{class:"token comment"}},[s._v("//但是如果给p2增加一个属性。那会新产生一个类")]),s._v("\np2"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("z "),n("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token number"}},[s._v("33")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n")])]),s._v(" "),n("div",{staticClass:"line-numbers-wrapper"},[n("span",{staticClass:"line-number"},[s._v("1")]),n("br"),n("span",{staticClass:"line-number"},[s._v("2")]),n("br"),n("span",{staticClass:"line-number"},[s._v("3")]),n("br"),n("span",{staticClass:"line-number"},[s._v("4")]),n("br"),n("span",{staticClass:"line-number"},[s._v("5")]),n("br"),n("span",{staticClass:"line-number"},[s._v("6")]),n("br"),n("span",{staticClass:"line-number"},[s._v("7")]),n("br"),n("span",{staticClass:"line-number"},[s._v("8")]),n("br"),n("span",{staticClass:"line-number"},[s._v("9")]),n("br"),n("span",{staticClass:"line-number"},[s._v("10")]),n("br"),n("span",{staticClass:"line-number"},[s._v("11")]),n("br")])])])}),[],!1,null,null,null);t.default=e.exports}}]);