import React from 'react';
import StickyRight from '@/components/stickyRight';
import { isMobile } from '@/utils';
import styles from './noteList.scss';

const RightPanel: React.FC = () => {
  return (
    <StickyRight className={styles.iframe}>
      {!isMobile && (
        <>
          <iframe
            src="https://zero9527.github.io/vue-calendar"
            className={styles.calendar}
          />
          <div className={styles.mask} />
          <div className={styles.beian}>
            <a
              href="http://www.beian.miit.gov.cn/"
              target="__blank"
              title="备案号"
            >
              粤ICP备20014593号-1
            </a>
            <div>
              @2020{' '}
              <a
                href="https://github.com/zero9527"
                target="__blank"
                title="github"
              >
                zero9527
              </a>
            </div>
          </div>
        </>
      )}
    </StickyRight>
  );
};

export default RightPanel;
