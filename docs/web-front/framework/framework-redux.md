# Redux 源码（一）

## Flux 架构介绍

React 本身只涉及 UI 层，如果搭建大型应用，必须搭配一个状态管理的前端框架。

Flux 是一种架构思想，专门解决软件结构问题，它跟 MVC 架构是同一类东西，但是更加简洁。

Flux 架构基本概念

- View: 视图层
- Action: 视图层发出的消息
- Dispatcher: 用来接收 Actions,执行回调函数
- Store: 数据层，用来存放应用的状态，一旦发生改变，就发出一个"change"事件，提醒 View 层要更新页面。View 接收到 change 事件，更新页面

## Redux 介绍

基于 Flux 思想，出现了很多框架，Redux 就是其中之一。Redux 里都是用的函数式编程思想。函数式编程首先是一种范畴，是范畴论的一种应用，函数式编程是范畴论中的一个数学分支。在函数式编程中，没有 if else，只有函子。函数式编程首先得有一个 container 容器，什么样的容器能变成函子呢，有 map 并且接收一个变形关系，作用于每一个 value。因为有很多函子，函数式编程讲究纯，要把所有的脏操用 IO 函子包裹。Redux 中使用的就是这种机制，包括 store, currentState, action, reducer 和 middlewares。

store -> container

currentState -> value

action -> f 变形关系

reducer -> map 接受 action 改变值

middleware -> IO 函子，解决异步和脏操作

## createStore

createStore 函数中，主要完成 dispatch， subscribe，getState，replaceReducer 函数的初始化

