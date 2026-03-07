import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthStore } from "@/lib/auth-store";
import { Card } from "@/components/ui/Card";

export default function StudentDashboard() {
  const user = useAuthStore((s) => s.user);

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900">
      <ScrollView className="flex-1 px-4 pt-4">
        <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
          Welcome back
        </Text>
        <Text className="text-base text-gray-500 dark:text-gray-400 mb-6">
          {user?.firstName} {user?.lastName}
        </Text>

        <View className="flex-row gap-3 mb-4">
          <Card className="flex-1">
            <Text className="text-2xl font-bold text-primary-600">0</Text>
            <Text className="text-xs text-gray-500 mt-1">Courses</Text>
          </Card>
          <Card className="flex-1">
            <Text className="text-2xl font-bold text-green-600">0%</Text>
            <Text className="text-xs text-gray-500 mt-1">Attendance</Text>
          </Card>
        </View>

        <Card className="mb-4">
          <Text className="text-base font-semibold text-gray-900 dark:text-white mb-2">
            Upcoming Classes
          </Text>
          <Text className="text-sm text-gray-500">No upcoming classes</Text>
        </Card>

        <Card className="mb-4">
          <Text className="text-base font-semibold text-gray-900 dark:text-white mb-2">
            Recent Grades
          </Text>
          <Text className="text-sm text-gray-500">No grades yet</Text>
        </Card>

        <Card className="mb-8">
          <Text className="text-base font-semibold text-gray-900 dark:text-white mb-2">
            Pending Assignments
          </Text>
          <Text className="text-sm text-gray-500">No pending assignments</Text>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}
