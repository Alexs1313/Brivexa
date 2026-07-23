import AsyncStorage from '@react-native-async-storage/async-storage';

export const storageKeys = {
  tasks: '@brivexa/userTasks',
  fields: '@brivexa/userFields',
  inventory: '@brivexa/userInventory',
  equipment: '@brivexa/userEquipment',
  transactions: '@brivexa/userTransactions',
  savedCalculations: '@brivexa/savedCalculations',
} as const;

export type StorageKey = (typeof storageKeys)[keyof typeof storageKeys];

export async function loadJson<T>(key: StorageKey): Promise<T | undefined> {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (raw == null) {
      return undefined;
    }
    return JSON.parse(raw) as T;
  } catch {
    return undefined;
  }
}

export async function saveJson<T>(key: StorageKey, value: T): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore write failures — UI state stays in memory.
  }
}

export async function removeKey(key: StorageKey): Promise<void> {
  try {
    await AsyncStorage.removeItem(key);
  } catch {
    // Ignore.
  }
}
