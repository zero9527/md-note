import React from 'react';
import ChangeTheme from '../ChangeTheme';
import styles from './styles.less';

const Tools: React.FC = () => {
  return (
    <div className={styles['home-tools']}>
      <ChangeTheme />
    </div>
  );
};

export default Tools;
