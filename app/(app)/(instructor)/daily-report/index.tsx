import { View, Text, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useInstructorReports } from "@/hooks/useInstructor";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { SkeletonCard } from "@/components/ui/Skeleton";

const STATUS_VARIANT = {
  pending: "warning",
  submitted: "info",
  reviewed: "success",
  flagged: "error",
} as const;

export default function DailyReportsScreen() {
  const router = useRouter();
  const { data: reports, isLoading } = useInstructorReports();

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900">
      <View className="flex-row items-center justify-between px-4 pt-4 mb-4">
        <Text className="text-xl font-bold text-gray-900 dark:text-white">Daily Reports</Text>
        <Button title="Submit" size="sm" onPress={() => router.push("/(app)/(instructor)/daily-report/submit")} />
      </View>

      {isLoading ? (
        <View className="px-4">{[1, 2, 3].map((i) => <SkeletonCard key={i} />)}</View>
      ) : !reports?.length ? (
        <EmptyState title="No reports" description="Submit your first daily report." actionLabel="Submit Report" onAction={() => router.push("/(app)/(instructor)/daily-report/submit")} />
      ) : (
        <FlatList
          data={reports}
          keyExtractor={(item) => item.id}
          contentContainerClassName="px-4 pb-8"
          renderItem={({ item }) => (
            <Card className="mb-3">
              <View className="flex-row items-start justify-between mb-1">
                <Text className="text-sm font-semibold text-gray-900 dark:text-white">
                  {new Date(item.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                </Text>
                <Badge label={item.status} variant={STATUS_VARIANT[item.status]} />
              </View>
              {item.summary ? <Text className="text-xs text-gray-500 mt-1">{item.summary}</Text> : null}
              <View className="flex-row gap-4 mt-2">
                <Text className="text-xs text-gray-500">Classes: {item.classesHeld}</Text>
                <Text className="text-xs text-gray-500">Students: {item.studentsPresent}</Text>
              </View>
            </Card>
          )}
        />
      )}
    </SafeAreaView>
  );
}
