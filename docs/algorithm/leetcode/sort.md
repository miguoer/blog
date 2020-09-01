# 排序类

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
    if(s.length != t.length) {
        return false;
    }

    var sMap = new Map();
    var tMap = new Map();
    
    for(var i = 0; i < s.length; i++) {
        if(!sMap.get(s[i])) {
            sMap.set(s[i], 1);
        } else {
            sMap.set(s[i],sMap.get(s[i]) + 1);
        }
    }
    for(var i = 0; i < t.length; i++) {
        if(!tMap.get(t[i])) {
            tMap.set(t[i], 1);
        } else {
            tMap.set(t[i],tMap.get(t[i]) + 1);
        }
    }
    var flag = true;
    sMap.forEach((value, key, map) => {
        if(!tMap.get(key) || tMap.get(key) != value) {
            flag = false;
        }
    });
    return flag;
};
```