# this
this是谁调用指谁，没人调用要看代码是否运行在严格模式，如果不是严格模式指window，如果是严格模式this是`undefined`，使用时会报错。

``` javascript
//例1
this.a = 10;
function test =  {
    a: 20,
    init: function() {
        console.log(this.a);
    }
}
test.init();//输出20

//例2
this.a = 10;
function test =  {
    a: 20,
    init: function() {
        function go() {
            console.log(this.a);
        }
        go();

    }
}
test.init();//go没有人调用，go函数里的this指向window，输出10

```
::: warning
注意，例2中，如果代码前面加了 `use strict`，代码运行在严格模式下，会报错：`can not read property 'a' of undefined`，也就是说此时`this`是`undefined`。
:::

严格模式只对声明所在的函数内生效，
``` javascript
 var num = 1;
 function test() {
     console.log(this.num++);
 }

 (function(){
     "use strict"
     test();
 })()
 //这时不会报错，输出1

```

```
//例3
this.a = 10;
function test =  {
    a: 20,
    init: function() {
        function go() {
            console.log(this.a);
        }
        return go;

    }
}
var go = test.init();
go();//输出10，此时go中的this指window
```
当`new`一个函数或者对象时，此时应注意this指向的问题。构造函数的this优先级会大于原型链。


``` javascript
//例4
this.a = 30;
function go() {
    console.log(this.a)
    this.a = 10;
}
go.prototype.a = 20;

console.log((new go()).a);
//输出20, 10
```

如果是箭头函数包裹里的this，this指向其父级作用域。

```
this.a = 10;
function test =  {
    a: 20,
    init: () => {
        console.log(this.a)
    }
}
test.init();
//输出10 this指向test所在的作用域
```