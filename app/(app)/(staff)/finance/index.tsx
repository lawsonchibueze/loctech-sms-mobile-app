import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useFinanceDashboard } from "@/hooks/useFinance";
import { Card } from "@/components/ui/Card";
import { StatCard } from "@/components/dashboard/StatCard";
import { Skeleton } from "@/components/ui/Skeleton";

export default function FinanceDashboardScreen() {
  const router = useRouter();
  const { data, isLoading } = useFinanceDashboard();

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900">
      <ScrollView className="flex-1 px-4 pt-4">
        <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Finance</Text>

        {isLoading ? (
          <>
            <Skeleton width="100%" height={80} className="mb-3" />
            <Skeleton width="100%" height={80} />
          </>
        ) : data ? (
          <>
            <View className="flex-row gap-3 mb-4">
              <StatCard label="Revenue" value={`₦${(data.totalRevenue / 1000).toFixed(0)}k`} color="text-green-600" />
              <StatCard label="Outstanding" value={`₦${(data.outstandingAmount / 1000).toFixed(0)}k`} color="text-red-600" />
            </View>
            <View className="flex-row gap-3 mb-4">
              <StatCard label="Collection" value={`${data.collectionRate}%`} color="text-primary-600" />
              <StatCard label="Overdue" value={data.overdueCount} color="text-amber-600" />
            </View>
          </>
        ) : null}

        <View className="gap-3 mb-8">
          <TouchableOpacity onPress={() => router.push("/(app)/(staff)/finance/invoices")}>
            <Card><Text className="text-sm font-medium text-gray-900 dark:text-white">All Invoices</Text></Card>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("/(app)/(staff)/finance/payments")}>
            <Card><Text className="text-sm font-medium text-gray-900 dark:text-white">Payment Records</Text></Card>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("/(app)/(staff)/finance/overdue")}>
            <Card><Text className="text-sm font-medium text-gray-900 dark:text-white">Overdue Invoices</Text></Card>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
