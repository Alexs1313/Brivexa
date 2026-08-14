import {useEffect, useRef, useState} from 'react';
import type {Dispatch, SetStateAction} from 'react';

import {loadJson, saveJson, type StorageKey} from '../data/storage';

/**
 * State that hydrates from AsyncStorage once, then persists every change.
 * `null` is a valid stored value (used for demo-mode sentinels).
 */
export function usePersistedState<T>(
  key: StorageKey,
  initialValor: T,
): [T, Dispatch<SetStateAction<T>>, boolean] {
  const [state, setState] = useState<T>(initialValor);
  const [hydrated, setHydrated] = useState(false);
  const skipNextGuardar = useRef(true);

  useEffect(() => {
    let cancelled = false;

    loadJson<T>(key).then(stored => {
      if (cancelled) {
        return;
      }
      if (stored !== undefined) {
        setState(stored);
      }
      skipNextGuardar.current = true;
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
    if (skipNextGuardar.current) {
      skipNextGuardar.current = false;
      return;
    }
    void saveJson(key, state);
  }, [hydrated, key, state]);

  return [state, setState, hydrated];
}
