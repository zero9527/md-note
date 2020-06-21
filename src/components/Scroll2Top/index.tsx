import React, { CSSProperties, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDoubleUp } from '@fortawesome/free-solid-svg-icons';
import useWindowClick from '@/utils/useWindowClick';
import styles from './styles.scss';

export interface Scroll2TopProps {
  position?: CSSProperties;
}

// 回到顶部
const Scroll2Top: React.FC<Scroll2TopProps> = ({ position }) => {
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
      document.body.scrollTop -= 100;
      document.documentElement.scrollTop -= 100;

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
