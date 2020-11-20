# CSS工作流
随着CSS不停的发展，CSS从最早的SASS LESS发展到现在已经发生了很大的变化。

CSS预处理器将特定格式源文件(sass less)文件到目标CSS。这些预处理器实际是写的js的代码。让我们可以在css中使用变量、混合、运算、函数、scope、namespaces等。但是现代化的css中这些都已经支持，这些预处理器慢慢显得多余了。

CSS后处理器可以完成CSS压缩、自动添加前缀AutoPrefixer、让CSS更美观的csscomb等。随着前后通吃的PostCSS出现，已经慢慢成为了主流。PostCSS可以让我们使用最新的CSS。

POSTCSS有一些值得收藏的插件
- postcss-custom-properties 运行时变量
- postcss-preset-env

# CSS分层

## 为什么要分层
这是因为：CSS有语义化的命名约定和CSS层的分离，将有助于它的可扩展性，性能的提高和代码的组织管理
- 大量的样式，覆盖、权重和很多!important，分好层可以让团队命名统一规范， 方便维护。
- 有责任感地去命名你的选择器。

## 分层的规则
- SMACSS
- BEM
- SUIT
- ACSS
- ITCSS
  国内用的最多的是BEM和ACSS。
###  BEM
BEM和SMACCS非常类似，主要用来如何给项目命名。一个简单命名更容易让别 人一起工作。比如选项卡导航是一个块(Block)，这个块里的元素的是其中标签之一 (Element)，而当前选项卡是一个修饰状态(Modifier):
- block 代表了更高级别的抽象或组件
block__element 代表.block的后代，用于形成一个完整的.block的整体。 .- block--modifier 代表.block的不同状态或不同版本。

修饰符使用的是_，子模块使用__符号
```javascript
    <ul class="nav">
      <li class="nav__item"></li>
      <li class="nav__item nav--active"></li>
      <li class="nav__item"></li>
    </ul>

```

### ACSS原子CSS
考虑如何设计一个系统的接口。原子(Atoms)是创建一个区块的最基本的特质， 比如说表单按钮。分子(Molecules)是很多个原子(Atoms)的组合，比如说一个表单中包括了一个标签，输入框和按钮。生物(Organisms)是众多分子(Molecules) 的组合物，比如一个网站的顶部区域，他包括了网站的标题、导航等。而模板 (Templates)又是众多生物(Organisms)的结合体。比如一个网站⻚面的布局。而最后的⻚面就是特殊的模板
```css
.test {
  color: red;
  /* font-size: 14px; */
}

.f-14 {
  font-size: 14px;
}

```
老的项目可能是这么写的，出现了CSS-Next之后，可以用嵌套来实现想要的效果，不用再写原子CSS这种模式的代码。

```css
:root{
  --font14: 14px;

}
.test {
  ul {
      var(--font14)
  }
}
```

如果是react项目，可以使用 `styletron` 这个库

```javascript
const Styletron = require('styletron');
const { injectStyle } = require('styletron-utils');
const styletron = new Styletron();
const redButtons = injectStyle(styletron, {
  color: 'red',
  fontSize: '14px',
});

const blueButtons = injectStyle(styletron, {
  color: 'blue',
  fontSize: '14px',
});
console.log(redButtons, blueButtons);
// a b c b  ---->b代表了fontSize

console.log(styletron);
//分析出来的css
```

## CSS最佳实践
实际开发过程中，以component+组件名作为css头的名字。使用css-next语法，最后用postcss处理就可以了。
```css
:root {
  --testColor: yellowgreen;
}
.components-list {
  & h3 {
    color: var(--testColor);
  }
  &:hover {
    color: rebeccapurple;
  }
}

```









