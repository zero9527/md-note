import { useState, useEffect } from 'react';
import { createModel } from 'hox';
import fileApi, { getNoteListConfig } from '@/api/file';
import { dateFormate } from '@/utils';

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
      getNoteListConfig().then((res) => {
        updateNoteList(res);
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

  // 更新某条数据
  const updateNoteById = (name: string, data: any) => {
    // 新增
    if (!name) name = `${Date.now()}`;

    setNoteList((list: NoteItem[]) => {
      const itemIndex = list.findIndex((note: NoteItem) => note.name === name);
      const date = dateFormate({ timeStamp: Date.now(), splitChar: '/' });

      // if (itemIndex < 0) {
      //   list.push({ id, data, date, desc: getTitleByData(data) });
      // } else {
      //   list[itemIndex] = { id, data, date, desc: getTitleByData(data) };
      // }

      return list;
    });
  };

  // 更新数据
  const updateNoteList = (data: any) => {
    setNoteList(data);
  };

  const getTitleByData = (data: string) => {
    if (!data.includes('\n')) return data;
    return data.substring(0, data.indexOf('\n'));
  };

  const getNoteList = () => {
    return noteList;
  };

  return {
    loading,
    noteList,
    getNoteList,
    getNoteById,
    updateNoteById,
    updateNoteList,
    fetchNoteByName,
  };
};

export default createModel(useNoteModel);
