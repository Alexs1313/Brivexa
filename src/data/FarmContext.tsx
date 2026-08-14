import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
} from 'react';

import {usePersistedState} from '../hooks/usePersistedState';
import {
  EQUIPMENT,
  INVENTORY_ITEMS,
  TRANSACTIONS,
  type EquipmentStatus,
  type FarmEquipment,
  type FarmTransaction,
  type InventoryItem,
  type StockMovement,
  type StockStatus,
} from './farm';
import {storageClaves} from './storage';

export type InventoryItemDraft = {
  name: string;
  category: string;
  quantity: string;
  unit: string;
  minQty: string;
  unitCosto: string;
  supplier: string;
};

export type IncomeDraft = {
  title: string;
  amount: string;
  category: string;
  date: string;
  field: string;
  buyer: string;
};

export type ExpenseDraft = {
  title: string;
  amount: string;
  subtitle: string;
  icon?: string;
};

export type MaintenanceDraft = {
  type: string;
  date: string;
  hours: string;
  cost: string;
  provider: string;
  nextHoras: string;
};

type FarmContextValue = {
  inventory: InventoryItem[];
  equipment: FarmEquipment[];
  transactions: FarmTransaction[];
  isInventoryMuestra: boolean;
  isEquipmentMuestra: boolean;
  isTransactionsMuestra: boolean;
  getInventoryArticulo: (id: string) => InventoryItem | undefined;
  getEquipo: (id: string) => FarmEquipment | undefined;
  addInventoryArticulo: (draft: InventoryItemDraft) => InventoryItem;
  addIngreso: (draft: IncomeDraft) => FarmTransaction;
  addGasto: (draft: ExpenseDraft) => FarmTransaction;
  addExistencias: (itemId: string, amount: number) => void;
  useExistencias: (itemId: string, amount: number) => boolean;
  addOpHoras: (equipmentId: string, hours: number) => void;
  cycleEquipmentEstado: (equipmentId: string) => EquipmentStatus;
  addEquipo: () => FarmEquipment;
  addMantenimiento: (
    equipmentId: string,
    draft: MaintenanceDraft,
  ) => void;
  removeInventoryArticulo: (itemId: string) => void;
  removeEquipo: (equipmentId: string) => void;
  findInventoryByNombre: (name: string) => InventoryItem | undefined;
  findEquipmentByNombre: (name: string) => FarmEquipment | undefined;
};

const FarmContext = createContext<FarmContextValue | null>(null);

function money(value: number): string {
  return `$${Math.round(value).toLocaleString('en-US')}`;
}

function stockEstado(quantity: number, minCantidad: number): StockStatus {
  if (quantity <= 0) {
    return 'Out of Stock';
  }
  if (quantity <= minCantidad) {
    return 'Low Stock';
  }
  return 'Available';
}

function todayCorto(): string {
  return 'Jul 23';
}

function parseMonto(value: string): number {
  const n = Number.parseFloat(value.replace(',', '.').trim());
  return Number.isFinite(n) ? n : 0;
}

function buildInventoryArticulo(draft: InventoryItemDraft): InventoryItem {
  const quantity = Math.max(0, parseMonto(draft.quantity));
  const minCantidad = Math.max(0, parseMonto(draft.minQty));
  const unitCosto = Math.max(0, parseMonto(draft.unitCosto));
  const unit = draft.unit.trim() || 'units';
  const status = stockEstado(quantity, minCantidad);

  return {
    id: `inv-${Date.now()}`,
    name: draft.name.trim(),
    category: draft.category.trim() || 'Other',
    status,
    quantity,
    quantityEtiqueta: `${quantity} ${unit}`,
    minCantidad,
    minEtiqueta: `min ${minCantidad} ${unit}`,
    unit,
    unitCosto,
    unitCostEtiqueta: `${money(unitCosto)}/${unit.replace(/s$/, '')}`,
    priceEtiqueta: `${money(unitCosto)}/${unit.replace(/s$/, '')}`,
    totalValueEtiqueta: money(quantity * unitCosto),
    supplier: draft.supplier.trim() || '—',
    purchaseFecha: 'Jul 23, 2026',
    progress: Math.min(1, quantity / Math.max(minCantidad * 2.5, 1)),
    alert:
      status === 'Available'
        ? undefined
        : `${draft.name.trim()} is ${status === 'Out of Stock' ? 'out of stock' : 'below minimum'}`,
    movements: [
      {
        id: `mv-${Date.now()}`,
        title: 'Stock Added',
        date: todayCorto(),
        amountEtiqueta: `+${quantity} ${unit}`,
        kind: 'in',
      },
      {
        id: `bal-${Date.now()}`,
        title: 'Current Balance',
        date: '',
        amountEtiqueta: `${quantity} ${unit}`,
        kind: 'balance',
      },
    ],
  };
}

