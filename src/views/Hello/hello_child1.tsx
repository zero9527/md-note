import * as React from 'react';

function HelloChild1(props: any) {
  return (
    <div>
      <p>path: {props.match.path}!</p>
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

export default HelloChild1;