```javascript
import $$observable from "symbol-observable";

import ActionTypes from "./utils/actionTypes";

// reducer 是负责改变state的函数
// enhancer就是我们的applyMiddleware的返回值
export default function createStore(reducer, preloadedState, enhancer) {
  if (typeof enhancer !== "undefined") {
    if (typeof enhancer !== "function") {
      throw new Error("Expected the enhancer to be a function.");
    }

    // 如果有设置中间件，那么需要把createStore传给enhancer
    return enhancer(createStore)(reducer, preloadedState);
  }

  if (typeof reducer !== "function") {
    throw new Error("Expected the reducer to be a function.");
  }

  let currentReducer = reducer;
  let currentState = preloadedState; //preloadedState初始化state
  let currentListeners = []; // 监听器
  let nextListeners = currentListeners;
  let isDispatching = false;

  /**
   * This makes a shallow copy of currentListeners so we can use
   * nextListeners as a temporary list while dispatching.
   *
   * This prevents any bugs around consumers calling
   * subscribe/unsubscribe in the middle of a dispatch.
   */
  function ensureCanMutateNextListeners() {
    if (nextListeners === currentListeners) {
      nextListeners = currentListeners.slice();
    }
  }

  /**
   * Reads the state tree managed by the store.
   *
   * @returns {any} The current state tree of your application.
   */
  function getState() {
    if (isDispatching) {
      throw new Error(
        "You may not call store.getState() while the reducer is executing. " +
          "The reducer has already received the state as an argument. " +
          "Pass it down from the top reducer instead of reading it from the store."
      );
    }

    return currentState;
  }

  /**
   * Adds a change listener. It will be called any time an action is dispatched,
   * and some part of the state tree may potentially have changed. You may then
   * call `getState()` to read the current state tree inside the callback.
   *
   * You may call `dispatch()` from a change listener, with the following
   * caveats:
   *
   * 1. The subscriptions are snapshotted just before every `dispatch()` call.
   * If you subscribe or unsubscribe while the listeners are being invoked, this
   * will not have any effect on the `dispatch()` that is currently in progress.
   * However, the next `dispatch()` call, whether nested or not, will use a more
   * recent snapshot of the subscription list.
   *
   * 2. The listener should not expect to see all state changes, as the state
   * might have been updated multiple times during a nested `dispatch()` before
   * the listener is called. It is, however, guaranteed that all subscribers
   * registered before the `dispatch()` started will be called with the latest
   * state by the time it exits.
   *
   * @param {Function} listener A callback to be invoked on every dispatch.
   * @returns {Function} A function to remove this change listener.
   */
  // 订阅，就是把listener 放进nextListeners
  // listener在每次dispatch之后都会执行一次
  function subscribe(listener) {
    let isSubscribed = true;

    ensureCanMutateNextListeners();
    nextListeners.push(listener);

    return function unsubscribe() {
      if (!isSubscribed) {
        return;
      }

      if (isDispatching) {
        throw new Error(
          "You may not unsubscribe from a store listener while the reducer is executing. " +
            "See https://redux.js.org/api-reference/store#subscribelistener for more details."
        );
      }

      isSubscribed = false;

      ensureCanMutateNextListeners();
      const index = nextListeners.indexOf(listener);
      nextListeners.splice(index, 1);
      currentListeners = null;
    };
  }

  /**
   * Dispatches an action. It is the only way to trigger a state change.
   *
   * The `reducer` function, used to create the store, will be called with the
   * current state tree and the given `action`. Its return value will
   * be considered the **next** state of the tree, and the change listeners
   * will be notified.
   *
   * The base implementation only supports plain object actions. If you want to
   * dispatch a Promise, an Observable, a thunk, or something else, you need to
   * wrap your store creating function into the corresponding middleware. For
   * example, see the documentation for the `redux-thunk` package. Even the
   * middleware will eventually dispatch plain object actions using this method.
   *
   * @param {Object} action A plain object representing “what changed”. It is
   * a good idea to keep actions serializable so you can record and replay user
   * sessions, or use the time travelling `redux-devtools`. An action must have
   * a `type` property which may not be `undefined`. It is a good idea to use
   * string constants for action types.
   *
   * @returns {Object} For convenience, the same action object you dispatched.
   *
   * Note that, if you use a custom middleware, it may wrap `dispatch()` to
   * return something else (for example, a Promise you can await).
   */
  // 1. dispatch接收action，触发state更新，返回一个新的state
  // 2. 调用listener，通知所有监听者
  function dispatch(action) {
    try {
      isDispatching = true;
      // reducer负责更新state
      currentState = currentReducer(currentState, action);
    } finally {
      isDispatching = false;
    }

    const listeners = (currentListeners = nextListeners);
    for (let i = 0; i < listeners.length; i++) {
      const listener = listeners[i];
      listener();
    }

    return action;
  }

  /**
   * Replaces the reducer currently used by the store to calculate the state.
   *
   * You might need this if your app implements code splitting and you want to
   * load some of the reducers dynamically. You might also need this if you
   * implement a hot reloading mechanism for Redux.
   *
   * @param {Function} nextReducer The reducer for the store to use instead.
   * @returns {void}
   */

  // store创建之后，可以使用这个方法替换掉reducer
  function replaceReducer(nextReducer) {
    if (typeof nextReducer !== "function") {
      throw new Error("Expected the nextReducer to be a function.");
    }

    currentReducer = nextReducer;

    // This action has a similiar effect to ActionTypes.INIT.
    // Any reducers that existed in both the new and old rootReducer
    // will receive the previous state. This effectively populates
    // the new state tree with any relevant data from the old one.
    // 使用新的reducer的initState
    dispatch({ type: ActionTypes.REPLACE });
  }

  /**
   * Interoperability point for observable/reactive libraries.
   * @returns {observable} A minimal observable of state changes.
   * For more information, see the observable proposal:
   * https://github.com/tc39/proposal-observable
   */
  function observable() {
    const outerSubscribe = subscribe;
    return {
      /**
       * The minimal observable subscription method.
       * @param {Object} observer Any object that can be used as an observer.
       * The observer object should have a `next` method.
       * @returns {subscription} An object with an `unsubscribe` method that can
       * be used to unsubscribe the observable from the store, and prevent further
       * emission of values from the observable.
       */
      subscribe(observer) {
        if (typeof observer !== "object" || observer === null) {
          throw new TypeError("Expected the observer to be an object.");
        }

        function observeState() {
          if (observer.next) {
            observer.next(getState());
          }
        }

        observeState();
        const unsubscribe = outerSubscribe(observeState);
        return { unsubscribe };
      },

      [$$observable]() {
        return this;
      },
    };
  }

  // When a store is created, an "INIT" action is dispatched so that every
  // reducer returns their initial state. This effectively populates
  // the initial state tree.
  // 如果sate创建的时候，没有传initState，确保每个reducer返回他们对应额初始化state
  dispatch({ type: ActionTypes.INIT });

  return {
    dispatch,
    subscribe,
    getState,
    replaceReducer,
    [$$observable]: observable,
  };
}
```

由于 createStore 中只接收一个 reducer，而实际项目中，我们会根据业务写多个 reducer，这个时候就需要用 combineReducers 来合并 reducer

## combineReducers

combineReducers 是一个函数，返回的也是一个函数。返回的函数其实就是给 createStore 里 dispatch 执行的 reduce 函数。

combineReducers 里遍历了所有的 reducerKey，存进一个 finalReducers 对象中。主要操作放在了返回的 combination 函数中，在 combination 函数中对比 state 是否发生改变从而返回对应的 state。

