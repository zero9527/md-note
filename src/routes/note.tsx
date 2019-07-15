import { Route } from 'react-router-dom';
import * as React from 'react';
import Loadable from '@loadable/component';

// note
export default [
  <Route 
    key="note-list" 
    exact={true} 
    path="/note-list" 
    component={Loadable(() => import('@/views/noteList'))} 
  />,
  <Route 
    key="note-detail" 
    exact={true} 
    path="/note-detail/:id" 
    component={Loadable(() => import('@/views/noteDetail'))} 
  />,
  <Route 
    key="note-add" 
    exact={true} 
    path="/note-add" 
    component={Loadable(() => import('@/views/mdEditor'))} 
  />,
  <Route 
    key="md-editor" 
    exact={true} 
    path="/md-editor/:id" 
    component={Loadable(() => import('@/views/mdEditor'))} 
  />
]