function buildIncomeTransaccion(draft: IncomeDraft): FarmTransaction {
  const amount = Math.max(0, parseMonto(draft.amount));
  const category = draft.category.trim() || 'Other';
  const field = draft.field.trim();
  const date = draft.date.trim() || todayCorto();
  const parts = [category, field || null, date].filter(Boolean);

  return {
    id: `tx-${Date.now()}`,
    title: draft.title.trim(),
    subtitle: parts.join(' · '),
    amountEtiqueta: `+$${Math.round(amount).toLocaleString('en-US')}`,
    kind: 'income',
    icon: '💰',
  };
}

function withCantidad(item: InventoryItem, quantity: number): InventoryItem {
  const nextQty = Math.max(0, quantity);
  const status = stockEstado(nextQty, item.minCantidad);
  return {
    ...item,
    quantity: nextQty,
    quantityEtiqueta: `${nextQty} ${item.unit}`,
    status,
    totalValueEtiqueta: money(nextQty * item.unitCosto),
    progress: Math.min(1, nextQty / Math.max(item.minCantidad * 2.5, 1)),
    alert:
      status === 'Available'
        ? undefined
        : item.alert ??
          `${item.name} is ${status === 'Out of Stock' ? 'out of stock' : 'below minimum'}`,
  };
}

function withHoras(item: FarmEquipment, hours: number): FarmEquipment {
  const nextHoras = Math.max(0, Math.round(hours));
  const prevRemaining = item.hoursToServicio ?? item.serviceIntervalHrs;
  const delta = nextHoras - item.hours;
  const hoursToServicio = Math.max(0, prevRemaining - Math.max(0, delta));
  const serviceProgreso = Math.min(
    1,
    1 - hoursToServicio / Math.max(item.serviceIntervalHrs, 1),
  );

  return {
    ...item,
    hours: nextHoras,
    hoursEtiqueta: `${nextHoras.toLocaleString('en-US')} hrs`,
    hoursToServicio,
    serviceProgreso,
    serviceAlerta:
      hoursToServicio <= 10
        ? `Service due in ${hoursToServicio} hrs`
        : undefined,
  };
}

function prependMovimiento(
  item: InventoryItem,
  movement: StockMovement,
): InventoryItem {
  const withoutSaldo = item.movements.filter(m => m.kind !== 'balance');
  const balance: StockMovement = {
    id: `bal-${Date.now()}`,
    title: 'Current Balance',
    date: '',
    amountEtiqueta: `${item.quantity} ${item.unit}`,
    kind: 'balance',
  };
  return {
    ...item,
    movements: [movement, ...withoutSaldo, balance],
  };
}

