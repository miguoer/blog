# 易错点

## 按值传递和按引用传递
js中基本数据类型为number, string, boolean， null， undefined,symbol，
object, array和function为引用数据类型。

``` javascript
 var s = "123";

 function append(s){
     s = s + "abc";
 }
append(s);
 console.log(s)
 //输出“123”
```
需要注意的是，形参传递参数的时候，都是按值传递的，只是如果数据类型是引用数据类型时，形参传递的引用的地址。如果在函数内部改变了引用地址，函数外部的数据和内部的数据将会指向不同的地址。

``` javascript 
    function test(m) {
        m = {v: 5};
    }
    var m = {k: 1};
    test(m);
    alert(m.v);
    //输出undefined

```

## 连续正则匹配

- 语法 `regexObj.test(str)`


如果正则表达式设置了全局标志，test() 的执行会改变正则表达式   lastIndex属性。连续的执行test()方法，后续的执行将会从 lastIndex 处开始匹配字符串，(exec() 同样改变正则本身的 lastIndex属性值).

```javascript
var regex = /foo/g;

// regex.lastIndex is at 0
regex.test('foo'); // true

// regex.lastIndex is now at 3
regex.test('foo'); // false

```

## 函数定义内不能改变函数

```javascript
// 'use strict' 加严格模式会报错， sell是常量，不能被修改
var test = function sell() {
    sell = 124;
    console.log(typeof sell);//function
}

test();
```
```javascript
{
    test = 1;
    function test(){

    }
    test = 2;
    console.log("inner", test); 2
}

console.log(test);//1， 如果test = 1没有声明，则输出function

```

## window.length属性
window的length取决于当前页面iframe的个数。

```javascript
function test() {
    console.log(this.length);
}
test();
//输出0
```

```javascript
//body
<iframe ></iframe>

//script
function test() {
    console.log(this.length);
}
test();
//输出1
```

## arguments

```javascript
var test = {
    name:"11",
    method: function(fn) {
        fn();//0, window.length, iframe个数为0
        arguments[0]();
    }
}

function fn() {
    console.log(this)//this指向arguments，this.length为实参的数量
    console.log(this.length)//2
}
test.method(fn, 1);

```

## 对象相加

js中在执行对象相加操作时，是对原始值的相加。通过object.valueOf()可以取到对象的原始值。Date对象相加时是先走toString()，再走valueOf()。
```javascript
console.log({} + []);//[object Object]
//object表示的是对象类型 ，如果放在()里的，相加会取原始值，把原始值相加。
console.log({} + "");//[object Object]

console.log({} + {});//[object Object][object Object] 

console.log([] + {});//[object Object]
//[]不是代码块，因此转换为原始值，[]的原始值是[]，toString就是空[].valueOf().toString() == ""


{} + [];
//0，{}被当做代码块先执行，+[]会将[]转Number，为0 ,所以值为0


```

## 隐式转换比较 (==比较)
==比较时，如果两边类型不一致(toPrimitive),会先取valueOf，再toString。

1. 简单值  直接拿值比
2. 对象和对象， 拿地址比
3. 对象和简单值，只有[]有意义。
```javascript
    [] == 0;//true
    [] == false;//true
    [] == ![]//!的优先级更高，先转换类型为false
    NaN == 0 //typeof NaN 是number

    null == 0//false
    null <= 0//true小于等于会转Number，==不转
    null == null/undefined//其它都不等
```

## 作用域
作用域链在定义的时候确定的，而不是执行的时候。JS是词法作用域，不是动态作用域。

```javascript
    function bar() {
        console.log(myName);
    }

    function foo() {
        var myName = "foo"
        bar();
    }

    var myName = "out";
    foo();//out


```

## eval
eval会把当前的环境，全部塞到全局词法作用域中。

```javascript
    function test(){
        var apple = "apple111";
        return function() {
            eval("");//产生了闭包

            //解决办法: window.eval("");
        }
    }

    test()();//apple会被塞到全局作用域

```

webpack中生成的代码，全部都包裹在eval里。

js中with和trycatch都可以延长作用域链。

```javascript
    var obj = {a:30};
    with(obj) {
        b = 30;
    }
    console.log(b);//30
    //b会挂载到全局

```

vue中使用了with，为了省事。

try/catch会延长词法 作用域链

```javascript
    try {

    } catch(e) {
        //catch(e){}中的对象组成了一个新的变量，添加到了作用域的顶端。e这个对象会被推入一个可变对象并置于作用域的顶端。
    }
```

## ..
```javascript
    console.log(1..a)//undefined, js中会把1..处理成(1.).a。
    console.log(1.a)//报错

```

## 函数的name不能修改

```javascript
    Object.prototype.name = "ddd";
    function test() {};
    test.name;//test
    1..a//ddd

```

## 死循环和爆栈
主线程死循环会让主线程的其它任务得不到执行，导致卡死，可以把循环放到WebWorker中。爆栈是程序执行堆栈超过了JS所能承受的最大的栈，导致报错。


```javascript
//html
<body>
    <input type="text" value="" />
    <script src="./demo8.js"></script>//demo里有死循环
    <script>
        const worker = new Worker("demo8.js");
        worker.onmessage = function (event) {
            console.log(event.data);
        }
    </script>
    <!-- concurrent.thread.js -->
    <!-- <script type="text/x-script.multithreaded-js"></script>
    <script>
        Concurrent.Thread.create(function () {
            $('#test').click(function () {
                alert(1);

            });
            /*下面有一段特别复杂的函数*/
            for (var i = 0; i < 10000; i++) {
                console.log(i);

            }
        });
    </script> -->
</body>

```












