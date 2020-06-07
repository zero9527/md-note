# 前端模块化之AMD/requireJS、CMD/seaJS

## 前言
为了以后，可能需要搞一下以前的旧项目，自己也想玩玩，，，所以补一下旧时代的模块化玩法。。。

代码：[github地址](https://github.com/zero9527/FE-modules-AMD-CMD)

## AMD/CMD/Common.js/UMD/ES6模块化的主要区别
此前（2019年前前前前）前端模块化，主流的就是AMD/CommonJS，支持UMD的二者都可以用

> **为什么模块化？**<br>
> * 一直以来，前端开发的痛点之一就是 **代码复用/职责划分** 问题，兼容性比如ES6等新语法的支持/组件化/代码压缩等不在本文讨论范围。
> * 在这些 **前端模块化** 的东西出现之前，都是用`<script>`标签引入`js`，如果每个页面都 **按模块划分** (比如所有变量方法都放在一个对象里面)就不会造成全局变量污染，但是各种 **js/模块** 的依赖关系就不明确了，而且有些暂时用不到的js，又会先下载，影响页面加载速度。

#### 同步/异步，静态/动态
* 同步：CMD/CommonJS/ES6`import`
* 异步：AMD/CMD`require.async`
* 静态：编译时执行；AMD/ES6`import`，
* 动态：运行时执行；CMD/CommonJS/ES6+ `import()`

#### 运行环境：
* 浏览器：AMD/CMD，ES6模块化目前浏览器还不能原生支持，需要使用webpack/babel等编译成浏览器支持的版本
* 服务器：CommonJS：Node.js使用的模块化规范

#### UMD：
* 支持AMD/CommonJS的统一规范，使用UMD定义的模块，可以支持AMD和CommonJS

#### 第三方库：
* 支持UMD的库可以在 AMD/CommonJS 上使用，CMD在这方面就稍微差一点；
* 喜欢CommonJS模块写法的，CMD倒是个不错的选择

## 一、AMD/require.js
### 什么是AMD？
* AMD: Asynchronous Module Definition，中文名是 **异步模块定义** 的意思
* **依赖前置**，define的时候就引入，然后作为回调函数的参数使用
* 第三方库支持较多，相对的CMD支持的就比较少，如这里使用的 [lodash.js](https://www.lodashjs.com/) 库（或者我没配置对。。。）
* 使用 `return` 的方式导出

以下使用`require.js v2.3.6`示例：

![](../static/images/js-amd-cmd-1.png)

### 目录结构：
```
...\require.js-AMD
    ├─ index.html
    ├─ js
      ├─ lodash.js
      ├─ m1.js
      └─ m2.js
    ├─ main.js
    └─ require.js
```

### HTML
```html
<script src="./require.js" data-main="./main.js"></script>
```

### 入口 main.js
```js
// js/mian.js
// 全局配置
require.config({
  // 根路径设置，paths下面全部都是根据baseUrl的路径去设置
  baseUrl:'./js',
  paths: { // 定义引用时名称对应的路径
    m1: 'm1',
    m2: 'm2',
    lodash: 'lodash'
  },
  // 用来配置不兼容的模块，没有module.exports的第三方库（未验证。。。）
  // shim:{
  //   'lodash': {
  //     exports: '_'
  //   }
  // }
})

define('main', function() {
  require(['m1'], function(m1) {
    console.log('name: ', m1.name);
    console.log('add: ', m1.add(2, 8));
  });
})

```

### 模块定义
define函数格式： `define(id?, dependencies?, factory);`
```js
// js/m1.js
// define(id?, dependencies?, factory);
define('m1', ['lodash', 'm2'], function(_, m2) {
  
  _.map([1,2], function(num){
    console.log('num: ', num);
  });

  console.log(m2);

  var add = function(x, y) {
    return x + y;
  };

  return {
    name: 'm1.js',
    add: add
  };
})

```


## 二、CMD/sea.js
### 什么是CMD？
* 在浏览器端的`CommonJS`（除去某些Node.js环境特有的API）；同步、动态加载;
* **依赖就近**，哪里需要哪里`require`；
* 异步引入 `require.async([dependencies], callback)`；
* 使用 `exports/module.exports` 方式导出

以下使用`sea.js v3.0.0`示例：

![](../static/images/js-amd-cmd-2.png)

### 目录结构：
```
...\sea.js--CMD
    ├─ index.html
    ├─ js
      ├─ lodash.js
      ├─ m1.js
      └─ m2.js
    ├─ main.js
    └─ sea.js
```

### HTML
```html
  <script src="./js/lodash.js"></script>
  <script src="./sea.js"></script>
  <script>
    // 配置
    seajs.config({
      base: './', // 后续引用基于此路径
      alias: {  // 别名，可以用一个名称 替代路径（基于base路径）
        lodash: 'js/lodash.js',
        m1: 'js/m1',
        m2: 'js/m2',
      },
    });

    // 加载入口模块
    seajs.use("./main.js", function(main) {
      // 执行完 main.js导出(exports/module.exports)之前的同步操作之后的 回调
      main.init(); // init
    });

  </script>
```

### 入口 main.js
```js
// js/mian.js
define(function(require, exports, module) {
  var m1 = require('m1');
  console.log(m1.add(2,8));

  // 单独导出
  exports.init = function init() {
    console.log('init');
  }

  // 或者 先定义，再统一导出
  // function init() {
  //   console.log('init');
  // }
  // module.exports = {
  //   init: init
  // }
});

```

### 模块定义
define函数格式： `define(function(require, exports, module) {})`
```js
// js/m1.js
define(function(require, exports, module) {
  // 使用第三方库 lodash.js，script标签导入
  // 优先require，不然使用script
  _.map([1,2], function(item) {
    console.log(item);
  })

  // 异步引入
  require.async('m2', function(m2) {
    console.log('异步引入 m2');
  }); // m2

  // 每个函数单独导出
  exports.add = function(x, y) {
    return x + y;
  }

  // 或者 先定义，再统一导出
  // function add(x, y) {
  //   return x + y;
  // }
  // modules.exports = {
  //   add: add
  // }
});

```
