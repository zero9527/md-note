import React, { Suspense } from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import { lazy } from '@loadable/component';
import RightPanel from '@/components/rightPanel';
import Loading from '@/components/loading';
import Page404 from './components/Page404';

const App = lazy(() => import(/* webpackPrefetch: true */ '@/App'));

const Detail = lazy(() =>
  import(/* webpackPrefetch: true */ '@/views/noteDetail')
);

const Editor = lazy(() =>
  import(/* webpackPrefetch: true */ '@/views/mdEditor')
);

const Router = () => (
  <HashRouter>
    <RightPanel />
    <Switch>
      <Route
        key="home"
        path="/"
        exact={true}
        render={() => (
          <Suspense fallback={<Loading />}>
            <App />
          </Suspense>
        )}
      />
      <Route
        key="detail"
        path="/detail/:tag/:name"
        component={() => (
          <Suspense fallback={<Loading />}>
            <Detail />
          </Suspense>
        )}
      />
      <Route
        key="md-editor"
        path="/md-editor/:tag/:tid"
        component={() => (
          <Suspense fallback={<Loading />}>
            <Editor />
          </Suspense>
        )}
      />
      <Route key="404" path="*" component={Page404} />
    </Switch>
  </HashRouter>
);

export default Router;
