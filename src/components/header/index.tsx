import React, { useState, useEffect, CSSProperties } from 'react';
import useScroll from '@/utils/useScroll';
import styles from './header.scss';

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
  const { prevScrollTop, scrollTop } = useScroll();

  useEffect(() => {
    onScroll();
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
      {props.children}
    </header>
  );
};

export default Header;
