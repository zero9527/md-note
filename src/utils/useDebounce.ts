import { useCallback } from 'react';

// 防抖
const useDebounce = (callback: (...param: any) => void, delay: number = 16) => {
  let timer: NodeJS.Timeout;
  let lastTime: number = 0;

  const runCallback = (...args: any) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      callback.apply(null, args);
    }, delay);
  };

  return useCallback(function(...param) {
    const thisTime = new Date().getTime();
    if (thisTime - lastTime > delay && lastTime !== 0) {
      lastTime = 0;
    } else {
      lastTime = thisTime;
    }
    runCallback(...param);
  }, []);
};

export default useDebounce;
