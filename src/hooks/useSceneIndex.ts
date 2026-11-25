import { useEffect, useState } from 'react';
import { progress } from '@/store/progress';

/** Re-renders only when the rounded scene index changes. */
export function useSceneIndex(): number {
  const [index, setIndex] = useState(progress.sceneIndex);
  useEffect(() => {
    const unsubscribe = progress.subscribe((i) => setIndex(i));
    return () => {
      unsubscribe();
    };
  }, []);
  return index;
}
