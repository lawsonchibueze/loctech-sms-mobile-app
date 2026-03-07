import { View, Text, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { Input } from "@/components/ui/Input";
import { useState } from "react";

interface AssignmentDetail {
  id: string;
  title: string;
  description: string;
  courseTitle: string;
  dueDate: string;
  status: "pending" | "submitted" | "graded" | "overdue";
  grade?: number;
  maxGrade: number;
  feedback?: string;
  submittedAt?: string;
}

export default function AssignmentDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [answer, setAnswer] = useState("");

  const { data: assignment, isLoading } = useQuery({
    queryKey: ["assignment", id],
    queryFn: () => api.get<AssignmentDetail>(`/sms/learning/assignments/${id}`),
    enabled: !!id,
  });

  const submit = useMutation({
    mutationFn: () =>
      api.post(`/sms/learning/assignments/${id}/submit`, { answer }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assignment", id] });
      queryClient.invalidateQueries({ queryKey: ["student", "assignments"] });
      Alert.alert("Submitted", "Your assignment has been submitted.");
    },
  });

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900 px-4 pt-4">
        <Skeleton width="70%" height={24} className="mb-3" />
        <Skeleton width="100%" height={80} className="mb-3" />
        <Skeleton width="40%" height={16} />
      </SafeAreaView>
    );
  }

  if (!assignment) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center">
        <Text className="text-gray-500">Assignment not found</Text>
        <Button title="Go Back" variant="ghost" onPress={() => router.back()} />
      </SafeAreaView>
    );
  }

  const canSubmit = assignment.status === "pending" || assignment.status === "overdue";

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900">
      <ScrollView className="flex-1 px-4 pt-4">
        <Button title="Back" variant="ghost" size="sm" onPress={() => router.back()} className="self-start mb-2" />

        <View className="flex-row items-start justify-between mb-2">
          <Text className="text-xl font-bold text-gray-900 dark:text-white flex-1 mr-2">
            {assignment.title}
          </Text>
          <Badge
            label={assignment.status}
            variant={
              assignment.status === "graded"
                ? "success"
                : assignment.status === "overdue"
                ? "error"
                : "info"
            }
          />
        </View>

        <Text className="text-xs text-gray-500 mb-1">{assignment.courseTitle}</Text>
        <Text className="text-xs text-gray-500 mb-4">
          Due: {new Date(assignment.dueDate).toLocaleDateString()}
        </Text>

        <Card className="mb-4">
          <Text className="text-sm text-gray-700 dark:text-gray-300 leading-6">
            {assignment.description}
          </Text>
        </Card>

        {/* Grade & feedback */}
        {assignment.status === "graded" ? (
          <Card className="mb-4">
            <Text className="text-base font-semibold text-gray-900 dark:text-white mb-2">
              Grade: {assignment.grade}/{assignment.maxGrade}
            </Text>
            {assignment.feedback ? (
              <Text className="text-sm text-gray-600 dark:text-gray-400">
                {assignment.feedback}
              </Text>
            ) : null}
          </Card>
        ) : null}

        {/* Submit */}
        {canSubmit ? (
          <View className="mb-8">
            <Input
              label="Your Answer"
              placeholder="Type your answer here..."
              value={answer}
              onChangeText={setAnswer}
              multiline
              numberOfLines={6}
            />
            <Button
              title="Submit Assignment"
              onPress={() => submit.mutate()}
              loading={submit.isPending}
              disabled={!answer.trim()}
              size="lg"
            />
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}
