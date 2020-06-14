import React, { Suspense } from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import { lazy } from '@loadable/component';
import Loading from '@/components/Loading';
import Page404 from '@/components/Page404';

const App = lazy(() => import(/* webpackPrefetch: true */ '@/App'));

const Detail = lazy(() =>
  import(/* webpackPrefetch: true */ '@/views/NoteDetail')
);

const Router = () => (
  <HashRouter>
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
      <Route key="404" path="*" component={Page404} />
    </Switch>
  </HashRouter>
);

export default Router;
