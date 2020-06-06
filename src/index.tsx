import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from '@/registerServiceWorker';
import Loading from '@/components/loading';
import AxiosConfig from '@/api';
import Router from './router';
import './index.scss';

// import VConsole from 'vconsole';
// new VConsole();

AxiosConfig(); // 初始化 axios

ReactDOM.render(
  <React.Suspense fallback={<Loading />}>
    <Router />
  </React.Suspense>,
  document.getElementById('md-note') as HTMLElement
);

registerServiceWorker();
