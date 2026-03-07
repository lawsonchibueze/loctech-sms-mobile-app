import { View, Text, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useStaffList } from "@/hooks/useAdmin";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { SkeletonCard } from "@/components/ui/Skeleton";

export default function StaffManagementScreen() {
  const router = useRouter();
  const { data: staff, isLoading } = useStaffList();

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900">
      <View className="flex-row items-center px-4 pt-4 mb-4">
        <Button title="Back" variant="ghost" size="sm" onPress={() => router.back()} />
        <Text className="text-xl font-bold text-gray-900 dark:text-white ml-2">Staff</Text>
      </View>

      {isLoading ? (
        <View className="px-4">{[1, 2, 3].map((i) => <SkeletonCard key={i} />)}</View>
      ) : !staff?.length ? (
        <EmptyState title="No staff" description="Staff list will appear here." />
      ) : (
        <FlatList
          data={staff}
          keyExtractor={(item) => item.id}
          contentContainerClassName="px-4 pb-8"
          renderItem={({ item }) => (
            <Card className="mb-3">
              <View className="flex-row items-center justify-between">
                <View className="flex-1 mr-2">
                  <Text className="text-sm font-semibold text-gray-900 dark:text-white">{item.name}</Text>
                  <Text className="text-xs text-gray-500">{item.role} | {item.branchName}</Text>
                </View>
                <Badge label={item.status} variant={item.status === "active" ? "success" : "default"} />
              </View>
            </Card>
          )}
        />
      )}
    </SafeAreaView>
  );
}
