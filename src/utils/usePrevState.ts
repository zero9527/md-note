import { useRef, useEffect, useState } from 'react';

function usePrevState<T>(state: T) {
  const countRef = useRef<any>(null);
  const [_state, setState] = useState<T>(state);

  useEffect(() => {
    countRef.current = _state;
    setState(state);
  }, [state]);

  // prevState
  return countRef.current;
}

export default usePrevState;
