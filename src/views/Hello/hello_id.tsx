import * as React from 'react';

function HelloId(props: any) {
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

export default HelloId;
