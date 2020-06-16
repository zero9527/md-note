import React, { useState, useEffect, useMemo, useRef } from 'react';
import marked from 'marked';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';
// import 'highlight.js/styles/an-old-hope.css';
// import 'highlight.js/styles/docco.css';
// import 'highlight.js/styles/monokai.css';
// import 'highlight.js/styles/github.css';
import MoveBtn, { PosParam } from './moveBtn';
import styles from './styles.scss';

interface MdPreviewProps {
  isEdit?: boolean;
  mdtext: string;
  className?: string;
  scrollTopRate?: number;
  onMdRendered?: () => void;
}

// 编辑器
const MdPreview: React.FC<MdPreviewProps> = ({
  isEdit,
  mdtext,
  className,
  scrollTopRate,
  onMdRendered,
}) => {
  const mdContent = useRef<HTMLElement>();
  const [previewVisible, setPreviewVisible] = useState(true);
  const [pos, setPos] = useState({ posBottom: 50, posRight: 10 });

  useEffect(() => {
    if (scrollTopRate) {
      mdContent.current = document.querySelector(
        `.${styles['md-content']}`
      ) as HTMLDivElement;
      if (mdContent.current) {
        mdContent.current.scrollTop =
          mdContent.current.scrollHeight * scrollTopRate;
      }
    }
  }, [scrollTopRate]);

  const highlight = function(code: string, language: string) {
    const validLanguage = hljs.getLanguage(language) ? language : 'plaintext';
    return hljs.highlight(validLanguage, code, true).value;
  };

  // marked 样式
  const markedHighlight = () => {
    // 渲染设置
    const renderer = new marked.Renderer();
    // 设置标题，生成目录跳转需要
    renderer.heading = function(text: string, level: number) {
      return `<h${level} class="heading-h${level}" id="${text}" title="${text}"><span>${text}</span></h${level}>`;
    };
    // 代码块
    renderer.code = function(src: string, tokens: string) {
      const codeCopyContent = encodeURI(src);
      const iconContent = `<span>复制代码</span>
      <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="copy" class="svg-inline--fa fa-copy fa-w-14 " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
      <path fill="currentColor" d="M320 448v40c0 13.255-10.745 24-24 24H24c-13.255 0-24-10.745-24-24V120c0-13.255 10.745-24 24-24h72v296c0 30.879 25.121 56 56 56h168zm0-344V0H152c-13.255 0-24 10.745-24 24v368c0 13.255 10.745 24 24 24h272c13.255 0 24-10.745 24-24V128H344c-13.2 0-24-10.8-24-24zm120.971-31.029L375.029 7.029A24 24 0 0 0 358.059 0H352v96h96v-6.059a24 24 0 0 0-7.029-16.97z"></path>
      </svg>`;
      return `<pre>
        <div class="languange">
          <span>${tokens}</span>
          <span class="copy-code" data-code="${codeCopyContent}">${iconContent}</span>
        </div>
        <div class="code-wrapper"><code class="${tokens}">${highlight(
        src,
        tokens
      )}</code></div>
      </pre>`;
    };
    // 设置链接
    renderer.link = function(href: string, title: string, text: string) {
      const _title = title || href || '';
      return `<a href="${href}" class="link" title="${_title}" target="_blank">${text}
      <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="external-link-alt" class="svg-inline--fa fa-external-link-alt fa-w-16 " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
      <path fill="currentColor" d="M432,320H400a16,16,0,0,0-16,16V448H64V128H208a16,16,0,0,0,16-16V80a16,16,0,0,0-16-16H48A48,48,0,0,0,0,112V464a48,48,0,0,0,48,48H400a48,48,0,0,0,48-48V336A16,16,0,0,0,432,320ZM488,0h-128c-21.37,0-32.05,25.91-17,41l35.73,35.73L135,320.37a24,24,0,0,0,0,34L157.67,377a24,24,0,0,0,34,0L435.28,133.32,471,169c15,15,41,4.5,41-17V24A24,24,0,0,0,488,0Z">
      </path></svg>
      </a>`;
    };
    // 给图片添加类名，添加点击事件，方便点击查看大图
    renderer.image = function(src: string, alt: string) {
      return `<img src="${src}" alt="${alt || ''}" class="md-img" />`;
    };

    marked.setOptions({
      renderer,
      highlight,
      langPrefix: '',
      pedantic: false,
      gfm: true,
      tables: true,
      breaks: false,
      sanitize: false,
      smartLists: true,
      smartypants: false,
      xhtml: false,
    });
  };

  // markdown渲染好了
  const mdRendered = () => {
    markedHighlight();
    onMdRendered?.();
  };

  // 显示、关闭预览
  const previewHandler = () => {
    setPreviewVisible(!previewVisible);
  };

  const onPosChange = ({ posBottom, posRight }: PosParam) => {
    setPos({ posBottom, posRight });
  };

  const containerClassName = useMemo(
    () =>
      `container ${styles['md-container']} ${
        isEdit ? styles['md-preview'] : styles['md-detail']
      } ${className || ''}`,
    [isEdit, className]
  );

  const containerStyle = useMemo(() => {
    const marginBottom = `${pos.posBottom}px`;
    const marginRight = `${pos.posRight}px`;
    return isEdit ? { marginBottom, marginRight } : {};
  }, [isEdit, pos.posBottom, pos.posRight]);

  return (
    <div className={containerClassName} style={containerStyle}>
      {isEdit && previewVisible && (
        // 拖动
        <MoveBtn className={styles.drag} onPosChange={onPosChange} />
      )}
      {(!isEdit || previewVisible) && (
        <section
          data-text={isEdit && '预览'}
          className={styles['md-content']}
          id="md-content"
          dangerouslySetInnerHTML={{
            __html: marked(mdtext, mdRendered()),
          }}
        />
      )}

      {isEdit && (
        <>
          {/* <div className="change-size change-size-left" /> */}
          <div style={{ textAlign: 'right' }}>
            <button className="btn" onClick={previewHandler}>
              {previewVisible ? '关闭预览' : '显示预览'}
            </button>
          </div>
          {/* <div className="change-size change-size-bottom" /> */}
        </>
      )}
    </div>
  );
};

export default React.memo(MdPreview, (prevProps, nextProps) => {
  if (!nextProps.isEdit) return true;

  const areEqual = !Object.keys(nextProps).some(
    (prop) => nextProps[prop] !== prevProps[prop]
  );

  return areEqual;
});
