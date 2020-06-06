import React from 'react';
import useScroll from '@/utils/useScroll';
import StickyRight from '@/components/stickyRight';
import useGlobalModel from '@/model/useGlobalModel';
import styles from './styles.scss';

const RightPanel: React.FC = () => {
  const { scrollTop, prevScrollTop } = useScroll();
  const { rightPanelVisible } = useGlobalModel();

  const Beian = () => (
    <a href="http://www.beian.miit.gov.cn/" target="__blank" title="备案号">
      粤ICP备20014593号-1
    </a>
  );

  const CopyRight = () => (
    <div>
      @2020&nbsp;
      <a href="https://github.com/zero9527" target="__blank" title="github">
        zero9527
      </a>
    </div>
  );

  return (
    <StickyRight
      className={styles['right-panel']}
      style={{
        display: rightPanelVisible ? 'block' : 'none',
        marginTop: scrollTop > 50 && scrollTop > prevScrollTop ? '0' : '',
      }}
    >
      <div id="app-calendar" data-desc="single-spa" />
      <div className={styles.beian}>
        <Beian />
        <CopyRight />
      </div>
    </StickyRight>
  );
};

export default RightPanel;
