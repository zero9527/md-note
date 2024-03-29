import React, { useState, useEffect, useRef } from 'react';
import { useParams, useLocation } from 'react-router';
import ClipboardJS from 'clipboard';
import useGlobalModel from '@/model/useGlobalModel';
import useNoteModel from '@/model/useNoteModel';
import Loading from '@/components/Loading';
import Scroll2Top from '@/components/Scroll2Top';
import MdPreview from '@/components/MdPreview';
import MdCatalog from '@/components/MdCatalog';
import PicPreview from '@/components/PicPreview';
import styles from './styles.less';

////////////////
// TODO：图片懒加载
// 试试 MutationObserver
///////////////

// 详情
const NoteDetail: React.FC = () => {
  const { stickyRightStyle, scrollTop } = useGlobalModel((modal) => [
    modal.stickyRightStyle,
    modal.scrollTop,
  ]);
  const { getNoteById, fetchNoteByName } = useNoteModel((modal) => [
    modal.getNoteById,
    modal.fetchNoteByName,
  ]);
  const { tag, name } = useParams<{ tag: string; name: string }>();
  const location = useLocation();
  const [is404, setIs404] = useState(false);
  const [title, setTitle] = useState('');
  const [mdtext, setMdtext] = useState<string | undefined>();
  const [showScroll2Top, setShowScroll2Top] = useState(false);
  const [defaultCateActive, setDefaultCateActive] = useState<string>();
  const clipboard = useRef<ClipboardJS>();

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
    // document.querySelector('#md-content')?.click();
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

  const onGetTitle = (_title: string) => {
    setTitle(_title);
  };

  // 点击目录标题
  const onCateClick = (hash: string) => {
    scrollToView(hash);
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
      onImgClick(e);
    };
    // 需要初始化一次，不然要点击两次才能复制
    const copyCodeElems = document.querySelectorAll(
      '#md-content .copy-code'
    ) as NodeList;
    Array.from(copyCodeElems).forEach((el: HTMLElement) => {
      el.onmouseenter = function(e: any) {
        onCopyCode(e);
      };
    });
  };

  // 图片点击新窗口打开
  const onImgClick = (e: any) => {
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
    const copyCodeEl: HTMLElement | null = e.target?.closest('.copy-code');
    if (!copyCodeEl || !copyCodeEl.dataset.code) return;

    const text = copyCodeEl.querySelector('span')!;
    const realCode = decodeURI(copyCodeEl.dataset.code);

    clipboard.current = new ClipboardJS(copyCodeEl, {
      action: () => 'copy',
      text: () => realCode,
    });
    clipboard.current.on('success', () => restoreText('复制成功'));
    clipboard.current.on('error', () =>
      restoreText('<span style="color:red;">复制失败</span>')
    );

    const restoreText = (innerHTML: string) => {
      text.innerHTML = innerHTML;
      clipboard.current?.destroy();
      setTimeout(() => {
        text.innerHTML = '复制代码';
      }, 2000);
    };
  };

  // 视图滚动到对应标题位置
  const scrollToView = (hash: string) => {
    if (!hash) {
      document.body.scrollTop = document.documentElement.scrollTop = 0;
      return;
    }
    setDefaultCateActive(hash);
    const el = document.getElementById(hash) as HTMLElement;
    if (el) {
      const scTop = el.offsetTop - 10;
      document.body.scrollTop = document.documentElement.scrollTop = scTop;
    }
  };

  const onScroll = () => {
    setShowScroll2Top(() => scrollTop > window.innerHeight);
  };

  const Nomatch = () => (
    <div className={styles['article-404']}>文章不见了。。。</div>
  );

  return (
    <main className={`center-content ${styles['note-detail']}`}>
      {mdtext ? (
        <>
          <MdPreview mdtext={mdtext} onMdRendered={onMdRendered} />
          <PicPreview {...picPreview} />
          <MdCatalog
            mdtext={mdtext}
            defaultActive={defaultCateActive}
            onCateClick={onCateClick}
            onGetTitle={onGetTitle}
          />
        </>
      ) : (
        !is404 && <Loading />
      )}
      {is404 && <Nomatch />}
      {showScroll2Top && <Scroll2Top position={stickyRightStyle} />}
    </main>
  );
};

export default NoteDetail;
