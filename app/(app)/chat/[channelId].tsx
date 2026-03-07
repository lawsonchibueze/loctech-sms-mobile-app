import { useState, useRef, useEffect } from "react";
import { View, Text, FlatList, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuthStore } from "@/lib/auth-store";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  createdAt: string;
}

export default function ChatThreadScreen() {
  const { channelId } = useLocalSearchParams<{ channelId: string }>();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();
  const [text, setText] = useState("");
  const flatListRef = useRef<FlatList>(null);

  const { data: messages } = useQuery({
    queryKey: ["chat", channelId, "messages"],
    queryFn: () => api.get<Message[]>(`/sms/comms/channels/${channelId}/messages`),
    enabled: !!channelId,
    refetchInterval: 5000,
  });

  const sendMessage = useMutation({
    mutationFn: (content: string) =>
      api.post(`/sms/comms/channels/${channelId}/messages`, { content }),
    onSuccess: () => {
      setText("");
      queryClient.invalidateQueries({ queryKey: ["chat", channelId, "messages"] });
    },
  });

  const handleSend = () => {
    if (!text.trim()) return;
    sendMessage.mutate(text.trim());
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900">
      <View className="flex-row items-center px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <Button title="Back" variant="ghost" size="sm" onPress={() => router.back()} />
        <Text className="text-lg font-semibold text-gray-900 dark:text-white ml-2">Chat</Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
        keyboardVerticalOffset={90}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          contentContainerClassName="px-4 py-2"
          inverted={false}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
          renderItem={({ item }) => {
            const isMe = item.senderId === user?.id;
            return (
              <View className={`mb-2 max-w-[80%] ${isMe ? "self-end" : "self-start"}`}>
                {!isMe ? (
                  <Text className="text-xs text-gray-500 mb-0.5">{item.senderName}</Text>
                ) : null}
                <View className={`px-3 py-2 rounded-2xl ${isMe ? "bg-primary-600" : "bg-white dark:bg-gray-800"}`}>
                  <Text className={`text-sm ${isMe ? "text-white" : "text-gray-900 dark:text-white"}`}>
                    {item.content}
                  </Text>
                </View>
                <Text className={`text-xs mt-0.5 ${isMe ? "text-right" : ""} text-gray-400`}>
                  {new Date(item.createdAt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                </Text>
              </View>
            );
          }}
        />

        <View className="flex-row items-center px-4 py-2 border-t border-gray-200 dark:border-gray-700 gap-2">
          <View className="flex-1">
            <Input
              placeholder="Type a message..."
              value={text}
              onChangeText={setText}
              onSubmitEditing={handleSend}
              returnKeyType="send"
            />
          </View>
          <Button title="Send" size="sm" onPress={handleSend} loading={sendMessage.isPending} disabled={!text.trim()} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
