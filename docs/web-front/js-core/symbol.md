# 元编程

如果我们想改变js原本的属性或其固有的方法，可以使用元编程。

symbol 是一种基本数据类型。Symbol()函数会返回symbol类型的值，该类型具有静态属性和静态方法。它的静态属性会暴露几个内建的成员对象；它的静态方法会暴露全局的symbol注册，且类似于内建对象类，但作为构造函数来说它并不完整，因为它不支持语法："new Symbol()"。

每个从Symbol()返回的symbol值都是唯一的。一个symbol值能作为对象属性的标识符；这是该数据类型仅有的目的

- Symbol.for(key)
使用给定的key搜索现有的symbol，如果找到则返回该symbol。否则将使用给定的key在全局symbol注册表中创建一个新的symbol。

```javascript
const symbol1 = Symbol();
const symbol2 = Symbol(42);
const symbol3 = Symbol('foo');

console.log(typeof symbol1);
// expected output: "symbol"

console.log(symbol2 === 42);
// expected output: false

console.log(symbol3.toString());
// expected output: "Symbol(foo)"

console.log(Symbol('foo') === Symbol('foo'));
// expected output: false

console.log(Symbol.for('foo') === Symbol.for('foo'));
//true

```

可以在对象中查找Symbol属性。Object.getOwnPropertySymbols() 方法让你在查找一个给定对象的符号属性时返回一个symbol类型的数组。注意，每个初始化的对象都是没有自己的symbol属性的，因此这个数组可能为空，除非你已经在对象上设置了symbol属性。

## Symbol应用
迭代 symbols
- Symbol.iterator
一个返回一个对象默认迭代器的方法。被 for...of 使用。
Symbol.asyncIterator 
一个返回对象默认的异步迭代器的方法。被 for await of 使用。
正则表达式 symbols
- Symbol.match
一个用于对字符串进行匹配的方法，也用于确定一个对象是否可以作为正则表达式使用。被 String.prototype.match() 使用。
- Symbol.replace
一个替换匹配字符串的子串的方法. 被 String.prototype.replace() 使用。
- Symbol.search
一个返回一个字符串中与正则表达式相匹配的索引的方法。被String.prototype.search() 使用。
- Symbol.split
一个在匹配正则表达式的索引处拆分一个字符串的方法.。被 String.prototype.split() 使用。
其他 symbols
- Symbol.hasInstance
一个确定一个构造器对象识别的对象是否为它的实例的方法。被 instanceof 使用。
- Symbol.isConcatSpreadable
一个布尔值，表明一个对象是否应该flattened为它的数组元素。被 Array.prototype.concat() 使用。
- Symbol.unscopables
拥有和继承属性名的一个对象的值被排除在与环境绑定的相关对象外。
- Symbol.species
一个用于创建派生对象的构造器函数。
- Symbol.toPrimitive
一个将对象转化为基本数据类型的方法。
- Symbol.toStringTag
用于对象的默认描述的字符串值。被 Object.prototype.toString() 使用。

### 使用Symbol改变原始值

```javascript
var test = {
    [Symbol.toPrimitive]:((i) => () => ++i)(0)
}

if(test == 1 && test == 2 && test == 3) {
    console.log("ddd");
}

//改变了test的原始值

```

### 开启尾递归调用优化

```javascript
function test(i) {
    return test(i--, i);
    TCO_ENABLED = true;
};
test(5);

```

### 拦截并定义基本语言操作的自定义行为

```javascript
//改变数组的行为，可以拿到负索引

const negativeArray = (els) =>
  new Proxy(els, {
    get: (target, propKey, receiver) =>
      Reflect.get(
        target,
        +propKey < 0 ? String(target.length + +propKey) : propKey,
        receiver
      ),
  });
const unicorn = negativeArray(['京', '程', '一', '灯']);
console.log(unicorn[-1]);

```

#### Proxy
使用Proxy可以代理
```javascript
let handler = {
  get: function (target, name) {
    return name in target ? target[name] : 42;
  },
  set: function (target, name) {
    // target[name] = 30;//死循环
    Reflect.set(target, name)
  },
};

let p = new Proxy({}, handler);
p.a = 1;
console.log(p.a, p.b); // 1, 42

```

在老的浏览器中不支持元编程的，可以使用reflect-metadata这个库。