export function FarmProvider({children}: {children: React.ReactNode}) {
  const [userInventario, setUserInventario] = usePersistedState<
    InventoryItem[] | null
  >(storageClaves.inventory, null);
  const [userEquipo, setUserEquipo] = usePersistedState<
    FarmEquipment[] | null
  >(storageClaves.equipment, null);
  const [userTransacciones, setUserTransacciones] = usePersistedState<
    FarmTransaction[] | null
  >(storageClaves.transactions, null);

  const isInventoryMuestra = userInventario === null;
  const isEquipmentMuestra = userEquipo === null;
  const isTransactionsMuestra = userTransacciones === null;
  const inventory = userInventario ?? INVENTORY_ITEMS;
  const equipment = userEquipo ?? EQUIPMENT;
  const transactions = userTransacciones ?? TRANSACTIONS;

  const getInventoryArticulo = useCallback(
    (id: string) => inventory.find(item => item.id === id),
    [inventory],
  );

  const getEquipmentArticulo = useCallback(
    (id: string) => equipment.find(item => item.id === id),
    [equipment],
  );

  const addInventoryArticulo = useCallback((draft: InventoryItemDraft) => {
    const item = buildInventoryArticulo(draft);
    setUserInventario(prev => (prev ? [item, ...prev] : [item]));
    return item;
  }, []);

  const addIngreso = useCallback((draft: IncomeDraft) => {
    const tx = buildIncomeTransaccion(draft);
    setUserTransacciones(prev => (prev ? [tx, ...prev] : [tx]));
    return tx;
  }, [setUserTransacciones]);

  const addGasto = useCallback(
    (draft: ExpenseDraft) => {
      const amount = Math.max(0, parseMonto(draft.amount));
      const tx: FarmTransaction = {
        id: `tx-${Date.now()}`,
        title: draft.title.trim(),
        subtitle: draft.subtitle.trim() || todayCorto(),
        amountEtiqueta: `−$${Math.round(amount).toLocaleString('en-US')}`,
        kind: 'expense',
        icon: draft.icon ?? '🧾',
      };
      setUserTransacciones(prev => (prev ? [tx, ...prev] : [tx]));
      return tx;
    },
    [setUserTransacciones],
  );

  const findInventoryByNombre = useCallback(
    (name: string) => {
      const needle = name.trim().toLowerCase();
      if (!needle) {
        return undefined;
      }
      return inventory.find(
        item =>
          item.name.toLowerCase().includes(needle) ||
          needle.includes(item.name.toLowerCase()),
      );
    },
    [inventory],
  );

  const findEquipmentByNombre = useCallback(
    (name: string) => {
      const needle = name.trim().toLowerCase();
      if (!needle) {
        return undefined;
      }
      return equipment.find(
        item =>
          item.name.toLowerCase().includes(needle) ||
          needle.includes(item.name.toLowerCase()),
      );
    },
    [equipment],
  );

  const mutateInventario = useCallback(
    (updater: (items: InventoryItem[]) => InventoryItem[]) => {
      setUserInventario(prev => updater(prev ?? INVENTORY_ITEMS));
    },
    [],
  );

  const mutateEquipo = useCallback(
    (updater: (items: FarmEquipment[]) => FarmEquipment[]) => {
      setUserEquipo(prev => updater(prev ?? EQUIPMENT));
    },
    [],
  );

  const addExistencias = useCallback(
    (itemId: string, amount: number) => {
      if (amount <= 0) {
        return;
      }
      mutateInventario(items =>
        items.map(item => {
          if (item.id !== itemId) {
            return item;
          }
          const updated = withCantidad(item, item.quantity + amount);
          return prependMovimiento(updated, {
            id: `mv-${Date.now()}`,
            title: 'Stock Added',
            date: todayCorto(),
            amountEtiqueta: `+${amount} ${item.unit}`,
            kind: 'in',
          });
        }),
      );
    },
    [mutateInventario],
  );

  const useExistencias = useCallback(
    (itemId: string, amount: number) => {
      if (amount <= 0) {
        return false;
      }
      let applied = false;
      mutateInventario(items => {
        const current = items.find(item => item.id === itemId);
        if (!current || amount > current.quantity) {
          return items;
        }
        applied = true;
        return items.map(item => {
          if (item.id !== itemId) {
            return item;
          }
          const updated = withCantidad(item, item.quantity - amount);
          return prependMovimiento(updated, {
            id: `mv-${Date.now()}`,
            title: 'Stock Used',
            date: todayCorto(),
            amountEtiqueta: `−${amount} ${item.unit}`,
            kind: 'out',
          });
        });
      });
      return applied;
    },
    [mutateInventario],
  );

  const addOpHoras = useCallback(
    (equipmentId: string, hours: number) => {
      if (hours <= 0) {
        return;
      }
      mutateEquipo(items =>
        items.map(item =>
          item.id === equipmentId ? withHoras(item, item.hours + hours) : item,
        ),
      );
    },
    [mutateEquipo],
  );

  const cycleEquipmentEstado = useCallback(
    (equipmentId: string) => {
      const order: EquipmentStatus[] = ['Available', 'In Use', 'Service'];
      let nextEstado: EquipmentStatus = 'Available';
      mutateEquipo(items =>
        items.map(item => {
          if (item.id !== equipmentId) {
            return item;
          }
          const index = order.indexOf(item.status);
          nextEstado = order[(index + 1) % order.length] ?? 'Available';
          return {...item, status: nextEstado};
        }),
      );
      return nextEstado;
    },
    [mutateEquipo],
  );

  const addEquipo = useCallback(() => {
    const item: FarmEquipment = {
      id: `eq-${Date.now()}`,
      name: 'New Machine',
      type: 'Equipment',
      modelAnio: 'Model 2026',
      icon: '🚜',
      status: 'Available',
      hours: 0,
      hoursEtiqueta: '0 hrs',
      serviceIntervalHrs: 250,
      hoursToServicio: 250,
      fuelTipo: 'Diesel',
      maintCostEtiqueta: '$0',
      serviceProgreso: 0,
    };
    setUserEquipo(prev => (prev ? [item, ...prev] : [item]));
    return item;
  }, []);

  const removeInventoryArticulo = useCallback((itemId: string) => {
    setUserInventario(prev => {
      const base = prev ?? INVENTORY_ITEMS;
      return base.filter(item => item.id !== itemId);
    });
  }, []);

  const removeEquipo = useCallback((equipmentId: string) => {
    setUserEquipo(prev => {
      const base = prev ?? EQUIPMENT;
      return base.filter(item => item.id !== equipmentId);
    });
  }, [setUserEquipo]);

  const addMantenimiento = useCallback(
    (equipmentId: string, draft: MaintenanceDraft) => {
      const hours = Math.max(0, Math.round(parseMonto(draft.hours)));
      const nextHoras = Math.max(0, Math.round(parseMonto(draft.nextHoras)));
      const cost = Math.max(0, parseMonto(draft.cost));

      mutateEquipo(items =>
        items.map(item => {
          if (item.id !== equipmentId) {
            return item;
          }
          const currentMaint = parseMonto(
            item.maintCostEtiqueta.replace(/[$,]/g, ''),
          );
          const hoursToServicio =
            nextHoras > hours
              ? nextHoras - hours
              : item.serviceIntervalHrs;
          return {
            ...item,
            hours: hours || item.hours,
            hoursEtiqueta: `${(hours || item.hours).toLocaleString('en-US')} hrs`,
            hoursToServicio,
            serviceProgreso: Math.min(
              1,
              1 - hoursToServicio / Math.max(item.serviceIntervalHrs, 1),
            ),
            serviceAlerta: undefined,
            status: 'Available' as EquipmentStatus,
            maintCostEtiqueta: money(currentMaint + cost),
          };
        }),
      );

      if (cost > 0) {
        const typeEtiqueta = draft.type.trim() || 'Maintenance';
        const provider = draft.provider.trim();
        addGasto({
          title: typeEtiqueta,
          amount: String(cost),
          subtitle: [provider || null, draft.date.trim() || todayCorto()]
            .filter(Boolean)
            .join(' · '),
          icon: '🔧',
        });
      }
    },
    [addGasto, mutateEquipo],
  );

  const value = useMemo(
    () => ({
      inventory,
      equipment,
      transactions,
      isInventoryMuestra,
      isEquipmentMuestra,
      isTransactionsMuestra,
      getInventoryArticulo,
      getEquipo: getEquipmentArticulo,
      addInventoryArticulo,
      addIngreso,
      addGasto,
      addExistencias,
      useExistencias,
      addOpHoras,
      cycleEquipmentEstado,
      addEquipo,
      addMantenimiento,
      removeInventoryArticulo,
      removeEquipo,
      findInventoryByNombre,
      findEquipmentByNombre,
    }),
    [
      inventory,
      equipment,
      transactions,
      isInventoryMuestra,
      isEquipmentMuestra,
      isTransactionsMuestra,
      getInventoryArticulo,
      getEquipmentArticulo,
      addInventoryArticulo,
      addIngreso,
      addGasto,
      addExistencias,
      useExistencias,
      addOpHoras,
      cycleEquipmentEstado,
      addEquipo,
      addMantenimiento,
      removeInventoryArticulo,
      removeEquipo,
      findInventoryByNombre,
      findEquipmentByNombre,
    ],
  );

  return <FarmContext.Provider value={value}>{children}</FarmContext.Provider>;
}

export function useGranja() {
  const context = useContext(FarmContext);
  if (!context) {
    throw new Error('useGranja must be used within FarmProvider');
  }
  return context;
}
