import { useState, useEffect, CSSProperties, useRef } from 'react';
import { createModel } from 'hox';
import { ThemeType } from '@/theme/themeType';
import useScroll from '@/utils/useScroll';

const useGlobalModel = () => {
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [height, setHeight] = useState(0);
  const [theme, updateTheme] = useState<ThemeType>('blue');
  const [stickyRightStyle, setStickyRightStyle] = useState<CSSProperties>();
  const metaThemeColor = useRef<HTMLElement | null>(null);
  const { prevScrollTop, scrollTop } = useScroll();

  useEffect(() => {
    setHeight(window.innerHeight);
    const themeCache = localStorage.getItem('theme') as ThemeType;
    metaThemeColor.current = document.querySelector('meta[name="theme-color"]');
    setTheme(themeCache || 'blue');
  }, []);

  const setTheme = (themeType: ThemeType) => {
    updateTheme(themeType);
    localStorage.setItem('theme', themeType);
    document.documentElement.setAttribute('data-theme', themeType);
    setStatusBar(themeType);
  };

  // 设置状态栏、地址栏等颜色
  const setStatusBar = (themeType: string) => {
  };

  return {
    theme,
    setTheme,
    isMobile,
    setIsMobile,
    height,
    stickyRightStyle,
    setStickyRightStyle,
    prevScrollTop, 
    scrollTop,
  };
};

export default createModel(useGlobalModel);
