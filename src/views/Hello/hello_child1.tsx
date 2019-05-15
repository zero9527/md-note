import * as React from 'react';

function HelloChild1(props: any) {
  return (
    <div>
      <p>Hello child:{props.match.name}!</p>
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
