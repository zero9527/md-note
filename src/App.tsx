import React, { useEffect, Suspense, lazy } from 'react';
import { useLocation, Route } from 'react-router';
import { mobileReg } from '@/utils/regx';
import KeepAlive from 'keep-alive-comp';
import { Link } from 'react-router-dom';
import Loading from './components/loading';
import useGlobalModel from '@/model/useGlobalModel';
import PageTitle from './components/pageTitle';

const NoteList = lazy(() => import('@/views/noteList'));

const App: React.FC = () => {
  const { pathname } = useLocation();
  const { setIsMobile } = useGlobalModel((modal) => [modal.setIsMobile]);

  useEffect(() => {
    const isMobile = mobileReg.test(window.navigator.userAgent);
    setIsMobile(isMobile);
  }, []);

  return (
    <PageTitle pathname={pathname}>
      <Suspense fallback={<Loading />}>
        <KeepAlive name="list">{(props) => <NoteList {...props} />}</KeepAlive>
      </Suspense>
    </PageTitle>
  );
};

export default App;
