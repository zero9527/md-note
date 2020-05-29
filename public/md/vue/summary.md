# vue使用总结

## 前言
> webpack和项目的一些配置另外总结

## 1、路由：懒加载、守卫、切换效果
> 描述

* #### 拆分
  > dfgdfg
  * src/router.js
  * src/routes

* #### 懒加载
```js
{
  path: '/component',
  component: () => import('./component.vue')
}
```
* #### 路由守卫
  > **全局、组件内**
  * beforeRouteEnter
  * beforeRouteLeave


* #### 路由切换效果
  > 描述
  * leave/enter

## 2、api接口、axios拦截器interceptors
> 描述

* #### api 拆分
* #### axios请求拦截 request、响应拦截 resopnse


## 3、组件通信、 v-model、数据传递
> 描述

* #### props
* #### provide/inject
  > 描述
  * provide向后代组件传数据
  * 后代组件inject接收

* #### $emit/@
  > 注意：需要先监听(on)，后触发($emit)(event-bus)，以下父子组件就满足条件了
  * 子组件$emit触发事件
  * 父组件@监听事件

* #### model/v-model
* #### event-bus

* #### vuex/数据持久化
  > 描述
  * 插件 vuex-persistedstate
  * 自己写：这里主要参考了这位大佬[Jrain](https://juejin.im/user/55fa7cd460b2e36621f07dde)

* 等等


## 4、作用于插槽 slot-scoped、v-slot
> 描述

* #### 作用域穿透


## 5、自定义指令
> 描述

* #### v-loading 加载
* #### v-ripple 点击波纹
* #### v-clickoutside 点击外部
* 等等


## 6、mixins混入

## 7、生命周期、定时器、事件监听
> 描述

* #### 生命周期、hooks
  > 描述
  * init
  * beforeCreate
  * ...

* #### 事件监听/移除
  > 描述
  * addEventListener/removeEventListener

* #### 定时器添加、清除
  > 描述
  * setTimeout/clearTimeout
    * sd
  * setInterval/clearInterval
    * sd

## 8、抽象组件 abstract
> 不渲染


## 9、国际化 vue i18n
> 描述

* #### locale
* #### message


## 10、第三方库的初始化
在data()钩子return之前初始化，或者依赖父组件的数据props传递的，可以先初始化再渲染数据

## 11、其他
vue-cli3、webpack可以[看这里]()