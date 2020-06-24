# 简单实现一个 React 组件 keep-alive

## 前言
> `Vue` 官方提供 `keep-alive` 用于缓存组件，`React` 则没有，但是也有第三方插件可以使用

本文 [示例代码](https://github.com/zero9527/keep-alive/tree/master/example)，[在线例子](https://zero9527.github.io/keep-alive)

已发布 `npm`，[地址](https://www.npmjs.com/package/keep-alive-comp)
```shell
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
* `children`：组件子元素，如  
    `<KeepAlive name="list">{(props) => <List {...props} />}</KeepAlive>`

```typescript
export interface KeepAliveProps {
  name: string;
  children: (cacheProps: KeepAliveAssist) => React.ReactElement;
}
```

### 2.3 主体代码
#### KeepAlive
```typescript
// src/index.ts
import { useEffect } from 'react';
import useKeepAliveCache from './useKeepAliveCache';

export interface KeepAliveProps {
  name: string;
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

export interface CacheItem {
  name: string;
  state?: any;
  scrollTop?: number;
}

/**
 * 组件 keep-alive
 * @param {*} name
 * @param {*} children
 */
const KeepAlive: React.FC<KeepAliveProps> = ({ name, children }) => {
  const isChildrenFunction = typeof children === 'function';
  const { getItem, updateCache, deleteCache } = useKeepAliveCache();

  useEffect(() => {
    if (!isChildrenFunction) {
      console.warn(
        'children传递函数，如:\n <KeepAlive name="list">{(props) => <List {...props} />}</KeepAlive>'
      );
    }
  }, []);

  const getKeepAlive = () => {
    return getItem(name);
  };

  // 组件在路由变化前调用
  const beforeRouteLeave = (scrollTop: number = 0, state: any) => {
    updateCache({
      name,
      state,
      scrollTop,
    });
  };

  // 返回滚动位置
  const scrollRestore = () => {
    const item = getItem(name);
    return item?.scrollTop || null;
  };

  // 返回组件的state
  const stateRestore = () => {
    const item = getItem(name);
    return item?.state || null;
  };

  const cacheProps: KeepAliveAssist = {
    beforeRouteLeave,
    scrollRestore,
    stateRestore,
    deleteCache: () => deleteCache(name),
    getKeepAlive,
  };

  return isChildrenFunction ? children(cacheProps) : null;
};

export default KeepAlive;
```

#### configKeepAlive
```typescript
// src/configKeepAlive.ts
export interface ConfigProps {
  store: any;
  maxLength: number;
  useStorage?: 'sessionStorage' | 'localStorage';
}

const CACHE_NAME = `__keep_alive_cache__`;
let DEFAULT_CONFIG: ConfigProps = {
  store: window,
  maxLength: 5,
  useStorage: undefined,
};

// 配置
const configKeepAlive = (props: Partial<ConfigProps> = {}) => {
  const init = () => {
    DEFAULT_CONFIG = { ...DEFAULT_CONFIG, ...props };
    const { store, maxLength, useStorage } = DEFAULT_CONFIG;
    store[CACHE_NAME] = {
      maxLength,
      useStorage,
      cacheList: store[CACHE_NAME]?.cacheList || [],
    };
  };

  init();

  return {
    cacheName: CACHE_NAME,
    ...DEFAULT_CONFIG,
  };
};

export default configKeepAlive;
```

#### useKeepAliveCache
```typescript
// src/useKeepAliveCache.ts
import { useEffect } from 'react';
import { CacheItem } from '.';
import configKeepAlive from './configKeepAlive';

type UpdateStorageCache = {
  _store: any;
  _cacheName: string;
};

export type UpdateCache = {
  name: string;
  state: any;
  scrollTop: number;
};

// 缓存
const useKeepAliveCache = () => {
  const { cacheName, maxLength, store, useStorage } = configKeepAlive();
  const useStorageError = 'useStorage只能为："sessionStorage","localStorage"';

  useEffect(() => {
    if (useStorage) restoreCache();
    else clearOldStoraCache();
  }, []);

  const clearOldStoraCache = () => {
    store.sessionStorage?.removeItem(cacheName);
    store.localStorage?.removeItem(cacheName);
  };

  // 从storage从恢复缓存，如果有传 useStorage 的话
  const restoreCache = () => {
    const storageCache = getStorageCache();
    if (storageCache) store[cacheName] = storageCache;
  };

  // 无效的 useStorage
  const inValidUseStorage = (): boolean => {
    return (
      Boolean(useStorage) !== false &&
      useStorage !== 'sessionStorage' &&
      useStorage !== 'localStorage'
    );
  };

  // 获取storage中缓存
  const getStorageCache = (
    { _store, _cacheName }: UpdateStorageCache = {
      _store: store,
      _cacheName: cacheName,
    }
  ) => {
    if (inValidUseStorage()) return console.warn(useStorageError);
    let parsedCache: any = '';
    const cache = _store[useStorage!]?.getItem(_cacheName);

    if (cache) {
      try {
        parsedCache = JSON.parse(cache);
      } catch (err) {
        clearOldStoraCache();
        console.error('从storage中恢复缓存出错，已删除storage缓存！', err);
      }
    }

    return parsedCache;
  };

  // 更新storage中缓存
  const updateStorageCache = (
    { _store, _cacheName }: UpdateStorageCache = {
      _store: store,
      _cacheName: cacheName,
    }
  ) => {
    if (inValidUseStorage()) return console.warn(useStorageError);
    _store[useStorage!]?.setItem(
      _cacheName,
      JSON.stringify({ ..._store[_cacheName], maxLength, useStorage })
    );
  };

  const getCacheList = (): CacheItem[] => {
    const storeCache = store[cacheName];
    return storeCache.cacheList;
  };

  const getItem = (name: string) => {
    let cacheList = getCacheList();
    const item = cacheList.find((i: CacheItem) => i.name === name);
    return item || null;
  };

  // 新增/更新缓存
  const updateCache = ({ name, scrollTop, state }: UpdateCache) => {
    let cacheList = getCacheList();
    let index = cacheList.findIndex((i: CacheItem) => i.name === name);
    if (index !== -1) {
      cacheList.splice(index, 1, {
        name,
        state,
        scrollTop,
      });
    } else {
      cacheList.unshift({
        name,
        state,
        scrollTop,
      });
    }

    // 最大缓存 maxLength，默认5条
    if (cacheList.length > maxLength) cacheList.pop();
    // 更新storage
    if (useStorage) updateStorageCache();
  };

  const deleteCache = (name: string) => {
    let cacheList = getCacheList();
    let index = cacheList.findIndex((i: CacheItem) => i.name === name);
    if (index !== -1) {
      cacheList.splice(index, 1);
      // 更新storage
      if (useStorage) updateStorageCache();
    }
  };

  return {
    getItem,
    updateCache,
    deleteCache,
    getStorageCache,
  };
};

export default useKeepAliveCache;
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

### 3.4 \_\_test\_\_
#### index.test.js
```js
// __test__/index.test.js
import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import KeepAlive from '../src/index';
import configKeepAliveTest from './configKeepAliveTest';
import useKeepAliveCacheTest from './useKeepAliveCacheTest';

configure({ adapter: new Adapter() });

const Child = (props) => <div className="child">ccccaaaa</div>;

describe('============= keep-alive test =============', () => {
  configKeepAliveTest({
    store: global,
    maxLength: 2,
    useStorage: 'sessionStorage',
  });
  useKeepAliveCacheTest('child');

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
    if (count > 1) return;
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

    const { name, scrollTop, state } = getKeepAlive();
    expect(name).toBe('child');
    expect(scrollTop).toBe(10);
    expect(state).toEqual(['1', '2']);

    // 第二次
    beforeRouteLeave(100, ['11', '22']);
    expect(scrollRestore()).toBe(100);
    expect(stateRestore()).toEqual(['11', '22']);

    const {
      name: name2,
      scrollTop: scrollTop2,
      state: state2,
    } = getKeepAlive();
    expect(name2).toBe('child');
    expect(scrollTop2).toBe(100);
    expect(state2).toEqual(['11', '22']);

    deleteCache();
    expect(getKeepAlive()).toBe(null);
  };
});
```

#### configKeepAliveTest.js
```js
// __test__/configKeepAliveTest.js
import configKeepAlive from '../src/configKeepAlive';

function configKeepAliveTest(config) {
  const { cacheName, store, maxLength, useStorage } = configKeepAlive(config);

  it('-- configKeepAlive 测试 --', () => {
    expect(cacheName).toBe('__keep_alive_cache__');
    expect(store).toBe(global);
    expect(maxLength).toBe(config.maxLength);
    expect(useStorage).toBe(config.useStorage);
  });
}

export default configKeepAliveTest;
```

#### useKeepAliveCacheTest.js
```js
// __test__/useKeepAliveCacheTest.js
import { renderHook } from '@testing-library/react-hooks';
import useKeepAliveCache from '../src/useKeepAliveCache';
import configKeepAlive from '../src/configKeepAlive';

function useKeepAliveCacheTest(name) {
  it('-- useStorage: undefined 测试 --', () => {
    const useStorageValue = undefined;
    const configKeepAliveProps = renderHook(() =>
      configKeepAlive({ store: global, useStorage: useStorageValue })
    ).result.current;
    const useKeepAliveCacheProps = renderHook(() => useKeepAliveCache()).result
      .current;

    testHandler({
      name,
      ...configKeepAliveProps,
      ...useKeepAliveCacheProps,
      useStorageValue,
    });
  });

  it('-- useStorage: "sessionStorage" 测试 --', () => {
    const useStorageValue = 'sessionStorage';
    const configKeepAliveProps = renderHook(() =>
      configKeepAlive({ store: global, useStorage: useStorageValue })
    ).result.current;
    const useKeepAliveCacheProps = renderHook(() => useKeepAliveCache()).result
      .current;

    testHandler({
      name,
      ...configKeepAliveProps,
      ...useKeepAliveCacheProps,
      useStorageValue,
    });
  });
}

function testHandler({
  name,
  cacheName,
  store,
  useStorage,
  getItem,
  updateCache,
  deleteCache,
  getStorageCache,
  useStorageValue,
}) {
  expect(useStorage).toBe(useStorageValue);

  expect(getItem(name)).toBe(null);

  const cache1 = { name, scrollTop: 10, state: { a: 'aa' } };
  updateCache(cache1);
  expect(getItem(name)).toEqual(cache1);

  if (useStorageValue) {
    const cache1 = getStorageCache({ _store: store, _cacheName: cacheName });
    expect(Boolean(cache1)).not.toBeFalsy();

    // 非 JSON 格式数据
    store[useStorageValue].setItem(cacheName, 'dd');
    const cache2 = getStorageCache({ _store: store, _cacheName: cacheName });
    expect(cache2).toBe('');

    const storeCache = store[useStorageValue].getItem(cacheName);
    expect(storeCache).toBe(null);

    // useStorage 不按要求传递
  } else {
    const cache = getStorageCache();
    expect(Boolean(cache)).toBeFalsy();
  }

  const cache2 = {
    name,
    scrollTop: 100,
    state: { a1: 'aa1' },
  };
  updateCache(cache2);
  expect(getItem(name)).toEqual(cache2);

  deleteCache(name);

  expect(getItem(name)).toBe(null);
}

export default useKeepAliveCacheTest;
```

### 3.5 yarn test
执行 `yarn test`
```sh
zero9527@zero9527deMBP keep-alive (master) $ yarn test
yarn run v1.22.1
$ cross-env NODE_ENV=test jest --config jest.config.js
 PASS  __test__/index.test.js
  ============= keep-alive test =============
    ✓ -- configKeepAlive 测试 -- (4ms)
    ✓ -- useStorage: undefined 测试 -- (14ms)
    ✓ -- useStorage: "sessionStorage" 测试 -- (31ms)
    ✓ -- children 非函数不渲染 -- (2ms)
    ✓ -- 成功渲染 -- (11ms)
    ✓ -- 成功附加属性 KeepAliveAssist 到子组件 children -- (4ms)
    ✓ -- 子组件, 附加属性 KeepAliveAssist 返回有效值 -- (7ms)

  console.error
    从storage中恢复缓存出错，已删除storage缓存！ SyntaxError: Unexpected token d in JSON at position 0
        at JSON.parse (<anonymous>)
        at getStorageCache (/Users/zero9527/Desktop/FE/keep-alive/src/useKeepAliveCache.ts:59:28)
        at testHandler (/Users/zero9527/Desktop/FE/keep-alive/__test__/useKeepAliveCacheTest.js:64:20)
        at Object.<anonymous> (/Users/zero9527/Desktop/FE/keep-alive/__test__/useKeepAliveCacheTest.js:30:5)
        at Object.asyncJestTest (/Users/zero9527/Desktop/FE/keep-alive/node_modules/jest-jasmine2/build/jasmineAsyncInstall.js:100:37)
        at resolve (/Users/zero9527/Desktop/FE/keep-alive/node_modules/jest-jasmine2/build/queueRunner.js:45:12)
        at new Promise (<anonymous>)
        at mapper (/Users/zero9527/Desktop/FE/keep-alive/node_modules/jest-jasmine2/build/queueRunner.js:28:19)
        at promise.then (/Users/zero9527/Desktop/FE/keep-alive/node_modules/jest-jasmine2/build/queueRunner.js:75:41)

      60 |       } catch (err) {
      61 |         clearOldStoraCache();
    > 62 |         console.error('从storage中恢复缓存出错，已删除storage缓存！', err);
         |                 ^
      63 |       }
      64 |     }
      65 | 

      at getStorageCache (src/useKeepAliveCache.ts:62:17)
      at testHandler (__test__/useKeepAliveCacheTest.js:64:20)
      at Object.<anonymous> (__test__/useKeepAliveCacheTest.js:30:5)

----------------------|---------|----------|---------|---------|---------------------
File                  | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s   
----------------------|---------|----------|---------|---------|---------------------
All files             |    93.1 |    71.79 |   95.65 |    97.4 |                     
 configKeepAlive.ts   |     100 |      100 |     100 |     100 |                     
 index.ts             |   89.47 |    44.44 |   85.71 |   89.47 | 34-35               
 useKeepAliveCache.ts |   93.22 |    77.78 |     100 |     100 | 34-40,53,76,113,121 
----------------------|---------|----------|---------|---------|---------------------
Test Suites: 1 passed, 1 total
Tests:       7 passed, 7 total
Snapshots:   0 total
Time:        2.399s, estimated 8s
Ran all test suites.
✨  Done in 4.08s.
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