import useThemeStore from "@/src/store/useThemeStore";
import { Tabs } from "expo-router";
import { LayoutList, Settings, Sparkles } from "lucide-react-native";
import { StyleSheet, View } from "react-native";
import { sc, vs } from "../../../constants/responsive";
export default function TabsMainLayout() {
  const { theme } = useThemeStore();
  const isDark = theme === "dark";
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: "absolute",
          elevation: 0,
          marginHorizontal: sc(30),
          marginBottom: vs(12),
          backgroundColor: isDark ? "rgba(255,255,255,0.07)" : "#F5F5F5",
          borderRadius: sc(30),
          height: vs(55),
          borderWidth: sc(1),
          borderTopWidth: sc(1),
          borderColor: isDark ? "rgba(255,255,255,0.23)" : "rgba(0,0,0,1)",
          paddingBottom: vs(10),
          paddingTop: vs(4.5),
          overflow: "hidden",
        },
        tabBarActiveTintColor: isDark ? "#15cbeb" : "orangered",
        tabBarInactiveTintColor: isDark
          ? "rgba(255,255,255,0.60)"
          : "#787878",
        tabBarLabelStyle: {
          fontFamily: "sans-serif",
          fontWeight: "bold",
          fontSize: sc(8.5),
        },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ focused }) => (
            <View style={styles.tabBarIcon}>
              <LayoutList
                stroke={
                  focused
                    ? isDark
                      ? "#fff"
                      : "mediumblue"
                    : isDark
                      ? "rgba(255,255,255,0.55)"
                      : "rgba(0,0,0,0.55)"
                }
                size={22}
                strokeWidth={focused ? sc(2) : sc(1.45)}
              />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="aisuggestion"
        options={{
          title: "AI Suggestions",
          tabBarIcon: ({ focused }) => (
            <View style={styles.tabBarIcon}>
              <Sparkles
                stroke={
                  focused
                    ? isDark
                      ? "#fff"
                      : "mediumblue"
                    : isDark
                      ? "rgba(255,255,255,0.55)"
                      : "rgba(0,0,0,0.55)"
                }
                size={22}
                strokeWidth={focused ? sc(2) : sc(1.45)}
              />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ focused }) => (
            <View style={styles.tabBarIcon}>
              <Settings
                stroke={
                  focused
                    ? isDark
                      ? "#fff"
                      : "mediumblue"
                    : isDark
                      ? "rgba(255,255,255,0.55)"
                      : "rgba(0,0,0,0.55)"
                }
                size={22}
                strokeWidth={focused ? sc(2) : sc(1.45)}
              />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarIcon: {
    margin: sc(3),
    justifyContent: "center",
    alignItems: "center",
  },
});
