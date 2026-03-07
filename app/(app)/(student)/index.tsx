import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useAuthStore } from "@/lib/auth-store";
import { useEnrolledCourses, useAssignments } from "@/hooks/useCourses";
import { Card } from "@/components/ui/Card";
import { StatCard } from "@/components/dashboard/StatCard";
import { Badge } from "@/components/ui/Badge";

export default function StudentDashboard() {
  const user = useAuthStore((s) => s.user);
  const router = useRouter();
  const { data: courses } = useEnrolledCourses();
  const { data: assignments } = useAssignments();

  const pendingAssignments = assignments?.filter((a) => a.status === "pending") ?? [];
  const overallProgress = courses?.length
    ? Math.round(courses.reduce((sum, c) => sum + c.progress, 0) / courses.length)
    : 0;

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900">
      <ScrollView className="flex-1 px-4 pt-4">
        <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
          Welcome back
        </Text>
        <Text className="text-base text-gray-500 dark:text-gray-400 mb-6">
          {user?.firstName} {user?.lastName}
        </Text>

        <View className="flex-row gap-3 mb-4">
          <StatCard
            label="Courses"
            value={courses?.length ?? 0}
            color="text-primary-600"
          />
          <StatCard
            label="Progress"
            value={`${overallProgress}%`}
            color="text-green-600"
          />
        </View>

        {/* Continue learning */}
        {courses?.length ? (
          <Card className="mb-4">
            <Text className="text-base font-semibold text-gray-900 dark:text-white mb-3">
              Continue Learning
            </Text>
            {courses.slice(0, 2).map((course) => (
              <TouchableOpacity
                key={course.id}
                onPress={() => router.push(`/(app)/(student)/courses/${course.id}`)}
                className="flex-row items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-b-0"
              >
                <View className="flex-1 mr-3">
                  <Text className="text-sm font-medium text-gray-900 dark:text-white">
                    {course.title}
                  </Text>
                  <Text className="text-xs text-gray-500 mt-0.5">
                    {course.completedModules}/{course.totalModules} modules
                  </Text>
                </View>
                <View className="w-12 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <View
                    className="h-full bg-primary-600 rounded-full"
                    style={{ width: `${course.progress}%` }}
                  />
                </View>
              </TouchableOpacity>
            ))}
          </Card>
        ) : (
          <Card className="mb-4">
            <Text className="text-base font-semibold text-gray-900 dark:text-white mb-2">
              No Courses Yet
            </Text>
            <Text className="text-sm text-gray-500">
              You are not enrolled in any courses.
            </Text>
          </Card>
        )}

        {/* Pending assignments */}
        <Card className="mb-4">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-base font-semibold text-gray-900 dark:text-white">
              Pending Assignments
            </Text>
            {pendingAssignments.length > 0 ? (
              <Badge label={String(pendingAssignments.length)} variant="error" />
            ) : null}
          </View>
          {pendingAssignments.length ? (
            pendingAssignments.slice(0, 3).map((a) => (
              <TouchableOpacity
                key={a.id}
                onPress={() => router.push(`/(app)/(student)/assignments/${a.id}`)}
                className="py-2 border-b border-gray-100 dark:border-gray-700 last:border-b-0"
              >
                <Text className="text-sm font-medium text-gray-900 dark:text-white">
                  {a.title}
                </Text>
                <Text className="text-xs text-gray-500">
                  Due: {new Date(a.dueDate).toLocaleDateString()}
                </Text>
              </TouchableOpacity>
            ))
          ) : (
            <Text className="text-sm text-gray-500">No pending assignments</Text>
          )}
        </Card>

        {/* Quick links */}
        <View className="gap-3 mb-8">
          <TouchableOpacity onPress={() => router.push("/(app)/(student)/grades")}>
            <Card>
              <Text className="text-sm font-medium text-gray-900 dark:text-white">
                View Grades
              </Text>
            </Card>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("/(app)/(student)/attendance")}>
            <Card>
              <Text className="text-sm font-medium text-gray-900 dark:text-white">
                Attendance Records
              </Text>
            </Card>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("/(app)/(student)/schedule")}>
            <Card>
              <Text className="text-sm font-medium text-gray-900 dark:text-white">
                Class Schedule
              </Text>
            </Card>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
