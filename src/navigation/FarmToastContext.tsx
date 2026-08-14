import React, {createContext, useCallback, useContext, useMemo, useState} from 'react';

type FarmToastContextValue = {
  farmAviso: string | null;
  showFarmAviso: (message: string) => void;
  clearFarmAviso: () => void;
};

const FarmToastContext = createContext<FarmToastContextValue | null>(null);

export function FarmToastProvider({children}: {children: React.ReactNode}) {
  const [farmAviso, setFarmAviso] = useState<string | null>(null);

  const showFarmAviso = useCallback((message: string) => {
    setFarmAviso(message);
  }, []);

  const clearFarmAviso = useCallback(() => {
    setFarmAviso(null);
  }, []);

  const value = useMemo(
    () => ({farmAviso, showFarmAviso, clearFarmAviso}),
    [clearFarmAviso, farmAviso, showFarmAviso],
  );

  return (
    <FarmToastContext.Provider value={value}>
      {children}
    </FarmToastContext.Provider>
  );
}

export function useFarmAviso() {
  const context = useContext(FarmToastContext);
  if (!context) {
    throw new Error('useFarmAviso must be used within FarmToastProvider');
  }
  return context;
}
