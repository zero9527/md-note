import * as React from 'react';
import NoteList from '@/views/noteList';
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
    // const { history, location } = this.props;
    return (
      <div>
        <NoteList />
      </div>
    );
  }
}

export default App;
