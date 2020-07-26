import { useState, useEffect } from 'react';
import { createModel } from 'hox';
import fileApi, { getNoteListConfig } from '@/api/file';
import { dateFormate } from '@/utils';
import FastSort from '@/utils/fastSort';

// 标签
export type NoteTag =
  | 'demo'
  | 'js'
  | 'node.js'
  | 'react'
  | 'vue'
  | 'mini-program'
  | 'others';

export type NoteItem = {
  tag: string;
  name: string;
  title: string;
  create_time: string;
  desc: string;
  data: string;
};

const maxAgeConfig = {
  '0': 0,
  '24h': 24 * 60 * 60 * 1000,
  '7day': 7 * 24 * 60 * 60 * 1000,
};
type MaxAge = keyof typeof maxAgeConfig;

const NoteSkeleton: NoteItem[] = [
  { create_time: '', tag: '', name: '', desc: '', data: '', title: '' },
];

// 管理 NoteList
const useNoteModel = () => {
  const [loading, setLoading] = useState(false);
  const [noteList, setNoteList] = useState<NoteItem[]>(NoteSkeleton);

  useEffect(() => {
    if (noteList[0]?.name === '') {
      setLoading(true);
      // TODO: 改为typescript，可以在新增的时候有类型提示
      getNoteListConfig().then((res: any) => {
        updateNoteList(FastSort<NoteItem>(res, 'create_time').reverse());
        setLoading(false);
      });
    }
  }, []);

  // 请求数据 tag: 标签；name：名称
  const fetchNoteByName = async (tag: NoteTag | string, name: string) => {
    try {
      const res: any = await fileApi(`/${tag}/${name}`);
      return { code: 0, data: res, msg: 'ok' };
    } catch (err) {
      console.error('fetch error: ', err);
    }
    return { code: -2, data: null, msg: 'error' };
  };

  // 获取数据
  const getNoteById = (name: string) => {
    const item = noteList?.find((note) => note.name === name);
    if (item) return item;
    return null;
  };

  // 更新数据
  const updateNoteList = (data: any) => {
    setNoteList(data);
  };

  const getNoteList = () => {
    return noteList;
  };

  return {
    loading,
    noteList,
    getNoteList,
    getNoteById,
    updateNoteList,
    fetchNoteByName,
  };
};

export default createModel(useNoteModel);
