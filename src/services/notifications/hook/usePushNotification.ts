import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Linking from "expo-linking";
import { Alert } from "react-native";
import { useNotificationStore } from "../../../store/useNotificationStore";
import {
  TOKEN_KEY,
  getPushToken,
  requestNotificationPermission,
  syncPushToken,
} from "../push/pushServices";

const UI_TEST_MODE = true;

export function usePushNotifications() {
  const { pushEnabled, setEnabled } = useNotificationStore();

  async function enablePush() {
    const permission = await requestNotificationPermission();
    if (permission === "denied") {
      Alert.alert(
        "Enable Notifications",
        "Notifications are disabled.\nPlease enable them in Settings.",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Open Settings",
            style: "default",
            onPress: () => {
              Linking.openSettings();
            },
          },
        ],
      );
      return;
    }

    if (permission !== "granted") return;

    if (UI_TEST_MODE) {
      console.log("UI TEST: Simulating token sync (enable) from enable push");
      setEnabled(true);
      return;
    }
    try {
      const freshToken = await getPushToken();
      if (!freshToken) return;

      const storedToken = await AsyncStorage.getItem(TOKEN_KEY);

      if (storedToken === freshToken || pushEnabled) return;

      await syncPushToken(freshToken, true);
      await AsyncStorage.setItem(TOKEN_KEY, freshToken);
      setEnabled(true);
      console.log("Push enabled for notifications.");
    } catch (error) {
      console.error("Enable push failed.", error);
      Alert.alert(
        "Cannot enable push notifications",
        "There was a problem.\nPlease try again later.",
      );
    }
  }

  async function disablePush() {
    if (UI_TEST_MODE) {
      console.log("UI TEST: Simulating token sync (disable) from disable push");
      setEnabled(false);
      return;
    }
    try {
      const storedToken = await AsyncStorage.getItem(TOKEN_KEY);

      if (!storedToken) return;

      await syncPushToken(storedToken, false);
      setEnabled(false);
      console.log("Push disabled for notifications.");
    } catch (error) {
      console.error("Push token disable failed.", error);
      Alert.alert(
        "Couldn't disable notifications",
        "There was a problem.\nPlease try again later.",
      );
    }
  }

  return {
    enablePush,
    disablePush,
  };
}
