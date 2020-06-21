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
export type TagItem = {
  name: string;
  count: number;
};

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
  const [currentTag, setCurrentTag] = useState<TagItem>();

  useEffect(() => {
    setNoteList(fullNoteList);
  }, [fullNoteList]);

  useEffect(() => {
    if (currentTag) {
      setNoteList(() => {
        return fullNoteList.filter((note) => note.tag === currentTag.name);
      });
    } else {
      setNoteList(fullNoteList);
    }
  }, [currentTag]);

  useEffect(() => {
    restore();
  }, []);

  const restore = () => {
    const scTop = props.scrollRestore!();
    const _state = props.stateRestore!();
    setNoteList(_state?.noteList || fullNoteList);
    setCurrentTag(_state?.currentTag);
    setTimeout(() => {
      document.body.scrollTop = scTop || 0;
      document.documentElement.scrollTop = scTop || 0;
    }, 0);
  };

  // 标签
  const tags: TagItem[] = useMemo(() => {
    if (!fullNoteList) return [];
    const _tags: TagItem[] = [];
    fullNoteList[0]?.name &&
      fullNoteList?.forEach((noteItem) => {
        const hasItem: TagItem | undefined = _tags.find(
          (item) => item.name === noteItem.tag
        );
        if (hasItem) {
          hasItem.count++;
        } else {
          _tags.push({ name: noteItem.tag, count: 1 });
        }
      });
    return [{ name: '全部', count: fullNoteList.length }, ..._tags];
  }, [fullNoteList]);

  const onTagChange = (tag: TagItem | undefined) => {
    setCurrentTag(tag);
  };

  // 离开前保存状态
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
                    key={`${noteitem.tag}-${noteitem.name}`}
                    to={`/detail/${noteitem.tag}/${noteitem.name}`}
                    className={`link ${styles.item}`}
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
