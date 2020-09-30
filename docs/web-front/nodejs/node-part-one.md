# Nodejs初探

## Nodejs异步IO原理浅析及优化方案

### 异步IO的好处
- 前端通过异步IO消除UI阻塞
- 并发请求耗时短
- I/O是昂贵的，分布式I/O是更昂贵的
- Nodejs适用于IO密集型，不适用CPU密集型。适用于IO密集型是因为nodejs是异步的，不适用CPU密集型是因为nodejs是单线程的。

异步IO虽然好，但也不是所有的东西都用异步就好，同步和异步有一个平衡点。

### Nodejs对异步IO的实现
完美的异步IO应该是应用程序发起非阻塞调用，无需通过遍历等方式轮询。
![](./images/nodejs_system.png)

1. application是我们写的应用
2. V8：用来解析、执行js代码的运行环境。
3. node bindings: nodejs程序的main函数入口。这一层由C++编写，是js与底层C/C++沟通的桥梁。
4. libuv:管理异步IO，封装了自定义的线程池。

异步IO的流程：
![](https://upload-images.jianshu.io/upload_images/3112582-d788586fb42c1139.png?imageMogr2/auto-orient/strip|imageView2/2/w/702/format/webp)

### 宏任务和微任务
异步任务分为宏任务和微任务。
浏览器环境下能够触发宏任务的操作有：
- I/O操作
- setTimeOut
- setInterval

浏览器下触发微任务的操作有：
- Promise
- MutationObservaer




### 几个特殊的API
这几个API线程池不参与。
- setTimeOut和setInterval
- process.nextTick()。实现类似setTimeout(function(){}, 0)。每次放入队列中，在下一个循环中取出。
- setImmediate()。比process.nextTick()优先级低。

这几个不受event loop管，那谁负责？Nodejs中有三个观察者：idle观察者，IO观察者和check观察者。idle观察者负责process.nextTick(), IO观察者负责setTimeOut(), check观察者负责setImmdiate()。





## Nodejs内存管理机制及内存优化

## 大规模Node站点结构分析

## 服务集群管理与Node集群的应用