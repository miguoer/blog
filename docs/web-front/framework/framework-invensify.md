# Invensify 源码分析

inversifyJS 整体有五个阶段，其中包括两个可选阶段：

- Annotation - 打标签
- Planning -　准备阶段
- Middleware （optional）　中间件阶段，可选
- Resolution -　解析阶段
- Activation（optional）激活阶段，可选。

## Annotation

Annotation 阶段主要做的事情就是通过装饰器(decorator)给需要注入的对象打标签做标记。其中 injectable 主要作用在类上，用于标记类是可以依赖注入的，同时使用 Refelct Metadata 把这个类的构造函数参数(design:paramtypes)给标记出来。

```javascript
function injectable() {
  return function(target: any) {
    if (Reflect.hasOwnMetadata(METADATA_KEY.PARAM_TYPES, target)) {
      throw new Error(ERRORS_MSGS.DUPLICATED_INJECTABLE_DECORATOR);
    }

    const types =
      Reflect.getMetadata(METADATA_KEY.DESIGN_PARAM_TYPES, target) || [];
    Reflect.defineMetadata(METADATA_KEY.PARAM_TYPES, types, target);

    return target;
  };
}
```

其他主要还有一些针对类属性(property)，构造参数(parameter)的装饰器，如 inject,multi_inject,named,tagged，事实上这些装饰器都会生成一个 key-value 对（metadata），标记当前装饰的方法，然后集中传入到 decorator_utils 处理.

### 构造函数参数标注 （parameter）

```javascript
function tagParameter(
  annotationTarget: any,
  propertyName: string,
  parameterIndex: number,
  metadata: interfaces.Metadata
) {
  const metadataKey = METADATA_KEY.TAGGED;
  _tagParameterOrProperty(
    metadataKey,
    annotationTarget,
    propertyName,
    metadata,
    parameterIndex
  );
}
```

### 属性标注（proeprty）

```javascript
function tagProperty(
  annotationTarget: any,
  propertyName: string,
  metadata: interfaces.Metadata
) {
  const metadataKey = METADATA_KEY.TAGGED_PROP;
  _tagParameterOrProperty(
    metadataKey,
    annotationTarget.constructor,
    propertyName,
    metadata
  );
}
```

可以看到，属性标注用的 key 是 TAGGED_PROP,参数标注用的 key 是 TAGGED,然后\_tagParameterOrProperty 主要逻辑：

```javascript
function _tagParameterOrProperty(
  metadataKey: string,
  annotationTarget: any,
  propertyName: string,
  metadata: interfaces.Metadata,
  parameterIndex?: number
) {
  let paramsOrPropertiesMetadata: interfaces.ReflectResult = {};
  const key: string =
    parameterIndex !== undefined ? parameterIndex.toString() : propertyName;
  // read metadata if available
  if (Reflect.hasOwnMetadata(metadataKey, annotationTarget)) {
    paramsOrPropertiesMetadata = Reflect.getMetadata(
      metadataKey,
      annotationTarget
    );
  }
  // get metadata for the decorated parameter by its index
  let paramOrPropertyMetadata: interfaces.Metadata[] =
    paramsOrPropertiesMetadata[key];

  if (!Array.isArray(paramOrPropertyMetadata)) {
    paramOrPropertyMetadata = [];
  } else {
    for (const m of paramOrPropertyMetadata) {
      if (m.key === metadata.key) throw new Error(); //duplicated...
    }
  }
  // set metadata
  paramOrPropertyMetadata.push(metadata);
  paramsOrPropertiesMetadata[key] = paramOrPropertyMetadata;
  Reflect.defineMetadata(
    metadataKey,
    paramsOrPropertiesMetadata,
    annotationTarget
  );
}
```

可以看到所有的构造参数或者属性标注最后生成的接口都是一样的,　然后挂在了当前类的 metadataKey 上。

## Container

Container 容器是整个 Invensify 的入口。主要 api 有 bind, unbind, rebind, get, getNamed 等等。

