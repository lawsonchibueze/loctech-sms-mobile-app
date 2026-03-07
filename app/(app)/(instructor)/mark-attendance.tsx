import { useState } from "react";
import { View, Text, FlatList, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { SkeletonCard } from "@/components/ui/Skeleton";

interface Student {
  id: string;
  name: string;
  enrollmentId: string;
}

interface MarkPayload {
  classId: string;
  records: { studentId: string; status: "present" | "absent" | "late" }[];
}

export default function MarkAttendanceScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [attendance, setAttendance] = useState<
    Record<string, "present" | "absent" | "late">
  >({});

  // Fetch today's classes
  const { data: classes, isLoading: classesLoading } = useQuery({
    queryKey: ["instructor", "today-classes"],
    queryFn: () =>
      api.get<{ id: string; name: string; time: string }[]>(
        "/sms/scheduling/my-classes/today"
      ),
  });

  // Fetch students for selected class
  const { data: students, isLoading: studentsLoading } = useQuery({
    queryKey: ["class-students", selectedClass],
    queryFn: () =>
      api.get<Student[]>(`/sms/scheduling/classes/${selectedClass}/students`),
    enabled: !!selectedClass,
  });

  const markMutation = useMutation({
    mutationFn: (payload: MarkPayload) =>
      api.post("/sms/attendance/mark-batch", payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendance"] });
      Alert.alert("Success", "Attendance marked successfully!", [
        { text: "OK", onPress: () => router.back() },
      ]);
    },
    onError: (error) => {
      Alert.alert("Error", error.message);
    },
  });

  const toggleStatus = (studentId: string) => {
    setAttendance((prev) => {
      const current = prev[studentId] ?? "present";
      const next =
        current === "present" ? "late" : current === "late" ? "absent" : "present";
      return { ...prev, [studentId]: next };
    });
  };

  const handleSubmit = () => {
    if (!selectedClass || !students?.length) return;

    const records = students.map((s) => ({
      studentId: s.id,
      status: attendance[s.id] ?? ("present" as const),
    }));

    markMutation.mutate({ classId: selectedClass, records });
  };

  // Class selection view
  if (!selectedClass) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900">
        <View className="flex-row items-center px-4 pt-4 mb-4">
          <Button title="Back" variant="ghost" size="sm" onPress={() => router.back()} />
          <Text className="text-xl font-bold text-gray-900 dark:text-white ml-2">
            Mark Attendance
          </Text>
        </View>

        <Text className="text-sm text-gray-500 px-4 mb-4">
          Select a class to mark attendance
        </Text>

        {classesLoading ? (
          <View className="px-4">
            {[1, 2, 3].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </View>
        ) : !classes?.length ? (
          <EmptyState
            title="No classes today"
            description="You don't have any classes scheduled for today."
          />
        ) : (
          <FlatList
            data={classes}
            keyExtractor={(item) => item.id}
            contentContainerClassName="px-4"
            renderItem={({ item }) => (
              <Card className="mb-3">
                <Button
                  title={`${item.name} - ${item.time}`}
                  variant="ghost"
                  onPress={() => setSelectedClass(item.id)}
                />
              </Card>
            )}
          />
        )}
      </SafeAreaView>
    );
  }

  // Student attendance marking view
  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900">
      <View className="flex-row items-center px-4 pt-4 mb-4">
        <Button
          title="Back"
          variant="ghost"
          size="sm"
          onPress={() => setSelectedClass(null)}
        />
        <Text className="text-xl font-bold text-gray-900 dark:text-white ml-2">
          Mark Attendance
        </Text>
      </View>

      <Text className="text-sm text-gray-500 px-4 mb-2">
        Tap a student to cycle: Present → Late → Absent
      </Text>

      {studentsLoading ? (
        <View className="px-4">
          {[1, 2, 3, 4].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </View>
      ) : (
        <FlatList
          data={students}
          keyExtractor={(item) => item.id}
          contentContainerClassName="px-4 pb-24"
          renderItem={({ item }) => {
            const status = attendance[item.id] ?? "present";
            const variant =
              status === "present"
                ? "success"
                : status === "late"
                ? "warning"
                : "error";

            return (
              <Card className="mb-2" onTouchEnd={() => toggleStatus(item.id)}>
                <View className="flex-row items-center justify-between">
                  <Text className="text-sm font-medium text-gray-900 dark:text-white">
                    {item.name}
                  </Text>
                  <Badge
                    label={status.charAt(0).toUpperCase() + status.slice(1)}
                    variant={variant}
                    size="md"
                  />
                </View>
              </Card>
            );
          }}
        />
      )}

      {/* Submit button */}
      <View className="absolute bottom-0 left-0 right-0 px-4 pb-8 pt-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
        <Button
          title="Submit Attendance"
          onPress={handleSubmit}
          loading={markMutation.isPending}
          size="lg"
        />
      </View>
    </SafeAreaView>
  );
}
