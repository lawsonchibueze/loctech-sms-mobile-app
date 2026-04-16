import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useSocket } from './useSocket';

interface Channel {
  id: string;
  name: string;
  type: string;
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
  threadId?: string;
  attachments?: any[];
}

export function useChannels() {
  return useQuery({
    queryKey: ['chat', 'channels'],
    queryFn: () => api.get<Channel[]>('/sms/comms/channels'),
  });
}

export function useMessages(channelId: string) {
  return useQuery({
    queryKey: ['chat', 'messages', channelId],
    queryFn: () => api.get<Message[]>(`/sms/comms/channels/${channelId}/messages`),
    enabled: !!channelId,
    // No more polling! Real-time updates come via Socket.io (useSocket hook)
    // Fallback: refetch on window focus (handled by TanStack Query defaults)
  });
}

export function useSendMessage(channelId: string) {
  const queryClient = useQueryClient();
  const { emit } = useSocket();

  return useMutation({
    mutationFn: async (content: string) => {
      // Send via Socket.io for real-time delivery
      emit('message.send', { channelId, content });
      // Also send via REST as fallback (ensures persistence)
      return api.post(`/sms/comms/channels/${channelId}/messages`, { content });
    },
    // Optimistic update: show message immediately
    onMutate: async (content: string) => {
      await queryClient.cancelQueries({ queryKey: ['chat', 'messages', channelId] });
      const previous = queryClient.getQueryData(['chat', 'messages', channelId]);

      queryClient.setQueryData(['chat', 'messages', channelId], (old: any) => {
        const optimisticMessage: Message = {
          id: `temp-${Date.now()}`,
          senderId: 'me',
          senderName: 'You',
          content,
          createdAt: new Date().toISOString(),
        };
        if (!old) return [optimisticMessage];
        if (Array.isArray(old)) return [...old, optimisticMessage];
        if (old.data && Array.isArray(old.data)) return { ...old, data: [...old.data, optimisticMessage] };
        return old;
      });

      return { previous };
    },
    onError: (_err, _content, context) => {
      // Rollback optimistic update on error
      if (context?.previous) {
        queryClient.setQueryData(['chat', 'messages', channelId], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['chat', 'channels'] });
    },
  });
}

export function useTypingIndicator(channelId: string) {
  const { emit } = useSocket();

  return {
    startTyping: () => emit('typing.start', { channelId }),
    stopTyping: () => emit('typing.stop', { channelId }),
  };
}
