import { View, Text, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useOverdueInvoices } from "@/hooks/useFinance";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { SkeletonCard } from "@/components/ui/Skeleton";

export default function OverdueInvoicesScreen() {
  const router = useRouter();
  const { data: invoices, isLoading } = useOverdueInvoices();

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900">
      <View className="flex-row items-center px-4 pt-4 mb-4">
        <Button title="Back" variant="ghost" size="sm" onPress={() => router.back()} />
        <Text className="text-xl font-bold text-gray-900 dark:text-white ml-2">Overdue</Text>
      </View>

      {isLoading ? (
        <View className="px-4">{[1, 2, 3].map((i) => <SkeletonCard key={i} />)}</View>
      ) : !invoices?.length ? (
        <EmptyState title="No overdue invoices" description="All payments are up to date." />
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
                <Badge label="Overdue" variant="error" />
              </View>
              <Text className="text-sm font-bold text-red-600 mt-1">₦{(item.amount - item.paidAmount).toLocaleString()} remaining</Text>
              <Text className="text-xs text-gray-500 mt-1">Due: {new Date(item.dueDate).toLocaleDateString()}</Text>
            </Card>
          )}
        />
      )}
    </SafeAreaView>
  );
}
