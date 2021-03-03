# React 源码（三）- hooks

在没有 Hooks 之前，函数式组件不支持 state,也没有生命周期，所有的属性只能通过 Props 传递。Hooks 可以让我们在函数式组件里面使用 state 且支持生命周期。写函数式组件可以比类组件减少约 40%左右的代码量。

常用的 Hooks 有 useState, useEffect, useRef, useCallback, useMemo 等。useEffect 相当于 componentDidMount+componentDidupdate+componentWillUnmount 三个生命周期的集合。useEffect 第二个参数传[]，相当于 componentDidMount, 传[data] 相当于 componentDidupdate, return 函数相当于 componentWillUnmount。

## useState

useState 有 3 个阶段，mountState, dispatchAction 和 updateState

```javascript
    useState<S>(
      initialState: (() => S) | S,
    ): [S, Dispatch<BasicStateAction<S>>] {
      currentHookNameInDev = 'useState';
      updateHookTypesDev();
      const prevDispatcher = ReactCurrentDispatcher.current;
      ReactCurrentDispatcher.current = InvalidNestedHooksDispatcherOnMountInDEV;
      try {
        return mountState(initialState);
      } finally {
        ReactCurrentDispatcher.current = prevDispatcher;
      }
    },

```

初始化执行 useState 时注意执行了 mountState

```javascript
// 第一次执行函数体的时候
function mountState<S>(
  initialState: (() => S) | S
): [S, Dispatch<BasicStateAction<S>>] {
  const hook = mountWorkInProgressHook();

  // 1. 默认值是function，执行function，得到初始state
  if (typeof initialState === "function") {
    // $FlowFixMe: Flow doesn't like mixed types
    initialState = initialState();
  }
  // 2. state是存放在memoizedState
  hook.memoizedState = hook.baseState = initialState;
  // 3. 新建一个queue 是update队列
  const queue = (hook.queue = {
    pending: null,
    dispatch: null,
    lastRenderedReducer: basicStateReducer,
    lastRenderedState: (initialState: any),
  });

  // 4. 把queue传递给dispatch
  const dispatch: Dispatch<
    BasicStateAction<S>
  > = (queue.dispatch = (dispatchAction.bind(
    null,
    currentlyRenderingFiber,
    queue
  ): any));
  // 5. 返回默认值和dispatch
  return [hook.memoizedState, dispatch];
}
```

useState 返回了两个值，一个是默认值，一个是 dispatch。调用 dispatch 方法时，会走 dispatchAction 流程。

