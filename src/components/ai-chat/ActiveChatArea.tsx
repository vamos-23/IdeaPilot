import {
  View,
  StyleSheet,
  ScrollViewProps,
  ActivityIndicator,
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
  useRef,
  //useState,
} from "react";
import { useChatMessages } from "@/src/store/useChatQueries";
import useAuthStore from "@/src/store/useAuthStore";
import { useQueryClient, InfiniteData } from "@tanstack/react-query";
import * as Crypto from "expo-crypto";
import { useSafeAreaInsets } from "react-native-safe-area-context";
//import RNEventSource from "react-native-sse";

export interface ActiveChatAreaRef {
  sendMessage: (prompt: string) => void;
}

export interface ActiveChatAreaProps {
  isFirstOpen: boolean;
  ref: React.RefObject<ActiveChatAreaRef | null>;
  chatId: string;
  blankSpace: SharedValue<number>;
  extraContentPadding: SharedValue<number>;
  onNewChatStarted: (currentChatId: string) => void;
}

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
      keyboardLiftBehavior="whenAtEnd"
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
  blankSpace,
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
    fetchNextPage,
  } = useChatMessages(chatId);
  const messages = chatMessages?.pages.flatMap((page) => page.messages) || [];
  //const [isStreaming, setStreaming] = useState<boolean>(false);

  useImperativeHandle(ref, () => ({
    sendMessage: (prompt: string) => handleSendPrompt(prompt),
    //streamStatus: isStreaming,
  }));

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      if (messages.length > 0) {
        flashListRef.current?.scrollToEnd({ animated: true });
        chatScrollViewRef.current?.scrollToEnd({ animated: true });
      }
    });
  }, [messages.length]);

  function handleSendPrompt(prompt: string) {
    let currentChatId = chatId;
    if (isNewChat) {
      const chat_UUID = Crypto.randomUUID();
      currentChatId = `chat-${chat_UUID}`;
      onNewChatStarted(currentChatId);
    }

    const userId = `${Crypto.randomUUID()}-user`;
    const userMessage: Message = {
      id: userId,
      role: "user",
      content: prompt,
    };
    const assistantId = `${Crypto.randomUUID()}-assistant`;
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
            : [{ messages: [], nextCursor: null }];
        const newPageParams =
          oldPageParams.length > 0 ? [...oldPageParams] : [null];

        const lastPageIndex = newPages.length - 1;
        newPages[lastPageIndex] = {
          ...newPages[lastPageIndex],
          messages: [
            ...(newPages[lastPageIndex].messages || []),
            userMessage,
            assistantMessage,
          ],
        };
        return {
          pages: newPages,
          pageParams: newPageParams,
        };
      },
    );
    requestAnimationFrame(scrollToBottom);
    //responseStreaming(assistantId, userId, currentChatId, prompt);
  }

  // async function responseStreaming(
  //   assistantId: string,
  //   userId: string,
  //   currentChatId: string,
  //   promptText: string,
  // ) {
  //   let currentText = "";
  //   blankSpace.value = 350;
  //   setStreaming(true);

  //   const params = new URLSearchParams({
  //     prompt: promptText,
  //     useMessageId: userId,
  //     assistantMessageId: assistantId,
  //   });
  //   const url = `http://192.168.1.12:3000/chats/${currentChatId}/stream?${params.toString()}`;

  //   const eventSource = new RNEventSource(url, {
  //     method: "GET",
  //     headers: {
  //       Accept: "text/event-stream",
  //     },
  //   });

  //   eventSource.addEventListener("message", (event) => {
  //     if (!event.data || event.data === "[DONE]") {
  //       eventSource.close();
  //       setStreaming(false);
  //       blankSpace.value = withTiming(0, { duration: 250 });

  //       queryClient.setQueryData(
  //         ["messages", currentChatId],
  //         (oldData: InfiniteData<MessagePage> | undefined) => {
  //           if (!oldData?.pages) return oldData;
  //           const newPages = [...oldData.pages];
  //           const lastPageIndex = newPages.length - 1;
  //           newPages[lastPageIndex] = {
  //             ...newPages[lastPageIndex],
  //             messages: newPages[lastPageIndex].messages.map((msg) =>
  //               msg.id === assistantId ? { ...msg, isStreaming: false } : msg,
  //             ),
  //           };
  //           return { ...oldData, pages: newPages };
  //         },
  //       );
  //       return;
  //     }

  //     try {
  //       const parsed = JSON.parse(event.data);
  //       if (parsed.text) {
  //         currentText += parsed.text;

  //         queryClient.setQueryData(
  //           ["messages", currentChatId],
  //           (oldData: InfiniteData<MessagePage> | undefined) => {
  //             if (!oldData?.pages) return oldData;
  //             const newPages = [...oldData.pages];
  //             const lastPageIndex = newPages.length - 1;
  //             newPages[lastPageIndex] = {
  //               ...newPages[lastPageIndex],
  //               messages: newPages[lastPageIndex].messages.map((msg) =>
  //                 msg.id === assistantId
  //                   ? { ...msg, content: currentText, isStreaming: true }
  //                   : msg,
  //               ),
  //             };
  //             return { ...oldData, pages: newPages };
  //           },
  //         );
  //         requestAnimationFrame(scrollToBottom);
  //       }
  //     } catch (error) {
  //       console.error("SSE JSON parsing error:", error);
  //     }
  //   });

  //   eventSource.addEventListener("error", (error) => {
  //     console.error("Streaming network error event emitted:", error);
  //     eventSource.close();
  //     setStreaming(false);
  //     blankSpace.value = withTiming(0, { duration: 250 });
  //   });
  // }

  const renderMessage = ({ item }: { item: Message }) => {
    const isUser = item.role === "user";
    return (
      <View className={`mb-3 ${isUser ? "items-end" : "items-start"}`}>
        {isUser ? (
          <UserBubble content={item.content} />
        ) : (
          <AssistantBubble
            content={item.content}
            isStreaming={item.isStreaming as boolean}
          />
        )}
      </View>
    );
  };

  const renderScrollComponent = useCallback(
    (props: ScrollViewProps) => (
      <VirtualizedListScrollView
        {...props}
        chatScrollViewRef={chatScrollViewRef}
        extraContentPadding={extraContentPadding}
        blankSpace={blankSpace}
      />
    ),
    [extraContentPadding, blankSpace],
  );

  const onScrollEndReached = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  return (
    <View style={StyleSheet.absoluteFillObject}>
      <AnimatedEmptyScreen
        isFirstOpen={isFirstOpen}
        isVisible={messages.length === 0 && isNewChat}
        username={username}
      />
      <FlashList
        ref={flashListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        //@ts-ignore
        estimatedItemSize={100}
        renderScrollComponent={renderScrollComponent}
        onEndReached={onScrollEndReached}
        onEndReachedThreshold={0.2}
        contentContainerStyle={{
          paddingTop: HEADER_HEIGHT + top,
          paddingHorizontal: 16,
        }}
        ListFooterComponent={
          isFetchingNextPage ? (
            <ActivityIndicator color="#818CF8" className="my-4" size="small" />
          ) : null
        }
      />
    </View>
  );
}
