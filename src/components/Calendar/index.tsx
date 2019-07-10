import * as React from 'react';
import './calendar.css';

const { useEffect, useState } = React;

interface CalendarParams {
  year: number | string,
  month: number | string
}

function Calendar(params: CalendarParams) {
  const weekday:string[] = ['日', '一', '二', '三', '四', '五', '六'];
  const [monthDay, setMonthDay] = useState([[]]);
  
  useEffect(() => {
    setMonthDay(generateCalendar(params))
  }, []);

  return (
    <section className="calendar">
      <div className="weekday">
        {
          weekday.map((item, index) => {
            return <div key={index}>{ item }</div>
          })
        }
      </div>
      <div className="month-day">
        {
          monthDay.map((week, weekindex) => {
            return (
              <section className="week-item" key={weekindex}>
                {
                  week.map((date: any, dateindex: any) => {
                    return (
                      <div key={dateindex} className="date-item">
                        <div>{ date.date }</div>
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

// 生成日历数组
function generateCalendar(
  { year, month }: CalendarParams = { 
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1
   }
) {
  const weekArr = new Array(7).fill(''); // 一周七天的数组
  const monthArr:any[] = [[], [], [], [], [], []];
  const weekday = new Date(`${year}-${month}-01`).getDay(); // 1号星期几

  // 生成一月对应星期的二维数组，第一维是周数，第二维是一周的天数
  weekArr.map((week, index) => {
    monthArr[0].push({ 
      year, 
      month, 
      date: index < weekday 
        ? ''
        : index === weekday
          ? 1
          : monthArr[0][index-1].date+1
    });
    monthArr[1].push({ year, month, date: 7 - weekday + index });
    monthArr[2].push({ year, month, date: monthArr[1][index].date + 7 });
    monthArr[3].push({ year, month, date: monthArr[2][index].date + 7 });
    if (
      validDate({ year, month, date: monthArr[3][index].date + 7 })
    ) {
      monthArr[4].push({ year, month, date: monthArr[3][index].date + 7 });
    } else {
      monthArr[4].push('');
    }
    
    if (
      validDate({ year, month, date: monthArr[4][index].date + 7 })
    ) {
      monthArr[5].push({ year, month, date: monthArr[4][index].date + 7 });
    } else {
      monthArr[5].push('');
    }
  })
  return monthArr;
}

interface ValidDateInterface {
  year: number | string,
  month: number | string,
  date: number | string
}
// 验证日期是否有效，对应月份有这一天
function validDate({year, month, date}: ValidDateInterface) {
  const timestamp = new Date(`${year}/${month}/${date}`).getTime();
  const {year: year1, month: month1, date: date1} = getDateFormat(timestamp);

  return year === year1 && month === month1 && date === date1;
}
function getDateFormat(time: number) {
  const timetemp = new Date(time);
  const year = timetemp.getFullYear();
  const month = timetemp.getMonth() + 1;
  const date = timetemp.getDate();
  return {
    year,
    month, 
    date
  }
}

export default Calendar;
