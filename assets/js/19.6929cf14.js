(window.webpackJsonp=window.webpackJsonp||[]).push([[19],{418:function(s,t,a){s.exports=a.p+"assets/img/render_summay.b122a9da.jpg"},528:function(s,t,a){"use strict";a.r(t);var r=a(42),n=Object(r.a)({},(function(){var s=this,t=s.$createElement,r=s._self._c||t;return r("ContentSlotsDistributor",{attrs:{"slot-key":s.$parent.slotKey}},[r("h1",{attrs:{id:"渲染中的性能优化"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#渲染中的性能优化"}},[s._v("#")]),s._v(" 渲染中的性能优化")]),s._v(" "),r("h2",{attrs:{id:"网页渲染过程"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#网页渲染过程"}},[s._v("#")]),s._v(" 网页渲染过程")]),s._v(" "),r("ol",[r("li",[r("p",[s._v("DOM 分层。通过 firefox3D 可以看到我们的网页实际上是一层一层的。DOM 分层和 z-index 属性不是一回事，后面会说到。")])]),s._v(" "),r("li",[r("p",[s._v("计算样式。获取到 DOM 元素后，对 DOM 元素节点计算样式结果。 "),r("code",[s._v("Recalculate Style")]),s._v("中负责计算样式结果。计算完成之后要摆放了。")])]),s._v(" "),r("li",[r("p",[s._v("重排。为每个节点生成图形位置。 "),r("code",[s._v("Layout")]),s._v("负责回流重排。")])]),s._v(" "),r("li",[r("p",[s._v("重绘。将每个节点绘制填充到图层位图中。 "),r("code",[s._v("Paint")]),s._v("负责。")])]),s._v(" "),r("li",[r("p",[s._v("将图层作为纹理上传到 GPU。纹理是给 GPU 传输的小的图块，可以对齐进行旋转，缩放等。")])]),s._v(" "),r("li",[r("p",[s._v("合成层。 把符合图层生成到页面上。由"),r("code",[s._v("Composite Layers")]),s._v("负责。")])])]),s._v(" "),r("p",[s._v("如果能跨过重排重绘，直接进入合成层，就能提高渲染性能。")]),s._v(" "),r("ol",{attrs:{start:"7"}},[r("li",[s._v("Composite Layers 做了什么？")])]),s._v(" "),r("p",[s._v("​ ① 图层的绘制列表准备好之后，主线程将列表提交给合成线程")]),s._v(" "),r("p",[s._v("​ ② 合成线程根据当前的视口(viewport)划分图块。 256"),r("em",[s._v("256/512")]),s._v("512")]),s._v(" "),r("p",[s._v("③ 把图块生成位图，这个过程叫栅格化。图块转换成位图就使用了 GPU，生成的位图保存在 GPU 中。 (Raster)")]),s._v(" "),r("p",[s._v("④ 如果所有图块都准备完成后，合成线程会生成一个 DarwQuad 命令，提交给浏览器渲染进程。")]),s._v(" "),r("p",[s._v("⑤ 浏览器有一个叫 viz 的组件，这个组件接收到 DarwQuad 命令后，会根据生成的位图绘制到我们的屏幕上。")]),s._v(" "),r("p",[s._v("如果没有触发 GPU 操作，会在 CPU 里操作。")]),s._v(" "),r("h2",{attrs:{id:"分层"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#分层"}},[s._v("#")]),s._v(" 分层")]),s._v(" "),r("ol",[r("li",[s._v("什么会触发元素分层？")])]),s._v(" "),r("ul",[r("li",[s._v("根元素")]),s._v(" "),r("li",[s._v("position 分层")]),s._v(" "),r("li",[s._v("transform")]),s._v(" "),r("li",[s._v("半透明元素")]),s._v(" "),r("li",[s._v("设置了 css 滤镜")]),s._v(" "),r("li",[s._v("canvas")]),s._v(" "),r("li",[s._v("vedio")]),s._v(" "),r("li",[s._v("overflow")])]),s._v(" "),r("ol",{attrs:{start:"2"}},[r("li",[s._v("什么会让 GPU 参与进来？")])]),s._v(" "),r("ul",[r("li",[s._v("CSS3D")]),s._v(" "),r("li",[s._v("video")]),s._v(" "),r("li",[s._v("canvas webgl")]),s._v(" "),r("li",[s._v("transform")]),s._v(" "),r("li",[s._v("css 滤镜")]),s._v(" "),r("li",[s._v("will-change:transform")])]),s._v(" "),r("h2",{attrs:{id:"重绘和重排"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#重绘和重排"}},[s._v("#")]),s._v(" 重绘和重排")]),s._v(" "),r("p",[s._v("重排一定会导致重绘，重绘不一定导致重排。")]),s._v(" "),r("p",[s._v("什么情况会导致重排？")]),s._v(" "),r("ul",[r("li",[r("p",[s._v('盒子动了。开发中会使用怪异合模型。设置 box-sizing:border-box 让盒子不往外撑。box-sizing 设置为 "border-box"，这可令浏览器呈现出带有指定宽度和高度的框，并把边框和内边距放入框中')])]),s._v(" "),r("li",[r("p",[s._v("读属性。\n以下属性只要一读就会立即放弃当前的优化。这是因为浏览器进行优化操作时，会把一些引起重排重绘的操作放到一个队列中，等队列到了一定数量出，再操作。如果做了如下读操作，会把这些队列中的操作全部释放，就会引起重排。")])])]),s._v(" "),r("div",{staticClass:"language- line-numbers-mode"},[r("pre",{pre:!0,attrs:{class:"language-text"}},[r("code",[s._v("offset, scroll, client, width\n")])]),s._v(" "),r("div",{staticClass:"line-numbers-wrapper"},[r("span",{staticClass:"line-number"},[s._v("1")]),r("br")])]),r("p",[s._v("如何解决这个问题？写代码过程中尽量把读操作和写操作放一起。但是实际开发过程中很难做到。怎么做呢？可以把操作放在"),r("code",[s._v("requestAnmationFrame()")]),s._v("中做读写分离。")]),s._v(" "),r("p",[s._v("CPU 主要负责操作系统和程序，GPU 负责显示数据处理（gpu.js）。")]),s._v(" "),r("p",[r("a",{attrs:{href:"https://csstriggers.com/",target:"_blank",rel:"noopener noreferrer"}},[s._v("css triggers 这个网站可以查看属性是否会引起重绘重排"),r("OutboundLink")],1)]),s._v(" "),r("p",[s._v("如果我们自己不能很好的管理 dom，可以参考"),r("a",{attrs:{href:"https://www.npmjs.com/package/fastdom",target:"_blank",rel:"noopener noreferrer"}},[s._v("fast dom"),r("OutboundLink")],1)]),s._v(" "),r("h2",{attrs:{id:"渲染流程总结"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#渲染流程总结"}},[s._v("#")]),s._v(" 渲染流程总结")]),s._v(" "),r("p",[r("img",{attrs:{src:a(418),alt:""}}),s._v("\n分析 DOM，计算样式，然后执行 Layout Layer Paint，\n然后提交给合成线程。合成线程分块，然后交给光栅，光栅化有一个独立的线程池，CPU 接收到 draw quad 命令后，绘制出图片。")]),s._v(" "),r("h2",{attrs:{id:"打脸问题"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#打脸问题"}},[s._v("#")]),s._v(" 打脸问题")]),s._v(" "),r("h3",{attrs:{id:"js-放的位置会影响-dom-渲染吗"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#js-放的位置会影响-dom-渲染吗"}},[s._v("#")]),s._v(" JS 放的位置会影响 DOM 渲染吗")]),s._v(" "),r("p",[s._v("如果 script 写到底下，js 还会影响 dom 的渲染吗？答案是会。浏览器会等待 js 加载。")]),s._v(" "),r("div",{staticClass:"language-javascript line-numbers-mode"},[r("pre",{pre:!0,attrs:{class:"language-javascript"}},[r("code",[r("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v("!")]),r("span",{pre:!0,attrs:{class:"token constant"}},[s._v("DOCTYPE")]),s._v(" html"),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v("\n"),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),s._v("html lang"),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),r("span",{pre:!0,attrs:{class:"token string"}},[s._v('"en"')]),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v("\n  "),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),s._v("head"),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v("\n    "),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),s._v("meta charset"),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),r("span",{pre:!0,attrs:{class:"token string"}},[s._v('"UTF-8"')]),s._v(" "),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v("/")]),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v("\n    "),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),s._v("meta name"),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),r("span",{pre:!0,attrs:{class:"token string"}},[s._v('"viewport"')]),s._v(" content"),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),r("span",{pre:!0,attrs:{class:"token string"}},[s._v('"width=device-width, initial-scale=1.0"')]),s._v(" "),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v("/")]),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v("\n    "),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),s._v("title"),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v("Document"),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v("/")]),s._v("title"),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v("\n  "),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v("/")]),s._v("head"),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v("\n  "),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),s._v("body"),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v("\n    "),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),s._v("h1"),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v("dddd"),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v("/")]),s._v("h1"),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v("\n    "),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),s._v("script"),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v("\n      "),r("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// DOM解析不影响 渲染依旧等待")]),s._v("\n      "),r("span",{pre:!0,attrs:{class:"token function"}},[s._v("prompt")]),r("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),r("span",{pre:!0,attrs:{class:"token string"}},[s._v("'等待'")]),r("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),r("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n    "),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v("/")]),s._v("script"),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v("\n  "),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v("/")]),s._v("body"),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v("\n"),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v("/")]),s._v("html"),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v("\n")])]),s._v(" "),r("div",{staticClass:"line-numbers-wrapper"},[r("span",{staticClass:"line-number"},[s._v("1")]),r("br"),r("span",{staticClass:"line-number"},[s._v("2")]),r("br"),r("span",{staticClass:"line-number"},[s._v("3")]),r("br"),r("span",{staticClass:"line-number"},[s._v("4")]),r("br"),r("span",{staticClass:"line-number"},[s._v("5")]),r("br"),r("span",{staticClass:"line-number"},[s._v("6")]),r("br"),r("span",{staticClass:"line-number"},[s._v("7")]),r("br"),r("span",{staticClass:"line-number"},[s._v("8")]),r("br"),r("span",{staticClass:"line-number"},[s._v("9")]),r("br"),r("span",{staticClass:"line-number"},[s._v("10")]),r("br"),r("span",{staticClass:"line-number"},[s._v("11")]),r("br"),r("span",{staticClass:"line-number"},[s._v("12")]),r("br"),r("span",{staticClass:"line-number"},[s._v("13")]),r("br"),r("span",{staticClass:"line-number"},[s._v("14")]),r("br"),r("span",{staticClass:"line-number"},[s._v("15")]),r("br")])]),r("p",[s._v("那 js 放底下就没有意义了吗？有意义。放底下不影响 DOM 解析。")]),s._v(" "),r("h3",{attrs:{id:"css-会影响-dom-解析和渲染吗"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#css-会影响-dom-解析和渲染吗"}},[s._v("#")]),s._v(" CSS 会影响 DOM 解析和渲染吗")]),s._v(" "),r("p",[s._v("CSS 不会影响 DOM 渲染，但是影响 DOM 解析。在 Chrome 调试工具中设置限速，可以看到效果。")]),s._v(" "),r("div",{staticClass:"language-javascript line-numbers-mode"},[r("pre",{pre:!0,attrs:{class:"language-javascript"}},[r("code",[r("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v("!")]),r("span",{pre:!0,attrs:{class:"token constant"}},[s._v("DOCTYPE")]),s._v(" html"),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v("\n"),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),s._v("html lang"),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),r("span",{pre:!0,attrs:{class:"token string"}},[s._v('"en"')]),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v("\n "),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),s._v("head"),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v("\n   "),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),s._v("meta charset"),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),r("span",{pre:!0,attrs:{class:"token string"}},[s._v('"UTF-8"')]),s._v(" "),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v("/")]),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v("\n   "),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),s._v("meta name"),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),r("span",{pre:!0,attrs:{class:"token string"}},[s._v('"viewport"')]),s._v(" content"),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),r("span",{pre:!0,attrs:{class:"token string"}},[s._v('"width=device-width, initial-scale=1.0"')]),s._v(" "),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v("/")]),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v("\n   "),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),s._v("title"),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v("Document"),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v("/")]),s._v("title"),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v("\n   "),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),s._v("style"),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v("\n     h1 "),r("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n       color"),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" red "),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v("!")]),s._v("important"),r("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n     "),r("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n   "),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v("/")]),s._v("style"),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v("\n   "),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),s._v("script"),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v("\n     "),r("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("function")]),s._v(" "),r("span",{pre:!0,attrs:{class:"token function"}},[s._v("h")]),r("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),r("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v(" "),r("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n       console"),r("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),r("span",{pre:!0,attrs:{class:"token function"}},[s._v("log")]),r("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),s._v("document"),r("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),r("span",{pre:!0,attrs:{class:"token function"}},[s._v("querySelectorAll")]),r("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),r("span",{pre:!0,attrs:{class:"token string"}},[s._v("'h1'")]),r("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),r("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),r("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n     "),r("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n     "),r("span",{pre:!0,attrs:{class:"token function"}},[s._v("setTimeout")]),r("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),s._v("h"),r("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v(" "),r("span",{pre:!0,attrs:{class:"token number"}},[s._v("0")]),r("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),r("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),r("span",{pre:!0,attrs:{class:"token comment"}},[s._v("//验证是否影响解析")]),s._v("\n   "),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v("/")]),s._v("script"),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v("\n   "),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),s._v("link\n     rel"),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),r("span",{pre:!0,attrs:{class:"token string"}},[s._v('"stylesheet"')]),s._v("\n     href"),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),r("span",{pre:!0,attrs:{class:"token string"}},[s._v('"https://cdn.staticfile.org/twitter-bootstrap/5.0.0-alpha1/css/bootstrap-utilities.min.css"')]),s._v("\n   "),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v("/")]),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v("\n "),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v("/")]),s._v("head"),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v("\n "),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),s._v("body"),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v("\n   "),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v("!")]),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v("--")]),s._v("\n         "),r("span",{pre:!0,attrs:{class:"token number"}},[s._v("1.")]),s._v("css 影响"),r("span",{pre:!0,attrs:{class:"token constant"}},[s._v("DOM")]),s._v("渲染\n         "),r("span",{pre:!0,attrs:{class:"token number"}},[s._v("2.")]),s._v("css 不会影响"),r("span",{pre:!0,attrs:{class:"token constant"}},[s._v("DOM")]),s._v("解析\n     "),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v("--")]),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v("\n   "),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),s._v("h1"),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v("dddd"),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v("/")]),s._v("h1"),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v("\n "),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v("/")]),s._v("body"),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v("\n"),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v("/")]),s._v("html"),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v("\n\n")])]),s._v(" "),r("div",{staticClass:"line-numbers-wrapper"},[r("span",{staticClass:"line-number"},[s._v("1")]),r("br"),r("span",{staticClass:"line-number"},[s._v("2")]),r("br"),r("span",{staticClass:"line-number"},[s._v("3")]),r("br"),r("span",{staticClass:"line-number"},[s._v("4")]),r("br"),r("span",{staticClass:"line-number"},[s._v("5")]),r("br"),r("span",{staticClass:"line-number"},[s._v("6")]),r("br"),r("span",{staticClass:"line-number"},[s._v("7")]),r("br"),r("span",{staticClass:"line-number"},[s._v("8")]),r("br"),r("span",{staticClass:"line-number"},[s._v("9")]),r("br"),r("span",{staticClass:"line-number"},[s._v("10")]),r("br"),r("span",{staticClass:"line-number"},[s._v("11")]),r("br"),r("span",{staticClass:"line-number"},[s._v("12")]),r("br"),r("span",{staticClass:"line-number"},[s._v("13")]),r("br"),r("span",{staticClass:"line-number"},[s._v("14")]),r("br"),r("span",{staticClass:"line-number"},[s._v("15")]),r("br"),r("span",{staticClass:"line-number"},[s._v("16")]),r("br"),r("span",{staticClass:"line-number"},[s._v("17")]),r("br"),r("span",{staticClass:"line-number"},[s._v("18")]),r("br"),r("span",{staticClass:"line-number"},[s._v("19")]),r("br"),r("span",{staticClass:"line-number"},[s._v("20")]),r("br"),r("span",{staticClass:"line-number"},[s._v("21")]),r("br"),r("span",{staticClass:"line-number"},[s._v("22")]),r("br"),r("span",{staticClass:"line-number"},[s._v("23")]),r("br"),r("span",{staticClass:"line-number"},[s._v("24")]),r("br"),r("span",{staticClass:"line-number"},[s._v("25")]),r("br"),r("span",{staticClass:"line-number"},[s._v("26")]),r("br"),r("span",{staticClass:"line-number"},[s._v("27")]),r("br"),r("span",{staticClass:"line-number"},[s._v("28")]),r("br"),r("span",{staticClass:"line-number"},[s._v("29")]),r("br"),r("span",{staticClass:"line-number"},[s._v("30")]),r("br"),r("span",{staticClass:"line-number"},[s._v("31")]),r("br")])]),r("h3",{attrs:{id:"css-会影响-js-执行吗"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#css-会影响-js-执行吗"}},[s._v("#")]),s._v(" CSS 会影响 JS 执行吗？")]),s._v(" "),r("p",[s._v("直觉上不会，但真的是这样吗？")]),s._v(" "),r("div",{staticClass:"language-javascript line-numbers-mode"},[r("pre",{pre:!0,attrs:{class:"language-javascript"}},[r("code",[r("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v("!")]),r("span",{pre:!0,attrs:{class:"token constant"}},[s._v("DOCTYPE")]),s._v(" html"),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v("\n"),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),s._v("html lang"),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),r("span",{pre:!0,attrs:{class:"token string"}},[s._v('"en"')]),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v("\n "),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),s._v("head"),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v("\n   "),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),s._v("meta charset"),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),r("span",{pre:!0,attrs:{class:"token string"}},[s._v('"UTF-8"')]),s._v(" "),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v("/")]),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v("\n   "),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),s._v("meta name"),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),r("span",{pre:!0,attrs:{class:"token string"}},[s._v('"viewport"')]),s._v(" content"),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),r("span",{pre:!0,attrs:{class:"token string"}},[s._v('"width=device-width, initial-scale=1.0"')]),s._v(" "),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v("/")]),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v("\n   "),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),s._v("title"),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v("Document"),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v("/")]),s._v("title"),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v("\n   "),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),s._v("style"),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v("\n     h1 "),r("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n       color"),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" red "),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v("!")]),s._v("important"),r("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n     "),r("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n   "),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v("/")]),s._v("style"),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v("\n   "),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),s._v("link\n     rel"),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),r("span",{pre:!0,attrs:{class:"token string"}},[s._v('"stylesheet"')]),s._v("\n     href"),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),r("span",{pre:!0,attrs:{class:"token string"}},[s._v('"https://cdn.staticfile.org/twitter-bootstrap/5.0.0-alpha1/css/bootstrap-reboot.min.css"')]),s._v("\n   "),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v("/")]),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v("\n "),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v("/")]),s._v("head"),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v("\n "),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),s._v("body"),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v("\n   "),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),s._v("h1"),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v("ddddd"),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v("/")]),s._v("h1"),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v("\n   "),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),s._v("script"),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v("\n     "),r("span",{pre:!0,attrs:{class:"token comment"}},[s._v("//css 加载会阻塞后面JS语句")]),s._v("\n     console"),r("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),r("span",{pre:!0,attrs:{class:"token function"}},[s._v("log")]),r("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),r("span",{pre:!0,attrs:{class:"token string"}},[s._v("'dddddd'")]),r("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),r("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n   "),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v("/")]),s._v("script"),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v("\n "),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v("/")]),s._v("body"),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v("\n"),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v("/")]),s._v("html"),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v("\n\n")])]),s._v(" "),r("div",{staticClass:"line-numbers-wrapper"},[r("span",{staticClass:"line-number"},[s._v("1")]),r("br"),r("span",{staticClass:"line-number"},[s._v("2")]),r("br"),r("span",{staticClass:"line-number"},[s._v("3")]),r("br"),r("span",{staticClass:"line-number"},[s._v("4")]),r("br"),r("span",{staticClass:"line-number"},[s._v("5")]),r("br"),r("span",{staticClass:"line-number"},[s._v("6")]),r("br"),r("span",{staticClass:"line-number"},[s._v("7")]),r("br"),r("span",{staticClass:"line-number"},[s._v("8")]),r("br"),r("span",{staticClass:"line-number"},[s._v("9")]),r("br"),r("span",{staticClass:"line-number"},[s._v("10")]),r("br"),r("span",{staticClass:"line-number"},[s._v("11")]),r("br"),r("span",{staticClass:"line-number"},[s._v("12")]),r("br"),r("span",{staticClass:"line-number"},[s._v("13")]),r("br"),r("span",{staticClass:"line-number"},[s._v("14")]),r("br"),r("span",{staticClass:"line-number"},[s._v("15")]),r("br"),r("span",{staticClass:"line-number"},[s._v("16")]),r("br"),r("span",{staticClass:"line-number"},[s._v("17")]),r("br"),r("span",{staticClass:"line-number"},[s._v("18")]),r("br"),r("span",{staticClass:"line-number"},[s._v("19")]),r("br"),r("span",{staticClass:"line-number"},[s._v("20")]),r("br"),r("span",{staticClass:"line-number"},[s._v("21")]),r("br"),r("span",{staticClass:"line-number"},[s._v("22")]),r("br"),r("span",{staticClass:"line-number"},[s._v("23")]),r("br"),r("span",{staticClass:"line-number"},[s._v("24")]),r("br"),r("span",{staticClass:"line-number"},[s._v("25")]),r("br")])]),r("p",[s._v("JS会等待CSS回来，不然会引起页面抖动。")]),s._v(" "),r("h3",{attrs:{id:"css会影响dom-content-loaded吗"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#css会影响dom-content-loaded吗"}},[s._v("#")]),s._v(" CSS会影响Dom content loaded吗")]),s._v(" "),r("p",[s._v("当初始的 HTML 文档被完全加载和解析完成之后，DOMContentLoaded 事件被触发，而无需等待样式表、图像和子框架的完全加载。")]),s._v(" "),r("div",{staticClass:"language-javascript line-numbers-mode"},[r("pre",{pre:!0,attrs:{class:"language-javascript"}},[r("code",[r("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v("!")]),r("span",{pre:!0,attrs:{class:"token constant"}},[s._v("DOCTYPE")]),s._v(" html"),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v("\n"),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),s._v("html lang"),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),r("span",{pre:!0,attrs:{class:"token string"}},[s._v('"en"')]),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v("\n  "),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),s._v("head"),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v("\n    "),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),s._v("meta charset"),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),r("span",{pre:!0,attrs:{class:"token string"}},[s._v('"UTF-8"')]),s._v(" "),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v("/")]),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v("\n    "),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),s._v("meta name"),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),r("span",{pre:!0,attrs:{class:"token string"}},[s._v('"viewport"')]),s._v(" content"),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),r("span",{pre:!0,attrs:{class:"token string"}},[s._v('"width=device-width, initial-scale=1.0"')]),s._v(" "),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v("/")]),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v("\n    "),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),s._v("title"),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v("Document"),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v("/")]),s._v("title"),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v("\n    "),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),s._v("script"),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v("\n      document"),r("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),r("span",{pre:!0,attrs:{class:"token function"}},[s._v("addEventListener")]),r("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),r("span",{pre:!0,attrs:{class:"token string"}},[s._v("'DOMContentLoaded'")]),r("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v(" "),r("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("function")]),s._v(" "),r("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),r("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v(" "),r("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n        console"),r("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),r("span",{pre:!0,attrs:{class:"token function"}},[s._v("log")]),r("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),r("span",{pre:!0,attrs:{class:"token string"}},[s._v("'DOMContentLoaded'")]),r("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),r("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n      "),r("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),r("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),r("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n    "),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v("/")]),s._v("script"),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v("\n    "),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),s._v("link\n      rel"),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),r("span",{pre:!0,attrs:{class:"token string"}},[s._v('"stylesheet"')]),s._v("\n      href"),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),r("span",{pre:!0,attrs:{class:"token string"}},[s._v('"https://cdn.staticfile.org/twitter-bootstrap/5.0.0-alpha1/css/bootstrap-reboot.min.css"')]),s._v("\n    "),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v("/")]),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v("\n    "),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),s._v("script"),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v("\n      console"),r("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),r("span",{pre:!0,attrs:{class:"token function"}},[s._v("log")]),r("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),r("span",{pre:!0,attrs:{class:"token string"}},[s._v("'acss'")]),r("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),r("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n    "),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v("/")]),s._v("script"),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v("\n  "),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v("/")]),s._v("head"),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v("\n  "),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),s._v("body"),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v("\n    "),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),s._v("h1"),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v("京程一灯"),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v("/")]),s._v("h1"),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v("\n  "),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v("/")]),s._v("body"),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v("\n"),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v("/")]),s._v("html"),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v("\n\n"),r("span",{pre:!0,attrs:{class:"token comment"}},[s._v("//这里DOMContentLoaded会阻塞")]),s._v("\n\n")])]),s._v(" "),r("div",{staticClass:"line-numbers-wrapper"},[r("span",{staticClass:"line-number"},[s._v("1")]),r("br"),r("span",{staticClass:"line-number"},[s._v("2")]),r("br"),r("span",{staticClass:"line-number"},[s._v("3")]),r("br"),r("span",{staticClass:"line-number"},[s._v("4")]),r("br"),r("span",{staticClass:"line-number"},[s._v("5")]),r("br"),r("span",{staticClass:"line-number"},[s._v("6")]),r("br"),r("span",{staticClass:"line-number"},[s._v("7")]),r("br"),r("span",{staticClass:"line-number"},[s._v("8")]),r("br"),r("span",{staticClass:"line-number"},[s._v("9")]),r("br"),r("span",{staticClass:"line-number"},[s._v("10")]),r("br"),r("span",{staticClass:"line-number"},[s._v("11")]),r("br"),r("span",{staticClass:"line-number"},[s._v("12")]),r("br"),r("span",{staticClass:"line-number"},[s._v("13")]),r("br"),r("span",{staticClass:"line-number"},[s._v("14")]),r("br"),r("span",{staticClass:"line-number"},[s._v("15")]),r("br"),r("span",{staticClass:"line-number"},[s._v("16")]),r("br"),r("span",{staticClass:"line-number"},[s._v("17")]),r("br"),r("span",{staticClass:"line-number"},[s._v("18")]),r("br"),r("span",{staticClass:"line-number"},[s._v("19")]),r("br"),r("span",{staticClass:"line-number"},[s._v("20")]),r("br"),r("span",{staticClass:"line-number"},[s._v("21")]),r("br"),r("span",{staticClass:"line-number"},[s._v("22")]),r("br"),r("span",{staticClass:"line-number"},[s._v("23")]),r("br"),r("span",{staticClass:"line-number"},[s._v("24")]),r("br"),r("span",{staticClass:"line-number"},[s._v("25")]),r("br"),r("span",{staticClass:"line-number"},[s._v("26")]),r("br")])]),r("p",[s._v("答案是有时候影响有时候不影响。什么时候影响？什么时候不影响？")]),s._v(" "),r("p",[s._v("影不影响取决于css下面还有没有脚本。如果css下面有脚本，那么就会阻塞，否则不会阻塞。为什么有脚本就会阻塞。这是因为脚本可以操作DOM，加载CSS的时候不知道下面的脚本会不会影响DOM，所以就要一直等着。")])])}),[],!1,null,null,null);t.default=n.exports}}]);