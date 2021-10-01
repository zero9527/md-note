import React, { useState, useEffect, CSSProperties } from 'react';
import useGlobalModel from '@/model/useGlobalModel';
import Tools from '@/components/Tools';
import styles from './styles.less';

interface HeaderProps {
  hiddenTop?: number; // 滚动开始隐藏的距离
  className?: CSSProperties;
}

// 固定在顶部，屏幕上滑显示，下滑隐藏
const Header: React.FC<HeaderProps> = ({
  hiddenTop = 50,
  className,
  ...props
}) => {
  const [toggleVisible, setToggleVisible] = useState('');
  const { prevScrollTop, scrollTop } = useGlobalModel(modal => [modal.scrollTop, modal.prevScrollTop]);

  useEffect(() => {
    onScroll()
  }, [scrollTop]);

  const onScroll = () => {
    // 向下
    if (scrollTop > prevScrollTop && scrollTop > hiddenTop)
      setToggleVisible(styles.hidden);
    // 向上
    else setToggleVisible(styles.visible);
  };

  return (
    <header className={`${styles.header} ${className || ''} ${toggleVisible}`}>
      {props.children ? (
        props.children
      ) : (
        <div className={`center-content ${styles.content}`}>
          <a href="/" title="ZERO9527的小站" className={styles.title}>
            ZERO9527的小站
          </a>
          <div className={styles.tools}>
            <Tools />
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
