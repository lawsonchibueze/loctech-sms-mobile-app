import { useState } from "react";
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { LiveClassViewer } from "@/components/live/LiveClassViewer";

interface StreamInfo {
  id: string;
  title: string;
  hostName: string;
  status: "live" | "scheduled" | "ended";
  viewerCount: number;
  startedAt?: string;
}

interface LiveToken {
  token: string;
  roomName: string;
  serverUrl: string;
}

export default function LiveClassViewerScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [liveToken, setLiveToken] = useState<LiveToken | null>(null);

  const { data: stream, isLoading } = useQuery({
    queryKey: ["stream", id],
    queryFn: () => api.get<StreamInfo>(`/sms/streaming/streams/${id}`),
    enabled: !!id,
  });

  const joinStream = useMutation({
    mutationFn: () =>
      api.post<LiveToken>(`/sms/streaming/streams/${id}/token`, {}),
    onSuccess: (data) => setLiveToken(data),
  });

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-black">
        <Skeleton width="100%" height={300} borderRadius={0} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      <View className="flex-row items-center px-4 py-3">
        <Button title="Leave" variant="ghost" size="sm" onPress={() => router.back()} className="bg-white/10" />
        <View className="flex-1 ml-3">
          <Text className="text-white font-semibold">{stream?.title ?? "Live Class"}</Text>
          <Text className="text-gray-400 text-xs">{stream?.hostName}</Text>
        </View>
        {stream?.status === "live" ? <Badge label="LIVE" variant="error" /> : null}
      </View>

      <View className="flex-1 bg-black">
        {liveToken ? (
          <LiveClassViewer
            token={liveToken.token}
            serverUrl={liveToken.serverUrl}
            onDisconnected={() => setLiveToken(null)}
          />
        ) : stream?.status === "live" ? (
          <View className="flex-1 items-center justify-center">
            <Card className="bg-gray-800 items-center">
              <Text className="text-white text-lg font-semibold mb-2">Live Stream</Text>
              <Text className="text-gray-400 text-sm mb-1">{stream.viewerCount} viewers</Text>
              <Button
                title="Join Stream"
                variant="primary"
                size="lg"
                className="mt-3"
                onPress={() => joinStream.mutate()}
                loading={joinStream.isPending}
              />
            </Card>
          </View>
        ) : stream?.status === "scheduled" ? (
          <View className="flex-1 items-center justify-center">
            <Card className="bg-gray-800 items-center">
              <Text className="text-white text-lg font-semibold mb-2">Scheduled</Text>
              <Text className="text-gray-400 text-sm">This class hasn't started yet</Text>
            </Card>
          </View>
        ) : (
          <View className="flex-1 items-center justify-center">
            <Card className="bg-gray-800 items-center">
              <Text className="text-white text-lg font-semibold mb-2">Stream Ended</Text>
              <Text className="text-gray-400 text-sm">This live class has ended</Text>
            </Card>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
