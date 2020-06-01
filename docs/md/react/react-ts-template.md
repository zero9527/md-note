# React+Typescript项目踩踩坑坑

## 前言
* 项目里使用react 16.8.x, typescript 3.5.3
* 然后也用 `koa2+typescript` 搭了一个**简单**的 api 后台服务，只是用来验证 Axios 封装Api 的使用，还有个人 node.js 玩耍需要🙃，并不涉及数据库操作等。。。代码可以戳 [这里](https://github.com/zero9527/mdnote-service)
* 顺便升级了一下 webpack4
* 然后，这只是一个空模版，用来验证一些东西，只有少数简单 demo 页面，其他页面都已删除。。。
* 本文项目源码可以看 [这里](https://github.com/zero9527/react-ts-antd-template)

> * 更新：[2019-09-05]: electron，详情看 github 分支： electron/electron-app
> * 更新：[2019-09-09]: 第三方资源使用 CDN （看 13、构建）
> * 更新：[2019-11-08]: 状态管理 由 redux+rematch 换为 mobx，资源预加载 prefetch 等

<br/>
<br/>

> **注意！**<br/>
> * 这个项目是之前的旧项目改造升级的，<br>
> * 注定有一些未知问题（比如构建工具版本问题，或者出现新的东西、解决了新的bug，再来更新它旧没意义了），
> 在搭建、升级的过程中学到了很多；<br>
> * 后续开始新项目还是基于新的 `create-react-app` 再搭一次较好

## 1、创建项目
> **这里没有使用antd官方的demo**，而是在普通 react+typescript 项目增加 antd 然后改造的

> **为什么不用antd官方的demo？** 因为我试过了之后可以用，但是webpack设置别名搞不定，老是有问题，就不用那个了。。。

```
create-react-app project --typescript
```

src结构：
```
.
├── api
├── assets
├── components
├── lang
├── routes
├── store-rematch
├── utils
├── views
├── App.scss
├── App.test.tsx
├── App.tsx
├── index.scss
├── index.tsx
├── router.tsx
└── setupProxy.js
```


## 2、typescript
### tsconfig.json:
```json
{
  "compilerOptions": {
    "baseUrl": "src",
    "outDir": "build/dist",
    "module": "esnext",
    "target": "es5",
    "lib": ["es6", "dom"],
    "sourceMap": true,
    "allowJs": true,
    "jsx": "preserve",
    "moduleResolution": "node",
    "rootDir": ".",
    "forceConsistentCasingInFileNames": true,
    "noImplicitReturns": true,
    "noImplicitThis": true,
    "noImplicitAny": true,
    "importHelpers": true,
    "strictNullChecks": true,
    "suppressImplicitAnyIndexErrors": true,
    "noUnusedLocals": true,
    "allowSyntheticDefaultImports": true,
    "paths": {
      "@/*": ["./*"]
    }
  },
  "awesomeTypescriptLoaderOptions": {
    "useBabel": true,
    "useCache": false,
    "emitRequireType": false
  },
  "includes": [
    "src"
  ],
  "exclude": [
    "node_modules",
    "build",
    "scripts",
    "acceptance-tests",
    "webpack",
    "jest",
    "src/setupTests.ts",
    "public/"
  ]
}

```

## 3、升级webpack4.x
webpack.config.dev.js中添加`mode`字段：`mode: 'development'`<br>
webpack.config.prod.js中添加`mode`字段：`mode: 'production'`<br>

### 需要升级的相关模块：

`yarn upgrade **` 升级或者直接 `yarn add ** -D` 也可以
* `file-loader`
* `fork-ts-checker-webpack-plugin`
* `html-webpack-plugin@next`
* `react-dev-utils`
* `url-loader`
* `webpack`
* `webpack-cli`
* `webpack-dev-server`
* `webpack-manifest-plugin`

### 部分QA
1. 编译报错：webpack is not a function

    把上面相应插件升级一下，然后 script/start.js:<br>
    `const compiler = createCompiler(webpack, config, appName, urls, useYarn);`改为：<br>
    `const compiler = createCompiler({webpack, config, appName, urls, useYarn});`
    
2. 编译报错：this.htmlWebpackPlugin.getHooks is not a function

    注意`html-webpack-plugin@next`这个插件要添加@next才行<br>
    config/webpack.comfig.dev.js，config/webpack.config.prod.js:<br>
    `new InterpolateHtmlPlugin(env.raw)` 改为：<br>
    `new InterpolateHtmlPlugin(HtmlWebpackPlugin, env.raw)`

3. 打包后报错 Chunk Loading failed
    
    config/paths.js: 将其中的`'/'`改为`'./'`即可

```js
function getServedPath(appPackageJson) {
  const publicUrl = getPublicUrl(appPackageJson);
  const servedUrl = envPublicUrl ||
    (publicUrl ? url.parse(publicUrl).pathname : '/');
  return ensureSlash(servedUrl, true);
}
```

4. 报@types/tapable @types/html-minifier @types/webpack不存在
    
```cmd
yarn add @types/tapable @types/html-minifier @types/webpack
```


## 4、antd
```
yarn add antd
```

### 按需加载

* `ts/tsx` 使用 `awesome-typescript-loader` 这个loader解析
* `antd` 组件的css按需加载使用 `babel-plugin-import` 这个插件

```
yarn add awesome-typescript-loader babel-plugin-import
```

```js
// webpack.config.dev.js, webpack.config.prod.js
{
    test: /\.(ts|tsx)$/,
    include: paths.appSrc,
    loader: 'awesome-typescript-loader',
    exclude: /node_modules/,
    options: {
      babelOptions: {
        "presets": ["react"],
        "plugins": [
          [
            "import", 
            { 
              "libraryName": "antd", 
              "style": "css" 
            }
          ]
        ]
      }
    }
  },
```

## 5、路由/权限控制
路由按需加载使用 `@loadable/component` <br>
如果报 @types/xxx 的错误，按提示安装就行，没有的话就手动在 `common.d.ts` 添加一个 `declare module '@loadable/component';`
```
yarn add @loadable/component
```

### 路由
* App之下的路由

> 通过以下，实现类似Vue中将路由嵌套在 App 内部的写法，App 中的 `props.children` 相当于 Vue 中的  `router-view` ，然后 `Header` 等全局组件只会挂载一次

```js
// src/router.tsx
...
<AuthRoute 
  path='/' 
  render={() => (
    <App>
      <Switch>
        {routes.map(route => route)}
      </Switch>
    </App>
  )}
/>
...
```
* 独立在App之外的路由

> aloneComp

```js
// src/router.tsx
<Switch>
  {
    aloneComp.map(route => route)
  }
  <AuthRoute 
    path='/' 
    render={() => (
      <App>
        <Switch>
          {routes.map(route => route)}
        </Switch>
      </App>
    )}
  />
</Switch>
```


```js
// src/App.tsx
...
  public render() {
    return (
      <div className={style.app}>
        <Header />
        { this.props.children }
      </div>
    );
  }
```

### 路由管理
* 路由统一管理

```js
// src/routes/index.tsx
import login from './login-register';
import home from './home';

/**
 * 使用这个组件 '@/routes/auth-route'，代替官方 Route，控制需要登录权限的路由
 */
export default [
  ...login,
  ...home
]
```

* 路由模块

```js
// src/routes/home.tsx
import AuthRoute from '@/routes/auth-route';
import * as React from 'react';
import Loadable from '@loadable/component';

// home
export default [
  <AuthRoute 
    key="home" 
    exact={true} 
    path="/" 
    component={Loadable(() => import('@/views/home'))} 
  />,
  <AuthRoute 
    key="home" 
    exact={true} 
    path="/home" 
    component={Loadable(() => import('@/views/home'))} 
  />
]
```

* 路由入口 router.tsx

> 分为App之下的路由，和独立在App之外的路由；视情况而定，如果所有页面都有一个一样的 App 外壳，就不需要这么分开

```js
// src/router.tsx
import * as React from 'react';
import { HashRouter, Switch } from 'react-router-dom';
import AuthRoute from '@/routes/auth-route';
import Loadable from '@loadable/component';
import PageRoutes from './routes';
import login from '@/routes/login-register';

// 使用 import { lazy } from '@loadable/component';
// lazy()会有警告，跟React.lazy()一样的警告
const App = Loadable(() => import('./App'));
const ErrComp = Loadable(() => import('./views/err-comp'));

const AppComp = () => {
  // 独立在 app 之外的路由
  const aloneComp = [
    ...login
  ];
  const ErrRoute = 
    <AuthRoute 
      key='err404' 
      exact={true} 
      path='/err404' 
      component={ErrComp} 
    />;
  const NoMatchRoute = 
    <AuthRoute 
      key='no-match' 
      component={ErrComp} 
    />;

  const routes = [...PageRoutes, ErrRoute, NoMatchRoute];

  return (
    <Switch>
      {
        aloneComp.map(route => route)
      }
      <AuthRoute 
        path='/' 
        render={() => (
          <App>
            <Switch>
              {routes.map(route => route)}
            </Switch>
          </App>
        )}
      />
    </Switch>
  );
}

export default function Router() {
  return (
    <HashRouter>
      <AppComp />
    </HashRouter>
  );
}
```

* 项目入口 src/index.tsx

```js
// src/index.tsx
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from '@/store-rematch';
import AxiosConfig from './api';
import Router from './router';
import './index.scss';
// import registerServiceWorker from './registerServiceWorker'; 

const Loading = () => (<div>loading...</div>);

AxiosConfig(); // 初始化 axios

ReactDOM.render(
  <React.Suspense fallback={<Loading />}>
    <Provider store={store}>
      <Router />
    </Provider>
  </React.Suspense>,
  document.getElementById('root') as HTMLElement
);

// registerServiceWorker();
```


### 登录权限控制
使用`js-cookie`包，将登录后后端接口返回的token(sessionId?)存在cookie中的'auth'字段
```js
// src/routes/auth-route.tsx:
import * as React from 'react';
import { ComponentProps } from 'react';
import { Route, Redirect, RouteProps } from 'react-router';
import * as Cookies from 'js-cookie';

export interface AuthRouteProps extends RouteProps {
  key?: string|number,
  path?: string,
  auth?: boolean, // 是否需要权限
  redirectPath?: string, // 重定向后的路由
  render?: any,
  component?: ComponentProps<any>
}

const initialProps = {
  key: 1,
  path: '/login',
  auth: true,
  component: () => <div />
};

/**
 * 权限控制处理路由
 */
const AuthRoute = (props: AuthRouteProps = initialProps) => {
  const { auth, path, component, render, key, redirectPath } = props;
  if (auth && !Cookies.get('auth')) {
    // console.log('path: ', path);
    return (
      <Route 
        key={key}
        path={path}
        render={() => 
          <Redirect to={{
            pathname: redirectPath || '/login',
            search: '?fromUrl='+path
          }} />
        } 
      />
    )
  }
  return (
    <Route 
      key={key}
      path={path}
      component={component}
      render={render}
    />
  )
}

export default AuthRoute;
```

## 6、api管理
axios
```
yarn add axios
```

### axios配置、请求/响应拦截
```js
// src/api/index.ts
import axios, { AxiosRequestConfig, AxiosError, AxiosResponse } from 'axios';
import { message } from 'antd';
import * as Cookies from 'js-cookie';
import * as NProgress from 'nprogress';

axios.defaults.timeout = 10000;
axios.defaults.baseURL = process.env.NODE_ENV === 'production'
  ? 'http://192.168.0.5:2333' // 这里设置实际项目的生产环境地址
  : '';

let startFlag = false; // loadingStart的标志

// 拦截器
export default function AxiosConfig() {
  // 请求拦截
  axios.interceptors.request.use((config: AxiosRequestConfig) => {
    if (config.data && config.data.showLoading) {
      // 需要显示loading的请求
      startFlag = true;
      NProgress.start();
    }
    // 请求 access_token，登录后每个请求都带上
    if (Cookies.get('auth')) {
      config.headers.Authorization = Cookies.get('auth');
    }
    if (config.params) config.params._t = Date.now();

    return config;

  }, (err: AxiosError) => {
    if (startFlag) {
      startFlag = false;
      NProgress.done();
    }
    return Promise.reject(err);
  });

  // 响应拦截
  axios.interceptors.response.use((res: AxiosResponse) => {
    if (startFlag) {
      startFlag = false;
      NProgress.done();
    }
    return res.data;
    
  }, (err: AxiosError) => {
    // 服务器错误
    if (err.response && (err.response.status+'').startsWith('5')) {
      message.error('请求出错！')
    }
    if (startFlag) {
      startFlag = false;
      NProgress.done();
    }
    return Promise.reject(err);
  })
}
```

### api 模块
```js
// src/api/test-api.ts
import axios from 'axios';

// 获取文件
const api = {
  // 示例：
  // get只有params才会作为请求参数
  // 其他请求方式如：POST,PUT,PATCH，data作为请求参数
  testApi: (params: any = {}) => {
    // post
    // return axios.post('/api/file/uploadFile', params);

    // get
    return axios.get('/api/file/getFile', { 
      params, 
      data: { showLoading: true }
    });
  }
};

export default api;
```

### api使用
```ts
import Api from '@/api/test-api';
...

Api.testApi(params).then((res: any) => {...});
```


## -7、状态管理使用rematch (已换为 mobx )
由于 `redux v7.1.0` 新增了 `useSelector`, `useDispatch` 等Hooks，更新 `react-redux` 版本即可使用，下面将增加使用 `useSelector, useDispatch` 的版本

```cmd
yarn add @rematch/core react-redux
```

### store管理
```ts
// src/store-rematch/index.ts
import { init, RematchRootState } from '@rematch/core';
import * as models from './models/index';

// 缓存列表
const cacheList = ['common'];
const stateCache = sessionStorage.getItem('store-rematch');
// 初始化 state
const initialState = (stateCache && JSON.parse(stateCache)) || {};

const store = init({
  models,
  redux: {
    initialState
  }
});

// 监听每次 state 的变化
store.subscribe(() => {
  const state = store.getState();
  let stateData = {};
  
  Object.keys(state).forEach(item => {
    if (cacheList.includes(item)) {
      stateData[item] = state[item];
    }
  });

  sessionStorage.setItem('store-rematch', JSON.stringify(stateData));
});

export type Store = typeof store;
export type Dispatch = typeof store.dispatch;
export type iRootState = RematchRootState<typeof models>;
export default store;
```

### models
```js
// src/store-rematch/models/indes.ts
import { createModel } from '@rematch/core';
// import detail from './detial';

export interface ICommonState {
  appName: string,
  isMobile: boolean,
  count: number,
  countAsync: number
}
const initialState: ICommonState = {
  appName: 'react-ts-mdnote',
  isMobile: false,
  count: 0,
  countAsync: 0
};
const common = createModel({
  state: initialState,
  reducers: {
    setIsMobile(state: ICommonState, payload: boolean) {
      return {
        ...state,
        isMobile: payload
      }
    },
    addCount(state: ICommonState) {
      return {
        ...state,
        count: state.count + 1
      }
    },
    setCount(state: ICommonState, payload: number) {
      return {
        ...state,
        countAsync: payload
      }
    }
  },
  effects: (dispatch) => ({
    async setCountAsync(payload, rootState) {
      await new Promise(resolve => setTimeout(resolve, 1000))
      dispatch.common.setCount(payload)
    }
  })
});

export {
  common,
  // detail
}
```

### 组件中使用
* **普通的 `connect + mapState + mapDispatch` 写法**

```js
// src/views/home/index.tsx
import * as React from 'react';
import { connect } from 'react-redux';
import { iRootState, Dispatch } from '@/store-rematch';
import { Button } from 'antd';
import styles from './home.scss';

interface IProps {
  [prop: string]: any
}

function Home(props: IProps) {
  return (
    <div className={styles.home}>
      <div className={styles.content}>
        <p>react-ts-antd-template</p>
        <p className={styles.count}>
          count: { props.count } &emsp;
          <Button onClick={props.addCount}>count++</Button>
        </p>
        <p className={styles.count}>
          countAsync: { props.countAsync } &emsp;
          <Button onClick={props.setCountAsync}>countAsync</Button>
        </p>
      </div>
    </div>
  )
}

const mapState = (state: iRootState) => {
  return {
    count: state.common.count,
    countAsync: state.common.countAsync
  }
}
const mapDispatch = (dispatch: Dispatch) => {
  return {
    addCount: () => dispatch({ type: 'common/addCount' }),
    setCountAsync: () => dispatch({ type: 'common/setCountAsync', payload: new Date().getSeconds() }),
  }
}

export default connect(mapState, mapDispatch)(Home);
```

- **`react-redux` 新增Hooks: `useSelector, useDispatch` 写法**

```js
import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { iRootState, Dispatch } from '@/store-rematch';
import { Button } from 'antd';
import styles from './home.scss';

interface IProps {
  [prop: string]: any
}

function Home(props: IProps) {
  const dispatch: Dispatch = useDispatch();
  const { count, countAsync } = useSelector((state: iRootState) => state.common);
  
  return (
    <div className={styles.home}>
      <div className={styles.content}>
        <p>react-ts-antd-template</p>
        <p className={styles.count}>
          count: { count } &emsp;
          <Button onClick={() => dispatch({ type: 'common/addCount' })}>count++</Button>
        </p>
        <p className={styles.count}>
          countAsync: { countAsync } &emsp;
          <Button 
            onClick={() => dispatch({ type: 'common/setCountAsync', payload: new Date().getSeconds() })}
          >countAsync</Button>
        </p>
      </div>
    </div>
  )
}

export default Home;
```


## +7、状态管理 mobx
相对 redux 来说，mobx 概念少，写法简单使用也简单；类组件使用装饰器，函数组件使用同名函数

* @observable: 声明数据 state 
* @computed: 计算属性，可以从对象或数组中取出需要的数据
* @action: 动作函数，可以直接写异步函数
* @inject('homeStore'): 将 'homeStore' 注入到组件
* @observer: 函数/装饰器可以用来将 React 组件转变成响应式组件。 它用 mobx.autorun 包装了组件的 render 函数以确保任何组件渲染中使用的数据变化时都可以强制刷新组件。observer 是由单独的 mobx-react 包提供的。


**其他的配置：**
* 下载插件

```
yarn add babel-plugin-transform-decorators-legacy -D
```

* 然后在 .babelrc: 使用装饰器

```
"plugins": ["transform-decorators-legacy"]
```

* tsconfig.json: 使用装饰器

```
"compilerOptions": {
  "experimentalDecorators": true,
}
```

### 7.1 项目入口
使用 `Provider` 包括项目
```js
import { Provider } from 'mobx-react';
```

```js
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { Provider } from 'mobx-react';
import store from './store';
import AxiosConfig from './api';
import Router from './router';
import './index.scss';
import registerServiceWorker from './registerServiceWorker'; 

const Loading = () => (<div>loading...</div>);

AxiosConfig(); // 初始化 axios

ReactDOM.render(
  <React.Suspense fallback={<Loading />}>
    <Provider {...store}>
      <Router />
    </Provider>
  </React.Suspense>,
  document.getElementById('root') as HTMLElement
);

registerServiceWorker();
```

### 7.2 模块 
```js
// src/store/home.ts
import * as mobx from 'mobx';

// 禁止在 action 外直接修改 state 
mobx.configure({ enforceActions: "observed"});
const { observable, action, computed, runInAction } = mobx;

class Home {
  @observable
  public count = 0;

  @observable
  public data = {
    time: '2019-11-08'
  };

  @computed
  public get getTime() {
    return this.data.time;
  }

  @action
  public setCount = (_count: number) => {
    this.count = _count;
  }

  @action
  public setCountAsync = (_count: number) => {
    setTimeout(() => {
      runInAction(() => {
        this.count = _count;
      })
    }, 1000);
  }
}

const homeStore = new Home();
export type homeStoreType = typeof homeStore;
export default homeStore;
```

### 7.3 store 统一输出管理
```js
// src/store/index.ts
import homeStore from './home';

/**
 * 使用 mobx 状态管理
 */
export default {
  homeStore
}
```

### 7.4 组件使用
使用装饰器在 class 上就可以了, `inject` 注入对应模块，可以多次 `inject`；
> 注意 
    ```
    @inject('homeStore')
    @observer
    ```
    这两个的顺序，不然会有警告

```js
// src/views/home/index.tsx
import { observer, inject } from 'mobx-react';
import { homeStoreType } from '@/store/home';
...

interface IProps extends RouteComponentProps {
  history: History,
  homeStore: homeStoreType
}

@inject('homeStore')
@observer
class Home extends React.Component<IProps> {
  ...
  
  public componentDidMount() {

    this.props.homeStore.setCount(2);
    console.log(this.props.homeStore.count); // 2
    
  }

  ...
}
```


## 8、跨域代理
使用 `http-proxy-middleware` 插件
```cmd
yarn add http-proxy-middleware
```

### 新建 scr/setupProxy.js
```js
const proxy = require("http-proxy-middleware");

module.exports = function(app) {
  app.use(
    proxy('/', {
      target: 'http://192.168.0.5:2333',
      changeOrigin: true
    })
  );
};
```

### 在script/start.js中使用：
在

```js
const devServer = new WebpackDevServer(compiler, serverConfig);
```

之后，添加以下代码(如果可以代理下面就不用加了)

```js
require('../src/setupProxy')(devServer);
```


## 9、css-module、全局scss变量

class 输出配置: `[local]__[hash:base64:6]`，输出形如：`content__1f1Aqs`，详细可看 [这里](https://juejin.im/post/5cc2d2c1f265da03a54c23c9)

sass全局变量使用这个 loader `sass-resources-loader`，<br>
配置一下 loader，然后在这个文件里面 `src/utils/variable.scss` 写变量，然后就可以愉快的使用了

```cmd
yarn add sass-resources-loader
```

```js
// webpack.config.dev.js, webpack.config.prod.js
  {
    test: /\.(scss|less)$/,
    exclude: [/node_modules/],
    use: [
      {
        loader: require.resolve('style-loader'),
      },
      {
        loader: require.resolve('css-loader'),
        options: {
          importLoaders: 1,
          modules: true,
          localIdentName: '[local]__[hash:base64:6]'
        }
      },
      {
        loader: require.resolve('postcss-loader'),
        options: {
          // Necessary for external CSS imports to work
          // https://github.com/facebookincubator/create-react-app/issues/2677
          ident: 'postcss',
          plugins: () => [
            require('postcss-flexbugs-fixes'),
            autoprefixer({
              browsers: [
                '>1%',
                'last 4 versions',
                'Firefox ESR',
                'not ie < 9', // React doesn't support IE8 anyway
              ],
              flexbox: 'no-2009',
            }),
          ],
        },
      },
      {
        loader: require.resolve('sass-loader'),
      },
      {
        loader: 'sass-resources-loader',
        options: {
          resources: [
            path.resolve(__dirname, './../src/utils/variable.scss'),
          ],
        }
      }
    ]
  },
```


## 10、列表keep-alive
可以看 [这里](https://juejin.im/post/5d512fa1e51d4561d41d2dbe)


## 11、高阶组件与withRouter
主要是多个高阶组件使用时候 `props` **类型的传递** 需要注意

### Context.Provider
```js
// src/App.tsx
import * as React from 'react';
import Header from '@/components/header';
import Sidebar from '@/components/sidebar';
import Footer from '@/components/footer';
import styles from './App.scss';
import { RouteComponentProps, withRouter } from 'react-router';

interface IProps extends RouteComponentProps {
  [prop: string]: any
}
export interface IState {
  timer?: any
}
export type State = Readonly<IState>;

export interface IAppContext {
  appname: string
}
const defaultContext: IAppContext = { appname: 'react-antd-ts' };
export const AppContext = React.createContext(defaultContext);

class App extends React.Component<IProps, State> {
  public readonly state: State = {};
  
  constructor(props: IProps) {
    super(props);
  }

  public render() {
    return (
      <div className={styles.app}>
        <AppContext.Provider value={defaultContext}>
          <Header text="tteexxtt" />
          <Sidebar />
          { this.props.children }
          <Footer />
        </AppContext.Provider>
      </div>
    );
  }
}

export default withRouter(App);
```

### Context.Consumer 包装
也可以使用 `useContext` 替代，就不需要下面 `Consumer` 包装了

```js
// src/components/withAppContext/index.tsx
import * as React from 'react';
import { AppContext, IAppContext } from '@/App';

// 高阶组件：AppContext Consumer包装
// 使用时包在最外层，如 withAppContext<IProps>(withRouter(Header));
function withAppContext<T>(Component: React.ElementType) {
  // T: 泛型，传递 Component 的 props 类型，被包装的组件在父组件使用时智能提示
  // 但是需要和 withRouter 的类型分开， 
  // 因为 withRouter 不会传递除 history/location/match 之外的 props
  return (props: T) => {
    return (
      <AppContext.Consumer>
        {
          (appcontext: IAppContext) =>  <Component {...props} {...appcontext} />
        }
      </AppContext.Consumer>
    );
  }
}

export default withAppContext;
```

### 组件使用
> **注意:** 
> * `withRouter` 不会传递除 `history/location/match` 之外的 `props`，所以这里与组件本身的 `props` 类型分开；
> * 使用 `withAppContext` 传递的泛型是组件本身的 props：即 IProps

```js
// src/components/header/index.tsx
import * as React from 'react';
import withAppContext from '@/components/withAppContext';
import { withRouter, RouteComponentProps } from 'react-router';
import styles from './header.scss';

const { useEffect } = React;

interface IProps {
  text: string,
  [prop: string]: any
}
// withRouter不会传递除 history/location/match 之外的 props，
// 所以这里与组件本身的 props 类型分开
type IPropsWithRoute = IProps & RouteComponentProps;

function Header(props: IPropsWithRoute) {
  useEffect(() => {
    console.log(props);
  }, []);
  
  return (
    <section className={styles.header}>
      <div className="center-content">
        <div>LOGO</div>
        <div>HEADER, { props.appname }, {props.text}</div>
      </div>
    </section>
  );
}

// withRouter不会传递除 history/location/match 之外的 props，
// 所以这里使用组件本身的 props：即 IProps
export default withAppContext<IProps>(withRouter(Header));
```


## 12、国际化
使用 react-intl
```cmd
yarn add react-intl @types/react-intl
```

### 在 App 中使用 IntlProvider
```js
// src/App.tsx
import { IntlProvider } from 'react-intl';
import messages from '@/lang';

...

class App extends React.Component<Props, State> {
  public readonly state: State = {
    lang: Cookies.get('lang') || 'zh'
  };
  
  constructor(props: Props) {
    super(props);
  }
  
  public onLangChange(locale: string) {
    Cookies.set('lang', locale);
    this.setState({ lang: locale });
  }

  public render() {
    // console.log(this.props);
    const { lang } = this.state;

    return (
      <div className={styles.app}>
        <IntlProvider key="intl" locale={lang} messages={messages[lang]}>
          <AppContext.Provider value={defaultContext}>
            <Header text="tteexxtt" onLangChange={(locale: string) => this.onLangChange(locale)} />
            <Sidebar />
            { this.props.children }
            <Footer />
          </AppContext.Provider>
        </IntlProvider>
      </div>
    );
  }
}
...
```

### 语言文件
#### lang 入口
```js
// src/lang/index.ts
import en from './en_US';
import zh from './zh_CN';

export default {
  en,
  zh
};
```

#### messages 具体语言

> 原本是想像 `Vue` 里面用的 `i18n` 那样，语言模块多一层，但是插件结构貌似不允许（可能需要设置），所以只能扁平展开  模块，然后在下面 **messages 模块** 里面的键名做处理了

```js
// src/lang/zh_CN/index.ts
import home from './home';
// import detail from './detail';

export default {
  ...home,
  // ...detail
};
```

#### messages 模块
注意键名，暂使用这种方式实现按模块的多语言

```js
// src/lang/zh_CN/home.ts
const home = {
  'home.home': '首页',
  'home.list': '列表',
  'home.login': '登录'
};

export default home;
```

#### 组件使用
`react-intl` 这个多语言包除了 `FormattedMessage`之外，还有其他的组件用来实现金额、货币、日期等差异显示，这里就不写了，有需要看文档照做就是了

```js
// src/components/sidebar/index.tsx
import { FormattedMessage } from 'react-intl';
...
<FormattedMessage id="home.home" />
```

#### 切换语言
```js
// src/components/header/index.tsx
...
import Cookies from 'js-cookie';

const { useEffect, useMemo } = React;

interface IProps {
  text: string,
  onLangChange: (locale: string) => void,
  [prop: string]: any
}
// withRouter不会传递除 history/location/match 之外的 props，
// 所以这里与组件本身的 props 类型分开
type IPropsWithRoute = IProps & RouteComponentProps;

function Header(props: IPropsWithRoute) {
  const lang = useMemo(() => {
    return Cookies.get('lang') || 'zh';
  }, [Cookies.get('lang')]);

  return (
    <section className={styles.header}>
      ...
          <div className={styles.langsection}>
            <span 
              className={`${styles.lang} ${lang === 'zh' ? styles.active : ''}`} 
              onClick={() => props.onLangChange('zh')}
            >中文</span>
            <span 
              className={`${styles.lang} ${lang === 'en' ? styles.active : ''}`} 
              onClick={() => props.onLangChange('en')}
            >English</span>
          </div>
      ...
    </section>
  );
}
...
```


## 13、构建

### 输出

> 使用 `chunkhash` 的话每次构建都会生成一个hash，导致内容不变但是还是文件名却变了；所以修改为  `contenthash` 根据内容生成 hash ，则 hash 值与内容相关，更好的缓存，但是不可避免的会导致构建时间增加，不过还是值得的

* 文件名：修改 output 中文件名 `chunkhash` -> `contenthash`，如：

```js
filename: 'static/js/[name].[contenthash:8].js',
chunkFilename: 'static/js/[name].[contenthash:8].chunk.js',
```

* 代码分割

```js
  optimization: {
    splitChunks: {
      chunks: 'all'
    }
  },
```

### tree-shaking
webpack 文档有说明要设置 `mode: 'production'`，但是我这里 build 之后的文件，打开 `webpack module` 会报错；但是设置 `mode: 'development'` 之后就可以正常访问，只是文件比用 `production` 要大一点，，，这样就没意义了，所以这部分 **暂时不搞** 了。。。

```cmd
TypeError: Cannot read property 'call' of undefined
```

#### package.json 中 
添加 `"sideEffects": false,`

#### webpack.prod.js 中

```js
  optimization: {
    ...
    // tree shaking，与 package.json 中 "sideEffects": false 配合使用
    usedExports: true
  }
```

### 第三方资源 CDN
> 目前只有构建使用资源CDN引入，开发阶段并无区别

> react-router-dom 有问题会报错，暂时无法使用

> 暂时手动处理，也可以使用 HtmlWebpackPlugin 自动处理

格式： `包名: 导出变量名`

* webpack 使用 externals: 

```js
  externals: {
    'axios': 'axios',
    'lodash' : {
      commonjs: 'lodash',
      amd: 'lodash',
      root: '_' // 指向全局变量
    },
    'react': 'React',
    'react-dom': 'ReactDOM',
    'react-router': 'ReactRouter',
    // 'react-router-dom': 'ReactRouterDOM',
    'react-redux': 'ReactRedux',
  },
```

* public/index.html 中添加 第三方资源的 CDN 链接

```html
<script src="https://cdn.bootcss.com/axios/0.19.0/axios.min.js"></script>
<script src="https://cdn.bootcss.com/react/16.8.6/umd/react.production.min.js"></script>
<script src="https://cdn.bootcss.com/react-dom/16.8.6/umd/react-dom.production.min.js"></script>
<script src="https://cdn.bootcss.com/react-router/5.0.1/react-router.min.js"></script>
<!-- <script src="https://cdn.bootcss.com/react-router-dom/5.0.1/react-router-dom.min.js"></script> -->
<script src="https://cdn.bootcss.com/react-redux/7.1.1/react-redux.min.js"></script>
<script src="https://cdn.bootcss.com/lodash.js/4.17.15/lodash.core.min.js"></script>
```


## 最后
* 项目里用到的东西，基本上都在上面了，后续有其他的东西再更新加上吧；
* 前面有些代码是早期写的，后续加新的东西，所以跟后面有些功能是不一样的，不过按之前的写法一般不会有问题；就是新加功能需要改写原来的部分代码
* 另外，webpack 开发/生产配置可以只用一个，然后使用 webpack merge 进去就可以了，本文的 webpack 都是在旧的文件基础上改的，可能有些东西是多余的。。。
* React Hooks 已经很好用，差不多可以不用写 class 组件了
* 多个高阶组件组合的 props 传递需要注意一下
* React 用了几个月，能想到的就这些了，其他的高级货暂时没有。。。
