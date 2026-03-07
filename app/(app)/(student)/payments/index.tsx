import { View, Text, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { SkeletonCard } from "@/components/ui/Skeleton";

interface StudentInvoice {
  id: string;
  description: string;
  amount: number;
  paidAmount: number;
  status: string;
  dueDate: string;
}

export default function StudentPaymentsScreen() {
  const router = useRouter();
  const { data: invoices, isLoading } = useQuery({
    queryKey: ["student", "invoices"],
    queryFn: () => api.get<StudentInvoice[]>("/sms/payments/my-invoices"),
  });

  const outstanding = invoices?.filter((i) => i.status !== "paid") ?? [];
  const totalOutstanding = outstanding.reduce((sum, i) => sum + (i.amount - i.paidAmount), 0);

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900">
      <Text className="text-2xl font-bold text-gray-900 dark:text-white px-4 pt-4 mb-2">Payments</Text>

      {totalOutstanding > 0 ? (
        <View className="px-4 mb-4">
          <Card className="items-center bg-red-50 dark:bg-red-900/20">
            <Text className="text-2xl font-bold text-red-600">₦{totalOutstanding.toLocaleString()}</Text>
            <Text className="text-xs text-red-500">Outstanding Balance</Text>
          </Card>
        </View>
      ) : null}

      {isLoading ? (
        <View className="px-4">{[1, 2, 3].map((i) => <SkeletonCard key={i} />)}</View>
      ) : !invoices?.length ? (
        <EmptyState title="No invoices" description="Your payment history will appear here." />
      ) : (
        <FlatList
          data={invoices}
          keyExtractor={(item) => item.id}
          contentContainerClassName="px-4 pb-8"
          renderItem={({ item }) => (
            <Card className="mb-3">
              <View className="flex-row items-start justify-between mb-1">
                <Text className="text-sm font-semibold text-gray-900 dark:text-white flex-1 mr-2">{item.description}</Text>
                <Badge label={item.status} variant={item.status === "paid" ? "success" : item.status === "overdue" ? "error" : "warning"} />
              </View>
              <Text className="text-base font-bold text-gray-900 dark:text-white">₦{item.amount.toLocaleString()}</Text>
              {item.status !== "paid" ? (
                <Button
                  title="Pay Now"
                  size="sm"
                  className="mt-2 self-start"
                  onPress={() => router.push(`/(app)/(student)/payments/${item.id}`)}
                />
              ) : null}
            </Card>
          )}
        />
      )}
    </SafeAreaView>
  );
}
