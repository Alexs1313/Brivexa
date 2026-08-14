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
import {storageClaves} from './storage';

export type FieldDraft = {
  name: string;
  area: string;
  crop: string;
  variety: string;
  status: string;
  plantingFecha: string;
};

type FieldsContextValue = {
  fields: FarmField[];
  isMuestra: boolean;
  addCampo: (draft: FieldDraft) => FarmField;
  updateCampo: (id: string, draft: FieldDraft) => void;
  getCampo: (id: string) => FarmField | undefined;
  removeCampo: (id: string) => void;
  cycleFieldEstado: (id: string) => FieldStatus;
  addFieldActividad: (id: string) => void;
  addFieldGasto: (id: string) => void;
  recordCosecha: (id: string) => void;
  clearCosecha: (id: string) => void;
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

function parseSuperficie(value: string): {areaHa: number; areaEtiqueta: string} {
  const areaHa = Number.parseFloat(value.replace(',', '.')) || 0;
  const rounded = Math.round(areaHa * 10) / 10;
  return {
    areaHa: rounded,
    areaEtiqueta: `${rounded} ha`,
  };
}

function toEstado(value: string): FieldStatus {
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

function coverToneFor(status: FieldStatus): FarmField['coverTono'] {
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

function shortFecha(label: string): string {
  const match = label.trim().match(/^([A-Za-z]+)\s+(\d{1,2})/);
  if (!match) {
    return label.trim() || '—';
  }
  return `${match[1].slice(0, 3)} ${Number(match[2])}`;
}

function buildCampo(draft: FieldDraft, id?: string): FarmField {
  const {areaHa, areaEtiqueta} = parseSuperficie(draft.area);
  const status = toEstado(draft.status);
  const plantingFecha = shortFecha(draft.plantingFecha);

  return {
    id: id ?? `field-${Date.now()}`,
    name: draft.name.trim(),
    areaHa,
    areaEtiqueta,
    crop: draft.crop.trim(),
    variety: draft.variety.trim() || '—',
    status,
    coverTono: coverToneFor(status),
    nextEtiqueta:
      status === 'Harvested'
        ? 'Harvest completed'
        : 'Next: Plan first activity',
    plantingFecha,
    expectedCosecha: '—',
    soilTipo: '—',
    estRendimiento: '—',
    seasonCosto: '$0',
    timelineIndice: timelineIndexFor(status),
    activities: [],
    expensesTotal: '$0',
    expensesPerHa: '$0',
    expenses: [],
    harvest: {
      kind: 'empty',
      expectedFecha: '—',
      estimatedRendimiento: '—',
      statusEtiqueta: 'Not Recorded',
    },
  };
}

export function FieldsProvider({children}: {children: React.ReactNode}) {
  const [userCampos, setUserCampos] = usePersistedState<FarmField[] | null>(
    storageClaves.fields,
    null,
  );

  const isMuestra = userCampos === null;
  const fields = userCampos ?? FIELDS;

  const addCampo = useCallback((draft: FieldDraft) => {
    const field = buildCampo(draft);
    setUserCampos(prev => (prev ? [field, ...prev] : [field]));
    return field;
  }, []);

  const updateCampo = useCallback((id: string, draft: FieldDraft) => {
    setUserCampos(prev => {
      const base = prev ?? FIELDS;
      return base.map(field => {
        if (field.id !== id) {
          return field;
        }
        const next = buildCampo(draft, id);
        return {
          ...next,
          activities: field.activities,
          expenses: field.expenses,
          harvest: field.harvest,
          expensesTotal: field.expensesTotal,
          expensesPerHa: field.expensesPerHa,
          seasonCosto: field.seasonCosto,
          soilTipo: field.soilTipo,
          estRendimiento: field.estRendimiento,
          expectedCosecha: field.expectedCosecha,
          warning: field.warning,
        };
      });
    });
  }, []);

  const getCampo = useCallback(
    (id: string) => fields.find(field => field.id === id),
    [fields],
  );

  const removeCampo = useCallback((id: string) => {
    setUserCampos(prev => {
      const base = prev ?? FIELDS;
      return base.filter(field => field.id !== id);
    });
  }, []);

  const mutateCampo = useCallback(
    (id: string, updater: (field: FarmField) => FarmField) => {
      setUserCampos(prev => {
        const base = prev ?? FIELDS;
        return base.map(field => (field.id === id ? updater(field) : field));
      });
    },
    [],
  );

  const cycleFieldEstado = useCallback(
    (id: string) => {
      let nextEstado: FieldStatus = 'Planned';
      mutateCampo(id, field => {
        const index = FIELD_STATUS_ORDER.indexOf(field.status);
        nextEstado =
          FIELD_STATUS_ORDER[(index + 1) % FIELD_STATUS_ORDER.length] ??
          'Planned';
        return {
          ...field,
          status: nextEstado,
          coverTono: coverToneFor(nextEstado),
          timelineIndice: timelineIndexFor(nextEstado),
          warning:
            nextEstado === 'Ready to Harvest' ? 'Harvest due' : undefined,
          nextEtiqueta:
            nextEstado === 'Harvested'
              ? 'Harvest completed'
              : `Status: ${nextEstado}`,
        };
      });
      return nextEstado;
    },
    [mutateCampo],
  );

  const addFieldActividad = useCallback(
    (id: string) => {
      mutateCampo(id, field => {
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
    [mutateCampo],
  );

  const addFieldGasto = useCallback(
    (id: string) => {
      mutateCampo(id, field => {
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
    [mutateCampo],
  );

  const recordCosecha = useCallback(
    (id: string) => {
      mutateCampo(id, field => {
        const harvest: FieldHarvest = {
          kind: 'recorded',
          harvestFecha: 'Jul 23',
          totalPeso: `${Math.round(field.areaHa * 3.2)} t`,
          yieldPerHa: '3.2 t/ha',
          moisture: '13.0%',
          salePrecio: '$450/t',
          totalIngresos: `$${Math.round(field.areaHa * 3.2 * 450).toLocaleString('en-US')}`,
          seasonGastos: field.seasonCosto,
          notes: 'Harvest recorded from field detail.',
        };
        return {
          ...field,
          status: 'Harvested',
          coverTono: 'harvested',
          timelineIndice: 5,
          warning: undefined,
          nextEtiqueta: 'Harvest completed',
          harvest,
        };
      });
    },
    [mutateCampo],
  );

  const clearCosecha = useCallback(
    (id: string) => {
      mutateCampo(id, field => ({
        ...field,
        harvest: {
          kind: 'empty',
          expectedFecha: field.expectedCosecha,
          estimatedRendimiento: field.estRendimiento,
          statusEtiqueta: 'Not Recorded',
        },
      }));
    },
    [mutateCampo],
  );

  const value = useMemo(
    () => ({
      fields,
      isMuestra,
      addCampo,
      updateCampo,
      getCampo,
      removeCampo,
      cycleFieldEstado,
      addFieldActividad,
      addFieldGasto,
      recordCosecha,
      clearCosecha,
    }),
    [
      fields,
      isMuestra,
      addCampo,
      updateCampo,
      getCampo,
      removeCampo,
      cycleFieldEstado,
      addFieldActividad,
      addFieldGasto,
      recordCosecha,
      clearCosecha,
    ],
  );

  return (
    <FieldsContext.Provider value={value}>{children}</FieldsContext.Provider>
  );
}

export function useCampos() {
  const context = useContext(FieldsContext);
  if (!context) {
    throw new Error('useCampos must be used within FieldsProvider');
  }
  return context;
}
