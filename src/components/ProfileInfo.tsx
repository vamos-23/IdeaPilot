import { User2Icon } from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";
import useThemeStore from "../store/useThemeStore";
import useAuthStore from "../store/useAuthStore"; 
import { sc, vs } from "./../constants/responsive";

export default function ProfileInfo() {
  const { theme } = useThemeStore();
  const user = useAuthStore((state) => state.user); 

  return (
    <View
      className="border-slate-600 dark:border-slate-600 bg-[#d8cece] dark:bg-[#121212]"
      style={styles.profile}
    >
      <View className="gap-y-1 mb-5">
        <View className="gap-2 flex-row items-center">
          <User2Icon
            stroke={theme === "light" ? "#000000" : "#ffffff"}
            size={sc(24)}
          />
          <Text
            className="text-black dark:text-white font-nata-sans-bold"
            style={styles.heading}
          >
            Profile
          </Text>
        </View>

        <Text
          className="text-textLight dark:text-textDark font-medium"
          style={{ fontSize: sc(11) }}
        >
          Your personal information and preferences
        </Text>
      </View>

      <View className="gap-y-1 mb-5">
        <Text
          className="text-black dark:text-white font-medium"
          style={{ fontSize: sc(14) }}
        >
          {user?.userName ?? "No Name"}
        </Text>

        <Text
          className="text-textLight dark:text-textDark font-medium"
          style={{ fontSize: sc(10.5) }}
        >
          {user?.userEmail ?? "--"}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  profile: {
    height: vs(192),
    width: "100%",
    borderWidth: sc(1),
    borderRadius: sc(17),
    padding: sc(18),
    //marginTop: vs(45),
    marginBottom: vs(28)
  },
  heading: {
    fontSize: sc(23),
  },
});
