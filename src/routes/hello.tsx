import { Route } from 'react-router-dom';
import * as React from 'react';
import Hello from '../views/Hello';

export default (
  <Route 
    key="hello" 
    exact={true} 
    path="/hello" 
    // component={React.lazy(() => import('../views/Hello'))} 
    component={Hello} 
  />
)
