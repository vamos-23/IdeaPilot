import * as Font from "expo-font";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useColorScheme } from "nativewind";
import { useEffect, useState } from "react";
import Toast from "react-native-toast-message";
import { toastConfig } from "@/src/components/ToastConfig";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import "../../global.css";
import LoadingScreen from "../components/LoadingScreen";
import useAuthInitializer from "../store/useAuthInitializer";
import useAuthStore from "../store/useAuthStore";
import useThemeStore from "../store/useThemeStore";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const { isLoading, user, hasCompletedOnboarding } = useAuthStore();
  const { theme } = useThemeStore();
  const { setColorScheme } = useColorScheme();
  const [fontsLoaded, setFontsLoaded] = useState<boolean>(false);
  const isAuthenticated = user !== null;

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
    setColorScheme(theme);
  }, [setColorScheme, theme]);

  useEffect(() => {
    if (isLoading || !fontsLoaded) return;
    const inAuthGroup = segments[0] === "(auth)";
    const inOnboardingGroup = segments[0] === "(onboarding)";
    if (!hasCompletedOnboarding && !inOnboardingGroup) {
      router.replace("/(onboarding)/welcome");
      return;
    } else if (
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
      console.error("SplashScreen hide error!", err)
    );
  }, [
    fontsLoaded,
    isLoading,
    isAuthenticated,
    hasCompletedOnboarding,
    segments,
    router,
  ]);

  if (isLoading || !fontsLoaded) {
    return <LoadingScreen />;
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={{ flex: 1 }}
        edges={["top", "bottom", "left", "right"]}
        className="bg-brandLight dark:bg-brandDark"
      >
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(onboarding)" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(main)" />
        </Stack>
        <Toast config={toastConfig}/>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
