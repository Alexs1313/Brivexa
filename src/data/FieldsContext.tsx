import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
} from 'react';

import {usePersistedState} from '../hooks/usePersistedState';
import {
  FIELDS,
  type FarmField,
  type FieldActivity,
  type FieldExpense,
  type FieldHarvest,
  type FieldStatus,
} from './fields';
import {storageKeys} from './storage';

export type FieldDraft = {
  name: string;
  area: string;
  crop: string;
  variety: string;
  status: string;
  plantingDate: string;
};

type FieldsContextValue = {
  fields: FarmField[];
  isDemo: boolean;
  addField: (draft: FieldDraft) => FarmField;
  updateField: (id: string, draft: FieldDraft) => void;
  getField: (id: string) => FarmField | undefined;
  removeField: (id: string) => void;
  cycleFieldStatus: (id: string) => FieldStatus;
  addFieldActivity: (id: string) => void;
  addFieldExpense: (id: string) => void;
  recordHarvest: (id: string) => void;
  clearHarvest: (id: string) => void;
};

const FieldsContext = createContext<FieldsContextValue | null>(null);

const FIELD_STATUS_ORDER: FieldStatus[] = [
  'Planned',
  'Prepared',
  'Planted',
  'Growing',
  'Ready to Harvest',
  'Harvested',
];

function parseArea(value: string): {areaHa: number; areaLabel: string} {
  const areaHa = Number.parseFloat(value.replace(',', '.')) || 0;
  const rounded = Math.round(areaHa * 10) / 10;
  return {
    areaHa: rounded,
    areaLabel: `${rounded} ha`,
  };
}

function toStatus(value: string): FieldStatus {
  const allowed: FieldStatus[] = [
    'Planned',
    'Prepared',
    'Planted',
    'Growing',
    'Ready to Harvest',
    'Harvested',
  ];
  const match = allowed.find(
    item => item.toLowerCase() === value.trim().toLowerCase(),
  );
  return match ?? 'Planned';
}

function coverToneFor(status: FieldStatus): FarmField['coverTone'] {
  if (status === 'Ready to Harvest') {
    return 'ready';
  }
  if (status === 'Harvested') {
    return 'harvested';
  }
  if (status === 'Planted' || status === 'Prepared' || status === 'Planned') {
    return 'planted';
  }
  return 'growing';
}

function timelineIndexFor(status: FieldStatus): number {
  switch (status) {
    case 'Planned':
      return 0;
    case 'Prepared':
      return 1;
    case 'Planted':
      return 2;
    case 'Growing':
      return 3;
    case 'Ready to Harvest':
      return 4;
    case 'Harvested':
      return 5;
    default:
      return 0;
  }
}

function shortDate(label: string): string {
  const match = label.trim().match(/^([A-Za-z]+)\s+(\d{1,2})/);
  if (!match) {
    return label.trim() || '—';
  }
  return `${match[1].slice(0, 3)} ${Number(match[2])}`;
}

function buildField(draft: FieldDraft, id?: string): FarmField {
  const {areaHa, areaLabel} = parseArea(draft.area);
  const status = toStatus(draft.status);
  const plantingDate = shortDate(draft.plantingDate);

  return {
    id: id ?? `field-${Date.now()}`,
    name: draft.name.trim(),
    areaHa,
    areaLabel,
    crop: draft.crop.trim(),
    variety: draft.variety.trim() || '—',
    status,
    coverTone: coverToneFor(status),
    nextLabel:
      status === 'Harvested'
        ? 'Harvest completed'
        : 'Next: Plan first activity',
    plantingDate,
    expectedHarvest: '—',
    soilType: '—',
    estYield: '—',
    seasonCost: '$0',
    timelineIndex: timelineIndexFor(status),
    activities: [],
    expensesTotal: '$0',
    expensesPerHa: '$0',
    expenses: [],
    harvest: {
      kind: 'empty',
      expectedDate: '—',
      estimatedYield: '—',
      statusLabel: 'Not Recorded',
    },
  };
}

