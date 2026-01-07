import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type Notifications = {
  pushEnabled: boolean;
  togglePush: () => void;
};
const useNotificationStore = create<Notifications>()(
  persist(
    (set) => ({
      pushEnabled: false,
      togglePush: () => set((state) => ({ pushEnabled: !state.pushEnabled })),
    }),
    {
      name: "notification-preference",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
export default useNotificationStore;
