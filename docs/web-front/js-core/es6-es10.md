# ES6-ES10新语法

## promise

## async和await

来看一道题：
```javascript

let a = 0;
let test = async () => {
  console.log('init');
  a = a + (await 10);//await之后才异步。
//   a = (await 10) + a;//输出11
  console.log(a);
};
test();
console.log(++a);
//1, 10
```

await之前的变量会被锁定，await之后的代码是异步。所以输出 "1, 10"。为什么async await可以实现异步，变量又是如何保存锁定的？

下面是一个generator例子：

```javascript
function* genDemo() {
  console.log('第一段执行逻辑');
  yield 'Generator2 ';
  console.log('第二段执行逻辑');
  yield 'Generator2 ';
  console.log('第三段执行逻辑');
  yield 'Generator2 ';
  console.log('执行完毕');
  return 'Generator2';
}
console.log('main 0');
let gen = genDemo();
console.log(gen.next().value);
console.log('main 1');

console.log('--------------');

console.log(gen.next().value);
console.log('main 2');
console.log(gen.next().value);
console.log('main 3');
console.log(gen.next().value);
console.log('main 4');

```

async和await的底层是generator实现。
generator函数是由协程实现。
1.不是一次性执行完的 全局代码交替执行。可以暂停 恢复
2.协程 比线程更轻量。跑在线程上而且一个线程可以存在多个协程
3.线程上同时只执行一个协程。A -> B 控制权 A暂停了⏸ A打开了B协程。 A就是B的父协程
4.协程不受操作系统管理 程序保存。 执行gen.next()时，引擎会保存父协程调用栈信息（锁变量）

再看一个例子：

```javascript
async function async1() {
  console.log(1);
  await async2();
  console.log(3);
}
async function async2() {
  console.log(2);
}
async1();
console.log(4);
//1,2,4,3
```

通过这个例子可以知道，await那一行也是同步执行，await之后的就是异步执行的。

async通过babel编译之后的代码。

```javascript
var a = 0;

var test = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            console.log('init');
            _context.t0 = a;//保存变量
            _context.next = 4;
            return 10;

          case 4:
            _context.t1 = _context.sent;
            a = _context.t0 + _context.t1;
            //await之后才异步。
            console.log(a);

          case 7:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function test() {
    return _ref.apply(this, arguments);
  };
}();

test();
console.log(++a);

```

