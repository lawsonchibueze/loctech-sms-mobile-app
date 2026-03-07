import { useState } from "react";
import { View, Text, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { LiveClassHost } from "@/components/live/LiveClassHost";

interface StreamInfo {
  id: string;
  title: string;
  status: "live" | "scheduled" | "ended";
  viewerCount: number;
}

interface LiveToken {
  token: string;
  roomName: string;
  serverUrl: string;
}

export default function LiveClassHostScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [liveToken, setLiveToken] = useState<LiveToken | null>(null);

  const { data: stream, isLoading, refetch } = useQuery({
    queryKey: ["stream", id],
    queryFn: () => api.get<StreamInfo>(`/sms/streaming/streams/${id}`),
    enabled: !!id,
  });

  const startStream = useMutation({
    mutationFn: () => api.post<LiveToken>(`/sms/streaming/streams/${id}/start`, {}),
    onSuccess: (data) => {
      setLiveToken(data);
      refetch();
    },
    onError: (error) => Alert.alert("Error", error.message),
  });

  const endStream = useMutation({
    mutationFn: () => api.post(`/sms/streaming/streams/${id}/end`, {}),
    onSuccess: () => {
      setLiveToken(null);
      refetch();
    },
    onError: (error) => Alert.alert("Error", error.message),
  });

  const confirmEnd = () => {
    Alert.alert("End Stream", "Are you sure you want to end the live class?", [
      { text: "Cancel", style: "cancel" },
      { text: "End", style: "destructive", onPress: () => endStream.mutate() },
    ]);
  };

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
          <Text className="text-gray-400 text-xs">{stream?.viewerCount ?? 0} viewers</Text>
        </View>
        {stream?.status === "live" ? <Badge label="LIVE" variant="error" /> : null}
      </View>

      <View className="flex-1 bg-black">
        {liveToken ? (
          <>
            <LiveClassHost
              token={liveToken.token}
              serverUrl={liveToken.serverUrl}
              onDisconnected={() => setLiveToken(null)}
            />
            <View className="px-4 py-2">
              <Button title="End Stream" variant="primary" onPress={confirmEnd} loading={endStream.isPending} />
            </View>
          </>
        ) : stream?.status === "live" ? (
          <View className="flex-1 items-center justify-center">
            <Card className="bg-gray-800 items-center">
              <Text className="text-white text-lg font-semibold mb-2">Broadcasting</Text>
              <Text className="text-gray-400 text-sm mb-4">{stream.viewerCount} viewers watching</Text>
              <Button title="Rejoin Stream" variant="primary" onPress={() => startStream.mutate()} loading={startStream.isPending} />
            </Card>
          </View>
        ) : stream?.status === "scheduled" ? (
          <View className="flex-1 items-center justify-center">
            <Card className="bg-gray-800 items-center">
              <Text className="text-white text-lg font-semibold mb-2">Ready to Start</Text>
              <Text className="text-gray-400 text-sm mb-4">Start the live class when ready</Text>
              <Button title="Go Live" variant="primary" size="lg" onPress={() => startStream.mutate()} loading={startStream.isPending} />
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
