# CSS技巧总结

## 设置倍图
如果想根据屏幕的分辨率设置1倍图、2倍图这种需求，有以下几个方案：

### srcset
  IE不兼容，安卓4.4以上兼容，Chrome和Safari兼容性都很好
使用:
```javascript
<img srcset="images/team-photo.jpg 1x, images/team-photo-retina.jpg 2x, images/team-photo-full 2048w"/>

```

### img-set
```javascript
//css
background: image-set(
    url(w128px.jpg) 1x, 
    url(w256px.jpg) 2x, 
    url(w512px.jpg) 3x);

```

## 垂直居中水平居中
外层如果是flex, 里层只要设置margin auto就可以实现。
```css
      .automargin {
        --ydUnit: 500px;
        width: var(--ydUnit);
        height: var(--ydUnit);
        border: 1px dashed yellowgreen;
        display: flex;
      }
      .automargin div {
        margin: auto;
        /* margin-left: auto; */
      }

```

## 使用label绑定元素实现checkbox效果
```css
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <style>
      *,
      *:before,
      *:after {
        border: 0;
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }
      body {
        background: linear-gradient(#fff, #ccc);
        display: flex;
        height: 100vh;
        --on: #88e661;
        --off: #f0f0f0;
        --transDur: 0.6s;
      }
      input {
        position: fixed;
        transform: translateX(-100%);
      }
      .toy-toggle {
        background: radial-gradient(at top left, #fff 10%, #fff0 20%),
          radial-gradient(at top right, #fff 20%, #e4e4e4 35%);
        border-radius: 6em;
        box-shadow: 0 0 0.25em #0002, 0 3em 1.5em 0.5em #0002;
        cursor: pointer;
        display: block;
        font-size: 12px;
        position: relative;
        margin: auto;
        width: 20em;
        height: 12em;
        -webkit-tap-highlight-color: transparent;
      }
      .toy-toggle span {
        display: block;
        position: absolute;
      }
      .toy-toggle > span {
        top: 50%;
        left: 50%;
      }
      .toy-toggle > span:not(.handle) {
        transform: translate(-50%, -50%);
      }
      .border1 {
        background: #f0f0f0;
        border-radius: 5.5em;
        box-shadow: 0 0 0.2em 0.1em #f0f0f0;
        width: 19em;
        height: 11em;
      }
      .border2 {
        background: linear-gradient(0deg, #fff 33%, #ccc 45%);
        border-radius: 4.75em;
        box-shadow: 0 0 0.2em 0.3em #f0f0f0 inset;
        width: 16.5em;
        height: 9.5em;
      }
      .border3,
      .handle {
        background: linear-gradient(90deg, var(--on) 50%, var(--off) 0);
      }
      .border3 {
        background-position: 75% 0;
        background-size: 200% 100%;
        border-radius: 4.25em;
        box-shadow: 0 0 0.1em 0.1em #ddd inset, 0 1.5em 1.5em 1em #0004 inset,
          0 0 0 4.25em #0002 inset;
        width: 15.5em;
        height: 8.5em;
        transition: background-position var(--transDur) ease-in-out;
      }
      .handle {
        border-radius: 50%;
        box-shadow: 0 0 0.5em 0 #0007;
        width: 8.5em;
        height: 8.5em;
        transform: translate(-90%, -50%);
        transition: transform var(--transDur) ease-in-out;
        z-index: 0;
      }
      .handle:before {
        background: radial-gradient(2em 1.5em at 50% 35%, #fff6 15%, #fff0),
          radial-gradient(1.5em 2.5em at 75% 40%, #fff6 15%, #fff0),
          radial-gradient(100% 100% at 50% 33%, #0000 25%, #0003 50%);
        border-radius: 50%;
        box-shadow: 0 0 0.3em 0.1em #0003 inset;
        content: '';
        display: block;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 3;
      }
      .handle-off,
      .handle-on {
        width: 50%;
        height: 100%;
        transition: transform calc(var(--transDur) / 2);
        z-index: 2;
      }
      .handle-off {
        background: var(--off);
        border-radius: 100% 0 0 100% / 50% 50% 50% 50%;
        right: 50%;
        transform-origin: 100% 50%;
        transition-delay: calc(var(--transDur) / 2);
        transition-timing-function: ease-out;
      }
      .handle-on {
        background: var(--on);
        border-radius: 0 100% 100% 0 / 50% 50% 50% 50%;
        left: 50%;
        transform: scaleX(0);
        transform-origin: 0 50%;
        transition-timing-function: ease-in;
      }

      /* On */
      input:checked + .toy-toggle .border3 {
        background-position: 25% 0;
      }
      input:checked + .toy-toggle .handle {
        transform: translate(-10%, -50%);
      }
      input:checked + .toy-toggle .handle-off {
        transform: scaleX(0);
        transition-delay: 0s;
        transition-timing-function: ease-in;
      }
      input:checked + .toy-toggle .handle-on {
        transform: scaleX(1);
        transition-delay: calc(var(--transDur) / 2);
        transition-timing-function: ease-out;
      }
    </style>
  </head>
  <body>
    <input type="checkbox" id="toggle" name="toggle" value="is_on" />
    <label for="toggle" class="toy-toggle">
      <span class="border1"></span>
      <span class="border2"></span>
      <span class="border3"></span>
      <span class="handle">
        <span class="handle-off"></span>
        <span class="handle-on"></span>
      </span>
    </label>
  </body>
</html>

```

## 可拖拽缩放的分栏效果 resize
```css
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>分栏拉伸</title>
    <style>
      .resize-bar {
        border: 1px solid #bbb;
        width: 200px;
        height: 200px;
        resize: horizontal;
        overflow: scroll;
      }

      .resize-bar::-webkit-scrollbar {
        width: 200px;
        height: 200px;
      }
    </style>
  </head>

  <body>
    <div class="resize-bar"></div>
  </body>
</html>

```

## 汽车换颜色
主要用到混合模式 mix-blend-mode: hue
```css
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>混合模式</title>
    <style>
      html,
      body {
        height: 100%;
      }

      body {
        margin: 0;
      }

      img {
        height: 100%;
        width: 100%;
        object-fit: cover;
      }

      input {
        padding: 0;
        border: none;
        position: absolute;
        width: 100%;
        height: 100%;
        mix-blend-mode: hue;
        cursor: pointer;
      }

      /* Image Credit */
      a {
        position: absolute;
        bottom: 10px;
        right: 10px;
        color: #6b6bff;
        background: black;
        display: block;
        padding: 0 8px 3px;
        font-size: 15px;
        text-decoration: none;
      }
    </style>
  </head>

  <body>
    <!-- CLICK TO CHANGE COLOR -->
    <input type="color" value="#0000ff" />
    <img src="./assets/car.jpg" />
  </body>
</html>
```




