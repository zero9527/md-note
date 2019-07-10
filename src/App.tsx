import * as React from 'react';
// import Hello from '@/components/Hello';
import ProdDetail from '@/views/prod-detail/index'
import './App.css';
// import logo from './logo.svg';

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
        {/* <Hello from="App" /> */}
        <ProdDetail text={"产品详情"} />
      </div>
    );
  }
}

export default App;
