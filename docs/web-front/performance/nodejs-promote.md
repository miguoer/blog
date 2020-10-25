# Nodejs性能调优

## 内存泄露
程序的运行需要内存。只要程序提出要求，操作系统或者运行时（runtime）就必须供给内存。对于持续运行的服务进程（Deamon），必须及时释放不再用到的内存。否则内存占用运来越高。轻则影响系统性能，重则导致进程崩溃。不再用到的内存没有及时释放，就叫做内存泄露。

![](./images/memeory_leak_compare.png)

成锯齿状的是由Scavenge创建的，而出现向下跳跃的是有Mark-Sweep操作产生的。

### 内存泄露的表现
- 随着内存泄露的增长，V8对垃圾收集器越来越具有攻击性，这会使你的应用运行速度变慢。
- 内存泄露可能触发其它类型的失败。内存泄露的代码可能会持续引用有限的资源。可能会导致应用耗尽文件描述符；还可能突然不能建立新的数据库连接。
- 应用迟早会崩溃，并且当应用用户越来越多时肯定会发生
- 浏览器也会发生内存泄露。只不过浏览器只针对一端，会造成网页的卡顿。

### 如何查看是否有内存泄露 

#### 压力测试工具
PV每天几十万甚至上百万就需要考虑压力测试。
:::tip
PV：网站当日访问人数
UV: 独立访问人数
QPS = PV/t: 1000000/10*60*60=27.7（100万请求集中在10个小时，服务器每秒处理27.7个请求）
:::

1. WRK
wrk的参数说明：
- -t 需要模拟的线程数
- -c 需要模拟的连接数
- --timeout 超时时间
- -d 测试的持续时间

例子：
```javascript
 ./wrk -t12 -c400 -d30s http://localhost:8080/

 //用12个线程30s内模拟400个连接。
 //一般线程数不宜过多，核数的2到4倍足够。
```
计算结果
![](./images/wrk.png)

Latency: 可以理解为响应时间
Req/Sec: 每个线程每秒钟完成的请求数
一般来说主要关注平均值和最大值，标准差如果太大说明样本本身离散程度比较高，有可能系统性能波动很大。

2. JMeter
使用场景

- 功能测试
- 压力测试
- 分布式压力测试
- 纯java开发
- 上手容易,高性能
- 提供测试数据分析
- 各种报表数据图形展示

#### 如何获取到程序运行内存？
可以使用node自带的`process.memoryUsage`。它返回一个对象，包含了Node进程内存占用信息。该对象包含四个字段，单位是字节：

- rss(resident set size)：所有内存占用，包括指令区和堆栈
- heapTotal: 堆占用的内存，包括用到的和没用到的。
- heapUsed：用到的堆的部分
- external: V8引擎内部的C++对象占用的内存。
判断内存泄露，以heapUsed字段为准。 

#### 查找Node内存泄露工具
- memwatch。

它是一个泄漏事件发射器，经过连续5次的GC，内存仍被持续分配没有得到释放，就能生成快照

- headdump

一个状态事件发射器，可以生成内存快照。
### 如何避免内存泄露


## 调优手段

### 使用buffer


```javascript
const http = require('http');

let s = '';
for (let i = 0; i < 1024 * 10; i++) {
  s += 'a';
}

const str = s;
const buffStr = Buffer.from(s);

const server = http.createServer((req, res) => {
  if (req.url == '/buffer') {
    res.end(buffStr);
  } else if (req.url == '/string') {
    res.end(str);
  }
});
server.listen(3002);

```
测试1，不用buffer：
```javascript
./wrk -t12 -c400 -d 60s http://127.0.0.1:3002/string
```
结果：
![](./images/wrk_result.png)

测试2，使用buffer:
```javascript
./wrk -t12 -c400 -d 60s http://127.0.0.1:3002/buffer
```
结果：
![](./images/wrk_result_buffer.png)
可以看到平均响应时间和QPS都得到很大的提升。




