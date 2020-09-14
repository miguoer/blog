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
传递给函数一部分参数来调用它，让它返回一个函数去处理剩下的参数。偏应用函数之所以“偏”，在于其只能处理那些能与至少一个case语句匹配的输入，而不能处理所有可能的输入。

`Function.prototype.bind()`就是一个典型的偏应用函数

```javascript
    const add3 = (a, b, c) => a + b + c;
    const addMore = add3.bind(null, 2, 3);
    console.log(addMore(1));//输出6

```

### 柯里化
柯里化通过偏应用函数实现，它是把一个多参函数转换成一个嵌套一元函数的过程。

例：
```javascript
    var checkAge = min => (age => age > min);
    var check18 = checkAge(18);
    check18(20);
```

函数的柯里化
```javascript
const curry = (fn, arr = []) => (...args) =>
(arg => (args.length === fn.length ? fn(...arg) :
curry(fn, arg)))([ ...arr,
...args ]);
let curryTest = curry((a, b, c, d) => a + b + c + d);
curryTest(1, 2, 3)(4); //10
curryTest(1, 2)(4)(3); //10
 
```

#### 柯里化优点
柯里化的目的是减少纯函数里参数的硬编码，好处是可以对函数进行预加载，是一种非常高效的吧编写函数的方法。

#### 柯里化缺点
- 内存泄露

### 反柯里化
函数柯里化是固定部分参数，返回一个接受剩余参数的函数，目的是为了缩小试用返回，创建一个针对性更强的函数。

反柯里化的意义和用法和柯里化正好相反，是为了扩大适用范围，创建一个应用范围更广的函数。使本来只有特定对象才适用的方法，扩展到更多的对象。
```javascript
Function.prototype.unCurring = function() { var self = this;
return function() {
var obj = Array.prototype.shift.call(arguments);
return self.apply(obj, arguments); };
};
var push = Array.prototype.push.unCurrying(),
obj = {};
push(obj, "first", "two"); console.log(obj);
```


### 函数组合

### 声明式与命令式

### 惰性求值


