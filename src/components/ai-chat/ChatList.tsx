import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  GestureResponderEvent,
  Dimensions,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { FlashList } from "@shopify/flash-list";
import React, { useState, useMemo } from "react";
import useThemeStore from "@/src/store/useThemeStore";
import {
  useChatHistory,
  useRenameChat,
  useDeleteChat,
  useToggleChatPinStatus,
} from "@/src/store/useChatQueries";
import { Chat, MenuState, ChatRenameState } from "@/src/constants/types";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

type ChatListProps = {
  isDrawerOpen: boolean;
  onSelectChat: (id: string) => void;
};

export default function ChatList({
  isDrawerOpen,
  onSelectChat,
}: ChatListProps) {
  const appTheme = useThemeStore((s) => s.theme);
  const { data: chats = [], isLoading } = useChatHistory(isDrawerOpen);
  const renameMutation = useRenameChat();
  const togglePinMutation = useToggleChatPinStatus();
  const deleteChatMutation = useDeleteChat();

  const [menuState, setMenuState] = useState<MenuState>({
    visible: false,
    isPinned: false,
    chatId: null,
    currentTitle: "",
    x: 0,
    y: 0,
  });

  const [renameState, setRenameState] = useState<ChatRenameState>({
    visible: false,
    chatId: null,
    text: "",
  });

  const sortedChats = useMemo(() => {
    const pinnedChats = chats.filter((chat: Chat) => chat.isPinned);
    const unpinnedChats = chats.filter((chat: Chat) => !chat.isPinned);
    return [...pinnedChats, ...unpinnedChats];
  }, [chats]);

  const handleLongPress = (
    event: GestureResponderEvent,
    chatId: string,
    title: string,
    isPinned: boolean,
  ) => {
    const { pageX, pageY } = event.nativeEvent;
    const MENU_WIDTH = 220;
    const MENU_HEIGHT = 130;

    const x =
      pageX + MENU_WIDTH > SCREEN_WIDTH
        ? SCREEN_WIDTH - MENU_WIDTH - 15
        : pageX;
    const y = pageY + MENU_HEIGHT > SCREEN_HEIGHT ? pageY - MENU_HEIGHT : pageY;

    setMenuState({
      visible: true,
      chatId,
      isPinned,
      currentTitle: title,
      x,
      y,
    });
  };

  const closeMenu = () => {
    setMenuState((prev) => ({ ...prev, visible: false }));
  };

  const closeRenameModal = () => {
    setRenameState((prev) => ({ ...prev, visible: false }));
  };

  const handleRenameChat = () => {
    const targetId = menuState.chatId;
    if (!targetId) return;
    setRenameState({
      visible: true,
      chatId: targetId,
      text: menuState.currentTitle,
    });
    closeMenu();
  };

  const submitRename = () => {
    if (!renameState.chatId || !renameState.text.trim()) return;
    renameMutation.mutate({
      chatId: renameState.chatId,
      title: renameState.text.trim(),
    });
    closeRenameModal();
  };

  const handleTogglePin = () => {
    const targetId = menuState.chatId;
    if (!targetId) return;
    togglePinMutation.mutate({
      chatId: targetId,
      isPinned: !menuState.isPinned,
    });
    closeMenu();
  };

  const handleDeleteChat = () => {
    const targetId = menuState.chatId;
    if (!targetId) return;
    deleteChatMutation.mutate(targetId);
    closeMenu();
  };
  const ChatRow = React.memo(
    ({ item }: { item: Chat }) => {
      return (
        <TouchableOpacity
          className="flex-row items-center justify-between py-2"
          activeOpacity={0.5}
          onPress={() => onSelectChat(item.id)}
          delayLongPress={150}
          onLongPress={(e) =>
            handleLongPress(e, item.id, item.title, item.isPinned)
          }
        >
          <Text
            className="flex-1 font-nata-sans-bold text-textLight dark:text-white text-base"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {item.title}
          </Text>
          {item.isPinned && (
            <MaterialCommunityIcons
              name="pin-outline"
              size={16}
              color={appTheme === "light" ? "#0F172A" : "#ffffff"}
            />
          )}
        </TouchableOpacity>
      );
    },
    (prevProps, nextProps) => {
      return (
        prevProps.item.id === nextProps.item.id &&
        prevProps.item.title === nextProps.item.title &&
        prevProps.item.isPinned === nextProps.item.isPinned
      );
    },
  );
  ChatRow.displayName = "ChatRow";
  const renderChatRow = ({ item }: { item: Chat }) => <ChatRow item={item} />;

  return (
    <View className="flex-1 w-full">
      {isLoading ? (
        <View className="flex-row mt-64 items-center justify-center">
          <ActivityIndicator color="#818CF8" size="small" />
          <Text className="ml-2 font-nata-sans-bold text-lg text-textLight dark:text-white">
            Loading your chats...
          </Text>
        </View>
      ) : (
        <>
          <FlashList
            data={sortedChats}
            renderItem={renderChatRow}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              gap: 2,
              paddingBottom: 4,
            }}
            ListEmptyComponent={
              <Text className="text-center mt-64 text-lg font-nata-sans-bold text-textLight dark:text-white">
                No chats found
              </Text>
            }
          />
        </>
      )}

      <Modal visible={menuState.visible} transparent animationType="fade">
        <TouchableOpacity
          className="flex-1"
          activeOpacity={1}
          onPress={closeMenu}
        >
          <View
            className="w-[220px] bg-cardLight dark:bg-[#313238] rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 p-3 gap-3"
            style={{
              top: menuState.y,
              left: menuState.x,
              position: "absolute",
              zIndex: 999,
            }}
          >
            <TouchableOpacity
              className="flex-row gap-2 items-center"
              activeOpacity={0.4}
              onPress={handleTogglePin}
            >
              {menuState.isPinned ? (
                <MaterialCommunityIcons
                  name="pin-off-outline"
                  size={20}
                  color={appTheme === "light" ? "#0F172A" : "#ffffff"}
                />
              ) : (
                <MaterialCommunityIcons
                  name="pin-outline"
                  size={20}
                  color={appTheme === "light" ? "#0F172A" : "#ffffff"}
                />
              )}
              <Text className="text-lg font-nata-sans-bold text-textLight dark:text-white">
                {menuState.isPinned ? "Unpin" : "Pin"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-row gap-2 items-center"
              activeOpacity={0.4}
              onPress={handleRenameChat}
            >
              <MaterialCommunityIcons name="pencil" size={20} co color={appTheme === "light" ? "#0F172A" : "#ffffff"} />
              <Text className="text-lg font-nata-sans-bold text-textLight dark:text-white">
                Rename
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-row gap-2 items-center"
              onPress={handleDeleteChat}
              activeOpacity={0.4}
            >
              <MaterialCommunityIcons
                name="delete-outline"
                size={20}
                color="red"
              />
              <Text className="text-lg font-nata-sans-bold text-textLight dark:text-white">
                Delete
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
      <Modal visible={renameState.visible} transparent animationType="fade">
        <KeyboardAvoidingView
          behavior="padding"
          className="flex-1 bg-black/50 justify-center items-center px-5"
        >
          <TouchableOpacity
            className="absolute inset-0"
            activeOpacity={1}
            onPress={closeRenameModal}
          />

          <View className="w-full max-w-[330px] border dark:border-white  bg-cardLight dark:bg-cardDark rounded-2xl p-5 shadow-2xl elevation-10 z-10">
            <Text className="text-lg font-bold text-textLight dark:text-textDark mb-4">
              Rename Chat
            </Text>
            <TextInput
              className="bg-gray-100 dark:bg-gray-800 text-textLight dark:text-textDark rounded-xl px-4 py-3 text-base mb-5"
              value={renameState.text}
              onChangeText={(text) =>
                setRenameState((prev) => ({ ...prev, text }))
              }
              placeholder="Enter new title..."
              placeholderTextColor="#9ca3af"
              autoFocus={true}
              selectionColor="#818CF8"
            />
            <View className="flex-row justify-end mt-2">
              <TouchableOpacity
                className="px-5 py-2 mr-2 rounded-lg active:bg-gray-100 dark:active:bg-gray-800"
                onPress={closeRenameModal}
              >
                <Text className="text-gray-500 font-medium">Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="bg-[#818CF8] px-5 py-2 rounded-lg active:opacity-80"
                onPress={submitRename}
              >
                <Text className="text-white font-medium">Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}
