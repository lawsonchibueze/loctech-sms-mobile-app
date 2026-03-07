import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useAuthStore } from "@/lib/auth-store";
import { useTodayAttendance } from "@/hooks/useAttendance";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { StatCard } from "@/components/dashboard/StatCard";
import { AttendanceStatusBadge } from "@/components/attendance/AttendanceStatusBadge";

export default function InstructorDashboard() {
  const user = useAuthStore((s) => s.user);
  const router = useRouter();
  const { data: today } = useTodayAttendance();

  const isCheckedIn = !!today?.checkInTime;

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900">
      <ScrollView className="flex-1 px-4 pt-4">
        <View className="flex-row items-center justify-between mb-6">
          <View>
            <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              Instructor Dashboard
            </Text>
            <Text className="text-base text-gray-500 dark:text-gray-400">
              {user?.firstName} {user?.lastName}
            </Text>
          </View>
          <AttendanceStatusBadge
            status={isCheckedIn ? today?.status ?? "present" : "not_checked_in"}
            size="md"
          />
        </View>

        {/* Check-in card */}
        {!isCheckedIn ? (
          <Card className="mb-4">
            <Text className="text-base font-semibold text-gray-900 dark:text-white mb-2">
              You haven't checked in yet
            </Text>
            <Button
              title="Scan QR to Check In"
              onPress={() => router.push("/(app)/(instructor)/check-in")}
              size="lg"
            />
          </Card>
        ) : (
          <Card className="mb-4">
            <Text className="text-sm text-green-600 font-medium">
              Checked in at{" "}
              {today?.checkInTime
                ? new Date(today.checkInTime).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : ""}
            </Text>
          </Card>
        )}

        {/* Stats */}
        <View className="flex-row gap-3 mb-4">
          <StatCard label="Classes Today" value={0} color="text-primary-600" />
          <StatCard label="Students" value={0} color="text-amber-600" />
        </View>

        {/* Quick actions */}
        <Text className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          Quick Actions
        </Text>
        <View className="gap-3 mb-8">
          <TouchableOpacity
            onPress={() => router.push("/(app)/(instructor)/mark-attendance")}
          >
            <Card>
              <Text className="text-sm font-medium text-gray-900 dark:text-white">
                Mark Student Attendance
              </Text>
              <Text className="text-xs text-gray-500">
                Mark attendance for your class
              </Text>
            </Card>
          </TouchableOpacity>

          <Card>
            <Text className="text-base font-semibold text-gray-900 dark:text-white mb-2">
              Today's Schedule
            </Text>
            <Text className="text-sm text-gray-500">No classes scheduled</Text>
          </Card>

          <Card>
            <Text className="text-base font-semibold text-gray-900 dark:text-white mb-2">
              Daily Report
            </Text>
            <Text className="text-sm text-gray-500">
              No report submitted today
            </Text>
          </Card>

          <Card>
            <Text className="text-base font-semibold text-gray-900 dark:text-white mb-2">
              Pending Submissions
            </Text>
            <Text className="text-sm text-gray-500">
              No submissions to grade
            </Text>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
