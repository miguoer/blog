# Node 端实现 DI 和 IOC

IOC（Inversion Of Control）控制反转是一种思想。正常写代码是用到谁就去找谁。由我们去创建需要依赖的对象。而 IOC 是有一个专门的容器来创建这些对象，即由 IOC 容器控制对象的创建。控制反转控制的是什么？控制的是外部资源的获取，包括对象、文件等。为什么是反转？因为容器帮我们查找及注入依赖对象，对象只是被动的接受依赖对象，依赖对象的获取被反转了。

IOC 有几种实现方式。一种是 DI（Dependency Inject）依赖注入。一种是 XML。

在实现依赖注入的过程中为了达到无侵入式注入出现了一种设计模式，叫面向切面编程 AOP。

AOP 把软件系统分为两个部分:核心关注点和横切关注点，实现关注点分离。它将那些影响了多个类的公共行为封装到一个可重用模块，并将其命名为"Aspect"，即切面。所谓"切面"，简单说就是那些与业务无关，却为业务模块所共同调用的逻辑或责任封装起来，便于减少系统的重复代码，降低模块之间的耦合度，并有利于未来的可操作性和可维护性。

## awilix

一个非常小巧的库，经过下面的代码配置，就可以实现一个 Node 端的 IOC 框架。它的缺点是没有太多相关文档，参考较少。

```javascript
import { loadControllers, scopePerRequest } from "awilix-koa";
import { asClass, asValue, Lifetime, createContainer } from "awilix";

//整个IOC的过程来讲 容器最重要
const container = createContainer();
//要注入的所有类装载到container中
container.loadModules([__dirname + "/services/*.js"], {
  //制定以下当前的注入的函数 是已什么形式
  formatName: "camelCase",
  resolverOptions: {
    lifetime: Lifetime.SCOPED,
  },
});

app.use(scopePerRequest(container));

//自动的去装载路由
app.use(loadControllers(__dirname + "/controllers/*.js"));

app.listen(config.port, () => {
  console.log("服务已启动🍺🍞，端口号:", config.port);
});
```

## inversify
