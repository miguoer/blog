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


