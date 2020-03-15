import React from 'react';
import ReactDOM from 'react-dom';
import styles from './loading.scss';

// 路由跳转 Loading组件
function Loading() {
  return ReactDOM.createPortal(
    <div className={`center-content ${styles.loading}`}>
      <div className={styles.content}>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>,
    document.body
  );
}

export default Loading;
