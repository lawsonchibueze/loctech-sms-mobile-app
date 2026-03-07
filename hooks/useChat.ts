import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

interface Channel {
  id: string;
  name: string;
  lastMessage?: string;
  lastMessageAt?: string;
  unreadCount: number;
}

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  createdAt: string;
}

export function useChannels() {
  return useQuery({
    queryKey: ["chat", "channels"],
    queryFn: () => api.get<Channel[]>("/sms/comms/channels"),
  });
}

export function useMessages(channelId: string) {
  return useQuery({
    queryKey: ["chat", "messages", channelId],
    queryFn: () => api.get<Message[]>(`/sms/comms/channels/${channelId}/messages`),
    enabled: !!channelId,
    refetchInterval: 5000,
  });
}

export function useSendMessage(channelId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (content: string) =>
      api.post(`/sms/comms/channels/${channelId}/messages`, { content }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chat", "messages", channelId] });
      queryClient.invalidateQueries({ queryKey: ["chat", "channels"] });
    },
  });
}
