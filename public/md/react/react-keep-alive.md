# React列表keep-alive的一种写法

## 前言
`Route` 组件的渲染方式有三种：`component`,`render`,`children`，优先级由高到低

代码可以看 [这里](https://github.com/zero9527/react-ts-antd-template/tree/master/src/views/list)，这与 [另外一篇](https://juejin.im/post/5d3faa3a5188255d2e32c6e3) 是一样的，本文只是把这部分单独拿出来，而那篇文章的内容比较完整，基本上项目里用到的，能想到的都有了

效果：
![](../static/images/react-keep-alive-0.gif)

## 路由
使用 `Route` 组件的 `render` 方法代替常用的 `component` ，使得详情 `Detail` 组件挂载在 `List` 下面，即进入详情，但是列表并不会被注销；

> `AuthRoute` 是封装官方 `Route` 的组件，使用 `Route` 替代也不会有问题

```js
import AuthRoute from '@/routes/auth-route';
import * as React from 'react';
import Loadable from '@loadable/component';

const List = Loadable(() => import('@/views/list'));

// 实现列表保留滚动条位置的写法
// list
export default [
  <AuthRoute 
    key="list" 
    // exact={true} 
    path="/list" 
    // component={Loadable(() => import('@/views/list'))} 
    render={() => {
      return (
        <List>
          <AuthRoute 
            exact={true} 
            path="/list/detail/:id" 
            component={Loadable(() => import('@/views/list-detail'))} 
          />
        </List>
      )
    }}
  />
]
```

## 组件
列表：`props.children` 代表详情组件 `<Detail />`，在上面的路由文件可以看到；

列表滚动时记录滚动条位置，从详情返回列表时恢复滚动条位置，从而实现 `keep-alive` 的效果

从列表到详情则重置滚动条位置为0

```js
// src/views/list/index.tsx
import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import styles from './list.scss';

const { useState, useEffect } = React;

interface IProps extends RouteComponentProps {
  [prop: string]: any
}
export interface IListItem {
  id: number,
  text: string
}

const arr: IListItem[] = [
  { id: 1, text: 'list1skdjfnsdnfsdnfsdf' },
  { id: 2, text: 'list2jilkfsjjfnsdnfsdf' },
  { id: 3, text: 'list3sudfjnfnfnffffsdf' },
  { id: 4, text: 'list4kl.mlmjjjfsdnfsdf' },
  { id: 5, text: 'list5ldskfoiquqiquwwww' },
  { id: 6, text: 'list6skdjfnsdnfsdnfsdf' },
  { id: 7, text: 'list7jufhfbvbvvvvaaadf' },
  { id: 8, text: 'list8,lkoqpoqwkeqlwele' }
];

let scrollTop: number = 0;

// list
function List(props: IProps) {
  const [list, setList] = useState([{ id: 1, text: '' }]);

  useEffect(() => {
    setList(arr);
    window.addEventListener('scroll', onScroll);

    return () => {
      window.removeEventListener('scroll', onScroll);
    }
  }, []);

  // 监听列表与详情的切换
  useEffect(() => {
    if (props.location.pathname.includes("/list/detail/") ) {
      // console.log('scrollTop -- detail: ', scrollTop);
      document.documentElement.scrollTop = 0;

    } else {
      window.addEventListener('scroll', onScroll);
      setTimeout(() => {
        // console.log('scrollTop -- list: ', scrollTop);
        document.documentElement.scrollTop = scrollTop;
      }, 0);
    }
  }, [props.location.pathname]);

  // 监听滚动
  function onScroll() {
    // location.pathname 因为是同一组件，所以有问题，所以用原生js的
    if (location.hash.includes("/list/detail/") ) {
      window.removeEventListener('scroll', onScroll);
      
    } else {
      scrollTop = document.documentElement.scrollTop;
    }
  }

  function toDetail(id: number) {
    props.history.push(`/list/detail/${id}`);
  }

  return (
    <div className={styles.list}>
      <section 
        className="list-content" 
        style={{ 
          display: props.location.pathname.includes("/list/detail/") 
          ? 'none' 
          : 'block' 
        }}
      >
        {
          list.map((item, index) => {
            return (
              <div 
                key={index} 
                className={styles['list-item']}
                onClick={() => toDetail(item.id)}
              >
                { item.text }
              </div>
            )
          })
        }
      </section>
      {/* detial */}
      { props.children }
    </div>
  )
}

export default withRouter(List);
```


## 最后
应该有其他实现方法，本文也只是“伪实现”。。。