- bind
  绑定的代码也不长，主要是根据传入的 id 与 defaultScope 生成一个 Binding 对象：

```javascript
public bind<T>(serviceIdentifier: interfaces.ServiceIdentifier<T>): interfaces.BindingToSyntax<T> {
        const scope = this.options.defaultScope || BindingScopeEnum.Transient;
        const binding = new Binding<T>(serviceIdentifier, scope);
        this._bindingDictionary.add(serviceIdentifier, binding);
        return new BindingToSyntax<T>(binding);
    }
```

binding 对象实际上是一个用于记录的类,定义为：

```javascript
class Binding<T> implements interfaces.Binding<T> {

    public id: number;
    public moduleId: string;

    // Determines weather the bindings has been already activated
    // The activation action takes place when an instance is resolved
    // If the scope is singleton it only happens once
    public activated: boolean;

    // A runtime identifier because at runtime we don't have interfaces
    public serviceIdentifier: interfaces.ServiceIdentifier<T>;

    // The constructor of a class which must implement T
    public implementationType: interfaces.Newable<T> | null;

    // Cache used to allow singleton scope and BindingType.ConstantValue bindings
    public cache: T | null;

    // Cache used to allow BindingType.DynamicValue bindings
    public dynamicValue: ((context: interfaces.Context) => T) | null;

    // The scope mode to be used
    public scope: interfaces.BindingScope;

    // The kind of binding
    public type: interfaces.BindingType;

    // A factory method used in BindingType.Factory bindings
    public factory: interfaces.FactoryCreator<T> | null;

    // An async factory method used in BindingType.Provider bindings
    public provider: interfaces.ProviderCreator<T> | null;

    // A constraint used to limit the contexts in which this binding is applicable
    public constraint: (request: interfaces.Request) => boolean;

    // On activation handler (invoked just before an instance is added to cache and injected)
    public onActivation: ((context: interfaces.Context, injectable: T) => T) | null;

    public clone(): interfaces.Binding<T> {}

}
```

生成 binding 对象后，将 binding 加入 bindingDictionary 里，但这个时候的 binding 只有一个 id 还未真正绑定对象，绑定对象的逻辑在返回的 BindingToSyntax 对象的方法中。

### BindingToSyntax

这个对象定义了丰富的绑定函数，诸如 to(), toSelf(), toConstantValue(),toFactory()等等。下面是 to()的代码：

```javascript
public to(constructor: new (...args: any[]) => T) {
        this._binding.type = BindingTypeEnum.Instance;
        this._binding.implementationType = constructor;
        return new BindingInWhenOnSyntax<T>(this._binding);
    }
```

### BindingInWhenOnSyntax

BindingToSyntax 的方法都返回一个叫 BindingInWhenOnSyntax 对象。这个对象也是对 binding 进行修改。不过情况稍微复杂，是三个类的集合：

```javascript
this._bindingWhenSyntax = new BindingWhenSyntax() < T > this._binding;
this._bindingOnSyntax = new BindingOnSyntax() < T > this._binding;
this._bindingInSyntax = new BindingInSyntax() < T > this._binding;
```

- BindingOnSyntax 最简单，只是设置 binding 的 onActivation 钩子, 这里不讲这个可选阶段。

```javascript
onActivation(handler: (context: interfaces.Context, injectable: T) => T) {
        this._binding.onActivation = handler;
        return new BindingWhenSyntax<T>(this._binding);
    }
```

- BindingWhenSyntax 顾名思义，主要用于设置条件绑定，包含的方法有 when , whenTargetNamed, whenTargetTagged 等等。
- BindingInSyntax：这个类主要用于设置 binding 的 Scope,包括 inRequestScope,inSingletonScope, inTransientScope 三个周期。

```javascript
public inRequestScope(){
    this._binding.scope = BindingScopeEnum.Request;
    return new BindingWhenOnSyntax<T>(this._binding);
 }
```

