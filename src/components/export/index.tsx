import * as React from 'react';
import html2canvas from 'html2canvas';
import styles from './export.scss';

const { useState, useEffect } = React;

interface Props {
  btnPCSpace: string, 
  isMobile: boolean
}

// 导出md文件、生成图片(html2canvas)
function Export(props: Props) {
  const [offsetW, setOffsetW] = useState(0);
  const [offsetH, setOffsetH] = useState(0);
  const [pngUrl, setPngUrl] = useState('');
  const [mdUrl, setMdUrl] = useState('');
  const [exportName, setExportName] = useState('');
  let preview:any = '';
  let maxCodeWidth:number = 0;

  useEffect(() => {
    // 显示的内容
    preview = document.querySelector('#md-content');
    // 获取 code 部分的最大宽度，防止导出图片时，横向滚动条的部分截断
    let codeContent = preview.querySelectorAll('pre>code');
    let codeWidth = Array.from(codeContent).map((codeTag: HTMLPreElement) => codeTag.offsetWidth);
    maxCodeWidth = Math.max(...codeWidth);
    setOffsetW(maxCodeWidth);
    setOffsetH(preview.offsetHeight);

    exportfn('md');
    setTimeout(() => exportfn('png'), 0);

    // 回调的函数会在 unmount 时执行
    return () => console.log('Export unmount');
  }, []);

  // 导出处理
  const exportfn = (type: string) => {
    // type: 'md'/'png'
    // 设置文件名称
    setExportName(preview.textContent.substr(0, 16).replace(' ', '_'));

    // 导出图片
    if (type === 'png') {
      html2canvas(preview, {
        scale: 1, // window.devicePixelRatio
        // 截取的window宽度，使得横向滚动条不出现，避免截取丢失滚动条之外的内容
        windowWidth: maxCodeWidth + 80,
        useCORS: true // 图片跨域
      }).then((canvas) => {
        let temppng = canvas.toDataURL('image/png');
        setPngUrl(temppng);
      });
    }
    // 导出 md文件
    else if (type === 'md') {
      let url = window.URL;
      // let url = window.URL || window.webkitURL || window.mozURL;
      let md:string = localStorage.getItem('mdtext')!;
      let tempmd:Blob = new Blob([JSON.parse(md!)], {
        type: 'application/markdown'
      });
      setMdUrl(url.createObjectURL(tempmd));
    }
  };

  // 按钮距左右两侧的距离
  const { btnPCSpace, isMobile } = props;

  return (
    <div className={styles.export}>
      <canvas
        className={styles['export-canvas']}
        width={offsetW}
        height={offsetH}
      />
      {pngUrl && exportName && (
        <a
          className={`${styles['export-png']} ${styles['export-btn']}`}
          style={{ left: isMobile ? '10px' : btnPCSpace }}
          href={pngUrl}
          download={exportName + '.png'}
        >
          <button className={`btn`}>导出图片</button>
        </a>
      )}
      {mdUrl && exportName && (
        <a
          className={styles['export-btn']}
          style={{ left: isMobile ? '10px' : btnPCSpace }}
          href={mdUrl}
          download={exportName + '.md'}
        >
          <button className={`btn`}>导出md文件</button>
        </a>
      )}
    </div>
  );
}

export default Export;
