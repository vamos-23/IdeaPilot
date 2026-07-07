import { Pressable, View, Text } from "react-native";
import Feather from "@expo/vector-icons/Feather";

type SelectionItemProps = {
  itemLabel: string;
  selected: boolean;
  onSelect: (itemLabel: string) => void;
};

export default function SelectionItemComponent({
  itemLabel,
  selected,
  onSelect,
}: SelectionItemProps) {
  return (
    <Pressable
      android_ripple={{ color: "#E2E8F0" }}
      onPress={() => onSelect(itemLabel)}
      className={`flex-row items-center justify-between rounded-2xl border px-5 py-4
              ${
                selected
                  ? "border-blue-200 bg-blue-50 dark:border-blue-500/45 dark:bg-blue-500/15"
                  : "border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-[#202B3D]"
              }`}
    >
      <Text
        className={`font-nata-sans-bold text-[16px]
              ${
                selected
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-textLight dark:text-white"
              }`}
      >
        {itemLabel}
      </Text>

      {selected && (
        <View className="h-7 w-7 items-center justify-center rounded-full bg-blue-600">
          <Feather name="check" size={15} color="white" />
        </View>
      )}
    </Pressable>
  );
}