```javascript
// 返回给state执行的reducer
export default function combineReducers(reducers) {
  const reducerKeys = Object.keys(reducers);
  const finalReducers = {};

  // 遍历所有的reducerKeys, 复制到finalReducers中
  for (let i = 0; i < reducerKeys.length; i++) {
    const key = reducerKeys[i];

    if (typeof reducers[key] === "function") {
      finalReducers[key] = reducers[key];
    }
  }
  const finalReducerKeys = Object.keys(finalReducers);

  // This is used to make sure we don't warn about the same
  // keys multiple times.
  let unexpectedKeyCache;
  if (process.env.NODE_ENV !== "production") {
    unexpectedKeyCache = {};
  }

  let shapeAssertionError;
  try {
    assertReducerShape(finalReducers);
  } catch (e) {
    shapeAssertionError = e;
  }

  // 返回一个函数
  return function combination(state = {}, action) {
    if (shapeAssertionError) {
      throw shapeAssertionError;
    }

    let hasChanged = false;
    const nextState = {};
    //
    for (let i = 0; i < finalReducerKeys.length; i++) {
      const key = finalReducerKeys[i];
      const reducer = finalReducers[key];

      // 记录上一次的state，方便后续比较
      const previousStateForKey = state[key];

      // 获取到现在的state
      const nextStateForKey = reducer(previousStateForKey, action);
      if (typeof nextStateForKey === "undefined") {
        const errorMessage = getUndefinedStateErrorMessage(key, action);
        throw new Error(errorMessage);
      }

      // 判断state是否发生了变化
      nextState[key] = nextStateForKey;
      hasChanged = hasChanged || nextStateForKey !== previousStateForKey;
    }
    hasChanged =
      hasChanged || finalReducerKeys.length !== Object.keys(state).length;
    // 如果发生了变化 返回新的state，否则返回原来的state
    return hasChanged ? nextState : state;
  };
}
```

如果我们想要添加中间件怎么办？例如我们想添加打印 store 中的 state 的中间件，想要捕获错误的中间件。中间件也有可能会有很多，因此还需要考虑中间件的写法，避免洋葱代码。这个时候就需要用到 applyMiddleware 了。

## applyMiddleware

当不用函数式编程时。我们写出来的代码可能是这样的

```javascript
//初始化中间件
const next = store.dispatch;
const logger = loggerMiddleware(store);
const exception = exceptiontimeMiddleware(store);
const time = timeMiddleware(store);
store.dispatch = exception(time(logger(next)));
```

一旦中间件数量剧增，这样的代码将会越来越难看。因此需要用柯里化和函数组合来解决。

首先定义 compose 函数，解决中间件方法嵌套写法。

```javascript
// 函数组合
export default function compose(...funcs) {
  if (funcs.length === 0) {
    return (arg) => arg;
  }

  if (funcs.length === 1) {
    // 如果只有一个函数，直接取出返回
    return funcs[0];
  }

  // 使用reduce对funcs中的每个元素执行 我们的reducer方法
  return funcs.reduce((a, b) => (...args) => a(b(...args)));
}
```

然后就该 applyMiddleware 上场了

```javascript
// applyMiddleware使用函数组合解决中间件嵌套的问题

export default function applyMiddleware(...middlewares) {
  // createStore是创建store传递进来的函数
  return (createStore) => (...args) => {
    const store = createStore(...args);
    let dispatch = () => {
      throw new Error(
        "Dispatching while constructing your middleware is not allowed. " +
          "Other middleware would not be applied to this dispatch."
      );
    };

    // 中间件里只用到了store的state和dispatch，只把这两个传进middleware中
    const middlewareAPI = {
      getState: store.getState, // 缩小查找范围
      dispatch: (...args) => dispatch(...args),
    };
    // 把中间件做成链 并返回middleware(middlewareAPI) 函数执行第一层后的结果
    const chain = middlewares.map((middleware) => middleware(middlewareAPI));

    // 返回新的dispatch.
    // store.dispatch是中间件的第二层传递的参数
    // 中间件接收store.dispatch, 然后返回一个dispatch
    dispatch = compose(...chain)(store.dispatch);

    return {
      ...store,
      dispatch,
    };
  };
}
```

项目中，action 也会很多，如果一个一个写未免太麻烦。Redux 给我们提供了一个 bindActionCreators 方法

## bindActionCreators

```javascript
// 实际开发过程中会有很多action，
// bindActionCreators把所有的action并在一起

export default function bindActionCreators(actionCreators, dispatch) {
  const boundActionCreators = {};
  // bindActionCreator返回一个函数
  for (const key in actionCreators) {
    const actionCreator = actionCreators[key];
    if (typeof actionCreator === "function") {
      // 在 key上挂bindActionCreator bindActionCreator返回dispatch函数
      // {increment: () => dispatch(actionCreator.apply(this, arguments))}
      boundActionCreators[key] = bindActionCreator(actionCreator, dispatch);
    }
  }

  return boundActionCreators;
}

// 高阶函数
function bindActionCreator(actionCreator, dispatch) {
  return function() {
    // 用dispatch dispatch action
    return dispatch(actionCreator.apply(this, arguments));
  };
}
```

在项目中我们的使用会优雅很多。

```javascript
import { increment } from "./actions/counter.js";
import { setName } from "./actions/info.js";

const actions = bindActionCreators({ increment, setName }, store.dispatch);

actions.increment();
actions.setName();
```
