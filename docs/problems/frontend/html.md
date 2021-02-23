# Html

## 1. 请说明 Html 布局元素的分类有哪些？并描述每种布局元素的应用场景。

一、分类

1. 内联元素
   span a, b, strong, i, em, br, input, img, textarea 等

内联元素本身的属性为 display:inline;

和其它行内元素从左到右一行显示，不可以直接控制宽度、高度等其它相关 CSS 属性，但是可以直接设置内外边距的左右值。宽高是由本身内容大小决定的，

只能容纳文本或者其它行内元素，不能嵌套块级元素

2. [块级元素](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Block-level_elements)
   div, h1-h6, hr, menu, ol, li, dl, table, p, from, canval 等。本身的属性为 display:block;

块级元素占据其父元素（容器）的整个空间，因此创建了一个“块”。
块级元素只能出现在 <body></body> 元素内。默认情况下，块级元素会新起一行，从上到下排布，可以直接控制宽、高等相关 CSS 属性。

在不设置宽的情况下，块级元素的宽度默认是它父级元素内容的宽度。在不设置高度的情况下，块级元素的高度是它本身内容的高度。

3. 内联块级元素
   内联块级元素综合了前两种特性，代码是 display:inline-block;

   特点是不自动换行，能够设置元素的宽、高、line-height、padding、margin。

二、应用场景

- 内联元素： 用于不指定宽高，宽高由内容决定
- 块级元素：用于指定宽高，标签占满一行
- 内联块级元素： 用于指定宽高，不占满一行

## 2.html 标签 b 和 strong 的区别

答：两者在网页上的显示效果一样，但实际目的不同。
`<b>`标签对应 bold，表示文本加粗，是一种风格样式需求。

`<strong>` 标签的意思是加强，表示该文本比较重要，提醒读者注意。为了达到这个目的，浏览器会将其加粗显示。

他们的区别是样式标签和语义化标签的区别。

## 3. 说一下减少 DOM 数量的方法，一次性给你大量的 DOM 怎么优化？

答：
**一、 减少 DOM 数量的方法**

1. 使用伪元素，阴影实现的内容尽量不使用 DOM 实现，清除浮动时使用伪类实现等
2. 按需加载，较少不必要的渲染
3. 结构合理，

**二、 大量 DOM 时的优化**
当对 DOM 元素进行一系列操作时，对 DOM 进行访问和修改 DOM 引起的重绘和重排都比较消耗性能，所以关于操作 DOM，应该从以下几点出发：

1. 缓存 DOM 对象
   操作 DOM 一般会先去访问 DOM，尤其像循环遍历这种时间复杂度比较高的操作，可以再循环之前将不需要循环获取的 DOM 节点先获取到，在循环里直接引用。
2. 文档片段
   利用 document.createDocumentFragment()方法创建文档碎片节点，创建的是一个虚拟的节点对象。向这个节点添加 DOM 节点，修改 DOM 节点并不会影响到真实的 DOM 结构。
   我们可以利用这一点先将我们需要修改的 DOM 一并修改完，保存至文档碎片中，然后用文档碎片一次性的替换真实的 DOM 节点。与虚拟 DOM 类似，同样达到了不频繁修改 DOM 而导致的重排和重绘的过程。

```javascript
let fragment = document.createDocumnetFragment();

const operationDomHandle = (fragment) => {
  // 操作
};

operationDomHandle(fragment);

rootElem.replaceChild(fragment, oldDom);
```

3. 最优的 layout 方案
   批量读，一次性写。先对一个不在 render tree 上的节点进行操作，再把这个节点添加回 render tree。这样只会触发一次 DOM 操作。使用 requestAnimationFrame()，把所有导致重绘的操作放入 re

4. 虚拟 DOM
   js 模拟 DOM 树并对 DOM 树操作的一种技术。虚拟 DOM 是一个纯 JS 对象，对他操作会高效。

   利用虚拟 DOM，在 DOM 发生变化时先对虚拟 DOM 进行操作，通过 DOM Diff 算法将虚拟 DOM 和原始 DOM 的结构做对比，最终批量的修改真实 DOM 结构，尽可能避免了修改 DOM 而导致的频繁的重排和重绘。

## 4. Html5 有哪些新特性？如何处理 Html5 新标签的浏览器兼容性问题？如何区分 Html 和 Html5？
