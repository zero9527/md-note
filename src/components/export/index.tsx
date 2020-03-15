import React, { useState, useEffect, CSSProperties } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThLarge, faTimes } from '@fortawesome/free-solid-svg-icons';
import useGlobalModel from '@/model/useGlobalModel';
import PicPreview from '../picPreview';
// import { cacheUtil } from '@/utils';
import styles from './export.scss';

export interface ExportProps {
  id: string | number;
  mdtext: string;
  children: React.ReactNode;
  position?: CSSProperties; // 按钮距左右两侧的距离
}

// 导出md文件、生成图片(html2canvas)
function Export({ id, position, mdtext, ...props }: ExportProps) {
  const { theme } = useGlobalModel(modal => [modal.theme]);
  const [imgUrl, setImgUrl] = useState('');
  const [mdUrl, setMdUrl] = useState('');
  const [exportName, setExportName] = useState('');
  const [btnShow, setBtnShow] = useState(false);
  const [isExportImg, setIsExportImg] = useState(false);
  const [isExportMd, setIsExportMd] = useState(false);

  useEffect(() => {
    const fileName = mdtext.substring(0, mdtext.indexOf('\n')).split('# ')[1];
    setExportName(fileName || '导出');
  }, []);

  useEffect(() => {
    resize();
    function resize() {
      if (!btnShow && window.innerWidth >= 1100) {
        setBtnShow(true);
      }
      if (window.innerWidth < 1100) setBtnShow(false);
    }

    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('resize', resize);
    };
  }, []);

  // 导出 md文件
  const exportMD = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.nativeEvent.stopPropagation();
    if (isExportMd) return;
    setIsExportMd(true);

    const url = window.URL;
    const tempmd: Blob = new Blob([mdtext], {
      type: 'application/text'
    });
    setMdUrl(url.createObjectURL(tempmd));

    setTimeout(() => {
      (document.querySelector('.export-md') as HTMLElement)!.click();
      setIsExportMd(false);
    }, 0);
  };

  // 导出 图片
  const exportImg = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isExportImg) return;
    setIsExportImg(true);

    let mdContent = document.getElementById('md-content') as HTMLDivElement;
    let maxCodeWidth = 0;
    // 获取 code 部分的最大宽度，防止导出图片时，横向滚动条的部分截断
    let codeContent = mdContent?.querySelectorAll('pre>code');
    if (codeContent) {
      let codeWidth = Array.from(codeContent).map(
        (codeTag: any) => codeTag.offsetWidth
      );
      maxCodeWidth = Math.max(...codeWidth);
      renderImg(mdContent, maxCodeWidth);
    }
  };

  const renderImg = (mdContent: HTMLDivElement, maxCodeWidth: number) => {
    const scale = 1;
    const width = maxCodeWidth * scale;
    // 避免导出图片截断/大片空白等问题
    if (width > mdContent!.offsetWidth || width > 600) {
      mdContent!.style.width = width + 'px';
    }
    setTimeout(async () => {
      const height = mdContent!.offsetHeight * scale;

      const { default: html2canvas } = await import('html2canvas');
      html2canvas(mdContent!, {
        scale,
        x: 0,
        y: 0,
        scrollX: 0,
        scrollY: 0,
        width,
        height,
        useCORS: true,
        windowWidth: width,
        windowHeight: height + 20,
        backgroundColor: theme === 'dark' ? '#272727' : '#fff'
      }).then((canvas: HTMLCanvasElement) => {
        setImgUrl(() => canvas.toDataURL('image/png'));
        mdContent!.style.width = 'auto';
      });
    }, 0);
  };

  const onShowTools = () => {
    setBtnShow(!btnShow);
    setTimeout(() => {
      if (!btnShow) window.addEventListener('click', bodyClick);
      else window.removeEventListener('click', bodyClick);
    }, 0);
  };

  const bodyClick = () => {
    setTimeout(() => setBtnShow(false), 0);
    window.removeEventListener('click', bodyClick);
  };

  const onPicPreviewClode = () => {
    setIsExportImg(false);
    setImgUrl('');
  };

  const renderTools = () => (
    <div className={styles.tools}>
      <button className="btn" onClick={(e: React.MouseEvent) => exportMD(e)}>
        导出md文件
        {isExportMd ? '...' : ''}
      </button>
      <button className="btn" onClick={(e: React.MouseEvent) => exportImg(e)}>
        导出图片
      </button>
      {props.children}
    </div>
  );

  return (
    <div className={styles.export}>
      <button className={`btn ${styles.toggle}`} onClick={onShowTools}>
        <FontAwesomeIcon icon={btnShow ? faTimes : faThLarge} />
      </button>
      {btnShow && renderTools()}
      <PicPreview
        show={isExportImg}
        src={imgUrl}
        alt={`${exportName}.png`}
        onClode={onPicPreviewClode}
      />
    </div>
  );
}

export default Export;