### Lookup

说完 binding，回头再聊聊什么是\_bindingDictionary,　实际上他是一个 Lookup 实例。故名思议，Lookup 对象负责储存绑定并提供了 add, get,remove,clone,hasKey 等各种方法。源码主要有：

```javascript
class Lookup<T extends interfaces.Clonable<T>> {
    // dictionary used store multiple values for each key <key>
    private _map: Map<interfaces.ServiceIdentifier<any>, T[]>;
    public constructor() {
        this._map = new Map<interfaces.ServiceIdentifier<any>, T[]>();
    }
    //add(serviceIdentifier, value: T): void,
    // get(serviceIdentifier): T[]
    // ...
```

### get

接下来我们看看 container 是如何实现 get 返回一个注入对象的实例的。主要逻辑：

```javascript
private _planAndResolve<T>(): (args: interfaces.NextArgs) => (T | T[]) {
        return (args: interfaces.NextArgs) => {
            // create a plan
            let context = plan(
                this._metadataReader,
                this,
                args.isMultiInject,
                args.targetType,
                args.serviceIdentifier,
                args.key,
                args.value,
                args.avoidConstraints
            );
            // apply context interceptor
            context = args.contextInterceptor(context);
            // resolve plan
            const result = resolve<T>(context);
            return result;
        };
    }
```

可以看到，get 主要分位两部分：context = plan(xxx) 和 resolve(context)分别对应着下面两个阶段 Planning 和 Resolution。

### Planning

plan 的入口代码主要为：

```javascript
function plan(
  container: interfaces.Container,
  isMultiInject: boolean,
  targetType: interfaces.TargetType,
  serviceIdentifier: interfaces.ServiceIdentifier<any>
  // ...
): interfaces.Context {
  const context = new Context(container);
  const target = _createTarget(targetType, serviceIdentifier, "");
  _createSubRequests(serviceIdentifier, context, null, target);
  return context;
}
```

可以看到，plan 函数一共做了三件事：1. 获取 context，　 2. 获取 target，　 3. 然后调用 createSubRequests。下面分别介绍这三个过程

#### context

context 是一个上下文对象，是当前信息的集合体，主要定义为：

```javascript
class Context implements interfaces.Context {
    public id: number;
    public container: interfaces.Container;
    public plan: interfaces.Plan;
    public currentRequest: interfaces.Request;
    public constructor(
        container: interfaces.Container) {
        this.id = id();　// generate a uniq id
        this.container = container;
    }
    //　个人觉得，预期叫addPlan,不如叫setPlan
    //  setPlan后，当前plan的parentContext也会指向当前context
    public addPlan(plan: interfaces.Plan) {
        this.plan = plan;
    }
    public setCurrentRequest(currentRequest: interfaces.Request) {
        this.currentRequest = currentRequest;
    }
}
```

其中 Plan 是一个比较简单的接口，一个 plan 代表着依赖解析阶段的一个将要解析的任务：

```javascript
export interface Plan {
  parentContext: Context;
  rootRequest: Request;
}
```

Request 其实可以理解为一个解析的请求，用于之后的依赖树的解析，每一个依赖对应着一个 Request。因此一个 plan 只要记录一个依赖树的 rootRequest，就能遍历到所有依赖 Request。

#### Target

Target 主要描述一个需要解析依赖的“待注入对象”， 获取 target 的代码比较简单：

```javascript
function _createTarget(
  targetType: interfaces.TargetType,
  serviceIdentifier: interfaces.ServiceIdentifier<any>,
  name: string
): interfaces.Target {
  const metadataKey = METADATA_KEY.INJECT_TAG;
  const injectMetadata = new Metadata(metadataKey, serviceIdentifier);
  const target = new Target(
    targetType,
    name,
    serviceIdentifier,
    injectMetadata
  );
  return target;
}
```

其中 targetType 是一个枚举值，container.get 方法传入的 targetType 是 TargetTypeEnum.Variable 代表对象的类型，其他还有 Constructor Argument,ClassProperty。

