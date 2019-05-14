import * as React from 'react';
import { HashRouter, Route } from 'react-router-dom';
import PageRoutes from './routes/index';
import App from './App';
import ErrComp from './views/ErrComp';

// 使用 React.lazy会有警告。。。问题暂时还没找到解决方案
// const App = React.lazy(() => import('./App'));
// const ErrComp = React.lazy(() => import('./views/ErrComp'));

// 生成 路由集合
const GetRoutes = () => {
  const AppRoute = 
    <Route 
      key='app' 
      exact={true} 
      path='/' 
      // component={React.lazy(() => import('./App'))} 
      component={App} 
    />;
  const ErrRoute = 
    <Route 
      key='ERR404' 
      exact={true} 
      path='/ERR404' 
      // component={React.lazy(() => import('./views/ErrComp'))} 
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