```javascript
// 每调用一次 setCount(2);setCount((count) => count++)
// 就会创建一个update，添加到queue.pending链表中
// 1. 创建一个update
// 2. update添加到quene里
// 3. 提前计算出最新的state，保存在eagerState
// 4. 最后调用一次scheduleWork，进入调度，触发function重新执行一次
function dispatchAction<S, A>(
  fiber: Fiber,
  queue: UpdateQueue<S, A>,
  action: A
) {
  if (__DEV__) {
    if (typeof arguments[3] === "function") {
      console.error(
        "State updates from the useState() and useReducer() Hooks don't support the " +
          "second callback argument. To execute a side effect after " +
          "rendering, declare it in the component body with useEffect()."
      );
    }
  }

  const eventTime = requestEventTime();
  const lane = requestUpdateLane(fiber);
  // 1. 创建一个update
  const update: Update<S, A> = {
    lane,
    action,
    eagerReducer: null,
    // 有闲暇的时间的时候，可以提前把state计算了，保存下来
    eagerState: null,
    next: (null: any),
  };

  // Append the update to the end of the list.
  const pending = queue.pending;
  if (pending === null) {
    // This is the first update. Create a circular list.
    update.next = update;
  } else {
    update.next = pending.next;
    pending.next = update;
  }

  // update添加到quene里
  queue.pending = update;

  const alternate = fiber.alternate;
  if (
    fiber === currentlyRenderingFiber ||
    (alternate !== null && alternate === currentlyRenderingFiber)
  ) {
    // This is a render phase update. Stash it in a lazily-created map of
    // queue -> linked list of updates. After this render pass, we'll restart
    // and apply the stashed updates on top of the work-in-progress hook.
    didScheduleRenderPhaseUpdateDuringThisPass = didScheduleRenderPhaseUpdate = true;
  } else {
    if (
      fiber.lanes === NoLanes &&
      (alternate === null || alternate.lanes === NoLanes)
    ) {
      // 当前队列为空，可以提前计算state
      // The queue is currently empty, which means we can eagerly compute the
      // next state before entering the render phase. If the new state is the
      // same as the current state, we may be able to bail out entirely.
      const lastRenderedReducer = queue.lastRenderedReducer;
      if (lastRenderedReducer !== null) {
        let prevDispatcher;
        if (__DEV__) {
          prevDispatcher = ReactCurrentDispatcher.current;
          ReactCurrentDispatcher.current = InvalidNestedHooksDispatcherOnUpdateInDEV;
        }
        try {
          const currentState: S = (queue.lastRenderedState: any);
          const eagerState = lastRenderedReducer(currentState, action);
          // Stash the eagerly computed state, and the reducer used to compute
          // it, on the update object. If the reducer hasn't changed by the
          // time we enter the render phase, then the eager state can be used
          // without calling the reducer again.
          update.eagerReducer = lastRenderedReducer;
          // 3. 提前计算出最新的state，保存在eagerState
          update.eagerState = eagerState;
          if (is(eagerState, currentState)) {
            // Fast path. We can bail out without scheduling React to re-render.
            // It's still possible that we'll need to rebase this update later,
            // if the component re-renders for a different reason and by that
            // time the reducer has changed.
            return;
          }
        } catch (error) {
          // Suppress the error. It will throw again in the render phase.
        } finally {
          if (__DEV__) {
            ReactCurrentDispatcher.current = prevDispatcher;
          }
        }
      }
    }
    if (__DEV__) {
      // $FlowExpectedError - jest isn't a global, and isn't recognized outside of tests
      if (typeof jest !== "undefined") {
        warnIfNotScopedWithMatchingAct(fiber);
        warnIfNotCurrentlyActingUpdatesInDev(fiber);
      }
    }
    // 4. 最后调用一次scheduleWork，进入调度，触发function重新执行一次
    scheduleUpdateOnFiber(fiber, lane, eventTime);
  }

  if (__DEV__) {
    if (enableDebugTracing) {
      if (fiber.mode & DebugTracingMode) {
        const name = getComponentName(fiber.type) || "Unknown";
        logStateUpdateScheduled(name, lane, action);
      }
    }
  }

  if (enableSchedulingProfiler) {
    markStateUpdateScheduled(fiber, lane);
  }
}
```

最后执行了 scheduleUpdateOnFiber，scheduleUpdateOnFiber 会执行 render 函数，函数式组件会重新执行。这时再执行 useState 时，会走 updateState。

```javascript
    useState<S>(
      initialState: (() => S) | S,
    ): [S, Dispatch<BasicStateAction<S>>] {
      currentHookNameInDev = 'useState';
      warnInvalidHookAccess();
      updateHookTypesDev();
      const prevDispatcher = ReactCurrentDispatcher.current;
      ReactCurrentDispatcher.current = InvalidNestedHooksDispatcherOnUpdateInDEV;
      try {
        return updateState(initialState);
      } finally {
        ReactCurrentDispatcher.current = prevDispatcher;
      }
    },
```

来看下 updateState

```javascript
// 后面通过state更新， 重新执行function Component
// 调updateState
// useState就是一个reducer的语法糖
function updateState<S>(
  initialState: (() => S) | S
): [S, Dispatch<BasicStateAction<S>>] {
  return updateReducer(basicStateReducer, (initialState: any));
}
```

updateState 直接执行 updateReducer

