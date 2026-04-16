import { View, Text, FlatList, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { useMyApplications, type ScholarshipApplication } from "@/hooks/useScholarship";

const STATUS_LABELS: Record<string, { label: string; variant: "default" | "info" | "success" | "error" | "warning" }> = {
  submitted: { label: "Submitted", variant: "default" },
  exam_pending: { label: "Exam Pending", variant: "warning" },
  exam_completed: { label: "Exam Done", variant: "info" },
  under_review: { label: "Under Review", variant: "info" },
  approved: { label: "Approved", variant: "success" },
  rejected: { label: "Rejected", variant: "error" },
  waitlisted: { label: "Waitlisted", variant: "warning" },
  enrolled: { label: "Enrolled", variant: "success" },
};

export default function ScholarshipApplicationsScreen() {
  const router = useRouter();
  const { data: applications, isLoading } = useMyApplications();

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900">
      <Text className="text-2xl font-bold text-gray-900 dark:text-white px-4 pt-4 mb-4">
        My Applications
      </Text>

      {isLoading ? (
        <View className="px-4">
          {[1, 2, 3].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </View>
      ) : !applications?.length ? (
        <EmptyState
          title="No applications"
          description="You haven't applied to any scholarships yet."
        />
      ) : (
        <FlatList
          data={applications}
          keyExtractor={(item) => item.id}
          contentContainerClassName="px-4 pb-8"
          renderItem={({ item }) => <ApplicationCard application={item} router={router} />}
        />
      )}
    </SafeAreaView>
  );
}

function ApplicationCard({
  application: app,
  router,
}: {
  application: ScholarshipApplication;
  router: any;
}) {
  const statusInfo = STATUS_LABELS[app.status] ?? {
    label: app.status,
    variant: "default" as const,
  };

  return (
    <Pressable onPress={() => router.push(`/scholarship/status/${app.id}`)}>
      <Card className="mb-3">
        <View className="flex-row items-start justify-between mb-2">
          <View className="flex-1 mr-2">
            <Text className="text-sm font-semibold text-gray-900 dark:text-white">
              {app.scholarshipName ?? "Scholarship"}
            </Text>
            <Text className="text-xs text-gray-500 mt-0.5">
              Applied: {new Date(app.createdAt).toLocaleDateString()}
            </Text>
          </View>
          <Badge label={statusInfo.label} variant={statusInfo.variant} />
        </View>

        {/* Progress timeline */}
        <View className="flex-row items-center gap-1 my-2">
          {["submitted", "exam_pending", "exam_completed", "under_review", "approved"].map(
            (step, idx) => {
              const stepOrder = [
                "submitted", "exam_pending", "exam_completed", "under_review",
                "approved", "enrolled",
              ];
              const currentIdx = stepOrder.indexOf(app.status);
              const stepIdx = stepOrder.indexOf(step);
              const isActive = stepIdx <= currentIdx;
              const isRejected = app.status === "rejected";

              return (
                <View key={step} className="flex-1 flex-row items-center">
                  <View
                    className={`w-3 h-3 rounded-full ${
                      isRejected && stepIdx > currentIdx
                        ? "bg-red-300"
                        : isActive
                        ? "bg-blue-600"
                        : "bg-gray-300 dark:bg-gray-600"
                    }`}
                  />
                  {idx < 4 && (
                    <View
                      className={`flex-1 h-0.5 ${
                        isActive ? "bg-blue-600" : "bg-gray-300 dark:bg-gray-600"
                      }`}
                    />
                  )}
                </View>
              );
            }
          )}
        </View>

        <View className="flex-row gap-4 mt-1">
          {app.examScore !== null && (
            <View>
              <Text className="text-xs text-gray-500">Exam Score</Text>
              <Text className="text-sm font-semibold text-gray-900 dark:text-white">
                {app.examPercentage?.toFixed(0)}%
              </Text>
            </View>
          )}
          {app.eligibilityScore > 0 && (
            <View>
              <Text className="text-xs text-gray-500">Eligibility</Text>
              <Text className="text-sm font-semibold text-gray-900 dark:text-white">
                {app.eligibilityScore}/100
              </Text>
            </View>
          )}
          {app.awardedCoveragePercent && (
            <View>
              <Text className="text-xs text-gray-500">Awarded</Text>
              <Text className="text-sm font-semibold text-green-600">
                {app.awardedCoveragePercent}% coverage
              </Text>
            </View>
          )}
        </View>

        {app.adminNote && (
          <View className="bg-gray-100 dark:bg-gray-800 rounded-lg p-2 mt-2">
            <Text className="text-xs text-gray-600 dark:text-gray-400">
              Note: {app.adminNote}
            </Text>
          </View>
        )}
      </Card>
    </Pressable>
  );
}
