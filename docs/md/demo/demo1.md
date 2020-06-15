# md-note 说明

## 前言
大概说一下：
* React+Hook+TypeScript+single-spa
* scss+css-module
* markdown 渲染使用 [marked.js](https://marked.js.org)，语法高亮使用 [highlight.js](https://highlightjs.org/) 
* 主题切换


## 一些预览图
- PC

![首页PC](https://s1.ax1x.com/2020/06/14/tzHQR1.png)
![详情PC](https://s1.ax1x.com/2020/06/14/tzHVqU.png)

- 移动端

![首页移动端](https://s1.ax1x.com/2020/06/14/tzHIyV.md.png)
![详情移动端](https://s1.ax1x.com/2020/06/14/tzHnIJ.md.png)


## 1、首页
滚动位置恢复用 [这个库](https://www.npmjs.com/package/keep-alive-comp)，之前自己写的，已发布 `npm`;
配合 `useScroll` 很简单

### tag 是分类（目录名）
public/md/目录名

public/md/
```
.
├── demo
│   ├── demo1.md
│   └── promise_This_is.md
├── js
│   ├── amd-cmd.md
│   ├── evt.md
│   ├── js-review.md
│   ├── promise.md
│   └── scroll-load.md
├── mini-program
│   └── movie-db.md
├── node.js
│   ├── cmd-line.md
│   ├── directory-1.md
│   └── directory-2.md
├── others
│   ├── create-react-app_single-spa.md
│   ├── vue-cli3_single-spa.md
│   └── web-component.md
├── react
│   ├── React-Hook.md
│   ├── keep-alive-comp.md
│   ├── movie-db-web.md
│   ├── next-js.md
│   ├── react-keep-alive.md
│   └── react-ts-template.md
└── vue
    ├── calendar.md
    └── uni-app.md
```

### md.json 是列表描述文件
```json
[
  {
    "tag": "demo",
    "name": "demo1.md",
    "title": "MD-Note说明",
    "create_time": "2019/10/01 00:00:00"
  },
]
```

```jsx
// src/views/NoteList/index.tsx
import React, { useEffect, useMemo } from 'react';
import { KeepAliveAssist } from 'keep-alive-comp';
import { Link } from 'react-router-dom';
import useGlobalModel from '@/model/useGlobalModel';
import useNoteModel from '@/model/useNoteModel';
import useScroll from '@/utils/useScroll';
import Header from '@/components/Header';
import Tools from '@/components/Tools';
import RightPanel from '@/components/RightPanel';
import Scroll2Top from '@/components/Scroll2Top';
import useDebounce from '@/utils/useDebounce';
import styles from './styles.scss';

interface NoteListProps extends KeepAliveAssist {}

// 列表
const NoteList: React.FC<NoteListProps> = (props) => {
  const { loading, noteList } = useNoteModel();
  const { scrollTop } = useScroll();
  const { stickyRightStyle } = useGlobalModel((modal) => [
    modal.stickyRightStyle,
  ]);

  useEffect(() => {
    restore();
  }, []);

  const restore = () => {
    const scTop = props.scrollRestore!();
    setTimeout(() => {
      document.body.scrollTop = scTop || 0;
      document.documentElement.scrollTop = scTop || 0;
    }, 0);
  };

  const toDetailClick = () => {
    props.beforeRouteLeave!(scrollTop, {});
  };

  const showScroll2Top = useMemo(() => {
    return scrollTop > window.innerHeight;
  }, [scrollTop]);

  const ReachBottom = () => (
    <div className={styles['reach-bottom']}>
      <span>到底了</span>
    </div>
  );

  return (
    <>
      <Header className={styles.header}>
        <div className="center-content content">
          <div>
            MD-NOTE
            <span className={styles.desc}>：一个使用 markdown 的简易博客</span>
          </div>
          <Tools />
        </div>
      </Header>
      <main className={`center-content ${styles['note-list']}`}>
        <section
          id={loading ? styles.skeleton : ''}
          className={`container ${styles.container}`}
        >
          {noteList?.length > 0 ? (
            <>
              {noteList?.map?.((noteitem) => {
                return (
                  <Link
                    to={`/detail/${noteitem.tag}/${noteitem.name}`}
                    className={`link ${styles.item}`}
                    key={`${noteitem.tag}-${noteitem.name}`}
                    onClick={toDetailClick}
                  >
                    <div className={styles.title}>{noteitem.title}</div>
                    <div className={styles.desc}>
                      <span className={styles.tag}>
                        标签：<span>{noteitem.tag}</span>
                      </span>
                      <span className={styles.time}>
                        创建时间：{noteitem.create_time}
                      </span>
                    </div>
                  </Link>
                );
              })}
              <ReachBottom />
            </>
          ) : (
            <div>没有数据</div>
          )}
        </section>
        {showScroll2Top && <Scroll2Top position={stickyRightStyle} />}
      </main>
      <RightPanel />
    </>
  );
};

export default NoteList;
```


## 2、主题切换
`scss` 函数实现，通过

- 在 `html` 设置 `data-theme` 
- 然后 `scss` 生成的对应 `data-theme` 值的样式，
- 匹配到就显示对应的样式配置
- `sass-resources-loader` 自动引入，不用每次手动引入
- 使用的地方，`@include` `@mixin 函数名`，样式名不变，值改为 `themed(配置的变量)`， 如 `color: themed('primary-color');`


### 2.1 定义主题内容

```scss
// src/theme/index.scss
$mask-bg: rgba(50, 50, 50, 0.6);
$box-shadow: 0px 1px 1px -2px rgba(0, 0, 0, 0.8);

$base: (
  base-color: #3e3e3e,
  desc-color: #666,
  second-color: #999,
  gray-color: #cccccc,
  border-color: #e9e9e9,
  bg-color: #fefefe,
  bg-color-light: #f6f6f6,
  bg-color-heavy: #f1f1f1,
  linear-background-0:
    linear-gradient(0deg, rgba(255, 255, 255, 0.8), rgb(255, 255, 255)),
  linear-background-180:
    linear-gradient(180deg, rgba(255, 255, 255, 0.8), rgb(255, 255, 255)),
);

$blue: (
  primary-color: rgba(80, 152, 228, 0.8),
  primary-color-light: rgba(80, 152, 228, 0.6),
  primary-color-heavy: rgba(80, 152, 228, 1),
  primary-bg-color: rgba(80, 152, 228, 0.05),
);

$red: (
  primary-color: rgba(228, 82, 80, 0.8),
  primary-color-light: rgba(228, 82, 80, 0.6),
  primary-color-heavy: rgba(228, 82, 80, 1),
  primary-bg-color: rgba(228, 82, 80, 0.05),
);

$orange: (
  primary-color: rgba(228, 149, 80, 0.8),
  primary-color-light: rgba(228, 149, 80, 0.6),
  primary-color-heavy: rgba(228, 149, 80, 1),
  primary-bg-color: rgba(228, 149, 80, 0.05),
);

$green: (
  primary-color: rgba(0, 150, 136, 0.8),
  primary-color-light: rgba(0, 150, 136, 0.6),
  primary-color-heavy: rgba(0, 150, 136, 1),
  primary-bg-color: rgba(0, 150, 136, 0.05),
);

$purple: (
  primary-color: rgba(198, 37, 239, 0.8),
  primary-color-light: rgba(198, 37, 239, 0.6),
  primary-color-heavy: rgba(198, 37, 239, 1),
  primary-bg-color: rgba(198, 37, 239, 0.05),
);

$dark: (
  base-color: #ccc,
  desc-color: #666,
  second-color: #999,
  primary-color: rgba(80, 152, 228, 0.8),
  primary-color-light: rgba(80, 152, 228, 0.6),
  primary-color-heavy: rgba(80, 152, 228, 1),
  primary-bg-color: rgba(80, 152, 228, 0.05),
  gray-color: #464444,
  border-color: #2e2e2e,
  bg-color: #232426,
  bg-color-light: #292b2d,
  bg-color-heavy: #1e1f21,
  linear-background-0:
    linear-gradient(0deg, rgba(35, 36, 38, 0.8), rgb(35, 36, 38)),
  linear-background-180:
    linear-gradient(180deg, rgba(35, 36, 38, 0.8), rgb(35, 36, 38)),
);

$themes: (
  blue: map-merge($base, $blue),
  orange: map-merge($base, $orange),
  red: map-merge($base, $red),
  green: map-merge($base, $green),
  purple: map-merge($base, $purple),
  dark: $dark,
);

@mixin themeify {
  @each $theme-name, $theme-map in $themes {
    $theme-map: $theme-map !global;
    html[data-theme='#{$theme-name}'] & {
      @content;
    }
  }
}

@function themed($key) {
  @return map-get($theme-map, $key);
}
```

### 2.2 加一个loader
这样就不需要每次在用到的地方，都手动引入一遍

```shell
yarn add -D sass-resources-loader
```

```js
{
  loader: 'sass-resources-loader',
  options: {
    resources: [path.resolve(__dirname, './../src/theme/index.scss')],
  },
}
```


### 2.3 主题颜色值使用
```scss
.theme {
  @include themeify {
    color: themed('primary-color');
  }
}
```

### 2.4 主题切换
```js
// src/components/ChangeTheme/index.tsx
import React from 'react';
import useGlobalModel from '@/model/useGlobalModel';
import styles from './styles.scss';

interface ThemeItem {
  text: string;
  color: string;
}

const ChangeTheme = () => {
  const { theme, setTheme } = useGlobalModel((modal) => [
    modal.theme,
    modal.setTheme,
  ]);
  const themesConfig: ThemeItem[] = [
    {
      text: '白兰',
      color: 'blue',
    },
    {
      text: '暗夜',
      color: 'dark',
    },
    {
      text: '橘橙',
      color: 'orange',
    },
    {
      text: '小红',
      color: 'red',
    },
    {
      text: '浅绿',
      color: 'green',
    },
    {
      text: '媚紫',
      color: 'purple',
    },
  ];

  const onThemeChange = (color: string) => {
    setTheme(color);
  };

  return (
    <span>
      {themesConfig.map((item) => (
        <span
          key={item.color}
          className={`${styles.color} ${
            item.color === theme ? styles.theme : ''
          }`}
          onClick={() => onThemeChange(item.color)}
        >
          {item.text}&nbsp;
        </span>
      ))}
    </span>
  );
};

export default ChangeTheme;
```


## 3、详情页面

### 3.1 内容获取
直接异步请求 `public/md/` 下面的 `markdown` 文件

```js
// src/model/useNoteModel.ts
// 请求数据 tag: 标签；name：名称
const fetchNoteByName = async (tag: NoteTag | string, name: string) => {
  try {
    const res: any = await fileApi(`/${tag}/${name}`);
    return { code: 0, data: res, msg: 'ok' };
  } catch (err) {
    console.error('fetch error: ', err);
  }
  return { code: -2, data: null, msg: 'error' };
};

// src/api/file.ts
// 获取文件
export function fileApi(uri: string, params: any = {}) {
  return axios.get(`./md${uri}`, {
    data: { ...params },
  });
}
```

### 3.2 内容渲染
`marked` 设置自定义渲染

默认：
* 标题 id 会被去掉 `英文特殊字符`，
* 链接不在新窗口打开

```typescript
// marked 样式
const markedHighlight = () => {
  // 渲染设置
  const renderer = new marked.Renderer();
  // 设置标题，生成目录跳转需要
  renderer.heading = function(text: string, level: number) {
    return `<h${level} class="heading-h${level}" id="${text}" title="${text}"><span>${text}</span></h${level}>`;
  };
  // 代码块
  renderer.code = function(src: string, tokens: string) {
    return `<pre>
      <span class="languange">${tokens}</span>
      <span class="code-wrapper"><code class="${tokens}">${highlight(
      src,
      tokens
    )}</code></span>
    </pre>`;
  };
  // 设置链接
  renderer.link = function(href: string, title: string, text: string) {
    return `<a href="${href}" title="${title}" target="_blank">${text}</a>`;
  };
  // 给图片添加类名，添加点击事件，方便点击查看大图
  renderer.image = function(src: string, alt: string) {
    return `<img src="${src}" alt="${alt || ''}" class="md-img" />`;
  };

  marked.setOptions({
    renderer,
    highlight,
    langPrefix: '',
    pedantic: false,
    gfm: true,
    tables: true,
    breaks: false,
    sanitize: false,
    smartLists: true,
    smartypants: false,
    xhtml: false,
  });
};
```

### 3.3 目录
- 对二级标题，三级标题生成目录
- 点击标题视图切换到响应标题下
- 滚动屎，高亮响应目录标题


## 4、一些自定义 Hook

### usePrevState
获取上一次的值
```ts
// src/utils/usePrevState.ts
import { useRef, useEffect, useState } from 'react';

function usePrevState<T>(state: T) {
  const countRef = useRef<any>(null);
  const [_state, setState] = useState<T>(state);

  useEffect(() => {
    countRef.current = _state;
    setState(state);
  }, [state]);

  // prevState
  return countRef.current;
}

export default usePrevState;
```

### useDebounce
函数防抖
```js
import { useCallback } from 'react';

// 防抖
const useDebounce = (callback: (...param: any) => void, delay: number = 16) => {
  let timer: NodeJS.Timeout;
  let lastTime: number = 0;

  const runCallback = (...args: any) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      callback.apply(null, args);
    }, delay);
  };

  return useCallback(function(...param) {
    const thisTime = new Date().getTime();
    if (thisTime - lastTime > delay && lastTime !== 0) {
      lastTime = 0;
    } else {
      lastTime = thisTime;
    }
    runCallback(...param);
  }, []);
};

export default useDebounce;
```

### useThrottle
函数节流
```js
import { useCallback } from 'react';

// 节流
const useThrottle = (callback: () => any, delay: number = 16) => {
  let lastTime: number = 0;
  let canCallback = true;

  const restore = (time: number) => {
    lastTime = time;
    canCallback = false;
  };

  const runCallback = () => {
    callback();
  };

  return useCallback((args?: any) => {
    const thisTime = new Date().getTime();
    if (canCallback && thisTime - lastTime > delay) {
      restore(thisTime);
      runCallback.apply(null, args);
      setTimeout(() => {
        canCallback = true;
      }, delay);
      return;
    }
  }, []);
};

export default useThrottle;
```

### useScroll
滚动

使用：见 `src/components/header/index.tsx`

```ts
// src/utils/useScroll.ts
import { useEffect, useState } from 'react';
import usePrevState from './usePrevState';

// 监听window滚动
const useScroll = () => {
  const [scrollTop, setScrollTop] = useState(0);
  const prevScrollTop = usePrevState(scrollTop);

  useEffect(() => {
    onScroll();
    window.addEventListener('scroll', onScroll, false);
    return () => {
      window.removeEventListener('scroll', onScroll, false);
    };
  }, []);

  const onScroll = () => {
    const scTop = document.body.scrollTop || document.documentElement.scrollTop;
    setScrollTop(scTop || 0);
  };

  return {
    prevScrollTop,
    scrollTop,
  };
};

export default useScroll;
```

### useWindowClick
点击，可以代替 `clickOutside` 点击外部使用

使用：见 `src/components/Scroll2Top/index.tsx`

```ts
import { useEffect, useRef } from 'react';

// 添加全局点击事件，底层元素阻止冒泡则不会触发
function useWindowClick(callback: () => void) {
  const isReady = useRef(false);

  useEffect(() => {
    return () => {
      window.removeEventListener('click', onWindowClick, false);
    };
  }, []);

  const addListener = () => {
    isReady.current = true;
    window.addEventListener('click', onWindowClick, false);
  };

  const removeListener = () => {
    isReady.current = false;
    window.removeEventListener('click', onWindowClick, false);
  };

  const onWindowClick = () => {
    if (typeof callback !== 'function') {
      return console.warn('callback 不是函数！');
    }
    if (callback && isReady) {
      callback();
      removeListener();
    }
  };

  return {
    addListener,
    removeListener,
  };
}

export default useWindowClick;
```

### useFetchData

这个是之前看一位大佬的 [文章](https://juejin.im/post/5e03fe81f265da33cd03c0fd) 05，里面分享的另一篇国外的 [文章](https://www.robinwieruch.de/react-hooks-fetch-data)，然后自己根据实际使用改的

项目使用的是 [UmiJS](https://umijs.org/zh/) 框架，自带的 request，

> 使用 axios 的话也是差不多的，把 fetchFn 类型改为 <br />`fetchFn: () => Promise<AxiosResponse>;` 然后，请求函数改为 axios 相应的写法就可以了

说明：

* fetchFn: 请求函数
* deps: 更新依赖，重新执行 fetchFn
* isReady: fetchFn 执行条件

```typescript
import { useState, useEffect } from 'react';
import { RequestResponse } from 'umi-request';
import $message from './$message';

export interface UseFetchDataProps {
  fetchFn: () => Promise<RequestResponse>;
  deps?: any[];
  isReady?: boolean;
}

export type ResponseType = {
  code: number;
  data: any;
  msg: string;
}

/**
 * 自定义 Hook: 获取数据
 * @example 使用时最好这样: useFetchData<{}>，方便给 resData 提供类型
 * @type <S>：在 返回数据格式 基础上扩展的字段，如总数字段等
 * @param fetchFn {*} 使用 request 封装的请求函数
 * @param deps {*} 更新依赖，重新执行
 * @param isReady {*} 可以获取数据标志，默认直接获取数据
 *
 * @returns isLoading: 是否正在请求
 * @returns resData: 请求返回的数据
 * @returns fetchData: 请求函数，供外部调用手动请求数据
 */
export default function useFetchData<S = ResponseType>({
  fetchFn,
  deps = [],
  isReady,
}: UseFetchDataProps) {
  let isDestroyed = false;
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [resData, setResData] = useState<ResponseType>();

  useEffect(() => {
    // 默认(undefined)直接获取数据
    // 有条件时 isReady === true 再获取
    if (isReady === undefined || isReady) {
      fetchData();
    } else {
      setIsLoading(false);
    }

    return () => {
      isDestroyed = true;
    };
  }, deps);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const res: any = await fetchFn();
      if (res?.code !== 0) {
        $message.warning(res?.msg || '请求出错！');
        setIsLoading(false);
        return;
      }
      if (!isDestroyed) {
        setResData(res);
        setIsLoading(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return {
    isLoading,
    resData,
    fetchData,
  };
}
```
