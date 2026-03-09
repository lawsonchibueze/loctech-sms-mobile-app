import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useApi } from "@/hooks/useAuth";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

function todayStr(): string {
  return new Date().toISOString().split("T")[0];
}

interface DailyReport {
  id: string;
  reportDate: string;
  classesDelivered: number;
  studentsPresent?: number;
  achievements?: string;
  challenges?: string;
  tomorrowPlan?: string;
  additionalNotes?: string;
  status: string;
  submittedAt?: string;
}

export default function DailyReportScreen() {
  const router = useRouter();
  const api = useApi();
  const queryClient = useQueryClient();

  const [classesDelivered, setClassesDelivered] = useState("0");
  const [studentsPresent, setStudentsPresent] = useState("0");
  const [achievements, setAchievements] = useState("");
  const [challenges, setChallenges] = useState("");
  const [tomorrowPlan, setTomorrowPlan] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");

  // Check if today's report exists
  const { data: reports, isLoading } = useQuery({
    queryKey: ["daily-reports", "my"],
    queryFn: async () => {
      const res = await api.get("/sms/instructor-reports/my", {
        params: { limit: 5 },
      });
      const data = res.data?.data ?? res.data;
      return Array.isArray(data)
        ? data
        : data?.data ?? data?.reports ?? data?.items ?? [];
    },
  });

  const todayReport = (reports as DailyReport[] | undefined)?.find(
    (r) => r.reportDate?.startsWith(todayStr())
  );

  const isSubmitted =
    todayReport?.status === "submitted" || todayReport?.status === "reviewed";

  // Pre-fill form when today's report loads
  useState(() => {
    if (todayReport) {
      setClassesDelivered(String(todayReport.classesDelivered || 0));
      setStudentsPresent(String(todayReport.studentsPresent || 0));
      setAchievements(todayReport.achievements || "");
      setChallenges(todayReport.challenges || "");
      setTomorrowPlan(todayReport.tomorrowPlan || "");
      setAdditionalNotes(todayReport.additionalNotes || "");
    }
  });

  const buildPayload = () => ({
    reportDate: todayStr(),
    classesDelivered: Number(classesDelivered) || 0,
    studentsPresent: Number(studentsPresent) || 0,
    achievements: achievements || undefined,
    challenges: challenges || undefined,
    tomorrowPlan: tomorrowPlan || undefined,
    additionalNotes: additionalNotes || undefined,
  });

  const saveDraft = useMutation({
    mutationFn: async () => {
      await api.post("/sms/instructor-reports/draft", buildPayload());
    },
    onSuccess: () => {
      Alert.alert("Saved", "Draft saved successfully.");
      queryClient.invalidateQueries({ queryKey: ["daily-reports"] });
    },
    onError: () => Alert.alert("Error", "Failed to save draft."),
  });

  const submit = useMutation({
    mutationFn: async () => {
      await api.post("/sms/instructor-reports", buildPayload());
    },
    onSuccess: () => {
      Alert.alert("Submitted", "Daily report submitted successfully!");
      queryClient.invalidateQueries({ queryKey: ["daily-reports"] });
    },
    onError: (err: unknown) => {
      const msg =
        (err as { response?: { data?: { error?: string } } })?.response?.data
          ?.error || "Failed to submit report.";
      Alert.alert("Error", msg);
    },
  });

  const currentHour = new Date().getHours();
  const showReminder = currentHour >= 16 && !isSubmitted;

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900">
      <ScrollView className="flex-1 px-4 pt-4">
        {/* Header */}
        <View className="flex-row items-center justify-between mb-4">
          <View>
            <Text className="text-xl font-bold text-gray-900 dark:text-white">
              Daily Report
            </Text>
            <Text className="text-sm text-gray-500">
              {new Date().toLocaleDateString("en-NG", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </Text>
          </View>
          <TouchableOpacity onPress={() => router.back()}>
            <Text className="text-primary-600 text-sm font-medium">Back</Text>
          </TouchableOpacity>
        </View>

        {/* Reminder */}
        {showReminder && (
          <Card className="mb-4 bg-amber-50 dark:bg-amber-900/20 border-amber-200">
            <Text className="text-sm font-medium text-amber-800 dark:text-amber-200">
              Reminder: Please submit your daily report before you leave.
            </Text>
            <Text className="text-xs text-amber-600 dark:text-amber-400 mt-1">
              Reports are due by 5:00 PM.
            </Text>
          </Card>
        )}

        {/* Already submitted */}
        {isSubmitted && (
          <Card className="mb-4 bg-green-50 dark:bg-green-900/20 border-green-200">
            <Text className="text-sm font-medium text-green-800 dark:text-green-200">
              Today&apos;s report has been submitted.
            </Text>
            {todayReport?.submittedAt && (
              <Text className="text-xs text-green-600 mt-1">
                Submitted at{" "}
                {new Date(todayReport.submittedAt).toLocaleTimeString()}
              </Text>
            )}
          </Card>
        )}

        {/* Form */}
        <Card className="mb-4">
          <Text className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
            Activities
          </Text>
          <View className="flex-row gap-3 mb-4">
            <View className="flex-1">
              <Text className="text-xs text-gray-500 mb-1">Tasks Done</Text>
              <TextInput
                className="border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-gray-900 dark:text-white bg-white dark:bg-gray-800"
                value={classesDelivered}
                onChangeText={setClassesDelivered}
                keyboardType="numeric"
                editable={!isSubmitted}
              />
            </View>
            <View className="flex-1">
              <Text className="text-xs text-gray-500 mb-1">
                People Attended
              </Text>
              <TextInput
                className="border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-gray-900 dark:text-white bg-white dark:bg-gray-800"
                value={studentsPresent}
                onChangeText={setStudentsPresent}
                keyboardType="numeric"
                editable={!isSubmitted}
              />
            </View>
          </View>

          <Text className="text-xs text-gray-500 mb-1">
            Achievements / Highlights
          </Text>
          <TextInput
            className="border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-gray-900 dark:text-white bg-white dark:bg-gray-800 mb-3"
            value={achievements}
            onChangeText={setAchievements}
            placeholder="What went well today?"
            placeholderTextColor="#9CA3AF"
            multiline
            numberOfLines={3}
            textAlignVertical="top"
            editable={!isSubmitted}
          />

          <Text className="text-xs text-gray-500 mb-1">
            Challenges / Issues
          </Text>
          <TextInput
            className="border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-gray-900 dark:text-white bg-white dark:bg-gray-800 mb-3"
            value={challenges}
            onChangeText={setChallenges}
            placeholder="Any difficulties?"
            placeholderTextColor="#9CA3AF"
            multiline
            numberOfLines={3}
            textAlignVertical="top"
            editable={!isSubmitted}
          />

          <Text className="text-xs text-gray-500 mb-1">Plan for Tomorrow</Text>
          <TextInput
            className="border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-gray-900 dark:text-white bg-white dark:bg-gray-800 mb-3"
            value={tomorrowPlan}
            onChangeText={setTomorrowPlan}
            placeholder="What do you plan to do tomorrow?"
            placeholderTextColor="#9CA3AF"
            multiline
            numberOfLines={2}
            textAlignVertical="top"
            editable={!isSubmitted}
          />

          <Text className="text-xs text-gray-500 mb-1">
            Additional Notes (optional)
          </Text>
          <TextInput
            className="border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-gray-900 dark:text-white bg-white dark:bg-gray-800"
            value={additionalNotes}
            onChangeText={setAdditionalNotes}
            placeholder="Any other notes"
            placeholderTextColor="#9CA3AF"
            multiline
            numberOfLines={2}
            textAlignVertical="top"
            editable={!isSubmitted}
          />
        </Card>

        {/* Actions */}
        {!isSubmitted && (
          <View className="flex-row gap-3 mb-8">
            <View className="flex-1">
              <Button
                title="Save Draft"
                variant="outline"
                onPress={() => saveDraft.mutate()}
                loading={saveDraft.isPending}
              />
            </View>
            <View className="flex-1">
              <Button
                title="Submit Report"
                onPress={() => submit.mutate()}
                loading={submit.isPending}
              />
            </View>
          </View>
        )}

        <View className="h-8" />
      </ScrollView>
    </SafeAreaView>
  );
}