```javascript
// 1. 递归执行quene里的update
// 2. 计算最新的state，赋值给memoizedState
function updateReducer<S, I, A>(
  reducer: (S, A) => S,
  initialArg: I,
  init?: (I) => S
): [S, Dispatch<A>] {
  const hook = updateWorkInProgressHook();
  // 拿到mount阶段创建的queue
  const queue = hook.queue;
  invariant(
    queue !== null,
    "Should have a queue. This is likely a bug in React. Please file an issue."
  );

  queue.lastRenderedReducer = reducer;

  const current: Hook = (currentHook: any);

  // The last rebase update that is NOT part of the base state.
  let baseQueue = current.baseQueue;

  // The last pending update that hasn't been processed yet.
  const pendingQueue = queue.pending;
  if (pendingQueue !== null) {
    // We have new updates that haven't been processed yet.
    // We'll add them to the base queue.
    if (baseQueue !== null) {
      // Merge the pending queue and the base queue.
      const baseFirst = baseQueue.next;
      const pendingFirst = pendingQueue.next;
      baseQueue.next = pendingFirst;
      pendingQueue.next = baseFirst;
    }
    if (__DEV__) {
      if (current.baseQueue !== baseQueue) {
        // Internal invariant that should never happen, but feasibly could in
        // the future if we implement resuming, or some form of that.
        console.error(
          "Internal error: Expected work-in-progress queue to be a clone. " +
            "This is a bug in React."
        );
      }
    }
    current.baseQueue = baseQueue = pendingQueue;
    queue.pending = null;
  }

  if (baseQueue !== null) {
    // We have a queue to process.
    const first = baseQueue.next;
    let newState = current.baseState;

    let newBaseState = null;
    let newBaseQueueFirst = null;
    let newBaseQueueLast = null;
    let update = first;
    do {
      const updateLane = update.lane;
      // 优先级判断，优先级不够，跳过此更新
      if (!isSubsetOfLanes(renderLanes, updateLane)) {
        // Priority is insufficient. Skip this update. If this is the first
        // skipped update, the previous update/state is the new base
        // update/state.
        const clone: Update<S, A> = {
          lane: updateLane,
          action: update.action,
          eagerReducer: update.eagerReducer,
          eagerState: update.eagerState,
          next: (null: any),
        };
        if (newBaseQueueLast === null) {
          newBaseQueueFirst = newBaseQueueLast = clone;
          newBaseState = newState;
        } else {
          newBaseQueueLast = newBaseQueueLast.next = clone;
        }
        // Update the remaining priority in the queue.
        // TODO: Don't need to accumulate this. Instead, we can remove
        // renderLanes from the original lanes.
        currentlyRenderingFiber.lanes = mergeLanes(
          currentlyRenderingFiber.lanes,
          updateLane
        );
        markSkippedUpdateLanes(updateLane);
      } else {
        // This update does have sufficient priority.
        // 新建一个update
        if (newBaseQueueLast !== null) {
          const clone: Update<S, A> = {
            // This update is going to be committed so we never want uncommit
            // it. Using NoLane works because 0 is a subset of all bitmasks, so
            // this will never be skipped by the check above.
            lane: NoLane,
            action: update.action,
            eagerReducer: update.eagerReducer,
            eagerState: update.eagerState,
            next: (null: any),
          };
          newBaseQueueLast = newBaseQueueLast.next = clone;
        }

        // Process this update.
        // eagerState是预先处理的state
        if (update.eagerReducer === reducer) {
          // If this update was processed eagerly, and its reducer matches the
          // current reducer, we can use the eagerly computed state.
          newState = ((update.eagerState: any): S);
        } else {
          // state的计算，本来就是放在updateState
          const action = update.action;
          newState = reducer(newState, action);
        }
      }
      update = update.next;
    } while (update !== null && update !== first);

    if (newBaseQueueLast === null) {
      newBaseState = newState;
    } else {
      newBaseQueueLast.next = (newBaseQueueFirst: any);
    }

    // Mark that the fiber performed work, but only if the new state is
    // different from the current state.
    if (!is(newState, hook.memoizedState)) {
      markWorkInProgressReceivedUpdate();
    }

    hook.memoizedState = newState;
    hook.baseState = newBaseState;
    hook.baseQueue = newBaseQueueLast;

    queue.lastRenderedState = newState;
  }

  // 返回最新的值
  const dispatch: Dispatch<A> = (queue.dispatch: any);
  return [hook.memoizedState, dispatch];
}
```

