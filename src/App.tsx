import React, { useEffect } from 'react';
import Router from './router';
import Header from '@/components/Header';
import useGlobalModel from '@/model/useGlobalModel';
import { mobileReg } from '@/utils/regx';

const App: React.FC = () => {
  const { setIsMobile } = useGlobalModel((modal) => [ modal.setIsMobile]);

  useEffect(() => {
    const isMobile = mobileReg.test(window.navigator.userAgent);
    setIsMobile(isMobile);
  }, []);

  return (
    <>
      <Header />
      <Router />
    </>
  );
};

export default App;
