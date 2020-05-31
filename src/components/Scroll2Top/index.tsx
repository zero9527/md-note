import React, { CSSProperties, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDoubleUp } from '@fortawesome/free-solid-svg-icons';
import useWindowClick from '@/utils/useWindowClick';
import styles from './scroll2top.scss';

export interface Scroll2TopProps {
  position?: CSSProperties;
}

// 回到顶部
const Scroll2Top: React.FC<Scroll2TopProps> = ({ position }) => {
  const height = useRef(window.innerHeight);
  const scrollTop = useRef(0);
  const canScroll = useRef(false); // 允许滚动

  // 全局点击
  const onWindowClick = () => {
    onRemoveClick();
  };

  const onRemoveClick = () => {
    canScroll.current = false;
    removeListener();
  };

  const { addListener, removeListener } = useWindowClick(onWindowClick);

  const onScroll2oTop = (e: React.MouseEvent) => {
    e.stopPropagation();
    scrollTop.current =
      document.body.scrollTop || document.documentElement.scrollTop;
    canScroll.current = true;
    addListener();
    scrollHandler();
  };

  const scrollHandler = () => {
    let scTop = document.body.scrollTop || document.documentElement.scrollTop;
    if (scTop > 0) {
      // 滚动距离，大于屏幕高度8倍时间隔为屏幕高度，否则100px
      const longPage = scrollTop.current >= height.current * 8;
      const range = longPage ? height.current : 100;
      document.body.scrollTop -= range;
      document.documentElement.scrollTop -= range;

      if (canScroll.current) setTimeout(scrollHandler, 16);
    } else {
      onRemoveClick();
    }
  };

  return (
    <div className="gitter">
      <div
        style={position}
        className={`btn ${styles.scroll2top}`}
        onClick={(e: any) => onScroll2oTop(e)}
      >
        <FontAwesomeIcon icon={faAngleDoubleUp} />
      </div>
    </div>
  );
};

export default Scroll2Top;
