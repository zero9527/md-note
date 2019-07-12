import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Routes from './router';
import './index.css';
// import registerServiceWorker from './registerServiceWorker'; 
const Loading = () => <div>loading...</div>;

ReactDOM.render(
  <React.Suspense fallback={Loading}>
    <Routes />
  </React.Suspense>,
  document.getElementById('root') as HTMLElement
);

// registerServiceWorker();
