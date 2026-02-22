import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { useEffect, useRef } from "react";
import { AppState, AppStateStatus } from "react-native";
import { useNotificationStore } from "../../../store/useNotificationStore";
import { TOKEN_KEY, getPushToken, syncPushToken } from "../push/pushServices";
import configurePushChannel from "./useConfigurePushChannel";

const UI_TEST_MODE = true;

export default function usePermissionListener() {
  const { pushEnabled, setEnabled } = useNotificationStore();
  const appState = useRef<AppStateStatus>(AppState.currentState);
  const pushEnabledRef = useRef<boolean>(pushEnabled);

  useEffect(() => {
    pushEnabledRef.current = pushEnabled;
  }, [pushEnabled]);

  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      async (nextState) => {
        const previousState = appState.current;

        if (
          previousState.match(/inactive|background/) &&
          nextState === "active"
        ) {
          console.log("Background -> active");
          const { status } = await Notifications.getPermissionsAsync();
          const storedToken = await AsyncStorage.getItem(TOKEN_KEY);

          //Permissions revoked from settings at OS level but app's pushEnabled is set to true
          if (status !== "granted" && pushEnabledRef.current) {
            if (UI_TEST_MODE) {
              console.log(
                "UI TEST: Simulating token sync (disable) from appstate",
              );
              setEnabled(false);
              return;
            }
            if (storedToken) await syncPushToken(storedToken, false);
            setEnabled(false);
            return;
          }

          if (status === "granted") {
            await configurePushChannel();
            if (UI_TEST_MODE) {
              console.log(
                "UI TEST: Simulating token sync (enable) from appstate",
              );
              if (!pushEnabledRef.current) return;
              return;
            }

            if (!pushEnabledRef.current) return;

            const currentToken = await getPushToken();
            if (currentToken && currentToken !== storedToken) {
              await syncPushToken(currentToken, pushEnabledRef.current);
              await AsyncStorage.setItem(TOKEN_KEY, currentToken);
            }
          }
        }
        appState.current = nextState;
      },
    );

    return () => subscription.remove();
  }, []);
}
