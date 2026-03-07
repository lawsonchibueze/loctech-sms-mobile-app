import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCourseDetail } from "@/hooks/useCourses";
import { ModuleAccordion } from "@/components/learn/ModuleAccordion";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";

export default function CourseDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data: course, isLoading } = useCourseDetail(id);

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900 px-4 pt-4">
        <Skeleton width="60%" height={24} className="mb-3" />
        <Skeleton width="40%" height={16} className="mb-6" />
        <Skeleton width="100%" height={60} className="mb-3" />
        <Skeleton width="100%" height={60} className="mb-3" />
        <Skeleton width="100%" height={60} />
      </SafeAreaView>
    );
  }

  if (!course) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900 items-center justify-center">
        <Text className="text-gray-500">Course not found</Text>
        <Button title="Go Back" variant="ghost" onPress={() => router.back()} />
      </SafeAreaView>
    );
  }

  // Find first incomplete lesson
  const firstIncomplete = course.modules
    .flatMap((m) => m.lessons)
    .find((l) => !l.isCompleted);

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900">
      <ScrollView className="flex-1">
        <View className="px-4 pt-4">
          <Button title="Back" variant="ghost" size="sm" onPress={() => router.back()} className="self-start mb-2" />

          <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {course.title}
          </Text>
          <Text className="text-sm text-gray-500 dark:text-gray-400 mb-1">
            {course.instructorName}
          </Text>
          <Text className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            {course.description}
          </Text>

          {/* Progress card */}
          <Card className="mb-4">
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-sm font-medium text-gray-900 dark:text-white">
                Progress
              </Text>
              <Text className="text-sm font-bold text-primary-600">
                {course.progress}%
              </Text>
            </View>
            <View className="h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <View
                className="h-full bg-primary-600 rounded-full"
                style={{ width: `${course.progress}%` }}
              />
            </View>
            <Text className="text-xs text-gray-500 mt-2">
              {course.completedModules}/{course.totalModules} modules completed
            </Text>
          </Card>

          {/* Continue button */}
          {firstIncomplete ? (
            <Button
              title="Continue Learning"
              onPress={() =>
                router.push(
                  `/(app)/(student)/learn/${course.id}/${firstIncomplete.id}`
                )
              }
              size="lg"
              className="mb-4"
            />
          ) : null}
        </View>

        {/* Modules */}
        <View className="px-4 pb-8">
          <Text className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Course Content
          </Text>
          {course.modules.map((module, i) => (
            <ModuleAccordion
              key={module.id}
              title={`${i + 1}. ${module.title}`}
              lessons={module.lessons}
              isCompleted={module.isCompleted}
              defaultOpen={
                !module.isCompleted &&
                (i === 0 || course.modules[i - 1].isCompleted)
              }
              onLessonPress={(lessonId) =>
                router.push(`/(app)/(student)/learn/${course.id}/${lessonId}`)
              }
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
