# 跨域问题解决方案
浏览器的同源策略是产生跨域问题的原因.

## 浏览器的同源策略
同源策略是一个重要的安全策略，它用于限制一个origin的文档或者它加载的脚本如何能与另一个源的资源进行交互。它能帮助阻隔恶意文档，减少可能被攻击的媒介。

### 同源的定义
如果两个 URL 的 protocol、port (如果有指定的话)和 host 都相同的话，则这两个 URL 是同源。

### 源的继承
在页面中通过 about:blank 或 javascript: URL 执行的脚本会继承打开该 URL 的文档的源，因为这些类型的 URLs 没有包含源服务器的相关信息。

### IE特例
IE 的同源策略有两个主要的差异点：

- 授信范围（Trust Zones）：两个相互之间高度互信的域名，如公司域名（corporate domains），则不受同源策略限制。
- 端口：IE 未将端口号纳入到同源策略的检查中，因此 https://company.com:81/index.html 和 https://company.com/index.html  属于同源并且不受任何限制。

## 跨源网络访问
同源策略控制不同源之间的交互,一般交互分为三类:
- 跨域写操作（Cross-origin writes）一般是被允许的。例如链接（links），重定向以及表单提交。特定少数的HTTP请求需要添加 preflight。
- 跨域资源嵌入（Cross-origin embedding）一般是被允许（后面会举例说明）。
- 跨域读操作（Cross-origin reads）一般是不被允许的.

 通常向后台请求数据,如果前端的域名和后台服务的域名不在同一个域名下,就属于跨域读操作.

## 解决方案
 1. 后台设置允许跨域访问

 Spring Boot项目中,在Applicaiton中设置  ```Access-Control-Allow-Origin```

2. 前端架设BFF层

前端使用Node架设一层BFF, 代理所有的后台请求.由于Node服务和静态资源处于同一个域名下,因此一定不会出现跨域. Node后台向Java后台请求,响应时间在几十ms以内, 影响几乎可以忽略. BFF层所带来的收益比这多出来的几十ms要大很多.


