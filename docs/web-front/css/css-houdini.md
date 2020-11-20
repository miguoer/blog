# CSS Houdini
在现今的 Web 开发中，JavaScript 几乎占据所有版面，除了控制页面逻辑与操作 DOM 对象以 外，连 CSS 都直接写在 JavaScript 里面了，就算浏览器都还沒有实现的特性，总会有人做出对应 的 Polyfills，让你快速的将新 Feature 应用到 Production 环境中，更別提我们还有 Babel 等工具 帮忙转译。
而 CSS 就不同了，除了制定 CSS 标准规范所需的时间外，各家浏览器的版本、实战进度差异更是 旷日持久，顶多利用 PostCSS、Sass 等工具來帮我們转译出浏览器能接受的 CSS。开发者们能操 作的就是通过 JS 去控制 DOM 与 CSSOM来影响页面的变化，但是对于接下來的 Layout、Paint 与 Composite 就几乎沒有控制权了。
为了解決上述问题，为了让 CSS 的魔力不再浏览器把持，Houdini 就诞生了!( Houdini 是美国的 伟大魔术师，擅长逃脱术，很适合想将 CSS 从浏览器中解放的概念)
CSS Houdini 是由一群來自 Mozilla, Apple, Opera, Microsoft, HP, Intel, IBM, Adobe 与 Google 的工程 师所组成的工作小组，志在建立一系列的 API，让开发者能够介入浏览器的 CSS engine

CSS Houdini的核心就是可以让我们把JS写进CSS。

## 扩展CSS词法分析器

### CSS Parser
CSS Parser API 还没有被写入规范, 随时都会有变化，但是它的基本思想不会变:允许开发者自 由扩展 CSS 词法分析器，引 入新的结构(constructs)， 比如新的媒体规则、新的伪 类、嵌套、@extends、 @apply 等等。
只要新的词法分析器知道如何 解析这些新结构，CSSOM 就 不会直接忽略它们，而是把这 些结构放到正确的地方。

### CSS Panit
CSS Paint API Layout API 非常相似。它提供了
一个 registerPaint 方法，
操作方式和 程要借助
registerLayout 方法也很 Worklet 相似。当想要构建一个
CSS 图像的时候，开发者 随时可以调用paint() 函 数，也可以使用刚刚注册
好的名字。

### CSS Layout
CSS Layout API允许开发 者可以通过 CSS Layout API 实现自己的布局模块 (layout module)，这里 的“布局模块”指的是 display 的属性值。也就是 说，这个 API 实现以后， 开发者首次拥有了像 CSS 原生代码(比如 display:flex、 display:table)那样的布局能力。

例如：可以自己构建一个waterfall的瀑布流布局，然后用display设置一些就可以了。
```css
.item-list{
  display: layout(waterfall);
}

registerLayout('waterfall', class {
  static get inputProperties() {
    return ['width', 'height']
  }
  static get childrenInputProperties() {
    return ['x', 'y', 'position']
  } 
  static get childDisplay()
  *intrinsicSizes(children, styleMap)
  *layout(constraints, children, styleMap, edges, breakToken)
});

```

我们需要用Worklets加载写好的js
### Worklets
( registerLayout 和 registerPaint)已经了解过了，这些代码得放在哪里呢?答案就是 worklet 脚本(工作流脚本文件)。
Worklets 的概念和 web worker 类似，它们允许你引入脚本文件并执行 特定的 JS 代码，这样的 JS 代码要满足两个条件:第一，可以在渲染 流程中调用;第二，和主线程独立。
Worklet 脚本严格控制了开发者所能执行的操作类型，这就保证了性能 Worklets 的特点就是轻量以及生命周期较短。

```javascript
CSS.paintWorklet.addModule('xxx.js') CSS.layoutWorklet.addModule('xxx.js')

```
一个星空的实际例子：
```javascript
//html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>CSS Houdini绘制星空</title>
    <style>
      body {
        margin: 0;
        color: #fff;
        font-size: 24px;
        background: #000;
      }
      body::before {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        --star-density: 0.8;
        --star-opacity: 1;
        background-image: paint(yd-sky);
        animation: shine 1s linear alternate infinite;
      }
      @keyframes shine {
        from {
          --star-opacity: 1;
        }
        to {
          --star-opacity: 0.4;
        }
      }
    </style>
  </head>
  <body>
    <script>
      if (!CSS in window || !CSS.paintWorklet) {
        console.log('不支持paintWorklet');
      } else {
        CSS.paintWorklet.addModule('./sky.js');
      }
    </script>
  </body>
</html>

```
```javascript
//sky.js
class StarSky {
  constructor() {}
  static get inputProperties() {
    return ['--star-density', '--star-opacity'];
  }
  paint(ctx, geom, properties) {
    const xMax = geom.width;
    const yMax = geom.height;
    console.log(xMax, yMax);
    ctx.fillRect(0, 0, xMax, yMax);
    let starDensity = properties.get('--star-density').toString() || 1;
    let starOpacity = properties.get('--star-opacity').toString() || 1;
    const stars = Math.round((xMax + yMax) * starDensity);
    for (let i = 0; i <= stars; i++) {
      const x = Math.floor(Math.random() * xMax + 1);
      const y = Math.floor(Math.random() * yMax + 1);
      const size = Math.floor(Math.random() * 2 + 1);
      const opacityOne = Math.floor(Math.random() * 9 + 1);
      const opacityTwo = Math.floor(Math.random() * 9 + 1);
      const opacity = +('.' + (opacityOne + opacityTwo)) * starOpacity;
      const hue = Math.floor(Math.random() * 360 + 1);
      ctx.fillStyle = `hsla(${hue},30%,80%,${opacity})`;
      ctx.fillRect(x, y, size, size);
    }
  }
}
registerPaint('yd-sky', StarSky);

```

 