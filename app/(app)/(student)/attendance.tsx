import { View, Text, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useStudentAttendance } from "@/hooks/useCourses";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { SkeletonCard } from "@/components/ui/Skeleton";

export default function StudentAttendanceScreen() {
  const { data, isLoading } = useStudentAttendance();

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900">
      <Text className="text-2xl font-bold text-gray-900 dark:text-white px-4 pt-4 mb-2">
        Attendance
      </Text>

      {data ? (
        <View className="flex-row gap-3 px-4 mb-4">
          <Card className="flex-1 items-center">
            <Text className="text-2xl font-bold text-primary-600">
              {data.attendanceRate}%
            </Text>
            <Text className="text-xs text-gray-500">Rate</Text>
          </Card>
          <Card className="flex-1 items-center">
            <Text className="text-2xl font-bold text-green-600">{data.attended}</Text>
            <Text className="text-xs text-gray-500">Attended</Text>
          </Card>
          <Card className="flex-1 items-center">
            <Text className="text-2xl font-bold text-gray-600">
              {data.totalClasses}
            </Text>
            <Text className="text-xs text-gray-500">Total</Text>
          </Card>
        </View>
      ) : null}

      {isLoading ? (
        <View className="px-4">
          {[1, 2, 3, 4].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </View>
      ) : !data?.records.length ? (
        <EmptyState
          title="No attendance records"
          description="Your attendance records will appear here."
        />
      ) : (
        <FlatList
          data={data.records}
          keyExtractor={(_, i) => String(i)}
          contentContainerClassName="px-4 pb-8"
          renderItem={({ item }) => (
            <Card className="mb-2">
              <View className="flex-row items-center justify-between">
                <View>
                  <Text className="text-sm font-medium text-gray-900 dark:text-white">
                    {item.courseTitle}
                  </Text>
                  <Text className="text-xs text-gray-500">
                    {new Date(item.date).toLocaleDateString()}
                  </Text>
                </View>
                <Badge
                  label={item.status}
                  variant={
                    item.status === "present"
                      ? "success"
                      : item.status === "late"
                      ? "warning"
                      : "error"
                  }
                />
              </View>
            </Card>
          )}
        />
      )}
    </SafeAreaView>
  );
}
