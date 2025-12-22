import AsyncStorage from "@react-native-async-storage/async-storage";
import { StateStorage } from "zustand/middleware";

export const zustandStorage: StateStorage = {
  setItem: (name, value) => AsyncStorage.setItem(name, value),
  getItem: async (name) => (await AsyncStorage.getItem(name)) ?? null,
  removeItem: (name) => AsyncStorage.removeItem(name),
};
