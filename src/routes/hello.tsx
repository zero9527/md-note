import { Route } from 'react-router-dom';
import * as React from 'react';
import Loadable from '@loadable/component';

export default (
  <Route 
    key="hello" 
    exact={true} 
    path="/hello" 
    component={Loadable(() => import('../views/Hello'))} 
  />
)
