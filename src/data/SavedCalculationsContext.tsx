import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
} from 'react';

import {usePersistedState} from '../hooks/usePersistedState';
import type {CalculatorId, ResultRow} from './calculators';
import {CALCULATOR_CARDS} from './calculators';
import {storageClaves} from './storage';

export type SavedCalculation = {
  id: string;
  calculatorId: CalculatorId;
  title: string;
  summary: string;
  rows: ResultRow[];
  savedAtEtiqueta: string;
};

type SavedCalculationsContextValue = {
  saved: SavedCalculation[];
  saveCalculo: (input: {
    calculatorId: CalculatorId;
    title: string;
    rows: ResultRow[];
  }) => void;
  clearSaved: () => void;
};

const SavedCalculationsContext =
  createContext<SavedCalculationsContextValue | null>(null);

function formatSavedAt(date: Date): string {
  const hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const h12 = hours % 12 || 12;
  return `Today · ${h12}:${minutes} ${ampm}`;
}

function pickResumen(rows: ResultRow[]): string {
  const highlight = rows.find(row => row.tone === 'gold') ?? rows[0];
  if (!highlight) {
    return 'Calculation saved';
  }
  return `${highlight.label}: ${highlight.value}`;
}

export function calculatorMeta(id: CalculatorId) {
  return CALCULATOR_CARDS.find(card => card.id === id) ?? CALCULATOR_CARDS[0];
}

export function SavedCalculationsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [saved, setSaved] = usePersistedState<SavedCalculation[]>(
    storageClaves.savedCalculos,
    [],
  );

  const saveCalculo = useCallback(
    (input: {
      calculatorId: CalculatorId;
      title: string;
      rows: ResultRow[];
    }) => {
      const entry: SavedCalculation = {
        id: `calc-${Date.now()}`,
        calculatorId: input.calculatorId,
        title: input.title,
        summary: pickResumen(input.rows),
        rows: input.rows,
        savedAtEtiqueta: formatSavedAt(new Date()),
      };
      setSaved(prev => [entry, ...prev].slice(0, 20));
    },
    [setSaved],
  );

  const clearSaved = useCallback(() => {
    setSaved([]);
  }, [setSaved]);

  const value = useMemo(
    () => ({
      saved,
      saveCalculo,
      clearSaved,
    }),
    [saved, saveCalculo, clearSaved],
  );

  return (
    <SavedCalculationsContext.Provider value={value}>
      {children}
    </SavedCalculationsContext.Provider>
  );
}

export function useSavedCalculos() {
  const context = useContext(SavedCalculationsContext);
  if (!context) {
    throw new Error(
      'useSavedCalculos must be used within SavedCalculationsProvider',
    );
  }
  return context;
}
