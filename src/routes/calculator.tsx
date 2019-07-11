import { Route } from 'react-router-dom';
import * as React from 'react';
import Loadable from '@loadable/component';

// 有子路由的话暂时这样处理吧，精确的放前面，模糊的放后面
export default [
  <Route 
    key="calculator" 
    exact={true} 
    path="/calculator" 
    component={Loadable(() => import('@/components/Calculator'))} 
  />
]
