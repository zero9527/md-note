# 懒加载或滚动动画的一种写法

## 前言
Vue和React版本其实区别不大，，，主要使用原生js就能实现，性能上就没考虑太多（可以在完成需求后，移除进入视区后的元素的类名，如：slide-item，lazy-img等）

纯属自己乱搞，不足之处轻喷啊，，，

## 一、滚动动画：Vue版本
###  给 HTML 元素添加 class
```html
<div class="slide-item">需要根据滚动条位置显示的元素</div>
<div class="slide-item slide-delay" data-delay="200">有延迟的元素</div>
```

### css和动画
```css
.slide-item { opacity: 0; }
.slide-up,
.slide-up-200,
.slide-up-400,
.slide-up-600,
.slide-up-800 {
    animation: slide-up .5s forwards;
}
.slide-up-200 { animation-delay: .2s; }
.slide-up-400 { animation-delay: .4s;}
.slide-up-600 { animation-delay: .6s;}
.slide-up-800 { animation-delay: .8s; }

@keyframes slide-up {
    from { opacity: 0; transform: translateY(50%); }
    to { opacity: 1; transform: translateY(0); }
}
```

### 监听滚动
```js
mounted() {
  window.addEventListener("scroll", this.onScroll);
},
beforeDestroy() {
  window.removeEventListener("scroll", this.onScroll);
},
```

### 滚动方法
```js
  // 监听滚动
  onScroll() {
    const slideItems = document.querySelectorAll('.slide-item');
    // 上滑
    slideItems.forEach(item => {
      let itemBCR = item.getBoundingClientRect();
      // 进入视区或在视区之上
      if (itemBCR.top <= window.innerHeight + 10) {
        if (Array.from(item.classList).includes('slide-delay')) {
          item.classList.add(`slide-up-${item.dataset.delay}`);
        } else {
          item.classList.add('slide-up');
        }
        // 可以在这里 remove 掉 slide-item 这个类名，优化性能
        
      } else {
        // 这里主要用来多次显示效果的，上面 remove 掉 slide-item 后将不再起作用
        if (Array.from(item.classList).includes('slide-delay')) {
          item.classList.remove(`slide-up-${item.dataset.delay}`);
        } else {
          item.classList.remove('slide-up');
        }
      }
    })
  },
```


## 二、滚动动画：React版本
主要使用hooks

### 给 HTML 元素添加 class
```html
<span className={`slide-item`}>需要根据滚动条位置显示的元素</span>
<span className={`slide-item slide-delay`} data-delay="200">有延迟的元素</span>
```

### css和动画
```css
.slide-item { opacity: 0; }
.slide-up,
.slide-up-200,
.slide-up-400,
.slide-up-600,
.slide-up-800 {
    animation: slide-up .5s forwards;
}
.slide-up-200 { animation-delay: .2s; }
.slide-up-400 { animation-delay: .4s;}
.slide-up-600 { animation-delay: .6s;}
.slide-up-800 { animation-delay: .8s; }

@keyframes slide-up {
    from { opacity: 0; transform: translateY(50%); }
    to { opacity: 1; transform: translateY(0); }
}
```

### 监听滚动
```js
  useEffect(() => {
    onScroll();
    window.addEventListener('scroll', onScroll);

    return () => {
      window.removeEventListener('scroll', onScroll);
    }
  }, []);
```

### 滚动方法
```js
  // 监听滚动
  function onScroll(): void {
    const slideItems = document.querySelectorAll('.slide-item');
    
    slideItems.forEach((item: any) => {
      let slideBCR = item.getBoundingClientRect();
      // 进入视区或在视区之上
      if (slideBCR.top <= window.innerHeight + 10) {
        if (Array.from(item.classList).includes('slide-delay')) { // 延迟
          item.classList.add(`slide-up-${item.dataset.delay}`);
        } else {
          item.classList.add('slide-up');
        }
        // 可以在这里 remove 掉 slide-item 这个类名，优化性能

      } else {
        // 这里主要用来多次显示效果的，上面 remove 掉 slide-item 后将不再起作用
        if (Array.from(item.classList).includes('slide-delay')) { // 延迟
          item.classList.remove(`slide-up-${item.dataset.delay}`);
        } else {
          item.classList.remove('slide-up');
        }
      }
    })
  }
```


## 三、图片懒加载
> 同上，也是根据元素是否进入视区，通过 `let slideBCR = item.getBoundingClientRect();` 这个方法可以获取到元素相对视区的位置，当 `slideBCR.top < window.innerHtight` 的时候，元素就进入视区或者在视区之上了；

> 使用图片预先设置好的 `data-src` 存放真实图片地址，等差不多到视区的位置时（比如提前一屏或半屏）就替换 `src` 为真实图片

### 给 HTML 元素添加 class和真实图片地址
```html
<img className="lazy-img" src="./loading.png" data-src="./real.png" alt="loading" />
```

### 监听滚动
```js
  useEffect(() => {
    onScroll();
    window.addEventListener('scroll', onScroll);

    return () => {
      window.removeEventListener('scroll', onScroll);
    }
  }, []);
```

### 滚动方法
```js
  // 监听滚动
  function onScroll(): void {
    const lazyImgs = document.querySelectorAll('.lazy-img');
    
    lazyImgs.forEach((item: any) => {
      let imgBCR = item.getBoundingClientRect();
      
      // 实际上这里不需要等到进入视区才加载，可以提前一些
      if (imgBCR.top <= window.innerHeight) {
        // 延时为了查看效果，实际上不需要
        setTimeout(() => {
          item.setAttribute('src', item.dataset.src);
          item.classList.remove('lazy-img');
        }, 500);
      }
    })
  }
```


## 最后
前几天，看了一位大佬分析淘宝“切片渲染”的文章，我想，通过这种滚动的监听，判断元素与视区的距离，然后再渲染也是可以达到 **简单** 的优化渲染性能的目的。。。

> 另外，长列表虚拟滚动，貌似也可以这样搞，下次玩一下