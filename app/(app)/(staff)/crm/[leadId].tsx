import { View, Text, ScrollView, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useLeadDetail, useUpdateLeadStatus } from "@/hooks/useCRM";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";

const STATUSES = ["new", "contacted", "qualified", "proposal", "negotiation", "enrolled", "lost"] as const;

export default function LeadDetailScreen() {
  const { leadId } = useLocalSearchParams<{ leadId: string }>();
  const router = useRouter();
  const { data: lead, isLoading } = useLeadDetail(leadId);
  const updateStatus = useUpdateLeadStatus();

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900 px-4 pt-4">
        <Skeleton width="60%" height={24} className="mb-4" />
        <Skeleton width="100%" height={120} />
      </SafeAreaView>
    );
  }

  if (!lead) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center">
        <Text className="text-gray-500">Lead not found</Text>
        <Button title="Go Back" variant="ghost" onPress={() => router.back()} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900">
      <ScrollView className="flex-1 px-4 pt-4">
        <Button title="Back" variant="ghost" size="sm" onPress={() => router.back()} className="self-start mb-2" />

        <Text className="text-xl font-bold text-gray-900 dark:text-white mb-1">{lead.name}</Text>
        <Text className="text-sm text-gray-500">{lead.email}</Text>
        {lead.phone ? <Text className="text-sm text-gray-500">{lead.phone}</Text> : null}

        <View className="flex-row flex-wrap gap-2 mt-3 mb-4">
          {STATUSES.map((s) => (
            <Button
              key={s}
              title={s}
              size="sm"
              variant={lead.status === s ? "primary" : "outline"}
              onPress={() => updateStatus.mutate({ leadId, status: s })}
              loading={updateStatus.isPending}
            />
          ))}
        </View>

        <Card className="mb-4">
          <View className="flex-row justify-between mb-2">
            <Text className="text-sm text-gray-500">Score</Text>
            <Text className="text-sm font-bold text-primary-600">{lead.leadScore}</Text>
          </View>
          <View className="flex-row justify-between mb-2">
            <Text className="text-sm text-gray-500">Source</Text>
            <Text className="text-sm font-medium text-gray-900 dark:text-white">{lead.source}</Text>
          </View>
          {lead.interestedProgram ? (
            <View className="flex-row justify-between">
              <Text className="text-sm text-gray-500">Interest</Text>
              <Text className="text-sm font-medium text-gray-900 dark:text-white">{lead.interestedProgram}</Text>
            </View>
          ) : null}
        </Card>

        {lead.notes ? (
          <Card className="mb-4">
            <Text className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Notes</Text>
            <Text className="text-sm text-gray-600 dark:text-gray-400">{lead.notes}</Text>
          </Card>
        ) : null}

        <Text className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Timeline</Text>
        {lead.timeline.map((event) => (
          <Card key={event.id} className="mb-2">
            <Text className="text-xs text-gray-500">{new Date(event.createdAt).toLocaleString()}</Text>
            <Text className="text-sm text-gray-900 dark:text-white mt-1">{event.description}</Text>
          </Card>
        ))}
        <View className="h-8" />
      </ScrollView>
    </SafeAreaView>
  );
}
