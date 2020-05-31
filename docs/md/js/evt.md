# 玩玩JS设计模式之：发布/订阅

## 前言
Node.js的 [events](http://nodejs.cn/api/events.html#events_events) 模块功能强大，除了常规的监听、触发，还支持事件顺序（prependListener），本文只是写着玩玩，真正要用的话，还是选择成熟稳定的东西较好！

> **内容概览**：
以下订阅=监听、发布=触发；一般来说，**先订阅事件**，**再发布事件**；就像打电话一样，电话没拨通（订阅），你就开始说话要干嘛干嘛（发布），这时候订阅是无效的！！！因为触发在前、监听在后，触发的时候没有监听，监听的时候已经结束，**二者不在一个频道！！！** 沟通就是无效的。。。

四个功能：
* 订阅on
* 订阅once（一次性
* 发布emit
* 注销off
* 错误监听error

## 构造函数

```js
// 发布订阅，回调函数版本
function EvtEmit() {
  // 事件参数队列
  this.evtList = [];
}
```

## 原型

```js
EvtEmit.prototype = {
  constructor: EvtEmit,
  // 订阅事件（监听）
  on(emitName, handler) {
    // console.debug(`EvtEmit -- on: ${emitName}`);
    if (!emitName) return;
    if (!this.evtList.some(evt => evt.emitName === emitName)) {
      this.evtList.push({
        emitName, // 事件名称
        handler,
        once: emitName === 'error' ? true : false
      });
    }
  },
  // 订阅事件（一次性
  once(emitName, handler) {
    if (!emitName) return;
    if (!this.evtList.some(evt => evt.emitName === emitName)) {
      this.evtList.push({
        emitName, // 事件名称
        handler,
        once: true
      });
    }
  },
  // 发布事件（触发）
  emit(emitName, ...param) {
    // console.debug(`EvtEmit -- emit: ${emitName}`);
    if (!emitName) return;
    let evtThis = this.evtList.find(evt => evt.emitName === emitName);
    if (!evtThis) {
      if (emitName !== 'error') {
        console.warn(`请先使用监听on('${emitName}', callback)，再emit('${emitName}')！`);
      }
      return;
    }
    // 一次性订阅
    if (evtThis.once) this.off(emitName);

    // 监听[emitName]回调的错误
    try {
      evtThis.handler(...param);
    }
    catch (err) {
      // 不使用 on('error', callback)监听时，打印错误
      if (!this.evtList.some(evt => evt.emitName === 'error')) {
        console.error(`on('${emitName}', callback) -> callback Error: ${err}`);
      }

      // 错误触发，可以使用 on('error', callback)监听
      this.emit('error', {
        emitName,
        err
      });
    }
  },
  // 注销事件订阅
  off(emitName, callback = null) {
    let arr = this.evtList.filter(evt => evt.emitName !== emitName);
    this.evtList = arr;
    arr = null;
    if (callback) {
      callback.call(this, emitName);
    }
  }
};

```

## 使用
同正常的发布订阅一样，先订阅(on)再发布(emit)；

```js
const evt = new EvtEmit();

// 监听'run'事件
// 执行1次on监听，10次回调函数
evt.on('run', res => {
  console.log('res: ', res);
  // 注销监听，以下 emit 之后将不再触发 on；注释之后将无限调用
  if (--res < 1) {
    evt.off('run', emitName => {
      console.log(`on('${emitName}')已注销！`);
    });
    return;
  }

  evt.emit('run', res);
});

evt.emit('run', 10);

```

### 输出
![](../static/images/js-evt-1.png)

### 错误监听
`try/catch`执行监听的回调函数，捕获错误然后触发`emit('error', err)`，通过`on('error', callback)`监听错误；
> **为什么需要 try/catch?**<br>
不使用try/catch捕获错误的话，一旦发生错误，进程就挂了，这时，后续不需要依赖你这次操作结果的 程序就会跑不下去了！！！（如下 打印 'after go'，如果没有try/catch，那么他就不会被打印）;
<br>这在服务端用的比较多，想象一下，一个接口因为某次调用的参数不合法或者其他因素，导致程序中断而影响到后续使用，可能产生‘事故’！

### try/catch 包裹回调函数的执行
```js
// 发布事件（触发）
  emit(emitName, ...param) {
    // console.debug(`EvtEmit -- emit: ${emitName}`);
    if (!emitName) return;
    let evtThis = this.evtList.find(evt => evt.emitName === emitName);
    if (!evtThis) {
      if (emitName !== 'error') {
        console.warn(`请先使用监听on('${emitName}', callback)，再emit('${emitName}')！`);
      }
      return;
    }
    // 一次性订阅
    if (evtThis.once) this.off(emitName);

    // 监听[emitName]回调的错误
    try {
      evtThis.handler(...param);
    }
    catch (err) {
      // 不使用 on('error', callback)监听时，打印错误
      if (!this.evtList.some(evt => evt.emitName === 'error')) {
        console.error(`on('${emitName}', callback) -> callback Error: ${err}`);
      }

      // 错误触发，可以使用 on('error', callback)监听
      this.emit('error', {
        emitName,
        err
      });
    }
  },
```

### 错误捕获：
```js
evt.on('error', ({ emitName, err }) => {
  console.error(`on('${emitName}', callback) -> callback Error: ${err}`);
})

evt.on('go', res => {
  err; // 错误会被 try/catch 捕获
  console.log('res: ', res);
});

evt.emit('go', 'go');
console.log('after go'); // 没有 try/catch 的话，不会执行
```

### 全部代码 EvtEmit_callback.js
```js
// EvtEmit_callback.js
// 发布订阅，回调函数版本
function EvtEmit() {
  // 事件参数队列
  this.evtList = [];
}
EvtEmit.prototype = {
  constructor: EvtEmit,
  // 订阅事件（监听）
  on(emitName, handler) {
    // console.debug(`EvtEmit -- on: ${emitName}`);
    if (!emitName) return;
    if (!this.evtList.some(evt => evt.emitName === emitName)) {
      this.evtList.push({
        emitName, // 事件名称
        handler,
        once: emitName === 'error' ? true : false
      });
    }
  },
  // 订阅事件（一次性
  once(emitName, handler) {
    if (!emitName) return;
    if (!this.evtList.some(evt => evt.emitName === emitName)) {
      this.evtList.push({
        emitName, // 事件名称
        handler,
        once: true
      });
    }
  },
  // 发布事件（触发）
  emit(emitName, ...param) {
    // console.debug(`EvtEmit -- emit: ${emitName}`);
    if (!emitName) return;
    let evtThis = this.evtList.find(evt => evt.emitName === emitName);
    if (!evtThis) {
      if (emitName !== 'error') {
        console.warn(`请先使用监听on('${emitName}', callback)，再emit('${emitName}')！`);
      }
      return;
    }
    // 一次性订阅
    if (evtThis.once) this.off(emitName);

    // 监听[emitName]回调的错误
    try {
      evtThis.handler(...param);
    }
    catch (err) {
      // 不使用 on('error', callback)监听时，打印错误
      if (!this.evtList.some(evt => evt.emitName === 'error')) {
        console.error(`on('${emitName}', callback) -> callback Error: ${err}`);
      }

      // 错误触发，可以使用 on('error', callback)监听
      this.emit('error', {
        emitName,
        err
      });
    }
  },
  // 注销事件订阅
  off(emitName, callback = null) {
    let arr = this.evtList.filter(evt => evt.emitName !== emitName);
    this.evtList = arr;
    arr = null;
    if (callback) {
      callback.call(this, emitName);
    }
  }
};

const evt = new EvtEmit();

// 执行1次on监听，10次回调函数
evt.on('run', res => {
  console.log('res: ', res);
  // 注销监听，以下 emit 之后将不再触发 on；注释之后将无限调用
  if (--res < 1) {
    evt.off('run', emitName => {
      console.log(`on('${emitName}')已注销！`);
    });
    return;
  }

  evt.emit('run', res);
});

evt.emit('run', 10);


// evt.on('error', ({ emitName, err }) => {
//   console.error(`on('${emitName}', callback) -> callback Error: ${err}`);
// })

// evt.on('go', res => {
//   err; // 错误会被 try/catch 捕获
//   console.log('res: ', res);
// });

// evt.emit('go', 'go');
// console.log('after go'); // 没有 try/catch 的话，不会执行

```

## 参考
1. [js设计模式之发布/订阅模式模式](https://www.cnblogs.com/leaf930814/p/9014200.html)
2. [events（事件触发器）](http://nodejs.cn/api/events.html#events_events)