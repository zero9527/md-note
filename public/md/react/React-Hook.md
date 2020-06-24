# React Hook 一些用法

## 1、useState/useReducer
### useState
```typescript
const [isLoading, setIsLoading] = useState<boolean>(false);
```

如果有复杂数据结构的，可以使用 [useImmer](https://github.com/immerjs/use-immer) ，解决深层数据修改，视图不更新的问题

> 简单的可以使用 `数组[...arr]`、`数组map`、`Object.assign`等方法返回一个新数组/对象，再设置就行了

```typescript
import { useImmer } from 'use-immer';
export interface TreeDataItemProps {
  label: string;
  value: string;
  children?: TreeDataItemProps[];
}

// ...
  const [treeData, setTreeData] = useImmer<TreeDataItemProps>({
    label: '',
    value: '',
    children: []
  });
// ...
```

### useReducer
如果 `useState` 很多，可以把相关的 state 改成一个 对象的 `useReducer` 写法

```typescript
import React, { useReducer } from 'react';

export interface CountStateProps {
  count: number;
}

export interface CountActionProps {
  type: 'increment' | 'decrement' | 'set';
  value?: number;
}

const countReducer = (state: CountStateProps, { type, value }: CountActionProps) => {
  switch (type) {
    case 'increment':
      return {
        count: state.count + 1,
      };
    case 'decrement':
      return {
        count: state.count - 1,
      };
    case 'set':
      return {
        count: value || state.count,
      };
    default:
      return state;
  }
};
const initialCountState: CountStateProps = { count: 0 };

const Count: React.FC = props => {
  const [countState, countDispatch] = useReducer(countReducer, initialCountState);

  return (
    <div>
      <p>{countState.count}</p>
      <button type="button" onClick={() => countDispatch({ type: 'increment' })}>
        increment
      </button>
      <button type="button" onClick={() => countDispatch({ type: 'decrement' })}>
        decrement
      </button>
      <button type="button" onClick={() => countDispatch({ type: 'set', value: 1 })}>
        set
      </button>
    </div>
  );
};

export default Count;
```

## 2、useEffect
```js
useEffect(() => fn, [deps]);
```
* fn：回调函数
  
  回调函数内返回一个函数，且依赖项为空数组 `[]` 时，这个函数会在当前组件卸载时执行
  > 比如一些 **事件监听**/**定时器** 可以这里取消
  
* deps：依赖项
  * 不传：useState 每次变化都会执行 fn 
  * 为 `[]`：fn 只会在当前顶层函数 mount 后执行一次
  * 为 `[deps]`: deps 任意项变化后，都会执行 fn 

```js
useEffect(() => {
  console.log('mount 时会打印');

  return () => {
    console.log('unmount 时会打印');
  };
}, []);

useEffect(() => {
  console.log('每次 State 变化都会打印');
});

useEffect(() => {
  console.log('Mount 后打印一次');
}, []);

useEffect(() => {
  console.log('deps 任意项变化后都会打印');
}, [deps]);
```

## 3、useMemo
监听依赖的变化，执行回调函数，**回调函数的返回值** 作为 `useMemo` 的返回值，可以缓存结果，类似 Vue 计算属性 computed
```js
const memorized =  useMemo(() => {
  console.log('deps changed');
  return 'newValue';
}, [deps]);
```

## 4、useCallback
可以根据依赖的变化，返回新的回调函数；依赖不变的话，不会重新创建
```js
const fn = useCallback(() => {
  console.log('deps changed');
}, [deps]);
```

## 5、useRef
useRef 返回一个可变的 ref 对象，其 .current 属性被初始化为传入的参数（initialValue）。返回的 ref 对象在组件的整个生命周期内保持不变。

### 访问子组件
```js
const InputRef = useRef(null);
InputRef.focus();

<input ref={inputRef} />
```

### 存储变量
useRef 可以通过 `*.current` 来存储/获取变量值，改变不会触发页面更新；
> 可以看 自定义 Hook `usePrevState`

```js
const value = useRef(null);

value.current = newVal;
```

## 6、useImperativeHandle
函数组件没有 `ref`；如果要在父组件通过 `ref`，需要使用 `useImperativeHandle` + `React.forwardRef` 实现；`useImperativeHandle` 回调函数的返回值，可以被父组件通过 `ref` 调用

> 不管是 `createRef` 还是 `useRef` 都不是动态的；即使被引用的 子组件更新了，也不会重新获取新的 ref

### 子组件

```typescript
import React, { useState, useImperativeHandle } from 'react';

export interface CountRefProps {
  count: number;
  setCount: React.Dispatch<React.SetStateAction<number>>;
}

const Count: React.FC = (props, ref) => {
  const [count, setCount] = useState(0);

  useImperativeHandle(ref, () => ({
    count,
    setCount,
  }));

  return <div>{count}</div>;
};

export default React.forwardRef(Count);
```

### 父组件

```typescript
import React, { useRef } from 'react';
import Count, { CountRefProps } from './Count';

const Counter: React.FC = () => {
  const countRef = useRef<CountRefProps>(null);

  const onClick = () => {
    console.log(countRef.current!.count); // 0

    // 调用 Count 的 setCount 方法，使 Count 视图更新
    countRef.current!.setCount(1); 

    // 子组件更新了，但是这里还是一开始的 ref，不会自动更新的
    console.log(countRef.current!.count); // 0
  };

  return (
    <div>
      <Count ref={countRef} />
      <button type="button" onClick={onClick}>
        setCount
      </button>
    </div>
  );
};

export default Counter;
```

## 7、一些自定义 Hook

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


## 与 Hook 相关的状态管理
[hox](https://www.npmjs.com/package/hox)

### 定义 Model 

```typescript
import { createModel } from 'hox';
import { useState, useEffect } from 'react';
import { getCompanyList } from '@/api';

const useCompanyModel = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [companyList, setCompanyList] = useState([]);

  useEffect(() => {
    if (!companyList.length) getData();
  }, [companyList]);

  const getData = async () => {
    setIsLoading(true);
    const res = await getCompanyList({ userId: '11' });
    setCompanyList(res);
    setIsLoading(false);
  };

  return {
    isLoading,
    companyList,
  };
};

export default createModel(useCompanyModel);
```

### 使用 Model

```typescript
import React from 'react';
import useCompanyModel from '@/models/useCompanyModel';

export interface CompanyListProps {
  onChange: (id: string) => void;
}

const CompanyList: React.FC<CompanyListProps> = ({ onChange }) => {
  const { isLoading, companyList } = useCompanyModel();
  //...
}

export default CompanyList;
```
