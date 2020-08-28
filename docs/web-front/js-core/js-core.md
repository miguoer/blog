# 变量提升&函数提升

JavaScript在预编译js文件时，会将函数声明和变量声明提升到当前函数的顶端，这就是函数提升和变量提升。在js里，都是函数级作用域，ES之后有了块级作用域，但是必须要和`const`或`let`一起使用才会生效。包裹在<script></script>标签下的代码，将会统一放到一个立即执行函数中。


```
    //例子1：变量提升&函数提升，此时输出undefinedt
    <script>
        test();//函数提升
        function test() {
            console.log(a);
            var a = 20; 
        }
        
    </script>
```

```
    //例子2：变量提升只会提升到其所在函数作用域的顶端，此时输出 a is not defined
    function test() {
        var a = 20; 
    }
    console.log(a);

```
## 暂时性死区(TDZ)

块级作用域中使用let或const声明变量之前使用了该变量，就会报错，这在语法上叫暂时性死区。

```
{
    temp = 124;//TDZ
    let temp
}
//报错
 VM166:2 Uncaught ReferenceError: Cannot access 'temp' before initialization
    at <anonymous>:2:9 
```

使用块级作用域的变量时还应注意一点，块级作用域的声明对函数名无效
```
{
    function test() {
        console.log("aaa")
    }
}
test()
//输出 aaa

```

## 函数名和变量名同名情况处理
当函数名和变量名同名时，要看是否给变量赋值了。如果赋值了（不管是赋值undefined还是啥），就会重写，否则该变量是函数的引用

```
    function test() {

    }
    var test = undefined;
    console.log(test);//输出undefined， test被重写

```
```
    function test() {

    }
    var test;
    console.log(test);//输出 test(){} 函数

```

## 函数提升

函数提升需要特别注意的是，它提升的是函数名，并不是函数体。最新的浏览器是这样实现的，老版本的IE和firefox的实现可能会有不一样

```
  //例:
  function test() {
      console.log("1")
  }
   function init() {
       //函数提升到这里 var test;
        if(false) {
            function test() {
                console.log("2")
            }
        }

        console.log(test);//输出 undefined
   }
  

```

函数提升如果同名覆盖的情况，以最后一个声明为准。
```
    var x = 1, y = 0, z = 0;
    function add(x) {
        return x + 1;
    }
    y = add(x);
    console.log(y)

    function add(x){
        return x + 2;
    }

    z = add(x);
    console.log(z);
    //结果是 3, 3

```