import { Tabs } from "expo-router";
export default function TabsMainLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="dashboard" />
      <Tabs.Screen name="aisuggestions" />
    </Tabs>
  );
}
