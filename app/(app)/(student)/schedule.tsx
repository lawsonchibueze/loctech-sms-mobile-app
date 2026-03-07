import { View, Text, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useStudentSchedule } from "@/hooks/useCourses";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { SkeletonCard } from "@/components/ui/Skeleton";

export default function ScheduleScreen() {
  const { data: schedule, isLoading } = useStudentSchedule();

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900">
      <Text className="text-2xl font-bold text-gray-900 dark:text-white px-4 pt-4 mb-4">
        Class Schedule
      </Text>

      {isLoading ? (
        <View className="px-4">
          {[1, 2, 3].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </View>
      ) : !schedule?.length ? (
        <EmptyState
          title="No classes scheduled"
          description="Your class calendar will appear here."
        />
      ) : (
        <FlatList
          data={schedule}
          keyExtractor={(item) => item.id}
          contentContainerClassName="px-4 pb-8"
          renderItem={({ item }) => (
            <Card className="mb-3">
              <Text className="text-sm font-semibold text-gray-900 dark:text-white">
                {item.courseTitle}
              </Text>
              <View className="flex-row items-center gap-4 mt-2">
                <View>
                  <Text className="text-xs text-gray-500">Date</Text>
                  <Text className="text-sm font-medium text-gray-900 dark:text-white">
                    {new Date(item.date).toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}
                  </Text>
                </View>
                <View>
                  <Text className="text-xs text-gray-500">Time</Text>
                  <Text className="text-sm font-medium text-gray-900 dark:text-white">
                    {item.time}
                  </Text>
                </View>
                {item.room ? (
                  <View>
                    <Text className="text-xs text-gray-500">Room</Text>
                    <Text className="text-sm font-medium text-gray-900 dark:text-white">
                      {item.room}
                    </Text>
                  </View>
                ) : null}
              </View>
              <Text className="text-xs text-gray-500 mt-2">
                {item.instructorName}
              </Text>
            </Card>
          )}
        />
      )}
    </SafeAreaView>
  );
}
