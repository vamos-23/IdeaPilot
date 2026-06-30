import React, { useState, useMemo, useCallback } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { FlashList } from "@shopify/flash-list";
import { Search, X, MessageSquare } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useChatHistory } from "@/src/store/useChatQueries";
import { Chat } from "@/src/constants/types";

type SearchOverlayProps = {
  isOpen: boolean;
  onClose: () => void;
  onSelectChat: (chatId: string) => void;
};

export default function SearchChatsOverlay({
  isOpen,
  onClose,
  onSelectChat,
}: SearchOverlayProps) {
  const { top } = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState("");
  const { data: chats = [] } = useChatHistory(isOpen);

  const filteredChats = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return chats.filter((c) =>
      c.title.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [chats, searchQuery]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: withTiming(isOpen ? 1 : 0, {
      duration: 250,
      easing: Easing.inOut(Easing.ease),
    }),
    transform: [
      {
        scale: withTiming(isOpen ? 1 : 0.98, {
          duration: 250,
          easing: Easing.out(Easing.cubic),
        }),
      },
    ],
  }));

  const handleSelect = useCallback(
    (id: string) => {
      setSearchQuery("");
      onClose();
      setTimeout(() => onSelectChat(id), 250);
    },
    [onClose, setSearchQuery, onSelectChat],
  );

  const ChatItem = React.memo(
    ({ item }: { item: Chat }) => (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => handleSelect(item.id)}
        className="flex-row items-center px-5 py-4 border-b border-gray-100 dark:border-gray-800/50 bg-cardLight dark:bg-cardDark"
      >
        <View className="bg-gray-100 dark:bg-gray-800 p-2 rounded-full">
          <MessageSquare size={18} color="#818CF8" />
        </View>
        <Text className="ml-4 text-base text-textLight dark:text-textDark font-medium">
          {item.title}
        </Text>
      </TouchableOpacity>
    ),
    (prevProps, nextProps) => {
      return (
        prevProps.item.id === nextProps.item.id,
        prevProps.item.title === nextProps.item.title,
        prevProps.item.isPinned === nextProps.item.isPinned
      );
    },
  );
  ChatItem.displayName = "ChatItem";

  const renderChats = ({ item }: { item: Chat }) => <ChatItem item={item} />;

  return (
    <Animated.View
      pointerEvents={isOpen ? "auto" : "none"}
      style={[
        StyleSheet.absoluteFillObject,
        animatedStyle,
        { zIndex: 3000, top: top },
      ]}
      className="bg-brandLight dark:bg-brandDark"
    >
      <View className="flex-row items-center px-4 py-3 border-b border-gray-200 dark:border-gray-800 bg-cardLight dark:bg-cardDark">
        <View className="flex-1 flex-row items-center bg-gray-100 dark:bg-gray-900 rounded-full px-2 py-2.5">
          <Search size={20} color="#9CA3AF" />
          <TextInput
            className="flex-1 ml-2 text-base font-nata-sans-bold text-textLight dark:text-white"
            placeholder="Search ideas..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus={isOpen}
          />
          <TouchableOpacity onPress={onClose} className="p-1">
            <X size={18} color="#9CA3AF" />
          </TouchableOpacity>
        </View>
      </View>

      <FlashList
        data={filteredChats}
        keyExtractor={(item) => item.id}
        //@ts-ignore
        estimatedItemSize={65}
        keyboardShouldPersistTaps="handled"
        renderItem={renderChats}
        ListEmptyComponent={
          <Text className="text-center text-lg text-gray-500 mt-10">
            {searchQuery
              ? "No matching projects found."
              : "Type to search your Idea Vault..."}
          </Text>
        }
      />
    </Animated.View>
  );
}
