# 整理复习一些JS“基础”

重学一些JS基础

## 1、面向对象
### 1.1 封装
```js
function Animal(place) {
  this.place = place;
  this.type = 'animal';

  this.run = function(m) {
    console.log('run: ', m);
  }
}
Animal.prototype = {
  a: 'a'
}
```

### 1.2 继承
#### new 的时候做了什么？
1. 创建一个新对象；
2. 将构造函数的作用域赋给新对象（因此 this 就指向了这个新对象）；
3. 执行构造函数中的代码（为这个新对象添加属性）；
4. 返回新对象。

```js
function F(type) {
  this.type = type;
  this.f = 'f';

  this.run = function(m) {
    console.log('run: ', m);
  }
}
F.prototype.a = 'a';

function _new() {
  var obj = {};
  var fn = Array.prototype.shift.call(arguments);

  obj.__proto__ = fn.prototype;
  var newObj = fn.apply(obj, arguments);

  return (
    Object.prototype.toString.call(newObj) === '[object Object]'
    ? newObj
    : obj
  );
}

// var f1 = new F();
var f1 = _new(F, 'F4');
console.log('f: ', f1); // { type: 'F4', f: 'f', run: [Function] }
console.log('a: ', f1.a); // a
console.log('type: ', f1.type); // F4
f1.run(2); // 2
```

#### 继承方式1：原型
* 可以继承父类内置方法、原型属性
* 缺点：不能向构造函数传参数；与父类共享，互相影响

```js
function Cat1() {
  this.c = 'c';
}
Cat1.prototype = new Animal();

console.log('-------- 1 ---------');
const cc1 = new Cat1();
console.log(cc1.type); // animal
console.log(cc1.a); // a
console.log(cc1.place); // undefined
cc1.run(2); // 2
```

#### 继承方式2：apply
继承父类内置方法
 * 缺点：无法继承父类的原型属性
 * 解决：看方法3、方法4
 
```js
function Cat2() {
  // Animal.apply(this, arguments);
  Animal.apply(this, ['深圳']);
  // this.type = 'cat'; // 会覆盖上面继承的东西
  this.c = 'c';
}

console.log('--------- 2 --------');
const cc2 = new Cat2();
console.log(cc2.type); // animal
console.log(cc2.a); // undefined
console.log(cc2.place); // 深圳
cc2.run(2); // 2
```

#### 继承方式3：Object.create
继承父类的原型属性
 * 缺点：不能向构造函数传参数；
 * 解决：与方式2一起用

```js
function Cat3() {
  // Animal.apply(this, arguments);
  Animal.apply(this, ['深圳']);
  // this.type = 'cat'; // 会覆盖上面继承的东西
  this.c = 'c';
}
Cat3.prototype = Object.create(Animal.prototype);
Cat3.prototype.constructor = Cat3;

console.log('--------- 3 --------');
const cc3 = new Cat3();
console.log(cc3.type); // animal
console.log(cc3.a); // a
console.log(cc3.place); // 深圳
cc3.run(2); // 2
```

#### 继承方式4：寄生+组合
* 缺点：无法继承父类内置方法
* 解决：与方式2一起用

```js
function Cat4() {
  // Animal.apply(this, arguments);
  Animal.apply(this, ['深圳']);
  // this.type = 'cat'; // 会覆盖上面继承的东西
  this.c = 'c';
}

// 可以改一下，Function.prototype.extend 写方法
// 使用更方便：Child.extend(Parent);
function extend(Child, Parent) {
  var fn = function() {};
  fn.prototype = Parent.prototype;
  Child.prototype = new fn();
  Child.prototype.constructor = Child;
  Child.uber = Parent.prototype;
}

extend(Cat4, Animal);

console.log('--------- 4 --------');
const cc4 = new Cat4();
console.log(cc4.type); // animal
console.log(cc4.a); // a
console.log(cc4.place); // 深圳
cc4.run(2); // 2
```


## 2、事件循环 Event Loop
JS是单线程的，一旦遇到异步任务就会把其中的内容放到任务队列 Task；
然后浏览器在执行同步任务的同时，不断轮询任务队列，如果任务队列中有任务，会按照 **先进先出** 的顺序执行；

### 2.1 异步任务
分为微任务 Micro Task，宏任务 Macro Task；

**宏任务队列** 中的宏任务 会在上一个宏任务执行完时执行；

**微任务队列** 中的微任务 则是在主线程空闲时（如每一个宏任务执行完）执行；期间有新的微任务会继续执行，微任务都执行完才会继续轮询 宏任务队列；

#### 宏任务 Macro Task
* 浏览器 <br />
    `setTimeout`, `setInterval`, `requestAnimationFrame`, `I/O`
* Node.js <br />
    `setTimeout`, `setInterval`, `setImmediate`

#### 微任务 Micro Task
* 浏览器 <br />
    `Promsie.then`, `Promsie.catch`, `Promsie.finally`, `MutationObserver`
* Node.js <br />
    `Promsie.then`, `Promsie.catch`, `Promsie.finally`, `process.nextTick`

```js
console.log('Start!');

setTimeout(() => {
  console.log('setTimeout1')
}, 0);

new Promise((resolve, reject) => {
  console.log('Promise');
  resolve();

  setTimeout(() => {
    console.log('setTimeout2');
  }, 0);

  Promise.resolve().then(() => {
    console.log('then2');
  })
}).then(() => {
  console.log('then1');
})

console.log('End!');

// Start, Promise, End, then2, then1, setTimeout1, setTimeout2;
```

