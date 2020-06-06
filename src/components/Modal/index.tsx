import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWindowClose } from '@fortawesome/free-solid-svg-icons';
import styles from './styles.scss';

export interface Modal {
  visible: boolean;
  title: React.ReactNode;
  wrapperClassName?: string;
  maskCloseable?: boolean;
  onClose: () => void;
}
const Modal: React.FC<Modal> = ({
  visible,
  title,
  wrapperClassName,
  maskCloseable = true,
  onClose,
  children,
  ...props
}) => {
  useEffect(() => {
    if (visible) {
      toggleBlur('add');
      document.body.style.overflowY = 'hidden';
    } else {
      toggleBlur('remove');
      document.body.style.overflowY = '';
    }

    if (maskCloseable) {
      const bodyClick = () => {
        setTimeout(() => onClose(), 0);
        window.removeEventListener('click', bodyClick);
      };

      if (visible) {
        window.addEventListener('click', bodyClick);
      } else {
        window.removeEventListener('click', bodyClick);
      }
    }

    return () => {
      toggleBlur('remove');
      document.body.style.overflowY = '';
    };
  }, [visible]);

  const toggleBlur = (type: 'add' | 'remove') => {
    document.querySelector('#md-note')?.classList[type]('blur');
  };

  const contentClassName = `${styles.content} ${visible ? styles.show : ''}`;

  const Content = () => (
    <div className={styles.modal}>
      <div
        className={`${styles.wrapper} ${wrapperClassName || ''}`}
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
      >
        <section className={styles.title}>
          <span>{title}</span>
          <FontAwesomeIcon
            className={styles.close}
            icon={faWindowClose}
            onClick={onClose}
          />
        </section>
        <section className={contentClassName}>{children}</section>
      </div>
    </div>
  );

  return visible ? ReactDOM.createPortal(<Content />, document.body) : null;
};

export default Modal;
