import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";

interface ExamResult {
  id: string;
  examTitle: string;
  courseTitle: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  grade: string;
  passed: boolean;
  completedAt: string;
}

export default function ExamResultScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const { data: result, isLoading } = useQuery({
    queryKey: ["exam-result", id],
    queryFn: () => api.get<ExamResult>(`/sms/assessments/exams/${id}/result`),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900 px-4 pt-4">
        <Skeleton width="60%" height={24} className="mb-4" />
        <Skeleton width="100%" height={200} />
      </SafeAreaView>
    );
  }

  if (!result) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center">
        <Text className="text-gray-500">Result not found</Text>
        <Button title="Go Back" variant="ghost" onPress={() => router.back()} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900">
      <View className="flex-1 px-4 pt-4">
        <Button title="Back" variant="ghost" size="sm" onPress={() => router.back()} className="self-start mb-4" />

        <Card className="items-center mb-4">
          <Text className="text-sm text-gray-500 mb-1">{result.examTitle}</Text>
          <Text className="text-5xl font-bold text-gray-900 dark:text-white mb-2">
            {result.score}%
          </Text>
          <Badge
            label={result.passed ? "PASSED" : "FAILED"}
            variant={result.passed ? "success" : "error"}
          />
          <Text className="text-lg font-semibold text-gray-700 dark:text-gray-300 mt-2">
            Grade: {result.grade}
          </Text>
        </Card>

        <Card>
          <View className="flex-row justify-between mb-2">
            <Text className="text-sm text-gray-500">Total Questions</Text>
            <Text className="text-sm font-semibold text-gray-900 dark:text-white">{result.totalQuestions}</Text>
          </View>
          <View className="flex-row justify-between mb-2">
            <Text className="text-sm text-gray-500">Correct Answers</Text>
            <Text className="text-sm font-semibold text-green-600">{result.correctAnswers}</Text>
          </View>
          <View className="flex-row justify-between mb-2">
            <Text className="text-sm text-gray-500">Wrong Answers</Text>
            <Text className="text-sm font-semibold text-red-600">{result.totalQuestions - result.correctAnswers}</Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-sm text-gray-500">Completed</Text>
            <Text className="text-sm text-gray-900 dark:text-white">
              {new Date(result.completedAt).toLocaleDateString()}
            </Text>
          </View>
        </Card>
      </View>
    </SafeAreaView>
  );
}
