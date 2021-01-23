# React 源码分析（四）- 综合

## React 各大版本演进

1. React15
   React15 的架构主要有两个部分，Reconciler 负责找出变化的组件，Renderer 通过变化的组件，做 dom-diff，最终渲染到页面上。

React15 的架构是递归的，如果组件层级很深，每次重新 setState 的时候，会导致阻塞用户后续交互，出现卡顿。

React15 虽然做了批处理等优化，但是无法解决长任务阻塞问题。为了解决这个问题，有了 React16 Fiber 的架构。

2.  React 16
    React16 中执行异步的调度任务会在宏任务中执行，这样可以保证不会让用户失去响应。

同时 React16 对所有的更新都做了一个优先级的绑定，当出现多个更新同时需要处理的时候，可以中断低优先级的更新，先执行高优先级的更新。新增了 Scheduler 模块，来调度任务的优先级。低优先级的任务如果一直得不到执行，随着过期时间越长，它的优先级会越来越高，最终也会得到执行。

React16 的缺点：

当 React 发起一个更新时，会从 FiberRoot 节点开始往下遍历，找到需要更新的节点，再进行任务调度。无法做到 VUE 的靶向更新。

高优先级 CPU 任务会打断低优先级 IO 任务。低优先 IO 任务可能能很快执行完成，高优先级任务可能会耗费大量时间，但是也需要等待高优先级任务执行完。

React17 为了解决这个问题，扩展了优先级。

3. React 17
   React17 对优先级进行了一个扩展，从指定一个优先级到 指定到一个一个连续的优先级区间(Lane)。这样可以让一个优先级区间的一起执行

## Scheduler(调度器)

调度任务的优先级，高优先级任务优先进入 Reconciler。

### React 里的优先级

- 生命周期方法： 同步执行
- 受控的用户输入：比如输入框内输入文字，同步执行
- 交互事件：比如动画，高优先级执行
- 其它：比如数据请求，低优先级执行

### 大致的调度逻辑

#### Fiber 的结构

首先来看下 Fiber 结构

```javascript
function FiberNode(
  tag: WorkTag,
  pendingProps: mixed,
  key: null | string,
  mode: TypeOfMode
) {
  // Instance
  this.tag = tag;
  // 标志节点唯一性，dom-diff时用到
  this.key = key;
  this.elementType = null;

  // 节点类型 FunctionComponent ClassComponent
  this.type = null;

  // stateNode存储了真实的dom节点信息<div></div>
  this.stateNode = null;

  // Fiber
  // 指向父节点
  this.return = null;
  // 孩子节点
  this.child = null;
  // 兄弟节点
  this.sibling = null;
  this.index = 0;

  this.ref = null;

  // 保存本次更新造成的状态改变相关信息
  this.pendingProps = pendingProps;
  this.memoizedProps = null;
  this.updateQueue = null;
  this.memoizedState = null;
  this.dependencies = null;

  this.mode = mode;

  // Effects
  // 标志副作用的类型: 删除、新增、更改
  this.flags = NoFlags;
  this.subtreeFlags = NoFlags;
  this.deletions = null;

  // 优先级
  this.lanes = NoLanes;
  this.childLanes = NoLanes;

  // 指向workInProgressFiber
  this.alternate = null;
}
```
