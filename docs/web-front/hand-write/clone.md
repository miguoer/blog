# 深拷贝

```javascript
// 考点：
// 基本实现

// 递归能力


// 循环引用

// 考虑问题的全面性
// 理解weakmap的真正意义


// 多种类型

// 考虑问题的严谨性
// 创建各种引用类型的方法，JS API的熟练程度
// 准确的判断数据类型，对数据类型的理解程度


// 通用遍历：

// 写代码可以考虑性能优化
// 了解集中遍历的效率
// 代码抽象能力


// 拷贝函数：

// 箭头函数和普通函数的区别
// 正则表达式熟练程度


//乞丐版
// const obj2 = JSON.parse(JSON.stringify(obj));
// const obj = {
//   test: {
//     a: 2
//   },
//   arr: function(){}
// };
// const obj2 = JSON.parse(JSON.stringify(obj));
// console.log(obj.arr);
// console.log(obj2.arr);
//基础版本1
// function clone(target) {
//     let cloneTarget = {};
//     for (const key in target) {
//         cloneTarget[key] = target[key];
//     }
//     return cloneTarget;
// };
//基础版本2 => 对象的引用
// function clone(target) {
//     if (typeof target === 'object') {
//         let cloneTarget = {};
//         for (const key in target) {
//             cloneTarget[key] = clone(target[key]);
//         }
//         return cloneTarget;
//     } else {
//         return target;
//     }
// };
//基础版本3 =》考虑数组
// function clone(target) {
//     if (typeof target === 'object') {
//         let cloneTarget = Array.isArray(target) ? [] : {};
//         for (const key in target) {
//             cloneTarget[key] = clone(target[key]);
//         }
//         return cloneTarget;
//     } else {
//         return target;
//     }
// }
//循环引用
//解决循环引用问题，我们可以额外开辟一个存储空间，
//来存储当前对象和拷贝对象的对应关系，当需要拷贝当前对象时，
//先去存储空间中找，有没有拷贝过这个对象，如果有的话直接返回，
//如果没有的话继续拷贝，这样就巧妙化解的循环引用的问题
// function clone(target, map = new Map()) {
//     if (typeof target === 'object') {
//         let cloneTarget = Array.isArray(target) ? [] : {};
//         if (map.get(target)) {
//             return map.get(target);
//         }
//         map.set(target, cloneTarget);
//         for (const key in target) {
//             cloneTarget[key] = clone(target[key], map);
//         }
//         return cloneTarget;
//     } else {
//         return target;
//     }
// };
const obj = {
  test: {
    a: 2
  },
  arr: [],
  fn: function() {
    console.log("clone function");
  }
};
//故意设置循环引用造成Maximum call stack size
// obj.obj = obj;
// console.log(obj);
// { test: { a: 2 }, arr: [], obj: [Circular] }
// Circular 循环引用
const obj2 = clone(obj);
obj2.test.a = "修改";
obj2.arr.push("修改数组");
console.log(obj2.test.a);
console.log(obj.test.a);
console.log(obj.arr);
console.log(obj2.arr);

//性能优化 1.弱引用

// let obj = { name : 'ConardLi'}
// const target = new Map();
// target.set(obj,'laoyuan');
// obj = null;

// let obj = { name : 'ConardLi'}
// const target = new WeakMap();
// target.set(obj,'laoyuan');
// obj = null;
// function clone(target, map = new WeakMap()) {
//     // WeakMap为弱引用
// };

//性能优化2 去掉for in
// function forEach(array, iteratee) {
//   let index = -1;
//   const length = array.length;
//   while (++index < length) {
//     iteratee(array[index], index);
//   }
//   return array;
// }

// function clone(target, map = new WeakMap()) {
//   if (typeof target === "object") {
//     const isArray = Array.isArray(target);
//     let cloneTarget = isArray ? [] : {};

//     if (map.get(target)) {
//       return target;
//     }
//     map.set(target, cloneTarget);

//     const keys = isArray ? undefined : Object.keys(target);
//     forEach(keys || target, (value, key) => {
//       if (keys) {
//         key = value;
//       }
//       cloneTarget[key] = clone(target[key], map);
//     });

//     return cloneTarget;
//   } else {
//     return target;
//   }
// }

//其他类型 函数和buffer
// function cloneFunction(func) {
//     const bodyReg = /(?<={)(.|\n)+(?=})/m;
//     const paramReg = /(?<=\().+(?=\)\s+{)/;
//     const funcString = func.toString();
//     if (func.prototype) {
//         console.log('普通函数');
//         const param = paramReg.exec(funcString);
//         const body = bodyReg.exec(funcString);
//         if (body) {
//             console.log('匹配到函数体：', body[0]);
//             if (param) {
//                 const paramArr = param[0].split(',');
//                 console.log('匹配到参数：', paramArr);
//                 return new Function(...paramArr, body[0]);
//             } else {
//                 return new Function(body[0]);
//             }
//         } else {
//             return null;
//         }
//     } else {
//         return eval(funcString);
//     }
// }



```


