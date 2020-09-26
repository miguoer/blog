# 手写 new
new操作符做了这些事：

1. 它创建了一个全新的对象。
2. 它会被执行[[Prototype]]（也就是__proto__）链接。
3. 它使this指向新创建的对象。。
4. 通过new创建的每个对象将最终被[[Prototype]]链接到这个函数的prototype对象上。
如果函数没有返回对象类型Object(包含Functoin, Array, Date, RegExg, Error)，那么new表达式中的函数调用将返回该对象引用。

## 版本一
```javascript
    function myNew(fun) {
        return function(){
            // 创建一个新对象且将其隐式原型指向构造函数原型
            let obj ={
                __proto__: fun.prototype
            }
            //执行构造函数
            fun.call(obj, ...arguments);
            //返回该对象
            return obj;
        }
    }

    function Person(name, age) {
        this.name = name;
        this.age = age;
    }
    let obj = myNew(Person)("xiaohong", 18);

```
## 版本二

```javascript
    function myNew(fun) {
        var res = {};
        if(fun.prototype !== null) {
            res.__proto__ = fun.prototype;
        }
        var ret = fun.apply(res, Array.prototype.slice.call(arguments, 1));
        if((typeof ret === 'object' || typeof ret === "function") && ret !== null){
            //函数和object执行完直接返回
            return ret;
        }
        return res;
    }

    function A(){}
    var obj = myNew(A, 1, 2);
    //equals to 
    var obj = new A(1, 2);

```


# 手写async

# 手写Promise