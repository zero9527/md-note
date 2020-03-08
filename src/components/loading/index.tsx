import React from 'react';
import ReactDOM from 'react-dom';
import loadingGif from '@/assets/loading.gif';
import styles from './loading.scss';

interface Props {
  children?: any;
}

// 路由跳转 Loading组件
function Loading(props: Props) {
  return ReactDOM.createPortal(
    <div className={`center-content ${styles['loading-wrapper']}`}>
      <div className={styles['loading-content']}>
        <img src={loadingGif} alt="loading" className={styles.icon} />
        <div className={styles.text}>{props.children || '正在加载中...'}</div>
      </div>
    </div>,
    document.body
  );
}

export default Loading;
