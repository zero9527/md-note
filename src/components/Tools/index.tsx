import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import ChangeTheme from '../ChangeTheme';
import styles from './styles.scss';

const Tools: React.FC = () => {
  return (
    <div className={styles['home-tools']}>
      <ChangeTheme />
    </div>
  );
};

export default Tools;
