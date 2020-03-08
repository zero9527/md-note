import React, { useEffect, useState, useRef, CSSProperties } from 'react';
import useNoteModel from '@/model/useNoteModel';
import HomeTools from '@/components/homeTools';
import useGlobalModel from '@/model/useGlobalModel';
import styles from './noteList.scss';

interface NoteListProps {
  show?: boolean;
}

// export interface IMonthItem {
//   month: string;
//   list: INoteItem[];
// }
export interface NoteItem {
  id: string | number;
  date: string;
  desc: string;
}

// const monthList = [
//   'Jan',
//   'Feb',
//   'Mar',
//   'Apr',
//   'May',
//   'Jun',
//   'Jul',
//   'Aug',
//   'Sep',
//   'Oct',
//   'Nov',
//   'Dec'
// ];

// 笔记列表
function NoteList({ show = true }: NoteListProps) {
  const nodeListElemRef = useRef<HTMLDivElement>();
  const { height } = useGlobalModel();
  const { loading, noteList } = useNoteModel();
  const [toolsPositionStyle, setToolsPositionStyle] = useState<CSSProperties>();
  const [sctollTop, setScrollTop] = useState(0);

  useEffect(() => {
    resizeFn();
    window.addEventListener('resize', resizeFn);

    return () => {
      window.removeEventListener('resize', resizeFn);
    };
  }, []);

  useEffect(() => {
    nodeListElemRef.current = document.querySelector(
      `.${styles['note-list']}`
    ) as HTMLDivElement;

    function onScroll(e: any) {
      setScrollTop(e.target.scrollTop || sctollTop);
    }

    nodeListElemRef.current?.addEventListener('scroll', onScroll);

    return () => {
      nodeListElemRef.current?.removeEventListener('scroll', onScroll);
    };
  }, []);

  useEffect(() => {
    if (show && nodeListElemRef.current)
      nodeListElemRef.current!.scrollTop = sctollTop;
  }, [show]);

  // 按月份分组数据
  // function formateNoteList() {}

  // 新增按钮
  function resizeFn(): void {
    const bodyWidth = document.body.clientWidth;
    const MAX_VIEW_WIDTH = 1100;
    const CONTENT_WIDTH = 1100;
    const style =
      bodyWidth > MAX_VIEW_WIDTH
        ? { left: `${(bodyWidth - MAX_VIEW_WIDTH) / 2 + CONTENT_WIDTH - 60}px` }
        : { right: '12px' };
    setToolsPositionStyle(style);
  }

  return (
    <div
      className={`center-content ${styles['note-list']}`}
      style={{ height, display: show ? 'block' : 'none' }}
    >
      <div className={`border-1px-bottom title`}>
        <span>md-note</span>
        <HomeTools />
      </div>
      <section
        id={loading ? styles.skeleton : ''}
        className={styles['month-item']}
      >
        {noteList?.length > 0 ? (
          noteList?.map?.((noteitem, noteindex) => {
            return (
              <a
                className={`link ${styles['note-item']}`}
                key={noteindex}
                href={`./#/detail/${noteitem.id}`}
              >
                <div className={styles['item-date']}>
                  <div className={styles.time}>
                    {noteitem.date.substr(11, 5)}
                  </div>
                  <div className={styles.date}>
                    {noteitem.date.substr(5, 5)}
                  </div>
                </div>
                <div className={styles['item-desc']}>{noteitem.desc}</div>
              </a>
            );
          })
        ) : (
          <div>没有数据</div>
        )}
      </section>
      {/* {notelist.map((monthitem, monthindex) => {
        return (
          <section
            id={loading ? styles.skeleton : ''}
            className={styles['month-item']}
            key={monthindex}
          >
            <div className={styles['item-month']}>
              <span>{monthitem.month}</span>
              <span className={styles['item-month-en']}>
                {monthList[+monthitem.month.split('-')[1] - 1]}
              </span>
            </div>
            {monthitem.list.map((noteitem, noteindex) => {
              return (
                <div
                  className={styles['note-item']}
                  key={noteindex}
                  onClick={() => toDetail(noteitem.id)}
                >
                  <div className={styles['item-date']}>
                    {noteitem.date.substring(8, noteitem.date.length)}
                  </div>
                  <div className={styles['item-desc']}>{noteitem.desc}</div>
                </div>
              );
            })}
          </section>
        );
      })} */}
      <a
        href="./#/note-add"
        className={`link btn ${styles.add}`}
        style={toolsPositionStyle}
      >
        +
      </a>
    </div>
  );
}

export default NoteList;
