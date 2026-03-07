import { View, Text, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useTeamAttendance } from "@/hooks/useAttendance";
import { AttendanceStatusBadge } from "@/components/attendance/AttendanceStatusBadge";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { SkeletonCard } from "@/components/ui/Skeleton";

export default function TeamAttendanceScreen() {
  const router = useRouter();
  const { data: team, isLoading } = useTeamAttendance();

  const presentCount = team?.filter((t) => t.status === "present").length ?? 0;
  const lateCount = team?.filter((t) => t.status === "late").length ?? 0;
  const absentCount = team?.filter((t) => t.status === "absent").length ?? 0;

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900">
      <View className="flex-row items-center px-4 pt-4 mb-4">
        <Button title="Back" variant="ghost" size="sm" onPress={() => router.back()} />
        <Text className="text-xl font-bold text-gray-900 dark:text-white ml-2">
          Team Attendance
        </Text>
      </View>

      {/* Summary bar */}
      <View className="flex-row gap-3 px-4 mb-4">
        <Card className="flex-1 items-center">
          <Text className="text-xl font-bold text-green-600">{presentCount}</Text>
          <Text className="text-xs text-gray-500">Present</Text>
        </Card>
        <Card className="flex-1 items-center">
          <Text className="text-xl font-bold text-amber-600">{lateCount}</Text>
          <Text className="text-xs text-gray-500">Late</Text>
        </Card>
        <Card className="flex-1 items-center">
          <Text className="text-xl font-bold text-red-600">{absentCount}</Text>
          <Text className="text-xs text-gray-500">Absent</Text>
        </Card>
      </View>

      {isLoading ? (
        <View className="px-4">
          {[1, 2, 3, 4].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </View>
      ) : !team?.length ? (
        <EmptyState
          title="No team data"
          description="Team attendance data will appear here."
        />
      ) : (
        <FlatList
          data={team}
          keyExtractor={(item) => item.id}
          contentContainerClassName="px-4 pb-8"
          renderItem={({ item }) => (
            <Card className="mb-3">
              <View className="flex-row items-center justify-between">
                <View className="flex-1">
                  <Text className="text-sm font-semibold text-gray-900 dark:text-white">
                    {item.staffName}
                  </Text>
                  <Text className="text-xs text-gray-500">{item.staffRole}</Text>
                </View>
                <View className="items-end gap-1">
                  <AttendanceStatusBadge status={item.status} />
                  {item.checkInTime ? (
                    <Text className="text-xs text-gray-500">
                      {new Date(item.checkInTime).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Text>
                  ) : null}
                </View>
              </View>
            </Card>
          )}
        />
      )}
    </SafeAreaView>
  );
}
