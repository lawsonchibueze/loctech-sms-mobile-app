import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useBranchDetail } from "@/hooks/useAdmin";
import { Card } from "@/components/ui/Card";
import { StatCard } from "@/components/dashboard/StatCard";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";

export default function BranchDetailScreen() {
  const { branchId } = useLocalSearchParams<{ branchId: string }>();
  const router = useRouter();
  const { data: branch, isLoading } = useBranchDetail(branchId);

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900 px-4 pt-4">
        <Skeleton width="60%" height={24} className="mb-4" />
        <Skeleton width="100%" height={80} />
      </SafeAreaView>
    );
  }

  if (!branch) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center">
        <Text className="text-gray-500">Branch not found</Text>
        <Button title="Go Back" variant="ghost" onPress={() => router.back()} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900">
      <ScrollView className="flex-1 px-4 pt-4">
        <Button title="Back" variant="ghost" size="sm" onPress={() => router.back()} className="self-start mb-2" />
        <Text className="text-xl font-bold text-gray-900 dark:text-white mb-1">{branch.name}</Text>
        <Text className="text-sm text-gray-500 mb-4">{branch.location}</Text>

        <View className="flex-row gap-3 mb-4">
          <StatCard label="Staff" value={branch.staffCount} color="text-primary-600" />
          <StatCard label="Students" value={branch.studentCount} color="text-green-600" />
        </View>

        <Card className="mb-4">
          <Text className="text-base font-semibold text-gray-900 dark:text-white mb-2">Attendance Rate</Text>
          <Text className="text-3xl font-bold text-primary-600">{branch.attendanceRate}%</Text>
        </Card>

        <Card className="mb-8">
          <Text className="text-base font-semibold text-gray-900 dark:text-white mb-2">Revenue</Text>
          <Text className="text-2xl font-bold text-green-600">₦{branch.revenue.toLocaleString()}</Text>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}
