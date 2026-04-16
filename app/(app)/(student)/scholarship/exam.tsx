import { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Alert,
  AppState,
  AppStateStatus,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { SkeletonCard } from "@/components/ui/Skeleton";
import {
  useMyCbtExams,
  useStartExam,
  useSaveAnswer,
  useSubmitExam,
  useExamResults,
  type ExamQuestion,
} from "@/hooks/useScholarship";

type ExamState = "list" | "taking" | "results";

export default function ScholarshipExamScreen() {
  const router = useRouter();
  const { data: myExams, isLoading } = useMyCbtExams();
  const [examState, setExamState] = useState<ExamState>("list");
  const [activeUserExamId, setActiveUserExamId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<ExamQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [examDuration, setExamDuration] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Find pending exam
  const pendingExam = myExams?.find(
    (e) => e.status === "not_started" || e.status === "in_progress"
  );
  const completedExam = myExams?.find((e) => e.status === "completed");

  const startExamMutation = useStartExam(pendingExam?.examId ?? "");
  const saveAnswerMutation = useSaveAnswer(activeUserExamId ?? "");
  const submitExamMutation = useSubmitExam(activeUserExamId ?? "");

  // Timer
  useEffect(() => {
    if (examState !== "taking" || timeLeft <= 0) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [examState, timeLeft]);

  // Violation detection (tab switch / app background)
  useEffect(() => {
    if (examState !== "taking") return;

    const handleAppState = (state: AppStateStatus) => {
      if (state !== "active" && activeUserExamId) {
        // Report violation when user leaves the app during exam
        fetch("", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "app_background",
            details: "User left the app during exam",
          }),
        }).catch(() => {});
      }
    };

    const sub = AppState.addEventListener("change", handleAppState);
    return () => sub.remove();
  }, [examState, activeUserExamId]);

  const handleStartExam = async () => {
    if (!pendingExam) return;
    try {
      const result = await startExamMutation.mutateAsync();
      setActiveUserExamId(result.userExamId);
      setQuestions(result.questions);
      setCurrentIdx(0);
      setAnswers({});
      setExamDuration(60 * 60); // Default 60 min; should come from exam config
      setTimeLeft(60 * 60);
      setExamState("taking");
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to start exam");
    }
  };

  const handleSelectAnswer = useCallback(
    (questionId: string, answer: string) => {
      setAnswers((prev) => ({ ...prev, [questionId]: answer }));
      // Auto-save
      if (activeUserExamId) {
        saveAnswerMutation.mutate({ questionId, answer });
      }
    },
    [activeUserExamId, saveAnswerMutation]
  );

  const handleSubmit = async () => {
    if (!activeUserExamId) return;

    Alert.alert("Submit Exam", "Are you sure you want to submit?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Submit",
        style: "destructive",
        onPress: async () => {
          try {
            if (timerRef.current) clearInterval(timerRef.current);
            await submitExamMutation.mutateAsync();
            setExamState("results");
          } catch (error: any) {
            Alert.alert("Error", error.message || "Failed to submit exam");
          }
        },
      },
    ]);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // ═══ EXAM LIST STATE ════════════════════════════════════════════

  if (examState === "list") {
    if (isLoading) {
      return (
        <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900 px-4 pt-4">
          <SkeletonCard />
        </SafeAreaView>
      );
    }

    if (completedExam) {
      return (
        <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900">
          <ScrollView className="flex-1 px-4 pt-4">
            <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Scholarship Exam
            </Text>
            <ExamResultsCard userExamId={completedExam.id} />
            <Button
              title="Back to Applications"
              variant="outline"
              className="mt-4"
              onPress={() => router.push("/scholarship/applications")}
            />
          </ScrollView>
        </SafeAreaView>
      );
    }

    if (!pendingExam) {
      return (
        <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900">
          <EmptyState
            title="No exam assigned"
            description="You don't have a scholarship exam at this time."
          />
        </SafeAreaView>
      );
    }

    return (
      <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900">
        <ScrollView className="flex-1 px-4 pt-4">
          <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Scholarship Exam
          </Text>
          <Card className="mb-4">
            <Text className="text-base font-semibold text-gray-900 dark:text-white mb-2">
              Your exam is ready
            </Text>
            <Text className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Please read the instructions carefully before starting:
            </Text>
            <View className="space-y-1 mb-4">
              <Text className="text-sm text-gray-600 dark:text-gray-400">
                • Do not switch apps during the exam
              </Text>
              <Text className="text-sm text-gray-600 dark:text-gray-400">
                • Answers are auto-saved as you go
              </Text>
              <Text className="text-sm text-gray-600 dark:text-gray-400">
                • The exam will auto-submit when time runs out
              </Text>
              <Text className="text-sm text-gray-600 dark:text-gray-400">
                • Violations (leaving the app) are tracked
              </Text>
            </View>
            <Button
              title={
                startExamMutation.isPending ? "Starting..." : "Start Exam"
              }
              onPress={handleStartExam}
              disabled={startExamMutation.isPending}
            />
          </Card>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ═══ TAKING EXAM STATE ══════════════════════════════════════════

  if (examState === "taking") {
    const question = questions[currentIdx];
    if (!question) return null;

    const selectedAnswer = answers[question.id];
    const isLast = currentIdx === questions.length - 1;
    const answeredCount = Object.keys(answers).length;

    return (
      <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900">
        {/* Timer bar */}
        <View className="bg-white dark:bg-gray-800 px-4 py-3 flex-row items-center justify-between border-b border-gray-200 dark:border-gray-700">
          <Text className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Q {currentIdx + 1} / {questions.length}
          </Text>
          <Text
            className={`text-sm font-bold ${
              timeLeft < 300 ? "text-red-600" : "text-gray-900 dark:text-white"
            }`}
          >
            ⏱ {formatTime(timeLeft)}
          </Text>
          <Text className="text-sm text-gray-500">
            {answeredCount}/{questions.length} answered
          </Text>
        </View>

        <ScrollView className="flex-1 px-4 pt-4">
          {/* Question */}
          <Card className="mb-4">
            <View className="flex-row items-center gap-2 mb-2">
              <Text className="text-xs text-gray-500 uppercase">
                {question.questionType.replace("_", " ")}
              </Text>
              <Text className="text-xs text-gray-500">
                • {question.points} pts
              </Text>
            </View>
            <Text className="text-base text-gray-900 dark:text-white leading-6">
              {question.questionText}
            </Text>
          </Card>

          {/* Answer options */}
          {question.questionType === "mcq" && question.options ? (
            <View className="mb-4">
              {(question.options as string[]).map((option, idx) => (
                <Pressable
                  key={idx}
                  className={`mb-2 p-3 rounded-lg border ${
                    selectedAnswer === option
                      ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20"
                      : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                  }`}
                  onPress={() => handleSelectAnswer(question.id, option)}
                >
                  <View className="flex-row items-center">
                    <View
                      className={`w-5 h-5 rounded-full border-2 mr-3 items-center justify-center ${
                        selectedAnswer === option
                          ? "border-blue-600 bg-blue-600"
                          : "border-gray-400"
                      }`}
                    >
                      {selectedAnswer === option && (
                        <View className="w-2 h-2 rounded-full bg-white" />
                      )}
                    </View>
                    <Text className="text-sm text-gray-900 dark:text-white flex-1">
                      {option}
                    </Text>
                  </View>
                </Pressable>
              ))}
            </View>
          ) : question.questionType === "true_false" ? (
            <View className="flex-row gap-3 mb-4">
              {["True", "False"].map((opt) => (
                <Pressable
                  key={opt}
                  className={`flex-1 p-3 rounded-lg border items-center ${
                    selectedAnswer === opt
                      ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20"
                      : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                  }`}
                  onPress={() => handleSelectAnswer(question.id, opt)}
                >
                  <Text
                    className={`text-sm font-medium ${
                      selectedAnswer === opt ? "text-blue-600" : "text-gray-900 dark:text-white"
                    }`}
                  >
                    {opt}
                  </Text>
                </Pressable>
              ))}
            </View>
          ) : null}

          {/* Navigation */}
          <View className="flex-row gap-3 mb-8">
            {currentIdx > 0 && (
              <Button
                title="Previous"
                variant="outline"
                className="flex-1"
                onPress={() => setCurrentIdx(currentIdx - 1)}
              />
            )}
            {!isLast ? (
              <Button
                title="Next"
                className="flex-1"
                onPress={() => setCurrentIdx(currentIdx + 1)}
              />
            ) : (
              <Button
                title="Submit Exam"
                className="flex-1"
                onPress={handleSubmit}
              />
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ═══ RESULTS STATE ══════════════════════════════════════════════

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900">
      <ScrollView className="flex-1 px-4 pt-4">
        <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Exam Complete
        </Text>
        {activeUserExamId && <ExamResultsCard userExamId={activeUserExamId} />}
        <Button
          title="View My Applications"
          className="mt-4 mb-8"
          onPress={() => {
            setExamState("list");
            router.push("/scholarship/applications");
          }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

function ExamResultsCard({ userExamId }: { userExamId: string }) {
  const { data: results, isLoading } = useExamResults(userExamId);

  if (isLoading) return <SkeletonCard />;
  if (!results) return null;

  return (
    <Card className={results.passed ? "bg-green-50 dark:bg-green-900/20" : "bg-red-50 dark:bg-red-900/20"}>
      <Text
        className={`text-lg font-bold mb-2 ${
          results.passed
            ? "text-green-800 dark:text-green-300"
            : "text-red-800 dark:text-red-300"
        }`}
      >
        {results.passed ? "🎉 You Passed!" : "❌ Not Passed"}
      </Text>
      <View className="flex-row gap-6">
        <View>
          <Text className="text-xs text-gray-500">Score</Text>
          <Text className="text-3xl font-bold text-gray-900 dark:text-white">
            {results.percentage.toFixed(0)}%
          </Text>
        </View>
        <View>
          <Text className="text-xs text-gray-500">Correct</Text>
          <Text className="text-xl font-semibold text-gray-900 dark:text-white">
            {results.correctAnswers}/{results.totalQuestions}
          </Text>
        </View>
      </View>
    </Card>
  );
}
