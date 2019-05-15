import * as React from 'react';
// import {  withRouter } from 'react-router';

function Hello(props: any) {
  return (
    <div>
      <p>Hello World!</p>
      <p>
        <a 
          href="javascript:;" 
          onClick={() => props.history.push('/')}
        >
          to App
        </a>
      </p>
    </div>
  );
}

// const HelloWithRouter = withRouter(Hello as any);

// export default HelloWithRouter;
export default Hello;
