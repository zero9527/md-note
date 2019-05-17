import * as React from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import Loadable from '@loadable/component';
import PageRoutes from './routes/index';

// 使用 import { lazy } from '@loadable/component';
// lazy()会有警告，跟React.lazy()一样的警告
const App = Loadable(() => import('./App'));
const ErrComp = Loadable(() => import('./views/ErrComp/index'));

// 生成 路由集合
const GetRoutes = () => {
  const AppRoute = 
    <Route 
      key='app' 
      path='/' 
      exact={true}
      component={App} 
    />;
  const ErrRoute = 
    <Route 
      key='err404' 
      exact={true} 
      path='/err404' 
      component={ErrComp} 
    />;
  const NoMatchRoute = 
    <Route 
      key='no-match' 
      component={ErrComp} 
    />;
  
  const routes = [AppRoute, ...PageRoutes, ErrRoute, NoMatchRoute];
  
  return (
    <Switch>
      {routes.map(route => route)}
    </Switch>
  );
}

// console.log('GetRoutes: ', GetRoutes());

export default function Routes() {
  return (
    <HashRouter>
      <GetRoutes />
    </HashRouter>
  );
}
