# 实现 LRU 算法

Map 既可以实现 O(1)查找，又能保存插入的顺序

```javascript
var LRUCache = function(capacity) {
  this.cache = new Map();
  this.capacity = capacity;
};

LRUCache.prototype.get = function(key) {
  if (this.cache.has(key)) {
    let temp = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, temp);
    return temp;
  }
  return -1;
};

LRUCache.prototype.set = function(key, value) {
  if (this.cache.has(key)) {
    this.cache.delete(key);
  } else if (this.cache.size > this.capacity) {
    this.cache.delete(
      this.cache
        .keys()
        .next()
        .value()
    );
  }
  this.cache.set(key, value);
};
```
