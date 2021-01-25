# 数据结构

本节主要练习，用 JS 实现各种数据结构

## List

```javascript
function List() {
  this.listSize = 0;
  this.pos = 0; // 当前位置
  this.dataStore = [];
  this.clear = clear;
  this.find = find;
  this.toString = toString;
  this.insert = insert;
  this.append = append;
  this.remove = remove;
  this.front = front; //从当前位置移动到第一个
  this.end = end; //从当前位置移动到最后一个
  this.prev = prev; // 前移1位
  this.next = next; //后移一位
  this.length = length;
  this.currPos = currPos;
  this.moveTo = moveTo;
  this.getElement = getElement;
  this.contains = contains;
}

function append(element) {
  this.dataStore[this.listSize++] = element;
}

function find(element) {
  for (var i = 0; i < this.listSize; i += 1) {
    if (this.dataStore[i] == element) {
      return i;
    }
  }
  return -1;
}

function remove(element) {
  var index = this.find(element);
  if (index > -1) {
    this.dataStore.slice(index, 1);
    --this.listSize;
    return true;
  }
  return false;
}

function length() {
  return this.listSize;
}
// ...
```

## 栈

其实是不需要的，数组现在默认就能实现栈的所有功能。

```javascript
function Stack() {
  this.dataStore = [];
  this.top = 0; // 标记可以插入新元素的位置
  this.push = push; // 入栈操作
  this.pop = pop;
  this.peek = peek;
  this.clear = clear;
  this.length = length;
}

function push(element) {
  this.dataStore(this.top++) = element;
}

// 返回栈顶元素
function pop() {
  this.top--;
  return this.dataStore.pop();
}

function peek() {
  return this.dataStore[this.top - 1];
}

function length() {
  this.top;
}

function clear() {
  this.dataStore = [];
  this.top = 0;
}
```

### 回文

应用在回文字符串里

```javascript
function isPalindrome(word) {
  var s = [];
  for (var i = 0; i < word.length; i++) {
    s.push(word[i]);
  }
  var reverse = "";
  while (s.length() > 0) {
    reverse += s.pop();
  }
  if (reverse == word) {
    return true;
  }
  return fasle;
}
```

## 链表

```javascript
```
