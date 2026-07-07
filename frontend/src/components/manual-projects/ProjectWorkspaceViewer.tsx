import { useRouter } from "expo-router";
import { TouchableOpacity, Text } from "react-native";
import Feather from "@expo/vector-icons/Feather";

export default function ProjectWorkspaceViewer() {
  const router = useRouter();
  const handlePress = () => {
    router.navigate("/(main)/manual-projects");
  };
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={handlePress}
      className="flex-row items-center rounded-full border border-orange-500 bg-orange-50 dark:bg-orange-500/10 px-4 py-2 gap-2"
    >
      <Feather name="edit" size={14} color="#ea580c" />
      <Text className="text-xs font-nata-sans-bold text-orange-600 dark:text-orange-400">
        Your Space
      </Text>
    </TouchableOpacity>
  );
}