### 2.2 循环异步输出
`for 循环` 调用 `setTimeout` 问题

因为 `for 循环` 是同步的，而 `setTimeout` 是异步宏任务，每一次循环都会在任务队列添加一次  `console.log(i)` ，等到 `i===9` 的时候循环结束，这个时候 `i++` 于是 `i=10` 了，再依次调用 `console.log(i)`，所以打印 **10个10**

```js
// 10个10
for (var i=0; i<10; i++) {
  setTimeout(() => {
    console.log(i);
  }, 0);
}
```

**解决方法1: `setTimeout` 第三个参数**
```js
// 0-9
for (var i=0; i<10; i++) {
  setTimeout((j) => {
    console.log(j);
  }, 0, i);
}
```

**解决方法2: 闭包**
```js
// 0-9
for (var i=0; i<10; i++) {
  (function(j) {
    setTimeout(() => {
      console.log(j);
    }, 0)
  })(i)
}
```

**解决方法1: let**

`let` 有块级作用域

这样是每次 `for` 都是独立的 `i`
```js
// 0-9
for (let i=0; i<10; i++) {
  setTimeout((i) => {
    console.log(i);
  }, 0, i);
}
```

这样就不行了，所有的 `i` 都是同一个 `i`
```js
// 10个10
let i;
for (i=0; i<10; i++) {
  setTimeout(() => {
    console.log(i);
  }, 0);
}
```


## 3、this
执行上下文，重在 **执行** 二字，谁调用就是谁；

可以理解为是一个对象，一般函数是那个对象的 `key`，这个函数的 `this` 就是那个对象；除非 `call/bind/apply` 改变了 `this`

```js
/**
 * this
 */
function a() {
  // 如果 a.call(obj)，则是 { a: 'a', fn: [Function: fn] }，
  // 否则 global/Window
  console.log('a: ', this); 
  
  b();
  function b() {
    console.log('b: ', this); // global/Window
    c();
    function c() {
      console.log('c: ', this); // global/Window
    }
  }
}

const obj = {
  a: 'a',
  fn: function() {
    console.log('fn: ', this); // { a: 'a', fn: [Function: fn] }
  }
};

obj.fn();

a.call(obj);
```

