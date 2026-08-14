export type FieldStatus =
  | 'Planned'
  | 'Prepared'
  | 'Planted'
  | 'Growing'
  | 'Ready to Harvest'
  | 'Harvested';

export type ActivityStatus = 'completed' | 'in_progress' | 'planned';

export type FieldActivity = {
  id: string;
  title: string;
  date: string;
  person: string;
  cost: string;
  status: ActivityStatus;
};

export type FieldExpense = {
  id: string;
  title: string;
  category: string;
  date: string;
  amount: string;
};

export type FieldHarvest =
  | {
      kind: 'empty';
      expectedFecha: string;
      estimatedRendimiento: string;
      estimatedTotal?: string;
      statusEtiqueta: string;
    }
  | {
      kind: 'recorded';
      harvestFecha: string;
      totalPeso: string;
      yieldPerHa: string;
      moisture: string;
      salePrecio: string;
      totalIngresos: string;
      seasonGastos?: string;
      estimatedGanancia?: string;
      notes?: string;
    };

export type FarmField = {
  id: string;
  name: string;
  areaHa: number;
  areaEtiqueta: string;
  crop: string;
  variety: string;
  status: FieldStatus;
  coverTono: 'growing' | 'ready' | 'harvested' | 'planted';
  warning?: string;
  nextEtiqueta: string;
  plantingFecha: string;
  expectedCosecha: string;
  soilTipo: string;
  estRendimiento: string;
  seasonCosto: string;
  timelineIndice: number; // 0..5 completed through this stage
  activities: FieldActivity[];
  expensesTotal: string;
  expensesPerHa: string;
  expenses: FieldExpense[];
  harvest: FieldHarvest;
};

export const FIELD_STATUS_FILTROS = [
  'All',
  'Prepared',
  'Planted',
  'Growing',
  'Harvested',
] as const;

export const TIMELINE_PASOS = [
  'Planned',
  'Prepared',
  'Planted',
  'Growing',
  'Ready',
  'Harvested',
] as const;

export const DEMO_BANDA =
  'The current information is sample data. Once you add your own data, the app will use it across all relevant sections';

