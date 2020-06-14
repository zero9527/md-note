import './set-public-path';
import singleSpaSetup from './single-spa-config';
import React from 'react';
import ReactDOM from 'react-dom';
import singleSpaReact from 'single-spa-react';
import registerServiceWorker from '@/registerServiceWorker';
import Loading from '@/components/Loading';
import AxiosConfig from '@/api';
import Router from './router';
import './index.scss';

// import VConsole from 'vconsole';
// new VConsole();

singleSpaSetup();
AxiosConfig(); // 初始化 axios
registerServiceWorker();

const domElementGetter = () => {
  return document.getElementById('md-note') as HTMLElement;
};

const reactLifeCycles = singleSpaReact({
  React,
  ReactDOM,
  domElementGetter,
  rootComponent: () => (
    <React.Suspense fallback={<Loading />}>
      <Router />
    </React.Suspense>
  ),
});

export let mountParcel: any;

export const bootstrap = (props: any) => {
  mountParcel = props.mountParcel;
  return reactLifeCycles.bootstrap(props);
};
export const { mount, unmount } = reactLifeCycles;
