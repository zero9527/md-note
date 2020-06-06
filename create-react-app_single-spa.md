# create-react-app 使用 single-spa 改造

项目例子：[在线查看](http://zero9527.site/md-note)
- 主应用(React)：[md-note](https://github.com/zero9527/md-note)
- 子应用(Vue)：[vue-calendar](https://github.com/zero9527/vue-calendar)

- 主应用(Vue)：[json-util](https://github.com/zero9527/json-util)，进去后路由手动切到 `/calendar` 就能看到了（放`github`上会比较慢）

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
开发环境死活加不上，然后我去nginx设置子应用添加了，子应用放guthub Page的话已经是有加上去的，不然会跨域

### libraryTarget
这里不需要在将 `output.libraryTarget` 改为 `system`，原因我也不知道，加上会报错，我就去掉了，反正不加也正常运行。。。

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

> **注意！**<br>
> `DOM` 节点应该一直存在（如果在子应用那里设置了挂载节点 `el` 的话，默认挂载在 `body` 下面），不然放在某个组件下面，第一次进入正常，但是再回来就会报错，找不到 `el` 的那个节点

我的做法是（子应用就放在 `RightPanel` 下）
```jsx
// src/App.tsx
import React, { useEffect, Suspense, useState } from 'react';
import { useRouteMatch } from 'react-router';
import { lazy } from '@loadable/component';
import KeepAlive from 'keep-alive-comp';
import { mobileReg } from '@/utils/regx';
import Loading from '@/components/loading';
import singleSpaSetup from './single-spa-config';

singleSpaSetup();

const NoteList = lazy(() => import('@/views/noteList'));
const RightPanel = lazy(() => import('@/views/noteList/rightPanel'));

const App: React.FC = () => {
  const homePage = useRouteMatch('/');
  const [contentVisible, setContentVisible] = useState(false);

  useEffect(() => {
    setContentVisible(homePage?.isExact || false);
  }, [homePage]);

  return (
    <>
      {contentVisible && (
        <Suspense fallback={<Loading />}>
          <KeepAlive name="list">
            {(props) => <NoteList {...props} />}
          </KeepAlive>
        </Suspense>
      )}
      <RightPanel visible={contentVisible} />
    </>
  );
};

export default App;
```