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
import {storageKeys} from './storage';

export type InventoryItemDraft = {
  name: string;
  category: string;
  quantity: string;
  unit: string;
  minQty: string;
  unitCost: string;
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
  nextHours: string;
};

type FarmContextValue = {
  inventory: InventoryItem[];
  equipment: FarmEquipment[];
  transactions: FarmTransaction[];
  isInventoryDemo: boolean;
  isEquipmentDemo: boolean;
  isTransactionsDemo: boolean;
  getInventoryItem: (id: string) => InventoryItem | undefined;
  getEquipment: (id: string) => FarmEquipment | undefined;
  addInventoryItem: (draft: InventoryItemDraft) => InventoryItem;
  addIncome: (draft: IncomeDraft) => FarmTransaction;
  addExpense: (draft: ExpenseDraft) => FarmTransaction;
  addStock: (itemId: string, amount: number) => void;
  useStock: (itemId: string, amount: number) => boolean;
  addOpHours: (equipmentId: string, hours: number) => void;
  cycleEquipmentStatus: (equipmentId: string) => EquipmentStatus;
  addEquipment: () => FarmEquipment;
  addMaintenance: (
    equipmentId: string,
    draft: MaintenanceDraft,
  ) => void;
  removeInventoryItem: (itemId: string) => void;
  removeEquipment: (equipmentId: string) => void;
  findInventoryByName: (name: string) => InventoryItem | undefined;
  findEquipmentByName: (name: string) => FarmEquipment | undefined;
};

const FarmContext = createContext<FarmContextValue | null>(null);

function money(value: number): string {
  return `$${Math.round(value).toLocaleString('en-US')}`;
}

function stockStatus(quantity: number, minQuantity: number): StockStatus {
  if (quantity <= 0) {
    return 'Out of Stock';
  }
  if (quantity <= minQuantity) {
    return 'Low Stock';
  }
  return 'Available';
}

function todayShort(): string {
  return 'Jul 23';
}

function parseAmount(value: string): number {
  const n = Number.parseFloat(value.replace(',', '.').trim());
  return Number.isFinite(n) ? n : 0;
}

function buildInventoryItem(draft: InventoryItemDraft): InventoryItem {
  const quantity = Math.max(0, parseAmount(draft.quantity));
  const minQuantity = Math.max(0, parseAmount(draft.minQty));
  const unitCost = Math.max(0, parseAmount(draft.unitCost));
  const unit = draft.unit.trim() || 'units';
  const status = stockStatus(quantity, minQuantity);

  return {
    id: `inv-${Date.now()}`,
    name: draft.name.trim(),
    category: draft.category.trim() || 'Other',
    status,
    quantity,
    quantityLabel: `${quantity} ${unit}`,
    minQuantity,
    minLabel: `min ${minQuantity} ${unit}`,
    unit,
    unitCost,
    unitCostLabel: `${money(unitCost)}/${unit.replace(/s$/, '')}`,
    priceLabel: `${money(unitCost)}/${unit.replace(/s$/, '')}`,
    totalValueLabel: money(quantity * unitCost),
    supplier: draft.supplier.trim() || '—',
    purchaseDate: 'Jul 23, 2026',
    progress: Math.min(1, quantity / Math.max(minQuantity * 2.5, 1)),
    alert:
      status === 'Available'
        ? undefined
        : `${draft.name.trim()} is ${status === 'Out of Stock' ? 'out of stock' : 'below minimum'}`,
    movements: [
      {
        id: `mv-${Date.now()}`,
        title: 'Stock Added',
        date: todayShort(),
        amountLabel: `+${quantity} ${unit}`,
        kind: 'in',
      },
      {
        id: `bal-${Date.now()}`,
        title: 'Current Balance',
        date: '',
        amountLabel: `${quantity} ${unit}`,
        kind: 'balance',
      },
    ],
  };
}

function buildIncomeTransaction(draft: IncomeDraft): FarmTransaction {
  const amount = Math.max(0, parseAmount(draft.amount));
  const category = draft.category.trim() || 'Other';
  const field = draft.field.trim();
  const date = draft.date.trim() || todayShort();
  const parts = [category, field || null, date].filter(Boolean);

  return {
    id: `tx-${Date.now()}`,
    title: draft.title.trim(),
    subtitle: parts.join(' · '),
    amountLabel: `+$${Math.round(amount).toLocaleString('en-US')}`,
    kind: 'income',
    icon: '💰',
  };
}

function withQuantity(item: InventoryItem, quantity: number): InventoryItem {
  const nextQty = Math.max(0, quantity);
  const status = stockStatus(nextQty, item.minQuantity);
  return {
    ...item,
    quantity: nextQty,
    quantityLabel: `${nextQty} ${item.unit}`,
    status,
    totalValueLabel: money(nextQty * item.unitCost),
    progress: Math.min(1, nextQty / Math.max(item.minQuantity * 2.5, 1)),
    alert:
      status === 'Available'
        ? undefined
        : item.alert ??
          `${item.name} is ${status === 'Out of Stock' ? 'out of stock' : 'below minimum'}`,
  };
}

