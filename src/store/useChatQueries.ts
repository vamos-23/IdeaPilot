import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { apiClient } from "../services/api/apiClient";
import { Chat, MessagePage } from "../constants/types";

export function useChatHistory(isDrawerOpen: boolean) {
  return useQuery<Chat[]>({
    queryKey: ["chats"],
    queryFn: async () => {
      const { data: chatHistory } = await apiClient.get("/chats");
      return chatHistory;
    },
    staleTime: 1000 * 60 * 5,
    enabled: isDrawerOpen
  });
}

export function useChatMessages(chatId: string) {
  return useInfiniteQuery<MessagePage>({
    queryKey: ["messages", chatId],
    queryFn: async ({ pageParam = null }) => {
      const { data: chatMessages } = await apiClient.get(
        `/chats/${chatId}/messages`,
        { params: { cursor: pageParam } },
      );
      return chatMessages;
    },
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    staleTime: 1000 * 30,
    enabled: chatId !== "new"
  });
}

export function useToggleChatPinStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      chatId,
      isPinned,
    }: {
      chatId: string;
      isPinned: boolean;
    }) => {
      const { data } = await apiClient.patch(`/chats/${chatId}/pin`, {
        isPinned,
      });
      return data;
    },
    onMutate: async ({ chatId, isPinned }) => {
      //cancel any ongoing re-fetches so that their results do not affect the temporary UI optimistic updates
      await queryClient.cancelQueries({ queryKey: ["chats"] });
      //snapshot of Chat[] before the resolved state of the re-fetched list
      const previousChats = queryClient.getQueryData<Chat[]>(["chats"]);
      //Optimistic update on UI before actual call to backend via mutateFn
      queryClient.setQueryData<Chat[]>(["chats"], (old) => {
        if (!old) return [];
        return old.map((c) => (c.id === chatId ? { ...c, isPinned } : c));
      });
      return { previousChats };
    },
    onError: (_error, _var, context) => {
      if (context?.previousChats) {
        queryClient.setQueryData(["chats"], context.previousChats);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chats"] });
    },
  });
}

export function useRenameChat() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      chatId,
      title,
    }: {
      chatId: string;
      title: string;
    }) => {
      const { data } = await apiClient.patch(`/chats/${chatId}/rename`, {
        title,
      });
      return data;
    },
    onMutate: async ({ chatId, title }) => {
      await queryClient.cancelQueries({ queryKey: ["chats"] });
      const previousChats = queryClient.getQueryData<Chat[]>(["chats"]);
      queryClient.setQueryData<Chat[]>(["chats"], (old) => {
        if (!old) return [];
        return old.map((c) => (c.id === chatId ? { ...c, title } : c));
      });
      return { previousChats };
    },
    onError: (_error, _vars, context) => {
      if (context?.previousChats) {
        queryClient.setQueryData<Chat[]>(["chats"], context.previousChats);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chats"] });
    },
  });
}

export function useDeleteChat() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (chatId: string) => {
      const { data } = await apiClient.delete(`/chats/${chatId}`);
      return data;
    },
    onMutate: async (chatId) => {
      await queryClient.cancelQueries({ queryKey: ["chats"] });
      const previousChats = queryClient.getQueryData<Chat[]>(["chats"]);
      queryClient.setQueryData<Chat[]>(["chats"], (old) => {
        if (!old) return [];
        return old.filter((c) => c.id !== chatId);
      });
      return { previousChats };
    },
    onError: (_error, _vars, context) => {
      if (context?.previousChats) {
        queryClient.setQueryData<Chat[]>(["chats"], context.previousChats);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chats"] });
    },
  });
}
