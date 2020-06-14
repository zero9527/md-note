import React, { useEffect } from 'react';
import KeepAlive from 'keep-alive-comp';
import useGlobalModel from '@/model/useGlobalModel';
import { mobileReg } from '@/utils/regx';
import NoteList from '@/views/NoteList';

const App: React.FC = () => {
  const { setIsMobile } = useGlobalModel((modal) => [modal.setIsMobile]);

  useEffect(() => {
    const isMobile = mobileReg.test(window.navigator.userAgent);
    setIsMobile(isMobile);
  }, []);

  return (
    <KeepAlive name="list">{(props) => <NoteList {...props} />}</KeepAlive>
  );
};

export default App;
