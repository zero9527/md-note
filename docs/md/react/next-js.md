# 玩玩服务端渲染之 Next.js

## 前言
基于React的服务端渲染SSR框架 [Next.js](https://nextjs.org/learn/basics/getting-started)，
基于Vue的服务端渲染SSR框架 [Nuxt.js](https://zh.nuxtjs.org/guide/installation)。 

### 为什么需要服务端渲染？
* **减少首屏白屏时间**

* **SEO**：Search Engine Optimization 即搜索引擎优化；   
简单说就是，网页在被请求的时候，从服务器发出的内容可以被搜索引擎的爬虫爬到数据，    
这个时候从搜索引擎搜索的关键字包含在这些内容中，那么这个网址的信息就更容易显示在搜索结果中~

* **客户端渲染**：前端SPA的出现，大部分的页面内容在浏览器端通过异步请求拿到数据，然后渲染生成；   
而从服务器发出的只是一个没有内容的空壳，搜索引擎自然爬不到东西~

* **服务端渲染**：以前的后端MCV框架就是使用模板在服务器上将内容生成，然后浏览器接收到数据直接渲染就可以了；     
这个时候网页的内容已经跟随网站过来，主要内容不需要额外的异步请求获取，  
搜索引擎的爬虫就可以爬到这些非异步请求的数据~

* **前端框架的SSR**：主要是 **前后端同构**、**微服务接口聚合** 等；当然只是当作渲染层是最简单的，接口这些就由后端大佬负责吧；   
如 React/Vue/Angular 都有使用 Node.js 在服务端渲染数据的框架；    
前端也可以继续使用 React/Vue/Angular 框架，只是某些数据放在了服务端生成

---

源码看👇[这里](https://github.com/zero9527/next-test)

可以看到，从服务器过来的时候已经有内容了：
![](../static/images/next-js-0.png)

后续的路由变化就相当于 **单页面SPA** 了，但是在某个路由下刷新，那么这个路由也就是 **服务端渲染** 的


## 1、src 目录结构
```
.
├── components
│   ├── header
│   ├── hello-world
│   └── layout
├── pages
│   ├── _app.tsx
│   ├── _error.tsx
│   ├── about.tsx
│   ├── detail.tsx
│   └── index.tsx
├── store
│   ├── home.ts
│   └── index.ts
└── styles
    ├── _error.scss
    ├── about.scss
    ├── detail.scss
    └── index.scss
```

![](../static/images/next-js-1.png)

## 2、npm script
tsc 需要安装
```
yarn install typescript -g
```


## 3、页面 head
设置页面 head
```js
import Head from 'next/head';

const Header = () => (
  <Head>
    <title>Next.js test</title>
    <meta name="viewport" content="width=device-width,initial-scale=1" />
  </Head>
);
```

![](../static/images/next-js-3.png)

可以在需要修改页面 head 的地方使用，如 `/about` 需要修改 页面`title` 为 about；<br> 是增量修改的方式：没有则添加，有则修改
```jsx
// ...
<Head>
  <title>about</title>
</Head>
// ...
```


## 4、路由
`pages` 目录下自动生成路由，层级只能是一层 如下：
```js
// 第一种写法
pages/home.tsx
pages/detail.tsx

styles/home.scss
styles/detail.scss

// 而不是
// 第二种写法
pages/home/index.tsx
pages/home/home.scss
```

> * `pages/` 下 不能是文件夹（正常来说还有个 css，但是使用文件夹的话，开发阶段正常，build 时 会报 scss 文件不是 React 组件。。。所以在外面新建 `styles` 文件夹，放各自路由组件的 scss 文件）
> * 其他文件夹如 `components` 不会报错，可以使用第二种写法，样式跟组件在一个文件夹

### 4.1 Link 组件：
* href: 路由，如 `href="about"` ，则会渲染 `page/about.tsx` 的内容
* as: 将 `href` 重命名然后浏览器地址显示的是这个URL；   
href的路由必须正确，需要有一个实际上在 page 目录中存在的文件
* prefetch: 预取，当前页面会用到

#### href/as
如下将浏览器URL显示为 about1，如果服务端不另外拦截路由的话，实际上渲染的是 pages/about.tsx 文件，实际的路由也是如此
```js
import Link from 'next/link';

<Link href="/about">
  <a>About</a>
</Link>
```

如果设置了 as 别名，并且与原来的路由不一样了，需要在服务端另外设置路由；

如下：
* 客户端

```js
// ...
  return (
    <div>
      <Link href="/detail?id=123" as="/detail/123">
        <a style={linkStyle}>Detail</a>
      </Link>
    </div>
  )
// ...
```

* 服务端

```js
// server.ts
  server.get('/detail/:id', (req: Req, res: http.ServerResponse) => {
    app.render(req, res, '/detail', {
      id: req.params.id
    })
  });
```

#### prefetch
来自[文档](https://nextjs.org/docs#prefetching-pages)

有些操作可能需要延迟，但可以使用 prefetch 预取数据

* Link 组件

```jsx
<Link href="/about" prefetch={true}>
  <a>About</a>
</Link>
```

* 命令式

```jsx
import { withRouter } from 'next/router';

function MyLink({ router }) {
  return (
    <div>
      <a onClick={() => setTimeout(() => router.push('/dynamic'), 100)}>
        A route transition will happen after 100ms
      </a>
      {// but we can prefetch it!
      router.prefetch('/dynamic')}
    </div>
  );
}

export default withRouter(MyLink);
```

#### push/replace
* 对象

```jsx
import Router from 'next/router'

const handler = () => {
  Router.push({
    pathname: '/about',
    query: { name: 'Zeit' },
  })
}

function ReadMore() {
  return (
    <div>
      Click <span onClick={handler}>here</span> to read more
    </div>
  )
}

export default ReadMore
```

### 4.2 非路由组件获取路由参数
这个和 React 一样，使用 `withRouter` 获取路由参数，不过这个是从 `next/router` 导出的；函数组件也可以使用 `useRouter` 
```js
// src/components/header/index.tsx
import Link from 'next/link';
import Head from 'next/head';
import React from 'react'; 
import styles from './header.scss';

const Header = () => {
  return (
    <div>
      <Head>
        <title>Next.js test</title>
        <meta name="viewport" content="width=device-width,initial-scale=1" />
      </Head>
      
      <Link href="/">
        <a className={styles.tag}>Home</a>
      </Link>
      <Link href="/about">
        <a className={styles.tag}>About</a>
      </Link>
      <Link href="/detail?id=123" as="/detail/123">
        <a className={styles.tag}>Detail</a>
      </Link>
    </div>
  )
};

export default Header;
```

### 4.3 路由转换
* 将 `href="/detail?id=123"` 的 **query查询的URL** 转换为 `as="/detail/123"` 的 **params 式 URL**；     
href/as 是静态的，有需要的话动态生成 `<Link>` 即可

![](../static/images/next-js-4.3.png)

```js
import Link from 'next/link';

<Link href="/detail?id=123" as="/detail/123">
  <a className={styles.tag}>Detail</a>
</Link>
```

* 服务端匹配URL为 `/detail/:id` 的路由，     
添加 `params 参数`，然后渲染 `/detail` 对应的 `page/detail.tsx` 文件;  
如果不在服务端设置对应的路由拦截的话，刷新会导致404

```ts
// server.ts
// ...

function serverRun() {
  const server = express();
  // api接口
  const controllers = require('./server/controller');
  const apiRoute = ''; // '/web';
  server.use(apiRoute, controllers);

  // 匹配URL为 `/` 的路由，然后渲染 `/` 对应的 `page/index.tsx` 文件
  server.get('/', (req: Req, res: http.ServerResponse) => {
    app.render(req, res, '/')
  });

  // 匹配URL为 `/about` 的路由，然后渲染 `/about` 对应的 `page/about.tsx` 文件
  server.get('/about', (req: Req, res: http.ServerResponse) => {
    app.render(req, res, '/about')
  });

  // 匹配URL为 `/detail/:id` 的路由，添加 `params 参数`，然后渲染 `/detail` 对应的 `page/detail.tsx` 文件
  server.get('/detail/:id', (req: Req, res: http.ServerResponse) => {
    app.render(req, res, '/detail', {
      id: req.params.id
    })
  });

  server.get('*', (req: http.IncomingMessage, res: http.ServerResponse) => {
    return handle(req, res);
  });

  server.listen(3000, (err: any) => {
    if (err) throw err;
    console.log('> Ready on http://localhost:3000');
  });
}
```

### 4.4 路由方法
#### 路由拦截 Router.beforePopState
在浏览器端执行，需要组件加载完 `componentDidMount/useEffect` 执行，不然会报错
```js
// src/pages/index.tsx
import Link from 'next/link';
import /* Router, */ { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import Layout from '@/components/layout';
import styles from '@/styles/index.scss';

/**
 * 首页，路由为 '/'
 * @param props 
 */
const Home = () => {
  const router = useRouter();

  useEffect(() => {
    // 路由拦截，会影响浏览器前进后退的渲染结果
    // Router.beforePopState(({ url, as, options }: any) => {
    //   console.log('url: ', url);
    //   console.log('as: ', as);
    //   console.log('options: ', options);
      
    //   if (as === '/about') {
    //     console.log('about');
    //     return true;
    //   }
    //   return true;
    // });
  });

  return (
    <Layout>
      <h1>{router.query.title}</h1>
      <img className={styles.img} src="/static/images/4k-wallpaper-alps-cold-2283757.jpg" />
      <div className={styles.content}>
        <p>
          This is our blog post.
          Yes. We can have a <Link href="/link"><a>link</a></Link>.
          And we can have a title as well.
        </p>
        <h3>This is a title</h3>
        <p>And here's the content.</p>
      </div>
    </Layout>
  );
};

export default Home;
```

### 4.5 Router 事件
#### 监听路由的内部事件：

* routeChangeStart(url) - 路由开始变化的时候触发
* routeChangeComplete(url) - 路由完成变化之后触发
* routeChangeError(err, url) - 路由变化发生错误时触发
* beforeHistoryChange(url) - 改变浏览器历史纪录之前触发
* hashChangeStart(url) - hash 开始变化的时候触发
* hashChangeComplete(url) - hash完成变化之后触发

示例：
```js
import Router from 'next/router';

const handleRouteChange = url => {
  console.log('App is changing to: ', url);
};

Router.events.on('routeChangeStart', handleRouteChange);
```

#### 路由跳转
```js
// 正常路由跳转，在about页面获取路由信息的时候，id为a11，
// 刷新页面则id为asss，所以尽量二者一致，避免不必要的问题
Router.push('/about?id=a11', '/about/asss')
```
* **Shallow Routing：浅路由**

不执行 getInitialProps 的情况下修改页面 URL,
```js
Router.push('/about?id=a11', '/about/asss', { shallow: true });
```

## 5、App

_app 组件不会被销毁，除非手动刷新
```js
// src/pages/_app.tsx
import React from 'react';
import { NextComponentType } from "next";
import { Router } from 'next/router';
import App, { AppProps } from 'next/app';

interface Props {
  Component: NextComponentType,
  pageProps: AppProps,
  router: Router
}

/**
 * App 
 */
class myApp extends App<Props> {

  public constructor(props: Props) {
    super(props);
  }
  
  public componentDidUpdate() {
    console.log('router: ', this.props.router);
  }
  
  public componentDidMount() {
    console.log('router: ', this.props.router);
  }

  public render() {
    const { Component, pageProps } = this.props;

    return (
      <React.Fragment>
        <Component {...pageProps} />
      </React.Fragment>
    );
  }
}

export default myApp;
```

## 6、组件
### 6.1 getInitialProps 属性：
接收一个方法，可以在这个方法里面获取数据，在服务端渲染；只能在 pages/ 下的组件使用 [文档](https://nextjs.org/docs#fetching-data-and-component-lifecycle)

**在当前路由刷新才会在服务端执行，如果是从其他路由跳转过来的，没有刷新页面就会在浏览器端执行的；**

```js
// src/pages/detail.tsx
import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';
import { inject, observer } from 'mobx-react';
import { homeStoreType } from '@/store/home';
import { Button, Row } from 'antd';
import Layout from '@/components/layout';
import styles from '@/styles/detail.scss';

function Detail(props: any) {
  const router = useRouter();
  const homeStore: homeStoreType = props.homeStore;

  return (
    <Layout>
      <Head>
        <title>Detail</title>
      </Head>
      <p className={styles.detail}>This is the detail page!</p>
      id: { router.query.id }
      <Row>
        count: { homeStore.count }
      </Row>
      <Button 
        onClick={() => homeStore.setCount(homeStore.count+1)}
      >count++</Button>
    </Layout>
  );
}

Detail.getInitialProps = async function(context: any) {
  /**
   * 在当前路由刷新的话，context.req 为真，服务端才有 req/res，在命令行打印 'broswer'；
   * 如果是其他路由跳转过来没有刷新页面的话，context.req 为假，在浏览器控制台打印,
   * 此时 document.title 是 跳转之前的页面 title；
   */
  console.log('render-type: ', context.req ? 'server' : 'broswer');

  return {
    // data: 'detail'
  };
}

const DetailWithMobx = inject('homeStore')(
  observer(Detail)
);

export default DetailWithMobx;
```

接收的方法有一个形参 `context = { pathname, query, asPath, req, res, err }`：

* pathname: URL pathname 中的固定的部分，如 定义的`/post/:id`，则这里pathname为`/post`
* query: URL的查询参数的对象
* asPath - 定义的路由，如 `/post/:id`
* req: HTTP request object (server only)
* res: HTTP response object (server only)
* err: 渲染期间的报错

### 6.2 动态 import
使用 `dynamic` 和 `import()` 实现动态组件；     
dynamic 第二个参数是一个对象，loading 字段是加载完成前的 loading

```js
// src/components/about.tsx
import dynamic from 'next/dynamic';
import Head from 'next/head';
import React from 'react';
import Layout from '@/components/layout';
import styles from '@/styles/about.scss';

const Hello = dynamic(
  () => import('../components/hello-world/index'),
  { loading: () => <p>...</p> }
);

function About() {
  return (
    <Layout>
      <Head>
        <title>about</title>
      </Head>
      <p className={styles.about}>This is the about page</p>
      <Hello />
    </Layout>
  );
}

// About.getInitialProps = async function(context: any) {
//   return {
//     data: 'about'
//   };
// }

export default About;
```


## 7、路径别名
使用 `babel-plugin-module-alias`，直接配置 webpack 是无效的

```shell
yarn add babel-plugin-module-alias -D
```

* 配置 .babelrc

```json
{
  "plugins": [
    ["module-alias", { "src": "./src", "expose": "@" }]
  ],
  "presets": [
    "next/babel",
  ]
}
```

* tsconfig.json

```json
{
  "compilerOptions": {
    ...
    "baseUrl": "src",
    "paths": {
      "@/*": ["./*"]
    },
  },
  ...
}
```

## 8、使用 SCSS
**官方插件：**
[@zeit/next-sass](https://github.com/zeit/next-plugins/tree/master/packages/next-sass)

### 8.1 SASS
#### 安装
```
npm install --save @zeit/next-sass node-sass
```
或
```
yarn add @zeit/next-sass node-sass
```

#### 配置
配置后，使用跟react里面使用CSS modules一样
```js
// next.config.js
const withSass = require('@zeit/next-sass')
module.exports = withSass({
  cssModules: true, // 默认 false，即全局有效
  cssLoaderOptions: {
    importLoaders: 1,
    localIdentName: "[local]___[hash:base64:5]",
  }
})
```

或者自定义
```js
// next.config.js
const withSass = require('@zeit/next-sass')
module.exports = withSass({
  webpack(config, options) {
    return config
  }
})
```

#### 使用 postcss
项目根目录下，新建一个文件 postcss.config.js
```js
// postcss.config.js
module.exports = {
  plugins: {
    'autoprefixer': true
  }
}
```

## 9、antd
参考这位大佬的 [文章](https://www.cnblogs.com/1wen/p/10793868.html)，
主要就是 `cssModules` 和 `antd按需加载` 一起使用的问题，其他的按照 antd 官网的搞就可以，antd-mobile 只要将 相应的antd 改为 antd-mobile 就可以了

### .babelrc
```
{
  "plugins": [
    // "transform-decorators-legacy",
    ["@babel/plugin-proposal-decorators", { "legacy": true }],
    ["module-alias", { "src": "./src", "expose": "@" }],
    ["import", { "libraryName": "antd", "style": "css" }]
  ],
  "presets": [
    "next/babel",
  ]
}
```

### next.config.js
以下是公共配置，会合并到 next.config.js 的配置中
```js
// config/config.common.js
const path = require('path');
const cssLoaderGetLocalIdent = require('css-loader/lib/getLocalIdent.js');
// const isProd = process.env.NODE_ENV === 'production';

if (typeof require !== 'undefined') {
  require.extensions['.css'] = file => { }
}

/* 公共配置 */
let configCommon = {
  // assetPrefix: isProd ? 'https://cdn.mydomain.com' : '',
  crossOrigin: 'anonymous',
  cssModules: true,
  cssLoaderOptions: {
    importLoaders: 1,
    localIdentName: "[local]___[hash:base64:5]",
    getLocalIdent: (context, localIdentName, localName, options) => {
      const hz = context.resourcePath.replace(context.rootContext, '');
      // 排除 node_modules 下的样式
      if (/node_modules/.test(hz)) {
        return localName;
      }
      return cssLoaderGetLocalIdent(context, localIdentName, localName, options);
    }
  },
  distDir: 'next-build', // 构建输出目录，默认 '.next'
  generateEtags: true, // 控制缓存的 etag，默认 true
  pageExtensions: ['tsx', 'jsx', 'js', 'scss'], // pages文件夹下的文件后缀
  webpack(config){
    if(config.externals){
      // 解决 打包css报错问题
      const includes = [/antd/];
      config.externals = config.externals.map(external => {
        if (typeof external !== 'function') return external;
        return (ctx, req, cb) => {
          return includes.find(include =>
            req.startsWith('.')
              ? include.test(path.resolve(ctx, req))
              : include.test(req)
          )
            ? cb()
            : external(ctx, req, cb);
        };
      });
    }
    return config;
  }
};

module.exports = configCommon;
```


## 10、状态管理 MobX
跟这篇 [React+Typescript](https://juejin.im/post/5d3faa3a5188255d2e32c6e3) 的单页面SPA项目里的差不多，只是服务端渲染 没有 `window`；所以缓存这里先判断一下是否浏览器，然后再去使用浏览器 API( `sessionStorage` )；

不过刷新会有一个数据变化的过程，因为实际上 `_app.txs` 是在服务端渲染的，缓存是在浏览器恢复的，有个时间差，而且会有警告(其实可以忽略，服务器跟客户端的这个缓存不需要同步，使用 `sessionStorage` 也是因为不需要长久缓存，当然可以根据需要改为 `localStorage` )，根据需求取舍吧

> 单页面SPA 因为是在浏览器渲染所以不会有这样的问题

![](../static/images/next-js-10.png)
```js
const isBroswer: boolean = process.browser;
```

### 10.1 项目入口
```js
// src/pages/_app.tsx
import { NextComponentType } from "next";
import { Router } from 'next/router';
import App, { AppProps } from 'next/app';
import React from 'react';
import { Provider } from 'mobx-react';
import store from '../store';

interface Props {
  Component: NextComponentType,
  pageProps: AppProps,
  router: Router
}

/**
 * App 
 */
class myApp extends App<Props> {

  public constructor(props: Props) {
    super(props);
  }
  
  public componentDidUpdate() {
    console.log('router: ', this.props.router);
  }
  
  public componentDidMount() {
    console.log('router: ', this.props.router);
  }

  public render() {
    const { Component, pageProps } = this.props;

    return (
      <React.Fragment>
        <Provider {...store}>
          <Component {...pageProps} />
        </Provider>
      </React.Fragment>
    );
  }
}

export default myApp;
```

### 10.2 模块
监听数据使用 `autorun`，会在数据变化时执行一次；然后用 `toJS` 将模块转化为 `JS对象`
```js
// src/store/home.ts
import * as mobx from 'mobx';

// 禁止在 action 外直接修改 state 
mobx.configure({ enforceActions: "observed"});
const { observable, action, computed, runInAction, autorun } = mobx;

const isBroswer: boolean = process.browser;

/**
 * 所以缓存这里先判断一下是否浏览器，然后再去使用浏览器 API( `sessionStorage` )；
 * 不过会有一个闪现的过程，因为实际上 `_app.txs` 是在服务端渲染的，缓存是在浏览器恢复的，
 * 有个时间差，而且会有警告，根据需求取舍吧
 */
let cache = isBroswer && window.sessionStorage.getItem('homeStore');

// 初始化数据
let initialState = {
  count: 0,
  data: {
    time: '2019-11-20'
  },
};

// 缓存数据
if (isBroswer && cache) {
  initialState = {
    ...initialState,
    ...JSON.parse(cache)
  }
}

class Home {
  @observable
  public count = initialState.count;

  @observable
  public data = initialState.data;

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

  // public setCountFlow = flow(function *(_count: number) {
  //   yield setTimeout(() => {}, 1000);
  //   this.count = _count;
  // })
}

const homeStore = new Home();

// 数据变化后触发，数据缓存
autorun(() => {
  const obj = mobx.toJS(homeStore);
  isBroswer && window.sessionStorage.setItem('homeStore', JSON.stringify(obj));
});

export type homeStoreType = typeof homeStore;
export default homeStore;
```

### 10.3 模块管理输出
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

### 10.4 组件使用
这里是函数组件的使用，类组件的使用可以看 [这里](https://juejin.im/post/5d3faa3a5188255d2e32c6e3#heading-27)
```js
// src/pages/detail.tsx
import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';
import { inject, observer } from 'mobx-react';
import { homeStoreType } from '@/store/home';
import { Button, Row } from 'antd';
import Layout from '@/components/layout';
import styles from '@/styles/detail.scss';

function Detail(props: any) {
  const router = useRouter();
  const homeStore: homeStoreType = props.homeStore;

  return (
    <Layout>
      <Head>
        <title>Detail</title>
      </Head>
      <p className={styles.detail}>This is the detail page!</p>
      id: { router.query.id }
      <Row>
        count: { homeStore.count }
      </Row>
      <Button 
        onClick={() => homeStore.setCount(homeStore.count+1)}
      >count++</Button>
      <Button 
        onClick={() => homeStore.setCountAsync(homeStore.count+1)}
      >countAsync++</Button>
    </Layout>
  );
}

Detail.getInitialProps = async function(context: any) {
  /**
   * 在当前路由刷新的话，context.req 为真，服务端才有 req/res，在命令行打印 'broswer'；
   * 如果是其他路由跳转过来没有刷新页面的话，context.req 为假，在浏览器控制台打印,
   * 此时 document.title 是 跳转之前的页面 title；
   */
  console.log('render-type: ', context.req ? 'server' : 'broswer');

  return {
    data: 'detail'
  };
}

const DetailWithMobx = inject('homeStore')(
  observer(Detail)
);

export default DetailWithMobx;
```


## 11、服务端

### 11.1 server.ts
`server.ts` 改动后，需要在命令行手动执行 `tsc server.ts` 生成 `server.js`，才能执行（暂时就这么搞吧）；在 npm script 里面直接写好就ok了；不知道怎么自动编译+重启服务

#### next(opts: object)

opts有以下属性：
* dev (bool): 是否开发环境 development - 默认 false
* dir (string): Next 项目的位置 - 默认 '.'
* quiet (bool): 隐藏包含服务器信息的错误消息 - 默认 false
* conf (object): 与在 next.config.js 中的对象一样 - 默认 {}

```js
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ 
  dev,
  dir: '.',
  quiet: false,
  conf: {}
});
```

#### 动态资源前缀 assetPrefix
比如本地、线上使用cdn的话资源就和页面的服务器不是同一台了

![](../static/images/next-js-11.1.png)

```ts
// server.ts
const express = require('express');
const next = require('next');
import * as http from "http";

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

interface Req extends http.IncomingMessage {
  params?: any,
}

app
  .prepare()
  .then(() => {
    serverRun();
  })
  .catch((ex: any) => {
    console.log(ex.stack);
    process.exit(1);
  });
  
function serverRun() {
  const server = express();
  // api接口
  const controllers = require('./server/controller');
  const apiRoute = ''; // '/web';
  server.use(apiRoute, controllers);

  // 匹配URL为 `/` 的路由，然后渲染 `/` 对应的 `page/index.tsx` 文件
  server.get('/', (req: Req, res: http.ServerResponse) => {
    app.render(req, res, '/')
  });

  // 匹配URL为 `/about` 的路由，然后渲染 `/about` 对应的 `page/about.tsx` 文件
  server.get('/about', (req: Req, res: http.ServerResponse) => {
    app.render(req, res, '/about')
  });

  // 匹配URL为 `/detail/:id` 的路由，添加 `params 参数`，然后渲染 `/detail` 对应的 `page/detail.tsx` 文件
  server.get('/detail/:id', (req: Req, res: http.ServerResponse) => {
    app.render(req, res, '/detail', {
      id: req.params.id
    })
  });

  server.get('*', (req: http.IncomingMessage, res: http.ServerResponse) => {
    return handle(req, res);
  });

  server.listen(3000, (err: any) => {
    if (err) throw err;
    console.log('> Ready on http://localhost:3000');
  });
}
```

### 11.2 写个接口
使用默认的 express
> 本来是要改成 koa 的，但是路由那里页面会渲染，服务端渲染的页面看网络请求确是404，内容倒是渲染出来了(在 server-koa.ts )。。。

#### 模块
```js
// server/controllers/user.js
const Router = require('express').Router();

Router.get('/userInfo/:id', (req, res) => {
  console.log('id: ', req.params.id);
  
  res.send({
    status: 200,
    data: {
      name: '小屁孩',
      sex: '男',
      age: '3'
    },
    message: ''
  });
});

module.exports = Router;
```

#### 模块管理
```js
// server/controller.js
const Router = require('express').Router();
const user = require('./controllers/user');

Router.use('/user', user);

module.exports = Router;
```

#### 挂载到 server 服务
```js
// server.ts
// ...

function serverRun() {
  const server = express();
  // api接口
  const controllers = require('./server/controller');
  const apiRoute = ''; // '/web';
  server.use(apiRoute, controllers);
  
  // ...
}
```

#### 接口调用
```js
// src/pages/about.tsx
fetch('/user/userInfo/2').then(res => res.json())
.then(res => {
  console.log('fetch: ', res);
})
```

nginx 在本地部署，请求被代理(`proxy_pass`)到 `next-test` 的服务(pm2 启动)，请求响应的截图：
![](../static/images/next-js-11.2.png)

## 12、构建
npm script: 
```js
// package.json
...
 "scripts": {
    "dev": "node server.js",
    "dev:tsc": "tsc server.ts",
    "build": "next build",
    "start": "cross-env NODE_ENV=production node server.js"
  },
...
```

开发环境：
```
yarn dev
```

打包：
```
yarn build
```
然后产生的 `next-build` 文件夹 (next-build 是配置好的输出目录)


## 13、部署
不知道为什么，把项目放在 nginx 下新建的 html 文件夹下( `/usr/local/etc/nginx/html/next-test` ) 启动项目和nginx，浏览器访问一直都是502（单页面SPA的倒是正常）。。。放到别的目录下启动就可以( `/usr/local/website/next-test` )。。。不知道是不是 macOS 的原因，找时间在 linux 上面试试～
所以把项目都放 `/usr/local/website/` 下面了

### 13.1 pm2
使用 pm2，可以在本机测试，但是最终部署还是服务器
```
yarn global add pm2
```

终端进入项目目录下，然后：
#### 全命令
```
pm2 start yarn --name "next-test" -- run start
```

#### 脚本
项目根目录下 deploy.sh：
```sh
#deploy.sh
pm2 start yarn --name "next-test" -- run start
```

终端进入项目目录下：
```
. deploy.sh 
```

![](../static/images/next-js-13.1.png)

几个 pm2 命令：
* pm2 show [id]: 显示某个 pm2 应用的信息
* pm2 list: 显示所有的 pm2 应用的概览
* pm2 stop [id]/all: 停止某个应用，可以多个删除，空格隔开或者全部停止
* pm2 delete [id]/all: 删除某个应用，可以多个删除，空格隔开或者全部删除
* pm2 monit: 监听 pm2 启动的应用状态
* pm2 restart: 重启
* 等等

### 13.2 Nginx 
pm2 服务运行程序，nginx 负责开启 http 服务，这里只是简单的使用

#### 几个 nginx 命令
* nginx: 启动 nginx
* nginx -t: 测试 nginx.conf 配置是否正确
* nginx -s stop: 停止 nginx
* nginx -s reload: 重启 nginx 
* 等等

#### 在本地测试的配置（mac)
> 网站代码都放 `/usr/local/website` 下

nginx.conf 配置：
```nginx

#user  nobody;
worker_processes  1;

#error_log  logs/error.log;
#error_log  logs/error.log  notice;
#error_log  logs/error.log  info;

#pid        logs/nginx.pid;


events {
    worker_connections  1024;
}

http {
    include       mime.types;
    default_type  application/octet-stream;

    #log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
    #                  '$status $body_bytes_sent "$http_referer" '
    #                  '"$http_user_agent" "$http_x_forwarded_for"';

    #access_log  logs/access.log  main;

    sendfile        on;
    #tcp_nopush     on;

    #keepalive_timeout  0;
    keepalive_timeout  65;

    gzip  on;

    upstream next-test {
	    server 127.0.0.1:3000; # next-test 启动的服务端口
    }

    # next-test
    server {
        listen       80;
        server_name  localhost; #这里配置域名

        #charset koi8-r;

        #access_log  logs/host.access.log  main;

        error_page  404              /404.html;

        # redirect server error pages to the static page /50x.html
        #
        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
            root   html;
        }

        location / {
            proxy_pass http://127.0.0.1:3000; #请求将会转发到next-test的node服务下
            proxy_redirect off;
            
            # root   html;
            index  index.html index.htm;
        }
    }

    # movie-db: 单页面SPA
    server {
        listen       81;
        server_name  localhost; #这里配置域名

        root /usr/local/website/movie-db/;

        location / {
            try_files $uri $uri/ @router;
        }

        location @router {
            rewrite ^.*$/index.html last;
        }

        # error_page  404              /404.html;

        # redirect server error pages to the static page /50x.html
        #
        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
            root   html;
        }
    }


    # HTTPS server
    #
    #server {
    #    listen       443 ssl;
    #    server_name  localhost;

    #    ssl_certificate      cert.pem;
    #    ssl_certificate_key  cert.key;

    #    ssl_session_cache    shared:SSL:1m;
    #    ssl_session_timeout  5m;

    #    ssl_ciphers  HIGH:!aNULL:!MD5;
    #    ssl_prefer_server_ciphers  on;

    #    location / {
    #        root   html;
    #        index  index.html index.htm;
    #    }
    #}
    include servers/*;
}
```

## 后续要搞的东西
### 数据库
MySQL/MongoDB 这两个吧

### GrahpQL
好像叫 **API查询语言**，主要做接口聚合的一个东西吧；为的是对 后端微服务接口的聚合，然后前端页面只要请求 **经过聚合的接口**，就不需要多次请求 **后端微服务小接口** 了；不知道理解的对不对


## 一些问题
*  从一级路由进入二级路由然后刷新，浏览器后退，URL变了但是内容不变！这是个 bug, [issues#9378](https://github.com/zeit/next.js/issues/9378), [解决](https://github.com/zeit/next.js/pull/9380)

* 在某些路由刷新后，进入其他路由导致样式丢失，查看请求 `styles.chunk.css` 并没有相关的 css，但是 `scss+css modules` 倒是转化好了（貌似只要开发环境会，打包后没遇到过）

* next.js 使用 koa 好像有点问题，服务端渲染的页面看网络请求那里会是 404，但是页面渲染出来了；要么就是动态路由(`/detail/:id`) 404。。。单独使用 koa 搭建的 node.js 服务并不会有这样的问题( [这里](https://github.com/zero9527/mdnote-service) )

<!--* 原本 接口部分也是要用 Typescript 的，遇到一点问题，暂时就不加了-->


## 参考
* 文档 [nextjs.org](https://nextjs.org/docs)
* 还有网上一些大佬的文章