:::warning
注意：METADATA_KEY.INJECT_TAG 是上文 inject 装饰器标注 metadata 的 key。
:::

Target 类的签名为：需要注意的是，里面的 serviceIdentifier 与通常意义不一样。

```javascript
{
        id: number;　// uuid
        serviceIdentifier: ServiceIdentifier<any>;
        type: TargetType;
        name: QueryableString;
        metadata: Metadata[];
        getNamedTag(): interfaces.Metadata | null;
        getCustomTags(): interfaces.Metadata[] | null;
        hasTag(key: string | number | symbol): boolean;
        isArray(): boolean;
        matchesArray(name: interfaces.ServiceIdentifier<any>): boolean;
        isNamed(): boolean;
        isTagged(): boolean;
        isOptional(): boolean;
        matchesNamedTag(name: string): boolean;
        matchesTag(key: string | number | symbol): (value: any) => boolean;
}
```

#### createSubRequests

这个函数就是从上到下创建 Request 依赖树的过程, 直接上代码：

```javascript
function _createSubRequests(
  serviceIdentifier: interfaces.ServiceIdentifier<any>,
  context: interfaces.Context,
  parentRequest: interfaces.Request | null,
  target: interfaces.Target
) {
  let activeBindings: interfaces.Binding<any>[];
  let childRequest: interfaces.Request;
  //　第一次执行的时候parentRequest一定是null
  if (parentRequest === null) {
    //　从context.container的BindingDictionary中查找出所有bindings
    //　如果当前container找不到，尝试从container.parent中查找
    activeBindings = _getActiveBindings(context, null, target);
    childRequest = new Request(
      serviceIdentifier,
      context,
      null,
      activeBindings,
      target
    );
    const thePlan = new Plan(context, childRequest);
    context.addPlan(thePlan);
  } else {
    activeBindings = _getActiveBindings(context, parentRequest, target);
    childRequest = parentRequest.addChildRequest(
      target.serviceIdentifier,
      activeBindings,
      target
    );
  }
  //遍历当前的bindings
  activeBindings.forEach((binding) => {
    let subChildRequest: interfaces.Request | null = null;
    //　如果是singletonScope或者ConstantValue，那么cahce会缓存第一次创建时候的对象，就不用继续迭代下去了。
    if (binding.cache) {
      return;
    }
    subChildRequest = childRequest;
    //　如果当前binding类型是实例类型，并且constructor不为空，说明有当前类注入了子类，迭代下去。
    if (
      binding.type === BindingTypeEnum.Instance &&
      binding.implementationType !== null
    ) {
      const dependencies = getDependencies(binding.implementationType);
      dependencies.forEach((dependency: interfaces.Target) => {
        _createSubRequests(
          dependency.serviceIdentifier,
          context,
          subChildRequest,
          dependency
        );
      });
    }
  });
}
```

### Resolution

解析阶段主要是将 Planning 阶段生成的 Plan 从下到上逐一进行初始化，拼装，最终得到想要类的实例。

从上文可知，每一个依赖我们使用一个 Request 对象来表示，因此在本节之前我们有必要了解一下 Request 的内部结构：

```javascript
class Request implements interfaces.Request {
    public id: number;
    public serviceIdentifier: interfaces.ServiceIdentifier<any>;
    public parentContext: interfaces.Context;
    public parentRequest: interfaces.Request | null;
    public bindings: interfaces.Binding<any>[];
    public childRequests: interfaces.Request[];
    public target: interfaces.Target;
    // requestScope是一个Map<k,v>，用于缓存当前plan中所有解析过的binding
    public requestScope: interfaces.RequestScope;
    public constructor(
        serviceIdentifier: interfaces.ServiceIdentifier<any>,
        parentContext: interfaces.Context,
        parentRequest: interfaces.Request | null,
        bindings: (interfaces.Binding<any> | interfaces.Binding<any>[]),
        target: interfaces.Target
    ) {
            this.id = id(); // uuid
            this.serviceIdentifier = serviceIdentifier;
            this.parentContext = parentContext; //　当前所属的context
            this.parentRequest = parentRequest; //　父Request
            this.target = target;
            //　子Request列表
            this.childRequests = [];
            this.bindings = bindings;
            //　rootRequest的requestScope设为一个map对象，其下的子request设为null
            this.requestScope = parentRequest === null
                ? new Map<any, any>()
                : null;
    }
    public addChildRequest // ...
}
```

