import React, { useEffect, useMemo } from 'react';
import { KeepAliveAssist } from 'keep-alive-comp';
import useNoteModel from '@/model/useNoteModel';
import useScroll from '@/utils/useScroll';
import Header from '@/components/header';
import Tools from '@/components/Tools';
import Scroll2Top from '@/components/Scroll2Top';
import useGlobalModel from '@/model/useGlobalModel';
import RightPanel from './rightPanel';
import styles from './noteList.scss';

interface NoteListProps extends KeepAliveAssist {}

// 列表
const NoteList: React.FC<NoteListProps> = (props) => {
  const { loading, noteList } = useNoteModel();
  const { scrollTop } = useScroll();
  const { stickyRightStyle } = useGlobalModel((modal) => [
    modal.stickyRightStyle,
  ]);

  useEffect(() => {
    restore();
  }, []);

  const restore = () => {
    const scTop = props.scrollRestore!();
    setTimeout(() => {
      document.body.scrollTop = scTop || 0;
      document.documentElement.scrollTop = scTop || 0;
    }, 0);
  };

  const toDetailClick = () => {
    props.beforeRouteLeave!(scrollTop, {});
  };

  const showScroll2Top = useMemo(() => {
    return scrollTop > window.innerHeight;
  }, [scrollTop]);

  const ReachBottom = () => (
    <div className={styles['reach-bottom']}>
      <span>到底了</span>
    </div>
  );

  return (
    <>
      <Header className={styles.header}>
        <div className="center-content content">
          <div>
            MD-NOTE：
            <span className={styles.desc}>一个使用 markdown 的简易博客</span>
          </div>
          <Tools />
        </div>
      </Header>
      <main className={`center-content ${styles['note-list']}`}>
        <section
          id={loading ? styles.skeleton : ''}
          className={styles.container}
        >
          {noteList?.length > 0 ? (
            <>
              {noteList?.map?.((noteitem, noteindex) => {
                return (
                  <a
                    className={`link ${styles.item}`}
                    key={`${noteitem.tag}-${noteitem.name}`}
                    href={`./#/detail/${noteitem.tag}/${noteitem.name}`}
                    onClick={toDetailClick}
                  >
                    <div className={styles.title}>{noteitem.title}</div>
                    <div className={styles.desc}>
                      <span className={styles.tag}>
                        标签：<span>{noteitem.tag}</span>
                      </span>
                      <span className={styles.time}>
                        创建时间：{noteitem.create_time}
                      </span>
                    </div>
                  </a>
                );
              })}
              <ReachBottom />
            </>
          ) : (
            <div>没有数据</div>
          )}
        </section>
        {showScroll2Top && <Scroll2Top position={stickyRightStyle} />}
        <RightPanel />
        {/* <div className="gitter">
          <a href="./#/note-add" className={`link btn ${styles.add}`}>
            +
          </a>
        </div> */}
      </main>
    </>
  );
};

export default NoteList;
