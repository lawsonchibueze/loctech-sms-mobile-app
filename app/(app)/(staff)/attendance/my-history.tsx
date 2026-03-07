import { View, Text, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useAttendanceHistory } from "@/hooks/useAttendance";
import { AttendanceStatusBadge } from "@/components/attendance/AttendanceStatusBadge";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { SkeletonCard } from "@/components/ui/Skeleton";

export default function AttendanceHistoryScreen() {
  const router = useRouter();
  const { data: records, isLoading } = useAttendanceHistory();

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900">
      <View className="flex-row items-center px-4 pt-4 mb-4">
        <Button title="Back" variant="ghost" size="sm" onPress={() => router.back()} />
        <Text className="text-xl font-bold text-gray-900 dark:text-white ml-2">
          My Attendance
        </Text>
      </View>

      {isLoading ? (
        <View className="px-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </View>
      ) : !records?.length ? (
        <EmptyState
          title="No attendance records"
          description="Your attendance history will appear here."
        />
      ) : (
        <FlatList
          data={records}
          keyExtractor={(item) => item.id}
          contentContainerClassName="px-4 pb-8"
          renderItem={({ item }) => (
            <Card className="mb-3">
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-sm font-semibold text-gray-900 dark:text-white">
                  {new Date(item.date).toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}
                </Text>
                <AttendanceStatusBadge status={item.status} />
              </View>
              <View className="flex-row gap-6">
                <View>
                  <Text className="text-xs text-gray-500">Check In</Text>
                  <Text className="text-sm font-medium text-gray-900 dark:text-white">
                    {item.checkInTime
                      ? new Date(item.checkInTime).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "--:--"}
                  </Text>
                </View>
                <View>
                  <Text className="text-xs text-gray-500">Check Out</Text>
                  <Text className="text-sm font-medium text-gray-900 dark:text-white">
                    {item.checkOutTime
                      ? new Date(item.checkOutTime).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "--:--"}
                  </Text>
                </View>
              </View>
              {item.lateReason ? (
                <Text className="text-xs text-amber-600 mt-2">
                  Reason: {item.lateReason}
                </Text>
              ) : null}
            </Card>
          )}
        />
      )}
    </SafeAreaView>
  );
}
