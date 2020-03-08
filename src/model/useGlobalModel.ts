import { useState, useEffect } from 'react';
import { createModel } from 'hox';

const useGlobalModel = () => {
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    setHeight(window.innerHeight);
  }, []);

  return {
    isMobile,
    setIsMobile,
    height
  };
};

export default createModel(useGlobalModel);
