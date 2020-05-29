import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import useNoteModel from '@/model/useNoteModel';
import ChangeTheme from '../changeTheme';
import Modal from '@/components/Modal';
import styles from './Tools.scss';

const Tools: React.FC = () => {
  const exportJsonRef = useRef<HTMLAnchorElement>(null);
  const importJsonRef = useRef<HTMLInputElement>(null);
  const [showContent, setShowContent] = useState(false);
  const [isExport, setIsExport] = useState(false);
  const { clearCache, noteList, updateNoteList } = useNoteModel((modal) => [
    modal.clearCache,
    modal.noteList,
    modal.updateNoteList,
  ]);

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
      type: 'application/json',
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

  return (
    <div className={styles['home-tools']}>
      <ChangeTheme />
      <FontAwesomeIcon
        className={styles.setting}
        icon={faCog}
        onClick={onShowSettingPanel}
      />
      <Modal
        visible={showContent}
        title="设置"
        wrapperClassName={styles.wrapper}
        onClose={() => setShowContent(false)}
      >
        <section className={styles.content}>
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
      </Modal>
    </div>
  );
};

export default Tools;
