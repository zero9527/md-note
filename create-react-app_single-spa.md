# create-react-app 使用 single-spa 改造

项目例子：[在线查看](http://zero9527.site/md-note)
- 主应用(React)：[md-note](https://github.com/zero9527/md-note)
- 子应用(Vue)：[vue-calendar](https://github.com/zero9527/vue-calendar)

- 主应用(Vue)：[json-util](https://github.com/zero9527/json-util)，进去后路由手动切到 `/sub-app` 就能看到了（放`github`上会比较慢）

> 官方[文档](https://single-spa.js.org/docs/faq/#create-react-app)在使用 `create-react-app` 时是做另外一些处理的，但是我这个项目是之前写的，有一些 `webpack` 自定义配置，就不想从头再来

## 主应用
### 下载依赖
```shell
yarn add single-spa
```

### 配置
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


## 修改 webpack
### Access-Control-Allow-Origin
开发环境死活加不上，然后我去 `nginx` 设置子应用添加了，子应用放 `github Page` 的话已经是有加上去的，不然会跨域

### libraryTarget
这里不需要将 `output.libraryTarget` 改为 `system`，原因我也不知道，加上会报错，我就去掉了，反正不加也正常运行。。。

### chunkFilename
`output.chunkFilename` 改一下，不包含 `hash`，不然 `HTML入口那里` 引入比较麻烦，虽然这样缓存不好控制了。。。

```js
/// config/webpack.config.js
chunkFilename: 'js/[name].chunk.js'
```

## HTML 入口
```html
<!-- public/index.html -->
<meta name="importmap-type" content="systemjs-importmap" />
<script type="systemjs-importmap">
  {
    "imports": {
      "root-config": "./js/main.chunk.js",
      "@vue-mf/calendar": "http://zero9527.site/vue-calendar/js/app.js"
    }
  }
</script>
<script src="./lib/systemjs/system.min.js"></script>
<script src="./lib/systemjs/extras/amd.min.js"></script>
<script src="./lib/systemjs/extras/named-exports.min.js"></script>
<script src="./lib/systemjs/extras/named-register.min.js"></script>
<script src="./lib/systemjs/extras/use-default.min.js"></script>
<script>
  System.import('root-config');
</script>
```

### webpack 配置自动导入
这里是可选的，上面那个是手动修改，这个是自动生成，当然还是要配置一下的

#### 新建一个 `systemJs-Importmap.js`

里面就像这样
```js
const isEnvDev = process.env.NODE_ENV === 'development';

// systemjs-importmap 的配置，通过webpack给html用
module.exports = [
  {
    name: 'root-config',
    entry: './js/main.chunk.js',
  },
  {
    name: '@vue-mf/calendar',
    entry: isEnvDev
      ? '//localhost:2333/js/app.js'
      : 'http://zero9527.site/vue-calendar/js/app.js',
  },
];
```

#### 配置 html-webpack-plugin 参数
可以是直接在 `options` 下增加参数，也可以 `templateParameters`，
区别是 `templateParameters` 可以直接在 `HTML入口` 引用，而 `options` 的话就要带一串东西

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


## 启动 single-spa
在适当的位置引入 `single-spa-config.ts` ，然后执行;

我这里是当作某个路由下的一个 `子组件` 来使用的

> **注意！**<br>
> `DOM` 节点应该一直存在（如果在子应用那里设置了挂载节点 `el` 的话，默认挂载在 `body` 下面），不然放在某个组件下面，第一次进入正常，但是再回来就会报错，找不到 `el` 的那个节点

我的做法是：
- 子应用就放在组件 `RightPanel` 下，
- 组件 `RightPanel` 放在 `HashRouter` 下，独立在所有 `Route` 之外，
- 组件 `RightPanel` 通过判断 `location.pathname` 为需要显示的路由，去控制显示、隐藏

```jsx
// src/index.tsx
import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from '@/registerServiceWorker';
import RightPanel from './views/noteList/rightPanel';
import Loading from '@/components/loading';
import AxiosConfig from '@/api';
import Router from './router';
import './index.scss';

AxiosConfig(); // 初始化 axios

ReactDOM.render(
  <React.Suspense fallback={<Loading />}>
    <Router />
  </React.Suspense>,
  document.getElementById('md-note') as HTMLElement
);

registerServiceWorker();
```

```jsx
// src/router.tsx
import React, { Suspense } from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import { lazy } from '@loadable/component';
import RightPanel from '@/components/rightPanel';
import Loading from '@/components/loading';
import Page404 from './components/Page404';

const App = lazy(() => import(/* webpackPrefetch: true */ '@/App'));

const Detail = lazy(() =>
  import(/* webpackPrefetch: true */ '@/views/noteDetail')
);

const Editor = lazy(() =>
  import(/* webpackPrefetch: true */ '@/views/mdEditor')
);

const Router = () => (
  <HashRouter>
    <RightPanel />
    <Switch>
      <Route
        key="home"
        path="/"
        exact={true}
        render={() => (
          <Suspense fallback={<Loading />}>
            <App />
          </Suspense>
        )}
      />
      <Route
        key="detail"
        path="/detail/:tag/:name"
        component={() => (
          <Suspense fallback={<Loading />}>
            <Detail />
          </Suspense>
        )}
      />
      <Route
        key="md-editor"
        path="/md-editor/:tag/:tid"
        component={() => (
          <Suspense fallback={<Loading />}>
            <Editor />
          </Suspense>
        )}
      />
      <Route key="404" path="*" component={Page404} />
    </Switch>
  </HashRouter>
);

export default Router;
```