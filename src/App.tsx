import React, { useEffect } from 'react';
import { useLocation } from 'react-router';
import { mobileReg } from '@/utils/regx';
import useGlobalModel from '@/model/useGlobalModel';
import NoteList from '@/views/noteList';
import PageTitle from './components/pageTitle';

interface AppProps {
  children: string | React.ReactNode;
}

const App: React.FC<AppProps> = ({ children }) => {
  const { setIsMobile } = useGlobalModel();
  const { pathname } = useLocation();

  useEffect(() => {
    const isMobile = mobileReg.test(window.navigator.userAgent);
    setIsMobile(isMobile);
  }, []);

  return (
    <PageTitle pathname={pathname}>
      {children}
      <NoteList show={pathname === '/'} />
    </PageTitle>
  );
};

export default App;
