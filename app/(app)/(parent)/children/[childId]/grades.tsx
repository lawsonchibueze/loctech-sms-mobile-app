import { View, Text, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useChildGrades } from "@/hooks/useParent";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { SkeletonCard } from "@/components/ui/Skeleton";

export default function ChildGradesScreen() {
  const { childId } = useLocalSearchParams<{ childId: string }>();
  const router = useRouter();
  const { data, isLoading } = useChildGrades(childId);

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900">
      <View className="flex-row items-center px-4 pt-4 mb-4">
        <Button title="Back" variant="ghost" size="sm" onPress={() => router.back()} />
        <Text className="text-xl font-bold text-gray-900 dark:text-white ml-2">Grades</Text>
      </View>

      {isLoading ? (
        <View className="px-4">{[1, 2, 3].map((i) => <SkeletonCard key={i} />)}</View>
      ) : !data?.grades.length ? (
        <EmptyState title="No grades" description="Grades will appear here." />
      ) : (
        <FlatList
          data={data.grades}
          keyExtractor={(_, i) => String(i)}
          contentContainerClassName="px-4 pb-8"
          renderItem={({ item }) => (
            <Card className="mb-3">
              <View className="flex-row items-center justify-between">
                <View className="flex-1 mr-3">
                  <Text className="text-sm font-semibold text-gray-900 dark:text-white">{item.courseTitle}</Text>
                  <Text className="text-xs text-gray-500 mt-1">{item.grade}/{item.maxGrade}</Text>
                </View>
                <View className="items-center">
                  <Text className="text-xl font-bold text-primary-600">{item.letterGrade}</Text>
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
