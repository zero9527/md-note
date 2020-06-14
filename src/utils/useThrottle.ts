import { useCallback } from 'react';

// 节流
const useThrottle = (callback: () => any, delay: number = 16) => {
  let lastTime: number = 0;
  let canCallback = true;

  const restore = (time: number) => {
    lastTime = time;
    canCallback = false;
  };

  const runCallback = () => {
    callback();
  };

  return useCallback((args?: any) => {
    const thisTime = new Date().getTime();
    if (canCallback && thisTime - lastTime > delay) {
      restore(thisTime);
      runCallback.apply(null, args);
      setTimeout(() => {
        canCallback = true;
      }, delay);
      return;
    }
  }, []);
};

export default useThrottle;
