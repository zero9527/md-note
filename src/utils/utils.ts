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

// H5窗口通知
export function NoticeU():void {
  if ('Notification' in window) {
    if (Notification.permission === 'granted') {
      noticeFn();
    } else if (Notification.permission === 'default') {
      requestPermission();
    } else if (Notification.permission === 'denied') {
      console.warn('拒绝通知！');
      requestPermission();
    }

  } else {
    console.log('浏览器不支持Notification!');
  }

  function noticeFn():void {
    const notice = new Notification('提示', {
      body: '你要的额都在这里！',
      icon: 'img/store-bg.png'
    });
    notice.onclick = () => {
      console.log('点击了通知！')
    }
  }
  
  function requestPermission():void {
    Notification.requestPermission()
    .then((permission) => {
      if (permission === 'granted') {
        noticeFn();
      } else if (permission === 'denied') {
        console.warn('拒绝通知！');
        requestPermission();
      }
    })
  }
}
