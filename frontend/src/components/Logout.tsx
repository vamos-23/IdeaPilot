import { View, Text, TouchableOpacity } from "react-native";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { sc } from "../constants/responsive";

type LogoutButtonProps = {
  onLogout: () => void;
  appTheme: string;
};

export default function Logout({ onLogout, appTheme }: LogoutButtonProps) {
  return (
    <TouchableOpacity
      onPress={onLogout}
      activeOpacity={0.7}
      className="bg-cardLight dark:bg-cardDark border border-borderLight dark:border-borderDark w-full rounded-2xl p-5 mb-8 flex-row items-center justify-between shadow-sm dark:shadow-none"
    >
      <View className="flex-row items-center gap-3">
        <MaterialCommunityIcons
          name="logout"
          color={appTheme === "light" ? "#4F46E5" : "#818CF8"}
          size={sc(22)}
        />
        <Text className="text-textLight dark:text-white font-nata-sans-bold text-lg">
          Sign Out
        </Text>
      </View>
    </TouchableOpacity>
  );
}
