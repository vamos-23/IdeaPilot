import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, } from "expo-router";

export default function MainLayout() {
  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top", "bottom"]}>
      <Stack screenOptions={{ headerShown: false }} />
    </SafeAreaView>
  );
}
