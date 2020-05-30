import React, { CSSProperties } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDoubleUp } from '@fortawesome/free-solid-svg-icons';
import styles from './scroll2top.scss';

export interface Scroll2TopProps {
  position?: CSSProperties;
}

// 回到顶部
const Scroll2Top: React.FC<Scroll2TopProps> = ({ position }) => {
  const onScroll2oTop = () => {
    const content = document.querySelector('#md-note');
    content?.scrollIntoView();
  };

  return (
    <div className="gitter">
      <div
        style={position}
        className={`btn ${styles.scroll2top}`}
        onClick={onScroll2oTop}
      >
        <FontAwesomeIcon icon={faAngleDoubleUp} />
      </div>
    </div>
  );
};

export default Scroll2Top;
