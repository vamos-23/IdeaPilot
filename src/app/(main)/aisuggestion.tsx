import { useCallback, useRef, useState, startTransition } from "react";
import {
  StyleSheet,
  View,
  Keyboard,
  Dimensions,
  LayoutChangeEvent,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import Animated, {
  withTiming,
  useAnimatedStyle,
  FadeIn,
  useSharedValue,
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
const DRAWER_WIDTH = Dimensions.get("window").width;
const MIN_INPUT_HEIGHT = 36;

export default function AISuggestions() {
  const { top, bottom } = useSafeAreaInsets();
  const extraContentPadding = useSharedValue(0);
  const [activeChatId, setActiveChatId] = useState<string>("new");
  const pendingChatId = useRef<string | null>(null);
  const [isFirstOpen, setFirstOpen] = useState<boolean>(true);
  const [isDrawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [isSearchOpen, setSearchOpen] = useState<boolean>(false);
  const [globalStreaming, setGlobalStreaming] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const chatAreaRef = useRef<ActiveChatAreaRef | null>(null);

  const handleSendPrompt = async (text: string) => {
    if (chatAreaRef.current) {
      setGlobalStreaming(true);
      try {
        await chatAreaRef.current.sendMessage(text);
      } finally {
        setGlobalStreaming(false);
      }
    }
  };

  const drawerTranslateX = useSharedValue(-DRAWER_WIDTH);
  const toggleDrawer = useCallback(() => {
    Keyboard.dismiss();

    const isClosing = drawerTranslateX.value > -DRAWER_WIDTH / 2;
    const targetValue = isClosing ? -DRAWER_WIDTH : 0;

    const handleFinish = (
      finished: boolean | undefined,
      wasClosing: boolean,
    ) => {
      if (finished) {
        setDrawerOpen(!wasClosing);
        if (wasClosing && pendingChatId.current) {
          startTransition(() => {
            setActiveChatId(pendingChatId.current!);
            pendingChatId.current = null;
          });
        }
      }
    };

    drawerTranslateX.value = withTiming(
      targetValue,
      { duration: 350 },
      (finished) => {
        scheduleOnRN(handleFinish, finished, isClosing);
      },
    );
  }, [drawerTranslateX]);

  const animatedDrawerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: drawerTranslateX.value }],
  }));

  const selectChat = (chatId: string) => {
    pendingChatId.current = chatId;
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
    setActiveChatId(newId);
    queryClient.setQueryData<Chat[]>(["chats"], (oldChats) => {
      const currentChats = oldChats ? [...oldChats] : [];
      return [
        { id: newId, title: "AI Idea", isPinned: false },
        ...currentChats,
      ];
    });
  };

  const onInputLayout = useCallback(
    (e: LayoutChangeEvent) => {
      const height = e.nativeEvent.layout.height;

      extraContentPadding.value = withTiming(
        Math.max(height - MIN_INPUT_HEIGHT, 0),
        { duration: 250 },
      );
    },
    [extraContentPadding],
  );

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
        <Animated.View
          style={{ flex: 1 }}
          entering={FadeIn.duration(400).springify()}
          key={activeChatId}
        >
          <ActiveChatArea
            ref={chatAreaRef}
            chatId={activeChatId}
            isFirstOpen={isFirstOpen}
            extraContentPadding={extraContentPadding}
            onNewChatStarted={handleNewChatCreated}
          />
        </Animated.View>
      </View>

      <KeyboardStickyView
        offset={{ closed: 0, opened: 12 }}
        style={{
          opacity: isSearchOpen ? 0 : 1,
          marginBottom: Math.max(bottom, 19),
          marginHorizontal: 10,
          padding: 5,
          borderRadius: 30,
          backgroundColor: "transparent",
          alignItems: "center",
        }}
        pointerEvents={isSearchOpen ? "none" : "auto"}
      >
        <ChatInput
          onSend={handleSendPrompt}
          streamingStatus={globalStreaming}
          onLayoutChanges={onInputLayout}
        />
      </KeyboardStickyView>

      <Animated.View
        className="absolute top-0 left-0 bottom-0 bg-cardLight dark:bg-cardDark"
        style={[
          animatedDrawerStyle,
          { paddingTop: top, width: DRAWER_WIDTH, zIndex: 2000, elevation: 20 },
        ]}
      >
        <ChatHistoryDrawer
          isDrawerOpen={isDrawerOpen}
          onNewChat={newChat}
          onSearchClicked={searchChat}
          onSelectChat={selectChat}
          onClose={toggleDrawer}
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
  header: { position: "absolute", top: 0, left: 0, right: 0, zIndex: 1000 },
});
