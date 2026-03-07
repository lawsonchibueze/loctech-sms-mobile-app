import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useAssignments } from "@/hooks/useCourses";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { SkeletonCard } from "@/components/ui/Skeleton";

const STATUS_VARIANT = {
  pending: "warning",
  submitted: "info",
  graded: "success",
  overdue: "error",
} as const;

export default function AssignmentsScreen() {
  const router = useRouter();
  const { data: assignments, isLoading } = useAssignments();

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900">
      <Text className="text-2xl font-bold text-gray-900 dark:text-white px-4 pt-4 mb-4">
        Assignments
      </Text>

      {isLoading ? (
        <View className="px-4">
          {[1, 2, 3].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </View>
      ) : !assignments?.length ? (
        <EmptyState
          title="No assignments"
          description="Your assignments will appear here."
        />
      ) : (
        <FlatList
          data={assignments}
          keyExtractor={(item) => item.id}
          contentContainerClassName="px-4 pb-8"
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() =>
                router.push(`/(app)/(student)/assignments/${item.id}`)
              }
            >
              <Card className="mb-3">
                <View className="flex-row items-start justify-between mb-1">
                  <Text className="text-sm font-semibold text-gray-900 dark:text-white flex-1 mr-2">
                    {item.title}
                  </Text>
                  <Badge
                    label={item.status}
                    variant={STATUS_VARIANT[item.status]}
                  />
                </View>
                <Text className="text-xs text-gray-500">{item.courseTitle}</Text>
                <Text className="text-xs text-gray-500 mt-1">
                  Due: {new Date(item.dueDate).toLocaleDateString()}
                </Text>
                {item.grade != null ? (
                  <Text className="text-xs font-medium text-primary-600 mt-1">
                    Grade: {item.grade}/{item.maxGrade}
                  </Text>
                ) : null}
              </Card>
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
}
