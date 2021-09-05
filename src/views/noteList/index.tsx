import React, { useEffect, useMemo, useState } from 'react';
import { KeepAliveAssist } from 'keep-alive-comp';
import { Link } from 'react-router-dom';
import useGlobalModel from '@/model/useGlobalModel';
import useNoteModel, { NoteItem } from '@/model/useNoteModel';
import RightPanel from '@/components/RightPanel';
import Scroll2Top from '@/components/Scroll2Top';
import ArticleTag from '@/components/ArticleTag';
import styles from './styles.scss';

interface NoteListProps extends KeepAliveAssist {}
export type TagItem = {
  name: string;
  count: number;
};

// 列表
const NoteList: React.FC<NoteListProps> = (props) => {
  const { scrollTop } = useGlobalModel(modal => [modal.scrollTop]);
  const { loading, noteList: fullNoteList } = useNoteModel();
  // 当前noteList
  const [noteList, setNoteList] = useState<NoteItem[]>([]);
  // 当前标签
  const [currentTag, setCurrentTag] = useState<TagItem>();

  useEffect(() => {
    if (!loading) setNoteList(fullNoteList);
  }, [loading]);

  useEffect(() => {
    if (currentTag) {
      setNoteList(() => {
        return fullNoteList.filter((note) =>
          note.tag.split(',').some((tag) => tag.trim() === currentTag.name)
        );
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
  // TODO: 拆分到外部
  const tags: TagItem[] = useMemo(() => {
    if (!fullNoteList[0]?.name) {
      return [{ name: '全部', count: fullNoteList.length }];
    }
    let allTags = fullNoteList.reduce<TagItem[]>((acc, cur) => {
      // 多个tag
      const multiTags = cur.tag.split(',').map((item) => item.trim());
      multiTags.forEach((name) => {
        const hasItems = acc.filter((item) => item.name === name);
        if (hasItems.length) {
          hasItems.forEach((item) => item.count++);
        } else {
          acc.push({ name, count: 1 });
        }
      });
      return acc;
    }, []);
    // 降序排序
    allTags.sort((x, y) => y.count - x.count);
    return [{ name: '全部', count: fullNoteList.length }, ...allTags];
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

  const ReachBottom = () =>
    loading ? null : (
      <div className={styles['reach-bottom']}>
        <span>到底了</span>
      </div>
    );

  return (
    <>
      <main className={`center-content ${styles['note-list']}`}>
        <ArticleTag
          className={styles.tags}
          tags={tags}
          currentTag={currentTag}
          onTagChange={onTagChange}
        />
        <section
          id={loading ? styles.skeleton : ''}
          className={`container ${styles.container}`}
        >
          {noteList?.length > 0 &&
            noteList?.map?.((noteitem, index) => (
              <Link
                key={index}
                to={`/detail/${noteitem.tag.split(',')[0]}/${
                  noteitem.name.split('.')[0]
                }`}
                title={noteitem.title}
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
            ))}
          <ReachBottom />
        </section>
        {showScroll2Top && <Scroll2Top />}
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
