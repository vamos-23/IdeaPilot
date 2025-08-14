import "../global.css";
import { useState, useEffect } from "react";
import * as Font from "expo-font";
import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import SplashScreen from ".";
export default function RootLayout() {
  const [fontsLoaded, setFontsLoaded] = useState<boolean>(false);

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        "Noto-Sans-Syriac-Eastern": require("../assets/fonts/NotoSansSyriacEastern-VariableFont.ttf"),
        "Space-Mono": require("../assets/fonts/SpaceMono-Regular.ttf"),
      });
      setFontsLoaded(true);
    }
    loadFonts();
  }, []);
  //if fonts have not loaded yet, stay on SplashScreen
  if (!fontsLoaded) {
    return <SplashScreen />;
  }

  return (
    <SafeAreaView
      style={{ flex: 1 }}
      edges={["top", "bottom"]}
      className="bg-brandLight"
    >
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
      </Stack>
    </SafeAreaView>
  );
}
