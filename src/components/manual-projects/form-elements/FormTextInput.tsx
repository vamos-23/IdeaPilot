import { View, Pressable, TextInput } from "react-native";
import { X } from "lucide-react-native";
import useThemeStore from "@/src/store/useThemeStore";

type FormTextInputProps = {
  value: string;
  onChangeText: (text: string) => void;
  isMultiline?: boolean;
  placeholderText: string;
};

export default function FormTextInput({
  value,
  onChangeText,
  isMultiline = false,
  placeholderText,
}: FormTextInputProps) {
  const isDark = useThemeStore((s) => s.theme === "dark");
  const placeholderColor = isDark ? "#94A3B8" : "#64748B";

  return (
    <View
      className="rounded-2xl border border-slate-300 dark:border-slate-700
      bg-slate-50 dark:bg-[#202B3D] shadow-md dark:shadow-none"
    >
      <View
        className={`flex-row px-4 ${
          isMultiline ? "py-2" : "flex-1 items-center"
        }`}
      >
        <View
          className={`${
            isMultiline ? "items-center pt-1" : "items-center justify-center"
          }`}
        ></View>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholderText}
          placeholderTextColor={placeholderColor}
          multiline={isMultiline}
          textAlignVertical={isMultiline ? "top" : "center"}
          className={`flex-1 text-[16px] text-slate-800 dark:text-white ${
            isMultiline ? "min-h-[90px]" : "h-16"
          }`}
        />

        {value.length > 0 && (
          <View
            className={`${
              isMultiline ? "items-center pt-4" : "items-center justify-center"
            }`}
          >
            <Pressable hitSlop={12} onPress={() => onChangeText("")}>
              <X size={18} color={placeholderColor} />
            </Pressable>
          </View>
        )}
      </View>
    </View>
  );
}
