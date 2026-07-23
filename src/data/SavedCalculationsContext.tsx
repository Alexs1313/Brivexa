import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
} from 'react';

import {usePersistedState} from '../hooks/usePersistedState';
import type {CalculatorId, ResultRow} from './calculators';
import {CALCULATOR_CARDS} from './calculators';
import {storageKeys} from './storage';

export type SavedCalculation = {
  id: string;
  calculatorId: CalculatorId;
  title: string;
  summary: string;
  rows: ResultRow[];
  savedAtLabel: string;
};

type SavedCalculationsContextValue = {
  saved: SavedCalculation[];
  saveCalculation: (input: {
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

function pickSummary(rows: ResultRow[]): string {
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
    storageKeys.savedCalculations,
    [],
  );

  const saveCalculation = useCallback(
    (input: {
      calculatorId: CalculatorId;
      title: string;
      rows: ResultRow[];
    }) => {
      const entry: SavedCalculation = {
        id: `calc-${Date.now()}`,
        calculatorId: input.calculatorId,
        title: input.title,
        summary: pickSummary(input.rows),
        rows: input.rows,
        savedAtLabel: formatSavedAt(new Date()),
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
      saveCalculation,
      clearSaved,
    }),
    [saved, saveCalculation, clearSaved],
  );

  return (
    <SavedCalculationsContext.Provider value={value}>
      {children}
    </SavedCalculationsContext.Provider>
  );
}

export function useSavedCalculations() {
  const context = useContext(SavedCalculationsContext);
  if (!context) {
    throw new Error(
      'useSavedCalculations must be used within SavedCalculationsProvider',
    );
  }
  return context;
}
