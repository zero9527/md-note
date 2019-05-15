import { Route, Switch } from 'react-router-dom';
import * as React from 'react';
import Loadable from '@loadable/component';

// 有子路由的话暂时这样处理吧，精确的放前面，模糊的放后面
export default (
  <Switch key="hello">
    <Route 
      key="hello" 
      exact={true} 
      path="/hello" 
      component={Loadable(() => import('../views/Hello/index'))} 
    />
    <Route 
      key="hello_child1" 
      exact={true} 
      path="/hello/child1" 
      component={Loadable(() => import('../views/Hello/hello_child1'))} 
    />
    <Route 
      key="hello_id" 
      exact={true} 
      path="/hello/:id" 
      component={Loadable(() => import('../views/Hello/hello_id'))} 
    />
  </Switch>
)
