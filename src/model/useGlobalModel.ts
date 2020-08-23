import { useState, useEffect, CSSProperties } from 'react';
import { createModel } from 'hox';

const useGlobalModel = () => {
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [height, setHeight] = useState(0);
  const [theme, updateTheme] = useState('blue');
  const [stickyRightStyle, setStickyRightStyle] = useState<CSSProperties>();

  useEffect(() => {
    setHeight(window.innerHeight);
    const _theme = localStorage.getItem('theme');
    setTheme(_theme || 'blue');
  }, []);

  const setTheme = (_theme: string) => {
    updateTheme(_theme);
    localStorage.setItem('theme', _theme);
    document.documentElement.setAttribute('data-theme', _theme);
    setStatusBar(_theme);
  };

  // 设置状态栏、地址栏等颜色
  const setStatusBar = (_theme: string) => {
    const config = {
      blue: 'rgba(80, 152, 228, 0.8)',
      red: 'rgba(228, 82, 80, 0.8)',
      orange: 'rgba(228, 149, 80, 0.8)',
      green: 'rgba(0, 150, 136, 0.8)',
      purple: 'rgba(198, 37, 239, 0.8)',
      dark: '#232426',
    };
    const themeColor = document.querySelector('meta[name="theme-color"]');
    themeColor?.setAttribute('content', config[_theme]);
  };

  return {
    theme,
    setTheme,
    isMobile,
    setIsMobile,
    height,
    stickyRightStyle,
    setStickyRightStyle,
  };
};

export default createModel(useGlobalModel);
