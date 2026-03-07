import { View, Text, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useChildPayments } from "@/hooks/useParent";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { SkeletonCard } from "@/components/ui/Skeleton";

export default function ChildPaymentsScreen() {
  const { childId } = useLocalSearchParams<{ childId: string }>();
  const router = useRouter();
  const { data, isLoading } = useChildPayments(childId);

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900">
      <View className="flex-row items-center px-4 pt-4 mb-4">
        <Button title="Back" variant="ghost" size="sm" onPress={() => router.back()} />
        <Text className="text-xl font-bold text-gray-900 dark:text-white ml-2">Payments</Text>
      </View>

      {data ? (
        <View className="px-4 mb-4">
          <Card className="items-center">
            <Text className={`text-2xl font-bold ${data.outstandingBalance > 0 ? "text-red-600" : "text-green-600"}`}>
              ₦{data.outstandingBalance.toLocaleString()}
            </Text>
            <Text className="text-xs text-gray-500">Outstanding Balance</Text>
          </Card>
        </View>
      ) : null}

      {isLoading ? (
        <View className="px-4">{[1, 2, 3].map((i) => <SkeletonCard key={i} />)}</View>
      ) : !data?.invoices.length ? (
        <EmptyState title="No invoices" description="Payment invoices will appear here." />
      ) : (
        <FlatList
          data={data.invoices}
          keyExtractor={(item) => item.id}
          contentContainerClassName="px-4 pb-8"
          renderItem={({ item }) => (
            <Card className="mb-3">
              <View className="flex-row items-start justify-between mb-1">
                <Text className="text-sm font-semibold text-gray-900 dark:text-white flex-1 mr-2">
                  {item.description}
                </Text>
                <Badge label={item.status} variant={item.status === "paid" ? "success" : item.status === "overdue" ? "error" : "warning"} />
              </View>
              <Text className="text-base font-bold text-gray-900 dark:text-white">
                ₦{item.amount.toLocaleString()}
              </Text>
              <Text className="text-xs text-gray-500 mt-1">
                Due: {new Date(item.dueDate).toLocaleDateString()}
              </Text>
            </Card>
          )}
        />
      )}
    </SafeAreaView>
  );
}
