
interface DateFormateParams {
  timeStamp: number,
  splitChar?: string // 日期分隔符
}
// 时间格式化
export function dateFormate({ timeStamp, splitChar='-' }: DateFormateParams) {
  const time: Date = new Date(timeStamp);

  const Y = time.getFullYear();
  const M = (time.getMonth() + 1 + '').padStart(2, '0');
  const D = (time.getDate() + '').padStart(2, '0');
  const h = (time.getHours() + '').padStart(2, '0');
  const m = (time.getMinutes() + '').padStart(2, '0');
  const s = (time.getSeconds() + '').padStart(2, '0');

  return `${Y}${splitChar}${M}${splitChar}${D} ${h}:${m}:${s}`;
}


interface Params {
  name: string,
  age: number | string
}
export function combine({name, age}: Params = {name: '小明', age: 13}) {
  return `${name}今年${age}岁了`
}
