import { Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Card } from "@/components/ui/Card";

export default function SettingsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900">
      <ScrollView className="flex-1 px-4 pt-4">
        <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Settings
        </Text>
        <Card className="mb-4">
          <Text className="text-base font-semibold text-gray-900 dark:text-white mb-2">
            Institute Settings
          </Text>
          <Text className="text-sm text-gray-500">Coming soon</Text>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}
