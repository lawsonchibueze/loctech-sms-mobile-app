import { useQuery, useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";

interface Stream {
  id: string;
  title: string;
  hostName: string;
  status: "live" | "scheduled" | "ended";
  viewerCount: number;
  startedAt?: string;
  scheduledAt?: string;
}

interface LiveToken {
  token: string;
  roomName: string;
  serverUrl: string;
}

export function useStreams() {
  return useQuery({
    queryKey: ["streams"],
    queryFn: () => api.get<Stream[]>("/sms/streaming/streams"),
  });
}

export function useStream(id: string) {
  return useQuery({
    queryKey: ["stream", id],
    queryFn: () => api.get<Stream>(`/sms/streaming/streams/${id}`),
    enabled: !!id,
  });
}

export function useLiveToken(streamId: string) {
  return useMutation({
    mutationFn: () =>
      api.post<LiveToken>(`/sms/streaming/streams/${streamId}/token`, {}),
  });
}

export function useStartStream(streamId: string) {
  return useMutation({
    mutationFn: () =>
      api.post(`/sms/streaming/streams/${streamId}/start`, {}),
  });
}

export function useEndStream(streamId: string) {
  return useMutation({
    mutationFn: () =>
      api.post(`/sms/streaming/streams/${streamId}/end`, {}),
  });
}
