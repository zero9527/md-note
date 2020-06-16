import React, { useState, useEffect } from 'react';
import { useHistory, useParams, useLocation } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import useGlobalModel from '@/model/useGlobalModel';
import useNoteModel from '@/model/useNoteModel';
import useScroll from '@/utils/useScroll';
import Loading from '@/components/Loading';
import Header from '@/components/Header';
import Scroll2Top from '@/components/Scroll2Top';
import StickyRight from '@/components/StickyRight';
import MdPreview from '@/components/MdPreview';
import MdCatalog from '@/components/MdCatalog';
import PicPreview from '@/components/PicPreview';
import styles from './styles.scss';

// 详情
const NoteDetail: React.FC = () => {
  const { stickyRightStyle } = useGlobalModel((modal) => [
    modal.stickyRightStyle,
  ]);
  const {
    getNoteById,
    updateNoteById,
    fetchNoteByName,
  } = useNoteModel((modal) => [
    modal.getNoteById,
    modal.updateNoteById,
    modal.fetchNoteByName,
  ]);
  const { tag, name } = useParams<{ tag: string; name: string }>();
  const history = useHistory();
  const location = useLocation();
  const { scrollTop } = useScroll();
  const [is404, setIs404] = useState(false);
  const [title, setTitle] = useState('');
  const [mdtext, setMdtext] = useState<string | undefined>();
  const [showScroll2Top, setShowScroll2Top] = useState(false);
  const [defaultCateActive, setDefaultCateActive] = useState<string>();

  const onClosePicPreview = () => {
    updatePicPreview((pre) => ({ ...pre, show: false }));
  };

  const [picPreview, updatePicPreview] = useState({
    show: false,
    src: '',
    alt: '',
    onClose: onClosePicPreview,
  });

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    onScroll();
  }, [scrollTop]);

  const init = async () => {
    const cache = getNoteById(name);
    if (cache?.data) {
      setMdtext(cache.data);
      return;
    }

    try {
      // 请求数据
      const res: any = await fetchNoteByName(tag, name);
      if (res?.code === 0) {
        if (res.data.substring(0, 20).includes('<!DOCTYPE html>')) return;
        updateNoteById(name, res.data);
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
    setTimeout(() => {
      scrollToView(decodeURI(hash));
      onMdContentClick();
    }, 0);
  };

  // 点击事件代理
  const onMdContentClick = () => {
    const mdContent = document.querySelector('#md-content') as HTMLElement;
    mdContent.onclick = function(e: any) {
      onCopyCode(e);
      addImgHandler(e);
    };
  };

  // 图片点击新窗口打开
  const addImgHandler = (e: any) => {
    const imgEl: HTMLImageElement | null = e.target?.closest('.md-img');
    if (imgEl) {
      window.open(imgEl.src);
      // updatePicPreview({
      //   show: true,
      //   src: img.src,
      //   alt: img.alt,
      //   onClose: onClosePicPreview,
      // });
    }
  };

  // 复制代码
  const onCopyCode = (e: any) => {
    // TODO: 复制到剪贴板
    const copyCodeEl: HTMLElement | null = e.target?.closest('.copy-code');
    if (copyCodeEl && copyCodeEl.dataset.code) {
      const realCode = decodeURI(copyCodeEl.dataset.code);
      console.log(realCode);
    }
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
          <span className={styles.title} title="文章标题">
            &nbsp;{title}
          </span>
        </div>
      </Header>
      <main className={`center-content ${styles['note-detail']}`}>
        {mdtext ? (
          <>
            <MdPreview mdtext={mdtext} onMdRendered={onMdRendered} />
            <PicPreview {...picPreview} />
            <StickyRight>
              <MdCatalog
                mdtext={mdtext}
                defaultActive={defaultCateActive}
                onCateClick={onCateClick}
                onGetTitle={onGetTitle}
              />
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
