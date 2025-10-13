import { View, ActivityIndicator } from "react-native";
import { ms, vs } from "../constants/responsive";
export default function LoadingScreen() {
  return (
    <View className="justify-center items-center">
      <ActivityIndicator size="large" className="bg-white dark:bg-blue-600" />
    </View>
  );
}