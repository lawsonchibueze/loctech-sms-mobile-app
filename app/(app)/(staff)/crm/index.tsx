import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useLeads } from "@/hooks/useCRM";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { SkeletonCard } from "@/components/ui/Skeleton";

const STATUS_VARIANT = {
  new: "info",
  contacted: "default",
  qualified: "success",
  proposal: "warning",
  negotiation: "warning",
  enrolled: "success",
  lost: "error",
} as const;

export default function CRMScreen() {
  const router = useRouter();
  const { data: leads, isLoading } = useLeads();

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900">
      <View className="flex-row items-center justify-between px-4 pt-4 mb-4">
        <Text className="text-xl font-bold text-gray-900 dark:text-white">CRM Pipeline</Text>
        <Button title="+ Lead" size="sm" onPress={() => router.push("/(app)/(staff)/crm/create")} />
      </View>

      {isLoading ? (
        <View className="px-4">{[1, 2, 3].map((i) => <SkeletonCard key={i} />)}</View>
      ) : !leads?.length ? (
        <EmptyState title="No leads" description="Create your first lead." actionLabel="Add Lead" onAction={() => router.push("/(app)/(staff)/crm/create")} />
      ) : (
        <FlatList
          data={leads}
          keyExtractor={(item) => item.id}
          contentContainerClassName="px-4 pb-8"
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => router.push(`/(app)/(staff)/crm/${item.id}`)}>
              <Card className="mb-3">
                <View className="flex-row items-start justify-between mb-1">
                  <View className="flex-1 mr-2">
                    <Text className="text-sm font-semibold text-gray-900 dark:text-white">{item.name}</Text>
                    <Text className="text-xs text-gray-500">{item.email}</Text>
                  </View>
                  <Badge label={item.status} variant={STATUS_VARIANT[item.status]} />
                </View>
                <View className="flex-row justify-between mt-2">
                  <Text className="text-xs text-gray-500">Source: {item.source}</Text>
                  <Text className="text-xs text-primary-600 font-medium">Score: {item.leadScore}</Text>
                </View>
              </Card>
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
}
