import { View, Text, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useChildAttendance } from "@/hooks/useParent";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { SkeletonCard } from "@/components/ui/Skeleton";

export default function ChildAttendanceScreen() {
  const { childId } = useLocalSearchParams<{ childId: string }>();
  const router = useRouter();
  const { data, isLoading } = useChildAttendance(childId);

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900">
      <View className="flex-row items-center px-4 pt-4 mb-4">
        <Button title="Back" variant="ghost" size="sm" onPress={() => router.back()} />
        <Text className="text-xl font-bold text-gray-900 dark:text-white ml-2">Attendance</Text>
      </View>

      {data ? (
        <View className="px-4 mb-4">
          <Card className="items-center">
            <Text className="text-3xl font-bold text-primary-600">{data.attendanceRate}%</Text>
            <Text className="text-xs text-gray-500">Attendance Rate</Text>
          </Card>
        </View>
      ) : null}

      {isLoading ? (
        <View className="px-4">{[1, 2, 3].map((i) => <SkeletonCard key={i} />)}</View>
      ) : !data?.records.length ? (
        <EmptyState title="No records" description="Attendance records will appear here." />
      ) : (
        <FlatList
          data={data.records}
          keyExtractor={(_, i) => String(i)}
          contentContainerClassName="px-4 pb-8"
          renderItem={({ item }) => (
            <Card className="mb-2">
              <View className="flex-row items-center justify-between">
                <View>
                  <Text className="text-sm font-medium text-gray-900 dark:text-white">{item.courseTitle}</Text>
                  <Text className="text-xs text-gray-500">{new Date(item.date).toLocaleDateString()}</Text>
                </View>
                <Badge label={item.status} variant={item.status === "present" ? "success" : item.status === "late" ? "warning" : "error"} />
              </View>
            </Card>
          )}
        />
      )}
    </SafeAreaView>
  );
}
