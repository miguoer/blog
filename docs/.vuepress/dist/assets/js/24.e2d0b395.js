(window.webpackJsonp=window.webpackJsonp||[]).push([[24],{370:function(t,a,s){"use strict";s.r(a);var r=s(42),v=Object(r.a)({},(function(){var t=this,a=t.$createElement,s=t._self._c||a;return s("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[s("h1",{attrs:{id:"跨域问题解决方案"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#跨域问题解决方案"}},[t._v("#")]),t._v(" 跨域问题解决方案")]),t._v(" "),s("p",[t._v("浏览器的同源策略是产生跨域问题的原因.")]),t._v(" "),s("h2",{attrs:{id:"浏览器的同源策略"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#浏览器的同源策略"}},[t._v("#")]),t._v(" 浏览器的同源策略")]),t._v(" "),s("p",[t._v("同源策略是一个重要的安全策略，它用于限制一个origin的文档或者它加载的脚本如何能与另一个源的资源进行交互。它能帮助阻隔恶意文档，减少可能被攻击的媒介。")]),t._v(" "),s("h3",{attrs:{id:"同源的定义"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#同源的定义"}},[t._v("#")]),t._v(" 同源的定义")]),t._v(" "),s("p",[t._v("如果两个 URL 的 protocol、port (如果有指定的话)和 host 都相同的话，则这两个 URL 是同源。")]),t._v(" "),s("h3",{attrs:{id:"源的继承"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#源的继承"}},[t._v("#")]),t._v(" 源的继承")]),t._v(" "),s("p",[t._v("在页面中通过 about:blank 或 javascript: URL 执行的脚本会继承打开该 URL 的文档的源，因为这些类型的 URLs 没有包含源服务器的相关信息。")]),t._v(" "),s("h3",{attrs:{id:"ie特例"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#ie特例"}},[t._v("#")]),t._v(" IE特例")]),t._v(" "),s("p",[t._v("IE 的同源策略有两个主要的差异点：")]),t._v(" "),s("ul",[s("li",[t._v("授信范围（Trust Zones）：两个相互之间高度互信的域名，如公司域名（corporate domains），则不受同源策略限制。")]),t._v(" "),s("li",[t._v("端口：IE 未将端口号纳入到同源策略的检查中，因此 https://company.com:81/index.html 和 https://company.com/index.html  属于同源并且不受任何限制。")])]),t._v(" "),s("h2",{attrs:{id:"跨源网络访问"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#跨源网络访问"}},[t._v("#")]),t._v(" 跨源网络访问")]),t._v(" "),s("p",[t._v("同源策略控制不同源之间的交互,一般交互分为三类:")]),t._v(" "),s("ul",[s("li",[t._v("跨域写操作（Cross-origin writes）一般是被允许的。例如链接（links），重定向以及表单提交。特定少数的HTTP请求需要添加 preflight。")]),t._v(" "),s("li",[t._v("跨域资源嵌入（Cross-origin embedding）一般是被允许（后面会举例说明）。")]),t._v(" "),s("li",[t._v("跨域读操作（Cross-origin reads）一般是不被允许的.")])]),t._v(" "),s("p",[t._v("通常向后台请求数据,如果前端的域名和后台服务的域名不在同一个域名下,就属于跨域读操作.")]),t._v(" "),s("h2",{attrs:{id:"解决方案"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#解决方案"}},[t._v("#")]),t._v(" 解决方案")]),t._v(" "),s("ol",[s("li",[t._v("后台设置允许跨域访问")])]),t._v(" "),s("p",[t._v("Spring Boot项目中,在Applicaiton中设置  "),s("code",[t._v("Access-Control-Allow-Origin")])]),t._v(" "),s("ol",{attrs:{start:"2"}},[s("li",[t._v("前端架设BFF层")])]),t._v(" "),s("p",[t._v("前端使用Node架设一层BFF, 代理所有的后台请求.由于Node服务和静态资源处于同一个域名下,因此一定不会出现跨域. Node后台向Java后台请求,响应时间在几十ms以内, 影响几乎可以忽略. BFF层所带来的收益比这多出来的几十ms要大很多.")])])}),[],!1,null,null,null);a.default=v.exports}}]);