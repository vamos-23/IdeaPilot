import { View, Text, StyleSheet } from "react-native";
import React from "react";

type UserPrompt = {
  content: string;
};

function UserBubble({ content }: UserPrompt) {
  return (
    <View
      style={styles.userBubble}
      className="px-4 py-3 bg-accent-dark1 dark:bg-accent-dark1"
    >
      <Text className="text-[15px] text-white leading-6 flex-wrap">{content}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  userBubble: {
    maxWidth: "85%",
    borderBottomRightRadius: 4,
    borderRadius: 20,
  },
});

export default React.memo(UserBubble, (prevProps, nextProps) => {
  return prevProps.content === nextProps.content;
});
