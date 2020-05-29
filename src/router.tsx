import React, { Suspense } from 'react';
import { lazy } from '@loadable/component';
import { HashRouter, Route, Redirect } from 'react-router-dom';
import KeepAlive from 'keep-alive-comp';
import NoteList from './views/noteList';
import Loading from '@/components/loading';

const App = lazy(() => import('@/App'));
const Detail = lazy(() =>
  import(/* webpackPrefetch: true */ '@/views/noteDetail')
);
const Editor = lazy(() =>
  import(/* webpackPrefetch: true */ '@/views/mdEditor')
);

const Router = () => (
  <HashRouter>
    <Route
      key="app"
      exact={true}
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
      path="/detail/:tag/:tid"
      component={() => (
        <Suspense fallback={<Loading />}>
          <Detail />
        </Suspense>
      )}
    />
    <Route
      key="note-add"
      exact={true}
      path="/note-add"
      component={() => (
        <Suspense fallback={<Loading />}>
          <Editor />
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
