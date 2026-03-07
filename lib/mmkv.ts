import { createMMKV } from "react-native-mmkv";

export const storage = createMMKV({ id: "loctech-query-cache" });

export const mmkvStorageAdapter = {
  getItem: (key: string) => {
    const value = storage.getString(key);
    return value ?? null;
  },
  setItem: (key: string, value: string) => {
    storage.set(key, value);
  },
  removeItem: (key: string) => {
    storage.remove(key);
  },
};
