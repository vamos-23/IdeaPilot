//import { StyleSheet } from "react-native";
import { Tabs } from "expo-router";
//import { House, Sparkle, Settings } from "lucide-react-native";
import { sc } from "../../../constants/responsive";
export default function TabsMainLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "green",
          position: "absolute",
          elevation: 0,
          marginHorizontal: sc(30),
          borderRadius: sc(35),
          borderWidth: 2,
          borderColor: "red",
        },
      }}
    >
      <Tabs.Screen name="dashboard" />
      <Tabs.Screen name="aisuggestion" />
      <Tabs.Screen name="settings" />
    </Tabs>
  );
}
