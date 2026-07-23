export type FarmSection = 'Inventory' | 'Equipment' | 'Finance' | 'Reports';

export type StockStatus = 'Available' | 'Low Stock' | 'Out of Stock';

export type EquipmentStatus = 'Available' | 'In Use' | 'Service';

export type InventoryItem = {
  id: string;
  name: string;
  category: string;
  status: StockStatus;
  quantity: number;
  quantityLabel: string;
  minQuantity: number;
  minLabel: string;
  unit: string;
  unitCost: number;
  unitCostLabel: string;
  priceLabel: string;
  totalValueLabel: string;
  supplier: string;
  purchaseDate: string;
  progress: number;
  alert?: string;
  movements: StockMovement[];
};

export type StockMovement = {
  id: string;
  title: string;
  date: string;
  amountLabel: string;
  kind: 'in' | 'out' | 'balance';
};

export type FarmEquipment = {
  id: string;
  name: string;
  type: string;
  modelYear: string;
  icon: string;
  status: EquipmentStatus;
  hours: number;
  hoursLabel: string;
  serviceIntervalHrs: number;
  hoursToService: number | null;
  serviceAlert?: string;
  assignedField?: string;
  fuelType: string;
  maintCostLabel: string;
  serviceProgress: number;
};

export type ExpenseCategory = {
  id: string;
  label: string;
  amountLabel: string;
  progress: number;
  color: string;
};

export type FarmTransaction = {
  id: string;
  title: string;
  subtitle: string;
  amountLabel: string;
  kind: 'income' | 'expense';
  icon: string;
};

export type SeasonReport = {
  id: string;
  title: string;
  subtitle: string;
  metrics: {label: string; value: string; tone?: 'success' | 'danger' | 'gold'}[];
};

export const FARM_SECTIONS: FarmSection[] = [
  'Inventory',
  'Equipment',
  'Finance',
  'Reports',
];

export const FARM_DEMO_BANNER =
  'The current information is provided for demonstration purposes. Once you add your own data, the app will use it across all relevant sections';

export const INVENTORY_ITEMS: InventoryItem[] = [
  {
    id: 'inv-corn',
    name: 'Pioneer P9241 Corn Seed',
    category: 'Seeds',
    status: 'Available',
    quantity: 18,
    quantityLabel: '18 bags',
    minQuantity: 8,
    minLabel: 'min 8 bags',
    unit: 'bags',
    unitCost: 210,
    unitCostLabel: '$210/bag',
    priceLabel: '$210/bag',
    totalValueLabel: '$3,780',
    supplier: 'Pioneer Seeds Co.',
    purchaseDate: 'Mar 28, 2026',
    progress: 1,
    movements: [
      {
        id: 'm1',
        title: 'Stock Added',
        date: 'Mar 28',
        amountLabel: '+20 bags',
        kind: 'in',
      },
      {
        id: 'm2',
        title: 'Used — North Field',
        date: 'Apr 18',
        amountLabel: '−2 bags',
        kind: 'out',
      },
      {
        id: 'm3',
        title: 'Current Balance',
        date: '',
        amountLabel: '18 bags',
        kind: 'balance',
      },
    ],
  },
  {
    id: 'inv-npk',
    name: 'NPK 16-16-16',
    category: 'Fertilizers',
    status: 'Low Stock',
    quantity: 240,
    quantityLabel: '240 kg',
    minQuantity: 300,
    minLabel: 'min 300 kg',
    unit: 'kg',
    unitCost: 1.1,
    unitCostLabel: '$1.10/kg',
    priceLabel: '$1.10/kg',
    totalValueLabel: '$264',
    supplier: 'AgriSupply Co.',
    purchaseDate: 'Mar 12, 2026',
    progress: 0.8,
    movements: [
      {
        id: 'm1',
        title: 'Used — North Field',
        date: 'Jul 22',
        amountLabel: '−4 kg',
        kind: 'out',
      },
      {
        id: 'm2',
        title: 'Stock Added',
        date: 'Jun 30',
        amountLabel: '+50 kg',
        kind: 'in',
      },
      {
        id: 'm3',
        title: 'Used — River Plot',
        date: 'Jun 12',
        amountLabel: '−8 kg',
        kind: 'out',
      },
      {
        id: 'm4',
        title: 'Used — East Field',
        date: 'May 14',
        amountLabel: '−180 kg',
        kind: 'out',
      },
      {
        id: 'm5',
        title: 'Current Balance',
        date: '',
        amountLabel: '240 kg',
        kind: 'balance',
      },
    ],
  },
  {
    id: 'inv-glyph',
    name: 'Glyphosate 360',
    category: 'Crop Protection',
    status: 'Out of Stock',
    quantity: 0,
    quantityLabel: '0 L',
    minQuantity: 20,
    minLabel: 'min 20 L',
    unit: 'L',
    unitCost: 9.6,
    unitCostLabel: '$9.60/L',
    priceLabel: '$9.60/L',
    totalValueLabel: '$0',
    supplier: 'GreenField Chemicals',
    purchaseDate: 'Apr 5, 2026',
    progress: 0,
    alert:
      'Stock is empty. Add at least 20 L to restore the minimum inventory level.',
    movements: [
      {
        id: 'm1',
        title: 'Stock Added',
        date: 'Apr 5',
        amountLabel: '+40 L',
        kind: 'in',
      },
      {
        id: 'm2',
        title: 'Used — South Field',
        date: 'May 20',
        amountLabel: '−16 L',
        kind: 'out',
      },
      {
        id: 'm3',
        title: 'Used — East Field',
        date: 'Jun 5',
        amountLabel: '−12 L',
        kind: 'out',
      },
      {
        id: 'm4',
        title: 'Used — River Plot',
        date: 'Jun 18',
        amountLabel: '−12 L',
        kind: 'out',
      },
      {
        id: 'm5',
        title: 'Current Balance',
        date: '',
        amountLabel: '0 L',
        kind: 'balance',
      },
    ],
  },
];