export function FieldsProvider({children}: {children: React.ReactNode}) {
  const [userFields, setUserFields] = usePersistedState<FarmField[] | null>(
    storageKeys.fields,
    null,
  );

  const isDemo = userFields === null;
  const fields = userFields ?? FIELDS;

  const addField = useCallback((draft: FieldDraft) => {
    const field = buildField(draft);
    setUserFields(prev => (prev ? [field, ...prev] : [field]));
    return field;
  }, []);

  const updateField = useCallback((id: string, draft: FieldDraft) => {
    setUserFields(prev => {
      const base = prev ?? FIELDS;
      return base.map(field => {
        if (field.id !== id) {
          return field;
        }
        const next = buildField(draft, id);
        return {
          ...next,
          activities: field.activities,
          expenses: field.expenses,
          harvest: field.harvest,
          expensesTotal: field.expensesTotal,
          expensesPerHa: field.expensesPerHa,
          seasonCost: field.seasonCost,
          soilType: field.soilType,
          estYield: field.estYield,
          expectedHarvest: field.expectedHarvest,
          warning: field.warning,
        };
      });
    });
  }, []);

  const getField = useCallback(
    (id: string) => fields.find(field => field.id === id),
    [fields],
  );

  const removeField = useCallback((id: string) => {
    setUserFields(prev => {
      const base = prev ?? FIELDS;
      return base.filter(field => field.id !== id);
    });
  }, []);

  const mutateField = useCallback(
    (id: string, updater: (field: FarmField) => FarmField) => {
      setUserFields(prev => {
        const base = prev ?? FIELDS;
        return base.map(field => (field.id === id ? updater(field) : field));
      });
    },
    [],
  );

  const cycleFieldStatus = useCallback(
    (id: string) => {
      let nextStatus: FieldStatus = 'Planned';
      mutateField(id, field => {
        const index = FIELD_STATUS_ORDER.indexOf(field.status);
        nextStatus =
          FIELD_STATUS_ORDER[(index + 1) % FIELD_STATUS_ORDER.length] ??
          'Planned';
        return {
          ...field,
          status: nextStatus,
          coverTone: coverToneFor(nextStatus),
          timelineIndex: timelineIndexFor(nextStatus),
          warning:
            nextStatus === 'Ready to Harvest' ? 'Harvest due' : undefined,
          nextLabel:
            nextStatus === 'Harvested'
              ? 'Harvest completed'
              : `Status: ${nextStatus}`,
        };
      });
      return nextStatus;
    },
    [mutateField],
  );

  const addFieldActivity = useCallback(
    (id: string) => {
      mutateField(id, field => {
        const activity: FieldActivity = {
          id: `act-${Date.now()}`,
          title: 'Field Inspection',
          date: 'Jul 23',
          person: 'Unassigned',
          cost: '—',
          status: 'planned',
        };
        return {...field, activities: [activity, ...field.activities]};
      });
    },
    [mutateField],
  );

  const addFieldExpense = useCallback(
    (id: string) => {
      mutateField(id, field => {
        const expense: FieldExpense = {
          id: `exp-${Date.now()}`,
          title: 'Field Expense',
          category: 'Other',
          date: 'Jul 23',
          amount: '$120',
        };
        return {...field, expenses: [expense, ...field.expenses]};
      });
    },
    [mutateField],
  );

  const recordHarvest = useCallback(
    (id: string) => {
      mutateField(id, field => {
        const harvest: FieldHarvest = {
          kind: 'recorded',
          harvestDate: 'Jul 23',
          totalWeight: `${Math.round(field.areaHa * 3.2)} t`,
          yieldPerHa: '3.2 t/ha',
          moisture: '13.0%',
          salePrice: '$450/t',
          totalRevenue: `$${Math.round(field.areaHa * 3.2 * 450).toLocaleString('en-US')}`,
          seasonExpenses: field.seasonCost,
          notes: 'Harvest recorded from field detail.',
        };
        return {
          ...field,
          status: 'Harvested',
          coverTone: 'harvested',
          timelineIndex: 5,
          warning: undefined,
          nextLabel: 'Harvest completed',
          harvest,
        };
      });
    },
    [mutateField],
  );

  const clearHarvest = useCallback(
    (id: string) => {
      mutateField(id, field => ({
        ...field,
        harvest: {
          kind: 'empty',
          expectedDate: field.expectedHarvest,
          estimatedYield: field.estYield,
          statusLabel: 'Not Recorded',
        },
      }));
    },
    [mutateField],
  );

  const value = useMemo(
    () => ({
      fields,
      isDemo,
      addField,
      updateField,
      getField,
      removeField,
      cycleFieldStatus,
      addFieldActivity,
      addFieldExpense,
      recordHarvest,
      clearHarvest,
    }),
    [
      fields,
      isDemo,
      addField,
      updateField,
      getField,
      removeField,
      cycleFieldStatus,
      addFieldActivity,
      addFieldExpense,
      recordHarvest,
      clearHarvest,
    ],
  );

  return (
    <FieldsContext.Provider value={value}>{children}</FieldsContext.Provider>
  );
}

export function useFields() {
  const context = useContext(FieldsContext);
  if (!context) {
    throw new Error('useFields must be used within FieldsProvider');
  }
  return context;
}
