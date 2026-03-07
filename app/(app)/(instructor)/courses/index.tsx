import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useInstructorCourses } from "@/hooks/useInstructor";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { SkeletonCard } from "@/components/ui/Skeleton";

export default function InstructorCoursesScreen() {
  const router = useRouter();
  const { data: courses, isLoading } = useInstructorCourses();

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900">
      <Text className="text-2xl font-bold text-gray-900 dark:text-white px-4 pt-4 mb-4">
        My Courses
      </Text>

      {isLoading ? (
        <View className="px-4">{[1, 2, 3].map((i) => <SkeletonCard key={i} />)}</View>
      ) : !courses?.length ? (
        <EmptyState title="No courses" description="You have no assigned courses." />
      ) : (
        <FlatList
          data={courses}
          keyExtractor={(item) => item.id}
          contentContainerClassName="px-4 pb-8"
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => router.push(`/(app)/(instructor)/courses/${item.id}`)}>
              <Card className="mb-3">
                <Text className="text-base font-semibold text-gray-900 dark:text-white">{item.title}</Text>
                <View className="flex-row gap-4 mt-2">
                  <Text className="text-xs text-gray-500">{item.studentsCount} students</Text>
                  {item.nextClassDate ? (
                    <Text className="text-xs text-primary-600">
                      Next: {new Date(item.nextClassDate).toLocaleDateString()}
                    </Text>
                  ) : null}
                </View>
              </Card>
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
}
