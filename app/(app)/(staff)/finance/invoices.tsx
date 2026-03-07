import { View, Text, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useInvoices } from "@/hooks/useFinance";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { SkeletonCard } from "@/components/ui/Skeleton";

export default function InvoicesScreen() {
  const router = useRouter();
  const { data: invoices, isLoading } = useInvoices();

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900">
      <View className="flex-row items-center px-4 pt-4 mb-4">
        <Button title="Back" variant="ghost" size="sm" onPress={() => router.back()} />
        <Text className="text-xl font-bold text-gray-900 dark:text-white ml-2">Invoices</Text>
      </View>

      {isLoading ? (
        <View className="px-4">{[1, 2, 3].map((i) => <SkeletonCard key={i} />)}</View>
      ) : !invoices?.length ? (
        <EmptyState title="No invoices" description="Invoices will appear here." />
      ) : (
        <FlatList
          data={invoices}
          keyExtractor={(item) => item.id}
          contentContainerClassName="px-4 pb-8"
          renderItem={({ item }) => (
            <Card className="mb-3">
              <View className="flex-row items-start justify-between mb-1">
                <View className="flex-1 mr-2">
                  <Text className="text-sm font-semibold text-gray-900 dark:text-white">{item.studentName}</Text>
                  <Text className="text-xs text-gray-500">{item.description}</Text>
                </View>
                <Badge label={item.status} variant={item.status === "paid" ? "success" : item.status === "overdue" ? "error" : "warning"} />
              </View>
              <View className="flex-row justify-between mt-2">
                <Text className="text-sm font-bold text-gray-900 dark:text-white">₦{item.amount.toLocaleString()}</Text>
                <Text className="text-xs text-gray-500">Paid: ₦{item.paidAmount.toLocaleString()}</Text>
              </View>
            </Card>
          )}
        />
      )}
    </SafeAreaView>
  );
}
