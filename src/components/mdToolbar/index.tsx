import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faImage,
  faLink,
  faBold,
  faListOl,
  faList,
  faCode,
  faQuoteRight,
  // IconDefinition
} from '@fortawesome/free-solid-svg-icons';
import styles from './md-toolbar.scss';

interface Props {
  onToolbarClick(item: ToolItem): void
}
export interface State {
  [prop: string]: any
}
export interface ToolItem {
  key: string,
  value: string,
  label: string,
  // icon: IconDefinition | string
  icon: any
}

// 快捷操作栏
export default class MdToolBar extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
  }

  // 点击事件
  public toolHandler = (item: ToolItem) => {
    this.props.onToolbarClick(item);
  };

  public render() {
    const toolbar:ToolItem[] = [
      {
        key: 'pic',
        value: '![图片加载失败显示的名称](图片地址)',
        label: '图片',
        icon: faImage
      },
      {
        key: 'link',
        value: '[链接名称](链接地址)',
        label: '链接',
        icon: faLink
      },
      {
        key: 'H2',
        value: '\n## ',
        label: 'H2',
        icon: ''
      },
      {
        key: 'H3',
        value: '\n### ',
        label: 'H3',
        icon: ''
      },
      {
        key: 'H4',
        value: '\n#### ',
        label: 'H4',
        icon: ''
      },
      {
        key: 'bold',
        value: '****',
        label: '加粗',
        icon: faBold
      },
      {
        key: 'ul',
        value: '\n* ',
        label: '无序列表',
        icon: faList
      },
      {
        key: 'ol',
        value: '\n1. ',
        label: '有序列表',
        icon: faListOl
      },
      {
        key: 'precode',
        value: '\n```\n\n```\n',
        label: '代码块',
        icon: faCode
      },
      {
        key: 'code',
        value: '``',
        label: 'code',
        icon: ''
      },
      {
        key: 'quote',
        value: '\n> ',
        label: '引用',
        icon: faQuoteRight
      }
    ];

    return (
      <div className={`center-content ${styles['md-toolbar']}`}>
        {toolbar.map(item => (
          <div
            key={item.key}
            className={styles['tool-item']}
            onClick={() => this.toolHandler(item)}
            title={item.label}
          >
            {item.icon ? (
              <FontAwesomeIcon icon={item.icon} />
            ) : (
              <span className={item.key === 'code' ? styles.codebg : ''}>
                {item.label}
              </span>
            )}
          </div>
        ))}
      </div>
    );
  }
}
