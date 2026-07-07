import { View, Text } from "react-native";
import { Clock, Layout } from "lucide-react-native";

type InformationProps = {
  timelineValue: string;
  categoryValue: string;
  iconColor: string;
};
export function InformationCard({ timelineValue, categoryValue, iconColor }: InformationProps) {
  return (
    <View className="flex-row gap-4 mb-10">
      {[
        {
          label: "Timeline",
          val: timelineValue,
          icon: Clock,
        },
        {
          label: "Category",
          val: categoryValue,
          icon: Layout,
        },
      ].map((stat, i) => (
        <View
          key={i}
          className="flex-1 bg-cardLight dark:bg-cardDark p-5 rounded-[24px] border border-slate-300 dark:border-white/5 items-center"
        >
          <View
            style={{ backgroundColor: iconColor + "35" }}
            className="p-3 rounded-2xl mb-3"
          >
            <stat.icon size={20} color={iconColor} />
          </View>
          <Text className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-nata-sans-bold mb-1">
            {stat.label}
          </Text>
          <Text className="text-slate-900 dark:text-white font-nata-sans-bold text-[13px]">
            {stat.val}
          </Text>
        </View>
      ))}
    </View>
  );
}
