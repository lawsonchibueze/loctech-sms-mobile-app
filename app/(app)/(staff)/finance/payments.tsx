import { View, Text, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { usePayments } from "@/hooks/useFinance";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { SkeletonCard } from "@/components/ui/Skeleton";

export default function PaymentsScreen() {
  const router = useRouter();
  const { data: payments, isLoading } = usePayments();

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900">
      <View className="flex-row items-center px-4 pt-4 mb-4">
        <Button title="Back" variant="ghost" size="sm" onPress={() => router.back()} />
        <Text className="text-xl font-bold text-gray-900 dark:text-white ml-2">Payments</Text>
      </View>

      {isLoading ? (
        <View className="px-4">{[1, 2, 3].map((i) => <SkeletonCard key={i} />)}</View>
      ) : !payments?.length ? (
        <EmptyState title="No payments" description="Payment records will appear here." />
      ) : (
        <FlatList
          data={payments}
          keyExtractor={(item) => item.id}
          contentContainerClassName="px-4 pb-8"
          renderItem={({ item }) => (
            <Card className="mb-3">
              <View className="flex-row items-center justify-between mb-1">
                <Text className="text-sm font-semibold text-gray-900 dark:text-white">{item.studentName}</Text>
                <Text className="text-sm font-bold text-green-600">₦{item.amount.toLocaleString()}</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-xs text-gray-500">{item.method} | {item.reference}</Text>
                <Text className="text-xs text-gray-500">{new Date(item.createdAt).toLocaleDateString()}</Text>
              </View>
            </Card>
          )}
        />
      )}
    </SafeAreaView>
  );
}
