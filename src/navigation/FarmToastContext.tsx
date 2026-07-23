import React, {createContext, useCallback, useContext, useMemo, useState} from 'react';

type FarmToastContextValue = {
  farmToast: string | null;
  showFarmToast: (message: string) => void;
  clearFarmToast: () => void;
};

const FarmToastContext = createContext<FarmToastContextValue | null>(null);

export function FarmToastProvider({children}: {children: React.ReactNode}) {
  const [farmToast, setFarmToast] = useState<string | null>(null);

  const showFarmToast = useCallback((message: string) => {
    setFarmToast(message);
  }, []);

  const clearFarmToast = useCallback(() => {
    setFarmToast(null);
  }, []);

  const value = useMemo(
    () => ({farmToast, showFarmToast, clearFarmToast}),
    [clearFarmToast, farmToast, showFarmToast],
  );

  return (
    <FarmToastContext.Provider value={value}>
      {children}
    </FarmToastContext.Provider>
  );
}

export function useFarmToast() {
  const context = useContext(FarmToastContext);
  if (!context) {
    throw new Error('useFarmToast must be used within FarmToastProvider');
  }
  return context;
}
