import { toastConfig } from "@/src/components/ToastConfig";
import * as Font from "expo-font";
import * as Linking from "expo-linking";
import * as Notifications from "expo-notifications";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useColorScheme } from "nativewind";
import { useEffect, useState } from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import "../../global.css";
import LoadingScreen from "../components/LoadingScreen";
import useCheckPushStatus from "../services/notifications/hook/useCheckPushStatus";
import usePermissionListener from "../services/notifications/hook/usePermissionListener";
import useAuthInitializer from "../store/useAuthInitializer";
import useAuthStore from "../store/useAuthStore";
import useThemeStore from "../store/useThemeStore";

SplashScreen.preventAutoHideAsync();

//controls notification handling when app is foregrounded (receive notifications even while using the app)
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const { authInitialized, user, hasCompletedOnboarding } = useAuthStore();
  const { theme } = useThemeStore();
  const { setColorScheme } = useColorScheme();
  const [fontsLoaded, setFontsLoaded] = useState<boolean>(false);
  const [handledInitialNotification, setHandleNotification] =
    useState<boolean>(false);
  const [launchedFromNotification, setLaunchedFromNotification] =
    useState<boolean>(false);
  const isAuthenticated = user !== null;

  useAuthInitializer();
  useCheckPushStatus();
  usePermissionListener();

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
    if (!authInitialized || !fontsLoaded || !handledInitialNotification) return;
    const inAuthGroup = segments[0] === "(auth)";
    const inOnboardingGroup = segments[0] === "(onboarding)";
    if (
      isAuthenticated &&
      hasCompletedOnboarding &&
      (inAuthGroup || inOnboardingGroup)
    ) {
      if (!launchedFromNotification) {
        router.replace("/(main)/(tabs)/dashboard");
      }
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
    handledInitialNotification,
    launchedFromNotification,
    hasCompletedOnboarding,
    segments,
    router,
  ]);

  const lastNotificationResponse = Notifications.useLastNotificationResponse();
  useEffect(() => {
    if (!authInitialized || !fontsLoaded) return;

    async function checkInitialNotification() {
      if (lastNotificationResponse === undefined) return;
      const screen_url =
        lastNotificationResponse?.notification?.request?.content?.data?.url;
      if (typeof screen_url === "string") {
        setLaunchedFromNotification(true);
        Linking.openURL(screen_url);
      }
      setHandleNotification(true);
      console.log("Checked initial notification on cold start up");
    }

    checkInitialNotification();
  }, [authInitialized, fontsLoaded, lastNotificationResponse]);

  useEffect(() => {
    const subsription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const screen_url = response.notification?.request?.content?.data?.url;
        if (typeof screen_url === "string") {
          Linking.openURL(screen_url);
        }
      },
    );
    return () => subsription.remove();
  }, [router]);

  if (!authInitialized || !fontsLoaded || !handledInitialNotification) {
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
        <Toast config={toastConfig} />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
