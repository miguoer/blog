# Redux 源码（二）- React Redux

## React Redux

Provider 其实就只是⼀个外层容器，它的作⽤就是通过配合 connect 来达到跨层级传递数据。使⽤时
只需将 Provider 定义为整个项⽬最外层的组件，并设置好 store。那么整个项⽬都可以直接获取这个
store。它的原理其实是通过 React 中的 Context 来实现的。它⼤致的核⼼代码如下：

```javascript
import React, { Component } from "react";
import { PropTypes } from "prop-types";
export default class Provider extends Component {
  getChildContext() {
    return { store: this.props.store };
  }
  constructor() {
    super();
    this.state = {};
  }
  render() {
    return this.props.children;
  }
}
Provider.childContextTypes = {
  store: PropTypes.object,
};
```

connect 的作⽤是连接 React 组件与 Redux store，它包在我们的容器组件的外⼀层，它接收上⾯
Provider 提供的 store ⾥⾯的 state 和 dispatch，传给⼀个构造函数，返回⼀个对象，以属性形式传给
我们的容器组件。

它共有四个参数 mapStateToProps, mapDispatchToProps, mergeProps 以及 options。

mapStateToProps 的作⽤是将 store ⾥的 state（数据源）绑定到指定组件的 props 中
mapDispatchToProps 的作⽤是将 store ⾥的 action（操作数据的⽅法）绑定到指定组件的 props 中

那么 connect 是怎么将 React 组件与 Redux store 连接起来的呢？其主要逻辑可以总结成以下代码：

```javascript
import { Component } from "react";
import React from "react";
import { PropTypes } from "prop-types";
const connect = (mapStateToProps, mapDispatchToProps) => (WrappedComponent) => {
  class Connect extends Component {
    constructor() {
      super();
      this.state = {};
    }
    componentWillMount() {
      this.unSubscribe = this.context.store.subscribe(() => {
        this.setState(mapStateToProps(this.context.store.getState()));
      });
    }
    componentWillUnmount() {
      this.unSubscribe();
    }
    render() {
      return (
        <WrappedComponent
          {...this.state}
          {...mapDispatchToProps(this.context.store.dispatch)}
        />
      );
    }
  }
  Connect.contextTypes = {
    store: PropTypes.object,
  };
  return Connect;
};
export default connect;
```
