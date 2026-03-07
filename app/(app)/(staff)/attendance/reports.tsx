import { useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useAttendanceSummary } from "@/hooks/useAttendance";
import { AttendanceChart } from "@/components/attendance/AttendanceChart";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";

type Period = "week" | "month" | "quarter";

export default function AttendanceReportsScreen() {
  const router = useRouter();
  const [period, setPeriod] = useState<Period>("month");
  const { data: summary, isLoading } = useAttendanceSummary(period);

  // Mock week data for the chart (will be replaced with real data)
  const weekData: { day: string; status: null }[] = [
    { day: "Mon", status: null },
    { day: "Tue", status: null },
    { day: "Wed", status: null },
    { day: "Thu", status: null },
    { day: "Fri", status: null },
  ];

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900">
      <View className="flex-row items-center px-4 pt-4 mb-4">
        <Button title="Back" variant="ghost" size="sm" onPress={() => router.back()} />
        <Text className="text-xl font-bold text-gray-900 dark:text-white ml-2">
          Attendance Reports
        </Text>
      </View>

      {/* Period selector */}
      <View className="flex-row gap-2 px-4 mb-4">
        {(["week", "month", "quarter"] as Period[]).map((p) => (
          <Button
            key={p}
            title={p.charAt(0).toUpperCase() + p.slice(1)}
            variant={period === p ? "primary" : "outline"}
            size="sm"
            onPress={() => setPeriod(p)}
          />
        ))}
      </View>

      <ScrollView className="flex-1 px-4">
        {/* Summary stats */}
        {isLoading ? (
          <Card className="mb-4">
            <Skeleton width="100%" height={80} />
          </Card>
        ) : summary ? (
          <Card className="mb-4">
            <Text className="text-base font-semibold text-gray-900 dark:text-white mb-4">
              Summary
            </Text>
            <View className="flex-row justify-between mb-4">
              <View className="items-center">
                <Text className="text-2xl font-bold text-primary-600">
                  {summary.attendanceRate}%
                </Text>
                <Text className="text-xs text-gray-500">Rate</Text>
              </View>
              <View className="items-center">
                <Text className="text-2xl font-bold text-green-600">
                  {summary.presentDays}
                </Text>
                <Text className="text-xs text-gray-500">Present</Text>
              </View>
              <View className="items-center">
                <Text className="text-2xl font-bold text-amber-600">
                  {summary.lateDays}
                </Text>
                <Text className="text-xs text-gray-500">Late</Text>
              </View>
              <View className="items-center">
                <Text className="text-2xl font-bold text-red-600">
                  {summary.absentDays}
                </Text>
                <Text className="text-xs text-gray-500">Absent</Text>
              </View>
            </View>

            {/* Progress bar */}
            <View className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden flex-row">
              <View
                className="h-full bg-green-500"
                style={{
                  width: `${(summary.presentDays / summary.totalDays) * 100}%`,
                }}
              />
              <View
                className="h-full bg-amber-500"
                style={{
                  width: `${(summary.lateDays / summary.totalDays) * 100}%`,
                }}
              />
              <View
                className="h-full bg-red-500"
                style={{
                  width: `${(summary.absentDays / summary.totalDays) * 100}%`,
                }}
              />
            </View>
          </Card>
        ) : null}

        {/* Weekly chart */}
        <Card className="mb-8">
          <Text className="text-base font-semibold text-gray-900 dark:text-white mb-3">
            Weekly Overview
          </Text>
          <AttendanceChart data={weekData} title="" />
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}
