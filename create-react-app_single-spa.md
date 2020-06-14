# create-react-app 使用 single-spa 改造

## 前言
其实方便点可以使用 [qiankun](https://qiankun.umijs.org/zh/) 的微前端方案


项目例子：[在线查看](http://zero9527.site/md-note)
- 主应用(React)：[md-note](https://github.com/zero9527/md-note)
- 子应用(Vue)：[vue-clock](https://github.com/zero9527/vue-clock)
- 子应用(Vue)：[vue-calendar](https://github.com/zero9527/vue-calendar)

- 主应用(Vue)：[json-util](https://github.com/zero9527/json-util)，进去后路由手动切到 `/sub-app` 就能看到了（放 `github` 上会比较慢）

> 官方[文档](https://single-spa.js.org/docs/faq/#create-react-app)在使用 `create-react-app` 时是做另外一些处理的，但是我这个项目是之前写的，有一些 `webpack` 自定义配置，就不想从头再来


## 流程
### 主应用流程
- 启动由 `system.js` 接管，配置 `webpack` 下 `out.libraryTarget` 为 `system`；使用 `Parcel` 时要去掉 `optimization.runtimeChunk`

- `html` 入口中通过 `importmap`，设置当前应用、子应用 名称+地址

- 一般用法（`DOM` 节点一直存在的情况下）：`registerApplication` 注册子应用，通过 `system.js` 引入，设置渲染路由 `activeWhen`，传递给子应用的参数 customProps

- 使用 `Parcel` 用法（`DOM` 节点不是一直存在的情况下）：
  - 主应用也需要包裹 `singleSpaVue/singleSpaReact` 等，
  - 然后 `registerApplication` 自己，
  - 在某个组件（A）内使用由 `main.js/ts` 在 `bootstraps/mount` 时导出的 `mountParcel`，
  - 在某组件（A）挂载后，手动将子应用（当做组件用）挂载到这个组件的某个 `DOM` 节点（见2.2）

### 子应用流程(Vue)
- 启动方式由 `single-spa-vue` 接管，可以判断 window.singleSpaNavigate 为 false 单独启动

- 配置在主应用的挂载点，`appOptions` 下的 `el` 设置，默认挂载到 `body` 下（使用 `Parcel` 的话就不需要配置

- 导出一些生命周期事件，至少如下三个：`bootstrap/mount/unmount`，可以在 `mount` 下接收主应用传递的参数

- 异步组件需要使用：（不然主应用使用子应用会报错）
  - `systemjs-webpack-interop` 设置 `setPublicPath`；
  - `webpack` 配置：`config.output.jsonpFunction = 'wpJsonpFlightsWidget'`;



## 1 主应用
> 主应用使用 `Parcel` 引用子应用时，需要自身使用 `single-spa-react`，这个时候，webpack 配置里面需要把 `optimization.runtimrChunk` 去掉；只是使用 `application` 加载子应用的话就不影响

### 1.1 下载依赖
```shell
yarn add single-spa
```

### 1.2 配置
#### 在 src 下创建 single-spa-config.ts 文件
这里注意为什么包一层函数，因为 `tree-shaking` 的原因！！！

> 如果不包裹，在导入的地方 `import '@/single-spa-config.ts'` 打包后就没了，**但是开发环境还是在的，可以正常运行**，我被这个问题搞了一天，还好第一天没钻牛角尖，搞几个小时就放弃了。。。第二天看着代码突然想到可能是打包时 `tree-shaking` 把代码去掉了。。。一试果然。。。
 
```js
// src/single-spa-config.ts
import { registerApplication, start } from 'single-spa';

export default function singleSpaSetup() {
  registerApplication({
    name: '@vue-mf/calendar',
    app: () => (window as any).System.import('@vue-mf/calendar'),
    activeWhen: (location) => {
      return location.hash === '#/';
    },
    customProps: {},
  });

  start();
}
```


### 1.3 修改 webpack
#### Access-Control-Allow-Origin
开发环境死活加不上，然后我去 `nginx` 设置子应用添加了，子应用放 `github Page` 的话已经是有加上去的，不然会跨域

#### libraryTarget
这里不需要将 `output.libraryTarget` 改为 `system`，原因我也不知道，加上会报错，我就去掉了，反正不加也正常运行。。。

#### filename
这里把 `optimization.runtimeChunk` 去掉之后，才会使用 `filename` 作为入口，不然的话入口是 `chunkFilename` 即 `main.chunk.js`

```js
/// config/webpack.config.js
filename: 'js/app.js',
```

### 1.4 HTML 入口
```html
<!-- public/index.html -->
<meta name="importmap-type" content="systemjs-importmap" />
<script type="systemjs-importmap">
  {
    "imports": {
      "root-config": "./js/app.js",
      "@vue-mf/calendar": "http://zero9527.site/vue-calendar/js/app.js"
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

### 1.4 webpack 配置自动导入
这里是可选的，上面那个是手动修改，这个是自动生成，当然还是要配置一下的

#### 新建一个 `systemJs-Importmap.js`

里面就像这样
```js
const isEnvDev = process.env.NODE_ENV === 'development';

// systemjs-importmap 的配置，通过webpack给html用
const maplist = [
  {
    name: 'root-config',
    entry: './js/app.js',
  },
  {
    name: '@vue-mf/calendar',
    entry: isEnvDev
      ? '//zero9527.site/vue-calendar/js/app.js' // '//localhost:2333/js/app.js'
      : '//zero9527.site/vue-calendar/js/app.js',
  },
  {
    name: '@vue-mf/clock',
    entry: isEnvDev
      ? '//zero9527.github.io/clock/js/app.js' // '//localhost:2333/js/app.js'
      : '//zero9527.github.io/clock/js/app.js',
  },
];

if (!isEnvDev) {
  const libs = [
    {
      name: 'react',
      entry: './libs/react-16.13.1.min.js',
    },
    {
      name: 'react-dom',
      entry: './libs/react-dom-16.13.1.min.js',
    },
    {
      name: 'react-router',
      entry: './libs/react-router-5.1.2.min.js',
    },
    {
      name: 'highlight.js',
      entry: './libs/highlight.js-10.1.0.min.js',
    },
  ];
  maplist.push(...libs);
}

module.exports = maplist;
```

#### 配置 externals
根据开发环境、生产环境做区分
```js
externals: isEnvProduction
  ? ['react', 'react-dom', 'react-router', 'highlight.js']
  : [],
```

#### 配置 html-webpack-plugin 参数
可以是直接在 `options` 下增加参数，也可以 `templateParameters`，
区别是 `templateParameters` 可以直接在 `HTML入口` 引用，而 `options` 的话就要带一串东西

> `eject` 之后改 `templateParameters` 很方便，但是没有 `eject` 的改起来就麻烦，还是 `options` 方便（比如使用 `react-app-rewried` 等）

- templateParameters

```html
<script type="systemjs-importmap">
  <%= systemJsImportmap %>
</script>
```

- options

```html
<script type="systemjs-importmap">
  <%= htmlWebpackPlugin.options.systemJsImportmap %>
</script>
```

在 `plugins` 下面 `htmlWebpackPlugin` 
```js
// config/webpack.config.js
const systemJsImportmap = require('../systemJs-Importmap');
const importMap = { imports: {} };
systemJsImportmap.forEach(
  (item) => (importMap.imports[item.name] = item.entry)
);

templateParameters: {
  systemJsImportmap: JSON.stringify(importMap, null, 2),
},
```


## 2 启动 single-spa
### 2.1 子应用 Appliaction
> **注意！**<br>
> `DOM` 节点应该一直存在（如果在子应用那里设置了挂载节点 `el` 的话，默认挂载在 `body` 下面），不然放在某个组件下面，第一次进入正常，但是再回来就会报错，找不到 `el` 的那个节点，

> **上面这种情况其实应该用 `Parcel`**

项目入口如 `src/index.tsx` 引入 `single-spa-config.ts` ，然后执行;

```js
// src/single-spa-config.ts
import { registerApplication, start } from 'single-spa';

export default function singleSpaSetup() {
  registerApplication({
    name: '@vue-mf/clock',
    app: () => (window as any).System.import('@vue-mf/clock'),
    activeWhen: '/clock',
  });

  start();
}
```

### 2.2 子应用 Parcel
[官方文档](https://single-spa.js.org/docs/parcels-overview/)

> 翻译过来叫：包裹，可以在主应用将一个子应用当做组件，手动挂载、卸载使用，不限框架，webpack 5 有一个 Module Federation 也是可以跨项目使用组件的，更细粒化

使用 `Parcel` 用法（`DOM` 节点不是一直存在的情况下）：
- 主应用也需要包裹 `singleSpaVue/singleSpaReact` 等，
- 然后 `registerApplication` 自己，
- 在某个组件（A）内使用由 `main.js/ts` 在 `bootstraps/mount` 时导出的 `mountParcel`，
- 在某组件（A）挂载后，手动将子应用（当做组件用）挂载到这个组件的某个 `DOM` 节点

#### 下载 `single-spa-react`

```shell
yarn add single-spa-react
```

#### 主应用入口 `src/index.tsx`

```js
import './set-public-path';
import singleSpaSetup from './single-spa-config';
import React from 'react';
import ReactDOM from 'react-dom';
import singleSpaReact from 'single-spa-react';
import registerServiceWorker from '@/registerServiceWorker';
import Loading from '@/components/loading';
import AxiosConfig from '@/api';
import Router from './router';
import './index.scss';

// import VConsole from 'vconsole';
// new VConsole();

singleSpaSetup();
AxiosConfig(); // 初始化 axios
registerServiceWorker();

const domElementGetter = () => {
  return document.getElementById('md-note') as HTMLElement;
};

const reactLifeCycles = singleSpaReact({
  React,
  ReactDOM,
  domElementGetter,
  rootComponent: () => (
    <React.Suspense fallback={<Loading />}>
      <Router />
    </React.Suspense>
  ),
});

export let mountParcel: any;

export const bootstrap = (props: any) => {
  mountParcel = props.mountParcel;
  return reactLifeCycles.bootstrap(props);
};
export const { mount, unmount } = reactLifeCycles;
```

- 主应用在需要使用子应用的地方

手动挂载（跟`Vue`使用`Parcel`一样），没有使用官方文档的 `<Parcel />` 那个会报错。。。

```jsx
// src/components/rightPanel/index.tsx
import React, { useEffect } from 'react';
import useScroll from '@/utils/useScroll';
import StickyRight from '@/components/stickyRight';
import { mountParcel } from '@/index';
import styles from './styles.scss';

const RightPanel: React.FC = () => {
  const { scrollTop, prevScrollTop } = useScroll();

  useEffect(() => {
    mountParcelClock();
    mountParcelCalendar();
  }, []);

  const mountParcelClock = () => {
    const parcelConfig = (window as any).System.import('@vue-mf/clock');
    const domElement = document.getElementById('app-clock')!;
    mountParcel(parcelConfig, { domElement });
  };

  const mountParcelCalendar = () => {
    const parcelConfig = (window as any).System.import('@vue-mf/calendar');
    const domElement = document.getElementById('app-calendar')!;
    mountParcel(parcelConfig, { domElement });
  };

  const Beian = () => (
    <a href="http://www.beian.miit.gov.cn/" target="__blank" title="备案号">
      粤ICP备20014593号-1
    </a>
  );

  const CopyRight = () => (
    <div>
      @2020&nbsp;
      <a href="https://github.com/zero9527" target="__blank" title="github">
        zero9527
      </a>
    </div>
  );

  return (
    <StickyRight
      className={styles['right-panel']}
      style={{
        marginTop: scrollTop > 50 && scrollTop > prevScrollTop ? '0' : '',
      }}
    >
      <div id="app-clock" className={styles['single-spa-clock']} />
      <div id="app-calendar" className={styles['single-spa-calendar']} />
      <div className={styles.beian}>
        <Beian />
        <CopyRight />
      </div>
    </StickyRight>
  );
};

export default RightPanel;
```
