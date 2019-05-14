import * as React from 'react';

// 接口 interface 以大写 I 开头
export interface IProps {
  name: string;
}

export interface IStates {
  times: number;
}

class Hello extends React.Component<IProps, IStates> {
  constructor(props: IProps) {
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
    const { name } = this.props;
    const { times } = this.state;

    return (
      <div>
        <h4>Hello { name }</h4>
        点击了 {times}
        <p>
          <button onClick={this.bclick}>点击</button>
        </p>
      </div>
    )
  }
}

export default Hello;
