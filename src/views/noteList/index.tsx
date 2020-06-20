import React, { useEffect, useMemo, useState } from 'react';
import { KeepAliveAssist } from 'keep-alive-comp';
import { Link } from 'react-router-dom';
import useGlobalModel from '@/model/useGlobalModel';
import useNoteModel, { NoteItem } from '@/model/useNoteModel';
import useScroll from '@/utils/useScroll';
import Header from '@/components/Header';
import Tools from '@/components/Tools';
import RightPanel from '@/components/RightPanel';
import Scroll2Top from '@/components/Scroll2Top';
import styles from './styles.scss';

interface NoteListProps extends KeepAliveAssist {}

// 列表
const NoteList: React.FC<NoteListProps> = (props) => {
  const { scrollTop } = useScroll();
  const { loading, noteList: fullNoteList } = useNoteModel();
  const { stickyRightStyle } = useGlobalModel((modal) => [
    modal.stickyRightStyle,
  ]);
  // 当前noteList
  const [noteList, setNoteList] = useState<NoteItem[]>([]);
  // 当前标签
  const [currentTag, setCurrentTag] = useState('');

  useEffect(() => {
    restore();
  }, []);

  useEffect(() => {
    setNoteList(fullNoteList);
  }, [fullNoteList]);

  useEffect(() => {
    if (currentTag) {
      setNoteList(() => {
        return fullNoteList.filter((note) => note.tag === currentTag);
      });
    } else {
      setNoteList(fullNoteList);
    }
  }, [currentTag]);

  const restore = () => {
    const scTop = props.scrollRestore!();
    const _state = props.stateRestore!();
    setNoteList(_state?.noteList || []);
    setCurrentTag(_state?.currentTag || '');
    setTimeout(() => {
      document.body.scrollTop = scTop || 0;
      document.documentElement.scrollTop = scTop || 0;
    }, 0);
  };

  // 标签
  const tags = useMemo(() => {
    if (!fullNoteList) return [];
    const tags: string[] = [''];
    fullNoteList[0]?.name &&
      fullNoteList?.forEach((noteItem) => {
        if (!tags.includes(noteItem.tag)) tags.push(noteItem.tag);
      });
    return tags;
  }, [fullNoteList]);

  const onTagChange = (tag: string) => {
    setCurrentTag(tag);
  };

  const toDetailClick = () => {
    props.beforeRouteLeave!(scrollTop, {
      noteList,
      currentTag,
    });
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
            MD-NOTE
            <span className={styles.desc}>：一个使用 markdown 的简易博客</span>
          </div>
          <Tools />
        </div>
      </Header>
      <main className={`center-content ${styles['note-list']}`}>
        <section
          id={loading ? styles.skeleton : ''}
          className={`container ${styles.container}`}
        >
          {noteList?.length > 0 ? (
            <>
              {noteList?.map?.((noteitem) => {
                return (
                  <Link
                    to={`/detail/${noteitem.tag}/${noteitem.name}`}
                    className={`link ${styles.item}`}
                    key={`${noteitem.tag}-${noteitem.name}`}
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
                  </Link>
                );
              })}
              <ReachBottom />
            </>
          ) : (
            <ReachBottom />
          )}
        </section>
        {showScroll2Top && <Scroll2Top position={stickyRightStyle} />}
      </main>
      <RightPanel
        tags={tags}
        currentTag={currentTag}
        onTagChange={onTagChange}
      />
    </>
  );
};

export default NoteList;
