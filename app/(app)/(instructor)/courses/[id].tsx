import { View, Text, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useInstructorCourseDetail } from "@/hooks/useInstructor";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";

export default function InstructorCourseDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data: course, isLoading } = useInstructorCourseDetail(id);

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900 px-4 pt-4">
        <Skeleton width="60%" height={24} className="mb-4" />
        <Skeleton width="100%" height={60} className="mb-3" />
        <Skeleton width="100%" height={60} />
      </SafeAreaView>
    );
  }

  if (!course) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center">
        <Text className="text-gray-500">Course not found</Text>
        <Button title="Go Back" variant="ghost" onPress={() => router.back()} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900">
      <View className="px-4 pt-4 mb-4">
        <Button title="Back" variant="ghost" size="sm" onPress={() => router.back()} className="self-start mb-2" />
        <Text className="text-xl font-bold text-gray-900 dark:text-white">{course.title}</Text>
        <Text className="text-sm text-gray-500 mt-1">{course.students.length} students</Text>
      </View>

      <FlatList
        data={course.students}
        keyExtractor={(item) => item.id}
        contentContainerClassName="px-4 pb-8"
        ListHeaderComponent={
          <Text className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Students</Text>
        }
        renderItem={({ item }) => (
          <Card className="mb-2">
            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="text-sm font-medium text-gray-900 dark:text-white">{item.name}</Text>
                <Text className="text-xs text-gray-500">Attendance: {item.attendanceRate}%</Text>
              </View>
              <View className="items-end">
                <Text className="text-sm font-bold text-primary-600">{item.progress}%</Text>
                <Text className="text-xs text-gray-500">progress</Text>
              </View>
            </View>
          </Card>
        )}
      />
    </SafeAreaView>
  );
}
