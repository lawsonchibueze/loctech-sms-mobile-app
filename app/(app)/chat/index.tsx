import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { SkeletonCard } from "@/components/ui/Skeleton";

interface Channel {
  id: string;
  name: string;
  lastMessage?: string;
  lastMessageAt?: string;
  unreadCount: number;
}

export default function ChatScreen() {
  const router = useRouter();
  const { data: channels, isLoading } = useQuery({
    queryKey: ["chat", "channels"],
    queryFn: () => api.get<Channel[]>("/sms/comms/channels"),
  });

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900">
      <Text className="text-2xl font-bold text-gray-900 dark:text-white px-4 pt-4 mb-4">
        Messages
      </Text>

      {isLoading ? (
        <View className="px-4">{[1, 2, 3].map((i) => <SkeletonCard key={i} />)}</View>
      ) : !channels?.length ? (
        <EmptyState title="No conversations" description="Your chat channels will appear here." />
      ) : (
        <FlatList
          data={channels}
          keyExtractor={(item) => item.id}
          contentContainerClassName="px-4 pb-8"
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => router.push(`/(app)/chat/${item.id}`)}>
              <Card className="mb-2">
                <View className="flex-row items-center justify-between">
                  <View className="flex-1 mr-3">
                    <Text className="text-sm font-semibold text-gray-900 dark:text-white">{item.name}</Text>
                    {item.lastMessage ? (
                      <Text className="text-xs text-gray-500 mt-0.5" numberOfLines={1}>{item.lastMessage}</Text>
                    ) : null}
                  </View>
                  <View className="items-end">
                    {item.lastMessageAt ? (
                      <Text className="text-xs text-gray-400">
                        {new Date(item.lastMessageAt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                      </Text>
                    ) : null}
                    {item.unreadCount > 0 ? (
                      <View className="bg-primary-600 rounded-full px-1.5 py-0.5 mt-1">
                        <Text className="text-xs text-white font-bold">{item.unreadCount}</Text>
                      </View>
                    ) : null}
                  </View>
                </View>
              </Card>
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
}
