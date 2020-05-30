import React, { useEffect } from 'react';
import { KeepAliveAssist } from 'keep-alive-comp';
import useNoteModel from '@/model/useNoteModel';
import StickyRight from '@/components/stickyRight';
import useScroll from '@/utils/useScroll';
import Header from '@/components/header';
import Tools from '@/components/Tools';
import styles from './noteList.scss';

interface NoteListProps extends KeepAliveAssist {}

// 列表
const NoteList: React.FC<NoteListProps> = (props) => {
  const { loading, noteList } = useNoteModel();
  const { scrollTop } = useScroll();

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

  return (
    <>
      <Header className={styles.header}>
        <div className="center-content content">
          <span>MD-NOTE</span>
          <Tools />
        </div>
      </Header>
      <main className={`center-content ${styles['note-list']}`}>
        <section
          id={loading ? styles.skeleton : ''}
          className={styles.container}
        >
          {noteList?.length > 0 ? (
            noteList?.map?.((noteitem, noteindex) => {
              return (
                <a
                  className={`link ${styles['note-item']}`}
                  key={`${noteitem.tag}-${noteitem.tid}`}
                  href={`./#/detail/${noteitem.tag}/${noteitem.tid}`}
                  onClick={toDetailClick}
                >
                  <div className={styles['item-date']}>
                    <div className={styles.time}>
                      {noteitem.date.substr(11, 5)}
                    </div>
                    <div className={styles.date}>
                      {noteitem.date.substr(5, 5)}
                    </div>
                  </div>
                  <div className={styles['item-desc']}>
                    <span className={styles.tag}>{noteitem.tag}</span>
                    {noteitem.desc}
                  </div>
                </a>
              );
            })
          ) : (
            <div>没有数据</div>
          )}
        </section>
        <StickyRight className={styles.iframe}>
          <iframe
            src="https://zero9527.github.io/vue-calendar"
            className={styles.calendar}
          />
          <div className={styles.mask} />
        </StickyRight>
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
