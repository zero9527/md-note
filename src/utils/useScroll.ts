import { useEffect, useState } from 'react';
import usePrevState from './usePrevState';

// 监听window滚动
const useScroll = () => {
  const [scrollTop, setScrollTop] = useState(0);
  const prevScrollTop = usePrevState(scrollTop);

  useEffect(() => {
    window.addEventListener('scroll', onScroll, false);
    return () => {
      window.removeEventListener('scroll', onScroll, false);
    };
  }, []);

  const onScroll = (e: any) => {
    // 移动端 body.scrollTop, PC端 documentElement.scrollTop
    const scTop = e.target.body.scrollTop || e.target.documentElement.scrollTop;
    setScrollTop(scTop || 0);
  };

  return {
    prevScrollTop,
    scrollTop,
  };
};

export default useScroll;
