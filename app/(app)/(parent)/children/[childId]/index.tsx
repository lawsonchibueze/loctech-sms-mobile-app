import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useChildDetail } from "@/hooks/useParent";
import { Card } from "@/components/ui/Card";
import { StatCard } from "@/components/dashboard/StatCard";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";

export default function ChildDashboardScreen() {
  const { childId } = useLocalSearchParams<{ childId: string }>();
  const router = useRouter();
  const { data: child, isLoading } = useChildDetail(childId);

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900 px-4 pt-4">
        <Skeleton width="50%" height={24} className="mb-4" />
        <Skeleton width="100%" height={80} className="mb-3" />
        <Skeleton width="100%" height={80} />
      </SafeAreaView>
    );
  }

  if (!child) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center">
        <Text className="text-gray-500">Child not found</Text>
        <Button title="Go Back" variant="ghost" onPress={() => router.back()} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900">
      <ScrollView className="flex-1 px-4 pt-4">
        <Button title="Back" variant="ghost" size="sm" onPress={() => router.back()} className="self-start mb-2" />

        <View className="flex-row items-center gap-3 mb-6">
          <View className="w-14 h-14 rounded-full bg-primary-100 dark:bg-primary-900 items-center justify-center">
            <Text className="text-xl font-bold text-primary-600">
              {child.name.charAt(0)}
            </Text>
          </View>
          <View>
            <Text className="text-xl font-bold text-gray-900 dark:text-white">
              {child.name}
            </Text>
            <Text className="text-sm text-gray-500">{child.enrollmentStatus}</Text>
          </View>
        </View>

        <View className="flex-row gap-3 mb-4">
          <StatCard label="Courses" value={child.courses.length} color="text-primary-600" />
          <StatCard label="Attendance" value={`${child.attendanceRate}%`} color="text-green-600" />
        </View>

        {/* Courses */}
        <Card className="mb-4">
          <Text className="text-base font-semibold text-gray-900 dark:text-white mb-3">
            Courses
          </Text>
          {child.courses.map((course) => (
            <View key={course.id} className="py-2 border-b border-gray-100 dark:border-gray-700 last:border-b-0">
              <Text className="text-sm font-medium text-gray-900 dark:text-white">
                {course.title}
              </Text>
              <View className="flex-row items-center gap-2 mt-1">
                <View className="flex-1 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <View className="h-full bg-primary-600 rounded-full" style={{ width: `${course.progress}%` }} />
                </View>
                <Text className="text-xs text-gray-500">{course.progress}%</Text>
              </View>
            </View>
          ))}
        </Card>

        {/* Quick links */}
        <View className="gap-3 mb-8">
          <TouchableOpacity onPress={() => router.push(`/(app)/(parent)/children/${childId}/attendance`)}>
            <Card>
              <Text className="text-sm font-medium text-gray-900 dark:text-white">View Attendance</Text>
            </Card>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push(`/(app)/(parent)/children/${childId}/grades`)}>
            <Card>
              <Text className="text-sm font-medium text-gray-900 dark:text-white">View Grades</Text>
            </Card>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push(`/(app)/(parent)/children/${childId}/payments`)}>
            <Card>
              <Text className="text-sm font-medium text-gray-900 dark:text-white">Payment Status</Text>
              {child.outstandingBalance > 0 ? (
                <Text className="text-xs text-red-600">Outstanding: ₦{child.outstandingBalance.toLocaleString()}</Text>
              ) : null}
            </Card>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
