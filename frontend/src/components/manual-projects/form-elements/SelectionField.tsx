import { Pressable, Text, View } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import useThemeStore from "@/src/store/useThemeStore";
import {
  ICON_COLORS,
  ProjectFormIcon,
} from "../../../constants/projectFormData";
import TechnologyChip from "../bottom-sheet-elements/TechnologyChip";

type SelectionFieldProps = {
  value: string | string[];
  iconName: ProjectFormIcon;
  placeholder: string;
  onPress: () => void;
};

export default function SelectionField({
  value,
  iconName,
  placeholder,
  onPress,
}: SelectionFieldProps) {
  const isDark = useThemeStore((s) => s.theme === "dark");
  const iconColor = ICON_COLORS[iconName]?.[isDark ? "dark" : "light"];
  const isArray = Array.isArray(value);
  const hasValue = isArray ? value.length > 0 : value.length > 0;
  const visibleTechnologies = (value as string[]).slice(0, 3);
  const remainingTechnologies =
    (value as string[]).length - visibleTechnologies.length;

  return (
    <Pressable
      onPress={onPress}
      hitSlop={20}
      style={({ pressed }) => [{ opacity: pressed ? 0.2 : 1 }]}
      className="min-h-16 rounded-2xl flex-row items-center gap-3 border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#1E293B] px-4 shadow-xl dark:shadow-none"
    >
      <Feather name={iconName} size={18} color={iconColor} />
      {!isArray ? (
        <Text
          className={`font-nata-sans-bold text-base ${hasValue ? "text-textLight dark:text-white" : "text-slate-500 dark:text-slate-400"}`}
        >
          {hasValue ? value : placeholder}
        </Text>
      ) : hasValue ? (
        <View className="flex-1 py-4">
          <View className="flex-row flex-wrap gap-2">
            {visibleTechnologies.map((tech) => (
              <TechnologyChip
                key={tech}
                techStack={tech}
                isDark={isDark}
                isCancellable={false}
              />
            ))}
            {remainingTechnologies > 0 && (
              <View className="items-center justify-center rounded-2xl border border-blue-300 bg-blue-100 px-3 py-1.5 dark:border-blue-500/40 dark:bg-blue-900/40">
                <Text className="font-nata-sans-bold text-sm text-blue-600 dark:text-blue-300">
                  +{remainingTechnologies} MORE
                </Text>
              </View>
            )}
          </View>
        </View>
      ) : (
        <Text className="font-nata-sans-bold text-base text-slate-500 dark:text-slate-400">
          {placeholder}
        </Text>
      )}
    </Pressable>
  );
}
