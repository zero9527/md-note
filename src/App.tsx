import React, { useEffect, Suspense, useState } from 'react';
import { useRouteMatch } from 'react-router';
import { lazy } from '@loadable/component';
import KeepAlive from 'keep-alive-comp';
import useGlobalModel from '@/model/useGlobalModel';
import { mobileReg } from '@/utils/regx';
import Loading from '@/components/loading';
import singleSpaSetup from './single-spa-config';

singleSpaSetup();

const NoteList = lazy(() => import('@/views/noteList'));
const RightPanel = lazy(() => import('@/views/noteList/rightPanel'));

const App: React.FC = () => {
  const homePage = useRouteMatch('/');
  const { setIsMobile } = useGlobalModel((modal) => [modal.setIsMobile]);
  const [contentVisible, setContentVisible] = useState(false);

  useEffect(() => {
    const isMobile = mobileReg.test(window.navigator.userAgent);
    setIsMobile(isMobile);
  }, []);

  useEffect(() => {
    setContentVisible(homePage?.isExact || false);
  }, [homePage]);

  return (
    <>
      {contentVisible && (
        <Suspense fallback={<Loading />}>
          <KeepAlive name="list">
            {(props) => <NoteList {...props} />}
          </KeepAlive>
        </Suspense>
      )}
      <RightPanel visible={contentVisible} />
    </>
  );
};

export default App;
