# 简单实现一个 React 组件 keep-alive

## 前言
> `Vue` 官方提供 `keep-alive` 用于缓存组件，`React` 则没有，但是也有第三方插件可以使用

本文 [示例代码](https://github.com/zero9527/keep-alive/tree/master/example)，[在线例子](https://zero9527.github.io/keep-alive)

已发布 `npm`，[地址](https://www.npmjs.com/package/keep-alive-comp)
```
npm install keep-alive-comp

# 或
yarn add keep-alive-comp
```


## 1、功能说明
一般来说，`keep-alive` 至少需要做到两方面：
* 组件状态恢复
* 组件滚动位置恢复


## 2、代码实现
思路：
* 在路由中/或者其他地方，函数作为 `children`，形参为 **辅助函数** `cacheProps`，将 **辅助函数** 附加到组件中（如：`Context.Consumer` 那样的写法）
* 在组件 **适当位置**（比如跳转到其他路由）将滚动位置 `scrollTop`、需要保存的 `state` 作为参数调用 `beforeRouteLeave` 
* 回到当前路由/或组件再次渲染，组件加载后，调用 **辅助函数** 获取之前的 `scrollTop`、`state` 恢复到组件

### 2.1 辅助函数
* `beforeRouteLeave`：组件卸载时调用，保存滚动位置 `scrollTop`、状态 `state`
* `scrollRestore`：再次回到组件时调用，获取之前保存的滚动位置 `scrollTop`
* `stateRestore`：再次回到组件时调用，获取之前保存的状态 `state`
* `deleteCache`：清除组件之前保存的的滚动位置 `scrollTop`、状态 `state`，默认最多5个组件可以被缓存
* getKeepAlive：获取组件缓存的参数

```typescript
// 辅助函数
export interface KeepAliveAssist {
  beforeRouteLeave?: (scrollTop: number, state: any) => void;
  scrollRestore?: () => number | null;
  stateRestore?: () => any;
  deleteCache?: () => void;
  getKeepAlive?: () => void;
}
```

### 2.2 组件参数
* `name`：组件标记，如组件名称
* `store`：缓存存储的地方，默认 `window`
* `maxLength`：最大的缓存组件数，默认 `5`
* `children`：组件子元素，如  
    `<KeepAlive name="list">{(props) => <List {...props} />}</KeepAlive>`

```typescript
export interface KeepAliveProps {
  name: string;
  store?: any;
  maxLength?: number;
  children: (cacheProps: KeepAliveAssist) => React.ReactElement;
}
```

### 2.3 主体代码
```typescript
import React, { useEffect } from 'react';

export interface KeepAliveProps {
  name: string;
  store?: any;
  maxLength?: number;
  children: (cacheProps: KeepAliveAssist) => React.ReactElement;
}

// 辅助函数
export interface KeepAliveAssist {
  beforeRouteLeave?: (scrollTop: number, state: any) => void;
  scrollRestore?: () => number | null;
  stateRestore?: () => any;
  deleteCache?: () => void;
  getKeepAlive?: () => void;
}

interface CacheItem {
  name: string;
  cache: any;
  scrollTop?: number;
  state?: any;
}

// 组件 keep-alive
const KeepAlive: React.FC<KeepAliveProps> = ({
  name,
  maxLength = 5,
  store = window,
  children,
}) => {
  const cacheName = `__keep_alive_cache__`;
  const isChildrenFunction = typeof children === 'function';

  useEffect(() => {
    if (!isChildrenFunction) {
      console.warn(
        'children传递函数，如:\n <KeepAlive name="list">{(props) => <List {...props} />}</KeepAlive>'
      );
    }
  }, []);

  const getKeepAlive = () => {
    return getItem();
  };

  const getCache = () => {
    if (!store[cacheName]) store[cacheName] = [];
    const item = store[cacheName].find((i: CacheItem) => i.name === name);
    return item?.cache() || null;
  };

  // 新增/更新缓存
  const updateCache = (newCache: any, scrollTop: number, state: any) => {
    let index = store[cacheName].findIndex((i: CacheItem) => i.name === name);
    if (index !== -1) {
      store[cacheName].splice(index, 1, {
        name,
        cache: newCache,
        scrollTop,
        state,
      });
    } else {
      store[cacheName].unshift({ name, cache: newCache, scrollTop, state });
    }

    // 最大缓存 maxLength，默认5条
    if (store[cacheName].length > maxLength) store[cacheName].pop();
  };

  // 组件在路由变化前调用
  const beforeRouteLeave = (scrollTop: number = 0, state: any) => {
    updateCache(() => children(cacheProps), scrollTop, state);
  };

  const getItem = (): CacheItem => {
    if (!store[cacheName]) store[cacheName] = [];
    const item = store[cacheName].find((i: CacheItem) => i.name === name);
    return item || null;
  };

  // 返回滚动位置
  const scrollRestore = () => {
    const item = getItem();
    return item?.scrollTop || null;
  };

  // 返回组件的state
  const stateRestore = () => {
    const item = getItem();
    return item?.state || null;
  };

  const deleteCache = () => {
    let index = store[cacheName].findIndex((i: CacheItem) => i.name === name);
    if (index !== -1) {
      store[cacheName].splice(index, 1);
      console.log(`deleteCache-name: ${name}`);
    }
  };

  const cacheProps: KeepAliveAssist = {
    beforeRouteLeave,
    scrollRestore,
    stateRestore,
    deleteCache,
    getKeepAlive,
  };

  return getCache() ?? (isChildrenFunction && children(cacheProps));
};

export default KeepAlive;
```


## 3、测试
使用 `jest` + `enzyme` 测试

### 3.1 scripts - test
```
"scripts": {
  "test": "cross-env NODE_ENV=test jest --config jest.config.js"
},
```

### 3.2 jest/enzyme
```
yarn add -D enzyme jest babel-jest enzyme enzyme-adapter-react-16
```

如果使用 `typescript` ，把类型也下载下来 `@types/enzyme`, `@types/jest`

### 3.3 jest.config.js
```js
//jest.config.js
module.exports = {
  modulePaths: ['<rootDir>/src/'],
  moduleNameMapper: {
    '.(css|less)$': '<rootDir>/__test__/NullModule.js',
  },
  collectCoverage: true,
  coverageDirectory: '<rootDir>/src/',
  coveragePathIgnorePatterns: ['<rootDir>/__test__/'],
  coverageReporters: ['text'],
};
```

### 3.4 index.test.js
```js
// src/index.test.js
import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import KeepAlive from './index';

configure({ adapter: new Adapter() });

const Child = (props) => <div className="child">ccccaaaa</div>;

describe('============= keep-alive test =============', () => {
  const wrapper1 = shallow(
    <KeepAlive name="child">{(props) => <Child {...props} />}</KeepAlive>
  );
  const wrapper2 = shallow(
    <KeepAlive name="child">
      <Child />
    </KeepAlive>
  );

  it('-- children 非函数不渲染 --', () => {
    expect(typeof wrapper2.children() === 'function').toBe(false);
    expect(wrapper2.html()).toBe(null);
  });

  // 第一次
  it('-- 成功渲染 --', () => renderSuccess(wrapper1));
  it('-- 成功附加属性 KeepAliveAssist 到子组件 children --', () =>
    addPropsSuccess(wrapper1));
  it('-- 子组件, 附加属性 KeepAliveAssist 返回有效值 --', () => propsValid());

  // 成功渲染
  const renderSuccess = (_wrapper) =>
    expect(_wrapper.render().text() === 'ccccaaaa').toBeTruthy();

  // 成功附加属性
  const addPropsSuccess = (_wrapper) => {
    const assistProps = [
      'beforeRouteLeave',
      'scrollRestore',
      'stateRestore',
      'deleteCache',
      'getKeepAlive',
    ];
    const props = _wrapper.props();
    const keys = Object.keys(props);
    const has = assistProps.every((key) => keys.includes(key));

    expect(has).toBeTruthy();
  };

  let count = 0;
  // 附加属性 KeepAliveAssist 返回有效值
  const propsValid = () => {
    if (count > 2) return;
    count++;

    const {
      beforeRouteLeave,
      scrollRestore,
      stateRestore,
      deleteCache,
      getKeepAlive,
    } = wrapper1.props();

    beforeRouteLeave(10, ['1', '2']);
    expect(scrollRestore()).toBe(10);
    expect(stateRestore()).toEqual(['1', '2']);

    const { name, scrollTop, state, cache } = getKeepAlive();
    expect(name).toBe('child');
    expect(scrollTop).toBe(10);
    expect(state).toEqual(['1', '2']);
    const _wrapper = shallow(<KeepAlive name="child">{cache()}</KeepAlive>);

    // 第二次
    renderSuccess(_wrapper);
    addPropsSuccess(_wrapper);
    propsValid(_wrapper);

    deleteCache();
    expect(getKeepAlive()).toBe(null);
  };
});
```

### 3.5 yarn test
执行 `yarn test`
```cmd
PS F:\code\keep-alive> yarn test
yarn run v1.17.3
$ cross-env NODE_ENV=test jest --config jest.config.js
 PASS  src/index.test.js
  ============= keep-alive test =============
    √ -- children 非函数不渲染 -- (3ms)
    √ -- 成功渲染 -- (18ms)
    √ -- 成功附加属性 KeepAliveAssist 到子组件 children --
    √ -- 子组件, 附加属性 KeepAliveAssist 返回有效值 -- (24ms)

  console.log src/index.tsx:99
    deleteCache-name: child

-----------|---------|----------|---------|---------|-------------------
File       | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
-----------|---------|----------|---------|---------|-------------------
All files  |   91.11 |    73.08 |   93.33 |   94.59 |
 index.tsx |   91.11 |    73.08 |   93.33 |   94.59 | 37-38
-----------|---------|----------|---------|---------|-------------------
Test Suites: 1 passed, 1 total
Tests:       4 passed, 4 total
Snapshots:   0 total
Time:        3.185s
Ran all test suites.
Done in 4.14s.
```

## 4、使用例子
### 4.1 路由文件
```jsx
// example/Router.tsx
import React, { Suspense } from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import { lazy } from '@loadable/component';
import KeepAlive from 'keep-alive-comp';

const List = lazy(() => import('./pages/list'));
const Detail = lazy(() => import('./pages/detail'));

const Router: React.FC = ({ children }) => (
  <HashRouter>
    {children}
    <Switch>
      <Route
        exact
        path="/"
        component={() => (
          <Suspense fallback={<div>loading...</div>}>
            <KeepAlive name="list">{(props) => <List {...props} />}</KeepAlive>
          </Suspense>
        )}
      />
      <Route
        exact
        path="/detail/:id"
        component={() => (
          <Suspense fallback={<div>loading...</div>}>
            <Detail />
          </Suspense>
        )}
      />
      <Route path="*" render={() => <h3>404</h3>} />
    </Switch>
  </HashRouter>
);

export default Router;
```

### 4.2 列表页
```jsx
// example/pages/list.tsx
import React, { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router';
import { KeepAliveAssist } from 'keep-alive';
import '../styles.css';

export interface ListProps extends KeepAliveAssist {}

const List: React.FC<ListProps> = ({
  beforeRouteLeave,
  scrollRestore,
  stateRestore,
  deleteCache,
}) => {
  const history = useHistory();
  const listRef = useRef<HTMLDivElement | null>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [list, updateList] = useState([]);

  useEffect(() => {
    restore();
  }, []);

  const restore = () => {
    const _scrollTop = scrollRestore();
    const _state = stateRestore();

    updateList(
      () =>
        _state?.list || [
          '11111111111111111',
          '22222222222222222',
          '33333333333333333',
          '44444444444444444',
          '55555555555555555',
          '66666666666666666',
        ]
    );
    setTimeout(() => {
      listRef.current.scrollTop = _scrollTop;
    }, 0);
  };

  const onScroll = (e: any) => {
    e.persist();
    const top = e.target.scrollTop;
    setScrollTop(top);
    const scrollHeight = listRef.current.scrollHeight;
    const offsetHeight = listRef.current.offsetHeight;
    if (scrollHeight - offsetHeight - top <= 50) {
      const temp = new Array(5)
        .fill('')
        .map((i, index) =>
          new Array(17).fill(`${list.length + index + 1}`).join('')
        );
      updateList((prev) => [...prev, ...temp]);
    }
  };

  const toDetail = (i) => {
    beforeRouteLeave(scrollTop, { list });
    history.push(`/detail/${i}`);
  };

  return (
    <div className="list" ref={listRef} onScroll={onScroll}>
      {list.map((i) => (
        <div className="item" key={i} onClick={() => toDetail(i)}>
          {i}
        </div>
      ))}
    </div>
  );
};

export default List;
```


## 最后
&emsp;&emsp;到这里就结束了，`keep-alive` 是实际上很有用的一个需求，之前写过使用 `display: none;` 的方式实现，但是需要改造路由层次，这样也是复杂化了； 虽然并没有像 `Vue` 那样自动恢复一些状态，但是也是一个不影响其他层次的做法；也是一个不错的方案