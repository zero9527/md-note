import * as React from 'react';
import { withRouter } from 'react-router-dom';

interface Props {
  [prop: string]: any
}

class ErrComp extends React.Component<Props> {
  constructor(props: Props)   {
    super(props);
    console.log('ErrComp');
  }

  public render() {
    return (
      <div>Error 404!</div>
    )
  }
}

const ErrCompWithRouter = withRouter(ErrComp as any);

export default ErrCompWithRouter;
