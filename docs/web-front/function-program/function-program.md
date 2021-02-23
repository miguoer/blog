# 函数式编程介绍

## 函数式编程定义

简单来说，函数式编程是一种编程范式，一种如何编写程序的方法论。

函数式编程不是用函数来编程，它的目的是将复杂的函数合成简单的函数，运算过程尽量写成一系列嵌套的函数调用。

## 函数式编程特点

1. 函数是一等公民。所谓“一等公民”，指的是函数与其它数据类型一样，处于平等地位，可以赋值给其它变量、可以作为参数，也可以作为返回值。

2. 变量不可变。在函数式编程中，变量仅代表某个表达式，所有的变量只能被赋一次初始值。

3. 只用表达式，不用语句

4. 纯函数，没有副作用，相同的输入总是获得相同的输出。

5. 不修改状态

6. 引用透明，函数运行只靠参数

## 函数式编程核心概念

### 纯函数

纯函数：对于相同的输入，会得到相同的输出，没有任何可观察的副作用，也不依赖外部环境的状态。

例如 `Array.slice()`

纯函数可以有效降低系统复杂度，具有可缓存性。不纯的函数，依赖外部变量，扩展性较差，可以通过柯里化解决。

纯函数具有幂等性，即执行无数次后还具有相同的效果。

### 偏应用函数（partial application function）

传递给函数一部分参数来调用它，让它返回一个函数去处理剩下的参数。偏应用函数之所以“偏”，在于其只能处理那些能与至少一个 case 语句匹配的输入，而不能处理所有可能的输入。

`Function.prototype.bind()`就是一个典型的偏应用函数

```javascript
const add3 = (a, b, c) => a + b + c;
const addMore = add3.bind(null, 2, 3);
console.log(addMore(1)); //输出6
```

### 柯里化

柯里化通过偏应用函数实现，它是把一个多参函数转换成一个嵌套一元函数的过程。

例：

```javascript
var checkAge = (min) => (age) => age > min;
var check18 = checkAge(18);
check18(20);
```

函数的柯里化

```javascript
const curry = (fn, arr = []) => (...args) =>
  ((arg) => (args.length === fn.length ? fn(...arg) : curry(fn, arg)))([
    ...arr,
    ...args,
  ]);
let curryTest = curry((a, b, c, d) => a + b + c + d);
curryTest(1, 2, 3)(4); //10
curryTest(1, 2)(4)(3); //10
```

#### 柯里化优点

柯里化的目的是减少纯函数里参数的硬编码，好处是可以对函数进行预加载，是一种非常高效的编写函数的方法。

#### 柯里化缺点

- 内存泄露

#### 柯里化和偏应用函数

### 反柯里化

函数柯里化是固定部分参数，返回一个接受剩余参数的函数，目的是为了缩小使用范围，创建一个针对性更强的函数。

反柯里化的意义和用法和柯里化正好相反，是为了扩大适用范围，创建一个应用范围更广的函数。使本来只有特定对象才适用的方法，扩展到更多的对象。

```javascript
Function.prototype.unCurring = function() {
  var self = this;
  return function() {
    var obj = Array.prototype.shift.call(arguments);
    return self.apply(obj, arguments);
  };
};
var push = Array.prototype.push.unCurrying(),
  obj = {};
push(obj, "first", "two");
console.log(obj);
```

### 函数组合

函数柯里化之后很容易写出洋葱代码 h(f(g(x))),为了解决函数嵌套问题，需要用到函数组合。

```javascript
const compose = (f, g) => (x) => f(g(x));
```

函数组合使得函数与函数之间的调用变得更加灵活。

compose 函数只能组合接受一个参数的函数。但是类似 filter,map 函数接收两个参数，不能被直接组合，但是可以借助偏应用函数组合。

函数组合的数据流是从右至左，因为最右边的函数首先执行，将数据传递给下一个函数，以此类推。如果想从最左侧执行，可以用 pipe 实现，它和 compose 做的事情一样，只不过交换了数据方向。

### 函数组合子

