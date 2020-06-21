import React, { useEffect } from 'react';
import useScroll from '@/utils/useScroll';
import { TagItem } from '@/views/NoteList';
import StickyRight from '@/components/StickyRight';
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

  const getActiveTag = (tag: TagItem) => {
    if (!currentTag && tag.name === '全部') return styles.active;
    return tag.name === currentTag?.name ? styles.active : '';
  };

  // 标签
  const Tags = () => (
    <div className={styles.tags}>
      <span>标签：</span>
      {tags.map((tag: TagItem, index: number) => (
        <span
          key={tag.name}
          className={`${styles.tag} ${getActiveTag(tag)}`}
          title={`${tag.name}: ${tag.count}`}
          onClick={() => onTagChange(index === 0 ? undefined : tag)}
        >
          <span>{tag.name || '全部'}</span>
          <span className={styles.count}>
            {tag.count > 99 ? '99+' : tag.count}
          </span>
        </span>
      ))}
    </div>
  );

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
      <div id="app-clock" className={styles['single-spa-clock']} />
      <div id="app-calendar" className={styles['single-spa-calendar']} />
      <Tags />
      <div className={styles.footer}>
        <Beian />
        <CopyRight />
      </div>
    </StickyRight>
  );
};

export default RightPanel;
