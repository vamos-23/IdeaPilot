import { toastConfig } from "@/src/components/ToastConfig";
import * as Font from "expo-font";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useColorScheme } from "nativewind";
import { useEffect, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import "../../global.css";
import LoadingScreen from "../components/LoadingScreen";
import useAuthInitializer from "../store/useAuthInitializer";
import useAuthStore from "../store/useAuthStore";
import useThemeStore from "../store/useThemeStore";
import { StatusBar } from "expo-status-bar";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
    },
  },
});

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const authInitialized = useAuthStore((s) => s.authInitialized);
  const user = useAuthStore((s) => s.user);
  const hasCompletedOnboarding = useAuthStore((s) => s.hasCompletedOnboarding);
  const appTheme = useThemeStore((s) => s.theme);
  const { setColorScheme } = useColorScheme();
  const [fontsLoaded, setFontsLoaded] = useState<boolean>(false);
  const isAuthenticated = user !== null;
  const isDark = appTheme === "dark";

  useAuthInitializer();

  useEffect(() => {
    async function loadFonts() {
      try {
        await Font.loadAsync({
          "Nata-Sans-Bold": require("../../assets/fonts/static/NataSans-Bold.ttf"),
          "Nata-Sans-Medium": require("../../assets/fonts/static/NataSans-Medium.ttf"),
        });
      } catch (e) {
        console.warn(e);
      } finally {
        setFontsLoaded(true);
      }
    }
    loadFonts();
  }, []);

  useEffect(() => {
    setColorScheme(appTheme);
  }, [setColorScheme, appTheme]);

  useEffect(() => {
    if (!authInitialized || !fontsLoaded) return;

    const inAuthGroup = segments[0] === "(auth)";
    const inOnboardingGroup = segments[0] === "(onboarding)";
    if (
      isAuthenticated &&
      hasCompletedOnboarding &&
      (inAuthGroup || inOnboardingGroup)
    ) {
      router.replace("/(main)/(tabs)/dashboard");
      return;
    } else if (!isAuthenticated && hasCompletedOnboarding && !inAuthGroup) {
      router.replace("/(auth)/signUp");
      return;
    }

    SplashScreen.hideAsync().catch((err) =>
      console.error("SplashScreen hide error!", err),
    );
  }, [
    fontsLoaded,
    authInitialized,
    isAuthenticated,
    hasCompletedOnboarding,
    segments,
    router
  ]);

  const shouldShowLoader = !fontsLoaded || !authInitialized;

  if (shouldShowLoader) {
    return <LoadingScreen />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <KeyboardProvider>
            <BottomSheetModalProvider>
              <StatusBar
                style={isDark ? "light" : "dark"}
                translucent
                backgroundColor="transparent"
              />
              <Stack
                screenOptions={{
                  headerShown: false,
                  animation: "ios_from_right",
                  contentStyle: {
                    backgroundColor: isDark ? "#0B0F17" : "#F1F5F9",
                  },
                }}
              >
                <Stack.Screen name="(onboarding)" />
                <Stack.Screen name="(auth)" />
                <Stack.Screen name="(main)" />
              </Stack>
              <Toast config={toastConfig} />
            </BottomSheetModalProvider>
          </KeyboardProvider>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}
