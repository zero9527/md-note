import * as React from 'react';
import styles from './loading.scss';

interface Props {
  [prop: string]: any
}
interface State {
  loadingDot: string
}
/**
 * 路由跳转 Loading组件
 */
class Loading extends React.Component<Props, State> {
  public timer: any = '';
  public readonly state:State = {
    loadingDot: ''
  };
  constructor(props: Props) {
    super(props);
    this.loading.bind(this);
  }

  public componentDidMount() {
    this.loading();
  }

  public loading() {
    this.setState({
      loadingDot: this.state.loadingDot + '.'
    });

    this.timer = setInterval(() => {
      this.setState({
        loadingDot:
          this.state.loadingDot.length >= 3 ? '' : this.state.loadingDot + '.'
      });
    }, 600);
  }

  public componentWillUnmount() {
    clearInterval(this.timer);
  }

  public render() {
    return (
      <div className={styles['loading-wrapper']}>
        <div className={styles['loading-content']}>
          {this.props.children ? (
            <div>{this.props.children}</div>
          ) : (
            <p>
              loading
              <span>{this.state.loadingDot}</span>
            </p>
          )}
        </div>
      </div>
    );
  }
}

export default Loading;
