import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface NotificationState {
  pushEnabled: boolean;
  setEnabled: (value: boolean) => void;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set) => ({
      pushEnabled: false,
      setEnabled: (value) => set({ pushEnabled: value }),
    }),
    {
      name: "notification_storage",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
