import React, { useMemo, useEffect } from 'react';
import ReactDOM from 'react-dom';
import styles from './index.scss';

export interface PicPreview {
  show: boolean;
  src: string;
  alt: string;
  onClode: () => void;
}
// 图片预览
const PicPreview: React.FC<PicPreview> = ({ show, src, alt, onClode }) => {
  useEffect(() => {
    const mdNote = document.querySelector('#md-note') as HTMLDivElement;
    const catalog = document.querySelector('#catalog') as HTMLElement;
    if (show) {
      mdNote.classList.add('blur');
      catalog.classList.add('blur');
      document.body.style.overflowY = 'hidden';
    } else {
      mdNote.classList.remove('blur');
      catalog.classList.remove('blur');
      document.body.style.overflowY = '';
    }

    return () => {
      mdNote.classList.remove('blur');
      catalog.classList.remove('blur');
      document.body.style.overflowY = '';
    };
  }, [show]);

  return ReactDOM.createPortal(
    <>
      {show && (
        <section className={styles['pic-preview']}>
          <div className={styles.content}>
            <button className={`btn ${styles.close}`} onClick={onClode}>
              X
            </button>
            <div className={styles['img-content']}>
              {src ? (
                <img src={src} alt={alt} />
              ) : (
                <span className={styles.loading}>正在生成截图。。。</span>
              )}
            </div>
            <div className={styles.text}>导出图片预览，右键另存/长按保存！</div>
          </div>
        </section>
      )}
    </>,
    document.body
  );
};

export default PicPreview;
