export type CalculatorId = 'seed' | 'fertilizer' | 'spray';

export type CalculatorCard = {
  id: CalculatorId;
  title: string;
  description: string;
  icon: string;
  iconTono: 'success' | 'info' | 'purple';
};

export const CALCULATOR_CARDS: CalculatorCard[] = [
  {
    id: 'seed',
    title: 'Sowing Rate Calculator',
    description: 'Sowing amount for the whole field with reserve & packages',
    icon: '🌱',
    iconTono: 'success',
  },
  {
    id: 'fertilizer',
    title: 'Fertilizer Calculator',
    description: 'Fertilizer amount, bags and total cost',
    icon: '🧪',
    iconTono: 'info',
  },
  {
    id: 'spray',
    title: 'Spray Mixture Calculator',
    description: 'Water, product, tank fills & spray cost',
    icon: '💦',
    iconTono: 'purple',
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

export function formatDinero(value: number): string {
  return `$${Math.round(value).toLocaleString('en-US')}`;
}

export function calcSeedTasa(input: {
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
    {label: 'Base Sowing Requirement', value: formatKg(base)},
    {
      label: `Reserve (${input.reservePct}%)`,
      value: formatKg(reserve, 1),
    },
    {label: 'Total Sowing Required', value: formatKg(total), tone: 'gold'},
    {
      label: `Packages (${input.packageKg} kg)`,
      value: `${packages} pkgs`,
      tone: 'gold',
    },
    {
      label: 'Sowing per Hectare',
      value: `${input.seedRateKgHa} kg/ha`,
    },
  ];
}

export function calcAbono(input: {
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
  const totalCosto = bags * input.pricePerBag;
  const costPerHa = input.areaHa > 0 ? totalCosto / input.areaHa : 0;

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
    {label: 'Cost per Hectare', value: formatDinero(costPerHa)},
    {
      label: 'Total Estimated Cost',
      value: formatDinero(totalCosto),
      tone: 'success',
    },
  ];
}

export function calcSprayMezcla(input: {
  areaHa: number;
  waterRateLHa: number;
  productRateLHa: number;
  tankL: number;
  packageL: number;
  packageCosto?: number;
}): ResultRow[] {
  const totalAgua = input.areaHa * input.waterRateLHa;
  const totalProducto = input.areaHa * input.productRateLHa;
  const fullTanks = Math.floor(totalAgua / Math.max(input.tankL, 0.0001));
  const remainder = totalAgua - fullTanks * input.tankL;
  const hasParcial = remainder > 0.05;
  const productPerTank =
    input.waterRateLHa > 0
      ? input.tankL * (input.productRateLHa / input.waterRateLHa)
      : 0;
  const finalSuperficie =
    input.waterRateLHa > 0 ? remainder / input.waterRateLHa : 0;
  const packages = Math.ceil(
    totalProducto / Math.max(input.packageL, 0.0001),
  );
  const cost = packages * (input.packageCosto ?? 48);

  const tankFillsEtiqueta = hasParcial
    ? `${fullTanks} full + 1 partial`
    : `${fullTanks} full`;

  return [
    {label: 'Total Water', value: formatLiters(totalAgua)},
    {
      label: 'Total Product',
      value: formatLiters(totalProducto, 1),
      tone: 'gold',
    },
    {label: 'Tank Fills', value: tankFillsEtiqueta},
    {
      label: 'Product per Full Tank',
      value: formatLiters(productPerTank, 2),
    },
    {
      label: 'Final Tank Area',
      value: `${finalSuperficie.toLocaleString('en-US', {
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
      value: formatDinero(cost),
      tone: 'success',
    },
  ];
}

export const SEED_PREDETERMINADOS = {
  fieldId: 'north',
  area: '24.8',
  seedTasa: '22',
  packagePeso: '25',
  reserve: '5',
};

export const FERTILIZER_PREDETERMINADOS = {
  fieldId: 'river',
  rate: '180',
  bagPeso: '50',
  price: '32',
  reserve: '3',
};

export const SPRAY_PREDETERMINADOS = {
  fieldId: 'east',
  waterTasa: '200',
  productTasa: '0.8',
  tankCapacidad: '1200',
  packageVol: '5',
};
