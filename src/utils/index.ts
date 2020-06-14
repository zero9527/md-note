import { mobileReg } from './regx';

export function throttle(fn: any, delay: number = 16) {
  let lastTime = Date.now();
  return function() {
    if (Date.now() - lastTime >= delay) {
      fn.call(this, arguments);
      lastTime = Date.now();
    }
  };
}

/**
 * 顶部loading线
 */
export function loading() {
  let wrapper = document.createElement('section');
  wrapper.setAttribute('id', 'loading-wrapper');
  wrapper.setAttribute(
    'style',
    `width: 100%;height: 2px;position: absolute;top: 0;transform: translateX(-100%);background: #2196F3;transition: .1s ease;z-index: 99;`
  );

  let endFlag = false; // 结束标志
  const loadingStart = () => {
    let percent = 0; // 百分比
    const loadingEl = document.querySelector('#loading-wrapper');
    wrapper.style.transform = `translateX(-100%)`; // 初始位置

    if (loadingEl) wrapper.style.display = 'block';
    else document.body.append(wrapper);

    const inloading = window.requestAnimationFrame(function raf() {
      percent += 2;
      wrapper.style.transform = `translateX(-${100 - percent}%)`;

      // 还不能结束
      if (!endFlag && percent < 90) {
        if (percent < 90) {
          window.requestAnimationFrame(raf);
        }
      } else {
        // 可以结束了
        if (percent < 100) {
          window.requestAnimationFrame(raf);
        } else {
          percent = 0;
          window.cancelAnimationFrame(inloading);

          setTimeout(() => {
            wrapper.style.display = 'none';
            // console.log('loading end');
          }, 100);
        }
      }
    });
  };
  const loadingEnd = () => {
    endFlag = true;
  };

  return {
    loadingStart,
    loadingEnd,
  };
}

export interface DateFormateParams {
  timeStamp: number;
  splitChar?: string; // 日期分隔符
}
// 时间格式化
export function dateFormate({ timeStamp, splitChar = '-' }: DateFormateParams) {
  const time: Date = new Date(timeStamp);

  const Y = time.getFullYear();
  const M = (time.getMonth() + 1 + '').padStart(2, '0');
  const D = (time.getDate() + '').padStart(2, '0');
  const h = (time.getHours() + '').padStart(2, '0');
  const m = (time.getMinutes() + '').padStart(2, '0');
  const s = (time.getSeconds() + '').padStart(2, '0');

  return `${Y}${splitChar}${M}${splitChar}${D} ${h}:${m}:${s}`;
}

// H5窗口通知，以下代码只有PC正常
export function NoticeU(): void {
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

  function noticeFn(): void {
    const notice = new Notification('提示', {
      body: '你要的额都在这里！',
      icon: 'img/store-bg.png',
    });
    notice.onclick = () => {
      console.log('点击了通知！');
    };
  }

  function requestPermission(): void {
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        noticeFn();
      } else if (permission === 'denied') {
        console.warn('拒绝通知！');
        requestPermission();
      }
    });
  }
}

export const isMobile = mobileReg.test(navigator.userAgent);

export function getUrlParams(search = '', key = '') {
  let _search = search;
  if (!_search && !key) return {};
  if (!_search || search.indexOf('?') === -1) return '';
  _search = _search.slice(search.indexOf('?') + 1, search.length);

  const paramsArr = _search.split('&');
  const paramsObj = {};
  paramsArr.forEach((param) => {
    const [_key, _value] = param.split('=');
    paramsObj[_key] = _value;
  });

  if (key) {
    if (paramsObj.hasOwnProperty(key)) {
      return paramsObj[key];
    } else {
      console.warn(`url 没有 ${key} 这个参数！`);
    }
  }
  return paramsObj;
}
