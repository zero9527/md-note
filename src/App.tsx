import * as React from 'react';
import './App.css';
// import logo from './logo.svg';

interface Props {
  [prop: string]: any
}

class App extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }
  
  public render() {
    return (
      <div>
        <p>这是app</p>
        <p>
          <a 
            href="javascript:;" 
            onClick={() => this.props.history.push('/hello')}
          >
            go hello
          </a>
        </p>
      </div>
    );
  }
}

export default App;
