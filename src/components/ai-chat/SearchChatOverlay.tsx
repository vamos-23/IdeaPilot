import React, { useState, useMemo } from "react";
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
import {
  useSafeAreaInsets,
} from "react-native-safe-area-context";

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

  const chats = useMemo(
    () => [
      { id: "1", title: "React Native vs React" },
      { id: "2", title: "Black Hole Explanation" },
      { id: "3", title: "TanStack Query Setup" },
      { id: "4", title: "PostgreSQL Cascade Delete" },
      { id: "5", title: "Project Onboarding & Setup" },
      { id: "6", title: "Q3 Marketing Strategy Brainstorm" },
      { id: "7", title: "API Integration Bug Fixes" },
      { id: "8", title: "UI/UX Design Feedback" },
      { id: "9", title: "Weekly Sync & Status Update" },
      { id: "10", title: "Client Presentation Rehearsal" },
      { id: "11", title: "Budget Review & Allocations" },
      { id: "12", title: "Product Roadmap Planning" },
      { id: "13", title: "Customer Support Escalations" },
      { id: "14", title: "Database Migration Checklist" },
      { id: "15", title: "HR Policy Updates 2026" },
      { id: "16", title: "Website Redesign Concepts" },
      { id: "17", title: "Sales Performance Dashboard" },
      { id: "18", title: "Security Audit Remediation" },
      { id: "19", title: "React Native Reanimated" },
    ],
    [],
  );
  const [searchQuery, setSearchQuery] = useState("");

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

  const handleSelect = (id: string) => {
    setSearchQuery("");
    onClose();
    setTimeout(() => onSelectChat(id), 250);
  };

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
      <View
        className="flex-row items-center px-4 py-3 border-b border-gray-200 dark:border-gray-800 bg-cardLight dark:bg-cardDark"
      >
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
        renderItem={({ item }) => (
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
        )}
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

