# 闭包
## 定义
函数和对其周围状态（lexical environment，词法环境）的引用捆绑在一起构成闭包（closure）。也就是说，闭包可以让你从内部函数访问外部函数作用域。在 JavaScript 中，每当函数被创建，就会在函数生成时生成闭包。

闭包抽象难懂，可以简单理解为闭包就是能够读取其他函数内部变量的函数，或者定义在一个函数内部的函数。

一个常见的例子：
```javascript
function init() {
    var name = "Mozilla"; // name 是一个被 init 创建的局部变量
    function displayName() { // displayName() 是内部函数，一个闭包
        alert(name); // 使用了父函数中声明的变量
    }
    displayName();
}
init();

```
`displayName`沒有自己的局部变量，但是由于闭包的存在，它可以访问到外部函数的`name`变量，因此可以输出"Mozilla"。

## 闭包的作用
闭包最大用处有两个，一个是可以读取函数内部的变量，另一个就是让这些变量的值始终保持在内存中。

再看一个例子：

```javascript
    function makeFunc() {
        var name = "Mozilla";
        function displayName() {
            alert(name);
        }
        return displayName;
    }

    var myFunc = makeFunc();
    myFunc();
    //输出Mozilla
```

这里执行了`makeFunc()`函数之后，还能访问到`name`，是因为JavaScript中的函数形成了闭包。闭包是由函数以及声明该函数的词法环境组合而成的。该环境包含了这个闭包创建时作用域内的任何局部变量。`displayName `的实例维持了一个对`myFunc`的词法环境（变量 name 存在于其中）的引用。当` myFunc`被调用时，变量 `name` 仍然可以访问到。

函数的柯里化利用了闭包可以保存局部变量的特性

```javascript
function makeAdder(x) {
  return function(y) {
    return x + y;
  };
}

console.log(makeAdder(5)(2));  // 7
console.log(makeAdder(10)(2)); // 12

```

`makeAdder`在执行时，其闭包中保存了x这个变量，使得其可以继续向下传递。

## 优缺点

### 闭包的优点
- 可以重复使用变量，且不会造成变量污染
- 可以用来定义私有属性和方法

### 闭包的缺点
- 包会使得函数中的变量都被保存在内存中，内存消耗很大，所以不能滥用闭包，否则会造成网页的性能问题，可能导致内存泄漏问题。解决方法是，在退出函数之前，将不使用的局部变量全部删除，可以使变量赋值为null。
- 闭包会在父函数外部，改变父函数内部变量的值。应把父函数当作对象（object）使用，把闭包当作它的公用方法（Public Method），把内部变量当作它的私有属性（private value），不要随便改变父函数内部变量的值。

## 常见的错误
循环创建闭包时很容易出现的一个错误
```javascript
<p id="help">Helpful notes will appear here</p>
<p>E-mail: <input type="text" id="email" name="email"></p>
<p>Name: <input type="text" id="name" name="name"></p>
<p>Age: <input type="text" id="age" name="age"></p>


```

```javascript
function showHelp(help) {
  document.getElementById('help').innerHTML = help;
}

function setupHelp() {
  var helpText = [
      {'id': 'email', 'help': 'Your e-mail address'},
      {'id': 'name', 'help': 'Your full name'},
      {'id': 'age', 'help': 'Your age (you must be over 16)'}
    ];

  for (var i = 0; i < helpText.length; i++) {
    var item = helpText[i];
    document.getElementById(item.id).onfocus = function() {
      showHelp(item.help);
    }
  }
}

setupHelp(); 


```

这个例子中，始终输出的是"Your age (you must be over 16)"。原因是赋值给 onfocus 的是闭包，这三个闭包在循环中被创建，但他们共享了同一个词法作用域，在这个作用域中存在一个变量item。这是因为变量item使用var进行声明，由于变量提升，所以具有函数作用域。由于循环在事件触发之前早已执行完毕，变量对象item（被三个闭包所共享）已经指向了helpText的最后一项。

两种解决办法
- 使用let声明item

- 使用闭包包裹

``` javascript
function setupHelp() {
  var helpText = [
      {'id': 'email', 'help': 'Your e-mail address'},
      {'id': 'name', 'help': 'Your full name'},
      {'id': 'age', 'help': 'Your age (you must be over 16)'}
    ];

  for (var i = 0; i < helpText.length; i++) {
    var item = helpText[i];
   （function(){

        document.getElementById(item.id).onfocus = function() {
            showHelp(item.help);
        }
   })(item)

  }
}


```
