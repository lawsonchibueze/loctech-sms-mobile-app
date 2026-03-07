import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";

interface StreamInfo {
  id: string;
  title: string;
  hostName: string;
  status: "live" | "scheduled" | "ended";
  viewerCount: number;
  startedAt?: string;
}

export default function LiveClassViewerScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const { data: stream, isLoading } = useQuery({
    queryKey: ["stream", id],
    queryFn: () => api.get<StreamInfo>(`/sms/streaming/streams/${id}`),
    enabled: !!id,
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

      {/* Video area placeholder - LiveKit integration in future */}
      <View className="flex-1 bg-black items-center justify-center">
        {stream?.status === "live" ? (
          <Card className="bg-gray-800 items-center">
            <Text className="text-white text-lg font-semibold mb-2">Live Stream</Text>
            <Text className="text-gray-400 text-sm mb-1">{stream.viewerCount} viewers</Text>
            <Text className="text-gray-500 text-xs">LiveKit viewer will be integrated here</Text>
          </Card>
        ) : stream?.status === "scheduled" ? (
          <Card className="bg-gray-800 items-center">
            <Text className="text-white text-lg font-semibold mb-2">Scheduled</Text>
            <Text className="text-gray-400 text-sm">This class hasn't started yet</Text>
          </Card>
        ) : (
          <Card className="bg-gray-800 items-center">
            <Text className="text-white text-lg font-semibold mb-2">Stream Ended</Text>
            <Text className="text-gray-400 text-sm">This live class has ended</Text>
          </Card>
        )}
      </View>
    </SafeAreaView>
  );
}
