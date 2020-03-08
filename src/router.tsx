import React from 'react';
import Loadable from '@loadable/component';
import { HashRouter, Route } from 'react-router-dom';

const App = Loadable(() => import('./App'));
const Detail = Loadable(() =>
  import(/* webpackPrefetch: true */ '@/views/noteDetail')
);
const Editor = Loadable(() =>
  import(/* webpackPrefetch: true */ '@/views/mdEditor')
);

const Router = () => (
  <HashRouter>
    <App>
      <Route
        key="detail"
        exact={true}
        path="/detail/:id"
        component={() => <Detail />}
      />
      <Route
        key="note-add"
        exact={true}
        path="/note-add"
        component={() => <Editor />}
      />
      <Route
        key="md-editor"
        exact={true}
        path="/md-editor/:id"
        component={() => <Editor />}
      />
    </App>
  </HashRouter>
);

export default Router;
