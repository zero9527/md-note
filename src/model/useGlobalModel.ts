import { useState, useEffect, CSSProperties } from 'react';
import { createModel } from 'hox';

const useGlobalModel = () => {
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [height, setHeight] = useState(0);
  const [theme, updateTheme] = useState('blue');
  const [stickyRightStyle, setStickyRightStyle] = useState<CSSProperties>();
  const [rightPanelVisible, setRightPanelVisible] = useState(false);

  useEffect(() => {
    setHeight(window.innerHeight);
    const _theme = localStorage.getItem('theme');
    if (_theme) setTheme(_theme);
  }, []);

  const setTheme = (_theme: string) => {
    updateTheme(_theme);
    localStorage.setItem('theme', _theme);
    document.documentElement.setAttribute('data-theme', _theme);
  };

  return {
    theme,
    setTheme,
    isMobile,
    setIsMobile,
    height,
    stickyRightStyle,
    setStickyRightStyle,
    rightPanelVisible,
    setRightPanelVisible,
  };
};

export default createModel(useGlobalModel);
