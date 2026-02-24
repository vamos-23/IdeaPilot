import { auth } from "@/config/FirebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { useEffect } from "react";
import { useNotificationStore } from "../../../store/useNotificationStore";
import { TOKEN_KEY, getPushToken, syncPushToken } from "../push/pushServices";
import configurePushChannel from "./useConfigurePushChannel";

const UI_TEST_MODE = false;

export default function useCheckPushStatus() {
  const { pushEnabled, setEnabled } = useNotificationStore();
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return;

    const checkStateOnBoot = async () => {
      await configurePushChannel();
      
      console.log("Ran checkonBoot");
      const { status } = await Notifications.getPermissionsAsync();
      const storedToken = await AsyncStorage.getItem(TOKEN_KEY);

      if (status !== "granted" && pushEnabled) {
        if (UI_TEST_MODE) {
          console.log("UI TEST: Simulating token sync (disable)");
          setEnabled(false);
          return;
        }
        if (storedToken) await syncPushToken(storedToken, false);
        setEnabled(false);
        return;
      }

      if (status === "granted") {
        if (UI_TEST_MODE) {
          console.log("UI TEST: Simulating token sync (enable)");
          if (!pushEnabled) return;
          return;
        }

        if (!pushEnabled) return;

        const currentToken = await getPushToken();
        if (currentToken && currentToken !== storedToken) {
          await syncPushToken(currentToken, pushEnabled);
          await AsyncStorage.setItem(TOKEN_KEY, currentToken);
        }
      }
    };
    checkStateOnBoot();
  }, [user]);
}
