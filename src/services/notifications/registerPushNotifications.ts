import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import Constants from "expo-constants";
import { Platform } from "react-native";

export default async function registerPushNotifications() {
  //Check for physical device
  if (!Device.isDevice) throw new Error("Must be a physical mobile device");

  //Permission check
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== "granted") {
    throw new Error("Permission denied");
  }

  //Generate Expo Push Token
  const project_id: Notifications.ExpoPushTokenOptions | undefined =
    Constants.expoConfig?.extra?.eas?.projectId ??
    Constants.easConfig?.projectId;

  const token = (await Notifications.getExpoPushTokenAsync(project_id)).data;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
    });
  }
  return token;
}
