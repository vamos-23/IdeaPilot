import { Pressable, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

type TechnologyChipProps = {
  techStack: string;
  isDark: boolean;
  isCancellable: boolean;
  onPress?: (technology: string) => void;
};

export default function TechnologyChip({
  techStack,
  isDark,
  isCancellable,
  onPress,
}: TechnologyChipProps) {
  const content = (
    <>
      <Text className="font-nata-sans-bold text-sm text-blue-600 dark:text-blue-300">
        {techStack}
      </Text>

      {isCancellable && (
        <Ionicons
          name="close"
          size={14}
          color={isDark ? "#93C5FD" : "#2563EB"}
        />
      )}
    </>
  );

  const className =
    "flex-row items-center gap-1 rounded-full border border-blue-300 dark:border-blue-500/40 bg-blue-100 dark:bg-blue-900/40 px-3 py-1.5";

  if (!isCancellable) {
    return <View className={className}>{content}</View>;
  }

  return (
    <Pressable
      className={className}
      onPress={() => onPress?.(techStack)}
      android_ripple={{ color: "#BFDBFE", borderless: false }}
    >
      {content}
    </Pressable>
  );
}
