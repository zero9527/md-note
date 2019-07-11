interface IDate {
  year: number | string,
  month: number | string,
}

// 生成日历数组
export function generateCalendar(
  { year, month }: IDate = { 
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1
  }
): any[] {
  const weekArr:string[] = new Array(7).fill(''); // 一周七天的数组
  const weekday:number = new Date(`${year}-${month}-01`).getDay(); // 1号星期几
  const monthArr:any[] = [[], [], [], [], [], []];

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
    monthArr[1].push({ year, month, date: 7 - weekday + index + 1 });
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
  
  return monthArr.filter(item => item[0]);
}

export interface IValidDate {
  year: number | string,
  month: number | string,
  date: number | string
}

// 验证日期是否有效，对应月份有这一天
function validDate({year, month, date}: IValidDate): boolean {
  const timestamp = new Date(`${year}/${month}/${date}`).getTime();
  const {year: year1, month: month1, date: date1} = getDateFormat(timestamp);

  return year === year1 && month === month1 && date === date1;
}

// 根据时间按戳获取年月日
export function getDateFormat(timestamp: number): IValidDate {
  const time = new Date(timestamp);
  const year = time.getFullYear();
  const month = time.getMonth() + 1;
  const date = time.getDate();

  return { year, month,  date };
}
