import * as React from 'react';
import Loading from '@/components/loading';
import MdPreview from '../../components/mdPreview';
import Export from '../../components/export';
import style from './note-detail.scss';
import { BrowserRouterProps } from 'react-router-dom';

const mobileReg:RegExp = /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i;

// props
interface Props extends BrowserRouterProps {
  [prop: string]: any
}
// state
export interface State {
  mdtext: any,
  isMobile: boolean, 
  btnPCSpace: string,
  isResize: boolean
}

export default class NoteDetail extends React.Component<Props, State> {
  public readonly state:State = {
    mdtext: null||'',
    isMobile: mobileReg.test(navigator.userAgent), // 是否移动端
    // 按钮距左右两侧的距离，768是内容最大宽度
    btnPCSpace: `calc(${100 / 2}% - ${768 / 2 - 10}px)`,
    isResize: false
  };

  public constructor(props: Props) {
    super(props);
  }
  
  public componentDidMount = () => {
    setTimeout(() => {
      window.addEventListener('resize', this.resize);
    }, 0);
    const localtext = localStorage.getItem(`mdtext_${this.props.match.params.id}`);
    if (localtext) {
      this.setState({
        mdtext: JSON.parse(localtext)
      });
    } else {
      // 默认显示为md文件
      // 这里文件名不能下划线'_'开头，不然本地可以获取到，但是github page上面会404
      fetch('./promise_This_is.md')
        .then(res => res.text())
        .then(res => {
          if (res.substring(0, 20).includes('<!DOCTYPE html>')) return;
          localStorage.setItem(`mdtext_${this.props.match.params.id}`, JSON.stringify(res));
          this.setState({
            mdtext: res
          });
        });
    }
  };

  public resize = () => {
    if (this.state.isResize) return;
    // PC端最大宽度768，小于768则取小的数
    const bodyWidth = Math.min(document.body.clientWidth, 768);
    this.setState(
      {
        isResize: true,
        isMobile: mobileReg.test(navigator.userAgent),
        btnPCSpace: `calc(${100 / 2}% - ${bodyWidth / 2 - 10}px)`
      },
      () => {
        this.setState({
          isResize: false
        });
      }
    );
  };

  public render() {
    const { isMobile, btnPCSpace } = this.state;
    const { match: { params: {id}} } = this.props;
    return (
      <div className={`center-content ${style['note-detail']}`}>
        <h4 className={`border-1px-bottom title`}>查看详情</h4>
        {!this.state.mdtext && <Loading />}
        {this.state.mdtext && <MdPreview isDetail={true} mdtext={this.state.mdtext} />}
        <button
          className={`btn ${style.edit}`}
          style={{ right: isMobile ? '10px' : btnPCSpace }}
          onClick={() => this.props.history.push(`/md-editor/${id}`)}
        >
          编辑
        </button>
        {this.state.mdtext && (
          <Export btnPCSpace={btnPCSpace} isMobile={isMobile} />
        )}
      </div>
    );
  }
}
