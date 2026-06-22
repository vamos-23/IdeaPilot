import {
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  LayoutChangeEvent,
} from "react-native";
import { useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";

type ChatInputProps = {
  onSend: (prompt: string) => void;
  onLayoutChanges: (e: LayoutChangeEvent) => void;
  streamingStatus: boolean;
};

export default function ChatInput({
  onSend,
  onLayoutChanges,
  streamingStatus,
}: ChatInputProps) {
  const [prompt, setPrompt] = useState<string>("");
  const [isFocused, setFocus] = useState<boolean>(false);

  const hasValidText = prompt.trim().length > 0;

  const handleInput = () => {
    if (!hasValidText || streamingStatus) return;
    onSend(prompt);
    setPrompt("");
  };

  const handleFocus = () => setFocus(true);
  const handleBlur = () => setFocus(false);

  const getButtonBgStyle = () => {
    if (streamingStatus) return "bg-accent-light dark:bg-accent-dark";
    if (hasValidText) return "bg-accent-dark2 dark:bg-accent-dark1";
    return "bg-black/5 dark:bg-white/10";
  };

  const getIconColor = () => {
    if (streamingStatus || hasValidText) return "#FFFFFF";
    return "#94A3B8";
  };

  return (
    <View className="px-3 items-center bg-transparent">
      <View
        className={`flex-row items-end bg-white dark:bg-[#131720] px-4 py-3 border rounded-3xl ${
          isFocused
            ? "border-accent-light dark:border-white"
            : "border-gray-400 dark:border-gray-600"
        }`}
      >
        <TextInput
          value={prompt}
          onChangeText={setPrompt}
          onFocus={handleFocus}
          onBlur={handleBlur}
          multiline
          maxLength={800}
          onLayout={onLayoutChanges}
          placeholder="Describe your ideas..."
          placeholderTextColor="#94A3B8"
          className="flex-1 text-textLight dark:text-white font-nata-sans-medium text-md max-h-36"
        />

        <View className="ml-3">
          <TouchableOpacity
            activeOpacity={0.7}
            hitSlop={15}
            disabled={!hasValidText || streamingStatus}
            onPress={handleInput}
          >
            <View
              className={`h-12 w-12 items-center justify-center rounded-full ${getButtonBgStyle()}`}
            >
              {streamingStatus ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Ionicons name="arrow-up" size={20} color={getIconColor()} />
              )}
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
