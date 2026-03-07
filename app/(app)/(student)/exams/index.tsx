import { View, Text, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { SkeletonCard } from "@/components/ui/Skeleton";

interface Exam {
  id: string;
  title: string;
  courseTitle: string;
  duration: number;
  totalQuestions: number;
  status: "upcoming" | "available" | "completed" | "missed";
  scheduledAt: string;
  score?: number;
}

export default function ExamsScreen() {
  const router = useRouter();
  const { data: exams, isLoading } = useQuery({
    queryKey: ["student", "exams"],
    queryFn: () => api.get<Exam[]>("/sms/assessments/my-exams"),
  });

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900">
      <Text className="text-2xl font-bold text-gray-900 dark:text-white px-4 pt-4 mb-4">
        Exams
      </Text>

      {isLoading ? (
        <View className="px-4">{[1, 2, 3].map((i) => <SkeletonCard key={i} />)}</View>
      ) : !exams?.length ? (
        <EmptyState title="No exams" description="Your upcoming and past exams will appear here." />
      ) : (
        <FlatList
          data={exams}
          keyExtractor={(item) => item.id}
          contentContainerClassName="px-4 pb-8"
          renderItem={({ item }) => (
            <Card className="mb-3">
              <View className="flex-row items-start justify-between mb-1">
                <View className="flex-1 mr-2">
                  <Text className="text-sm font-semibold text-gray-900 dark:text-white">{item.title}</Text>
                  <Text className="text-xs text-gray-500">{item.courseTitle}</Text>
                </View>
                <Badge
                  label={item.status}
                  variant={
                    item.status === "completed" ? "success" :
                    item.status === "available" ? "info" :
                    item.status === "missed" ? "error" : "default"
                  }
                />
              </View>
              <Text className="text-xs text-gray-500 mt-1">
                {item.totalQuestions} questions | {item.duration} min
              </Text>
              <Text className="text-xs text-gray-500">
                {new Date(item.scheduledAt).toLocaleDateString()}
              </Text>
              {item.status === "completed" && item.score != null ? (
                <Text className="text-sm font-bold text-primary-600 mt-1">Score: {item.score}%</Text>
              ) : null}
              {item.status === "available" ? (
                <Button
                  title="Take Exam"
                  size="sm"
                  className="mt-2 self-start"
                  onPress={() => router.push(`/(app)/(student)/exams/${item.id}/take`)}
                />
              ) : item.status === "completed" ? (
                <Button
                  title="View Result"
                  variant="outline"
                  size="sm"
                  className="mt-2 self-start"
                  onPress={() => router.push(`/(app)/(student)/exams/${item.id}/result`)}
                />
              ) : null}
            </Card>
          )}
        />
      )}
    </SafeAreaView>
  );
}