export const EQUIPMENT: FarmEquipment[] = [
  {
    id: 'eq-t150',
    name: 'Tractor T-150',
    type: 'Tractor',
    modelYear: 'Model 2022',
    icon: '🚜',
    status: 'Available',
    hours: 1842,
    hoursLabel: '1,842 hrs',
    serviceIntervalHrs: 250,
    hoursToService: 8,
    serviceAlert: 'Service due in 8 hrs',
    fuelType: 'Diesel',
    maintCostLabel: '$3,240',
    serviceProgress: 0.97,
  },
  {
    id: 'eq-s770',
    name: 'John Deere S770',
    type: 'Harvester',
    modelYear: 'Model 2021',
    icon: '🌾',
    status: 'Available',
    hours: 920,
    hoursLabel: '920 hrs',
    serviceIntervalHrs: 300,
    hoursToService: 80,
    fuelType: 'Diesel',
    maintCostLabel: '$1,860',
    serviceProgress: 0.73,
  },
  {
    id: 'eq-ux4200',
    name: 'Amazone UX 4200',
    type: 'Sprayer',
    modelYear: 'Model 2023',
    icon: '💧',
    status: 'In Use',
    hours: 640,
    hoursLabel: '640 hrs',
    serviceIntervalHrs: 200,
    hoursToService: 45,
    assignedField: 'East Field',
    fuelType: 'Diesel',
    maintCostLabel: '$920',
    serviceProgress: 0.78,
  },
];

export const FINANCE_SUMMARY = {
  netProfitLabel: '$33,600',
  incomeLabel: '$41,200',
  expensesLabel: '$7,600',
  costPerHaLabel: '$105',
};

export const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  {
    id: 'fert',
    label: 'Fertilizer',
    amountLabel: '$2,640',
    progress: 1,
    color: '#5a8bff',
  },
  {
    id: 'fuel',
    label: 'Fuel',
    amountLabel: '$1,890',
    progress: 0.72,
    color: '#f0932b',
  },
  {
    id: 'labor',
    label: 'Labor',
    amountLabel: '$1,450',
    progress: 0.55,
    color: '#a06bff',
  },
  {
    id: 'equip',
    label: 'Equipment',
    amountLabel: '$820',
    progress: 0.31,
    color: '#e24bc0',
  },
];

export const TRANSACTIONS: FarmTransaction[] = [
  {
    id: 'tx-wheat',
    title: 'Winter Wheat Sale',
    subtitle: 'Crop Sales · River Plot · Jul 12',
    amountLabel: '+$41,200',
    kind: 'income',
    icon: '💰',
  },
  {
    id: 'tx-npk',
    title: 'NPK Fertilizer',
    subtitle: 'Fertilizer · North Field · Jul 8',
    amountLabel: '−$2,640',
    kind: 'expense',
    icon: '🧾',
  },
];

export const SEASON_REPORT: SeasonReport = {
  id: 'rpt-2026',
  title: 'Season 2026',
  subtitle: 'Whole-farm season overview · Season 2026',
  metrics: [
    {label: 'Total Fields', value: '4'},
    {label: 'Farmed Area', value: '72.1 ha'},
    {label: 'Completed Tasks', value: '12'},
    {label: 'Total Income', value: '$41,200', tone: 'success'},
    {label: 'Total Expenses', value: '$7,600', tone: 'danger'},
    {label: 'Net Profit', value: '$33,600', tone: 'success'},
    {label: 'Best Field', value: 'River Plot', tone: 'gold'},
  ],
};

export const INVENTORY_CATEGORIES = [
  'Fertilizers',
  'Seeds',
  'Crop Protection',
  'Fuel',
  'Parts',
] as const;

export const INVENTORY_UNITS = ['kg', 'L', 'bags', 'units'] as const;

export const INCOME_CATEGORIES = [
  'Crop Sales',
  'Livestock',
  'Subsidies',
  'Other',
] as const;

export const MAINTENANCE_TYPES = [
  'Oil & Filter Service',
  'Tire Service',
  'Engine Repair',
  'General Inspection',
] as const;

export function getInventoryItem(id: string) {
  return INVENTORY_ITEMS.find(item => item.id === id);
}

export function getEquipment(id: string) {
  return EQUIPMENT.find(item => item.id === id);
}

export function inventoryTotals(items: InventoryItem[]) {
  const totalValue = items.reduce(
    (sum, item) => sum + item.quantity * item.unitCost,
    0,
  );
  const needsAttention = items.filter(
    item => item.status === 'Low Stock' || item.status === 'Out of Stock',
  ).length;
  return {
    totalValueLabel: `$${Math.round(totalValue).toLocaleString('en-US')}`,
    needsAttention,
  };
}

export function equipmentTotals(items: FarmEquipment[]) {
  return {
    available: items.filter(item => item.status === 'Available').length,
    inUse: items.filter(item => item.status === 'In Use').length,
    service: items.filter(
      item =>
        item.status === 'Service' ||
        (item.hoursToService != null && item.hoursToService <= 10),
    ).length,
  };
}
