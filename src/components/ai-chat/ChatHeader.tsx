import { View, Text, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { sc } from "../../constants/responsive";

type ChatHeaderProps = {
  toggleChatDrawer: () => void;
};

export default function ChatHeader({ toggleChatDrawer }: ChatHeaderProps) {
  const router = useRouter();

  const handleHideAIModal = () => {
    router.dismiss();
  };

  return (
    <View
      className="
        flex-row
        items-center
        justify-between
        px-5
        pt-3
        pb-4
        border-b
        border-black/5
        dark:border-white/5
        bg-cardLight
        dark:bg-cardDark
      "
    >
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={toggleChatDrawer}
        className="
          h-9
          w-9
          items-center
          justify-center
          rounded-full
          bg-black/5
          dark:bg-white/5
        "
      >
        <Ionicons name="menu" size={20} color="#818CF8" />
      </TouchableOpacity>

      <View className="flex-row items-center gap-2">
        <Ionicons name="sparkles" size={sc(15)} color="#818CF8" />
        <Text
          className="
            text-textLight
            dark:text-white
            font-nata-sans-bold
            text-base
          "
        >
          AI Architect
        </Text>
      </View>

      <TouchableOpacity
        activeOpacity={0.7}
        onPress={handleHideAIModal}
        className="
          h-9
          w-9
          items-center
          justify-center
          rounded-full
          bg-black/5
          dark:bg-white/5
        "
      >
        <Ionicons name="chevron-down" size={20} color="#818CF8" />
      </TouchableOpacity>
    </View>
  );
}
