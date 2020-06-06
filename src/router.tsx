import React, { Suspense } from 'react';
import { HashRouter, Route } from 'react-router-dom';
import { lazy } from '@loadable/component';
import Loading from '@/components/loading';

const App = lazy(() => import(/* webpackPrefetch: true */ '@/App'));

const Detail = lazy(() =>
  import(/* webpackPrefetch: true */ '@/views/noteDetail')
);

const Editor = lazy(() =>
  import(/* webpackPrefetch: true */ '@/views/mdEditor')
);

const Router = () => (
  <HashRouter>
    <Route
      key="home"
      path="/"
      component={() => (
        <Suspense fallback={<Loading />}>
          <App />
        </Suspense>
      )}
    />
    <Route
      key="detail"
      exact={true}
      path="/detail/:tag/:name"
      component={() => (
        <Suspense fallback={<Loading />}>
          <Detail />
        </Suspense>
      )}
    />
    <Route
      key="md-editor"
      exact={true}
      path="/md-editor/:tag/:tid"
      component={() => (
        <Suspense fallback={<Loading />}>
          <Editor />
        </Suspense>
      )}
    />
  </HashRouter>
);

export default Router;
