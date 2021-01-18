# call & apply

`call()` 方法使用一个指定的 this 值和单独给出的一个或多个参数来调用一个函数。`apply` 和 `call`只有一个区别，就是 `call()`方法接受的是一个参数列表，而 `apply()` 方法接受的是一个包含多个参数的数组。

## 语法

- call

`javascript function.call(thisArg, arg1, arg2, ...)`

- apply

`javascript function.apply(thisArg, [argsArray])`

## 关于 this

`call`和`apply`的第一个参数是`thisArg`, 如果这个参数不为空，则执行函数的`this`会绑定到`thisArg`上。如果`thisArg`为空或者`null`，这个要看是否运行在严格模式，严格模式下执行函数的`this`指向`undefined`，非严格模式指`window`。

```javascript
function greet() {
  var reply = [this.animal, "typically sleep between", this.sleepDuration].join(
    " "
  );
  console.log(reply);
}

var obj = {
  animal: "cats",
  sleepDuration: "12 and 16 hours",
};

greet.call(obj); // cats typically sleep between 12 and 16 hours
```

```javascript
"use strict";

var sData = "Wisen";

function display() {
  console.log("sData value is %s ", this.sData);
}

display.call(); // Cannot read the property of 'sData' of undefined
```

## 应用场景

### 用 apply 将数组各项添加到另一个数组

```javascript
var array = ["a", "b"];
var elements = [0, 1, 2];
array.push.apply(array, elements);
console.info(array); // ["a", "b", 0, 1, 2]
```

### 使用 apply 和内置函数

```javascript
function minOfArray(arr) {
  var min = Infinity;
  var QUANTUM = 32768; //防止数组过大，导致参数个数溢出，JS Core中为65536

  for (var i = 0, len = arr.length; i < len; i += QUANTUM) {
    var submin = Math.min.apply(null, arr.slice(i, Math.min(i + QUANTUM, len)));
    min = Math.min(submin, min);
  }

  return min;
}

var min = minOfArray([5, 6, 2, 3, 7]);
```

### 使用 call 方法调用父构造函数

在一个子构造函数中，你可以通过调用父构造函数的 call 方法来实现继承

```javascript
function Product(name, price) {
  this.name = name;
  this.price = price;
}

function Food(name, price) {
  Product.call(this, name, price);
  this.category = "food";
}

function Toy(name, price) {
  Product.call(this, name, price);
  this.category = "toy";
}

var cheese = new Food("feta", 5);
var fun = new Toy("robot", 40);
```

###
