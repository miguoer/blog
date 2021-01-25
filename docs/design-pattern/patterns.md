# 23 种设计模式

## 单例模式

```javascript
function getSingleton(fn) {
  var instance = null;

  return function() {
    if (!instance) {
      instance = fn.apply(this, arguments);
    }

    return instance;
  };
}
```
