import * as React from 'react';

function HelloId(props: any) {
  return (
    <div>
      <p>Hello_{props.match.params.id}!</p>
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
