import useThemeStore from "@/src/store/useThemeStore";
import { Tabs, useRouter } from "expo-router";
import { Home, Settings, Sparkles } from "lucide-react-native";
import { StyleSheet, View } from "react-native";
import { sc, vs } from "../../../constants/responsive";

const TOKENS = {
  dark: {
    bar: "#1A2E52",
    active: "#15cbeb",
    inactive: "#4A6A9C",
    border: "rgba(21,203,235,0.18)",
    fabBg: "#15cbeb",
    fabBorder: "#0F1D3A",
    fabGlow: "#15cbeb",
    shadow: "#000000",
    shadowOpacity: 0.5,
  },
  light: {
    bar: "#FFFFFF",
    active: "#ea580c",
    inactive: "#A0B0C0",
    border: "rgba(234,88,12,0.12)",
    fabBg: "#ea580c",
    fabBorder: "#F1F5F9",
    fabGlow: "#ea580c",
    shadow: "#64748B",
    shadowOpacity: 0.2,
  },
} as const;

export default function TabsMainLayout() {
  const isDark = useThemeStore((s) => s.theme) === "dark";
  const router = useRouter();
  const t = isDark ? TOKENS.dark : TOKENS.light;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: "absolute",
          overflow: "visible",
          marginHorizontal: sc(24),
          marginBottom: vs(10),
          backgroundColor: t.bar,
          borderRadius: sc(36),
          height: vs(58),
          borderWidth: 1,
          borderColor: t.border,
          paddingBottom: 0,
          paddingTop: 0,
          elevation: 28,
          shadowColor: t.shadow,
          shadowOffset: { width: 0, height: 14 },
          shadowOpacity: t.shadowOpacity,
          shadowRadius: 30,
        },
        tabBarIconStyle: {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ focused }) => (
            <View style={styles.iconWrap}>
              <Home
                stroke={focused ? t.active : t.inactive}
                size={sc(22)}
                strokeWidth={focused ? 2.5 : 1.5}
              />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="aisuggestion"
        options={{
          title: "AI Suggestions",
          tabBarIcon: () => (
            <View style={styles.fabOuter}>
              <View
                style={[
                  styles.fabRing,
                  {
                    borderColor: t.fabGlow,
                    shadowColor: t.fabGlow,
                  },
                ]}
              />
              <View
                style={[
                  styles.fab,
                  {
                    backgroundColor: t.fabBg,
                    borderColor: t.fabBorder,
                    shadowColor: t.fabGlow,
                  },
                ]}
              >
                <Sparkles stroke="#FFFFFF" size={sc(20)} strokeWidth={2.5} />
              </View>
            </View>
          ),
        }}
        listeners={() => ({
          tabPress: (e) => {
            e.preventDefault();
            router.push("/aisuggestion");
          },
        })}
      />

      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ focused }) => (
            <View style={styles.iconWrap}>
              <Settings
                stroke={focused ? t.active : t.inactive}
                size={sc(22)}
                strokeWidth={focused ? 2.5 : 1.5}
              />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconWrap: {
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  fabOuter: {
    alignItems: "center",
    justifyContent: "center",
    width: sc(45),
    height: sc(45),
  },
  fabRing: {
    position: "absolute",
    width: sc(53),
    height: sc(53),
    borderRadius: sc(30),
    borderWidth: 1,
    opacity: 0.4,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: sc(30),
  },
  fab: {
    alignItems: "center",
    justifyContent: "center",
    width: sc(42),
    height: sc(42),
    borderRadius: sc(25),
    borderWidth: 2,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.55,
    shadowRadius: 18,
    elevation: 14,
  },
});
