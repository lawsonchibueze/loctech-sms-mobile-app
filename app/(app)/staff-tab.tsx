import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { EmptyState } from "@/components/ui/EmptyState";

export default function StaffTab() {
  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900">
      <Text className="text-2xl font-bold text-gray-900 dark:text-white px-4 pt-4 mb-2">
        Staff
      </Text>
      <EmptyState
        title="No staff"
        description="Staff management will appear here."
      />
    </SafeAreaView>
  );
}
