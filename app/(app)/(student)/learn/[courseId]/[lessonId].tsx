import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { VideoPlayer } from "@/components/learn/VideoPlayer";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";

interface LessonDetail {
  id: string;
  title: string;
  type: "video" | "text" | "quiz";
  content?: string;
  videoUrl?: string;
  chapters?: { title: string; timestamp: number }[];
  isCompleted: boolean;
  nextLessonId?: string;
}

export default function LessonScreen() {
  const { courseId, lessonId } = useLocalSearchParams<{
    courseId: string;
    lessonId: string;
  }>();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: lesson, isLoading } = useQuery({
    queryKey: ["lesson", courseId, lessonId],
    queryFn: () =>
      api.get<LessonDetail>(
        `/sms/learning/courses/${courseId}/lessons/${lessonId}`
      ),
    enabled: !!courseId && !!lessonId,
  });

  const markComplete = useMutation({
    mutationFn: () =>
      api.post(`/sms/learning/courses/${courseId}/lessons/${lessonId}/complete`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lesson", courseId, lessonId] });
      queryClient.invalidateQueries({ queryKey: ["student", "course", courseId] });
      queryClient.invalidateQueries({ queryKey: ["student", "courses"] });
    },
  });

  const handleProgress = (positionMillis: number, durationMillis: number) => {
    // Auto-complete when 90% watched
    if (
      !lesson?.isCompleted &&
      durationMillis > 0 &&
      positionMillis / durationMillis > 0.9
    ) {
      markComplete.mutate();
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900">
        <Skeleton width="100%" height={220} borderRadius={0} />
        <View className="px-4 pt-4">
          <Skeleton width="70%" height={20} className="mb-3" />
          <Skeleton width="100%" height={14} className="mb-2" />
          <Skeleton width="80%" height={14} />
        </View>
      </SafeAreaView>
    );
  }

  if (!lesson) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900 items-center justify-center">
        <Text className="text-gray-500">Lesson not found</Text>
        <Button title="Go Back" variant="ghost" onPress={() => router.back()} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900" edges={["bottom"]}>
      <ScrollView className="flex-1">
        {/* Video player */}
        {lesson.type === "video" && lesson.videoUrl ? (
          <VideoPlayer
            uri={lesson.videoUrl}
            chapters={lesson.chapters}
            onProgress={handleProgress}
          />
        ) : null}

        <View className="px-4 pt-4">
          <Button
            title="Back"
            variant="ghost"
            size="sm"
            onPress={() => router.back()}
            className="self-start mb-2"
          />

          <Text className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            {lesson.title}
          </Text>

          {/* Text content */}
          {lesson.content ? (
            <Text className="text-sm text-gray-700 dark:text-gray-300 leading-6 mb-4">
              {lesson.content}
            </Text>
          ) : null}

          {/* Completion status */}
          <View className="flex-row items-center gap-3 mb-4">
            {lesson.isCompleted ? (
              <View className="flex-row items-center gap-1">
                <Text className="text-green-600 font-medium text-sm">
                  Completed
                </Text>
              </View>
            ) : (
              <Button
                title="Mark as Complete"
                variant="outline"
                size="sm"
                onPress={() => markComplete.mutate()}
                loading={markComplete.isPending}
              />
            )}
          </View>

          {/* Next lesson */}
          {lesson.nextLessonId ? (
            <Button
              title="Next Lesson"
              onPress={() =>
                router.replace(
                  `/(app)/(student)/learn/${courseId}/${lesson.nextLessonId}`
                )
              }
              size="lg"
              className="mb-8"
            />
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
