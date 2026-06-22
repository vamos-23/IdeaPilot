import React, { useCallback, useRef, useState } from "react";
import {
  LayoutChangeEvent,
  StyleSheet,
  View,
  Keyboard,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";
import { KeyboardStickyView } from "react-native-keyboard-controller";
import ChatHeader from "@/src/components/ai-chat/ChatHeader";
import ChatInput from "@/src/components/ai-chat/ChatInput";
import ChatHistoryDrawer from "@/src/components/ai-chat/ChatHistoryDrawer";
import {
  ActiveChatArea,
  ActiveChatAreaRef,
} from "@/src/components/ai-chat/ActiveChatArea";
import SearchChatOverlay from "@/src/components/ai-chat/SearchChatOverlay";
import { useQueryClient } from "@tanstack/react-query";
import { Chat } from "@/src/constants/types";

const HEADER_HEIGHT = 76;
const BASE_INPUT_HEIGHT = 60;
const SCREEN_WIDTH = Dimensions.get("window").width;
const DRAWER_WIDTH = SCREEN_WIDTH * 0.74;

export default function AISuggestions() {
  //AI Screen Main Components
  const { top, bottom } = useSafeAreaInsets();
  const extraContentPadding = useSharedValue(0);
  const blankSpace = useSharedValue(0);
  const [activeChatId, setActiveChatId] = useState<string>("new");
  const [isFirstOpen, setFirstOpen] = useState<boolean>(true);
  const [isDrawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [isSearchOpen, setSearchOpen] = useState<boolean>(false);
  const [globalStreaming, setGlobalStreaming] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const chatAreaRef = useRef<ActiveChatAreaRef | null>(null);

  const handleSendPrompt = (text: string) => {
    if (chatAreaRef.current) {
      chatAreaRef.current.sendMessage(text);
      setGlobalStreaming(true);
      setTimeout(() => setGlobalStreaming(false), 20000);
    }
  };

  const drawerTranslateX = useSharedValue(-DRAWER_WIDTH);
  const overlayOpacity = useSharedValue(0);

  const toggleDrawer = useCallback(() => {
    Keyboard.dismiss();
    const isClosing = drawerTranslateX.value > -DRAWER_WIDTH / 2;
    if (isClosing) {
      drawerTranslateX.value = withTiming(-DRAWER_WIDTH, { duration: 250 });
      overlayOpacity.value = withTiming(0, { duration: 250 });
      scheduleOnRN(setDrawerOpen, false);
    } else {
      drawerTranslateX.value = withTiming(0, { duration: 300 });
      overlayOpacity.value = withTiming(1, { duration: 300 });
      scheduleOnRN(setDrawerOpen, true);
    }
  }, [overlayOpacity, drawerTranslateX]);

  const animatedDrawerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: drawerTranslateX.value }],
  }));

  const animatedOverlayStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
    zIndex: overlayOpacity.value === 0 ? -1 : 1500,
  }));

  const onInputLayout = useCallback(
    (e: LayoutChangeEvent) => {
      const height = e.nativeEvent.layout.height;
      extraContentPadding.value = withTiming(
        Math.max(height - BASE_INPUT_HEIGHT, 0),
        { duration: 200 },
      );
    },
    [extraContentPadding],
  );

  const selectChat = (chatId: string) => {
    setActiveChatId(chatId);
    toggleDrawer();
  };
  const searchChat = () => {
    setSearchOpen(true);
    toggleDrawer();
  };
  const newChat = () => {
    setFirstOpen(false);
    setActiveChatId("new");
    toggleDrawer();
  };

  const handleNewChatCreated = (newId: string) => {
    setFirstOpen(false);
    setActiveChatId(newId);
    queryClient.setQueryData<Chat[]>(["chats"], (oldChats) => {
      const currentChats = oldChats ? [...oldChats] : [];
      return [
        {
          id: newId,
          title: "AI Idea",
          isPinned: false,
        },
        ...currentChats,
      ];
    });
  };

  return (
    <View style={styles.container} className="bg-brandLight dark:bg-brandDark">
      <SafeAreaView
        edges={["top"]}
        style={[
          styles.header,
          { height: HEADER_HEIGHT + top, paddingTop: top },
        ]}
        className="bg-cardLight dark:bg-cardDark"
      >
        <ChatHeader toggleChatDrawer={toggleDrawer} />
      </SafeAreaView>
      <View style={styles.listContainer}>
        <ActiveChatArea
          ref={chatAreaRef}
          key={activeChatId}
          chatId={activeChatId}
          isFirstOpen={isFirstOpen}
          blankSpace={blankSpace}
          extraContentPadding={extraContentPadding}
          onNewChatStarted={handleNewChatCreated}
        />
      </View>
      <View
        style={{ opacity: isSearchOpen ? 0 : 1 }}
        pointerEvents={isSearchOpen ? "none" : "auto"}
      >
        <KeyboardStickyView offset={{ closed: 0, opened: 12 }}>
          <View style={{ paddingBottom: Math.max(bottom, 19) }}>
            <ChatInput
              onSend={handleSendPrompt}
              streamingStatus={globalStreaming}
              onLayoutChanges={onInputLayout}
            />
          </View>
        </KeyboardStickyView>
      </View>

      {/* Chat History Drawer */}
      <Animated.View
        className="absolute inset-0  dark:bg-black/50"
        style={[animatedOverlayStyle]}
      >
        <TouchableOpacity
          className="absolute inset-0 dark:bg-black/50"
          style={{
            zIndex: 1500,
          }}
          onPress={toggleDrawer}
          activeOpacity={1}
        />
      </Animated.View>

      <Animated.View
        className="absolute top-0 left-0 bottom-0 bg-cardLight dark:bg-cardDark"
        style={[
          animatedDrawerStyle,
          {
            paddingTop: top,
            width: DRAWER_WIDTH,
            zIndex: 2000,
            elevation: 20,
          },
        ]}
      >
        <ChatHistoryDrawer
          isDrawerOpen={isDrawerOpen}
          onNewChat={newChat}
          onSearchClicked={searchChat}
          onSelectChat={selectChat}
        />
      </Animated.View>

      <SearchChatOverlay
        isOpen={isSearchOpen}
        onClose={() => setSearchOpen(false)}
        onSelectChat={(id: string) => setActiveChatId(id)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  listContainer: { flex: 1 },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
});
