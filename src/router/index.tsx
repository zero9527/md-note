import React, { Suspense } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { lazy } from '@loadable/component';
import KeepAlive from 'keep-alive-comp';
import Loading from '@/components/Loading';
import Page404 from '@/components/Page404';

const NoteList = lazy(() => import(/* webpackPrefetch: true */ '@/views/NoteList'));

const Detail = lazy(() => import(/* webpackPrefetch: true */ '@/views/NoteDetail'));

const Router = () => (
  <BrowserRouter>
    <Switch>
      <Route
        key="home"
        path="/"
        exact={true}
        render={() => (
          <Suspense fallback={<Loading />}>
            <KeepAlive name="list">{(props) => <NoteList {...props} />}</KeepAlive>
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
  </BrowserRouter>
);

export default Router;
