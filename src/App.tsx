import React, { useEffect } from 'react';
import singleSpaSetup from './single-spa-config';
import KeepAlive from 'keep-alive-comp';
import useGlobalModel from '@/model/useGlobalModel';
import { mobileReg } from '@/utils/regx';
import NoteList from '@/views/noteList';

singleSpaSetup();

const App: React.FC = () => {
  const { setIsMobile, setRightPanelVisible } = useGlobalModel((modal) => [
    modal.setIsMobile,
    modal.setRightPanelVisible,
  ]);

  useEffect(() => {
    const isMobile = mobileReg.test(window.navigator.userAgent);
    setIsMobile(isMobile);
    setRightPanelVisible(true);

    return () => {
      setRightPanelVisible(false);
    };
  }, []);

  return (
    <KeepAlive name="list">{(props) => <NoteList {...props} />}</KeepAlive>
  );
};

export default App;
