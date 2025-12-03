import { Bell } from "lucide-react-native";
import { StyleSheet, Switch, Text, View } from "react-native";
import { sc, vs } from "../constants/responsive";
import useThemeStore from "../store/useThemeStore";
import useNotificationStore from "../store/useNotificationStore";

export default function Notifications() {
  const { theme } = useThemeStore();
  const { pushEnabled, emailEnabled, togglePush, toggleEmail} = useNotificationStore();
  return (
    <View
      className="border-slate-600 dark:border-slate-600 bg-[#d8cece] dark:bg-[#121212]"
      style={styles.notification}
    >
      <View className="gap-y-1 mb-5">
        <View className="gap-2 flex-row items-center">
          <Bell stroke={theme === "light" ? "#000" : "#fff"} size={sc(24)} />
          <Text
            className="text-black dark:text-white font-nata-sans-bold"
            style={styles.heading}
          >
            Notifications
          </Text>
        </View>

        <Text
          className="text-textLight dark:text-textDark font-medium"
          style={{ fontSize: sc(11) }}
        >
          Manage how you receive notifications
        </Text>
      </View>

      <View className="gap-y-5">
        <View className="flex-row justify-between items-center">
          <View className="w-[70%]">
            <Text
              className="text-black dark:text-white font-medium"
              style={{ fontSize: sc(13) }}
            >
              Push Notifications
            </Text>
            <Text
              className="text-textLight dark:text-textDark font-medium"
              style={{ fontSize: sc(10.5) }}
            >
              Receive push notifications for updates
            </Text>
          </View>
          <Switch
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={pushEnabled ? "#f5dd4b" : "#f4f3f4"}
            onValueChange={togglePush}
            value={pushEnabled}
          />
        </View>
        <View className="flex-row justify-between items-center">
          <View className="w-[70%]">
            <Text
              className="text-black dark:text-white font-medium"
              style={{ fontSize: sc(13) }}
            >
              Email Notifications
            </Text>
            <Text
              className="text-textLight dark:text-textDark font-medium"
              style={{ fontSize: sc(10.5) }}
            >
              Get weekly project updates via email
            </Text>
          </View>
          <Switch
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={emailEnabled ? "#f5dd4b" : "#f4f3f4"}
            onValueChange={toggleEmail}
            value={emailEnabled}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  notification: {
    height: vs(203),
    width: "100%",
    borderWidth: sc(1),
    borderRadius: sc(17),
    padding: sc(18),
    marginBottom: vs(28),
  },
  heading: {
    fontSize: sc(23),
  },
});
