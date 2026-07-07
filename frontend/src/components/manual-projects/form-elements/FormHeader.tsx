import { View, Text, Pressable } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import useThemeStore from "@/src/store/useThemeStore";
import { sc } from "@/src/constants/responsive";

type FormHeaderProps = {
  title: string;
  subtitle: string;
};

export default function FormHeader({ title, subtitle }: FormHeaderProps) {
  const router = useRouter();
  const isDark = useThemeStore((s) => s.theme === "dark");
  const { top } = useSafeAreaInsets();

  return (
    <View
      className="bg-[#f4f4f5] dark:bg-[#15191f] border-b border-[#E05600] pb-5 px-5 gap-3"
      style={{ paddingTop: Math.max(top + 16, 16) }}
    >
      <View className="flex-row items-center gap-4">
        <Pressable
          onPress={() => router.back()}
          className="p-2.5 bg-white dark:bg-[#0F172A] rounded-xl border border-slate-300 dark:border-white/10"
        >
          <Feather
            name="arrow-left"
            size={24}
            color={isDark ? "#f97316" : "#ea580c"}
          />
        </Pressable>
        <Text
          className="font-nata-sans-bold text-textLight dark:text-white"
          style={{ fontSize: sc(22) }}
        >
          {title}
        </Text>
      </View>

      <Text className="text-slate-500 dark:text-slate-400 font-nata-sans-medium text-base leading-6">
        {subtitle}
      </Text>
    </View>
  );
}
