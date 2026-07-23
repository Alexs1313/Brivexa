export type CalculatorId = 'seed' | 'fertilizer' | 'spray';

export type CalculatorCard = {
  id: CalculatorId;
  title: string;
  description: string;
  icon: string;
  iconTone: 'success' | 'info' | 'purple';
};

export const CALCULATOR_CARDS: CalculatorCard[] = [
  {
    id: 'seed',
    title: 'Seed Rate Calculator',
    description: 'Seed for the whole field with reserve & packages',
    icon: '🌱',
    iconTone: 'success',
  },
  {
    id: 'fertilizer',
    title: 'Fertilizer Calculator',
    description: 'Fertilizer amount, bags and total cost',
    icon: '🧪',
    iconTone: 'info',
  },
  {
    id: 'spray',
    title: 'Spray Mixture Calculator',
    description: 'Water, product, tank fills & spray cost',
    icon: '💦',
    iconTone: 'purple',
  },
];

export type ResultRow = {
  label: string;
  value: string;
  tone?: 'gold' | 'success';
};

export function parseNumber(value: string): number {
  const cleaned = value.replace(/,/g, '').trim();
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : 0;
}

export function formatKg(value: number, digits = 0): string {
  if (digits === 0) {
    return `${Math.round(value).toLocaleString('en-US')} kg`;
  }
  return `${value.toLocaleString('en-US', {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  })} kg`;
}

export function formatLiters(value: number, digits = 0): string {
  if (digits === 0) {
    return `${Math.round(value).toLocaleString('en-US')} L`;
  }
  return `${value.toLocaleString('en-US', {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  })} L`;
}

export function formatMoney(value: number): string {
  return `$${Math.round(value).toLocaleString('en-US')}`;
}

export function calcSeedRate(input: {
  areaHa: number;
  seedRateKgHa: number;
  packageKg: number;
  reservePct: number;
}): ResultRow[] {
  const base = input.areaHa * input.seedRateKgHa;
  const reserve = base * (input.reservePct / 100);
  const total = base + reserve;
  const packages = Math.ceil(total / Math.max(input.packageKg, 0.0001));

  return [
    {label: 'Base Seed Requirement', value: formatKg(base)},
    {
      label: `Reserve (${input.reservePct}%)`,
      value: formatKg(reserve, 1),
    },
    {label: 'Total Seed Required', value: formatKg(total), tone: 'gold'},
    {
      label: `Packages (${input.packageKg} kg)`,
      value: `${packages} pkgs`,
      tone: 'gold',
    },
    {
      label: 'Seed per Hectare',
      value: `${input.seedRateKgHa} kg/ha`,
    },
  ];
}

export function calcFertilizer(input: {
  areaHa: number;
  rateKgHa: number;
  bagKg: number;
  pricePerBag: number;
  reservePct: number;
}): ResultRow[] {
  const base = input.areaHa * input.rateKgHa;
  const reserve = base * (input.reservePct / 100);
  const total = base + reserve;
  const bags = Math.ceil(total / Math.max(input.bagKg, 0.0001));
  const totalCost = bags * input.pricePerBag;
  const costPerHa = input.areaHa > 0 ? totalCost / input.areaHa : 0;

  return [
    {label: 'Base Requirement', value: formatKg(base)},
    {
      label: `Reserve (${input.reservePct}%)`,
      value: formatKg(reserve, 1),
    },
    {label: 'Total Fertilizer', value: formatKg(total), tone: 'gold'},
    {
      label: `Bags (${input.bagKg} kg)`,
      value: `${bags} bags`,
      tone: 'gold',
    },
    {label: 'Cost per Hectare', value: formatMoney(costPerHa)},
    {
      label: 'Total Estimated Cost',
      value: formatMoney(totalCost),
      tone: 'success',
    },
  ];
}

export function calcSprayMixture(input: {
  areaHa: number;
  waterRateLHa: number;
  productRateLHa: number;
  tankL: number;
  packageL: number;
  packageCost?: number;
}): ResultRow[] {
  const totalWater = input.areaHa * input.waterRateLHa;
  const totalProduct = input.areaHa * input.productRateLHa;
  const fullTanks = Math.floor(totalWater / Math.max(input.tankL, 0.0001));
  const remainder = totalWater - fullTanks * input.tankL;
  const hasPartial = remainder > 0.05;
  const productPerTank =
    input.waterRateLHa > 0
      ? input.tankL * (input.productRateLHa / input.waterRateLHa)
      : 0;
  const finalArea =
    input.waterRateLHa > 0 ? remainder / input.waterRateLHa : 0;
  const packages = Math.ceil(
    totalProduct / Math.max(input.packageL, 0.0001),
  );
  const cost = packages * (input.packageCost ?? 48);

  const tankFillsLabel = hasPartial
    ? `${fullTanks} full + 1 partial`
    : `${fullTanks} full`;

  return [
    {label: 'Total Water', value: formatLiters(totalWater)},
    {
      label: 'Total Product',
      value: formatLiters(totalProduct, 1),
      tone: 'gold',
    },
    {label: 'Tank Fills', value: tankFillsLabel},
    {
      label: 'Product per Full Tank',
      value: formatLiters(productPerTank, 2),
    },
    {
      label: 'Final Tank Area',
      value: `${finalArea.toLocaleString('en-US', {
        maximumFractionDigits: 1,
        minimumFractionDigits: 1,
      })} ha`,
    },
    {
      label: 'Product Packages',
      value: `${packages} pkgs`,
      tone: 'gold',
    },
    {
      label: 'Estimated Cost',
      value: formatMoney(cost),
      tone: 'success',
    },
  ];
}

export const SEED_DEFAULTS = {
  fieldId: 'north',
  area: '24.8',
  seedRate: '22',
  packageWeight: '25',
  reserve: '5',
};

export const FERTILIZER_DEFAULTS = {
  fieldId: 'river',
  rate: '180',
  bagWeight: '50',
  price: '32',
  reserve: '3',
};

export const SPRAY_DEFAULTS = {
  fieldId: 'east',
  waterRate: '200',
  productRate: '0.8',
  tankCapacity: '1200',
  packageVol: '5',
};
