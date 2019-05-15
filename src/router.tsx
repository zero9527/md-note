import * as React from 'react';
import { HashRouter, Route } from 'react-router-dom';
import Loadable from '@loadable/component';
import PageRoutes from './routes/index';

// 使用 import { lazy } from '@loadable/component';
// lazy()会有警告，跟React.lazy(一样的警告)
const App = Loadable(() => import('./App'));
const ErrComp = Loadable(() => import('./views/ErrComp'));

// 生成 路由集合
const GetRoutes = () => {
  const AppRoute = 
    <Route 
      key='app' 
      exact={true} 
      path='/' 
      component={App} 
    />;
  const ErrRoute = 
    <Route 
      key='ERR404' 
      exact={true} 
      path='/ERR404' 
      component={ErrComp} 
    />;

  const routes = [AppRoute, ...PageRoutes, ErrRoute];

  return (
    <HashRouter>
      {routes.map(route => route)}
    </HashRouter>
  );
}

// console.log('GetRoutes: ', GetRoutes());

export default function Routes() {
  return <GetRoutes />;
}