### 3.1 箭头函数
看这位大佬的 [文章](https://juejin.im/post/5cfdb35af265da1bb96fd17b)

**箭头函数与普通函数的区别：**
* 没有 `this`
* 没有 `arguments`
* 无法 `call/bind/apply` 切换 `this`
* 没有原型
* 没有构造函数，不能 `new` 

### 3.2 call/apply/bind
都是切换上下文，绑定 `this` 的，简单说就是把当前函数作为切换的那个对象的属性

#### call
切换上下文，立即执行，参数展开非数组

```js
/**
 * call
 * 切换上下文，立即执行，参数展开非数组
 * @param {*} ctx 执行上下文
 */
Function.prototype._call = function(ctx) {
  ctx = ctx || {};
  ctx.fn = this;

  var args = [];
  // 展开参数
  // arguments[0] 是 ctx.fn 函数
  for(var i=1; i<arguments.length; i++) {
    args.push('arguments['+ i +']');
  }

  var res = eval('ctx.fn('+ args +')')
  
  delete ctx.fn;
  return res;
}

// 测试
var a = 'window-a';
var obj = {
  a: 'obj-a',
  fn: function(c, d) {
    console.log('a:', this.a);
    console.log('c:', c);
    console.log('d:', d);
  }
};
var obj2 = {
  a: 'obj2-a'
};
var obj3 = {
  a: 'obj3-a'
};

// a: obj2-a, c: cc2, d: dd2
obj.fn._call(obj2, 'cc2', 'dd2'); 

// a: obj3-a, c: cc3, d: dd3
obj.fn._call(obj3, 'cc3', 'dd3'); 

// a: window-a, c: cc-null, d: dd
obj.fn._call(null, 'cc-null', 'dd'); 

// a: window-a, c: cc-undefined, d: dd
obj.fn._call(undefined, 'cc-undefined', 'dd'); 
```

#### apply
切换上下文，会执行，参数是数组

```js
/**
 * apply
 * 切换上下文，立即执行，参数为数组
 * @param {*} ctx 执行上下文
 */
Function.prototype._apply = function(ctx) {
  if (
    arguments.length > 2 ||
    Object.prototype.toString.call(arguments[1]) !== '[object Array]'
  ) {
    console.warn('参数只能一个，且为数组！');
    return;
  }
  ctx = ctx || {};
  ctx.fn = this;

  var args = [];
  for(var i=0; i<arguments[1].length; i++) {
    args.push('arguments[1]['+ i +']');
  }

  var res = eval('ctx.fn('+ args +')');

  delete ctx.fn;
  return res;
}

// 测试
var a = 'window-a';
var obj = {
  a: 'obj-a',
  fn: function(c, d) {
    console.log('a:', this.a);
    console.log('c:', c);
    console.log('d:', d);
  }
};
var obj2 = {
  a: 'obj2-a'
};
var obj3 = {
  a: 'obj3-a'
};

// a: obj-a, c: cc, d: dd
obj.fn('cc', 'dd');

// a: obj2-a, c: cc2, d: dd2
obj.fn._apply(obj2, ['cc2', 'dd2']);

// a: obj3-a, c: cc3, d: dd3
obj.fn._apply(obj3, ['cc3', 'dd3']);

// a: window-a, c: cc-null, d: dd-null
obj.fn._apply(null, ['cc-null', 'dd-null']);

// a: window-a, c: cc-undefined, d: dd-undefined
obj.fn._apply(undefined, ['cc-undefined', 'dd-undefined']);
```

#### bind
切换上下文，返回一个新函数；不会立即执行

```js
/**
 * bind
 * 切换上下文，返回一个新函数；不会立即执行
 * @param {*} ctx 执行上下文
 */
Function.prototype._bind = function(ctx) {
  ctx = ctx || {};
  ctx.fn = this;

  var args = [];
  // 展开参数
  // arguments[0] 是 ctx.fn 函数
  for (var i=1; i<arguments.length; i++) {
    args.push('arguments['+ i +']');
  }
  
  var res = eval('ctx.fn(' + args +')');

  delete ctx.fn;
  return function() {
    res;
  };
}

// 测试
var a = 'window-a';
var obj = {
  a: 'obj-a',
  fn: function(c, d) {
    console.log('a:', this.a);
    console.log('c:', c);
    console.log('d:', d);
  }
};
var obj2 = {
  a: 'obj2-a'
};
var obj3 = {
  a: 'obj3-a'
};

obj.fn('c', 'd'); // a: obj-a, c: c, d: d

var fn1 = obj.fn._bind(null, 'cc1', 'dd1');
fn1(); // a: window-a, c: cc1, dd1

var fn2 = obj.fn._bind(obj2, 'cc2', 'dd2');
fn2(); // a: obj2-a, c: cc2, d: dd2

var fn3 = obj.fn._bind(obj3, 'cc3', 'dd3');
fn3(); // a: obj3-a, c: cc3, d: dd3

// 这个时候是不能再绑定的，所以打印的是第一次绑定的内容
fn3.bind(obj2, 'cc2', 'dd2');
fn3(); // a: obj3-a, c: cc3, d: dd3
```

### 3.3 闭包
内部函数，私有变量

* 闭包：有权访问外部作用域的私有变量的函数；
* 被闭包引用的变量不会被自动清理(gc)

也可以这么理解：函数的内部函数引用外部的私有变量，那么内部函数就是闭包；

![](../static/images/js-js-review-3.3.png) 


## 4、对象/数组拷贝
### 4.1 浅拷贝
只拷贝一层 key，如果这个 key 是复杂数据类型（Object/Array）的话，有引用赋值

```js
function clone(objArr) {
  var getType = o => Object.prototype.toString.call(o);
  var isObjectOrArray = o => (
    getType(o) === '[object Object]' 
    || getType(o) === '[object Array]'
  );
  if (!isObjectOrArray(objArr)) return objArr;

  var newObj = getType(objArr) === '[object Object]' ? {} : [];
  Object.keys(objArr).forEach(item => {
    newObj[item] = objArr[item];
  })
  return newObj;
}

var obj1 = {
  a: 'a',
  b: {
    c: 'c1'
  }
};

var obj2 = clone(obj1);
console.log(obj2); // { a: 'a', b: { c: 'c1' } }
obj2.a = 'a2';
obj2.b.c = 'c2';
console.log(obj2); // { a: 'a2', b: { c: 'c2' } }
console.log(obj1); // { a: 'a', b: { c: 'c2' } }

var arr1 = [1, [3]];
var arr2 = clone(arr1);
console.log(arr2); // [ 1, [ 3 ] ]
arr2[0] = 2;
arr2[1][0] = 4;
console.log(arr2); // [ 2, [ 4 ] ]
console.log(arr1); // [ 1, [ 4 ] ]
```

### 4.2 深拷贝
* 判断 `objArr` 是否对象或数组，否的话直接返回；
* 是的话，对象则给新变量初始化为对象 `{}`，数组则 `[]`，
* 然后 循环判断每个 `key`，`key` 的值是对象或数组的话 递归执行

```js
/**
 * 深拷贝
 * 判断 `obj` 是否对象或数组，否的话直接返回；
 * 是的话，对象则给新变量初始化为对象 `{}`，数组则 `[]`，
 * 然后 循环判断每个 `key`，`key` 的值是对象或数组的话 递归执行
 */
function deepClone(objArr) {
  var getType = o => Object.prototype.toString.call(o);
  var isObjectOrArray = o => (
    getType(o) === '[object Object]' 
    || getType(o) === '[object Array]'
  );
  if (!isObjectOrArray(objArr)) return objArr;

  var newObjArr = getType(objArr) === '[object Object]' ? {} : [];

  Object.keys(objArr).forEach(item => {
    newObjArr[item] = isObjectOrArray(objArr[item])
      ? deepClone(objArr[item])
      : objArr[item]
  })

  return newObjArr; 
}

var obj3 = {
  a: 'a',
  b: {
    c: 'c1',
    e: {
      f: 'f'
    }
  },
  d: [0, 1, [2]]
};

var obj4 = deepClone(obj3);
console.log(obj4); // { a: 'a', b: { c: 'c1', e: { f: 'f' } }, d: [ 0, 1, [ 2 ] ] }
obj4.a = 'a2';
obj4.b.c = 'c2';
obj4.b.e.f = 'f1';
obj4.d[0] = 1;
obj4.d[2][0] = 3;
console.log(obj4); // { a: 'a2', b: { c: 'c2', e: { f: 'f1' } }, d: [ 1, 1, [ 3 ] ] }
console.log(obj3); // { a: 'a', b: { c: 'c1', e: { f: 'f' } }, d: [ 0, 1, [ 2 ] ] }
```


## 5、ES6一些数组方法的实现
### 5.1 Array.prototype.map
* 将 `item`、`循环序列号` 作为两个参数传给回调函数
* 回调函数的返回值作为 `item`，返回一个与原数组一样长度的新数组

**[语法](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map):**
```js
var new_array = arr.map(function callback(currentValue[, index[, array]]) {
    // Return element for new_array
}[, thisArg])
```

**实现：**
```js
/**
 * Array.prototype.map
  * 将 `item`、`循环序列号` 作为两个参数传给回调函数
  * 回调函数的返回值作为 `item`，返回一个与原数组一样长度的新数组
 */
Array.prototype._map = function(cb) {
  var arr = this;
  var _this = arguments[1] || window;
  var newArr = [];

  // while 写法
  var i = 0;
  while(i < arr.length) {
    newArr.push(cb.call(_this, arr[i], i, arr));
    i++;
  }
  
  // for 循环写法：
  // for(var i=0; i<arr.length; i++) {
  //   newArr.push(cb.call(_this, arr[i], i, arr));
  // }

  return newArr;
}

// 测试
var arr = [
  { a: 'a1', b: 'b1', c: ['c1'], d: 'd' },
  { a: 'a2', b: 'b1', c: ['c2'], d: 'd' },
  { a: 'a3', b: 'b2', c: ['c2'], d: 'd' },
  { a: 'a4', b: 'b3', c: ['c3'], d: 'd' },
];

var arr1 = arr._map(function(item) {
  console.log('this: ', this); // { a: 'aaaa' }
  return item.a
}, { a: 'aaaa' });
var arr2 = arr._map(item => item.b);
var arr3 = arr._map(item => {
  return {
    a: 'aa',
    b: item.b
  }
});
console.log(arr1); // [ 'a1', 'a2', 'a3', 'a4' ]
console.log(arr2); // [ 'b1', 'b1', 'b2', 'b3' ]
console.log(arr3);
```

### 5.2 Array.prototype.forEach
for 循环，将 `item`、`循环序列号` 作为两个参数传给回调函数，循环直接执行回调函数

**[语法](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach):**
```
arr.forEach(callback(currentValue [, index [, array]])[, thisArg]);
```

**实现：**
```js
/**
 * Array.prototype.forEach
 * for 循环，将 `item`、`循环序列号` 作为两个参数传给回调函数，循环直接执行回调函数
 */
Array.prototype._forEach = function(cb) {
  var arr = this;
  var _this = arguments[1] || window;
  var i = 0;

  while(i < arr.length) {
    cb.call(_this, arr[i], i, arr);
    i++;
  }
}

// 测试
var arr = [
  { a: 'a1', b: 'b1', c: ['c1'], d: 'd' },
  { a: 'a2', b: 'b1', c: ['c2'], d: 'd' },
  { a: 'a3', b: 'b2', c: ['c2'], d: 'd' },
  { a: 'a4', b: 'b3', c: ['c3'], d: 'd' },
];

arr._forEach(function(item) {
  console.log('this: ', this); // this:  { a: 'aaaa' }

  item.a = 'aa';
  item['d'] = 'dd';
}, { a: 'aaaa' });
console.log(arr);
/**
[ { a: 'aa', b: 'b1', c: [ 'c1' ], d: 'dd' },
  { a: 'aa', b: 'b1', c: [ 'c2' ], d: 'dd' },
  { a: 'aa', b: 'b2', c: [ 'c2' ], d: 'dd' },
  { a: 'aa', b: 'b3', c: [ 'c3' ], d: 'dd' } ]
 */
```

### 5.3 Array.prototype.filter
* 将 `item`，`循环序列号`，`当前数组` 作为参数传给回调函数；
* 回调函数的返回值作为条件，去过滤原数组，返回符合条件的 `item` 组成的数组

**[语法](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter):**
```
var newArray = arr.filter(callback(element[, index[, array]])[, thisArg])
```

**实现：**
```js
/**
 * Array.prototype.filter
 * 将 `item`，`循环序列号`，`当前数组` 作为参数传给回调函数；
 * 回调函数的返回值作为条件，去过滤原数组，返回符合条件的 `item` 组成的数组
 */
Array.prototype._filter = function(cb) {
  var arr = this;
  var _this = arguments[1] || window;
  var newArr = [];
  var i = 0;

  while(i < arr.length) {
    var res = Boolean(cb.call(_this, arr[i], i, arr));
    if (res) newArr.push(arr[i]);
    i++;
  }

  return newArr;
}

// 测试
var arr = [
  { a: 'a1', b: 'b1', c: ['c1'], d: 'd' },
  { a: 'a2', b: 'b1', c: ['c2'], d: 'd' },
  { a: 'a3', b: 'b2', c: ['c2'], d: 'd' },
  { a: 'a4', b: 'b3', c: ['c3'], d: 'd' },
];

var arr1 = arr._filter(function(item) {
  console.log('this: ', this); // { a: 'aaaa' }
  return item.a === 'a1'
}, { a: 'aaaa' });
var arr2 = arr._filter(item => item);
console.log(arr1); // [ { a: 'a1', b: 'b1', c: [ 'c1' ], d: 'd' } ]
console.log(arr2);
/**
[ { a: 'a1', b: 'b1', c: [ 'c1' ], d: 'd' },
  { a: 'a2', b: 'b1', c: [ 'c2' ], d: 'd' } ]
 */
```

### 5.4 Array.prototype.find
* 将 `item`，`循环序列号`，`当前数组` 作为参数传给回调函数；
* 回调函数的返回值作为条件，只找一个，返回第一个符合条件的 `item` 

**[语法](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find):**
```
var item = arr.find(callback(element[, index[, array]])[, thisArg])
```

**实现：**
```js
/**
 * Array.prototype.find
 * 将 `item`，`循环序列号`，`当前数组` 作为参数传给回调函数；
 * 回调函数的返回值作为条件，只找一个，返回第一个符合条件的 `item` 
 */
Array.prototype._find = function(cb) {
  var arr = this;
  var _this = arguments[1] || window;
  var item = null;
  var i = 0;

  while(i < arr.length && item === null) {
    if (Boolean(cb.call(_this, arr[i], i, arr))) {
      item = arr[i];
    }
    i++;
  }

  return item;
}

// 测试
var arr = [
  { a: 'a1', b: 'b1', c: ['c1'], d: 'd' },
  { a: 'a2', b: 'b1', c: ['c2'], d: 'd' },
  { a: 'a3', b: 'b2', c: ['c2'], d: 'd' },
  { a: 'a4', b: 'b3', c: ['c3'], d: 'd' },
];

var item1 = arr._find(item => item);
var item2 = arr._find(function(item) {
  console.log('this: ', this); // { a: 'aaaa' }
  return item.b === 'b1'
}, { a: 'aaaa' });
var item3 = arr._find(item => item.b === 'b2');
console.log(item1); // { a: 'a1', b: 'b1', c: [ 'c1' ], d: 'd' }
console.log(item2); // { a: 'a1', b: 'b1', c: [ 'c1' ], d: 'd' }
console.log(item3); // { a: 'a3', b: 'b2', c: [ 'c2' ], d: 'd' }
```

### 5.5 Array.prototype.every
* 将 `item`，`循环序列号`，`当前数组` 作为参数传给回调函数；
* 回调函数的返回值作为条件，判断是否所有 `item` 符合；也可以反向用 `Array.some` 找一个不符合的来替代

**[语法](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/every):**
```
var isTrue = arr.every(callback(element[, index[, array]])[, thisArg])
```

**实现：**
```js
/**
 * Array.prototype.every
 * 将 `item`，`循环序列号`，`当前数组` 作为参数传给回调函数；
 * 回调函数的返回值作为条件，判断是否所有 `item` 符合；也可以反向用 `Array.some` 找一个不符合的来替代
 */
Array.prototype._every = function(cb) {
  var arr = this;
  var _this = arguments[1] || window;
  var result = false;
  var i = 0;

  while(i < arr.length) {
    result = Boolean(cb.call(_this, arr[i], i, arr));
    i++;
  }

  return result;
}

// 测试
var arr = [
  { a: 'a1', b: 'b1', c: ['c1'], d: 'd' },
  { a: 'a2', b: 'b1', c: ['c2'], d: 'd' },
  { a: 'a3', b: 'b2', c: ['c2'], d: 'd' },
  { a: 'a4', b: 'b3', c: ['c3'], d: 'd' },
];

var res1 = arr._every(function(item) {
  console.log('this: ', this); // { a: 'aaaa' }
  return item.d === 'd'
}, { a: 'aaaa' });
var res2 = arr._every(item => item.a === 'a');
console.log(res1); // true
console.log(res2); // false
```

### 5.6 Array.prototype.some
* 将 `item`，`循环序列号`，`当前数组` 作为参数传给回调函数；
* 查找符合条件的 `item`，只找一个，返回 `Boolean`

**[语法](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some):**
```
var hasItem = arr.some(callback(element[, index[, array]])[, thisArg])
```

**实现：**
```js
/**
 * Array.prototype.some
 * 将 `item`，`循环序列号`，`当前数组` 作为参数传给回调函数；
 * 查找符合条件的 `item`，只找一个，返回 `Boolean`
 */
Array.prototype._some = function(cb) {
  var arr = this;
  var _this = arguments[1] || window;
  var result = false;
  var i = 0;

  while(i < arr.length && !result) {
    result = Boolean(cb.call(_this, arr[i], i, arr));
    i++;
  }

  return result;
}

// 测试
var arr = [
  { a: 'a1', b: 'b1', c: ['c1'], d: 'd' },
  { a: 'a2', b: 'b1', c: ['c2'], d: 'd' },
  { a: 'a3', b: 'b2', c: ['c2'], d: 'd' },
  { a: 'a4', b: 'b3', c: ['c3'], d: 'd' },
];

var has_a1 = arr._some(function(item) {
  console.log('this: ', this); // { a: 'aaaa' }
  return item.a === 'a1'
}, { a: 'aaaa' });
console.log(has_a1); // true

var has_b = arr._some(item => item.b === 'b');
console.log(has_b); // false

var has_b1 = arr._some(item => item.b === 'b1');
console.log(has_b1); // true
```

### 5.7 Array.prototype.reduce
* 将 `item`，`循环序列号`，`当前数组` 作为参数传给回调函数；
* 累计循环；两个参数，第一个为函数（其中，第一个形参为第二个参数），第二个参数可不传;
* 回调函数的返回值作为下次回调的第二个参数，最终返回回调函数的返回值

**[语法](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce):**
```
var result = arr.reduce(callback(accumulator, currentValue[, index[, array]])[, initialValue])
```

**实现：**
```js
/**
 * Array.prototype.reduce
 * 将 `item`，`循环序列号`，`当前数组` 作为参数传给回调函数；
 * 累计循环；两个参数，第一个为函数（其中，第一个形参为第二个参数），第二个参数可不传;
 * 回调函数的返回值作为下次回调的第二个参数，最终返回回调函数的返回值
 */
Array.prototype._reduce = function() {
  var arr = this;
  var i = 0;
  var cb = arguments[0];  // 第一个参数，回调函数
  var acc = arguments[1] || null; // 第二个参数

  while(i < arr.length) {
    acc = cb(acc, arr[i], i, arr);
    i++;
  }

  return acc;
}

// 求和
var list = [1,2,3,4,5,6,7,8,9];
var result = list._reduce((acc, cur) => acc + cur, 0);
console.log(result); // 45

// 统计某个字符出现的次数
var list2 = ['aa', 'bb', 'jj', 'cc', 'dd', 'aa', 'b1'];
var result2 = list2._reduce((acc, cur) => {
  acc[cur] ? acc[cur]++ : acc[cur] = 1;
  return acc;
}, {});
console.log(result2); // { aa: 2, bb: 1, jj: 1, cc: 1, dd: 1 }
```


## 6、私有属性/公有属性
这个是在又一次面试的时候，面试官问的，挺简单，虽然第一次遇到这么问的

```js
/**
 * 私有属性，公有属性
 */
function fn() {
  // private
  var list = [];

  // public
  this.a = function() {
    console.log('a');
  }

  // public
  this.b = function() {
    console.log('b');
  }
}

const f = new fn();
console.log(f.list); // undefined
f.a(); // a
```


## 7、一些小功能
### 7.1 数组去重
* 简单数组按照 `item` 去重；
* 复杂数组按照 `item[key]` 去重；

```js
/**
 * 数组去重
 * 简单数组按照 `item` 去重；
 * 复杂数组按照 `item[key]` 去重；
 * @param {*} arr 
 * @param {*} key 去重的 key，可选
 */
function uniarr(arr, key) {
  var getType = o => Object.prototype.toString.call(o);
  if (getType(arr) !== '[object Array]') return arr;

  if (key && !arr[0].hasOwnProperty(key)) {
    console.warn(arr, '[item] 不存在key: '+key);
    return [];
  }

  var newArr = [];
  arr.forEach(item => {
    var arrItem = key 
      ? item.hasOwnProperty(key) ? item[key] : item 
      : item;
      
    var hasItem = newArr.some(newitem => {
      return (key ? newitem[key] === arrItem : newitem === arrItem)
    });

    if(!hasItem) newArr.push(item);
  })

  return newArr;
}

var list1 = [1,2,3,4,5,6,1,2,3];
console.log(uniarr(list1)); // [ 1, 2, 3, 4, 5, 6 ]

var list2 = [{id: 1}, {id: 2}, {id: 3}, {id: 2}];
console.log(uniarr(list2, 'id')); 
//[ { id: 1 }, { id: 2 }, { id: 3 } ]

console.log(uniarr(list2, 'id1'));
// [ { id: 1 }, { id: 2 }, { id: 3 }, { id: 2 } ] '[item] 不存在 key: id1'
// []
```

### 7.2 数组扁平化
* 判断 `item` 是否数组，否的话直接 push 到新数组，
* 是的话递归 

```js
/**
 * 数组扁平化
 * 判断 `item` 是否数组，否的话直接 push 到新数组，
 * 是的话递归 
 * @param {*} arr 
 */
function singlearr(arr) {
  var getType = o => Object.prototype.toString.call(o);
  if (getType(arr) !== '[object Array]') return arr;

  var newArr = [];
  arr.forEach(item => {
    getType(item) === '[object Array]'
      ? newArr = newArr.concat(singlearr(item))
      : newArr.push(item)
  })

  return newArr;
}

var list2 = [1,2,[3,4],[5,[6,7]]];
console.log(singlearr(list2));
```

### 7.3 字符串前后去空格
正则去前后空格最简单
```js
/**
 * 字符串前后去空格
 */
String.prototype._trim = function() {
  var str = this;
  return str.replace(/^\s|\s$/g,'');
}

var str = ' st r ';
console.log(str.split('')); // [ ' ', 's', 't', ' ', 'r', ' ' ]
console.log(str._trim().split('')); // [ 's', 't', ' ', 'r' ]
```

### 7.4 获取 URL 参数
* 默认返回 `url` 转化的 `key/value` 对象，
* 有传 `key` 且 `url` 转化的对象有这个 `key` 的时候，直接返回值

```js
/**
 * 获取 URL 参数
 * 默认返回 `url` 转化的 `key/value` 对象，
 * 有传 `key` 且 `url` 转化的对象有这个 `key` 的时候，直接返回值
 * @param {*} url 形如 a=1&b=2
 * @param {*} key 
 */
function urlUtil(url, key) {
  if (typeof url !== 'string') return;
  if (!url.includes('=')) return url;
  
  var obj = {};
  url.split('&').forEach(item => {
    const [key, value] = item.split('=');
    obj[key] = value;
  })

  if (key && obj.hasOwnProperty(key)) {
    return obj[key];
  }

  if (key && !obj.hasOwnProperty(key)) {
    console.warn(`url: ${url} 中不存在 ${key} 字段`);
    return;
  }

  return obj;
}

var url = 1;
console.log(urlUtil(url)); // a

var url1 = 'a=1';
console.log(urlUtil(url1)); // { a: '1' }
console.log(urlUtil(url1, 'a')); // 1
console.log(urlUtil(url1, 'b')); // url: a=1 中不存在 b 字段 undefined

var url2 = 'a=1&b=2';
console.log(urlUtil(url2)); // { a: '1', b: '2' }
console.log(urlUtil(url2, 'a')); // 1
console.log(urlUtil(url2, 'b')); // 2
```

### 7.5 数字/字符串分割
常用的如 数字千分号（3位），银行卡号（4位），身份证号（4位）等

#### 数字千分号
```js
/**
 * 数字千分号
 * @param {*} num 
 */
function numThousand(num) {
  if (typeof (num-0) !== 'number') return num;
  if (num.length < 4) return num;

  // 正则
  // var newNum = (num+'').replace(
  //   /(\d)(?=(?:\d{3})+$)/g, 
  //   '$1,'
  // );

  // 函数
  var newNum = (num+'').split('');
  var arr = [];
  do {
    // 从后面开始分割
    var start = newNum.length > 3 ? newNum.length - 3 : 0;
    arr.push(newNum.splice(start, newNum.length).join(''));
  } while(newNum.length > 0)

  newNum = arr.reverse().join(',');
  delete arr;

  return newNum;
}

var num1 = 1234567;
console.log(numThousand(num1)); // 1,234,567

var num2 = 123;
console.log(numThousand(num2)); // 123

var num3 = '123';
console.log(numThousand(num3)); // 123

var num4 = '12345';
console.log(numThousand(num4)); // 12,345

var card = '62564749929292';
// 62,564,749,929,292
console.log(numThousand(card)); 
```

#### 字符按长度分割

```js
/**
 * 字符按长度分割
 * @param {*} num 数字
 * @param {*} len 分割的长度，默认三位
 * @param {*} sep 分隔符 默认 ','
 */
function stringSeparate(str, {len = 3, sep = ','} = {}) {
  if (typeof (str+'') !== 'string') return str;
  if (str.length < 4) return str;

  var newStr = (str+'').split('');
  var arr = []
  do {
    arr.push(newStr.splice(0, len).join(''));
  } while(newStr.length > 0)

  newStr = arr.join(sep);
  delete arr;

  return newStr;
}

var num1 = 1234567;
console.log(stringSeparate(num1)); // 123,456,7

var num2 = 123;
console.log(stringSeparate(num2)); // 123

var num3 = '123';
console.log(stringSeparate(num3)); // 123

var num4 = '12345';
console.log(stringSeparate(num4)); // 123,45

var card = '6217123456789012345';
// 6217 1234 5678 9012 345
console.log(stringSeparate(card, {len: 4, sep: ' '})); 
```


## 8、排序算法
暂时就搞两个～

### 8.1 冒泡排序
一个一个对比，互换位置
```js
/**
 * 冒泡排序
 * @param {*} arr 
 */
function BubbleSort(arr){
  const getType = o => Object.prototype.toString.call(o);
  if (getType(arr) !== '[object Array]') return arr;

  for (var i=0; i<arr.length; i++) {
    for (var j=i+1; j<arr.length; j++) {
      var temp = '';
      if (arr[i] > arr[j]) {
        temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
      }
    }
  }

  return arr;
}

var arr = [1,3,4,12,34,5,22,8];
console.log(arr.sort()); // [ 1, 3, 4, 5, 8, 12, 22, 34 ]
console.log(BubbleSort(arr)); // [ 1, 3, 4, 5, 8, 12, 22, 34 ]
```

### 8.2 快速排序
* 取一个参考值，然后将剩下的分为两份，一份大于参考值的 `left: []`，一份小于参考值 `right: []`
* 然后分别递归 `left/right`, 返回一个 `left+mid+right` 组成的数组

```js
/**
 * 快速排序 
 * 取一个参考值，然后将剩下的分为两份，一份大于参考值的 `left: []`，一份小于参考值 `right: []`
 * 然后分别递归 `left/right`, 返回一个 `left+mid+right` 组成的数组
 * @param {*} arr 排序的数组
 * @param {*} key 一级 key 
 */
function FastSort(arr, key) {
  const getType = o => Object.prototype.toString.call(o);
  if (getType(arr) !== '[object Array]') return arr;
  if (arr.length <= 1) return arr;

  if (key && !arr[0].hasOwnProperty(key)) {
    console.warn(arr, '[item] 不存在key: '+key);
    return [];
  }
  if (!key && getType(arr[0]) === '[object Object]') {
    console.warn('传一个 key 作为排序字段');
    return [];
  }

  var mid = arr.shift();
  var left = [];
  var right = [];

  arr.forEach(item => {
    var arrItem = key 
      ? item.hasOwnProperty(key) ? item[key] : item
      : item;
    
    var midItem = key
      ? item.hasOwnProperty(key) ? mid[key] : mid
      : mid;

      arrItem <= midItem ? left.push(item) : right.push(item);
  });

  return FastSort(left, key).concat(mid).concat(FastSort(right, key));
}

var arr = [1,3,4,12,34,654,89,1,66,12,23,45,10,230,342,980];
// [ 1, 1, 3, 4, 10, 12, 12, 23, 34, 45, 66, 89, 230, 342, 654, 980 ]
console.log(FastSort(arr));

var arr1 = [{num: 10}, {num: 26}, {num: 8}, {num: 36}];
// 传一个 key 作为排序字段, []
console.log(FastSort(arr1));

// [ { num: 8 }, { num: 10 }, { num: 26 }, { num: 36 } ]
console.log(FastSort(arr1, 'num'));
```


## 9、发布订阅模式
可以看 [这里](/js/evt.html)


## 10、斐波那契数列
理解概念之后还是很好写的

```js
/**
 * 求斐波那契数列
 * n<=2时为1，从3开始，每个数等于前两个之和
 * @param {*} n 
 */
function fb2(n) {
  const arr = [];
  for (var i = 0; i <= n; i++) {
    arr.push(
      i <= 2 ? 1 : arr[i - 1] + arr[i - 2]
    )
  }
  return arr;
}

console.log(fb2(15));
// [ 1, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610 ]
```

## 11、动态规划
### 11.1 硬币问题
思路：
1. 先求最大数的倍数 
2. 其中两个的组合（大数优先）
3. 三个的组合

![预览图](https://s1.ax1x.com/2020/06/20/NlKYz8.png)

```js
/**
 * 动态规划
 * 1块，4块，5块，求总数N块的最小硬笔数
 * 思路：1、先求最大数的倍数 2、其中两个的组合（大数优先） 3、三个的组合
 */
function getCoinNum(N) {
  let n1 = 1;
  let n2 = 4;
  let n3 = 5;

  // 输出结果组合、最少数量，如：12: { result: '5*2,4*0,2*1', minCount: 4 }
  const getResult = (result, minCount) => ({ result, minCount });

  if (N < n2) return getResult(`${n1}*${N}`, N / n1);
  if (N === n1) return getResult(`${n1}*1`, 1);
  if (N === n2) return getResult(`${n2}*1`, 1);
  if (N%n3 === 0) return getResult(`${n3}*${N/n3}`, N/n3);

  for (var j = 0; j < N/n2; j++) {
    for (var k = 0; k < N/n3; k++) {
      if (N === n3 * k + n2 * j) return getResult(`${n3}*${k},${n2}*${j}`, j + k);
      if (N === n2 * j) return getResult(`${n2}*${j}`, j);

      // N - n3*k - n2*j) 结果小于 4，则剩下的由 1 组成
      if ((N - n3 * k - n2 * j) > 0 && (N - n3 * k - n2 * j) < n2) {
        return getResult(
          `${n3}*${k},${n2}*${j},${(N - n3 * k - n2 * j)}*1`,
          j + k + (N - n3 * k - n2 * j)
        );
      }
    }
  }
}

// for (var i=0; i<=50; i++) console.log(`${i}: `, getCoinNum(i));
/**
 * 打印：
 * 0:  { result: '1*0', minCount: 0 }
1:  { result: '1*1', minCount: 1 }
2:  { result: '1*2', minCount: 2 }
3:  { result: '1*3', minCount: 3 }
4:  { result: '4*1', minCount: 1 }
5:  { result: '5*1', minCount: 1 }
6:  { result: '5*1,4*0,1*1', minCount: 2 }
7:  { result: '5*1,4*0,2*1', minCount: 3 }
8:  { result: '5*1,4*0,3*1', minCount: 4 }
9:  { result: '5*1,4*1', minCount: 2 }
10:  { result: '5*2', minCount: 2 }
11:  { result: '5*2,4*0,1*1', minCount: 3 }
12:  { result: '5*2,4*0,2*1', minCount: 4 }
13:  { result: '5*2,4*0,3*1', minCount: 5 }
14:  { result: '5*2,4*1', minCount: 3 }
15:  { result: '5*3', minCount: 3 }
16:  { result: '5*3,4*0,1*1', minCount: 4 }
17:  { result: '5*3,4*0,2*1', minCount: 5 }
18:  { result: '5*3,4*0,3*1', minCount: 6 }
19:  { result: '5*3,4*1', minCount: 4 }
20:  { result: '5*4', minCount: 4 }
21:  { result: '5*4,4*0,1*1', minCount: 5 }
22:  { result: '5*4,4*0,2*1', minCount: 6 }
23:  { result: '5*4,4*0,3*1', minCount: 7 }
24:  { result: '5*4,4*1', minCount: 5 }
25:  { result: '5*5', minCount: 5 }
26:  { result: '5*5,4*0,1*1', minCount: 6 }
27:  { result: '5*5,4*0,2*1', minCount: 7 }
28:  { result: '5*5,4*0,3*1', minCount: 8 }
29:  { result: '5*5,4*1', minCount: 6 }
30:  { result: '5*6', minCount: 6 }
31:  { result: '5*6,4*0,1*1', minCount: 7 }
32:  { result: '5*6,4*0,2*1', minCount: 8 }
33:  { result: '5*6,4*0,3*1', minCount: 9 }
34:  { result: '5*6,4*1', minCount: 7 }
35:  { result: '5*7', minCount: 7 }
36:  { result: '5*7,4*0,1*1', minCount: 8 }
37:  { result: '5*7,4*0,2*1', minCount: 9 }
38:  { result: '5*7,4*0,3*1', minCount: 10 }
39:  { result: '5*7,4*1', minCount: 8 }
40:  { result: '5*8', minCount: 8 }
41:  { result: '5*8,4*0,1*1', minCount: 9 }
42:  { result: '5*8,4*0,2*1', minCount: 10 }
43:  { result: '5*8,4*0,3*1', minCount: 11 }
44:  { result: '5*8,4*1', minCount: 9 }
45:  { result: '5*9', minCount: 9 }
46:  { result: '5*9,4*0,1*1', minCount: 10 }
47:  { result: '5*9,4*0,2*1', minCount: 11 }
48:  { result: '5*9,4*0,3*1', minCount: 12 }
49:  { result: '5*9,4*1', minCount: 10 }
50:  { result: '5*10', minCount: 10 }
 */
```