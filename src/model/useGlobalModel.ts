import { useState, useEffect, CSSProperties } from 'react';
import { createModel } from 'hox';
import { ThemeType } from '@/theme/themeType';
import useScroll from '@/utils/useScroll';

const useGlobalModel = () => {
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [height, setHeight] = useState(0);
  const [theme, updateTheme] = useState<ThemeType>('blue');
  const [stickyRightStyle, setStickyRightStyle] = useState<CSSProperties>();
  const { prevScrollTop, scrollTop } = useScroll();

  useEffect(() => {
    setHeight(window.innerHeight);
    const themeCache = localStorage.getItem('theme') as ThemeType;
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
    const config = {
      blue: 'rgba(80, 152, 228, 0.8)',
      red: 'rgba(228, 82, 80, 0.8)',
      orange: 'rgba(228, 149, 80, 0.8)',
      green: 'rgba(0, 150, 136, 0.8)',
      purple: 'rgba(198, 37, 239, 0.8)',
      dark: '#232426',
    };
    const themeColor = document.querySelector('meta[name="theme-color"]');
    themeColor?.setAttribute('content', config[themeType]);
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
