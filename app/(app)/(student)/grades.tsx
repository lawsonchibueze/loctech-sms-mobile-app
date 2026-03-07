import { View, Text, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGrades } from "@/hooks/useCourses";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { SkeletonCard } from "@/components/ui/Skeleton";

export default function GradesScreen() {
  const { data: grades, isLoading } = useGrades();

  const overallAvg = grades?.length
    ? Math.round(grades.reduce((sum, g) => sum + g.percentage, 0) / grades.length)
    : 0;

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900">
      <Text className="text-2xl font-bold text-gray-900 dark:text-white px-4 pt-4 mb-2">
        Grades
      </Text>

      {grades?.length ? (
        <View className="px-4 mb-4">
          <Card className="items-center">
            <Text className="text-3xl font-bold text-primary-600">{overallAvg}%</Text>
            <Text className="text-xs text-gray-500 mt-1">Overall Average</Text>
          </Card>
        </View>
      ) : null}

      {isLoading ? (
        <View className="px-4">
          {[1, 2, 3].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </View>
      ) : !grades?.length ? (
        <EmptyState
          title="No grades yet"
          description="Your course grades will appear here."
        />
      ) : (
        <FlatList
          data={grades}
          keyExtractor={(item) => item.courseId}
          contentContainerClassName="px-4 pb-8"
          renderItem={({ item }) => (
            <Card className="mb-3">
              <View className="flex-row items-center justify-between">
                <View className="flex-1 mr-3">
                  <Text className="text-sm font-semibold text-gray-900 dark:text-white">
                    {item.courseTitle}
                  </Text>
                  <Text className="text-xs text-gray-500 mt-1">
                    {item.grade}/{item.maxGrade}
                  </Text>
                </View>
                <View className="items-center">
                  <Text className="text-xl font-bold text-primary-600">
                    {item.letterGrade}
                  </Text>
                  <Text className="text-xs text-gray-500">{item.percentage}%</Text>
                </View>
              </View>
            </Card>
          )}
        />
      )}
    </SafeAreaView>
  );
}
