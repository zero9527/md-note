import { useRef, useEffect, useState } from 'react';

/**
 * 获取上一个值
 * @param state 
 * @example 
 * const [scrollTop, setScrollTop] = useState(0);
  const prevScrollTop = usePrevState(scrollTop);
 */
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
