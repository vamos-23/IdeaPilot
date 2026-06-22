import { View, ActivityIndicator } from "react-native";
import useThemeStore from "../store/useThemeStore";
export default function LoadingScreen() {
  const { theme } = useThemeStore();
  return (
    <View className="bg-brandLight dark:bg-brandDark flex-1 justify-center items-center">
      <ActivityIndicator
        size="large"
        color={theme === "light" ? "mediumblue" : "white"}
      />
    </View>
  );
}
