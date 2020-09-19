# 范畴 | 容器 | 函子

## 范畴
“范畴”是一数学里的一个概念，它包含两个东西，一个是值，一个是值的变形关系（函数）。范畴论就是使用函数，表达范畴之间的关系。

范畴论的发展衍生出了一整套函数的运算方法，这套方法起初只用于数学运算，有人将它在计算机上实现，就变成了今天的“函数式编程”。

为什么函数式编程要求函数必须是纯的？因为它是一种数学运算，原始的目的就是求值，不做其它事情。

## 容器与函子
容器就是一个Container,里面有value值。如果Container里如果有一个map方法，该方法将容器里面的每一个值，映射到另一个容器，那么这个Container就是一个函子。

函子是函数式编程中最重要的数据类型，也是基本的运算单位和功能单位。它是一种范畴，也是一个容器，包含了值和变形关系。特殊的是，它的变形关系可以依次作用于每一个值，将当前的容器变成另外一个容器。

```javascript
    var Container = function(x){
        this._value = x;
    }

    //一般约定，函子有一个of方法
    Container.of = x => new Container(x);

    Container.prototype.map = function(f) {
        return Container.of(f(this._value))
    }

    Container.of(3).map(x => x + 1)//Container(4)
        .map(x => "result is" + x);

```

函数式编程里的运算都是通过函子完成。函子本身具有对外接口（map方法），各种函数就是运算符，通过接口介入容器，引发容器里面值的变形。

因此学习函数式编程就是学习函子的各种运算，运用不同的函子解决实际问题。

## 常见的函子

### Pointed函子 
Pointed函子是实现了of静态方法的函子。of方法是为了避免使用new来创建对象。

```javascript
    Functor.of = function(val) {
        return new Functor(val);
    }
    //js中的Array.of
    Array.of("test");//["test"];
```

### Maybe函子
Maybe用于处理错误和异常。函子接受各种函数，处理容器内部的值。内部的值可能是一个空值,而函数外部未必有处理空值的机制。如果传入空值，很可能就会出错。

```javascript
    var Maybe = function(x) {
        this._value = x;
    }

    Maybe.of = function(x) {
        return new Maybe(x);
    }

    Maybe.prototype.map = function(f){
        return this.isNothing()? Maybe.of(null): Maybe.of(f(this._value));
    }

    Maybe.prototype.isNothing = function() {
        return this._value === null || this._value === undefined;
    }
    //新的容器称之为Maybe

```

ES6的写法
```javascript
    Functor.of(null).map(function(s) {
        return s.toUpperCase();
    })
    //TypeError
    class Maybe extends Functor {
        map(f) {
            return this._value? Maybe.of(f(this._value)): Maybe.of(null);
        }
    }

    Maybe.of(null).map(function(s) {
        return s.toUpperCase();
    });//Maybe(null)
```

Maybe函子只能在执行的那次判断是否为null，如果中间有多次map，某一次又出现了null,这个时候就处理不了了。这个时候就需要Either函子。

### Either函子
Either函子有两个作用用，一个是实现try/catch/throw， 主要用来做错误处理。try/catch/throw并不是纯的，因为它从外部接管了我们的函数，并在函数出错时抛弃了它的返回值。


Either函子还表示两者中的任意一个，类似if...else处理。

#### 错误处理

```javascript
    var Left = function(x) {
        this._value = x;
    }

    var Right = function(x){
        this._value = x;
    }

    Left.of = function(x) {
        return new Left(x);
    }

    Right.of = function(x) {
        return new Right(x);
    }

    //不同点

    Left.prototype.map = function(f) {
        return this;
    }

    Right.prototype.map = function(f) {
        return Right.of(f(this._value));
    }
 

```

Left和Right的唯一区别就在与map方法的实现。Left.map方法不会对容器做任何事情，只是简单的把容器拿进来又扔出去。这个特性使得Left可以用来传递一个错误消息。

例子：
```javascript


```




