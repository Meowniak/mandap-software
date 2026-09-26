import { useState, useEffect } from 'react';
import { db } from '../services/db';
import { AppDatabase } from '../types';

export function useStudioDb(): AppDatabase & {
  refresh: () => void;
} {
  const [snapshot, setSnapshot] = useState<AppDatabase>(() => db.getSnapshot());

  useEffect(() => {
    const unsubscribe = db.subscribe(() => {
      setSnapshot(db.getSnapshot());
    });
    return unsubscribe;
  }, []);

  return {
    ...snapshot,
    refresh: () => setSnapshot(db.getSnapshot()),
  };
}
