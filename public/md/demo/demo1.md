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
![详情PC](https://s1.ax1x.com/2020/06/15/NPM0je.png)

- 移动端

![首页移动端](https://s1.ax1x.com/2020/06/14/tzHIyV.md.png)
![详情移动端](https://s1.ax1x.com/2020/06/15/NPMDnH.md.png)


## 1、首页
滚动位置恢复用 [这个库](https://www.npmjs.com/package/keep-alive-comp)，之前自己写的，已发布 `npm`;
配合 `useScroll` 很简单

### 1.1 tag 是分类（目录名）
public/md/目录名

public/md/
```
.
├── demo
│   └── demo1.md
├── js
│   ├── amd-cmd.md
│   ├── evt.md
│   ├── js-review.md
│   ├── promise.md
│   └── scroll-load.md
├── mini-program
│   └── movie-db.md
├── node.js
│   ├── cmd-line.md
│   ├── directory-1.md
│   ├── directory-2.md
│   └── zr-deploy.md
├── others
│   ├── create-react-app_single-spa.md
│   ├── vue-cli3_single-spa.md
│   └── web-component.md
├── react
│   ├── React-Hook.md
│   ├── keep-alive-comp.md
│   ├── movie-db-web.md
│   ├── next-js.md
│   ├── react-keep-alive.md
│   └── react-ts-template.md
└── vue
    ├── calendar.md
    ├── clock.md
    └── uni-app.md
```

### 1.2 md.json 是列表描述文件
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

### 1.3 状态恢复

```jsx
// src/views/NoteList/index.tsx

useEffect(() => {
  restore();
}, []);

const restore = () => {
  const scTop = props.scrollRestore!();
  const _state = props.stateRestore!();
  setNoteList(_state?.noteList || []);
  setCurrentTag(_state?.currentTag);
  setTimeout(() => {
    document.body.scrollTop = scTop || 0;
    document.documentElement.scrollTop = scTop || 0;
  }, 0);
};

// 离开前保存状态
const toDetailClick = () => {
  props.beforeRouteLeave!(scrollTop, {
    noteList,
    currentTag,
  });
};
```

### 1.4 标签提取
```js
// 标签
const tags: TagItem[] = useMemo(() => {
  if (!fullNoteList) return [];
  const _tags: TagItem[] = [];
  fullNoteList[0]?.name &&
    fullNoteList?.forEach((noteItem) => {
      const hasItem: TagItem | undefined = _tags.find(
        (item) => item.name === noteItem.tag
      );
      if (hasItem) {
        hasItem.count++;
      } else {
        _tags.push({ name: noteItem.tag, count: 1 });
      }
    });
  return [{ name: '全部', count: fullNoteList.length }, ..._tags];
}, [fullNoteList]);

const onTagChange = (tag: TagItem | undefined) => {
  setCurrentTag(tag);
};

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

> 注意需要使用 `HashRouter` 才能用相对路径获取到 `public` 下的东西

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
    const realId = text.replace('<code>', '`').replace('</code>', '`');
    return `<h${level} class="heading-h${level}" id="${realId}" title="${realId}"><span>${text}</span></h${level}>`;
  };
  // 代码块
  renderer.code = function(src: string, tokens: string) {
    const codeCopyContent = encodeURI(src);
    const iconContent = `<span>复制代码</span>
    <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="copy" class="svg-inline--fa fa-copy fa-w-14 " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
    <path fill="currentColor" d="M320 448v40c0 13.255-10.745 24-24 24H24c-13.255 0-24-10.745-24-24V120c0-13.255 10.745-24 24-24h72v296c0 30.879 25.121 56 56 56h168zm0-344V0H152c-13.255 0-24 10.745-24 24v368c0 13.255 10.745 24 24 24h272c13.255 0 24-10.745 24-24V128H344c-13.2 0-24-10.8-24-24zm120.971-31.029L375.029 7.029A24 24 0 0 0 358.059 0H352v96h96v-6.059a24 24 0 0 0-7.029-16.97z"></path>
    </svg>`;
    return `<pre>
      <div class="languange">
        <span>${tokens}</span>
        <span class="copy-code" data-code="${codeCopyContent}">${iconContent}</span>
      </div>
      <div class="code-wrapper"><code class="${tokens}">${highlight(
      src,
      tokens
    )}</code></div>
    </pre>`;
  };
  // 设置链接
  renderer.link = function(href: string, title: string, text: string) {
    const _title = title || href || '';
    return `<a href="${href}" class="link" title="${_title}" target="_blank" rel="noopener noreferrer">${text}
    <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="external-link-alt" class="svg-inline--fa fa-external-link-alt fa-w-16 " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
    <path fill="currentColor" d="M432,320H400a16,16,0,0,0-16,16V448H64V128H208a16,16,0,0,0,16-16V80a16,16,0,0,0-16-16H48A48,48,0,0,0,0,112V464a48,48,0,0,0,48,48H400a48,48,0,0,0,48-48V336A16,16,0,0,0,432,320ZM488,0h-128c-21.37,0-32.05,25.91-17,41l35.73,35.73L135,320.37a24,24,0,0,0,0,34L157.67,377a24,24,0,0,0,34,0L435.28,133.32,471,169c15,15,41,4.5,41-17V24A24,24,0,0,0,488,0Z">
    </path></svg>
    </a>`;
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

### 3.3 目录生成
- 对二级标题，三级标题，四级标题生成目录
- 点击标题视图切换到响应标题下
- 滚动时，高亮响应目录标题

生成目录
```js
// src/components/MdCatalog/index.tsx
// 生成目录
const generateCate = (
  text: string,
  splitChar: string = '\n##',
  list: CatalogItem[] = []
) => {
  // 最多到四级标题h4 ####
  if (splitChar === '\n#####') return [];
  const cateList: CatalogItem[] = [];
  const content = text.slice(text.indexOf('\n'), text.length);
  const cateArr = content.split(`${splitChar} `);
  cateArr.shift();

  cateArr.forEach((cate) => {
    const id = cate.substring(0, cate.indexOf('\n')).trim();
    const cateItem: CatalogItem = {
      id,
      header: `catelog-${id}`,
      label: id,
      child: [],
    };

    const cateItemChild = generateCate(cate, `${splitChar}#`);
    if (cateItemChild.length) cateItem.child = cateItemChild;

    cateList.push(cateItem);
  });
  return list.concat(cateList);
};
```

### 3.4 复制代码、图片处理
```js
// src/views/NoteDetail/index.tsx
// 点击事件代理
const onMdContentClick = () => {
  const mdContent = document.querySelector('#md-content') as HTMLElement;
  mdContent.onclick = function(e: any) {
    onCopyCode(e);
    onImgClick(e);
  };
  // 需要初始化一次，不然要点击两次才能复制
  const copyCodeElems = document.querySelectorAll(
    '#md-content .copy-code'
  ) as NodeList;
  Array.from(copyCodeElems).forEach((el: HTMLElement) => {
    el.onmouseenter = function(e: any) {
      onCopyCode(e);
    };
  });
};


// 复制代码
const onCopyCode = (e: any) => {
  const copyCodeEl: HTMLElement | null = e.target?.closest('.copy-code');
  if (!copyCodeEl || !copyCodeEl.dataset.code) return;

  const text = copyCodeEl.querySelector('span')!;
  const realCode = decodeURI(copyCodeEl.dataset.code);

  clipboard.current = new ClipboardJS(copyCodeEl, {
    action: () => 'copy',
    text: () => realCode,
  });
  clipboard.current.on('success', () => restoreText('复制成功'));
  clipboard.current.on('error', () =>
    restoreText('<span style="color:red;">复制失败</span>')
  );

  const restoreText = (innerHTML: string) => {
    text.innerHTML = innerHTML;
    clipboard.current?.destroy();
    setTimeout(() => {
      text.innerHTML = '复制代码';
    }, 2000);
  };
};

// 图片点击新窗口打开
const onImgClick = (e: any) => {
  const imgEl: HTMLImageElement | null = e.target?.closest('.md-img');
  if (imgEl) {
    window.open(imgEl.src);
    // updatePicPreview({
    //   show: true,
    //   src: img.src,
    //   alt: img.alt,
    //   onClose: onClosePicPreview,
    // });
  }
};

```

### 3.5 回顶部按钮
`定时器`+自定义Hook `useWindowClick` 实现滚动可中断（滚动时，点击页面任意处就停止滚动）
```js
import React, { CSSProperties, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDoubleUp } from '@fortawesome/free-solid-svg-icons';
import useWindowClick from '@/utils/useWindowClick';
import styles from './styles.scss';

export interface Scroll2TopProps {
  position?: CSSProperties;
}

// 回到顶部
const Scroll2Top: React.FC<Scroll2TopProps> = ({ position }) => {
  const scrollTop = useRef(0);
  const canScroll = useRef(false); // 允许滚动

  // 全局点击
  const onWindowClick = () => {
    onRemoveClick();
  };

  const onRemoveClick = () => {
    canScroll.current = false;
    removeListener();
  };

  const { addListener, removeListener } = useWindowClick(onWindowClick);

  const onScroll2oTop = (e: React.MouseEvent) => {
    e.stopPropagation();
    scrollTop.current =
      document.body.scrollTop || document.documentElement.scrollTop;
    canScroll.current = true;
    addListener();
    scrollHandler();
  };

  const scrollHandler = () => {
    let scTop = document.body.scrollTop || document.documentElement.scrollTop;
    if (scTop > 0) {
      document.body.scrollTop -= 100;
      document.documentElement.scrollTop -= 100;

      if (canScroll.current) setTimeout(scrollHandler, 16);
    } else {
      onRemoveClick();
    }
  };

  return (
    <div className="gitter">
      <div
        style={position}
        className={`btn ${styles.scroll2top}`}
        onClick={(e: any) => onScroll2oTop(e)}
      >
        <FontAwesomeIcon icon={faAngleDoubleUp} />
      </div>
    </div>
  );
};

export default Scroll2Top;
```


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
