# vue-cli3 配置 single-spa

## 前言
其实方便点可以使用 [qiankun](https://qiankun.umijs.org/zh/) 的微前端方案


## 流程
### 主应用流程
- 启动由 `system.js` 接管，配置 `webpack` 下 `out.libraryTarget` 为 `system`

- `html` 入口中通过 `importmap`，设置当前应用、子应用 `名称+地址`

- 一般用法（`DOM` 节点一直存在的情况下）：`registerApplication` 注册子应用，通过 `system.js` 引入，设置渲染路由 `activeWhen`，传递给子应用的参数 `customProps`

- 使用 `Parcel` 用法（`DOM` 节点**不是**一直存在的情况下）：主应用也需要包裹 `singleSpaVue`/`singleSpaReact`等，然后 `registerApplication` 自己，在某个组件（A）内使用由 `main.js/ts` 在 `bootstraps`/`mount` 时导出的 `mountParcel`，在某组件（A）挂载后，手动将子应用（当做组件用）挂载到这个组件的某个 `DOM` 节点（**见1.3**）

### 子应用流程(Vue)
- 启动方式由 `single-spa-vue` 接管，可以判断 `window.singleSpaNavigate` 为 `false` 单独启动

- 配置在主应用的挂载点，`appOptions` 下的 `el` 设置，默认挂载到 `body` 下

- 导出一些生命周期事件，至少如下三个：`bootstrap`/`mount`/`unmount`，可以在 `mount` 下接收主应用传递的参数

- 异步组件需要使用：（不然主应用使用子应用会报错）
  1. `systemjs-webpack-interop` 设置 `setPublicPath`；
  2. `webpack` 配置：`config.output.jsonpFunction = 'wpJsonpFlightsWidget';`


## 1、主项目的配置
- 例子1：Vue: [json-util](//github.com/zero9527/json-util)，路由 `/sub-app`
- 例子2：React: [md-note](//github.com/zero9527/md-note)

### 1.1 下载依赖 

下载 `single-spa`

```shell
yarn add single-spa
```

### 1.2 配置
#### 在 `HTML` 入口 
`system.js` 的包最后下载下来放项目里，防止引用的 `cdn` 有时候抽风

> `systemjs-importmap` 也可以通过配置文件自动生成，这样也好区分开发环境跟生成环境不同的入口，注意打包后子应用的入口的跨域问题

- 使用 `webpack` 自动插入 `HTML`

```js
// systemJs-Importmap.js
const isEnvDev = process.env.NODE_ENV === 'development';

// systemjs-importmap 的配置，通过webpack给html用
module.exports = [
  {
    name: 'root-config',
    entry: './js/app.js',
  },
  {
    name: '@vue-mf/calendar',
    entry: isEnvDev
      ? '//localhost:2333/js/app.js'
      : 'https://zero9527.github.io/vue-calendar/js/app.js', // 子应用的 hash
  },
];

// vue.config.js
chainWebpack: config => {
  config.plugin('html').tap(args => {
    const importMap = { imports: {} };
    systemJsImportmap.forEach(item => (importMap.imports[item.name] = item.entry));
    args[0].systemJsImportmap = JSON.stringify(importMap, null, 2);
    return args;
  });
},

// public\index.html
<meta name="importmap-type" content="systemjs-importmap" />
<script type="systemjs-importmap">
  <%= htmlWebpackPlugin.options.systemJsImportmap %>
</script>
<script src="./libs/systemjs/system.min.js"></script>
<script src="./libs/systemjs/extras/amd.min.js"></script>
<script src="./libs/systemjs/extras/named-exports.min.js"></script>
<script src="./libs/systemjs/extras/named-register.min.js"></script>
<script src="./libs/systemjs/extras/use-default.min.js"></script>
<script>
  System.import('root-config');
</script>
```

- 在 `public/index.html` 下手动添加

```html
<meta name="importmap-type" content="systemjs-importmap" />
<script type="systemjs-importmap">
  {
    "imports": {
      "root-config": "//localhost:666/js/app.js",
      "@vue-mf/calendar": "//localhost:2333/js/app.js"
    }
  }
</script>
<script src="./libs/systemjs/system.min.js"></script>
<script src="./libs/systemjs/extras/amd.min.js"></script>
<script src="./libs/systemjs/extras/named-exports.min.js"></script>
<script src="./libs/systemjs/extras/named-register.min.js"></script>
<script src="./libs/systemjs/extras/use-default.min.js"></script>
<script>
  System.import('root-config');
</script>
```

- 里面的东西是一个 `JSON`，注意格式！

这里配置当前应用的配置 `名称：地址`，与子应用的 `名称：地址`

```html
<script type="systemjs-importmap">
  {
    "imports": {
      "root-config": "//localhost:666/js/app.js",
      "@vue-mf/calendar": "//localhost:2333/js/app.js"
    }
  }
</script>
```

- 子应用名称 `@vue-mf/calendar`，在 `registerApplication` 时，对应 `app: ` `import('@vue-mf/calendar')` 的名称，如

```js
registerApplication({
  name: '@vue-mf/calendar',
  app: () => (window as any).System.import('@vue-mf/calendar'),
  activeWhen: '',
  customProps: {
    root: 'json-util',
  },
});
```

#### 系统启动由 `systemJS` 接管
- html

```html
<script>
  System.import('root-config');
</script>
```

- 对应的 `webpack` 配置

去掉文件 `hash`，方便引入文件名
```js
// vue.config.js
module.exports = {
  outputDir: 'docs',
  publicPath: './',
  filenameHashing: false,
  productionSourceMap: false,
  configureWebpack: config => {
    config.output.libraryTarget = 'system';

    config.devServer = {
      port: 666,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      disableHostCheck: true,
      historyApiFallback: true,
    };
  },
};
```

#### 注册子应用
- single-spa.config.js

```js
// src\single-spa-config.ts
import { registerApplication, start } from 'single-spa';

registerApplication({
  name: '@vue-mf/calendar',
  app: () => (window as any).System.import('@vue-mf/calendar'),
  activeWhen: '',
  customProps: {
    root: 'json-util',
  },
});

start();
```

- 在 `main.ts` 中引入

其实在哪引入都可以，确保 `DOM` 节点存在就可以，如果时动态创建的，首次加载可以，但是恢复状态后，会提示找不到 `DOM` 节点

```js
// src\main.ts
import './single-spa-config';
```

### 1.3 Parcel 配置
[官方文档](https://single-spa.js.org/docs/parcels-overview/)

> 翻译过来叫：包裹，可以在主应用将一个子应用当做组件，手动挂载、卸载使用，不限框架，`webpack 5` 有一个 `Module Federation` 也是可以跨项目使用组件的

#### 什么时候用
把子应用当做一个组件使用，放在主应用的某个组件（A）下面时，`DOM` 节点不是一直存在的情况

- 主应用：使用 `singleSpaVue`/`singleSpaReact` 包裹，然后 `registerApplication` 自己，在某个组件（A）内使用由 `main.js/ts` 在 `bootstraps`/`mount` 时导出的 `mountParcel` ，在某组件（A）挂载后，手动将子应用（当做组件用）挂载到这个组件的某个 `DOM` 节点

- 子应用：不需要在主应用 `registerAppliaction` 注册，而是手动在某个组件（A）内手动挂载到某个 `DOM` 节点

#### 主应用改造

```js
// src\main.ts
//...

// **************** 主应用一般写法 ****************
// // 子应用 registerAppliaction 注册
// new Vue({
//   router,
//   render: (h: any) => h(App),
// }).$mount('#json-util');

// **************** 主应用使用 Parcel 写法 ****************
// 主应用使用 Parcel 挂载子应用（某组件下）的时候的写法
// 需要把当前应用当做子应用，然后 registerAppliaction 调用
const singleSpa = singleSpaVue({
  Vue,
  appOptions: {
    el: '#json-util',
    render: (h: any) => h(App),
    router,
  },
});

// eslint-disable-next-line
export let mountParcel: any;

export const bootstrap = (props: any) => {
  mountParcel = props.mountParcel;
  return singleSpa.bootstrap(props);
};

export const { mount, unmount } = singleSpa;
```

#### 注册子组件
```js
import { registerApplication, start } from 'single-spa';

// 改为 Parcel 手动挂载子应用了，需要导出 mountParcel，已经用 singleVue 包裹了，所以要用 registerApplication 启动
registerApplication({
  name: 'root-config',
  app: () => (window as any).System.import('root-config'),
  activeWhen: () => true,
});

registerApplication({
  name: '@vue-mf/calendar',
  app: () => (window as any).System.import('@vue-mf/calendar'),
  activeWhen: location => {
    return location.href.includes('/sub-app');
  },
  customProps: {
    root: 'json-util',
  },
});

// 改为 Parcel 手动挂载了，所有这个要去掉
// registerApplication({
//   name: '@vue-mf/clock',
//   app: () => (window as any).System.import('@vue-mf/clock'),
//   activeWhen: location => {
//     return location.href.includes('/sub-app');
//   },
//   customProps: {
//     root: 'json-util',
//   },
// });

start();
```

#### 手动挂载
某个组件（A）在 `mount` 之后手动将子应用挂载到某个 `DOM` 节点

> 记住不需显示时，要手动 `unmount`

使用了 [composition-api](https://composition-api.vuejs.org/zh/api.html#setup)
```js
import { mountParcel } from '@/main';

const parcel = ref<any>(null);

const mountClockParcel = () => {
  const routePath = ctx.root.$route.path;
  const domElement = document.getElementById('app-clock');
  if (routePath === '/sub-app' && domElement) {
    const parcelConfig = (window as any).System.import('@vue-mf/clock');
    parcel.value = mountParcel(parcelConfig, { domElement });
  } else if (parcel.value) {
    parcel.value.unmount();
  }
};

onMounted(() => {
  mountClockParcel();
});

watch(
  () => ctx.root.$route.path,
  () => {
    mountClockParcel();
  },
);
```


## 2、子项目的配置(Vue)
例子：[vue-calendar](https://github.com/zero9527/vue-calendar)

### 2.1 下载依赖
- 下载 `single-spa-vue`

```shell
yarn add single-spa-vue
```

- 下载 `vue-cli-plugin-single-spa`

解决这个问题
> single-spa.min.js?25a2:2 single-spa minified message #37: See https://single-spa.js.org/error/?code=37&arg=application

```shell
yarn add -D vue-cli-plugin-single-spa
```

### 2.2 配置
- 应用入口 `main.js/ts`

> **注意：**<br/>
> `appOptions` 下，`el` 可以给当前应用配置在主应用的挂载 `DOM` 节点，这个节点需要**提前**设置好；不提供 `el` 的话默认挂载在 `body` 下

```js
// 其他的代码省略
import Vue from 'vue';
import singleSpaVue from 'single-spa-vue';
// ...

// ============= 非 single-spa 单独启动 =============
if (!(window as any).singleSpaNavigate) {
  new Vue({
    render: (h: any) => h(App),
  }).$mount('#app-calendar');
}

// ============= single-spa 模式启动 =============
const vueLifeCycles = singleSpaVue({
  Vue,
  appOptions: {
    // el：挂载的dom节点，在主项目需要有；没有el的话会添加到body下
    el: '#app-calendar',
    render: (h: any) => h(App),
  },
});

export function bootstrap(props: object) {
  return vueLifeCycles.bootstrap(props);
}

export function mount(props: object) {
  console.log('mount: ', props);
  return vueLifeCycles.mount(props);
}

export function unmount(props: object) {
  return vueLifeCycles.unmount(props);
}
```

### 2.3 问题
#### 问题描述

子项目使用异步组件 `import()` 时，单独跑起来没问题！！！但是在主应用里面会报错，改为正常引入 `import from` 就没事。。。

子应用使用异步组件，在主应用报错

```
Uncaught TypeError: application '@vue-mf/calendar' died in status BOOTSTRAPPING: Object(...) is not a function
```

```js
<template>
  <div id="app-calendar">
    <div class="title">Vue-Calendar</div>
    <Calendar />
  </div>
</template>

<script lang="ts">
// 正常
import Calendar from '@/components/Calendar/index.vue';

// single-spa在主应用加载：不行
// const Calendar = () => import(@/components/Calendar/index.vue);

// single-spa在主应用加载：不行
// import AsyncComponent from '@/components/AsyncComponent/index';

// single-spa 下使用异步组件，在主应用加载有问题
// const Calendar = AsyncComponent(() =>
//   import(
//     /* webpackPrefetch: true */
//     /* webpackChunkName: 'calendar' */
//     '@/components/Calendar/index.vue'
//   ),
// );

export default {
  name: 'App',
  components: {
    Calendar,
  },
};
</script>
```

#### 异步组件问题解决
子项目添加如下设置

```js
// src\set-public-path.ts
import { setPublicPath } from 'systemjs-webpack-interop';

if ((window as any).singleSpaNavigate) {
  setPublicPath('@vue-mf/calendar', 2);
}
```

```js
// vue.config.js
config.output.jsonpFunction = 'wpJsonpFlightsWidget';
```

[https://single-spa.js.org/docs/recommended-setup/#build-tools-webpack--rollup](https://single-spa.js.org/docs/recommended-setup/#build-tools-webpack--rollup)


## 参考
- [single-spa](https://single-spa.js.org/docs/configuration/)
- 等等
