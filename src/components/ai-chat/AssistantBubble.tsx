import { View, Text, StyleSheet } from "react-native";
import React from "react";

type AssistantResponse = {
  content: string;
  isStreaming: boolean;
};

function AssistantBubble({ content, isStreaming }: AssistantResponse) {
  return (
    <View
      style={styles.assistantBubble}
      className="
      px-4
      py-3
    bg-cardLight
    dark:bg-cardDark
      border
    border-black/5
    dark:border-white/5
      "
    >
      <Text className="font-nata-sans-medium text-sm text-textLight dark:text-white leading-6">
        {content}
        {isStreaming ? "|" : ""}
      </Text>
    </View>
  );
}
const styles = StyleSheet.create({
  assistantBubble: {
    maxWidth: "88%",
    borderTopLeftRadius: 4,
    borderRadius: 20,
  },
});
export default React.memo(AssistantBubble, (prevProps, nextProps) => {
  return (
    prevProps.content === nextProps.content,
    prevProps.isStreaming === nextProps.isStreaming
  );
});