下面是依赖解析的简化代码：

```javascript
function resolve<T>(context: interfaces.Context): T {
    // context.plan.rootRequest.requestScope === new Map<any,any>()
    const _f = _resolveRequest(context.plan.rootRequest.requestScope);
    return _f(context.plan.rootRequest);
}

const _resolveRequest = (requestScope: interfaces.RequestScope) =>
  (request: interfaces.Request): any => {
    //　把当前context里面的request设为自己
    request.parentContext.setCurrentRequest(request);
    const bindings = request.bindings;
    const childRequests = request.childRequests;
    let result: any = null;
    //　如果当前解析的对象是可选的，并且bindings列表也是空的，那么就直接返回undefined
    if (request.target.isOptional() && bindings.length === 0) {
      return undefined;
    }
    //　为啥bindings是一个数组？因为可能有多重注入的问题，这里只考虑单注入，也就是bindings数组只有一项的情况。
    const binding = bindings[0];
    const isSingleton = binding.scope === BindingScopeEnum.Singleton;
    const isRequestSingleton = binding.scope === BindingScopeEnum.Request;
    //　如果，当前绑定是单例的，并且已经是激活状态，直接返回cache
    if (isSingleton && binding.activated) {
      return binding.cache;
    }

   //　如果当前是RequestScope，而且之前已经解析过当前binding了，那么直接返回Map里面缓存的实例
    if (
      isRequestSingleton &&
      requestScope !== null &&
      requestScope.has(binding.id)
    ) {
      return requestScope.get(binding.id);
    }

    if (binding.type === BindingTypeEnum.ConstantValue) {
      result = binding.cache;
    } else if (binding.type === BindingTypeEnum.Function) {
      result = binding.cache;
    } else if (binding.type === BindingTypeEnum.Constructor) {
      result = binding.implementationType;
    else if (xxxx) {
      // ...
    } else if (binding.type === BindingTypeEnum.Instance && binding.implementationType !== null) {
      //　如果是实例注入，那么需要先递归解析这个实例。注意，解析顺序一定要自下而上！！！
     const subResult = _resolveRequest(requestScope)
     //　使用resolveInstance来创建新实例，该函数还会调用postConstruct标记的类方法。
      result = resolveInstance(
        binding.implementationType,
        childRequests,
        subResult
      );
    } else {
      // The user probably created a binding but didn't finish it
      // e.g. container.bind<T>("Something"); missing BindingToSyntax
      const serviceIdentifier = getServiceIdentifierAsString(request.serviceIdentifier);
      throw new Error(`${ERROR_MSGS.INVALID_BINDING_TYPE} ${serviceIdentifier}`);
    }

    //　调用onActivation钩子
    if (typeof binding.onActivation === "function") {
      result = binding.onActivation(request.parentContext, result);
    }

    //　如果是单例模式，把结果缓存到cache里面并设置激活状态
    if (isSingleton) {
      binding.cache = result;
      binding.activated = true;
    }
    //　如果是RequestSingleton模式，那么把当前的结果存到requestScope这个map中
    if (
      isRequestSingleton &&
      requestScope !== null &&
      !requestScope.has(binding.id)
    ) {
      requestScope.set(binding.id, result);
    }
    return result;
  };

```

至此一个典型的 Annotation > bind > get 的过程逻辑就完了。事实上 inversify 支持的功能还远不只如此。
