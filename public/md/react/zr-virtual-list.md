# zr-virtual-list 长列表虚拟滚动

React 长列表虚拟滚动

在线例子：[zr-virtual-list example](https://zero9527.github.io/zr-virtual-list)
![效果图](https://s1.ax1x.com/2020/07/24/UvQ49U.gif)

## 依赖

React: 16.8.0+

源码使用了 `React Hook`

## 下载

```
npm i zr-virtual-list
```

## 参数

首次渲染，如果 `defaultScrollTop`/`defaultStartIndex` 同时存在，优先使用 `defaultScrollTop`；之后哪个变化使用哪个

- itemKey: string; // 唯一 key
- dataList: any[]; // 列表数据
  children: (item: any, index: number) => React.ReactNode;
- defaultStartIndex?: number; // 默认第一个可视的 item 下标
- defaultScrollTop?: number; // 默认的滚动位置
- className?: string;
- renderCount?: number; // 一次渲染的数量
- onScroll?: (scrollTop: number) => void; // 滚动回调
- getScrollContainer?: () => HTMLElement; // 滚动容器，默认 body
- onStartIndexChange?: (visibleItemIndex: number, startIndex: number) => void; // 返回 itemIndex, startIndex

```typescript
export interface VirtualListProps {
  itemKey: string; // 唯一 key
  dataList: any[]; // 列表数据
  children: (item: any, index: number) => React.ReactNode;
  defaultStartIndex?: number; // 默认开始切割的位置
  defaultScrollTop?: number; // 默认的滚动位置
  className?: string;
  renderCount?: number; // 一次渲染的数量
  onScroll?: (scrollTop: number) => void; // 滚动回调
  getScrollContainer?: () => HTMLElement; // 滚动容器，默认 body
  onStartIndexChange?: (visibleItemIndex: number, startIndex: number) => void; // 返回 itemIndex, startIndex
}
```

## 实现

当数据一次性渲染很多(`1000`,`10000`条或更多)，会导致页面空白时间比较大、且操作会卡顿，影响体验，一般的解决方案就是 **分页**，但是这个需要额外的处理，要么按页码从接口获取，要么自己对数据切割。。。

从体验上来说，滚动加载内容（暂时叫做 **无感分页** 吧）而不需要手动点 **下一页**，且不会卡顿才是最好的（当然数据量大的话，请求的时间也会长一些，按需求取舍吧，如一些视频网站是 **滚动加载+分页** 结合的）；**长列表虚拟滚动** 就是解决这个问题的；

什么是 **虚拟滚动**？简单说就是 **渲染优化**，通过减少一次渲染数量，而在滚动的时候渲染相应的内容，难点在于适当的 **切割内容**，**顺滑滚动**，与普通滚动不会由太大的卡顿感、空白时间问题

本次的实现，结构简单，没有添加额外的滚动方式，与普通列表的滚动基本一致，同时，滚动条位置与对应内容一致

### 渲染结构

分为三部分实现

- 前占位
- 渲染内容
- 后占位

#### 前占位、后占位

1. 前占位

   根据 `startIndex` 与 `item的平均高度` 算出来的；`item的平均高度` 由滚动容器的滚动高度与渲染数量 `scrollHeight/renderCount` 得到；如果没有设置滚动容器 `getScrollContainer` 的话，默认 `body` 滚动

2. 后占位

   未渲染的数量 \* 每个 `item` 的高度 = **前占位** + **后占位**

```ts
// 前后占位的高度
const getPlaceholderHegiht = useCallback(
  (type: 'before' | 'after') => {
    const before =
      startIndex.current === 0
        ? 0
        : itemScrollHeight.current * startIndex.current!;
    if (type === 'before') return before > 0 ? before : 0;

    const after =
      itemScrollHeight.current * (dataList.length - renderCount) - before;
    return after > 0 ? after : 0;
  },
  [dataList, renderCount]
);
```

#### 渲染的内容

> 经过小测，`设置滚动容器`、`data长度=10000`、`renderCount=20` 时，大概快速滑动（手机端，多次滑动叠加每秒`50`个左右吧，电脑上鼠标拉着滚动条滑动还没出现过），偶尔会出现轻微的空白问题；实际上渲染时间与数据长度无关，与每个`item` 的渲染有关，通过调整 `renderCount` 也可以改善

1. 根据 `defaultStartIndex`、`defaultScrollTop` 渲染 `renderCount` 的数量，没有的话默认 `0`；

2. `defaultStartIndex`、`defaultScrollTop` 通过 `transform_scrollTop_itemIndex` 方法转换相互转化得到对应值，然后 `onRenderHandler` 方法渲染，再接着设置滚动容器的 `scrollTop`；

3. 首次渲染，将 `startIndex` 的那个 `item` 显示在顶部，为了防止快速滑动导致的空白问题，此时屏幕可视区域上下一定距离内都是有内容的，根据设置的 `renderCount` 有所差异

```ts
// src\index.tsx
const scrollHandler = () => {
  const scrollWrapper = getScrollWrapper();
  if (!scrollWrapper) return;

  const { scrollTop: _scrollTop } = scrollWrapper;
  scrollTop.current = _scrollTop;
  const transform_itemIndex = transform_scrollTop_itemIndex({
    itemScrollHeight: itemScrollHeight.current,
    scrollTop: _scrollTop,
  });
  startIndexChange(transform_itemIndex);
  if (onScroll) onScroll(_scrollTop);
};

const startIndexChange = (itemIndex: number) => {
  // itemIndex 往前推的数量
  const leftCount = Math.floor(renderCount / 4);
  if (itemIndex - leftCount === startIndex.current) return;

  startIndex.current = itemIndex > leftCount ? itemIndex - leftCount : 0;

  setPlaceholderHeight();
  onRenderHandler(startIndex.current);
  if (onStartIndexChange) onStartIndexChange(itemIndex, startIndex.current);
};

// 根据 startIndex 切割需要渲染的部分
const onRenderHandler = useCallback(
  (_startIndex: number) => {
    setRenderDataList(() => {
      return dataList
        .slice(_startIndex, _startIndex + renderCount)
        .map((item, index) => ({
          ...item,
          index: _startIndex + index,
        }));
    });
  },
  [dataList, renderCount]
);
```

### 滚动与显示

1. 根据 **滚动容器** `scrollTop`，获取对应的 `itemIndex`（在`dataList`里的序号）;如下 `transform_scrollTop_itemIndex` 方法

2. 根据 `itemIndex`（在 `dataList` 里的下标），获取对应的 **滚动容器** `scrollTop`

```ts
// src\index.tsx
const scrollHandler = () => {
  const scrollWrapper = getScrollWrapper();
  if (!scrollWrapper) return;

  const { scrollTop: _scrollTop } = scrollWrapper;
  scrollTop.current = _scrollTop;
  const transform_itemIndex = transform_scrollTop_itemIndex({
    itemScrollHeight: itemScrollHeight.current,
    scrollTop: _scrollTop,
  });
  startIndexChange(transform_itemIndex);
  if (onScroll) onScroll(_scrollTop);
};

const startIndexChange = (itemIndex: number) => {
  // itemIndex 往前推的数量
  const leftCount = Math.floor(renderCount / 4);
  if (itemIndex - leftCount === startIndex.current) return;

  startIndex.current = itemIndex > leftCount ? itemIndex - leftCount : 0;

  setPlaceholderHeight();
  onRenderHandler(startIndex.current);
  if (onStartIndexChange) onStartIndexChange(itemIndex, startIndex.current);
};
```

transform_scrollTop_itemIndex

```ts
// src\utils\index.ts
// 获取对应的数值 scrollTop=>itemIndex，startIndex=>scrollTop，
// 优先 scrollTop
export function transform_scrollTop_itemIndex({
  itemScrollHeight,
  scrollTop: _scrollTop,
  startIndex: _startIndex,
}: TransformProps) {
  if (_scrollTop !== undefined && _startIndex !== undefined) {
    console.log('优先使用[scrollTop]');
  }
  if (typeof _scrollTop === 'number') {
    // 获取itemIndex
    const itemIndex = Math.round(_scrollTop / itemScrollHeight);
    return itemIndex;
  } else {
    // 获取scrollTop
    const scrollTop = Math.round(itemScrollHeight * _startIndex!);
    return scrollTop;
  }
}
```

### 默认值与状态恢复

首次渲染，如果 `defaultScrollTop`/`defaultStartIndex` 同时存在，优先使用 `defaultScrollTop`；之后哪个变化使用哪个

> `_defaultScrollTop.current`, `_defaultStartIndex.current` 都是作为各自上次的值，用于比较是否变化（清空设置为 `undefined` 或其他值不考虑）

```ts
// 设置 scrollTop.current 逻辑
const setScrollTopHandler = () => {
  // defaultScrollTop 是否变化
  const use_defaultScrollTop =
    isNumber(defaultScrollTop) &&
    _defaultScrollTop.current !== defaultScrollTop;

  // defaultStartIndex 是否变化
  const use_defaultStartIndex =
    isNumber(defaultStartIndex) &&
    _defaultStartIndex.current !== defaultStartIndex;

  _defaultScrollTop.current = defaultScrollTop;
  _defaultStartIndex.current = defaultStartIndex;

  // 首次渲染，如果 `defaultScrollTop`/`defaultStartIndex` 同时存在，
  // 优先使用 `defaultScrollTop`；之后使用变化的那个
  if (use_defaultScrollTop) {
    scrollTop.current = defaultScrollTop;
    // defaultScrollTop 转化为 itemIndex
    const transform_itemIndex = transform_scrollTop_itemIndex({
      itemScrollHeight: itemScrollHeight.current,
      scrollTop: defaultScrollTop,
    });
    startIndex.current = transform_itemIndex || 0;
    onRenderHandler(startIndex.current);
  } else if (use_defaultStartIndex) {
    // defaultStartIndex 转化为 scrollTop
    const transform_scrollTop = transform_scrollTop_itemIndex({
      itemScrollHeight: itemScrollHeight.current,
      startIndex: defaultStartIndex,
    });
    scrollTop.current = transform_scrollTop || 0;
  } else {
    scrollTop.current = scrollTop.current || 0;
  }

  // 设置滚动容器 scrollTop
  setTimeout(() => setContainerScrollTop(), 0);
};
```

## 用法

在线例子：[zr-virtual-list example](https://zero9527.github.io/zr-virtual-list)

组件：[example\List\index.tsx](https://github.com/zero9527/zr-virtual-list/blob/master/example/List/index.tsx)

```jsx
// example\List\index.tsx
import React, { useState, useEffect, useRef } from 'react';
import VirtualList from 'zr-virtual-list';
// import VirtualList from '../src';
import RadioGroup from '../RadioGroup';
import './styles.less';

interface ListProps {}

interface Item {
  id: string;
  count: number;
}

const countList = [10, 20, 50, 100, 500, 3000];
const indexList = [undefined, 0, 6, 21, 112, 666, 2345];
const scrollList = [undefined, 0, 100, 1800, 8888, 22000];

const List: React.FC<ListProps> = () => {
  const [data, setData] = useState<any[]>([]);
  const scrollTop1 = useRef<number | undefined>();
  const [visible, setVisible] = useState(true);
  const [renderCount, setRenderCount] = useState(20);
  const [defaultStartIndex, setDefaultStartIndex] = useState<
    number | undefined
  >(666);
  const [defaultScrollTop, setDefaultScrollTop] = useState<number | undefined>(
    0
  );

  useEffect(() => {
    const arr = [];
    for (let i = 0; i < 10000; i++) {
      arr.push({ id: `id-${i}`, count: 0 });
    }
    setData(arr);
  }, []);

  useEffect(() => {
    if (visible && scrollTop1.current) {
      setDefaultScrollTop(scrollTop1.current);
    }
  }, [visible]);

  useEffect(() => {
    if (defaultScrollTop === undefined) {
      scrollTop1.current = undefined;
    }
  }, [defaultScrollTop]);

  const onScroll = (_scrollTop: number) => {
    console.log(_scrollTop);
    scrollTop1.current = _scrollTop;
  };

  const countHandler = (index: number, type: 'increment' | 'decrement') => {
    setData((prev) => {
      const newItem = {
        ...prev![index],
        count:
          type === 'increment'
            ? prev![index].count + 1
            : prev![index].count - 1,
      };
      prev!.splice(index, 1, newItem);
      return [...prev!];
    });
  };

  const onStartIndexChange = (visibleItemIndex: number, startIndex: number) => {
    console.log(visibleItemIndex, startIndex);
  };

  const onVisibleChange = () => {
    setVisible(!visible);
  };

  return (
    <>
      <div className="header">
        <h2 className="title">zr-virtual-list example</h2>
        <p>dataLength: {data.length}</p>
        <RadioGroup
          name="renderCount"
          value={renderCount}
          setValue={setRenderCount}
          dataList={countList}
        />
        <RadioGroup
          name="defaultStartIndex"
          value={defaultStartIndex}
          setValue={setDefaultStartIndex}
          dataList={indexList}
        />
        <RadioGroup
          name="defaultScrollTop"
          value={defaultScrollTop}
          setValue={setDefaultScrollTop}
          dataList={scrollList}
        />
        <p>
          <button onClick={onVisibleChange}>
            {visible ? 'Hide List' : 'Show List'}
          </button>
        </p>
      </div>
      {visible && (
        <VirtualList
          itemKey="id"
          className="scroll-container"
          dataList={data}
          renderCount={renderCount}
          defaultScrollTop={defaultScrollTop}
          defaultStartIndex={defaultStartIndex}
          onScroll={onScroll}
          onStartIndexChange={onStartIndexChange}
        >
          {(item: Item, index) => (
            <div className={`item ${index % 2 === 0 ? 'item-2n' : ''}`}>
              <p>
                <button onClick={() => countHandler(index, 'decrement')}>
                  count--
                </button>
                &nbsp;
                <button onClick={() => countHandler(index, 'increment')}>
                  count++
                </button>
              </p>
              <p>id: {item.id}</p>
              <p>count: {item.count}</p>
            </div>
          )}
        </VirtualList>
      )}
    </>
  );
};

export default List;
```
