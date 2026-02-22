import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

export default async function configurePushChannel() {
  if (Platform.OS !== "android") return;
  try {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
      showBadge: true,
      enableVibrate: true,
    });
    console.log("Ran configuration successfully.");
  } catch (error) {
    console.error("Failed to configure push notification channel.", error);
  }
}
