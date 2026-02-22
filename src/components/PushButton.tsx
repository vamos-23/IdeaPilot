import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import { Alert, Text, TouchableOpacity, View } from "react-native";

export default function PushTestButton() {
  const testPushToken = async () => {
    try {
      const { status } = await Notifications.requestPermissionsAsync();

      if (status !== "granted") {
        Alert.alert("Permission not granted");
        return;
      }

      const tokenResponse = await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig?.extra?.eas?.projectId,
      });

      const token = tokenResponse.data;

      console.log("Expo Push Token:", token);
      Alert.alert("Expo Push Token", token);
    } catch (error) {
      console.error("Push token error:", error);
      Alert.alert("Error", "Failed to get push token.");
    }
  };

  return (
    <View style={{ alignItems: "center", marginTop: 40 }}>
      <TouchableOpacity
        onPress={testPushToken}
        style={{
          backgroundColor: "#007bff",
          paddingVertical: 14,
          paddingHorizontal: 24,
          borderRadius: 10,
        }}
      >
        <Text style={{ color: "white", fontWeight: "bold" }}>
          Generate Push Token
        </Text>
      </TouchableOpacity>
    </View>
  );
}
