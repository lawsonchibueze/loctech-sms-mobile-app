import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthStore } from "@/lib/auth-store";
import { Card } from "@/components/ui/Card";

export default function ParentDashboard() {
  const user = useAuthStore((s) => s.user);

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900">
      <ScrollView className="flex-1 px-4 pt-4">
        <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
          Parent Dashboard
        </Text>
        <Text className="text-base text-gray-500 dark:text-gray-400 mb-6">
          {user?.firstName} {user?.lastName}
        </Text>

        <Card className="mb-4">
          <Text className="text-base font-semibold text-gray-900 dark:text-white mb-2">
            My Children
          </Text>
          <Text className="text-sm text-gray-500">
            No children linked to your account yet
          </Text>
        </Card>

        <Card className="mb-4">
          <Text className="text-base font-semibold text-gray-900 dark:text-white mb-2">
            Payment Summary
          </Text>
          <Text className="text-sm text-gray-500">No outstanding payments</Text>
        </Card>

        <Card className="mb-8">
          <Text className="text-base font-semibold text-gray-900 dark:text-white mb-2">
            Recent Notifications
          </Text>
          <Text className="text-sm text-gray-500">No new notifications</Text>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}
