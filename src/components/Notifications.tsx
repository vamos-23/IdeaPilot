import { Bell } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import { StyleSheet, Switch, Text, View } from "react-native";
import { sc, vs } from "../constants/responsive";
import useNotificationStore from "../store/useNotificationStore";
import useThemeStore from "../store/useThemeStore";

export default function Notifications() {
  const { theme } = useThemeStore();
  const { colorScheme } = useColorScheme();
  const { pushEnabled, emailEnabled, togglePush, toggleEmail } =
    useNotificationStore();
  return (
    <View
      className="border-[#D8DCE3] dark:border-[#333537] bg-[#EEF1F6] dark:bg-[#121720]"
      style={styles.notification}
    >
      <View className="mb-7">
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

      <View className="gap-y-6">
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
            trackColor={{ false: "#767577", true: "#4169e1" }}
            thumbColor={colorScheme === "light" ? "#f5dd4b" : "#f4f3f4"}
            style={{ transform: [{ scaleX: 1.3 }, { scaleY: 1.3 }] }}
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
            trackColor={{ false: "#767577", true: "#4169e1" }}
            thumbColor={colorScheme === "light" ? "#f5dd4b" : "#f4f3f4"}
            style={{ transform: [{ scaleX: 1.3 }, { scaleY: 1.3 }] }}
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
    flexGrow: 1,
    width: "100%",
    borderWidth: sc(1),
    borderRadius: sc(17),
    padding: sc(20),
    marginBottom: vs(28),
  },
  heading: {
    fontSize: sc(23),
  },
});
