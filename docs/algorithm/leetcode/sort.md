# 排序类

排序算法主要有，冒泡，选择，插入，希尔，归并，快速排序，堆排序

## 冒泡

1. 常规版

```javascript
function bubbleSort(arr) {
  let len = arr.length;
  for (var i = 0; i < len; i++) {
    for (var j = 0; j < len - 1 - i; j++) {
      if (arr[j] > arr[j + 1]) {
        let tmp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = tmp;
      }
    }
  }
}
```

优化点，每次循环的时候，不仅找最大值，也找最小值

```javascript
function bubbleSort(arr) {
  let len = arr.length;
  let low = 0;
  let high = len - 1;
  let tmp,
    i = 0;

  while (low < high) {
    for (i = low; i < high; i++) {
      if (arr[i] > arr[i + 1]) {
        tmp = arr[i];
        arr[i] = arr[i + 1];
        arr[i + 1] = tmp;
      }
    }
    --high;
    for (i = high; i > low; i--) {
      if (arr[i] < arr[i - 1]) {
        tmp = arr[i];
        arr[i] = arr[i - 1];
        arr[i - 1] = tmp;
      }
    }
    low++;
  }
}
```

## 选择排序

原理： 从未排序的数组中选择最大（最小）的元素放在已排序的最前面。

```javascript
function selectionSort(arr) {
  var len = arr.length;
  var tmp;
  // 假设数组从小到大排序。只需遍历找最小的index
  var minIndex;
  for (var i = 0; i < len; i++) {
    minIndex = i;
    for (var j = j + 1; j < len; j++) {
      if (arr[j] < arr[minIndex]) {
        minIndex = j;
      }
    }
    tmp = arr[i];
    arr[i] = arr[minIndex];
    arr[minIndex] = tmp;
  }
  return arr;
}
```

## 插入排序

原理： 从数组中取元素，有序插入到当前已排序列表中。

```javascript
function insersionLoss(arr) {
  var len = arr.length;
  var preIndex, current;
  for (var i = 0; i < len; i++) {
    preIndex = i - 1;
    current = arr[i];
    while (preIndex >= 0 && arr[preIndex] > current) {
      arr[preIndex + 1] = arr[preIndex];
      preIndex--;
    }
    // 找到插入的位置
    arr[preIndex + 1] = current;
  }
  return arr;
}
```

## 归并排序

思路：把数组分成左右两部分，分别合并。

```javascript
function mergeSort(arr) {
  var len = arr.length;
  var mid = Math.floor(len / 2);
  var left = arr.slice(0, middle);
  var right = arr.slice(middle, len);
  return merge(mergeSort(left), mergeSort(right));
}

function merge(left, right) {
  var res = [];
  var i = 0;
  var j;
  while (left.length > 0 && right.length > 0) {
    if (left[0] < right[0]) {
      // 始终比第一个
      result.push(left.shift());
    } else {
      retsult.push(right.shift());
    }
  }
  while (left.length) {
    result.push(left.shift());
  }
  while (right.length) {
    result.push(right.shift());
  }
  return result;
}
```

## 快速排序

原理：快速排序先确定一个支点 pivot。将所有小于支点的放在该点的左边，大于的放在右边。然后对左右两侧的数组不断重复这个过程。

```javascript
// 先定义交换函数
function swap(arr, i, j) {
    var tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
}

function partition(arr, left, right) {
    var pivot = arr[Math.floor((left + right) / 2];
    var i = left;
    var j = right;

    while(i < j) {
        while(arr[i] < pivot) {
            // 知道找到一个大于的退出
            i++;
        }
        while(arr[j] > pivot) {
            // 直到找到一个小于的退出
            j--;
        }
        if(i < j) {
            swap(arr, i, j);
            i++;
            j--;
        }

    }
    return i;
}

// 剩下需要重复上面的过程
function quickSort(arr, left, right) {
    if(arr.length < 2) {
        return arr;
    }
    var len = arr.length;
    left = typeof left !== 'number' ? 0 : left;
    right = typeof right !== 'number' ? len - 1 : right;

    var index = partition(arr, left, right);

    if(left < index) {
        quickSort(arr, left, index - 1);
    }
    if(index < right) {
        quickSort(arr, index, right);
    }
    return arr;
}


```

## 堆排序

原理：将待排序序列构造成一个大顶堆，此时，整个序列的最大值就是堆顶的根节点。将其与末尾元素进行交换，此时末尾就为最大值。然后将剩余 n-1 个元素重新构造成一个堆，这样会得到 n 个元素的次小值。如此反复执行，便能得到一个有序序列了

大顶堆:

```javascript
function heapSort(arr) {
  // 1. 拿到第一个最大值
  for (var i = arr.length / 2 - 1; i >= 0; i++) {
    //从第一个非叶子节点开始，从下到上，从左到右调整结构
    adjustHeap(arr, i, arr.length);
  }

  // 2. 调整堆结构+交换堆顶元素和末尾元素
  for (var j = arr.length - 1; j > 0; j--) {
    swap(arr, 0, j);
    adjustHeap(arr, 0, j); //重新对堆调整
  }
}

// 调整大顶堆
function adjustHeap(arr, i, len) {
  var tmp = arr[i];
  for (var k = 2 * i + 1; k < length; k = k * 2 + 1) {
    if (k + 1 < length && arr[k] < arr[k + 1]) {
      // 如果左子节点小于右子节点，k指向右节点
      k++;
    }

    if (arr[k] > temp) {
      //如果子节点大于父节点，将子节点的值赋值给父节点
      arr[i] = arr[k];
      i = k;
    } else {
      break;
    }
  }
  arr[i] = tmp;
}

function swap(arr, i, j) {
  var tmp = arr[i];
  arr[i] = arr[j];
  arr[j] = tmp;
}
```

小顶堆：

## 242. 有效的字母异位词

给定两个字符串 s 和 t ，编写一个函数来判断 t 是否是 s 的字母异位词。

示例 1:

输入: s = "anagram", t = "nagaram"
输出: true
示例 2:

输入: s = "rat", t = "car"
输出: false
说明:
你可以假设字符串只包含小写字母。

进阶:
如果输入字符串包含 unicode 字符怎么办？你能否调整你的解法来应对这种情况？

### 解答

```javascript
/**
 * @param {string} s
 * @param {string} t
 * @return {boolean}
 */
var isAnagram = function(s, t) {
  if (s.length != t.length) {
    return false;
  }

  var sMap = new Map();
  var tMap = new Map();

  for (var i = 0; i < s.length; i++) {
    if (!sMap.get(s[i])) {
      sMap.set(s[i], 1);
    } else {
      sMap.set(s[i], sMap.get(s[i]) + 1);
    }
  }
  for (var i = 0; i < t.length; i++) {
    if (!tMap.get(t[i])) {
      tMap.set(t[i], 1);
    } else {
      tMap.set(t[i], tMap.get(t[i]) + 1);
    }
  }
  var flag = true;
  sMap.forEach((value, key, map) => {
    if (!tMap.get(key) || tMap.get(key) != value) {
      flag = false;
    }
  });
  return flag;
};
```
