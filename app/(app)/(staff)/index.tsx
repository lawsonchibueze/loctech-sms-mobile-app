import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useAuthStore } from "@/lib/auth-store";
import { useTodayAttendance, useAttendanceSummary } from "@/hooks/useAttendance";
import { useCheckOut } from "@/hooks/useAttendance";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { StatCard } from "@/components/dashboard/StatCard";
import { AttendanceStatusBadge } from "@/components/attendance/AttendanceStatusBadge";

export default function StaffDashboard() {
  const user = useAuthStore((s) => s.user);
  const router = useRouter();
  const { data: today } = useTodayAttendance();
  const { data: summary } = useAttendanceSummary("month");
  const checkOut = useCheckOut();

  const isCheckedIn = !!today?.checkInTime;
  const isCheckedOut = !!today?.checkOutTime;

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900">
      <ScrollView className="flex-1 px-4 pt-4">
        <View className="flex-row items-center justify-between mb-6">
          <View>
            <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              Staff Dashboard
            </Text>
            <Text className="text-base text-gray-500 dark:text-gray-400">
              {user?.firstName} {user?.lastName}
            </Text>
          </View>
          <AttendanceStatusBadge
            status={
              isCheckedOut
                ? "present"
                : isCheckedIn
                ? today?.status ?? "present"
                : "not_checked_in"
            }
            size="md"
          />
        </View>

        {/* Check-in / Check-out action */}
        <Card className="mb-4">
          {!isCheckedIn ? (
            <View>
              <Text className="text-base font-semibold text-gray-900 dark:text-white mb-2">
                Good morning! Ready to check in?
              </Text>
              <Button
                title="Scan QR to Check In"
                onPress={() => router.push("/(app)/(staff)/check-in")}
                size="lg"
              />
            </View>
          ) : !isCheckedOut ? (
            <View>
              <Text className="text-base font-semibold text-gray-900 dark:text-white mb-1">
                Checked in at{" "}
                {today?.checkInTime
                  ? new Date(today.checkInTime).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : ""}
              </Text>
              {today?.isLate ? (
                <Text className="text-xs text-amber-600 mb-2">
                  Late arrival{today.lateReason ? `: ${today.lateReason}` : ""}
                </Text>
              ) : null}
              <Button
                title="Check Out"
                variant="outline"
                onPress={() => checkOut.mutate()}
                loading={checkOut.isPending}
              />
            </View>
          ) : (
            <View>
              <Text className="text-base font-semibold text-green-600 mb-1">
                Day complete!
              </Text>
              <Text className="text-sm text-gray-500">
                {today?.checkInTime
                  ? new Date(today.checkInTime).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : ""}{" "}
                -{" "}
                {today?.checkOutTime
                  ? new Date(today.checkOutTime).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : ""}
              </Text>
            </View>
          )}
        </Card>

        {/* Monthly stats */}
        <View className="flex-row gap-3 mb-4">
          <StatCard
            label="Attendance"
            value={summary ? `${summary.attendanceRate}%` : "--"}
            color="text-primary-600"
          />
          <StatCard
            label="Present"
            value={summary?.presentDays ?? 0}
            color="text-green-600"
          />
          <StatCard
            label="Late"
            value={summary?.lateDays ?? 0}
            color="text-amber-600"
          />
        </View>

        {/* Quick actions */}
        <Text className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          Quick Actions
        </Text>
        <View className="gap-3 mb-8">
          <TouchableOpacity onPress={() => router.push("/(app)/(staff)/attendance/my-history")}>
            <Card>
              <Text className="text-sm font-medium text-gray-900 dark:text-white">
                My Attendance History
              </Text>
              <Text className="text-xs text-gray-500">View your check-in records</Text>
            </Card>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push("/(app)/(staff)/attendance/team")}>
            <Card>
              <Text className="text-sm font-medium text-gray-900 dark:text-white">
                Team Attendance
              </Text>
              <Text className="text-xs text-gray-500">See who's checked in today</Text>
            </Card>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push("/(app)/(staff)/attendance/reports")}>
            <Card>
              <Text className="text-sm font-medium text-gray-900 dark:text-white">
                Attendance Reports
              </Text>
              <Text className="text-xs text-gray-500">
                Weekly and monthly summaries
              </Text>
            </Card>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