可以看到,我们执行 setState 之后，并不会立即更新，而是丢到队列里了，执行调度器的时候会重新 render，这个时候 useState 才去取新的值。

## useEffect

useEffect 也分为两个阶段，mountEffect 和 updateEffect。

```javascript
//create和deps是传递的两个参数
function mountEffectImpl(fiberFlags, hookFlags, create, deps): void {
  const hook = mountWorkInProgressHook();
  // 依赖数组, 强烈杜绝不写依赖数组 会造成频繁更新 可能还会死循环
  const nextDeps = deps === undefined ? null : deps;
  // 设置fiberFlags
  currentlyRenderingFiber.flags |= fiberFlags;

  //注意，Push的值不是state,是Effect
  // const effect: Effect = {
  //   tag,
  //   create,
  //   destroy,
  //   deps,
  //   // Circular
  //   next: (null: any),
  // }
  hook.memoizedState = pushEffect(
    HookHasEffect | hookFlags,
    create,
    undefined,
    nextDeps
  );
}
```

来看下 pushEffect 里的实现

```javascript
function pushEffect(tag, create, destroy, deps) {
  const effect: Effect = {
    tag,
    create, //create是useEffect第一个参数 () => {return ***}
    destroy, // create的返回结果
    deps, // useEffect第二个参数
    // Circular
    next: (null: any),
  };
  // 把effect 添加到链表的最后
  let componentUpdateQueue: null | FunctionComponentUpdateQueue = (currentlyRenderingFiber.updateQueue: any);
  if (componentUpdateQueue === null) {
    componentUpdateQueue = createFunctionComponentUpdateQueue();
    currentlyRenderingFiber.updateQueue = (componentUpdateQueue: any);
    componentUpdateQueue.lastEffect = effect.next = effect;
  } else {
    const lastEffect = componentUpdateQueue.lastEffect;
    if (lastEffect === null) {
      componentUpdateQueue.lastEffect = effect.next = effect;
    } else {
      const firstEffect = lastEffect.next;
      lastEffect.next = effect;
      effect.next = firstEffect;
      componentUpdateQueue.lastEffect = effect;
    }
  }
  return effect;
}
```

总结一下，mountEffect 主要做了以下几件事:

- 1. 设置依赖数组
- 2. 设置 tag
- 3. 新增一个 effect 到 currentlyRenderingFiber.updateQueue 中，参与到 completeRoot 里去。

useEffect 最开始是相当于 didMount 和 didUpdate，会在上一章分析的 commitLayoutEffects 里执行。

mountEffect 执行时机 在 commitRoot-> recursivelyCommitLayoutEffects-> commitHookEffectListMount 里执行 mountEffect。

```javascript
function commitHookEffectListMount(flags: HookFlags, finishedWork: Fiber) {
  const updateQueue: FunctionComponentUpdateQueue | null = (finishedWork.updateQueue: any);
  const lastEffect = updateQueue !== null ? updateQueue.lastEffect : null;
  if (lastEffect !== null) {
    // 有更新队列
    const firstEffect = lastEffect.next;
    let effect = firstEffect;
    //遍历所有队列
    do {
      if ((effect.tag & flags) === flags) {
        // Mount
        const create = effect.create;
        // 执行create
        effect.destroy = create();
      }
      effect = effect.next;
    } while (effect !== firstEffect);
  }
}
```

updateEffect 阶段比 mount 阶段多了一个东西，即对比依赖。

```javascript
function updateEffectImpl(fiberFlags, hookFlags, create, deps): void {
  const hook = updateWorkInProgressHook();
  const nextDeps = deps === undefined ? null : deps;
  let destroy = undefined;

  if (currentHook !== null) {
    const prevEffect = currentHook.memoizedState;
    // destroy 是useEffect返回的回调函数
    destroy = prevEffect.destroy;
    if (nextDeps !== null) {
      const prevDeps = prevEffect.deps;
      // useEffect的依赖的对比
      // 对比依赖的值有没有变化，没有变化的话，push一个no_effect 的hookFlags进去。
      if (areHookInputsEqual(nextDeps, prevDeps)) {
        pushEffect(hookFlags, create, destroy, nextDeps);
        return;
      }
    }
  }

  //设置flags
  currentlyRenderingFiber.flags |= fiberFlags;

  // 如果有变化，或者没有设置依赖，重新发起一次update
  hook.memoizedState = pushEffect(
    HookHasEffect | hookFlags,
    create,
    destroy,
    nextDeps
  );
}
```

