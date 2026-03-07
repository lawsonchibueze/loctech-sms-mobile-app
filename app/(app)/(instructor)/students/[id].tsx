import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useStudentDetail } from "@/hooks/useInstructor";
import { Card } from "@/components/ui/Card";
import { StatCard } from "@/components/dashboard/StatCard";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";

export default function StudentDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data: student, isLoading } = useStudentDetail(id);

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900 px-4 pt-4">
        <Skeleton width="50%" height={24} className="mb-4" />
        <Skeleton width="100%" height={80} />
      </SafeAreaView>
    );
  }

  if (!student) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center">
        <Text className="text-gray-500">Student not found</Text>
        <Button title="Go Back" variant="ghost" onPress={() => router.back()} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900">
      <ScrollView className="flex-1 px-4 pt-4">
        <Button title="Back" variant="ghost" size="sm" onPress={() => router.back()} className="self-start mb-2" />

        <Text className="text-xl font-bold text-gray-900 dark:text-white mb-1">{student.name}</Text>
        <Text className="text-sm text-gray-500 mb-4">{student.email}</Text>

        <View className="flex-row gap-3 mb-4">
          <StatCard label="Attendance" value={`${student.attendanceRate}%`} color="text-green-600" />
          <StatCard label="Overall" value={`${student.overallGrade}%`} color="text-primary-600" />
        </View>

        <Card className="mb-8">
          <Text className="text-base font-semibold text-gray-900 dark:text-white mb-3">Courses</Text>
          {student.courses.map((course, i) => (
            <View key={i} className="py-2 border-b border-gray-100 dark:border-gray-700 last:border-b-0">
              <Text className="text-sm font-medium text-gray-900 dark:text-white">{course.title}</Text>
              <View className="flex-row items-center gap-2 mt-1">
                <View className="flex-1 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <View className="h-full bg-primary-600 rounded-full" style={{ width: `${course.progress}%` }} />
                </View>
                <Text className="text-xs text-gray-500">{course.progress}%</Text>
              </View>
            </View>
          ))}
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}
