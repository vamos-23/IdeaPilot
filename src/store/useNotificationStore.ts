import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type Notifications = {
  pushEnabled: boolean;
  emailEnabled: boolean;
  togglePush: () => void;
  toggleEmail: () => void;
};
const useNotificationStore = create<Notifications>()(
  persist(
    (set) => ({
      pushEnabled: false,
      emailEnabled: false,
      togglePush: () => set((state) => ({ pushEnabled: !state.pushEnabled })),
      toggleEmail: () =>
        set((state) => ({ emailEnabled: !state.emailEnabled })),
    }),
    {
      name: "notification-preference",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
export default useNotificationStore;
