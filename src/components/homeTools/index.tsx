import React, { useState, useEffect, useRef, CSSProperties } from 'react';
import ReactDOM from 'react-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import useNoteModel from '@/model/useNoteModel';
import styles from './homeTools.scss';

export interface HomeToolsProps {
  style: CSSProperties | undefined;
}

const HomeTools: React.FC<HomeToolsProps> = ({ style }) => {
  const exportJsonRef = useRef<HTMLAnchorElement>(null);
  const importJsonRef = useRef<HTMLInputElement>(null);
  const [showContent, setShowContent] = useState(false);
  const [isExport, setIsExport] = useState(false);
  const [leftPos, setLeftPos] = useState('0');
  const { clearCache, noteList, updateNoteList } = useNoteModel(modal => [
    modal.clearCache,
    modal.noteList,
    modal.updateNoteList
  ]);

  useEffect(() => {
    function resize() {
      if (window.innerWidth >= 1100) {
        setLeftPos(`${(window.innerWidth - 1100) / 2}px`);
      } else {
        setLeftPos('0');
      }
    }

    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('resize', resize);
    };
  }, []);

  useEffect(() => {
    if (showContent) toggleBlur('add');
    else toggleBlur('remove');

    const bodyClick = () => {
      setTimeout(() => setShowContent(false), 0);
      window.removeEventListener('click', bodyClick);
    };

    if (showContent) {
      window.addEventListener('click', bodyClick);
    } else {
      window.removeEventListener('click', bodyClick);
    }
  }, [showContent]);

  const toggleBlur = (type: 'add' | 'remove') => {
    document.querySelector('#md-note')?.classList[type]('blur');
  };

  // 清缓存
  const onClearCache = (e: React.MouseEvent) => {
    e.stopPropagation();
    clearCache();
    setTimeout(() => {
      alert('缓存清理成功！');
      setShowContent(false);
    }, 0);
  };

  // 数据导出到json
  const onExportJson = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isExport) return;
    setIsExport(true);
    const url = window.URL;
    const tempJson: Blob = new Blob([JSON.stringify(noteList)], {
      type: 'application/json'
    });
    exportJsonRef.current!.href = url.createObjectURL(tempJson);
    setTimeout(() => {
      exportJsonRef.current!.click();
      setIsExport(false);
      setShowContent(false);
    }, 0);
  };

  // 从'*.json'文件导入数据
  const onImportJson = (e: React.MouseEvent) => {
    e.stopPropagation();
    importJsonRef.current?.addEventListener('change', onImportFile);
    importJsonRef.current?.click();
  };

  // 导入 '*.json' 文件
  const onImportFile = (e: any) => {
    const file = e.target.files?.[0];
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = function(evt) {
      const result = evt.target?.result;
      try {
        const data = JSON.parse((result as string) || '');
        if (!data || data.length === 0 || !Array.isArray(data)) return;
        // 无效的json
        const one = data[0];
        const inValidJson = Object.keys(one).some((key: any) => !one[key]);
        if (!inValidJson) updateNoteList(data);
      } catch (err) {
        console.error('导入文件失败！', err);
        alert('文件格式不正确！');
      }
    };
  };

  const onShowSettingPanel = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowContent(true);
  };

  const contentClassName = `${styles.content} ${
    showContent ? styles.show : ''
  }`;

  return ReactDOM.createPortal(
    <div className={styles['home-tools']} style={style}>
      <FontAwesomeIcon
        className={styles.setting}
        icon={faCog}
        onClick={onShowSettingPanel}
      />
      <div
        className={styles.wrapper}
        style={{ display: showContent ? 'block' : '', left: leftPos }}
      >
        <section className={contentClassName}>
          <div className={styles.title}>
            <span>设置</span>
          </div>
          <div className={styles.item} onClick={onClearCache}>
            清缓存
          </div>
          <div className={styles.item} onClick={onExportJson}>
            <a
              ref={exportJsonRef}
              href="href"
              download="md-note备份.json"
              hidden={true}
            ></a>
            导出到文件(*.josn) {isExport ? '...' : ''}
          </div>
          <div className={styles.item} onClick={onImportJson}>
            <input
              ref={importJsonRef}
              type="file"
              accept="application/json"
              hidden={true}
            />
            从文件导入(*.json)
          </div>
        </section>
      </div>
    </div>,
    document.body
  );
};

export default HomeTools;
