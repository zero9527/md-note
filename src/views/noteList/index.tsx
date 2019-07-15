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

  useEffect(() => {
    import('./data.js').then(({ default: data }) => {
      const templist:IMonthItem[] = data;
      setNoteList(templist);
    })
  }, []);

  function toDetail(id: number|string) {
    props.history.push(`/note-detail/${id}`);
  }
  function newNote() {
    props.history.push('/note-add');
  }

  return (
    <div className={style['note-list']}>
      <h4 className={style.title}>使用markdown语法的记事本</h4>
      {notelist.map((monthitem, monthindex) => {
        return (
          <section className={style['month-item']} key={monthindex}>
            <div className={style['item-month']}>
              {monthitem.month.substring(2, monthitem.month.length)}
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
