# 原型（prototype）
js语言中为什么会出现`prototype`？这是因为最开始的js用构造函数创建实例对象时无法共享公共的属性和方法，会造成极大的资源浪费，考虑到这点，js的设计者决定为构造函数设置一个`prototype`属性。实例一旦创建，将自动引用`prototype`对象的属性和方法。所有实例对象共享同一个`prototype`对象，这也是js中的继承机制。
只有函数式的`Object`才有protyotype属性
`Object.prototype` 属性存储了 `Object `的原型对象。JS中的对象继承了`Object.prototype`的属性和方法。并不是所有的对象都有原型，比如通过`Object.create(null)`创建的对象就没有原型对象，也可以通过`Object.setPrototypeOf`方法改变原型链（慎用）。

`Function.prototype`属性存储了 `Function` 的原型对象

## 属性

- `Object.prototype.constructor`
原型上的构造函数，返回创建实例对象的构造函数的引用。注意，这个引用其实就是函数本身。对基本数据类型来说，如1，true和"test"，该值只可读。

所有对象都会从它的原型上继承一个 constructor 属性：


```javascript
var o = {};
o.constructor === Object; // true

var o = new Object;
o.constructor === Object; // true

var a = [];
a.constructor === Array; // true

var a = new Array;
a.constructor === Array // true

var n = new Number(3);
n.constructor === Number; // true

```

我们可以打印出一个函数的constructor属性。
```javascript
function Tree(name) {
   this.name = name;

    function test() {
        console.log("test")
    }
}

var theTree = new Tree("Redwood");
console.log( "theTree.constructor is " + theTree.constructor );

//theTree.constructor is function Tree(name) {
//    this.name = name;
//     function test() {
//         console.log("test")
//     }
// }

```

- `Object.prototype.__proto__`
当对象实例化后，指向原型的对象

```javascript
    var arr = new Array();
    console.log(arr.__proto__);//输出arr的原型对象，即Array的原型对象
```

:::warning
    同一种类型的对象实例的原型对象是相等的，即所有的实例对象共享同一个prototype对象

    ``` javascript
        var a = new Array();
        var b = new Array();
        console.log(a.__proto__ === b.__proto__);//true
    
    ```

:::


## `prototype`和 `__proto__`
这两个属性很容易混淆，他们本身也有着千丝万缕的联系。

我们之前说过，`prototype`是函数才有的属性，而`__proto__`是每个对象都有属性。

在大部分情况下，`__proto__`可以理解为"构造器的原型",即 `__proto__ === constructor.prototype`。但是通过 `Object.create()`创建的对象有可能不是，这是因为它使用传入参数的对象来提供新创建的对象的`__proto__`。

## 使用`prototype`实现ES6中的继承

首先来看下ES6的继承

```javascript
    class Car {
        static color = "red";//静态属性可以继承
        constructor(price) {
            this.price = price;
        }
        test() {
            console.log("价格是:",this.price);
        }
    }

    class BWM extends Car {
        constructor(price) {
            super(price);
        }
    }
    console.log(BWM.color);//red
    const bmw = new BMW("30万");
    bmw.test();

```

使用ES5语法时，应解决的问题：
1. 静态属性不能继承
2. 复制父类的原型给子类
3. 子类的constructor指向不对，手动修正

```javascript
'use strict'
function Car(brand, color, price) {
    this.brand = brand;
    this.color = color;
    this.price = price
}
Car.type = "车"

Car.prototype.sell = function() {
    console.log("我是"+ this.color + "色的" + this.brand + ", 我的售价是" + this.price);
}

function BMW(brand, color, price) {
    Car.call(this, brand, color, price);
}

//子类继承父类静态属性
var staticKeys = Object.entries(Car);
for(var i = 0; i < staticKeys.length; i++) {
    var key = staticKeys[i][0];
    var value = staticKeys[i][1];
    BMW[key] = value;
}
console.log(BMW.type);//车

// var __proto = Object.create(Car.prototype);
// __proto.constructor = BMW;
// BMW.prototype = __proto;
BMW.prototype = Object.create(Car.prototype, {
    constructor:{
        value: BMW,
        writable:false
    }
});
// BMW.prototype = 123
var bmw = new BMW("宝马", "红", "30万");
bmw.sell();

```

## 关于 __proto__ & constructor & prototype

prototype是函数才具有的属性，__proto__和constructor是每个对象都具有的属性。他们之间的关系可以参考下面这张图。

![](./proto.jpeg)

来梳理一下。

通过 var f1 = new Foo()之后， f1其实是一个函数对象。它的__proto__是Foo的prototype。Foo.prototype的constructor是function Foo()，而function Foo()的prototype就是Foo.prototype。

那Foo.prototype是哪里来的？ 他继承自Object.prototype。所以Foo.prototype的原型对象__proto__就是Object.prototype。 Object.prototype的constructor就是函数function Object()。

那Object.prototype的原型是啥？已经到顶了，所以是null。Object.prototype的constructor呢？就是function Object()。

那function Object()的__proto__呢？它是大Function.prototype。所以大Function是所有对象的根。

Function.prototype.constructor等于自身 function Function(){}。Function的__proto__等于Function.prototype。












