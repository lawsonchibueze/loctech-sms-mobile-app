import { useState } from "react";
import { View, Text, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useSubmitDailyReport } from "@/hooks/useInstructor";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function SubmitDailyReportScreen() {
  const router = useRouter();
  const submit = useSubmitDailyReport();
  const [summary, setSummary] = useState("");
  const [classesHeld, setClassesHeld] = useState("");
  const [studentsPresent, setStudentsPresent] = useState("");
  const [topics, setTopics] = useState("");
  const [challenges, setChallenges] = useState("");

  const handleSubmit = () => {
    if (!summary.trim() || !classesHeld || !studentsPresent || !topics.trim()) {
      Alert.alert("Error", "Please fill in all required fields.");
      return;
    }

    submit.mutate(
      {
        summary: summary.trim(),
        classesHeld: parseInt(classesHeld, 10),
        studentsPresent: parseInt(studentsPresent, 10),
        topics: topics.trim(),
        challenges: challenges.trim() || undefined,
      },
      {
        onSuccess: () => {
          Alert.alert("Submitted", "Your daily report has been submitted.", [
            { text: "OK", onPress: () => router.back() },
          ]);
        },
        onError: (error) => {
          Alert.alert("Error", error.message);
        },
      }
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900">
      <ScrollView className="flex-1 px-4 pt-4">
        <Button title="Back" variant="ghost" size="sm" onPress={() => router.back()} className="self-start mb-2" />
        <Text className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Submit Daily Report
        </Text>

        <Input label="Summary *" placeholder="Brief summary of today..." value={summary} onChangeText={setSummary} multiline numberOfLines={3} />
        <Input label="Classes Held *" placeholder="e.g. 3" value={classesHeld} onChangeText={setClassesHeld} keyboardType="number-pad" />
        <Input label="Students Present *" placeholder="e.g. 25" value={studentsPresent} onChangeText={setStudentsPresent} keyboardType="number-pad" />
        <Input label="Topics Covered *" placeholder="List topics covered today..." value={topics} onChangeText={setTopics} multiline numberOfLines={3} />
        <Input label="Challenges (optional)" placeholder="Any challenges faced..." value={challenges} onChangeText={setChallenges} multiline numberOfLines={2} />

        <Button title="Submit Report" onPress={handleSubmit} loading={submit.isPending} size="lg" className="mb-8" />
      </ScrollView>
    </SafeAreaView>
  );
}
