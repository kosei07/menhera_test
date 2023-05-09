import { useLayoutEffect, useState } from 'react';

interface SIZE_TYPE {
  width: number;
  height: number;
}

export const useWindowSize = (): SIZE_TYPE => {
  const [size, setSize] = useState<SIZE_TYPE>({
    width: 0,
    height: 0,
  });
  useLayoutEffect(() => {
    const updateSize = (): void => {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener('resize', updateSize);
    updateSize();

    return () => {
      window.removeEventListener('resize', updateSize);
    };
  }, []);
  return size;
};
