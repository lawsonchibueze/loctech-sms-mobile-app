import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthStore } from "@/lib/auth-store";
import { Card } from "@/components/ui/Card";

export default function AdminDashboard() {
  const user = useAuthStore((s) => s.user);

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900">
      <ScrollView className="flex-1 px-4 pt-4">
        <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
          Admin Dashboard
        </Text>
        <Text className="text-base text-gray-500 dark:text-gray-400 mb-6">
          {user?.firstName} {user?.lastName}
        </Text>

        <View className="flex-row gap-3 mb-4">
          <Card className="flex-1">
            <Text className="text-2xl font-bold text-primary-600">0</Text>
            <Text className="text-xs text-gray-500 mt-1">Branches</Text>
          </Card>
          <Card className="flex-1">
            <Text className="text-2xl font-bold text-green-600">0</Text>
            <Text className="text-xs text-gray-500 mt-1">Total Staff</Text>
          </Card>
          <Card className="flex-1">
            <Text className="text-2xl font-bold text-amber-600">0</Text>
            <Text className="text-xs text-gray-500 mt-1">Students</Text>
          </Card>
        </View>

        <Card className="mb-4">
          <Text className="text-base font-semibold text-gray-900 dark:text-white mb-2">
            Staff Attendance Overview
          </Text>
          <Text className="text-sm text-gray-500">
            No attendance data available
          </Text>
        </Card>

        <Card className="mb-4">
          <Text className="text-base font-semibold text-gray-900 dark:text-white mb-2">
            Instructor Report Compliance
          </Text>
          <Text className="text-sm text-gray-500">No reports submitted</Text>
        </Card>

        <Card className="mb-4">
          <Text className="text-base font-semibold text-gray-900 dark:text-white mb-2">
            Revenue Overview
          </Text>
          <Text className="text-sm text-gray-500">No financial data</Text>
        </Card>

        <Card className="mb-8">
          <Text className="text-base font-semibold text-gray-900 dark:text-white mb-2">
            Recent Enrollments
          </Text>
          <Text className="text-sm text-gray-500">No recent enrollments</Text>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}
