import { View, Pressable, Text } from "react-native";
import {
  DIFFICULTY_LEVELS,
  difficultyStyles,
} from "@/src/constants/projectFormData";

type DifficultyCardProps = {
  title: string;
  difficulty: keyof typeof DIFFICULTY_LEVELS;
  subtitle: string;
  selected: boolean;
  onSelect: () => void;
};

export default function DifficultyCard({
  title,
  difficulty,
  subtitle,
  selected,
  onSelect,
}: DifficultyCardProps) {
  const style = difficultyStyles[difficulty];
  return (
    <Pressable className="flex-row gap-5" onPress={onSelect}>
      <View className="mt-1.5 h-5 w-5 rounded-full items-center justify-center bg-slate-200 dark:bg-slate-600">
        {selected && (
          <View className={`h-3 w-3 rounded-full ${style.accent}`} />
        )}
      </View>

      <View className="flex-1 gap-1">
        <Text
          className={`text-lg font-nata-sans-bold tracking-wide ${style.text}`}
        >
          {title}
        </Text>
        <Text className="text-slate-500 dark:text-slate-300 text-md leading-6 font-nata-sans-medium tracking-wide">
          {subtitle}
        </Text>
      </View>
    </Pressable>
  );
}
