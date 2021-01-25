# redux

## createStore

```javascript
export default function createStore(
  reducer,
  initState,
  rewriteCreateStoreFunc // 就是middraets
) {
  if (rewriteCreateStoreFunc) {
    const newCreateStore = rewriteCreateStoreFunc(createStore);
    return newCreateStore(reducer, initState);
  }
  let state = initState;
  let listeners = [];
  function subscribe(listener) {
    listeners.push(listener);
    return function unsubscribe() {
      const index = listeners.indexOf(listener);
      listeners.splice(index, 1);
    };
  }
  function getState() {
    return state;
  }
  function dispatch(action) {
    //reducer负责更新数据
    state = reducer(state, action);
    for (let i = 0; i < listeners.length; i++) {
      const listener = listeners[i];
      listener();
    }
  }
  function replaceReducer(nextReucer) {
    reducer = nextReucer;
    dispatch({ type: Symbol() });
  }
  dispatch({ type: Symbol() });
  return {
    subscribe,
    getState,
    dispatch,
    replaceReducer,
  };
}
```

## combineReducers

把创建的 reducers 遍历，执行 reducer 函数，返回新的 state

```javascript
export default function combineReducers(reducers) {
  const reducerKeys = Object.keys(reducers);
  return function combinaction(state = {}, action) {
    const nextState = {};
    for (let i = 0; i < reducerKeys.length; i++) {
      const key = reducerKeys[i];
      const reducer = reducers[key];
      //现有 的状态
      const previousStateForkey = state[key];
      const nextStateForkey = reducer(previousStateForkey, action);
      nextState[key] = nextStateForkey;
    }
    return nextState;
  };
}
```

## applyMiddare

来看一下一个 middare

```javascript
// 来看一下一个middare
const loggerMiddleware = (store) => (next) => (action) => {
  console.log("this state", store.getState());
  console.log("action", action);
  next(action);
  console.log("next state", store.getState());
};
export default loggerMiddleware;
```

applyMiddares 要把所有 middare 链接到 store 中

```javascript
import compose from "./compose.js";

const applyMiddleware = function(...middlewares) {
  return function(oldCreateStore) {
    return function(reducer, initState) {
      const store = oldCreateStore(reducer, initState);
      const simpleStore = { getState: store.getState };
      const chain = middlewares.map((middleware) => middleware(simpleStore));
      const dispatch = compose(...chain)(store.dispatch);
      return {
        ...store,
        dispatch,
      };
    };
  };
};
export default applyMiddleware;
```

compose.js

```javascript
export default function compose(...funcs) {
  if (funcs.length === 0) {
    return (arg) => arg;
  }
  if (funcs.length === 1) {
    return funcs[0];
  }
  return funcs.reduce((a, b) => (...args) => a(b(...args)));
}
```

### bindActionCreators

```javascript
function bindActionCreator(actionCreator, dispatch) {
  return function() {
    return dispatch(actionCreator.apply(this, arguments));
  };
}

export default function bindActionCreators(actionCreators, dispatch) {
  const boundActionCreators = {};
  for (const key in actionCreators) {
    const actionCreator = actionCreators[key];
    if (typeof actionCreator === "function") {
      boundActionCreators[key] = bindActionCreator(actionCreator, dispatch);
    }
  }
  return boundActionCreators;
}
```

这个时候 index.js 这样使用

```javascript
import exceptiontimeMiddleware from "./middlewares/exceptiontimeMiddleware.js";
import loggerMiddleware from "./middlewares/loggerMiddleware.js";
import timeMiddleware from "./middlewares/timeMiddleware.js";
//如上是中间件
import {
  createStore,
  combineReducers,
  applyMiddleware,
  bindActionCreators,
} from "./redux/index.js";
import counterReducer from "./reducers/counter.js";
import infoReducer from "./reducers/info.js";
import { increment } from "./actions/counter.js";
import { setName } from "./actions/info.js";
const reducer = combineReducers({
  counter: counterReducer,
  info: infoReducer,
});
const rewriteCreateStoreFunc = applyMiddleware(
  exceptiontimeMiddleware,
  timeMiddleware,
  loggerMiddleware
);
const store = createStore(reducer, {}, rewriteCreateStoreFunc);

store.subscribe(() => {
  const state = store.getState();
  console.log(state.counter.count);
  console.log(state.info.name);
});
console.log("✨", store);

// store.dispatch();
const actions = bindActionCreators({ increment, setName }, store.dispatch);

actions.increment();
actions.setName();
```

### action

```javascript
function increment() {
  return {
    type: "INCREMENT",
  };
}
export { increment };
```
