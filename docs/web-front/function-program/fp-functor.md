# 范畴 | 容器 | 函子

## 范畴

“范畴”是一数学里的一个概念，它包含两个东西，一个是值，一个是值的变形关系（函数）。范畴论就是使用函数，表达范畴之间的关系。

范畴论的发展衍生出了一整套函数的运算方法，这套方法起初只用于数学运算，有人将它在计算机上实现，就变成了今天的“函数式编程”。

为什么函数式编程要求函数必须是纯的？因为它是一种数学运算，原始的目的就是求值，不做其它事情。

## 容器与函子

容器就是一个 Container,里面有 value 值。如果 Container 里如果有一个 map 方法，该方法将容器里面的每一个值，映射到另一个容器，那么这个 Container 就是一个函子。

函子是函数式编程中最重要的数据类型，也是基本的运算单位和功能单位。它是一种范畴，也是一个容器，包含了值和变形关系。特殊的是，它的变形关系可以依次作用于每一个值，将当前的容器变成另外一个容器。

```javascript
var Container = function(x) {
  this._value = x;
};

//一般约定，函子有一个of方法
Container.of = (x) => new Container(x);

Container.prototype.map = function(f) {
  return Container.of(f(this._value));
};

Container.of(3)
  .map((x) => x + 1) //Container(4)
  .map((x) => "result is" + x);
```

函数式编程里的运算都是通过函子完成。函子本身具有对外接口（map 方法），各种函数就是运算符，通过接口介入容器，引发容器里面值的变形。

因此学习函数式编程就是学习函子的各种运算，运用不同的函子解决实际问题。

```javascript
class Functor {
  constructor(val) {
    this.val = val;
  }

  static of(x) {
    return new Functor(x);
  }

  map(f) {
    return new Functor(f(this.val));
  }
}
```

## 常见的函子

### Pointed 函子

Pointed 函子是实现了 of 静态方法的函子。of 方法是为了避免使用 new 来创建对象。

```javascript
Functor.of = function(val) {
  return new Functor(val);
};
//js中的Array.of
Array.of("test"); //["test"];
```

### Maybe 函子

Maybe 用于处理错误和异常。函子接受各种函数，处理容器内部的值。内部的值可能是一个空值,而函数外部未必有处理空值的机制。如果传入空值，很可能就会出错。

```javascript
var Maybe = function(x) {
  this._value = x;
};

Maybe.of = function(x) {
  return new Maybe(x);
};

Maybe.prototype.map = function(f) {
  return this.isNothing() ? Maybe.of(null) : Maybe.of(f(this._value));
};

Maybe.prototype.isNothing = function() {
  return this._value === null || this._value === undefined;
};
//新的容器称之为Maybe
```

ES6 的写法

```javascript
Functor.of(null).map(function(s) {
  return s.toUpperCase();
});
//TypeError
class Maybe extends Functor {
  map(f) {
    return this._value ? Maybe.of(f(this._value)) : Maybe.of(null);
  }
}

Maybe.of(null).map(function(s) {
  return s.toUpperCase();
}); //Maybe(null)
```

Maybe 函子只能在执行的那次判断是否为 null，如果中间有多次 map，某一次又出现了 null,这个时候就处理不了了。这个时候就需要 Either 函子。

### Either 函子

Either 函子有两个作用，一个是实现 try/catch/throw， 主要用来做错误处理。try/catch/throw 并不是纯的，因为它从外部接管了我们的函数，并在函数出错时抛弃了它的返回值。

Either 函子还表示两者中的任意一个，类似 if...else 处理。

Either 函子内部有两个值：左值和右值。右值是正常情况下使用的值，

#### 错误处理

```javascript
var Left = function(x) {
  this._value = x;
};

var Right = function(x) {
  this._value = x;
};

Left.of = function(x) {
  return new Left(x);
};

Right.of = function(x) {
  return new Right(x);
};

//不同点

Left.prototype.map = function(f) {
  return this;
};

Right.prototype.map = function(f) {
  return Right.of(f(this._value));
};
```

ES6 写法：

```javascript
class Left {
  static of(x) {
    return new Left(x);
  }
  constructor(x) {
    this._value = x;
  }
  map(fn) {
    return this;
  }
}

class Right {
  static of(x) {
    return new Right(x);
  }
  constructor(x) {
    this._value = x;
  }
  map(fn) {
    return Right.of(fn(this._value));
  }
}
```

Left 和 Right 的唯一区别就在与 map 方法的实现。Left.map 方法不会对容器做任何事情，只是简单的把容器拿进来又扔出去。这个特性使得 Left 可以用来传递一个错误消息。

例子：

```javascript
var getAge = (user) => (user.age ? Right.of(user.age) : Left.of("error"));

getAge({ name: "xiaohong", age: "21" }).map((age) => "Age is " + age); //Right("Age is 21");
```

#### 条件运算

```javascript
class Either extends Functor {
  constructor(left, right) {
    this.left = left;
    this.right = right;
  }

  map(f) {
    return this.right ?
      Either.of(this.left, f(this.right)) :
      Either.of(f(this.left), this.right);
  }
}

Either.of = function (left, right) {
  return new Either(left, right);
};

var addOne = function (x) {
  return x + 1;
};

Either.of(5, 6).map(addOne);
// Either(5, 7);

Either.of(1, null).map(addOne);
// Either(2, null);

function parseJSON(json) {
  try {
    return Either.of(null, JSON.parse(json));
  } catch (e: Error) {
    return Either.of(e, null);
  }
}

```

