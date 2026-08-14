import AsyncStorage from '@react-native-async-storage/async-storage';

export const storageClaves = {
  tasks: '@brivexa/userTareas',
  fields: '@brivexa/userCampos',
  inventory: '@brivexa/userInventario',
  equipment: '@brivexa/userEquipo',
  transactions: '@brivexa/userTransacciones',
  savedCalculos: '@brivexa/savedCalculos',
} as const;

export type StorageKey = (typeof storageClaves)[keyof typeof storageClaves];

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

export async function removeClave(key: StorageKey): Promise<void> {
  try {
    await AsyncStorage.removeItem(key);
  } catch {
    // Ignore.
  }
}
