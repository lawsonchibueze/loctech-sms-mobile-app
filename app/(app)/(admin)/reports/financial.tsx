import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useFinancialAnalytics } from "@/hooks/useAdmin";
import { Card } from "@/components/ui/Card";
import { StatCard } from "@/components/dashboard/StatCard";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";

export default function FinancialReportsScreen() {
  const router = useRouter();
  const { data, isLoading } = useFinancialAnalytics();

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900">
      <View className="flex-row items-center px-4 pt-4 mb-4">
        <Button title="Back" variant="ghost" size="sm" onPress={() => router.back()} />
        <Text className="text-xl font-bold text-gray-900 dark:text-white ml-2">Financial Reports</Text>
      </View>

      <ScrollView className="flex-1 px-4">
        {isLoading ? (
          <>
            <Skeleton width="100%" height={80} className="mb-3" />
            <Skeleton width="100%" height={80} />
          </>
        ) : data ? (
          <>
            <View className="flex-row gap-3 mb-4">
              <StatCard label="Total Revenue" value={`₦${(data.totalRevenue / 1000).toFixed(0)}k`} color="text-green-600" />
              <StatCard label="This Month" value={`₦${(data.thisMonth / 1000).toFixed(0)}k`} color="text-primary-600" />
            </View>
            <View className="flex-row gap-3 mb-4">
              <StatCard label="Outstanding" value={`₦${(data.outstanding / 1000).toFixed(0)}k`} color="text-red-600" />
              <StatCard label="Collection" value={`${data.collectionRate}%`} color="text-amber-600" />
            </View>
          </>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}
