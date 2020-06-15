import React, { CSSProperties, useEffect } from 'react';
import ReactDOM from 'react-dom';
import useGlobalModel from '@/model/useGlobalModel';
import useThrottle from '@/utils/useThrottle';
import styles from './styles.scss';

interface StickyRightProps extends React.HTMLAttributes<HTMLDivElement> {
  onResize?: (position: CSSProperties) => void;
}

// 固定在内容右侧
const StickyRight: React.FC<StickyRightProps> = ({
  style,
  className,
  onResize,
  ...props
}) => {
  const { stickyRightStyle, setStickyRightStyle } = useGlobalModel((modal) => [
    modal.stickyRightStyle,
    modal.setStickyRightStyle,
  ]);

  useEffect(() => {
    resize();
    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('resize', resize);
    };
  }, []);

  const resize = useThrottle(() => {
    const bodyWidth = document.body.clientWidth;
    const MAX_VIEW_WIDTH = 979;
    const CONTENT_WIDTH = 710;
    const style =
      bodyWidth > MAX_VIEW_WIDTH
        ? {
            left: `${(bodyWidth - MAX_VIEW_WIDTH) / 2 + CONTENT_WIDTH + 16}px`,
          }
        : { right: '12px' };
    setStickyRightStyle(style);
    if (onResize) onResize(style);
  }, 16);

  return ReactDOM.createPortal(
    <div
      className={`${styles['sticky-right']} ${className || ''}`}
      style={{ ...stickyRightStyle, ...style }}
      {...props}
    >
      {props.children}
    </div>,
    document.body
  );
};

export default StickyRight;
