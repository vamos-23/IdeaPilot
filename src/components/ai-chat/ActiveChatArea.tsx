import "react-native-get-random-values";
import {
  View,
  StyleSheet,
  ScrollViewProps,
  ActivityIndicator,
  Keyboard,
} from "react-native";
import { KeyboardChatScrollView } from "react-native-keyboard-controller";
import { SharedValue } from "react-native-reanimated";
import { FlashList, FlashListRef } from "@shopify/flash-list";
import AnimatedEmptyScreen from "./AnimatedEmptyScreen";
import UserBubble from "./UserBubble";
import AssistantBubble from "./AssistantBubble";
import {
  Message,
  MessagePage,
  ChatScrollViewProps,
  ChatScrollViewRef,
} from "@/src/constants/types";
import {
  forwardRef,
  RefCallback,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react";
import { useChatMessages } from "@/src/store/useChatQueries";
import useAuthStore from "@/src/store/useAuthStore";
import useSkillStore from "@/src/store/useSkillStore";
import { useQueryClient, InfiniteData } from "@tanstack/react-query";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { apiClient } from "@/src/services/api/apiClient";
import { monotonicFactory } from "ulidx";
import * as Crypto from "expo-crypto";

export interface ActiveChatAreaRef {
  sendMessage: (prompt: string) => Promise<void>;
}

export interface ActiveChatAreaProps {
  isFirstOpen: boolean;
  ref: React.RefObject<ActiveChatAreaRef | null>;
  chatId: string;
  extraContentPadding: SharedValue<number>;
  onNewChatStarted: (currentChatId: string) => void;
}

const generateULID = monotonicFactory();

const HEADER_HEIGHT = 76;

const VirtualizedListScrollView = forwardRef<
  ChatScrollViewRef,
  ChatScrollViewProps
>(({ chatScrollViewRef, ...props }, ref) => {
  const combinedRef: RefCallback<ChatScrollViewRef> = useCallback(
    (instance) => {
      if (typeof ref === "function") ref(instance);
      else if (ref) ref.current = instance;
      if (chatScrollViewRef) chatScrollViewRef.current = instance;
    },
    [ref, chatScrollViewRef],
  );

  return (
    <KeyboardChatScrollView
      ref={combinedRef}
      {...props}
      keyboardDismissMode="interactive"
      keyboardShouldPersistTaps="handled"
      keyboardLiftBehavior="never"
      contentInsetAdjustmentBehavior="never"
      automaticallyAdjustKeyboardInsets={true}
    />
  );
});
VirtualizedListScrollView.displayName = "VirtualizedListScrollView";

export function ActiveChatArea({
  ref,
  chatId,
  isFirstOpen,
  extraContentPadding,
  onNewChatStarted,
}: ActiveChatAreaProps) {
  const { top } = useSafeAreaInsets();
  const username = useAuthStore((state) => state.user?.userName);
  const flashListRef = useRef<FlashListRef<Message>>(null);
  const chatScrollViewRef = useRef<ChatScrollViewRef>(null);
  const queryClient = useQueryClient();
  const isNewChat = chatId === "new";

  const {
    data: chatMessages,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    fetchNextPage,
  } = useChatMessages(chatId);

  const messages = useMemo(
    () => chatMessages?.pages.flatMap((page) => page.messages) || [],
    [chatMessages?.pages],
  );

  const projectPreviewLatestId =
    chatMessages?.pages?.[0]?.latestPreviewId || null;

  useImperativeHandle(ref, () => ({
    sendMessage: async (prompt: string) => await handleSendPrompt(prompt),
  }));

  const scrollToBottom = () => {
    flashListRef.current?.scrollToIndex({
      index: 0,
      animated: true,
      viewPosition: 0,
    });
  };

  async function handleSendPrompt(prompt: string) {
    let currentChatId = chatId;
    if (isNewChat) {
      const chat_UUID = Crypto.randomUUID();
      currentChatId = `chat-${chat_UUID}`;
      onNewChatStarted(currentChatId);
    }

    const userId = generateULID();
    const assistantId = generateULID();

    const userMessage: Message = {
      id: userId,
      role: "user",
      content: prompt,
    };

    const assistantMessage: Message = {
      id: assistantId,
      role: "assistant",
      content: "",
      isStreaming: true,
    };

    queryClient.setQueryData(
      ["messages", currentChatId],
      (oldData: InfiniteData<MessagePage> | undefined) => {
        const oldPages = oldData?.pages || [];
        const oldPageParams = oldData?.pageParams || [];

        const newPages =
          oldPages.length > 0
            ? [...oldPages]
            : [{ messages: [], nextCursor: null, latestPreviewId: null }];
        const newPageParams =
          oldPageParams.length > 0 ? [...oldPageParams] : [null];

        newPages[0] = {
          ...newPages[0],
          messages: [
            assistantMessage,
            userMessage,
            ...(newPages[0].messages || []),
          ],
        };
        return {
          pages: newPages,
          pageParams: newPageParams,
        };
      },
    );
    Keyboard.dismiss();
    scrollToBottom();
    await responseStreaming(userId, assistantId, currentChatId, prompt);
  }

  async function responseStreaming(
    userId: string,
    assistantId: string,
    currentChatId: string,
    promptText: string,
  ) {
    const userTechStack = useSkillStore.getState().skills || [];
    try {
      const response = await apiClient.post(`/${currentChatId}/stream`, {
        userMessageId: userId,
        assistantMessageId: assistantId,
        prompt: promptText,
        techStack: userTechStack,
      });
      const finalContent = response.data?.text || "No generation provided";

      queryClient.setQueryData(
        ["messages", currentChatId],
        (oldData: InfiniteData<MessagePage> | undefined) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            pages: oldData.pages.map((page, index) => {
              const isFirstPage = index === 0;
              const hasProject = /```json_idea/i.test(finalContent);
              return {
                ...page,
                ...(isFirstPage && hasProject
                  ? { latestPreviewId: assistantId }
                  : {}),
                messages: page.messages.map((msg) =>
                  msg.id === assistantId
                    ? { ...msg, content: finalContent, isStreaming: false }
                    : msg,
                ),
              };
            }),
          };
        },
      );
    } catch {
      queryClient.setQueryData(
        ["messages", currentChatId],
        (oldData: InfiniteData<MessagePage> | undefined) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              messages: page.messages.map((msg) =>
                msg.id === assistantId
                  ? {
                      ...msg,
                      content:
                        "Failed to connect or generate a response. Try again later after sometime. ",
                      isStreaming: false,
                    }
                  : msg,
              ),
            })),
          };
        },
      );
    }
  }

  const latestPreviewMessageId = useMemo(() => {
    const isActivelyStreaming = messages.some((msg) => msg.isStreaming);
    if (isActivelyStreaming) {
      const livePreviewMessage = messages.find(
        (msg) => msg.role === "assistant" && /```json_idea/i.test(msg.content),
      );
      return livePreviewMessage?.id;
    }
    if (projectPreviewLatestId) {
      return projectPreviewLatestId;
    }
  }, [messages, projectPreviewLatestId]);

  const renderMessage = useCallback(
    ({ item }: { item: Message }) => {
      const isUser = item.role === "user";
      return (
        <View
          className={`mb-3 w-full ${isUser ? "items-end" : "items-start"}`}
          style={{ transform: [{ scaleY: -1 }] }}
        >
          {isUser ? (
            <UserBubble content={item.content} />
          ) : (
            <AssistantBubble
              messageId={item.id}
              content={item.content}
              isLatestPreview={item.id === latestPreviewMessageId}
              isStreaming={item.isStreaming as boolean}
            />
          )}
        </View>
      );
    },
    [latestPreviewMessageId],
  );

  const renderScrollComponent = useCallback(
    (props: ScrollViewProps) => (
      <VirtualizedListScrollView
        {...props}
        chatScrollViewRef={chatScrollViewRef}
        extraContentPadding={extraContentPadding}
      />
    ),
    [extraContentPadding],
  );

  const onScrollEndReached = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const getItemType = (item: Message) => {
    return item.role;
  };

  return (
    <View style={styles.container}>
      {isLoading && (
        <View
          className="flex-1 mt-72 justify-center items-center"
          style={{ transform: [{ scaleY: -1 }] }}
        >
          <ActivityIndicator color="white" className="my-4" size="large" />
        </View>
      )}
      <AnimatedEmptyScreen
        isFirstOpen={isFirstOpen}
        isVisible={messages.length === 0 && isNewChat}
        username={username}
      />
      <FlashList
        ref={flashListRef}
        data={messages}
        style={{ transform: [{ scaleY: -1 }] }}
        drawDistance={500}
        renderItem={renderMessage}
        extraData={[isFetchingNextPage, latestPreviewMessageId]}
        keyExtractor={(item) => item.id}
        getItemType={getItemType}
        renderScrollComponent={renderScrollComponent}
        removeClippedSubviews={true}
        keyboardDismissMode="interactive"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={20}
        onEndReachedThreshold={0.5}
        onEndReached={onScrollEndReached}
        contentContainerStyle={{
          paddingBottom: HEADER_HEIGHT + top,
          paddingTop: 10,
          paddingHorizontal: 14,
        }}
        ListFooterComponent={
          isFetchingNextPage ? (
            <View
              className="py-4 h-6 my-5 items-center justify-center"
              style={{ transform: [{ scaleY: -1 }] }}
            >
              <ActivityIndicator
                color="#818CF8"
                className="my-4"
                size="large"
              />
            </View>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
