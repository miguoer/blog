# 42. 接雨水
给定 n 个非负整数表示每个宽度为 1 的柱子的高度图，计算按此排列的柱子，下雨之后能接多少雨水。

![1. List item](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9hc3NldHMubGVldGNvZGUtY24uY29tL2FsaXl1bi1sYy11cGxvYWQvdXBsb2Fkcy8yMDE4LzEwLzIyL3JhaW53YXRlcnRyYXAucG5n?x-oss-process=image/format,png#pic_center)

上面是由数组 [0,1,0,2,1,0,1,3,2,1,2,1] 表示的高度图，在这种情况下，可以接 6 个单位的雨水（蓝色部分表示雨水）。 感谢 Marcos 贡献此图。

示例:

输入: [0,1,0,2,1,0,1,3,2,1,2,1]
输出: 6

## 解答
``` javascript

/**
 * @param {number[]} height
 * @return {number}
 */
var trap = function(height) {
    if(height.length < 2) {
        return 0;
    }
    var maxIndex = 0;
    for(var i = 1; i < height.length; i++) {
        if(height[i] > height[maxIndex]) {
            maxIndex = i;
        }
    }
    //双指针,将数组从最高的列分为两段，左边和右边，

    //先找左边能装的水
    var b = 0;
    var water = 0; 
    for(var a = 0; a <= maxIndex; a++) {
        if(height[a] < height[b]) {
            //说明有凹槽，可以接水
            water = water + height[b] - height[a];
        } else {
            b = a;
        }
    }

    //计算右边能装的水
    b = height.length - 1;
    for(var a = height.length - 1; a >= maxIndex; a--) {
        if(height[a] < height[b]) {
            //说明有凹槽，可以接水
            water = water + height[b] - height[a];
        } else {
            b = a;
        }

    }
    return water;

};

```
本题解法时间复杂度O(N),空间复杂度O(1)