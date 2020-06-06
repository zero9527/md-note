import { useState, useEffect, useRef } from 'react';
// import { useImmer } from 'use-immer';
import { createModel } from 'hox';
import { cacheUtil, CacheUtil } from '@/utils/cacheUtil';
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
  const [version, setVersion] = useState(`${Date.now()}`);
  const [loading, setLoading] = useState(false);
  const cache = useRef<CacheUtil>(
    cacheUtil({ type: 'sessionStorage', cacheKey: 'note-list', version })
  );
  const [noteList, setNoteList] = useState<NoteItem[]>(
    cache.current.getData<NoteItem[]>() || NoteSkeleton
  );

  useEffect(() => {
    checkVersion();

    if (noteList[0]?.name === '') {
      setLoading(true);
      getNoteListConfig().then((res) => {
        updateNoteList(res);
        setLoading(false);
      });
    }
  }, []);

  useEffect(() => {
    // console.log('noteList: ', noteList);
    if (noteList) cache.current.setData<NoteItem[]>(noteList);
  }, [noteList]);

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

  // 检查缓存版本
  const checkVersion = (maxAge: MaxAge = '24h') => {
    // 24小时清缓存
    if (Number(version) + maxAgeConfig[maxAge] <= Date.now()) {
      console.log('清缓存');
      setVersion(`${Date.now()}`);
      updateNoteList([]);
      cache.current.updateVersion(`${Date.now()}`);
    }
    const temp = cache.current.getData<NoteItem[]>();
    if (temp) updateNoteList(temp);
  };

  // 获取数据
  const getNoteById = (name: string) => {
    checkVersion();
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

  // 清缓存
  const clearCache = () => {
    cache.current.clear();
  };

  return {
    loading,
    noteList,
    getNoteList,
    getNoteById,
    updateNoteById,
    updateNoteList,
    fetchNoteByName,
    clearCache,
  };
};

export default createModel(useNoteModel);
