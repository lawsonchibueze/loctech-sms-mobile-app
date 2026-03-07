import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useEnrolledCourses } from "@/hooks/useCourses";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { SkeletonCard } from "@/components/ui/Skeleton";

export default function CoursesListScreen() {
  const router = useRouter();
  const { data: courses, isLoading } = useEnrolledCourses();

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900">
      <Text className="text-2xl font-bold text-gray-900 dark:text-white px-4 pt-4 mb-4">
        My Courses
      </Text>

      {isLoading ? (
        <View className="px-4">
          {[1, 2, 3].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </View>
      ) : !courses?.length ? (
        <EmptyState
          title="No courses"
          description="You are not enrolled in any courses yet."
        />
      ) : (
        <FlatList
          data={courses}
          keyExtractor={(item) => item.id}
          contentContainerClassName="px-4 pb-8"
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => router.push(`/(app)/(student)/courses/${item.id}`)}
            >
              <Card className="mb-3">
                <View className="flex-row items-start justify-between mb-2">
                  <View className="flex-1 mr-3">
                    <Text className="text-base font-semibold text-gray-900 dark:text-white">
                      {item.title}
                    </Text>
                    <Text className="text-xs text-gray-500 mt-1">
                      {item.instructorName}
                    </Text>
                  </View>
                  <Badge label={item.category} variant="info" />
                </View>

                {/* Progress bar */}
                <View className="mt-2">
                  <View className="flex-row justify-between mb-1">
                    <Text className="text-xs text-gray-500">
                      {item.completedModules}/{item.totalModules} modules
                    </Text>
                    <Text className="text-xs font-medium text-primary-600">
                      {item.progress}%
                    </Text>
                  </View>
                  <View className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <View
                      className="h-full bg-primary-600 rounded-full"
                      style={{ width: `${item.progress}%` }}
                    />
                  </View>
                </View>
              </Card>
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
}
