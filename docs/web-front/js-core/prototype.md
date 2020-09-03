# 原型

`Object.prototype` 属性表示 `Object `的原型对象。JS中的对象继承了`Object.prototype`的属性和方法。并不是所有的对象都有原型，比如通过`Object.create(null)`创建的对象就没有原型对象，也可以通过`Object.setPrototypeOf`方法改变原型链（慎用）。

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


## 用原型链实现ES5的面向对象


