import React, { CSSProperties } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDoubleUp } from '@fortawesome/free-solid-svg-icons';
import styles from './scroll2top.scss';

export interface Scroll2TopProps {
  position?: CSSProperties;
}

const Scroll2Top: React.FC<Scroll2TopProps> = ({ position }) => {
  const onScroll2oTop = () => {
    const content = document.querySelector('#md-note');
    content?.scrollIntoView(/* { behavior: 'smooth' } */);
  };

  return (
    <div
      style={position}
      className={`btn dark ${styles.scroll2top}`}
      onClick={onScroll2oTop}
    >
      <FontAwesomeIcon icon={faAngleDoubleUp} />
    </div>
  );
};

export default Scroll2Top;
