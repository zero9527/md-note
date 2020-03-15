import { useState, useEffect } from 'react';
import { createModel } from 'hox';
import { getUrlParams } from '@/utils';

const useGlobalModel = () => {
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [height, setHeight] = useState(0);
  const [theme, updateTheme] = useState('light');

  useEffect(() => {
    setHeight(window.innerHeight);
  }, []);

  useEffect(() => {
    const _theme = localStorage.getItem('theme');
    if (_theme && _theme !== theme) setTheme(_theme);
    else setTheme(theme);
  }, [theme]);

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
    height
  };
};

export default createModel(useGlobalModel);
