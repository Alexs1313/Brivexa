import {useEffect, useRef, useState} from 'react';
import type {Dispatch, SetStateAction} from 'react';

import {loadJson, saveJson, type StorageKey} from '../data/storage';

/**
 * State that hydrates from AsyncStorage once, then persists every change.
 * `null` is a valid stored value (used for demo-mode sentinels).
 */
export function usePersistedState<T>(
  key: StorageKey,
  initialValue: T,
): [T, Dispatch<SetStateAction<T>>, boolean] {
  const [state, setState] = useState<T>(initialValue);
  const [hydrated, setHydrated] = useState(false);
  const skipNextSave = useRef(true);

  useEffect(() => {
    let cancelled = false;

    loadJson<T>(key).then(stored => {
      if (cancelled) {
        return;
      }
      if (stored !== undefined) {
        setState(stored);
      }
      skipNextSave.current = true;
      setHydrated(true);
    });

    return () => {
      cancelled = true;
    };
  }, [key]);

  useEffect(() => {
    if (!hydrated) {
      return;
    }
    if (skipNextSave.current) {
      skipNextSave.current = false;
      return;
    }
    void saveJson(key, state);
  }, [hydrated, key, state]);

  return [state, setState, hydrated];
}
