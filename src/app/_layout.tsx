// RootLayout.tsx
import "../../global.css";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import * as Font from "expo-font";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import useAuthInitializer from "../store/useAuthInitializer";
import useAuthStore from "../store/useAuthStore";
import LoadingScreen from "../components/LoadingScreen";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const { isLoading, isAuthenticated, hasCompletedOnboarding } = useAuthStore();
  const [fontsLoaded, setFontsLoaded] = useState<boolean>(false);
  const [redirected, setRedirected] = useState<boolean>(false);

  // Initialize auth/session state
  useAuthInitializer();

  // Load fonts
  useEffect(() => {
    async function prepareApp() {
      try {
        await Font.loadAsync({
          "Nata-Sans-Bold": require("../../assets/fonts/static/NataSans-Bold.ttf"),
          "Nata-Sans-Medium": require("../../assets/fonts/static/NataSans-Medium.ttf"),
        });
      } catch (e) {
        console.warn(e);
      } finally {
        setFontsLoaded(true);
        await SplashScreen.hideAsync();
      }
    }
    prepareApp();
  }, []);

  // Redirect logic
  useEffect(() => {
    if (isLoading || !fontsLoaded || redirected) return;

    const group = segments[0];

    if (!hasCompletedOnboarding && group !== "(onboarding)") {
      router.replace("/(onboarding)/welcome");
      setRedirected(true);
    } else if (!isAuthenticated && group !== "(auth)") {
      router.replace("/(auth)/signIn");
      setRedirected(true);
    } else if (isAuthenticated && group === "(auth)") {
      router.replace("/(main)/(tabs)/dashboard");
      setRedirected(true);
    }
  }, [isLoading, isAuthenticated, hasCompletedOnboarding, fontsLoaded, router, segments, redirected]);

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
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(onboarding)" />
          <Stack.Screen name="(main)" />
        </Stack>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
