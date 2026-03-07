import { useState, useEffect, useCallback } from "react";
import { View, Text, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";

interface Question {
  id: string;
  text: string;
  options: { id: string; text: string }[];
}

interface ExamSession {
  id: string;
  title: string;
  duration: number;
  questions: Question[];
}

export default function TakeExamScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(0);

  const { data: session, isLoading } = useQuery({
    queryKey: ["exam-session", id],
    queryFn: () => api.post<ExamSession>(`/sms/assessments/exams/${id}/start`, {}),
    enabled: !!id,
  });

  useEffect(() => {
    if (session?.duration) {
      setTimeLeft(session.duration * 60);
    }
  }, [session?.duration]);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft > 0]);

  const submitExam = useMutation({
    mutationFn: () =>
      api.post(`/sms/assessments/exams/${id}/submit`, { answers }),
    onSuccess: () => {
      router.replace(`/(app)/(student)/exams/${id}/result`);
    },
    onError: (error) => {
      Alert.alert("Submit Error", error.message);
    },
  });

  const handleSubmit = useCallback(() => {
    submitExam.mutate();
  }, [answers]);

  const confirmSubmit = () => {
    const answered = Object.keys(answers).length;
    const total = session?.questions.length ?? 0;
    Alert.alert(
      "Submit Exam",
      `You answered ${answered}/${total} questions. Submit?`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Submit", onPress: handleSubmit },
      ]
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900 px-4 pt-4">
        <Skeleton width="60%" height={24} className="mb-4" />
        <Skeleton width="100%" height={200} />
      </SafeAreaView>
    );
  }

  const question = session?.questions[currentIndex];
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const isLowTime = timeLeft < 60;

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900">
      {/* Header with timer */}
      <View className="flex-row items-center justify-between px-4 py-3 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <Text className="text-sm font-semibold text-gray-900 dark:text-white">
          Q {currentIndex + 1}/{session?.questions.length ?? 0}
        </Text>
        <Badge
          label={`${minutes}:${seconds.toString().padStart(2, "0")}`}
          variant={isLowTime ? "error" : "default"}
        />
        <Button title="Submit" size="sm" variant="outline" onPress={confirmSubmit} />
      </View>

      <ScrollView className="flex-1 px-4 pt-4">
        {question ? (
          <Card>
            <Text className="text-base font-medium text-gray-900 dark:text-white mb-4">
              {question.text}
            </Text>
            {question.options.map((option) => {
              const selected = answers[question.id] === option.id;
              return (
                <Button
                  key={option.id}
                  title={option.text}
                  variant={selected ? "primary" : "outline"}
                  className="mb-2"
                  onPress={() =>
                    setAnswers((prev) => ({ ...prev, [question.id]: option.id }))
                  }
                />
              );
            })}
          </Card>
        ) : null}
      </ScrollView>

      {/* Navigation */}
      <View className="flex-row px-4 py-3 gap-3">
        <Button
          title="Previous"
          variant="outline"
          className="flex-1"
          onPress={() => setCurrentIndex((i) => Math.max(0, i - 1))}
          disabled={currentIndex === 0}
        />
        <Button
          title={currentIndex === (session?.questions.length ?? 1) - 1 ? "Finish" : "Next"}
          className="flex-1"
          onPress={() => {
            if (currentIndex === (session?.questions.length ?? 1) - 1) {
              confirmSubmit();
            } else {
              setCurrentIndex((i) => i + 1);
            }
          }}
        />
      </View>
    </SafeAreaView>
  );
}
