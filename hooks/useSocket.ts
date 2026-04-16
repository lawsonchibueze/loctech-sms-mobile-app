import { useEffect, useRef, useCallback } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { io, Socket } from 'socket.io-client';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/lib/auth-store';

const SOCKET_URL = process.env.EXPO_PUBLIC_SOCKET_URL || process.env.EXPO_PUBLIC_API_URL?.replace('/api/v1', '').replace('/api/v2', '') || '';

export function useSocket() {
  const socketRef = useRef<Socket | null>(null);
  const queryClient = useQueryClient();
  const { accessToken, isAuthenticated } = useAuthStore();

  const connect = useCallback(() => {
    if (!isAuthenticated || !accessToken || !SOCKET_URL) return;
    if (socketRef.current?.connected) return;

    const socket = io(`${SOCKET_URL}/comms`, {
      auth: { token: accessToken },
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 30000,
    });

    socket.on('connect', () => {
      console.log('[Socket] Connected:', socket.id);
    });

    socket.on('disconnect', (reason) => {
      console.log('[Socket] Disconnected:', reason);
    });

    socket.on('connect_error', (err) => {
      console.warn('[Socket] Connection error:', err.message);
    });

    // Real-time message events → update TanStack Query cache
    socket.on('message.created', (data: { channelId: string; message: any }) => {
      queryClient.setQueryData(
        ['chat', 'messages', data.channelId],
        (old: any) => {
          if (!old) return [data.message];
          if (Array.isArray(old)) return [...old, data.message];
          if (old.data && Array.isArray(old.data)) return { ...old, data: [...old.data, data.message] };
          return old;
        },
      );
      // Update channel list (last message)
      queryClient.invalidateQueries({ queryKey: ['chat', 'channels'] });
    });

    socket.on('message.updated', (data: { channelId: string; messageId: string; content: string }) => {
      queryClient.invalidateQueries({ queryKey: ['chat', 'messages', data.channelId] });
    });

    socket.on('message.deleted', (data: { channelId: string; messageId: string }) => {
      queryClient.invalidateQueries({ queryKey: ['chat', 'messages', data.channelId] });
    });

    socket.on('typing.updated', () => {
      // Handled by local state in the chat screen, not query cache
    });

    socket.on('presence.updated', () => {
      queryClient.invalidateQueries({ queryKey: ['chat', 'presence'] });
    });

    // Call events
    socket.on('call.ring', (data: any) => {
      console.log('[Socket] Incoming call:', data);
      // TODO: Show incoming call UI
    });

    socket.on('call.ended', (data: any) => {
      console.log('[Socket] Call ended:', data);
    });

    socketRef.current = socket;
  }, [isAuthenticated, accessToken, queryClient]);

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
  }, []);

  // Connect on mount, disconnect on unmount
  useEffect(() => {
    connect();
    return () => disconnect();
  }, [connect, disconnect]);

  // Handle app state changes (foreground/background)
  useEffect(() => {
    const handleAppStateChange = (nextState: AppStateStatus) => {
      if (nextState === 'active') {
        connect();
        // Revalidate missed messages on foreground
        queryClient.invalidateQueries({ queryKey: ['chat'] });
      } else if (nextState === 'background' || nextState === 'inactive') {
        disconnect();
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription.remove();
  }, [connect, disconnect, queryClient]);

  const emit = useCallback((event: string, data: any, callback?: (response: any) => void) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit(event, data, callback);
    }
  }, []);

  return {
    socket: socketRef.current,
    isConnected: socketRef.current?.connected ?? false,
    emit,
    connect,
    disconnect,
  };
}
