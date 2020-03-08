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

操作按钮显示的状态下，点击任意外部收起
```typescript
// click outside
const onShowTools = () => {
  setBtnShow(!btnShow);
  setTimeout(() => {
    if (!btnShow) window.addEventListener('click', bodyClick);
    else window.removeEventListener('click', bodyClick);
  }, 0);
};

const bodyClick = () => {
  setTimeout(() => setBtnShow(false), 0);
  window.removeEventListener('click', bodyClick);
};

```

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

### 目录生成
```typescript
// src/components/mdCatalog/index.tsx
import React, { useEffect, useState, useMemo, CSSProperties } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faListUl } from '@fortawesome/free-solid-svg-icons';
import styles from './mdCatalog.scss';

export interface CatalogItem {
  id: string; // 标题的id
  header: string; // 本身的id
  label: string; // 文本
  child?: CatalogItem[];
}

export interface MdCatalogProps {
  mdtext: string;
  position: CSSProperties;
  defaultActive?: string;
  onCateClick?: (id: string) => void;
}

// 根据 markdown 字符串生成 二级标题/三级标题目录
const MdCatalog: React.FC<MdCatalogProps> = ({
  mdtext,
  position,
  defaultActive,
  onCateClick,
  ...props
}) => {
  const [showCate, setShowCate] = useState(false);
  const [cate, setCate] = useState<CatalogItem[]>([]);
  const [cateActive, setCateActive] = useState('');
  const [title, setTitle] = useState('');
  const [allcate, setAllcate] = useState<string[]>([]);

  useEffect(() => {
    if (defaultActive) setCateActive(defaultActive);
  }, [defaultActive]);

  useEffect(() => {
    generate();

    return () => {
      window.removeEventListener('click', bodyClick);
    };
  }, []);

  useEffect(() => {
    if (showCate) {
      const catelogItem = document.getElementById(`catelog-${defaultActive}`);
      catelogItem?.scrollIntoView();
    }
  }, [showCate]);

  const generate = () => {
    let allcateArr: string[] = [];
    const cateList: CatalogItem[] = [];
    const content = mdtext.slice(mdtext.indexOf('\n'), mdtext.length);
    setTitle(mdtext.slice(0, mdtext.indexOf('\n')));
    const cate2Arr = content.split('\n## ');

    cate2Arr.forEach(cate2 => {
      // 二级目录
      const tempcate2 = cate2.substring(0, cate2.indexOf('\n')).trim();
      const cat3Arr = cate2.split('\n### ');
      cat3Arr.shift();
      const cat2Child: CatalogItem[] = [];

      cat3Arr.forEach(cate3 => {
        // 三级目录
        const tempcate3 = cate3.substring(0, cate3.indexOf('\n')).trim();
        cat2Child.push({
          id: tempcate3,
          header: `catelog-${tempcate3}`,
          label: tempcate3
        });
      });

      const cate2Item: CatalogItem = {
        id: tempcate2,
        header: `catelog-${tempcate2}`,
        label: tempcate2,
        child: []
      };

      allcateArr.push(tempcate2);
      if (cat2Child.length > 0) {
        cate2Item.child = cat2Child;
        allcateArr = allcateArr.concat(cat2Child.map(i => i.id));
      }

      cateList.push(cate2Item);
    });

    setCate(() => cateList.filter(item => Boolean(item.id)));
    setAllcate(allcateArr);
  };

  const cateClick = (cateItem: CatalogItem) => {
    const header = document.getElementById(cateItem.id) as HTMLElement;
    header?.scrollIntoView();

    setCateActive(cateItem.id);
    onCateClick?.(cateItem.id);
    setTimeout(() => setShowCate(false), 0);
  };

  const onCateListShow = () => {
    setShowCate(!showCate);
    setTimeout(() => {
      if (!showCate) window.addEventListener('click', bodyClick);
      else window.removeEventListener('click', bodyClick);
    }, 0);
  };

  const bodyClick = () => {
    setTimeout(() => setShowCate(false), 0);
    window.removeEventListener('click', bodyClick);
  };

  const renderCateItem = (cateItem: CatalogItem) => {
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
  };

  const cateListTransition = useMemo(() => {
    return showCate ? styles['cate-show'] : '';
  }, [showCate]);

  return (
    <div className={styles.catalog} style={position}>
      <FontAwesomeIcon
        className="btn"
        icon={faListUl}
        onClick={onCateListShow}
      />
      <div className={`btn ${styles.catelist} ${cateListTransition}`}>
        <div className={styles.head}>目录: {title}</div>
        <div className={styles['cate-content']}>
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
            <div className={styles.desc}>
              <p>一级标题'#'为文章名，</p>
              <p>二级标题'##'为一级目录，</p>
              <p>三级标题'###'为三级目录</p>
            </div>
          )}
        </div>
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