那 destroy 什么时候执行? 答案是在 commitUnmount 阶段卸载组件的时候，会调用 destroy 方法。具体路径是 flushPassiveUnmountEffects->flushPassiveUnmountEffectsInsideOfDeletedTree->commitPassiveUnmount->commitHookEffectListUnmount->safelyCallDestroy

```javascript
export function safelyCallDestroy(
  current: Fiber,
  nearestMountedAncestor: Fiber | null,
  destroy: () => void
) {
  if (__DEV__) {
    invokeGuardedCallback(null, destroy, null);
    if (hasCaughtError()) {
      const error = clearCaughtError();
      captureCommitPhaseError(current, nearestMountedAncestor, error);
    }
  } else {
    try {
      destroy();
    } catch (error) {
      captureCommitPhaseError(current, nearestMountedAncestor, error);
    }
  }
}
```

## hooks 常见的坑

react 新特性--->hooks，用 hooks 时遇到哪些问题？

1. 什么是 capture value

```javascript
function App(props) {
  const [age, setAge] = useState(20);

  return (
    <button
      onClick={() => {
        setAge(30);
        setTimeout(() => {
          console.log(age);
        }, 2000);
      }}
    >
      改变age
    </button>
  );
}
```

上面代码执行的结果是 20, 第一次执行了 App, setAge 之后，又会执行 App。由于第一次执行后，setTimeout 存在，由于还没执行完，上下文还保留了。这是由 JS 闭包导致的。

class 组件为什么没有这个问题？这是因为 class 组件里有 this。this 可以帮助我们找到对应的值。

2. 死循环

```javascript
function App(props) {
  // 如果直接把clickFunction传递给子组件，重新执行App，子组件都会重新渲染
  const clickFunction = (name) => {
    setName(name);
  };

  // 使用useCallback
  const changeState = useCallback(
    (name) => {
      fetch("xxx").then((res) => {
        setName(res.name);
      });
    },
    [age]
  );

  return <div onClick={changeState}></div>;
}
```

死循环例 2：

```javascript
function App(props) {
  const [count, setCount] = useState(0);
  const addCount = useCallback(() => {
    setCount(count + 1);
    //解决办法 用function
    //setCount((c) => c+1)
    //解决办法二 用ref
    //ref1.current = count++;
  }, [count]);

  useEffect(() => {
    addCount();
  }, [addCount]);
  return <div></div>;
}
```

3. 子组件怎么避免无意义渲染
   使用 useCallback 包括函数传递给子组件。

```javascript
function App(props) {
  const [name, setName] = useState("");
  const [count, setCount] = useState(0);
  const addCount = useCallback(() => {
    setCount(count + 1);
  }, []);
  return (
    <div>
      <Child name={name} addCount={addCount} />
    </div>
  );
}

const Child = ({ name, addCount }) => {
  return <div onClick={addCount}>{name}</div>;
};
```

上面的例子即使用了 addCount 加了 useCallback，当 App 更新时，Child 还是会重新渲染。为啥？因为 Child 没有 componentShouldUpdate 方法。React 提供了 memo 函数提供浅比较渲染。

解决办法就是用 memo 包裹子组件，同时函数用 useCallback 包裹。

4. 多个 state setName setAge 同时调用时，会 render 两次？怎么解决这个问题？
   强制批处理，使用 unstatable_batchedUpdates

```javascript
unstable_batchedUpdates(() => {
  setName("ddd");
  setCount(34);
}, []);
```

5. 怎么完全分离 didMount 和 didUpdate？因为当 useEffect 有依赖时相当于 didMount 和 didUpdate 的结合。
   借助 ref

```javascript
function App(props) {
  const isUpdate = useRef(false);
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!isUpdate.current) {
      isUpdate.current = true;
      //didMount
    } else {
      // didUpdate
    }
  }, [count]);

  return <div></div>;
}
```
