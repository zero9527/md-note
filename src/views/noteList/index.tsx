import * as React from 'react';
import { withRouter } from 'react-router';
import style from './noteList.scss';
import { BrowserRouterProps } from 'react-router-dom';

const { useState, useEffect } = React;

interface Props extends BrowserRouterProps {
  [prop: string]: any
}
export interface IMonthItem {
  month: string, 
  list: INoteItem[]
}
export interface INoteItem {
  id: string|number, 
  date: string, 
  desc: string
}
// 笔记列表
function NoteList(props: Props) {
  const NoteType:IMonthItem[] = [{
    month:'', 
    list: [{ id: '', date: '', desc: '' }]}
  ];
  const [notelist, setNoteList] = useState(NoteType);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      // 骨架屏
      const skeletonlist:IMonthItem[] = [
        {
          month: '2019-01',
          list: [
            { id: 1, date: '2019-01-01', desc: 'lkklk89786876546' },
            { id: 2, date: '2019-01-01', desc: 'lkklk89786876546lkklk89786876546lkklk89786876546' },
            { id: 3, date: '2019-01-01', desc: 'lkklk89786876546' },
            { id: 4, date: '2019-01-01', desc: 'lkklk89786876546' },
            { id: 6, date: '2019-01-01', desc: 'lkklk89786876546' },
            { id: 7, date: '2019-01-01', desc: 'lkklk89786876546' },
            { id: 8, date: '2019-01-01', desc: 'lkklk89786876546' }
          ]
        }
      ];
      setNoteList(skeletonlist);
      import('./data.js').then(({ default: data }) => {
        const templist:IMonthItem[] = data;
        setNoteList(templist);
        setLoading(false);
      })
    }, 0);
  }, []);

  function toDetail(id: number|string) {
    props.history.push(`/note-detail/${id}`);
  }
  function newNote() {
    props.history.push('/note-add');
  }

  return (
    <div className={style['note-list']}>
      <h4 className={`border-1px-bottom title`}>使用markdown语法的记事本</h4>
      {notelist.map((monthitem, monthindex) => {
        return (
          <section id={loading ? style.skeleton : ''} className={style['month-item']} key={monthindex}>
            <div className={style['item-month']}>
              <span>{monthitem.month.substring(2, monthitem.month.length)}</span>
            </div>
            {monthitem.list.map((noteitem, noteindex) => {
              return (
                <div
                  className={style['note-item']}
                  key={noteindex}
                  onClick={() => toDetail(noteitem.id)}
                >
                  <div className={style['item-date']}>
                    {noteitem.date.substring(5, noteitem.date.length)}
                  </div>
                  <div className={style['item-desc']}>{noteitem.desc}</div>
                </div>
              );
            })}
          </section>
        );
      })}
      <button className={`btn ${style.add}`} onClick={newNote}>+</button>
    </div>
  );
}

export default withRouter(NoteList);
