# 原生js手写实现promise

## 用原生js手写实现promise，看了网上很多实现，最终写出自己的简易版promise，记录一下

> 前言：使用及调用同原生Promise方法，只实现了then(resolve),catch(reject),finally()三个方法，不涉及Promise.race(),Promise.all();

## 构造函数
```js
let that; // 存储 mPromise
/**
 * 因为每次 new mPromise(then, catch的时候都需要链式调用)会调用 mPromise(constructor)，
 * 所以放到外面
 */
// 状态、参数配置
let config = {
  status: null,
  resolveParam: null,
  rejectParam: null
};

/**
 * mPromise函数：原生Promise的手动实现
 * @param {new mPromise时传入的回调函数} callback
 */
function mPromise(callback) {
  that = this;
  // 往new mPromise时传入的回调函数，传回两个参数
  callback(that.resolve, that.reject);
}
```

## 原型
```js
mPromise.prototype = {
  constructor: mPromise,
  resolve(param) {
    config.rejectParam = null; // 重置 reject 参数
    config.resolveParam = param;
    config.status = 'PENDING';
  },
  reject(param) {
    config.resolveParam = null; // 重置 resolve 参数
    config.rejectParam = param;
    config.status = 'PENDING';
  },
  then(_fn) {
    // 有resolve才调用
    if (config.resolveParam !== null) {
      config.status = 'RESOLVED';
      // 运行 then 的回调，捕获其中的报错，调用 catch
      try {
        _fn(config.resolveParam);
      } catch (err) {
        config.rejectParam = err;
        that.catch(() => {});
      }
    }
    return new mPromise(() => {});
  },
  catch(_fn) {
    // 有reject才调用
    if (config.rejectParam !== null) {
      config.status = 'REJECTED';
      _fn(config.rejectParam);
    }
    return new mPromise(() => {});
  },
  finally(_fn) {
    // 初始化配置
    config = {
      status: null,
      resolveParam: null,
      rejectParam: null
    };
    _fn();
  }
};
```

## 使用方式同原生Promise

```js
let f1 = function(num) {
  return new mPromise((resolve, reject) => {
    if (num < 10) resolve(num);
    else if (num === 11) reject(num);
  });
};
```

## 调用
```js
f1(6)
  .then(res => {
    // cc; 打开的话，会被 try catch捕获，触发catch，而不会往下走
    console.log('then: ', res); // then 6
  })
  .catch(err => {
    // 这里会捕获 then 里面的报错
    console.log('catch: ', err); // ReferenceError: cc is not defined
  });

f1(11)
  .then(res => {
    console.log('then: ', res);
  })
  .catch(err => {
    console.log('catch: ', err); // catch 11
  })
  .finally(() => {
    console.log('11 finally\n'); // 11 finally
  });

f1(12)
  .then(res => {
    console.log('then: ', res);
  })
  .catch(err => {
    console.log('catch: ', err);
  })
  .finally(() => {
    console.log('12 finally\n'); // 12 finally
  });
```

## 结果
> then里面不报错：

![](../../images/js-promise-1.png)

> then里面有报错：

![](../../images/js-promise-2.png)

到此，结束！
