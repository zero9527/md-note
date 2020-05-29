import React, { useEffect, useState, useRef } from 'react';
import { KeepAliveAssist } from 'keep-alive-comp';
import useNoteModel from '@/model/useNoteModel';
import Tools from '@/components/Tools';
import styles from './noteList.scss';

interface NoteListProps extends KeepAliveAssist {}

// 列表
const NoteList: React.FC<NoteListProps> = (props) => {
  const { loading, noteList } = useNoteModel();
  const [scrollTop, setScrollTop] = useState(0);

  useEffect(() => {
    restore();
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', onScroll, false);
    return () => {
      window.removeEventListener('scroll', onScroll, false);
    };
  }, []);

  const restore = () => {
    const scTop = props.scrollRestore!();
    setTimeout(() => {
      document.body.scrollTop = scTop || 0;
      document.documentElement.scrollTop = scTop || 0;
    }, 0);
  };

  const onScroll = (e: any) => {
    // 移动端 body.scrollTop, PC端 documentElement.scrollTop
    const scTop = e.target.body.scrollTop || e.target.documentElement.scrollTop;
    setScrollTop(scTop || 0);
  };

  const toDetailClick = () => {
    props.beforeRouteLeave!(scrollTop, {});
  };

  return (
    <>
      <header className={`border-1px-bottom header`}>
        <div className="center-content content">
          <span>MD-NOTE</span>
          <Tools />
        </div>
      </header>
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
        <div className="gitter">
          <a href="./#/note-add" className={`link btn ${styles.add}`}>
            +
          </a>
        </div>
      </main>
    </>
  );
};

export default NoteList;
