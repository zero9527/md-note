import React, { useState, useEffect, useRef } from 'react';

// 防抖
export function useDebounce(fn: any, delay: number = 30) {
  const [func, updateFunc] = useState(fn);

  useEffect(() => {
    const timer = setTimeout(() => {
      updateFunc(func);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [fn]);

  return func;
}

// // 节流
// export function useThrottle<T>(fn: any, delay: number = 30) {
//   const lastTime = useRef(Date.now()).current;
//   const [func, updateFunc] = useState<T>();

//   useEffect(() => {
//     console.log('lastTime: ', lastTime);
//   });

//   useEffect(() => {
//     console.log('useThrottle');
//     console.log('func: ', func);
//     if (lastTime === Date.now()) updateFunc(fn);
//     if (lastTime + delay >= Date.now()) updateFunc(fn);
//   }, [fn]);

//   return func;
// }