## buffer
```javascript
// const Readable = require("stream").Readable;
// const rs = new Readable();
// rs.push("学习");
// rs.push(null);
// const rs2 = rs;
// rs2.push("node");
// rs2.push(null);
// rs.pipe(process.stdout);
// rs2.pipe(process.stdout)

const allocUnsafe = Buffer ? Buffer.allocUnsafe : undefined;
function cloneBuffer(buffer, isDeep) {
  if (isDeep) {
    return buffer.slice();
  }
  var length = buffer.length,
    result = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);

  buffer.copy(result);
  return result;
}

// const buf2 = cloneBuffer(buf,true);

const buf = Buffer.from('laoyuan');
const buf2 = buf;
buf2.write("nodejs");
buf2.write("22");
console.log("buf",buf.toString("utf-8"))
console.log("buf2",buf2.toString("utf-8"))


```

## all
```javascript
const mapTag = '[object Map]';
const setTag = '[object Set]';
const arrayTag = '[object Array]';
const objectTag = '[object Object]';
const argsTag = '[object Arguments]';

const boolTag = '[object Boolean]';
const dateTag = '[object Date]';
const numberTag = '[object Number]';
const stringTag = '[object String]';
const symbolTag = '[object Symbol]';
const errorTag = '[object Error]';
const regexpTag = '[object RegExp]';
const funcTag = '[object Function]';

const deepTag = [mapTag, setTag, arrayTag, objectTag, argsTag];


function forEach(array, iteratee) {
    let index = -1;
    const length = array.length;
    while (++index < length) {
        iteratee(array[index], index);
    }
    return array;
}

function isObject(target) {
    const type = typeof target;
    return target !== null && (type === 'object' || type === 'function');
}

function getType(target) {
    return Object.prototype.toString.call(target);
}

function getInit(target) {
    const Ctor = target.constructor;
    return new Ctor();
}

function cloneSymbol(targe) {
    return Object(Symbol.prototype.valueOf.call(targe));
}

function cloneReg(targe) {
    const reFlags = /\w*$/;
    const result = new targe.constructor(targe.source, reFlags.exec(targe));
    result.lastIndex = targe.lastIndex;
    return result;
}

function cloneFunction(func) {
    const bodyReg = /(?<={)(.|\n)+(?=})/m;
    const paramReg = /(?<=\().+(?=\)\s+{)/;
    const funcString = func.toString();
    if (func.prototype) {
        const param = paramReg.exec(funcString);
        const body = bodyReg.exec(funcString);
        if (body) {
            if (param) {
                const paramArr = param[0].split(',');
                return new Function(...paramArr, body[0]);
            } else {
                return new Function(body[0]);
            }
        } else {
            return null;
        }
    } else {
        return eval(funcString);
    }
}

function cloneOtherType(targe, type) {
    const Ctor = targe.constructor;
    switch (type) {
        case boolTag:
        case numberTag:
        case stringTag:
        case errorTag:
        case dateTag:
            return new Ctor(targe);
        case regexpTag:
            return cloneReg(targe);
        case symbolTag:
            return cloneSymbol(targe);
        case funcTag:
            return cloneFunction(targe);
        default:
            return null;
    }
}

function clone(target, map = new WeakMap()) {

    // 克隆原始类型
    if (!isObject(target)) {
        return target;
    }

    // 初始化
    const type = getType(target);
    let cloneTarget;
    if (deepTag.includes(type)) {
        cloneTarget = getInit(target, type);
    } else {
        return cloneOtherType(target, type);
    }

    // 防止循环引用
    if (map.get(target)) {
        return map.get(target);
    }
    map.set(target, cloneTarget);

    // 克隆set
    if (type === setTag) {
        target.forEach(value => {
            cloneTarget.add(clone(value, map));
        });
        return cloneTarget;
    }

    // 克隆map
    if (type === mapTag) {
        target.forEach((value, key) => {
            cloneTarget.set(key, clone(value, map));
        });
        return cloneTarget;
    }

    // 克隆对象和数组
    const keys = type === arrayTag ? undefined : Object.keys(target);
    forEach(keys || target, (value, key) => {
        if (keys) {
            key = value;
        }
        cloneTarget[key] = clone(target[key], map);
    });

    return cloneTarget;
}

module.exports = {
    clone
};


```