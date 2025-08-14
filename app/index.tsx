import { View, Text } from "react-native";
import { Link } from "expo-router";
export default function SplashScreen() {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Link href="/(auth)">
        <Text>Splash Screen</Text>
      </Link>
    </View>
  );
}
