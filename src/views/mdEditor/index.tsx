import * as React from 'react';
import MdPreview from '../../components/mdPreview';
import MdToolBar, { IToolItem } from '@/components/mdToolbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFeatherAlt } from '@fortawesome/free-solid-svg-icons';
import style from './mdEditor.scss';
import { BrowserRouterProps } from 'react-router-dom';

interface Props extends BrowserRouterProps {
  [prop: string]: any
}
export interface State {
  mdtextRaw: string,
  mdtext: string,
  cursorPos: number, 
  cursorHandTop: number,
}
let textarea: any;

// 编辑器
export default class MdEditor extends React.Component<Props, State> {
  public readonly state:State = {
    mdtextRaw: '', // 原始的编辑数据
    mdtext: '', // 当前编辑数据
    cursorPos: 0, // 光标位置
    cursorHandTop: 0, // 输入光标距顶部的距离
  };
  constructor(props: Props) {
    super(props);
  }

  public componentDidMount = () => {
    const localtext = localStorage.getItem(`mdtext_${this.props.match.params.id}`);
    if (localtext) {
      this.setState({
        mdtext: JSON.parse(localtext),
        mdtextRaw: JSON.parse(localtext)
      }, () => {
        setTimeout(() => {
          textarea = document.querySelector(`.${style.textarea}`);
        },0);
      });
    } else {
      // const filename = 'promise_This_is.md';
      const filename = './uni-app_calendar.md';
      fetch(filename)
        .then(res => res.text())
        .then(res => {
          this.setState({
            mdtext: res
          });
        });
    }
  };

  // preview 滚动
  public onPreviewScroll = (scrollTopRate: number) => {
    const { scrollHeight } = textarea;
    textarea.scrollTop = scrollHeight * scrollTopRate;
  }

  // 输入框获得焦点
  public textareaClick = (e: React.MouseEvent) => {
    this.setState({
      cursorHandTop: e.clientY - 6
    });
  };

  // 输入框失去焦点
  public textareaBlur = (e: any) => {
    this.setState({
      cursorPos: e.target.selectionStart // 光标位置
    });
  };

  // 输入框输入
  public textareaChange = (e: any) => {
    const text = e.target.value;
    this.setState({
      mdtext: text
    });
    localStorage.setItem(`mdtext_${this.props.match.params.id}`, JSON.stringify(text));
  };

  // 点击快捷栏 某一功能
  public onToolbarClick = (toolItem: IToolItem) => {
    let { mdtext, cursorPos } = this.state;
    // 在当前光标位置插入快捷操作符
    mdtext =
      mdtext.substring(0, +cursorPos) +
      toolItem.value +
      mdtext.substring(+cursorPos, mdtext.length);
    this.setState({
      mdtext
    });
    // 光标起始、结束位置
    let cursorPosStart:any;
    let cursorPosEnd:any;
    // const textarea: any = document.querySelector(`.${style.textarea}`);
    if (
      toolItem.key === 'precode' ||
      toolItem.key === 'code' ||
      toolItem.key === 'bold'
    ) {
      // 代码
      cursorPosStart = cursorPosEnd =
        this.state.cursorPos + toolItem.value.length / 2;
    } else if (toolItem.key === 'link') {
      // 链接
      cursorPosStart = this.state.cursorPos + 7;
      cursorPosEnd = this.state.cursorPos + toolItem.value.length - 1;
    } else if (toolItem.key === 'pic') {
      // 图片
      cursorPosStart = this.state.cursorPos + 15;
      cursorPosEnd = this.state.cursorPos + toolItem.value.length - 1;
    } else {
      // 其他
      cursorPosStart = cursorPosEnd =
        this.state.cursorPos + toolItem.value.length;
    }
    if (!textarea) return;
    setTimeout(() => {
      // 延迟 使得光标在当前 插入快捷方式之后 相应的位置或选中相应的文本
      textarea.setSelectionRange(cursorPosStart, cursorPosEnd);
      // 输入框获得焦点
      textarea.focus();
    }, 0);
  };

  // 恢复
  public cancelEdit = () => {
    const confirm = window.confirm('确定取消吗？点击确定将不会保存！');
    if (!confirm) return;
    localStorage.setItem(`mdtext_${this.props.match.params.id}`, JSON.stringify(this.state.mdtextRaw));
    this.setState({
      mdtext: this.state.mdtextRaw
    });
  };

  public render() {
    const { cursorHandTop } = this.state;
    const { match } = this.props;
    return (
      <div className={`center-content ${style.editor}`}>
        <h4 className={`border-1px-bottom title`}>
          {match.path === '/note-add' ? '新增：' : '编辑：' }
          <span>使用marked.js+highlight.js的编辑器</span>
        </h4>
        <textarea
          rows={20}
          className={style.textarea}
          placeholder="输入内容，支持markdown语法"
          value={this.state.mdtext || ''}
          onClick={(e: React.MouseEvent) => this.textareaClick(e)}
          onChange={this.textareaChange}
          onBlur={this.textareaBlur}
        />
        {cursorHandTop !== 0 && (
          <FontAwesomeIcon
            icon={faFeatherAlt}
            className={style.cursor}
            style={{ top: cursorHandTop }}
          />
        )}
        {this.state.mdtext !== this.state.mdtextRaw && (
          <button className={`btn ${style['cancel-edit']}`} onClick={this.cancelEdit}>
            退出编辑
          </button>
        )}
        {this.state.mdtext && <MdPreview isEdit={true} mdtext={this.state.mdtext} onPreviewScroll={this.onPreviewScroll} />}
        <MdToolBar onToolbarClick={this.onToolbarClick} />
      </div>
    );
  }
}
