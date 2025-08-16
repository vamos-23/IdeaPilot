import { View, Text } from "react-native";
import { Link } from "expo-router";
export default function SplashScreen() {
  return (
    <View
      className="bg-brandLight dark:bg-brandDark
    justify-center items-center flex-1"
    >
      <Link href="/(auth)">
        <Text>Splash Screen</Text>
      </Link>
    </View>
  );
}