function withHours(item: FarmEquipment, hours: number): FarmEquipment {
  const nextHours = Math.max(0, Math.round(hours));
  const prevRemaining = item.hoursToService ?? item.serviceIntervalHrs;
  const delta = nextHours - item.hours;
  const hoursToService = Math.max(0, prevRemaining - Math.max(0, delta));
  const serviceProgress = Math.min(
    1,
    1 - hoursToService / Math.max(item.serviceIntervalHrs, 1),
  );

  return {
    ...item,
    hours: nextHours,
    hoursLabel: `${nextHours.toLocaleString('en-US')} hrs`,
    hoursToService,
    serviceProgress,
    serviceAlert:
      hoursToService <= 10
        ? `Service due in ${hoursToService} hrs`
        : undefined,
  };
}

function prependMovement(
  item: InventoryItem,
  movement: StockMovement,
): InventoryItem {
  const withoutBalance = item.movements.filter(m => m.kind !== 'balance');
  const balance: StockMovement = {
    id: `bal-${Date.now()}`,
    title: 'Current Balance',
    date: '',
    amountLabel: `${item.quantity} ${item.unit}`,
    kind: 'balance',
  };
  return {
    ...item,
    movements: [movement, ...withoutBalance, balance],
  };
}

export function FarmProvider({children}: {children: React.ReactNode}) {
  const [userInventory, setUserInventory] = usePersistedState<
    InventoryItem[] | null
  >(storageKeys.inventory, null);
  const [userEquipment, setUserEquipment] = usePersistedState<
    FarmEquipment[] | null
  >(storageKeys.equipment, null);
  const [userTransactions, setUserTransactions] = usePersistedState<
    FarmTransaction[] | null
  >(storageKeys.transactions, null);

  const isInventoryDemo = userInventory === null;
  const isEquipmentDemo = userEquipment === null;
  const isTransactionsDemo = userTransactions === null;
  const inventory = userInventory ?? INVENTORY_ITEMS;
  const equipment = userEquipment ?? EQUIPMENT;
  const transactions = userTransactions ?? TRANSACTIONS;

  const getInventoryItem = useCallback(
    (id: string) => inventory.find(item => item.id === id),
    [inventory],
  );

  const getEquipmentItem = useCallback(
    (id: string) => equipment.find(item => item.id === id),
    [equipment],
  );

  const addInventoryItem = useCallback((draft: InventoryItemDraft) => {
    const item = buildInventoryItem(draft);
    setUserInventory(prev => (prev ? [item, ...prev] : [item]));
    return item;
  }, []);

  const addIncome = useCallback((draft: IncomeDraft) => {
    const tx = buildIncomeTransaction(draft);
    setUserTransactions(prev => (prev ? [tx, ...prev] : [tx]));
    return tx;
  }, [setUserTransactions]);

  const addExpense = useCallback(
    (draft: ExpenseDraft) => {
      const amount = Math.max(0, parseAmount(draft.amount));
      const tx: FarmTransaction = {
        id: `tx-${Date.now()}`,
        title: draft.title.trim(),
        subtitle: draft.subtitle.trim() || todayShort(),
        amountLabel: `−$${Math.round(amount).toLocaleString('en-US')}`,
        kind: 'expense',
        icon: draft.icon ?? '🧾',
      };
      setUserTransactions(prev => (prev ? [tx, ...prev] : [tx]));
      return tx;
    },
    [setUserTransactions],
  );

  const findInventoryByName = useCallback(
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

  const findEquipmentByName = useCallback(
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

  const mutateInventory = useCallback(
    (updater: (items: InventoryItem[]) => InventoryItem[]) => {
      setUserInventory(prev => updater(prev ?? INVENTORY_ITEMS));
    },
    [],
  );

  const mutateEquipment = useCallback(
    (updater: (items: FarmEquipment[]) => FarmEquipment[]) => {
      setUserEquipment(prev => updater(prev ?? EQUIPMENT));
    },
    [],
  );

  const addStock = useCallback(
    (itemId: string, amount: number) => {
      if (amount <= 0) {
        return;
      }
      mutateInventory(items =>
        items.map(item => {
          if (item.id !== itemId) {
            return item;
          }
          const updated = withQuantity(item, item.quantity + amount);
          return prependMovement(updated, {
            id: `mv-${Date.now()}`,
            title: 'Stock Added',
            date: todayShort(),
            amountLabel: `+${amount} ${item.unit}`,
            kind: 'in',
          });
        }),
      );
    },
    [mutateInventory],
  );

  const useStock = useCallback(
    (itemId: string, amount: number) => {
      if (amount <= 0) {
        return false;
      }
      let applied = false;
      mutateInventory(items => {
        const current = items.find(item => item.id === itemId);
        if (!current || amount > current.quantity) {
          return items;
        }
        applied = true;
        return items.map(item => {
          if (item.id !== itemId) {
            return item;
          }
          const updated = withQuantity(item, item.quantity - amount);
          return prependMovement(updated, {
            id: `mv-${Date.now()}`,
            title: 'Stock Used',
            date: todayShort(),
            amountLabel: `−${amount} ${item.unit}`,
            kind: 'out',
          });
        });
      });
      return applied;
    },
    [mutateInventory],
  );

  const addOpHours = useCallback(
    (equipmentId: string, hours: number) => {
      if (hours <= 0) {
        return;
      }
      mutateEquipment(items =>
        items.map(item =>
          item.id === equipmentId ? withHours(item, item.hours + hours) : item,
        ),
      );
    },
    [mutateEquipment],
  );

  const cycleEquipmentStatus = useCallback(
    (equipmentId: string) => {
      const order: EquipmentStatus[] = ['Available', 'In Use', 'Service'];
      let nextStatus: EquipmentStatus = 'Available';
      mutateEquipment(items =>
        items.map(item => {
          if (item.id !== equipmentId) {
            return item;
          }
          const index = order.indexOf(item.status);
          nextStatus = order[(index + 1) % order.length] ?? 'Available';
          return {...item, status: nextStatus};
        }),
      );
      return nextStatus;
    },
    [mutateEquipment],
  );

  const addEquipment = useCallback(() => {
    const item: FarmEquipment = {
      id: `eq-${Date.now()}`,
      name: 'New Machine',
      type: 'Equipment',
      modelYear: 'Model 2026',
      icon: '🚜',
      status: 'Available',
      hours: 0,
      hoursLabel: '0 hrs',
      serviceIntervalHrs: 250,
      hoursToService: 250,
      fuelType: 'Diesel',
      maintCostLabel: '$0',
      serviceProgress: 0,
    };
    setUserEquipment(prev => (prev ? [item, ...prev] : [item]));
    return item;
  }, []);

  const removeInventoryItem = useCallback((itemId: string) => {
    setUserInventory(prev => {
      const base = prev ?? INVENTORY_ITEMS;
      return base.filter(item => item.id !== itemId);
    });
  }, []);

  const removeEquipment = useCallback((equipmentId: string) => {
    setUserEquipment(prev => {
      const base = prev ?? EQUIPMENT;
      return base.filter(item => item.id !== equipmentId);
    });
  }, [setUserEquipment]);

  const addMaintenance = useCallback(
    (equipmentId: string, draft: MaintenanceDraft) => {
      const hours = Math.max(0, Math.round(parseAmount(draft.hours)));
      const nextHours = Math.max(0, Math.round(parseAmount(draft.nextHours)));
      const cost = Math.max(0, parseAmount(draft.cost));

      mutateEquipment(items =>
        items.map(item => {
          if (item.id !== equipmentId) {
            return item;
          }
          const currentMaint = parseAmount(
            item.maintCostLabel.replace(/[$,]/g, ''),
          );
          const hoursToService =
            nextHours > hours
              ? nextHours - hours
              : item.serviceIntervalHrs;
          return {
            ...item,
            hours: hours || item.hours,
            hoursLabel: `${(hours || item.hours).toLocaleString('en-US')} hrs`,
            hoursToService,
            serviceProgress: Math.min(
              1,
              1 - hoursToService / Math.max(item.serviceIntervalHrs, 1),
            ),
            serviceAlert: undefined,
            status: 'Available' as EquipmentStatus,
            maintCostLabel: money(currentMaint + cost),
          };
        }),
      );

      if (cost > 0) {
        const typeLabel = draft.type.trim() || 'Maintenance';
        const provider = draft.provider.trim();
        addExpense({
          title: typeLabel,
          amount: String(cost),
          subtitle: [provider || null, draft.date.trim() || todayShort()]
            .filter(Boolean)
            .join(' · '),
          icon: '🔧',
        });
      }
    },
    [addExpense, mutateEquipment],
  );

  const value = useMemo(
    () => ({
      inventory,
      equipment,
      transactions,
      isInventoryDemo,
      isEquipmentDemo,
      isTransactionsDemo,
      getInventoryItem,
      getEquipment: getEquipmentItem,
      addInventoryItem,
      addIncome,
      addExpense,
      addStock,
      useStock,
      addOpHours,
      cycleEquipmentStatus,
      addEquipment,
      addMaintenance,
      removeInventoryItem,
      removeEquipment,
      findInventoryByName,
      findEquipmentByName,
    }),
    [
      inventory,
      equipment,
      transactions,
      isInventoryDemo,
      isEquipmentDemo,
      isTransactionsDemo,
      getInventoryItem,
      getEquipmentItem,
      addInventoryItem,
      addIncome,
      addExpense,
      addStock,
      useStock,
      addOpHours,
      cycleEquipmentStatus,
      addEquipment,
      addMaintenance,
      removeInventoryItem,
      removeEquipment,
      findInventoryByName,
      findEquipmentByName,
    ],
  );

  return <FarmContext.Provider value={value}>{children}</FarmContext.Provider>;
}

export function useFarm() {
  const context = useContext(FarmContext);
  if (!context) {
    throw new Error('useFarm must be used within FarmProvider');
  }
  return context;
}
