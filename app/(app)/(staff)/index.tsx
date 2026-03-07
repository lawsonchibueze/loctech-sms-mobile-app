import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthStore } from "@/lib/auth-store";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export default function StaffDashboard() {
  const user = useAuthStore((s) => s.user);

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900">
      <ScrollView className="flex-1 px-4 pt-4">
        <View className="flex-row items-center justify-between mb-6">
          <View>
            <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              Staff Dashboard
            </Text>
            <Text className="text-base text-gray-500 dark:text-gray-400">
              {user?.firstName} {user?.lastName}
            </Text>
          </View>
          <Badge label="Not Checked In" variant="warning" />
        </View>

        <View className="flex-row gap-3 mb-4">
          <Card className="flex-1">
            <Text className="text-2xl font-bold text-primary-600">0</Text>
            <Text className="text-xs text-gray-500 mt-1">Active Leads</Text>
          </Card>
          <Card className="flex-1">
            <Text className="text-2xl font-bold text-green-600">0</Text>
            <Text className="text-xs text-gray-500 mt-1">Students</Text>
          </Card>
        </View>

        <Card className="mb-4">
          <Text className="text-base font-semibold text-gray-900 dark:text-white mb-2">
            My Attendance
          </Text>
          <Text className="text-sm text-gray-500">Not checked in today</Text>
        </Card>

        <Card className="mb-4">
          <Text className="text-base font-semibold text-gray-900 dark:text-white mb-2">
            CRM Pipeline
          </Text>
          <Text className="text-sm text-gray-500">No leads assigned</Text>
        </Card>

        <Card className="mb-8">
          <Text className="text-base font-semibold text-gray-900 dark:text-white mb-2">
            Overdue Invoices
          </Text>
          <Text className="text-sm text-gray-500">No overdue invoices</Text>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}
