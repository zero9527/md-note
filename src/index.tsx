import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import AxiosConfig from './api';
import Router from './router';
import Loading from '@/components/loading';
import './index.scss';

AxiosConfig(); // 初始化 axios

ReactDOM.render(
  <React.Suspense fallback={<Loading />}>
    <Router />
  </React.Suspense>,
  document.getElementById('md-note') as HTMLElement
);

registerServiceWorker();
