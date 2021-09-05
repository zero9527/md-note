import React, { useEffect } from 'react';
import Router from './router';
import Header from '@/components/Header';
import useGlobalModel from '@/model/useGlobalModel';
import { mobileReg } from '@/utils/regx';
import { setThemeCssVars } from './theme/themeUtils';

const App: React.FC = () => {
  const { theme, setIsMobile } = useGlobalModel((modal) => [modal.theme, modal.setIsMobile]);

  useEffect(() => {
    const isMobile = mobileReg.test(window.navigator.userAgent);
    setIsMobile(isMobile);
  }, []);

  useEffect(() => {
    setThemeCssVars(theme);
  }, [theme]);

  return (
    <>
      <Header />
      <Router />
    </>
  );
};

export default App;
