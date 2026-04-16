import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { useApplicationStatus } from "@/hooks/useScholarship";

const STATUS_STEPS = [
  { key: "submitted", label: "Submitted", description: "Application received" },
  { key: "exam_pending", label: "Exam Assigned", description: "Take your scholarship exam" },
  { key: "exam_completed", label: "Exam Completed", description: "Your score is being evaluated" },
  { key: "under_review", label: "Under Review", description: "Admin is reviewing your application" },
  { key: "approved", label: "Approved", description: "Congratulations! Scholarship awarded" },
  { key: "enrolled", label: "Enrolled", description: "You have been enrolled in the course" },
];

export default function ApplicationStatusScreen() {
  const { applicationId } = useLocalSearchParams<{ applicationId: string }>();
  const router = useRouter();
  const { data: application, isLoading } = useApplicationStatus(applicationId!);

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900 px-4 pt-4">
        <SkeletonCard />
        <SkeletonCard />
      </SafeAreaView>
    );
  }

  if (!application) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900 items-center justify-center">
        <Text className="text-gray-500">Application not found</Text>
      </SafeAreaView>
    );
  }

  const statusOrder = STATUS_STEPS.map((s) => s.key);
  const currentIdx = statusOrder.indexOf(application.status);
  const isRejected = application.status === "rejected";
  const isWaitlisted = application.status === "waitlisted";

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900">
      <ScrollView className="flex-1 px-4 pt-4">
        <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Application Status
        </Text>

        {/* Summary Card */}
        <Card className="mb-4">
          <Text className="text-base font-semibold text-gray-900 dark:text-white">
            {application.scholarshipName ?? "Scholarship Application"}
          </Text>
          <Text className="text-xs text-gray-500 mt-1">
            Applied: {new Date(application.createdAt).toLocaleDateString()}
          </Text>

          <View className="flex-row gap-4 mt-3">
            <View>
              <Text className="text-xs text-gray-500">Name</Text>
              <Text className="text-sm text-gray-900 dark:text-white">{application.applicantName}</Text>
            </View>
            <View>
              <Text className="text-xs text-gray-500">Course</Text>
              <Text className="text-sm text-gray-900 dark:text-white">
                {application.courseOfInterest || "N/A"}
              </Text>
            </View>
          </View>
        </Card>

        {/* Status Timeline */}
        <Card className="mb-4">
          <Text className="text-base font-semibold text-gray-900 dark:text-white mb-4">
            Progress
          </Text>

          {isRejected && (
            <View className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3 mb-4">
              <Text className="text-sm font-medium text-red-800 dark:text-red-300">
                Application Rejected
              </Text>
              {application.adminNote && (
                <Text className="text-xs text-red-600 dark:text-red-400 mt-1">
                  {application.adminNote}
                </Text>
              )}
            </View>
          )}

          {isWaitlisted && (
            <View className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-3 mb-4">
              <Text className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
                You are on the waitlist. We will notify you if a spot becomes available.
              </Text>
            </View>
          )}

          {STATUS_STEPS.map((step, idx) => {
            const isCompleted = idx <= currentIdx && !isRejected;
            const isCurrent = idx === currentIdx && !isRejected;

            return (
              <View key={step.key} className="flex-row mb-4">
                <View className="items-center mr-3">
                  <View
                    className={`w-6 h-6 rounded-full items-center justify-center ${
                      isCompleted
                        ? "bg-blue-600"
                        : "bg-gray-200 dark:bg-gray-700"
                    }`}
                  >
                    {isCompleted && (
                      <Text className="text-white text-xs font-bold">✓</Text>
                    )}
                  </View>
                  {idx < STATUS_STEPS.length - 1 && (
                    <View
                      className={`w-0.5 h-8 mt-1 ${
                        isCompleted
                          ? "bg-blue-600"
                          : "bg-gray-200 dark:bg-gray-700"
                      }`}
                    />
                  )}
                </View>
                <View className="flex-1 pb-2">
                  <Text
                    className={`text-sm font-medium ${
                      isCurrent
                        ? "text-blue-600"
                        : isCompleted
                        ? "text-gray-900 dark:text-white"
                        : "text-gray-400 dark:text-gray-600"
                    }`}
                  >
                    {step.label}
                  </Text>
                  <Text className="text-xs text-gray-500">{step.description}</Text>
                </View>
              </View>
            );
          })}
        </Card>

        {/* Score Card */}
        {application.examScore !== null && (
          <Card className="mb-4">
            <Text className="text-base font-semibold text-gray-900 dark:text-white mb-2">
              Exam Results
            </Text>
            <View className="flex-row gap-6">
              <View>
                <Text className="text-xs text-gray-500">Score</Text>
                <Text className="text-2xl font-bold text-blue-600">
                  {application.examPercentage?.toFixed(0)}%
                </Text>
              </View>
              <View>
                <Text className="text-xs text-gray-500">Eligibility Score</Text>
                <Text className="text-2xl font-bold text-gray-900 dark:text-white">
                  {application.eligibilityScore}/100
                </Text>
              </View>
            </View>
          </Card>
        )}

        {/* Award */}
        {application.awardedCoveragePercent && (
          <Card className="mb-4 bg-green-50 dark:bg-green-900/20">
            <Text className="text-base font-semibold text-green-800 dark:text-green-300 mb-1">
              🎉 Scholarship Awarded!
            </Text>
            <Text className="text-sm text-green-700 dark:text-green-400">
              You have been awarded {application.awardedCoveragePercent}% tuition coverage.
            </Text>
          </Card>
        )}

        {/* Exam CTA */}
        {application.status === "exam_pending" && (
          <Button
            title="Take Scholarship Exam"
            className="mb-8"
            onPress={() => router.push("/scholarship/exam")}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
