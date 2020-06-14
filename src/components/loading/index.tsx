import React from 'react';
import ReactDOM from 'react-dom';
import styles from './styles.scss';

// 路由跳转 Loading组件
const Loading: React.FC = () => {
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
};

export default Loading;
