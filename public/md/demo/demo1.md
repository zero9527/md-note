# md-note 说明

## 前言
大概说一下：
* React+Hook+TypeScript
* scss+css-module
* markdown 渲染使用 [marked.js](https://marked.js.org)，语法高亮使用 [highlight.js](https://highlightjs.org/) 
* 图片导出使用 [html2canvas](http://html2canvas.hertzen.com/)，纯前端操作（导出markdown同）
* 编辑器使用 [codemirror.js](https://codemirror.net/)

> **！注意：**<br>
> 不提供数据存储服务，仅使用浏览器缓存


## 1、首页

* 列表显示
  * 月份分组
* 新增


## 2、详情页面

### 内容渲染
`marked` 设置自定义渲染
* 默认标题 id 会被去掉 `英文特殊字符`，
* 链接不在新窗口打开

```typescript
// 渲染设置
const renderer = new marked.Renderer();

// 设置标题，生成目录跳转需要
renderer.heading = function(text: string, level: number) {
  return `<h${level} class="heading-h${level}" id="${text}" title="${text}">${text}</h${level}>`;
};

// 设置链接
renderer.link = function(href: string, title: string, text: string) {
  return `<a href="${href}" title="${title ||
    text}" target="_blank">${text}</a>`;
};

// 设置图片，导出图片需要
renderer.image = function(href: string, title: string, text: string) {
  return `<img src="${href}" title="${title ||
    text}" alt="${text}" style="max-height: 700px; display: inherit; margin: auto;" />`;
};
```

### 目录
* 对二级标题，三级标题生成目录
* 点击标题视图切换到响应标题下

### 操作按钮

* 编辑跳转
* 导出 `*.md` 文件
* 导出 `*.png` 图片

使用 [html2canvas](http://html2canvas.hertzen.com/)，导出前设置视图宽度为`代码块（pre>code）最大宽度`（防止导出图片截断/大片空白等问题），完成后恢复
> 使用时，有些样式是识别不了的，这个时候可以考虑，样式直接放到标签上面设置试试


## 3、编辑页面

### 3.1 支持 markdown 语法

* [marked.js](https://marked.js.org) 解析 `markdown`
* [highlight.js](https://highlightjs.org/) 代码高亮
* 编辑器使用 [codemirror.js](https://codemirror.net/)
* 编辑撤销/重做

详情`PC布局`

![详情PC布局](./images/detail-pc.png)

编辑器`PC布局`

![编辑器PC布局](./images/editor-pc.png)

详情`移动端布局`、编辑器`移动端布局`

![详情、编辑器移动端布局](./images/detail-editor-mobile.png)
<!-- ![详情移动端布局](./images/detail-mobile.png)
![编辑器移动端布局](./images/editor-mobile.png) -->

### 3.2 预览效果

* 窗口拖动(移动端小窗口)
* 可以全屏


## 4、代码示例

### usePrevState
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

### useScroll
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
    window.addEventListener('scroll', onScroll, false);
    return () => {
      window.removeEventListener('scroll', onScroll, false);
    };
  }, []);

  const onScroll = (e: any) => {
    // 移动端 body.scrollTop, PC端 documentElement.scrollTop
    const scTop = e.target.body.scrollTop || e.target.documentElement.scrollTop;
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


### 目录生成
```typescript
// src/components/mdCatalog/index.tsx
import React, {
  useEffect,
  useState,
  useMemo,
  useCallback,
  useRef,
} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faListUl, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import styles from './mdCatalog.scss';
import useScroll from '@/utils/useScroll';

export interface CatalogItem {
  id: string; // 标题的id
  header: string; // 本身的id
  label: string; // 文本
  child?: CatalogItem[];
}

export interface MdCatalogProps {
  mdtext: string;
  defaultActive?: string;
  onCateClick?: (id: string) => void;
  onGetTitle?: (title: string) => void;
}

// 根据 markdown 字符串生成 二级标题/三级标题目录
const MdCatalog: React.FC<MdCatalogProps> = ({
  mdtext,
  defaultActive,
  onCateClick,
  onGetTitle,
  ...props
}) => {
  const { scrollTop } = useScroll();
  const useScrollTop = useRef(false);
  const [showCate, setShowCate] = useState(false);
  const [cate, setCate] = useState<CatalogItem[]>([]);
  const [cateActive, setCateActive] = useState('');
  const [title, setTitle] = useState('');
  const [allcate, setAllcate] = useState<CatalogItem[]>([]);

  useEffect(() => {
    if (title) {
      document.title += `|${title}`;
      onGetTitle?.(title);
    }
  }, [title]);

  useEffect(() => {
    if (defaultActive) setCateActive(defaultActive);
  }, []);

  useEffect(() => {
    scroll2Item();
  }, [cateActive]);

  useEffect(() => {
    generate();
  }, []);

  useEffect(() => {
    if (showCate) {
      document.body.style.overflowY = 'hidden';
    } else {
      document.body.style.overflowY = 'auto';
    }
  }, [showCate]);

  useEffect(() => {
    // 铺平数据，用于 scrollHandler
    function flat(arr: any[]) {
      const list: any[] = [];
      arr.forEach((item) => {
        if (item?.child?.length) list.push(item, ...flat(item.child));
        else list.push(item);
      });
      return list;
    }
    setAllcate(flat(cate));
  }, [cate]);

  useEffect(() => {
    if (useScrollTop.current) scrollHandler();
  }, [scrollTop]);

  // 滚动时，显示高亮对应区域的标题
  const scrollHandler = () => {
    try {
      allcate.forEach((item: CatalogItem) => {
        const el = document.getElementById(item.id) as HTMLElement;
        if (el) {
          const bcr = el.getBoundingClientRect();
          if (bcr.top < 0) {
            setCateActive(item.id);
          }
        } else {
          console.log('没有元素id为： ', item.id, item);
        }
      });
    } catch (err) {
      console.error(err);
    }
  };

  const generate = () => {
    let allcateArr: string[] = [];
    const cateList: CatalogItem[] = [];
    const content = mdtext.slice(mdtext.indexOf('\n'), mdtext.length);
    setTitle(mdtext.slice(1, mdtext.indexOf('\n')));
    const cate2Arr = content.split('\n## ');

    cate2Arr.forEach((cate2) => {
      // 二级目录
      const tempcate2 = cate2.substring(0, cate2.indexOf('\n')).trim();
      const cat3Arr = cate2.split('\n### ');
      cat3Arr.shift();
      const cat2Child: CatalogItem[] = [];

      cat3Arr.forEach((cate3) => {
        // 三级目录
        const tempcate3 = cate3.substring(0, cate3.indexOf('\n')).trim();
        cat2Child.push({
          id: tempcate3,
          header: `catelog-${tempcate3}`,
          label: tempcate3,
        });
      });

      const cate2Item: CatalogItem = {
        id: tempcate2,
        header: `catelog-${tempcate2}`,
        label: tempcate2,
        child: [],
      };

      allcateArr.push(tempcate2);
      if (cat2Child.length > 0) {
        cate2Item.child = cat2Child;
        allcateArr = allcateArr.concat(cat2Child.map((i) => i.id));
      }

      cateList.push(cate2Item);
    });

    setCate(() => cateList.filter((item) => Boolean(item.id)));
  };

  const scroll2Item = () => {
    const catelogItem = document.getElementById(`catelog-${cateActive}`);
    catelogItem?.scrollIntoView();
    onCateClick?.(cateActive);
  };

  const cateClick = (cateItem: CatalogItem) => {
    const header = document.getElementById(cateItem.id) as HTMLElement;
    header?.scrollIntoView();

    useScrollTop.current = false;
    toggleBlur('remove');
    setCateActive(cateItem.id);
    onCateClick?.(cateItem.id);
    setTimeout(() => {
      setShowCate(false);
      useScrollTop.current = true;
    }, 0);
  };

  const onCateListShow = () => {
    toggleBlur('add');
    setTimeout(() => setShowCate(true), 0);
  };

  const onHiddenCatalog = () => {
    setShowCate(false);
    toggleBlur('remove');
  };

  const toggleBlur = (type: 'add' | 'remove') => {
    document.querySelector('#md-note')?.classList[type]('blur');
  };

  const renderCateItem = useCallback(
    (cateItem: CatalogItem) => {
      const className = `${styles['cate-item']} ${
        cateActive === cateItem.id ? styles.active : ''
      }`;
      return (
        <div
          data-id={cateItem.id}
          id={cateItem.header}
          className={className}
          onClick={() => cateClick(cateItem)}
        >
          {cateItem.label}
        </div>
      );
    },
    [cateActive]
  );

  const NoCate = () => (
    <div className={styles.desc}>
      <p>一级标题'#'为文章名，</p>
      <p>二级标题'##'为一级目录，</p>
      <p>三级标题'###'为三级目录</p>
    </div>
  );

  const cateListTransition = useMemo(() => {
    return showCate ? styles['cate-show'] : '';
  }, [showCate]);

  return (
    <div id="catalog" className={styles.catalog}>
      <FontAwesomeIcon
        className="btn"
        icon={faListUl}
        onClick={onCateListShow}
      />
      <div
        className={styles.bg}
        style={{ display: showCate ? 'block' : 'none' }}
      />
      <div
        className={`${styles.catelist} ${cateListTransition}`}
        onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
      >
        {showCate && (
          <span className={styles.close} onClick={onHiddenCatalog}>
            <FontAwesomeIcon icon={faChevronRight} />
          </span>
        )}
        <section className={styles.head} title={title}>
          目录: {title}
        </section>
        <section className={styles['cate-content']}>
          {cate.length > 0 ? (
            cate.map((cate2: CatalogItem) => (
              <ul key={cate2.id}>
                {renderCateItem(cate2)}
                {cate2.child &&
                  cate2.child?.length > 0 &&
                  cate2.child?.map((cate3: CatalogItem) => (
                    <ul key={cate3.id}>{renderCateItem(cate3)}</ul>
                  ))}
              </ul>
            ))
          ) : (
            <NoCate />
          )}
        </section>
      </div>
      {props.children}
    </div>
  );
};

export default MdCatalog;
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
