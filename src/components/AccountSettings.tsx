import { View, Text, StyleSheet } from "react-native";
import { sc, ms, vs } from "./../constants/responsive";
import { useColorScheme } from "nativewind";
import useThemeStore from "../store/useThemeStore";
import { ShieldUser } from "lucide-react-native";
import SubmitButton from "./SubmitButton";
export default function AccountSettings() {
  const { theme } = useThemeStore();

  return (
    <View
      className="border-[#dc2626] dark:border-[#ef4444] bg-[#EEF1F6] dark:bg-[#121720]"
      style={styles.notification}
    >
      <View className="mb-7">
        <View className="gap-2 flex-row items-center">
          <ShieldUser
            stroke={theme === "light" ? "#dc2626" : "#ef4444"}
            size={sc(24)}
          />
          <Text
            className="text-red-600 dark:text-red-500 font-nata-sans-bold"
            style={styles.heading}
          >
            Danger Zone!
          </Text>
        </View>
        <Text
          className="text-textLight dark:text-textDark font-medium"
          style={{ fontSize: sc(11) }}
        >
          Account deletion ahead!
        </Text>
      </View>
      <SubmitButton 
        isDisabled={false} 
        buttonText="Delete Account"
        onSubmit={}
      />
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
