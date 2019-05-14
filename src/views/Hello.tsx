import * as React from 'react';

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

export default Hello;
