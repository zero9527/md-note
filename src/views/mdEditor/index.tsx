import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useRouteMatch, useHistory } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faExpand,
  faCompress
} from '@fortawesome/free-solid-svg-icons';
import Loadable from '@loadable/component';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/lib/codemirror.css';
import useNoteModel from '@/model/useNoteModel';
import MdPreview from '../../components/mdPreview';
import MdToolBar, { IToolItem } from '@/components/mdToolbar';
// import fileApi from '@/api/file';
import styles from './mdEditor.scss';

const { UnControlled: CodeMirror } = Loadable(() =>
  import(/* webpackChunkName: "codemirror" */ 'react-codemirror2')
);

// 编辑器
function MdEditor() {
  const match = useRouteMatch<{ id: string }>();
  const history = useHistory();
  const { getNoteById, updateNoteById, fetchNoteById } = useNoteModel();
  const codeMirrorEditor = useRef<CodeMirror.Editor>();
  const noteAdd = useRef<string>('');
  const [mdtextRaw, setMdtextRaw] = useState(''); // 原始的编辑数据
  const [mdtext, setMdtext] = useState(''); // 当前编辑数据
  const [editorScrollTopRate, setEditorScrollTopRate] = useState(0); // 编辑的滚动位置，用于同步预览界面
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (match.path.includes('/md-editor/')) init();
  }, []);

  const init = async () => {
    const cache = getNoteById(match.params.id);
    if (cache) {
      setMdtextRaw(cache.data);
      setMdtext(cache.data);
    } else {
      const res: any = await fetchNoteById(match.params.id);
      if (res) {
        if (res.substring(0, 20).includes('<!DOCTYPE html>')) return;
        setMdtextRaw(res);
        setMdtext(res);
      }
    }
  };

  const onFullscreen = () => {
    const el = document.documentElement as any;
    if (isFullscreen) document.exitFullscreen();
    else {
      el.requestFullscreen
        ? el.requestFullscreen()
        : el.webkitRequestFullscreen
        ? el.webkitRequestFullscreen()
        : el.mozRequestFullscreen
        ? el.mozRequestFullscreen()
        : el.eequestFullscreen();
    }
    setIsFullscreen(!isFullscreen);
  };

  const onBack = () => {
    let path = '';
    const id = match.params.id || codeMirrorEditor.current;
    if (!match.params.id) path = '/';
    else path = `/detail/${id}`;
    history.push(path);
  };

  // 点击快捷栏 某一功能
  const onToolbarClick = (toolItem: IToolItem) => {
    console.log('toolItem: ', toolItem);
    switch (toolItem.key) {
      case 'undo': // 撤销
        codeMirrorEditor.current?.undo();
        break;
      case 'redo': // 重做
        codeMirrorEditor.current?.redo();
        break;
      case 'link': // 链接
        // cursorPosStart = cursorPos + 7;
        codeMirrorEditor.current?.redo();
        break;
      case 'pic': // 图片
        // cursorPosStart = cursorPos + 15;
        codeMirrorEditor.current?.redo();
        break;
      default:
        break;
    }
  };

  // 编辑
  const onCodeChange = (
    editor: CodeMirror.Editor,
    data: CodeMirror.EditorChange,
    value: string
  ) => {
    // console.log('editor: ', editor);
    if (!codeMirrorEditor.current) codeMirrorEditor.current = editor;
    if (!match.params.id && !noteAdd.current) noteAdd.current = `${Date.now()}`;
    updateNoteById(match.params.id || noteAdd.current, value);
    setMdtext(value);
  };

  // 编辑器滚动
  const onEditorScroll = (
    editor: CodeMirror.Editor,
    data: CodeMirror.ScrollInfo
  ) => {
    setEditorScrollTopRate(data.top / data.height);
  };

  const renderHeader = useCallback(
    () => (
      <h4 className={`border-1px-bottom title`}>
        <span onClick={onBack}>
          <FontAwesomeIcon icon={faArrowLeft} className="back" />
          {match.path === '/note-add' ? '新增' : '编辑'}
        </span>
        <span
          className={styles.fullscreen}
          title={isFullscreen ? '退出全屏' : '全屏'}
          onClick={onFullscreen}
        >
          {isFullscreen ? (
            <FontAwesomeIcon icon={faCompress} />
          ) : (
            <FontAwesomeIcon icon={faExpand} />
          )}
        </span>
      </h4>
    ),
    // eslint-disable-next-line
    [isFullscreen]
  );

  const codeMirrorOption = { tabSize: 2 };

  const contentHeight = { height: `${window.innerHeight - 92}px` };

  return (
    <div className={styles.editor}>
      {renderHeader()}
      <section className={styles.content} style={contentHeight}>
        <CodeMirror
          value={mdtextRaw}
          options={codeMirrorOption}
          onChange={onCodeChange}
          onScroll={onEditorScroll}
        />
        <MdPreview
          isEdit={true}
          mdtext={mdtext}
          scrollTopRate={editorScrollTopRate}
          className={styles['edit-preview']}
        />
      </section>
      <MdToolBar onToolbarClick={onToolbarClick} />
    </div>
  );
}

export default MdEditor;
