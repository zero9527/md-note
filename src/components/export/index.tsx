import React, { useState, useRef, useEffect, CSSProperties } from 'react';
import Loadable from '@loadable/component';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThLarge, faTimes } from '@fortawesome/free-solid-svg-icons';
import styles from './export.scss';
// import { cacheUtil } from '@/utils';

const html2canvas = Loadable(() =>
  import(/* webpackChunkName: "html2canvas" */ 'html2canvas')
);

export interface ExportProps {
  id: string | number;
  mdtext: string;
  children: React.ReactNode;
  position?: CSSProperties; // 按钮距左右两侧的距离
}

// 导出md文件、生成图片(html2canvas)
function Export({ id, position, mdtext, ...props }: ExportProps) {
  const [imgUrl, setImgUrl] = useState('');
  const [mdUrl, setMdUrl] = useState('');
  const [exportName, setExportName] = useState('');
  const [btnShow, setBtnShow] = useState(false);
  const [isExportImg, setIsExportImg] = useState(false);
  const [isExportMd, setIsExportMd] = useState(false);
  const preview = useRef<HTMLDivElement | null>();
  const previewDefaultWidth = useRef<number>();

  useEffect(() => {
    // 显示的内容
    preview.current = document.querySelector<HTMLDivElement>('#md-content');
    previewDefaultWidth.current = preview.current!.offsetWidth;

    const fileName = mdtext.substring(0, mdtext.indexOf('\n')).split('# ')[1];
    // 设置文件名称
    // preview.current.textContent?.substr(0, 16).replace(' ', '_') || '导出'
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
      // eslint-disable-next-line
      (document.querySelector('.export-md') as HTMLElement)!.click();
      setIsExportMd(false);
    }, 0);
  };

  // 导出 图片
  const exportImg = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isExportImg) return;
    setIsExportImg(true);

    let maxCodeWidth = 0;
    // 获取 code 部分的最大宽度，防止导出图片时，横向滚动条的部分截断
    let codeContent = preview.current?.querySelectorAll('pre>code');
    if (codeContent) {
      let codeWidth = Array.from(codeContent).map(
        (codeTag: any) => codeTag.offsetWidth
      );
      maxCodeWidth = Math.max(...codeWidth);
    }
    const width = maxCodeWidth + 80;
    // 避免导出图片截断/大片空白等问题
    if (width > preview.current!.offsetWidth) {
      preview.current!.style.width = width + 'px';
    }
    setTimeout(() => {
      const height = preview.current!.offsetHeight + 30;

      html2canvas(preview.current!, {
        scale: 1, // window.devicePixelRatio
        x: 0,
        y: 0,
        width,
        height,
        useCORS: true // 图片跨域
      }).then((canvas: any) => {
        let temppng: any = canvas.toDataURL('image/png');
        setImgUrl(temppng);
        temppng = null;

        preview.current!.style.width = 'auto';
        setTimeout(() => {
          (document.querySelector('.export-img') as HTMLElement)!.click();
          setIsExportImg(false);
        }, 0);
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

  const renderTools = () => (
    <div className={styles.tools}>
      <a
        target="_blank"
        rel="noopener noreferrer"
        className="export-a export-md"
        download={exportName + '.md'}
        href={mdUrl}
      ></a>
      <a
        target="_blank"
        rel="noopener noreferrer"
        className="export-a export-img"
        download={exportName + '.png'}
        href={imgUrl}
      ></a>
      <button className="btn" onClick={(e: React.MouseEvent) => exportMD(e)}>
        导出md文件
        {isExportMd ? '...' : ''}
      </button>
      <button className="btn" onClick={(e: React.MouseEvent) => exportImg(e)}>
        导出图片
        {isExportImg ? '...' : ''}
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
    </div>
  );
}

export default Export;
