import * as React from 'react';
import './App.css';
// import logo from './logo.svg';
// import {  withRouter } from 'react-router';

interface Props {
  [prop: string]: any
}

class App extends React.Component<Props, {}> {
  constructor(props: Props) {
    super(props);

    this.state = {};
  }

  public render() {
    const { history, location } = this.props;
    return (
      <div style={{display: location.pathname === '/' ? '' : 'none'}}>
        <p>这是app</p>
        <p>
          <a href="javascript:;" onClick={() => history.push('/hello')}>
            go hello
          </a>
        </p>
        <hr />
      </div>
    );
  }
}

// const AppWithRouter = withRouter(App as any);

// export default AppWithRouter;
export default App;