export const FIELDS: FarmField[] = [
  {
    id: 'north',
    name: 'North Field',
    areaHa: 24.8,
    areaEtiqueta: '24.8 ha',
    crop: 'Corn',
    variety: 'Pioneer P9241',
    status: 'Growing',
    coverTono: 'growing',
    nextEtiqueta: 'Next: Fertilizing, May 16',
    plantingFecha: 'Apr 18',
    expectedCosecha: 'Oct 12',
    soilTipo: 'Loam',
    estRendimiento: '11.2 t/ha',
    seasonCosto: '$4,090',
    timelineIndice: 3,
    activities: [
      {
        id: 'n1',
        title: 'Planting',
        date: 'Apr 18',
        person: 'Daniel Reed',
        cost: '$1,450',
        status: 'completed',
      },
      {
        id: 'n2',
        title: 'Fertilizing',
        date: 'Jul 22',
        person: 'Mark Lewis',
        cost: '$2,640',
        status: 'in_progress',
      },
      {
        id: 'n3',
        title: 'Irrigation Inspection',
        date: 'Jul 26',
        person: 'Emily Stone',
        cost: '—',
        status: 'planned',
      },
    ],
    expensesTotal: '$4,090',
    expensesPerHa: '$165',
    expenses: [
      {
        id: 'ne1',
        title: 'NPK Fertilizer',
        category: 'Fertilizer',
        date: 'Jul 8',
        amount: '$2,640',
      },
      {
        id: 'ne2',
        title: 'Labor — Planting',
        category: 'Labor',
        date: 'Apr 18',
        amount: '$1,450',
      },
    ],
    harvest: {
      kind: 'empty',
      expectedFecha: 'Oct 12',
      estimatedRendimiento: '11.2 t/ha',
      statusEtiqueta: 'Not Recorded',
    },
  },
  {
    id: 'river',
    name: 'River Plot',
    areaHa: 16.2,
    areaEtiqueta: '16.2 ha',
    crop: 'Winter Wheat',
    variety: 'Skagen',
    status: 'Ready to Harvest',
    coverTono: 'ready',
    warning: 'Harvest due',
    nextEtiqueta: 'Next: Harvest, Jul 28',
    plantingFecha: 'Sep 24',
    expectedCosecha: 'Jul 28',
    soilTipo: 'Clay Loam',
    estRendimiento: '7.8 t/ha',
    seasonCosto: '$5,184',
    timelineIndice: 4,
    activities: [
      {
        id: 'r1',
        title: 'Planting',
        date: 'Sep 24',
        person: 'Daniel Reed',
        cost: '$972',
        status: 'completed',
      },
      {
        id: 'r2',
        title: 'Fertilizing',
        date: 'Mar 18',
        person: 'Mark Lewis',
        cost: '$1,620',
        status: 'completed',
      },
      {
        id: 'r3',
        title: 'Crop Protection',
        date: 'May 12',
        person: 'Daniel Reed',
        cost: '$918',
        status: 'completed',
      },
      {
        id: 'r4',
        title: 'Harvesting',
        date: 'Jul 28',
        person: 'Emily Stone',
        cost: '—',
        status: 'planned',
      },
    ],
    expensesTotal: '$5,184',
    expensesPerHa: '$320',
    expenses: [
      {
        id: 're1',
        title: 'Skagen Wheat Grain',
        category: 'Sowing',
        date: 'Sep 20',
        amount: '$1,134',
      },
      {
        id: 're2',
        title: 'NPK Fertilizer',
        category: 'Fertilizer',
        date: 'Mar 18',
        amount: '$1,620',
      },
      {
        id: 're3',
        title: 'Labor — Planting',
        category: 'Labor',
        date: 'Sep 24',
        amount: '$972',
      },
      {
        id: 're4',
        title: 'Crop Protection Products',
        category: 'Crop Protection',
        date: 'May 12',
        amount: '$918',
      },
      {
        id: 're5',
        title: 'Diesel Fuel',
        category: 'Fuel',
        date: 'May 12',
        amount: '$540',
      },
    ],
    harvest: {
      kind: 'empty',
      expectedFecha: 'Jul 28',
      estimatedRendimiento: '7.8 t/ha',
      estimatedTotal: '126.4 t',
      statusEtiqueta: 'Not Recorded',
    },
  },
  {
    id: 'east',
    name: 'East Field',
    areaHa: 12.7,
    areaEtiqueta: '12.7 ha',
    crop: 'Sunflower',
    variety: 'SY Bacardi',
    status: 'Growing',
    coverTono: 'growing',
    nextEtiqueta: 'Next: Irrigation Inspection, Jul 30',
    plantingFecha: 'Apr 26',
    expectedCosecha: 'Sep 18',
    soilTipo: 'Sandy Loam',
    estRendimiento: '3.4 t/ha',
    seasonCosto: '$3,556',
    timelineIndice: 3,
    activities: [
      {
        id: 'e1',
        title: 'Soil Preparation',
        date: 'Apr 20',
        person: 'Chris Miller',
        cost: '$254',
        status: 'completed',
      },
      {
        id: 'e2',
        title: 'Planting',
        date: 'Apr 26',
        person: 'Daniel Reed',
        cost: '$762',
        status: 'completed',
      },
      {
        id: 'e3',
        title: 'Fertilizing',
        date: 'May 14',
        person: 'Mark Lewis',
        cost: '$1,143',
        status: 'completed',
      },
      {
        id: 'e4',
        title: 'Irrigation Inspection',
        date: 'Jul 30',
        person: 'Emily Stone',
        cost: '—',
        status: 'planned',
      },
    ],
    expensesTotal: '$3,556',
    expensesPerHa: '$280',
    expenses: [
      {
        id: 'ee1',
        title: 'SY Bacardi Sunflower Grain',
        category: 'Sowing',
        date: 'Apr 24',
        amount: '$1,016',
      },
      {
        id: 'ee2',
        title: 'Urea 46%',
        category: 'Fertilizer',
        date: 'May 14',
        amount: '$1,143',
      },
      {
        id: 'ee3',
        title: 'Labor — Planting',
        category: 'Labor',
        date: 'Apr 26',
        amount: '$762',
      },
      {
        id: 'ee4',
        title: 'Crop Protection Products',
        category: 'Crop Protection',
        date: 'Jun 5',
        amount: '$381',
      },
      {
        id: 'ee5',
        title: 'Diesel Fuel',
        category: 'Fuel',
        date: 'Apr 20',
        amount: '$254',
      },
    ],
    harvest: {
      kind: 'empty',
      expectedFecha: 'Sep 18',
      estimatedRendimiento: '3.4 t/ha',
      estimatedTotal: '43.2 t',
      statusEtiqueta: 'Not Recorded',
    },
  },
  {
    id: 'south',
    name: 'South Field',
    areaHa: 18.4,
    areaEtiqueta: '18.4 ha',
    crop: 'Soybean',
    variety: 'ES Mentor',
    status: 'Harvested',
    coverTono: 'harvested',
    nextEtiqueta: 'Harvest completed Oct 2',
    plantingFecha: 'May 3',
    expectedCosecha: 'Oct 2',
    soilTipo: 'Silty Clay Loam',
    estRendimiento: '3.3 t/ha',
    seasonCosto: '$5,152',
    timelineIndice: 5,
    activities: [
      {
        id: 's1',
        title: 'Planting',
        date: 'May 3',
        person: 'Daniel Reed',
        cost: '$1,104',
        status: 'completed',
      },
      {
        id: 's2',
        title: 'Fertilizing',
        date: 'May 22',
        person: 'Mark Lewis',
        cost: '$1,288',
        status: 'completed',
      },
      {
        id: 's3',
        title: 'Field Inspection',
        date: 'Jul 10',
        person: 'Emily Stone',
        cost: '—',
        status: 'completed',
      },
      {
        id: 's4',
        title: 'Harvesting',
        date: 'Oct 2',
        person: 'Chris Miller',
        cost: '$736',
        status: 'completed',
      },
    ],
    expensesTotal: '$5,152',
    expensesPerHa: '$280',
    expenses: [
      {
        id: 'se1',
        title: 'ES Mentor Soybean Grain',
        category: 'Sowing',
        date: 'Apr 29',
        amount: '$1,656',
      },
      {
        id: 'se2',
        title: 'Planting Inoculant',
        category: 'Crop Treatment',
        date: 'May 2',
        amount: '$368',
      },
      {
        id: 'se3',
        title: 'NPK Fertilizer',
        category: 'Fertilizer',
        date: 'May 22',
        amount: '$1,288',
      },
      {
        id: 'se4',
        title: 'Labor — Planting',
        category: 'Labor',
        date: 'May 3',
        amount: '$1,104',
      },
      {
        id: 'se5',
        title: 'Fuel and Harvesting',
        category: 'Fuel',
        date: 'Oct 2',
        amount: '$736',
      },
    ],
    harvest: {
      kind: 'recorded',
      harvestFecha: 'Oct 2',
      totalPeso: '60.7 t',
      yieldPerHa: '3.3 t/ha',
      moisture: '13.1%',
      salePrecio: '$465/t',
      totalIngresos: '$28,226',
      seasonGastos: '$5,152',
      estimatedGanancia: '$23,074',
      notes:
        'Harvest completed in dry conditions. Grain quality met the buyer’s delivery requirements.',
    },
  },
];

export function getFieldById(id: string): FarmField | undefined {
  return FIELDS.find(field => field.id === id);
}
