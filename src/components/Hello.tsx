import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';

export interface Props {
  from?: string;
}

export interface States {
  times: number;
}

type thisProps = Props & RouteComponentProps;

class Hello extends React.Component<thisProps, States> {
  constructor(props: thisProps) {
    super(props);

    this.state = {
      times: 0
    }

    this.bclick = this.bclick.bind(this);
  }

  public bclick() {
    this.setState({
      times: this.state.times+1
    })
  }

  // 方法名 需要添加 public/ private / protected
  public render() {
    const { from } = this.props;
    const { times } = this.state;

    return (
      <div>
        <h4>Hello { from }</h4>
        点击了 {times}
        <p>
          <button onClick={this.bclick}>点击</button>
        </p>
      </div>
    )
  }
}

export default withRouter<thisProps>(Hello as any);
