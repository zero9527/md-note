import React, { useEffect } from 'react';
import useScroll from '@/utils/useScroll';
import { TagItem } from '@/views/NoteList';
import StickyRight from '@/components/StickyRight';
import ArticleTag from '../ArticleTag';
import { mountParcel } from '@/index';
import styles from './styles.scss';

export interface RightPanelProps {
  tags: TagItem[];
  currentTag: TagItem | undefined;
  onTagChange: (tag?: TagItem) => void;
}

const RightPanel: React.FC<RightPanelProps> = ({
  tags,
  currentTag,
  onTagChange,
}) => {
  const { scrollTop, prevScrollTop } = useScroll();

  useEffect(() => {
    mountParcelHandler('@vue-mf/clock', 'app-clock');
    mountParcelHandler('@vue-mf/calendar', 'app-calendar');
  }, []);

  const mountParcelHandler = (appName: string, domId: string) => {
    const parcelConfig = (window as any).System.import(appName);
    const domElement = document.getElementById(domId)!;
    mountParcel(parcelConfig, { domElement });
  };

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
        marginTop: scrollTop > 50 && scrollTop > prevScrollTop ? '0' : '',
      }}
    >
      <div className={styles.wrapper}>
        <div id="app-clock" className={styles['single-spa-clock']} />
        <div id="app-calendar" className={styles['single-spa-calendar']} />
        <ArticleTag
          tags={tags}
          currentTag={currentTag}
          onTagChange={onTagChange}
        />
        <div className={styles.footer}>
          <Beian />
          <CopyRight />
        </div>
      </div>
    </StickyRight>
  );
};

export default RightPanel;
