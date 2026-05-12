import * as Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Alert, Platform } from "react-native";
import { auth } from "../../../../config/FirebaseConfig";

const TOKEN_KEY = "expo_push_token";
const BASE_URL = "https://ideapilot-api-dev.onrender.com";

async function requestNotificationPermission(): Promise<string | undefined> {
  try {
    const { status } = await Notifications.getPermissionsAsync();
    if (status === "granted") return "granted";
    else if (status === "denied") return "denied";
    else {
      const { status: newStatus } =
        await Notifications.requestPermissionsAsync();
      if (newStatus !== "granted") {
        Alert.alert(
          "Permissions required",
          "We need notification permissions to send reminders.",
        );
        return newStatus;
      }
    }
  } catch (error) {
    console.error("Failed to check notification permissions.", error);
    return;
  }
}
async function getPushToken(): Promise<string | void> {
  if (!Device.isDevice) {
    console.warn("Push tokens are only available on physical devices.");
    return;
  }

  const expoConfig =
    (Constants as any).default?.expoConfig || (Constants as any).expoConfig;
  const projectId =
    expoConfig?.extra?.eas?.projectId ??
    (Constants as any).easConfig?.projectId;

  if (!projectId) {
    console.error(
      "EAS Project ID not found. Check extra.eas.projectId in app.config.js",
    );
    return;
  }

  try {
    const tokenData = await Notifications.getExpoPushTokenAsync({
      projectId,
    });

    return tokenData.data;
  } catch (error) {
    console.error("Error fetching Expo Push Token:", error);
    return;
  }
}

async function syncPushToken(
  push_token: string,
  enabled: boolean,
): Promise<void> {
  try {
    const user = auth.currentUser;
    if (!user) return;

    const idToken = await user.getIdToken();
    const response = await fetch(
      `${BASE_URL}/api/users/push-token`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${idToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: push_token,
          platform: Platform.OS,
          provider: "expo",
          enabled,
        }),
      },
    );

    if (!response.ok) {
      throw new Error("Failed to sync changes to backend.");
    }

    console.log(`Push token: ${enabled ? "Enabled" : "Disabled"}`);
  } catch (error) {
    console.error("Push token sync failed.", error);
  }
}

export {
  getPushToken,
  requestNotificationPermission,
  syncPushToken,
  TOKEN_KEY,
};
