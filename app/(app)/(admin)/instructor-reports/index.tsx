import { View, Text, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useInstructorReportsAdmin } from "@/hooks/useAdmin";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { SkeletonCard } from "@/components/ui/Skeleton";

export default function AdminInstructorReportsScreen() {
  const router = useRouter();
  const { data: reports, isLoading } = useInstructorReportsAdmin();

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900">
      <View className="flex-row items-center px-4 pt-4 mb-4">
        <Button title="Back" variant="ghost" size="sm" onPress={() => router.back()} />
        <Text className="text-xl font-bold text-gray-900 dark:text-white ml-2">Instructor Reports</Text>
      </View>

      {isLoading ? (
        <View className="px-4">{[1, 2, 3].map((i) => <SkeletonCard key={i} />)}</View>
      ) : !reports?.length ? (
        <EmptyState title="No reports" description="Instructor reports will appear here." />
      ) : (
        <FlatList
          data={reports}
          keyExtractor={(item) => item.id}
          contentContainerClassName="px-4 pb-8"
          renderItem={({ item }) => (
            <Card className="mb-3">
              <View className="flex-row items-start justify-between mb-1">
                <View className="flex-1 mr-2">
                  <Text className="text-sm font-semibold text-gray-900 dark:text-white">{item.instructorName}</Text>
                  <Text className="text-xs text-gray-500">{new Date(item.date).toLocaleDateString()}</Text>
                </View>
                <Badge label={item.status} variant={item.status === "reviewed" ? "success" : item.status === "flagged" ? "error" : "info"} />
              </View>
              {item.summary ? <Text className="text-xs text-gray-500 mt-1" numberOfLines={2}>{item.summary}</Text> : null}
            </Card>
          )}
        />
      )}
    </SafeAreaView>
  );
}
