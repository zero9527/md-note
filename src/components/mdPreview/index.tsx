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

  // marked 样式
  const markedHighlight = () => {
    // 渲染设置
    const renderer = new marked.Renderer();
    // 设置标题，生成目录跳转需要
    renderer.heading = function(text: string, level: number) {
      return `<h${level} class="heading-h${level}" id="${text}" title="${text}"><span>${text}</span></h${level}>`;
    };
    // 设置链接
    renderer.link = function(href: string, title: string, text: string) {
      return `<a href="${href}" title="${title}" target="_blank">${text}</a>`;
    };
    renderer.image = function(src: string, alt: string) {
      return `<img src="${src}" alt="${alt || ''}" class="md-img" />`;
    };

    marked.setOptions({
      renderer,
      highlight: function(code: string, language: string) {
        const validLanguage = hljs.getLanguage(language)
          ? language
          : 'plaintext';
        return hljs.highlight(validLanguage, code, true).value;
      },
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
      `${styles['md-container']} ${
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
