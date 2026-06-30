import useThemeStore from "@/src/store/useThemeStore";
import { Tabs, useRouter, useSegments } from "expo-router"; // [CHANGED] added useRouter
import { Home, Settings, Sparkles } from "lucide-react-native";
import { useEffect } from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { sc, vs } from "../../../constants/responsive";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";

const DESIGN_TOKENS = {
  dark: {
    bar: "#131926",
    active: "#818CF8",
    inactive: "#475569",
    border: "#404652",
    fabBg: "#4338CA",
    fabBorder: "#131926",
    fabGlow: "#6366F1",
    shadow: "#000000",
    shadowOpacity: 0.2,
  },
  light: {
    bar: "#FFFFFF",
    active: "#4338CA",
    inactive: "#64748B",
    border: "#E2E8F0",
    fabBg: "#4338CA",
    fabBorder: "#FFFFFF",
    fabGlow: "#4338CA",
    shadow: "#0F172A",
    shadowOpacity: 0.05,
  },
} as const;

export default function TabsMainLayout() {
  const isDark = useThemeStore((s) => s.theme) === "dark";
  const segments = useSegments();
  const router = useRouter();
  const t = isDark ? DESIGN_TOKENS.dark : DESIGN_TOKENS.light;

  const ring1Scale = useSharedValue(1);
  const ring1Opacity = useSharedValue(0.2);
  const ring2Scale = useSharedValue(1);
  const ring2Opacity = useSharedValue(0.1);
  const coreScale = useSharedValue(1);

  const isAiScreenActive = segments[segments.length - 1] === "aisuggestion";

  useEffect(() => {
    ring1Scale.value = withRepeat(
      withSequence(
        withTiming(1.35, { duration: 1600 }),
        withTiming(1.0, { duration: 1400 }),
      ),
      -1,
      true,
    );
    ring1Opacity.value = withRepeat(
      withSequence(
        withTiming(0.5, { duration: 1600 }),
        withTiming(0.05, { duration: 1400 }),
      ),
      -1,
      true,
    );
    ring2Scale.value = withRepeat(
      withSequence(
        withTiming(1.55, { duration: 1800 }),
        withTiming(1.0, { duration: 1600 }),
      ),
      -1,
      true,
    );
    ring2Opacity.value = withRepeat(
      withSequence(
        withTiming(0.25, { duration: 1800 }),
        withTiming(0.02, { duration: 1600 }),
      ),
      -1,
      true,
    );
    coreScale.value = withRepeat(
      withSequence(
        withTiming(1.08, { duration: 1200 }),
        withTiming(0.96, { duration: 1200 }),
      ),
      -1,
      true,
    );
  }, []);

  const animatedRing1Style = useAnimatedStyle(() => ({
    transform: [{ scale: ring1Scale.value }],
    opacity: ring1Opacity.value,
  }));
  const animatedRing2Style = useAnimatedStyle(() => ({
    transform: [{ scale: ring2Scale.value }],
    opacity: ring2Opacity.value,
  }));
  const animatedCoreStyle = useAnimatedStyle(() => ({
    transform: [{ scale: coreScale.value }],
  }));

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        sceneStyle: { backgroundColor: t.fabBg },
      }}
      tabBar={(props: BottomTabBarProps) => {
        if (isAiScreenActive) return null;

        const { state, navigation } = props;
        const activeRouteName = state.routes[state.index]?.name;

        return (
          <View style={styles.barContainer}>
            <View
              style={[
                styles.tabBarWrapper,
                {
                  backgroundColor: t.bar,
                  borderColor: t.border,
                  shadowColor: t.shadow,
                  shadowOpacity: t.shadowOpacity,
                },
              ]}
            >
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => navigation.navigate("dashboard")}
                style={styles.tabButton}
                hitSlop={20}
              >
                <View style={styles.iconContainer}>
                  {activeRouteName === "dashboard" && (
                    <View
                      style={[
                        styles.iconGlow,
                        { backgroundColor: t.active, shadowColor: t.active },
                      ]}
                    />
                  )}
                  <Home
                    stroke={
                      activeRouteName === "dashboard" ? t.active : t.inactive
                    }
                    size={sc(23)}
                    strokeWidth={activeRouteName === "dashboard" ? 2.5 : 2.0}
                  />
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => router.navigate("/aisuggestion")}
                style={styles.fabContainer}
                hitSlop={10}
              >
                <View style={styles.fabOuter}>
                  <Animated.View
                    style={[
                      styles.fabRingOuter,
                      animatedRing2Style,
                      { borderColor: t.fabGlow, shadowColor: t.fabGlow },
                    ]}
                  />
                  <Animated.View
                    style={[
                      styles.fabRingInner,
                      animatedRing1Style,
                      { borderColor: t.fabGlow, shadowColor: t.fabGlow },
                    ]}
                  />
                  <Animated.View
                    style={[
                      styles.fab,
                      animatedCoreStyle,
                      {
                        backgroundColor: t.fabBg,
                        borderColor: t.fabBorder,
                        shadowColor: t.fabGlow,
                      },
                    ]}
                  >
                    <Sparkles
                      stroke="#FFFFFF"
                      size={sc(20)}
                      strokeWidth={2.4}
                    />
                  </Animated.View>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => navigation.navigate("settings")}
                style={styles.tabButton}
                hitSlop={20}
              >
                <View style={styles.iconContainer}>
                  {activeRouteName === "settings" && (
                    <View
                      style={[
                        styles.iconGlow,
                        { backgroundColor: t.active, shadowColor: t.active },
                      ]}
                    />
                  )}
                  <Settings
                    stroke={
                      activeRouteName === "settings" ? t.active : t.inactive
                    }
                    size={sc(23)}
                    strokeWidth={activeRouteName === "settings" ? 2.5 : 2.0}
                  />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        );
      }}
    >
      <Tabs.Screen name="dashboard" />
      <Tabs.Screen name="settings" />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  barContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    overflow: "hidden",
    backgroundColor: "transparent",
  },
  tabBarWrapper: {
    flexDirection: "row",
    marginHorizontal: sc(60),
    marginVertical: vs(16),
    paddingHorizontal: sc(25),
    borderRadius: sc(28),
    height: vs(60),
    borderWidth: sc(1),
    elevation: 6,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    justifyContent: "space-between",
    alignItems: "center",
    overflow: "visible",
  },
  tabButton: {
    height: "100%",
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
  iconGlow: {
    position: "absolute",
    width: sc(60),
    height: sc(50),
    borderRadius: sc(20),
    opacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 0 },
    elevation: 2,
  },
  fabContainer: {
    width: sc(64),
    height: vs(66),
    justifyContent: "center",
    alignItems: "center",
    overflow: "visible",
  },
  fabOuter: {
    width: sc(54),
    height: sc(54),
    justifyContent: "center",
    alignItems: "center",
    overflow: "visible",
  },
  fabRingOuter: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: sc(27),
    borderWidth: 1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 0 },
    elevation: 1,
  },
  fabRingInner: {
    position: "absolute",
    width: "90%",
    height: "90%",
    borderRadius: sc(24.3),
    borderWidth: 1.5,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 0 },
    elevation: 1,
  },
  fab: {
    width: sc(45),
    height: sc(43),
    borderRadius: sc(21.6),
    borderWidth: sc(2),
    justifyContent: "center",
    alignItems: "center",
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
});
