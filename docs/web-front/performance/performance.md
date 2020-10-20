# 性能优化启示录

## 为什么要做性能优化
- 57%的用户更在乎网页在3秒内是否完成加载
- 52%的在线用户认为网页打开速度影响到他们对网站的忠实度
- 每慢1秒造成页面PV降低11%，用户满意度也随之降低16%
- 近半数移动用户因为在10秒内仍未打开页面从而放弃

## 性能优化学徒工
### 雅虎军规
![](./images/yahoo.jpg)

- 压缩与合并之间有一个平衡点。webpack打包优化提取公共css或js文件时，当提取的文件大于30kb时才会提取出来。浏览器并发请求数5-6个比较合适，每个请求100kb左右。
- 用md5做精准缓存
- 多个CDN。CDN为什么更快？CDN的本质是将媒体资源，动静态图片（Flash），HTML，CSS，JS等等内容缓存到距离你更近的数据中心，从而让用户进行共享资源，实现缩减站点间的响应时间等等需求。再者，CDN不会携带额外的cookie。多CDN可以解决浏览器对同一个域名的并发访问过大问题。
([雅虎军规](/web-front/performance/yahoo-35.md))

### 缓存策略
 Http缓存
- cache-control
- expires
- etag
- last-modified

离线缓存的几种方式
- Local Storage。同步读取。
- Session Storage
- IndexedDb。异步读取。
- basket.js
- localForage

1. 一般常用的库 jquery做http强缓存，对版本要求不严格
2. 业务代码需要本地缓存。md5变化是非常频繁的，用http缓存意义不大且经常会缓存失败。
([Http缓存](/web-front/nodejs/http-cache.md))

离线缓存逻辑：
1. 请求一个js，先判断是否有缓存。文件缓存都保存两对key value,["common:component/home.js", "xxxx2fer5.js"]和["xxxx2fer5.js", "js的内容"]
2. 如果有缓存，检查缓存是否过期
3. 如果过期，删除掉两个key,直接拉js文件，请求js，增加两对key value
4. 如果没过期，直接取缓存的代码，用eval addScript中。
5. 如果没有缓存，按缓存过期处理。


### 网站协议
将站点改成HTTP/2的请求。

Http1请求过程：浏览器请求//xx.cn/a.js-->解析域名—>HTTP连接—>服务器处理文件—>返回数据-->浏览器解析、渲染文件。

Keep-Alive解决的核心问题就在此，一定时间内，同一域名多次请求数据，只建立一次HTTP请求，其他请求可复用每一次建立的连接通道，以达到提高请求 效率的问题。一定时间是可以配置的，HTTP1.1还是存在效率问题，第一个:串行的文件传输。第二个:连接数过多。
HTTP/2对同一 域名下所有请求都是基于流，也就是说同一域名不管访问多少文件，也只建立一路连接。同样Apache的最大连接数为300，因为有了这个新特性，最大的并发就可以提升到300，比原来提升了60倍!

### 小字为先
通过分析工具，哪里大, 对那块进行压缩优化调优，尽量小

哪大削哪 请求合并 压缩合并 缓存优先

### 如何拿到用户的网速和机型
- HTML5自带属性
- JavaScript模拟

#### HTML5自带属性
`navigator.connection`
这个属性浏览器支持很不好。

#### JavaScript模拟
- 纯图片请求，速度=时间/文件大小。如请求1kb图片。
- Timer差，分区间
- 多普勒测速，分5次请求
计算公式
1. api?http1.0&t=1&size=0k
2. api?http1.1&t=2&size=0k
3. api?http1.1&t=3&size=0k
4. api?http1.1&t=4&size=10k
5. api?http1.1&t=5&size=40k

- T1 = DNS + New Connection(TCP) +RTT(一次传输)
- T2 = New Connection(TCP) +RTT(一次传输)
- T3 = RTT(一次传输)
- 10k/(t4-t3)~TCP bandwidth
- (40k-10k)/(t5-t4)~TCP bandwidth
如果网速慢 可以给用户出 一倍图,获取隐藏部分,只显示重要部分

## 渲染中的性能优化

### 重绘影响

### 重排影响

### 如何规避

### 高效渲染