命令式代码使用 if-else 和 for 这样的过程控制，函数式编程的时候不能，我们需要借助函数组合子来实现。组合子可以组合其它函数，并作为控制逻辑单元的高阶函数。组合子通常不声明任何变量，也不包含任何业务逻辑，他们旨在管理函数的执行流程，并在链式调用中对中间结果进行操作。

#### 常用组合子

可在 lodash 里查看这些组合子的源码。

- 辅助组合子
  nothing, identity, defaultTo, always

- 函数组合子
  gather, spread, reverse, partial, curry,map, reduce,compose,tap, useWith,tryCatch,converse

- 谓语组合子
  filter, group, sort

- 其它
  just

### point free

point free 讲究的是函数式编程过程中不要有太多的中间变量

例如：

```javascript
const f = (str) => str.toUpperCase().split(" ");
```

可以改成

```javascript
var toUpperCase = (word) => word.toUpperCase();
var split = (x) => (str) => str.split(x);
var f = compose(split(" "), toUpperCase);
f("abc efg");
```

### 声明式与命令式

- 命令式
  类似面向过程，让计算机一条一条指令执行

- 声明式
  通过写表达式的方式来声明要干什么，而不是一步一步的指示。
  函数式编程的一个明显的好处就是这种声明式的代码。对于无副作用的纯函数，完全无需考虑其内部实现。

不纯的函数会产生副作用或者依赖外部系统环境。

### 惰性求值

.chain(数据).map().reverse().value()就是一种惰性链。惰性链可以添加一个输入对象的状态，从而能够将这些输入转换为所需的输出操作链接在一起。

前端做性能监控时经常用到惰性链。

当输入很大但只有一个小的子集有效时，避免不必要的函数调用就是惰性求值。

如果同一个函数被大量使用，函数内部又有许多判断来检测函数，这样对于一个调用会浪费时间和浏览器资源，所以当第一次判断完后，直接把这个函数改写，不再需要判断。

### 高阶函数

高阶函数就是把函数当参数，把传入的函数做一个封装，返回这个封装的函数，达到更高程度的抽象。（传入一个函数，返回一个函数，里面执行这个函数）

```javascript
var add = function(a, b) {
  return a + b;
};
function math(func, array) {
  return func(array[0], array[1]);
}

math(add, [1, 2]); //3
```

react 中的高阶组件就是一种高阶函数。

### 尾递归优化

尾递归的判断标准是函数运行的最后一步是否调用自身，而不是函数的最后一行调用自身(递归)。最后一行调用其它函数叫尾调用。

```javascript
//递归
function factorial(n) {
  if (n === 1) return 1;
  return n * factorial(n - 1);
}

//尾递归

function factorial(n, total) {
  if (n === 1) return 1;
  return factorial(n - 1, n * total);
} //ES6中强制使用尾递归
```

:::warning 注意
尾递归是我们自己实现的，并不是浏览器所做的优化。尾递归不容易爆栈，但不一定不会爆栈。如果浏览器做了优化，即 factorial 函数只创建一次，就不会爆栈。
:::

#### 尾递归存在的问题

理论上尾递归调用栈永远都是更新当前的栈帧，这样就完全避免了爆栈的危险。但是当前浏览器并未完全支持，原因是：

1. 在引擎层面消除递归是一个隐式的行为，程序员意识不到。
2. 堆栈信息丢失了，开发者难调试。浏览器只会留最后一个调用帧。

#### 如何解决尾递归问题

- 如果浏览器不支持，把递归改成 while 就行

- 蹦床函数
  蹦床函数+偏应用函数，将递归执行的过程暴露出来。手动让用户循环执行。

```javascript
  //1. 转成偏函数
  function runStack(n) {
    if(n === 0) {
      return 100;
    }
    reutrn runStack.bind(null, n - 2);
  }
  //2. 蹦床函数，避免递归

  function trampoline(f) {
    var result = f.apply(fun, _.rest(arguments));
    while(_.isFunction(result)) {
      result = result();
    }
    return result;
  }

  //3. 蹦床函数包裹偏函数
  trampoline(runStack(100000000));

```