### AP 函子

函子里面包含的值，可能是函数。AP 函子解决的就是函子里的 value 是函数的情况。
ap 是 applicative（应用）的缩写。凡是部署了 ap 方法的函子，就是 ap 函子

```javascript
class Ap extends Functor {
  //  static of(x) {//ES6可以继承
  //      return new Ap(x);
  //  }
  //  constructor(x) {
  //      this._value = x;
  //  }
  ap(F) {
    return Ap.of(this.val(F.val));
  }
}

function addTwo(x) {
  return x + 2;
}

const A = Functor.of(2);
const B = Functor.of(addTwo);

Ap.of(addTwo).ap(Functor.of(2));
```

ap 函子的意义在于，对于那些多参数的函数，就可以从多个容器之中取值，实现函子的链式操作

```javascript
function add(x) {
  return function(y) {
    return x + y;
  };
}
Ap.of(add)
  .ap(Maybe.of(2))
  .ap(Maybe.of(3));
// Ap(5)
```

### Monad 函子

函子是一个容器，可以包含任何值。函子之中再包含一个函子，也是合法的，但这样会出现多层嵌套的函子。

```javascript
Maybe.of(Maybe.of(Maybe.of({ name: "Mulburry", number: 8402 })));
```

上面这个函子，一共有三个 Maybe 嵌套。如果要取出内部的值，就要连续三次调用 this.val。这很不方便，于是出现了 Monad 函子。

Monad 函子的作用是，总是返回一个单层的函子。它有一个 flatMap 方法，与 map 方法的作用相同。唯一的区别就是如果生成了嵌套函子，它会取出后者内部的值，保证返回的永远是一个单层的容器，不会出现嵌套的情况。

```javascript
class Monad extends Functor {
  join() {
    return this.val;
  }
  flatMap(f) {
    return this.map(f).join();
  }
}
```

上面代码中，如果函数 f 返回的是一个函子，那么 this.map(f)就会生成一个嵌套的函子。所以，join 方法保证了 flatMap 方法总是返回一个单层的函子。这意味着嵌套的函子会被铺平（flatten）。

Monad 是一种设计模式，表示将一个运算过程，通过函数拆解成互相连接的多个步骤。只需要提供下一步运算所需的函数，整个运算就会自动执行下去。js 中的 Promise 就是一种 Monad。Monad 可以让我们避免了嵌套地狱，可以轻松处理深度嵌套的函数式编程，比如 IO 和其它异步任务。

Monad 函子的重要应用，就是实现 I/O 操作。

### IO

I/O 是不纯的操作，普通的函数式编程没法做。这时就需要把 IO 操作写成 Monad 函子，通过它来完成。

```javascript
import _ from "lodash";
var compose = _.flowRight;

var IO = function(f) {
  this._value = f;
};

IO.of = (x) => new IO((_) => x);

IO.prototype.map = function(f) {
  //把f组合之后，return 出去，让外部去执行，将不纯的函数变为纯的
  return new IO(compose(f, this._value));
};

//ES6 写法

class IO extends Monad {
  map(f) {
    return IO.of(compose(f, this._value));
  }
}
```

举个例子：

```javascript
var fs = require("fs");

var readFile = function(filename) {
  return new IO(function() {
    return fs.readFileSync(filename, "utf-8");
  });
};

var print = function(x) {
  return new IO(function() {
    console.log(x);
    return x;
  });
};

readFile("./user.txt")
  .flatMap(tail)
  .flatMap(print);

//最后在Monad函子中执行
```

完整代码：

```javascript
var fs = require("fs");
var _ = require("lodash");
//基础函子
class Functor {
  constructor(val) {
    this.val = val;
  }
  map(f) {
    return new Functor(f(this.val));
  }
}
//Monad 函子
class Monad extends Functor {
  join() {
    return this.val;
  }
  flatMap(f) {
    //1.f == 接受一个函数返回的是IO函子
    //2.this.val 等于上一步的脏操作
    //3.this.map(f) compose(f, this.val) 函数组合 需要手动执行
    //4.返回这个组合函数并执行 注意先后的顺序
    return this.map(f).join();
  }
}
var compose = _.flowRight;
//IO函子用来包裹📦脏操作
class IO extends Monad {
  //val是最初的脏操作
  static of(val) {
    return new IO(val);
  }
  map(f) {
    return IO.of(compose(f, this.val));
  }
}
var readFile = function(filename) {
  return IO.of(function() {
    return fs.readFileSync(filename, "utf-8");
  });
};
var print = function(x) {
  console.log("🍊");
  return IO.of(function() {
    console.log("🍎");
    return x + "函数式";
  });
};
var tail = function(x) {
  console.log(x);
  return IO.of(function() {
    return x + "【京程一灯】";
  });
};
const result = readFile("./user.txt")
  //flatMap 继续脏操作的链式调用
  // .flatMap(print);
  .flatMap(print)()
  .flatMap(tail)();
console.log(result.val());
// console.log(result().val());
```

## 当下流行的函数式编程库

- Rxjs 原理必会

- lodash 原理必会

- Underscore

- Ramdajs

## 总结

- 并发编程。函数式编程不用考虑死锁，因为它不修改变量。可以将工作分摊到多个线程，部署并发编程。

- 单元测试。函数式编程可以方便单元测试。因为我们只需考虑参数，不用考虑函数的调用顺序。

函数式编程带来了更高的可组合型，灵活性以及容错性。现代 JS 库入 redux，都已经开始使用函数式编程。redux 的核心理念就是状态机和函数式编程。
