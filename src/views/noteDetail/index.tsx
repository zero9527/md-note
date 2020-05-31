import React, { useState, useEffect, CSSProperties } from 'react';
import { useHistory, useParams, useLocation } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import useGlobalModel from '@/model/useGlobalModel';
import Loading from '@/components/loading';
import Scroll2Top from '@/components/Scroll2Top';
import useNoteModel from '@/model/useNoteModel';
import StickyRight from '@/components/stickyRight';
import Header from '@/components/header';
import useScroll from '@/utils/useScroll';
import MdPreview from '@/components/mdPreview';
import MdCatalog from '@/components/mdCatalog';
import Export from '@/components/export';
// import { throttle } from '@/utils';
import styles from './note-detail.scss';

// 详情
const NoteDetail: React.FC = () => {
  const { theme } = useGlobalModel((modal) => [modal.theme]);
  const {
    getNoteById,
    updateNoteById,
    fetchNoteById,
  } = useNoteModel((modal) => [
    modal.getNoteById,
    modal.updateNoteById,
    modal.fetchNoteById,
  ]);
  const { tag, tid } = useParams<{ tag: string; tid: string }>();
  const history = useHistory();
  const location = useLocation();
  const { scrollTop } = useScroll();
  const { stickyRightStyle } = useGlobalModel((modal) => [
    modal.stickyRightStyle,
  ]);
  const [is404, setIs404] = useState(false);
  const [title, setTitle] = useState('');
  const [mdtext, setMdtext] = useState<string | undefined>();
  const [showScroll2Top, setShowScroll2Top] = useState(false);
  const [defaultCateActive, setDefaultCateActive] = useState<string>();

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    onScroll();
  }, [scrollTop]);

  const init = async () => {
    const cache = getNoteById(tid);
    if (cache?.data) {
      setMdtext(cache.data);
      return;
    }

    try {
      // 请求数据
      const res: any = await fetchNoteById(tag, tid);
      if (res?.code === 0) {
        if (res.data.substring(0, 20).includes('<!DOCTYPE html>')) return;
        updateNoteById(tid, res.data);
        setMdtext(res.data);
      } else {
        console.log('数据没有了！');
        setMdtext('');
        setIs404(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const onBack = () => {
    history.push('/');
  };

  const onGetTitle = (_title: string) => {
    setTitle(_title);
  };

  // 点击目录标题
  const onCateClick = (hash: string) => {
    history.replace({ pathname: location.pathname, hash });
  };

  // markdown 渲染好了
  const onMdRendered = () => {
    const hash = location.hash.substr(1, location.hash.length);
    setTimeout(() => scrollToView(decodeURI(hash)), 0);
  };

  // 视图滚动到对应标题位置
  const scrollToView = (hash: string) => {
    if (!hash) return;
    const el = document.getElementById(hash) as HTMLElement;
    el?.scrollIntoView();
    setDefaultCateActive(hash);
  };

  const onScroll = () => {
    setShowScroll2Top(() => scrollTop > window.innerHeight);
  };

  const Nomatch = () => (
    <div className={styles['article-404']}>文章不见了。。。</div>
  );

  return (
    <>
      <Header className={styles.header}>
        <div className="center-content">
          <FontAwesomeIcon
            icon={faChevronLeft}
            className={styles.back}
            title="返回首页"
            onClick={onBack}
          />
          <span title="文章标题">&nbsp;{title}</span>
        </div>
      </Header>
      <main className={`center-content ${styles['note-detail']}`}>
        {mdtext ? (
          <>
            <MdPreview mdtext={mdtext} onMdRendered={onMdRendered} />
            <StickyRight>
              <MdCatalog
                mdtext={mdtext}
                defaultActive={defaultCateActive}
                onCateClick={onCateClick}
                onGetTitle={onGetTitle}
              >
                {/* <Export id={tid} position={stickyRightStyle} mdtext={mdtext}>
                  <a href={`./#/md-editor/${tag}/${tid}`} className="link">
                    <button className="btn">编辑</button>
                  </a>
                </Export> */}
              </MdCatalog>
            </StickyRight>
          </>
        ) : (
          !is404 && <Loading />
        )}
        {is404 && <Nomatch />}
        {showScroll2Top && <Scroll2Top position={stickyRightStyle} />}
      </main>
    </>
  );
};

export default NoteDetail;
