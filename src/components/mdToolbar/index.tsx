import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  // faImage,
  // faLink,
  faUndo,
  faRedo,
  IconDefinition
} from '@fortawesome/free-solid-svg-icons';
import styles from './md-toolbar.scss';

interface Props {
  onToolbarClick(item: IToolItem): void;
}
export interface State {
  [prop: string]: any;
}
export interface IToolItem {
  key: string;
  value: string;
  label: string;
  icon?: IconDefinition;
}

// 快捷操作栏
export default class MdToolBar extends React.Component<Props, State> {
  public constructor(props: Props) {
    super(props);
  }

  // 点击事件
  public toolHandler = (item: IToolItem) => {
    this.props.onToolbarClick(item);
  };

  public render() {
    const toolbar: IToolItem[] = [
      {
        key: 'undo',
        value: 'undo',
        label: 'UnDo',
        icon: faUndo
      },
      {
        key: 'redo',
        value: 'redo',
        label: 'ReDo',
        icon: faRedo
      }
      // {
      //   key: 'tab',
      //   value: 'Tab',
      //   label: 'Tab'
      // },
      // {
      //   key: 'shift+tab',
      //   value: 'Shift+Tab',
      //   label: 'Shift+Tab'
      // },
      // {
      //   key: 'pic',
      //   value: '![图片加载失败显示的名称](图片地址)',
      //   label: '图片',
      //   icon: faImage
      // },
      // {
      //   key: 'link',
      //   value: '[链接名称](链接地址)',
      //   label: '链接',
      //   icon: faLink
      // }
    ];

    return (
      <div className={styles['md-toolbar']}>
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
