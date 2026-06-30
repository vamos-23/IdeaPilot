import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import ChatList from "./ChatList";
import useThemeStore from "@/src/store/useThemeStore";
import React from "react";

type ChatHistoryDrawerProps = {
  isDrawerOpen: boolean;
  onNewChat: () => void;
  onSearchClicked: () => void;
  onSelectChat: (id: string) => void;
  onClose: () => void;
};

function ChatHistoryDrawer({
  isDrawerOpen,
  onNewChat,
  onSearchClicked,
  onSelectChat,
  onClose,
}: ChatHistoryDrawerProps) {
  const appTheme = useThemeStore((s) => s.theme);
  return (
    <>
      <View className="p-5 px-5">
        <View className="gap-3">
          <View className="flex-row justify-between items-center">
            <View className="flex-row gap-2 items-center">
              <Ionicons name="sparkles" size={18} color="#818CF8" />
              <Text
                style={styles.ai}
                className="
              text-textLight
              dark:text-white
              font-nata-sans-bold
              "
              >
                IdeaPilot AI
              </Text>
            </View>
            <TouchableOpacity
              className="flex-row gap-2 items-center"
              onPress={onClose}
              activeOpacity={0.5}
            >
              <Ionicons
                size={20}
                color={appTheme === "light" ? "#0F172A" : "#fff"}
                name="close-sharp"
              />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            className="flex-row gap-2 items-center"
            onPress={onNewChat}
            activeOpacity={0.5}
          >
            <MaterialCommunityIcons
              name="circle-edit-outline"
              size={18}
              color={appTheme === "dark" ? "#ffffff" : "#0F172A"}
            />
            <Text
              className="
          text-textLight
          dark:text-white
          font-nata-sans-bold
          text-lg
          "
            >
              New Chat
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-row gap-2 items-center"
            onPress={onSearchClicked}
            activeOpacity={0.5}
          >
            <Ionicons
              name="search-sharp"
              size={18}
              color={appTheme === "dark" ? "#ffffff" : "#0F172A"}
            />
            <Text
              className="
          text-textLight
          dark:text-white
          font-nata-sans-bold
          text-lg
          "
            >
              Search Chats
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View className="flex-1 p-5 gap-2">
        <Text className="font-nata-sans-bold text-lg text-textLight dark:text-textDark">
          Recent Chats
        </Text>
        <ChatList isDrawerOpen={isDrawerOpen} onSelectChat={onSelectChat} />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  ai: {
    fontSize: 23,
  },
});

export default React.memo(ChatHistoryDrawer);
