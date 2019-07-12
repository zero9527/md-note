import * as React from 'react';
import { dateFormate } from '@/utils/utils'
import { generateCalendar, getDateFormat, IValidDate } from './func'
import style from './calendar.scss';

const { useEffect, useState } = React;

interface ICalendarParams {
  year: number | string,
  month: number | string
}

/**
 * 日历
 */
function Calendar(params: ICalendarParams) {
  // 对应日期获取的 getDay()星期
  const weekday:string[] = ['日', '一', '二', '三', '四', '五', '六'];
  const [YearMonth, setYearMonth] = useState(params);
  const [monthDay, setMonthDay] = useState([[]]);
  const [activeDate, setActiveDate] = useState(
    dateFormate({ timeStamp: Date.now() }).split(' ')[0]
  );
  
  useEffect(() => {
    // NoticeU();
    setMonthDay(generateCalendar(params))
  }, []);

  // 高亮的一天
  function IsActiveDate({ year, month, date }: IValidDate): boolean {
    const [year1, month1, date1] = activeDate.split('-');
    return +year1 === year && +month1 === month && +date1 === date;
  }

  // 切换月份
  function changeMonth(type: string):void {
    const { year, month } = YearMonth;
    let obj:ICalendarParams = { year, month };
    // 上个月
    if (type === 'prev') {
      if (month > 1) {
        obj = {
          year,
          month: +month - 1
        }
      } else if (month === 1) {
        obj = {
          year: +year - 1,
          month: 12
        }
      }
    }
    // 下个月
    if (type === 'next') {
      if (month < 12) {
        obj = {
          year,
          month: +month + 1
        }
      } else if (month === 12) {
        obj = {
          year: +year + 1,
          month: 1
        }
      }
    }
    setTimeout(() => {
      setYearMonth(obj);
      setMonthDay(generateCalendar(obj));
    }, 0);
  }

  function dateClick({ year, month, date }: IValidDate): void {
    if (!date) return;
    setActiveDate(`${year}-${month}-${date}`)
  }

  // 判断是否今天
  function isToday({ year, month, date}: IValidDate): boolean {
    const time = Date.now();
    const {year: year1, month: month1, date: date1} = getDateFormat(time);

    return year === year1 && month === month1 && date === date1;
  }

  return (
    <section className={style.calendar} data-month={YearMonth.month}>
      <div className={style["year-month"]}>
        <span onClick={() => changeMonth('prev')}>《</span>
        <div>{ YearMonth.year }/{ (YearMonth.month+'').padStart(2, '0') }</div>
        <span onClick={() => changeMonth('next')}>》</span>
      </div>
      <div className={style.weekday}>
        {
          weekday.map((item, index) => {
            return (
              <div 
                key={index} 
                className={index === 0 || index === weekday.length-1 ? style.weekend : ''}
              >{ item }</div>
            )
          })
        }
      </div>
      <div className={style["month-day"]}>
        {
          monthDay.map((week, weekindex) => {
            return (
              <section className={style["week-item"]} key={weekindex}>
                {
                  week.map((date: any, dateindex: any) => {
                    return (
                      <div 
                        key={dateindex} 
                        className={
                          `${style["date-item"]} ${isToday(date) ? style['is-today'] : ''} ${IsActiveDate(date) ? style["active-date"] : ''}`
                        }
                        onTouchStart={() => dateClick(date)}
                      >
                        <div>{ isToday(date) ? '今天' : date.date }</div>
                      </div>
                    )
                  })
                }
              </section>
            )
          })
        }
      </div>
    </section>
  )
}

export default Calendar;
