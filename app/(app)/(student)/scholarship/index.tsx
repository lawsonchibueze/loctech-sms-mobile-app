import { View, Text, FlatList, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { useScholarships, useMyApplications } from "@/hooks/useScholarship";

export default function ScholarshipListScreen() {
  const router = useRouter();
  const { data: scholarships, isLoading } = useScholarships();
  const { data: applications } = useMyApplications();

  const appliedIds = new Set(
    (applications ?? []).map((a) => a.scholarshipId)
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900">
      <View className="px-4 pt-4 pb-2 flex-row items-center justify-between">
        <Text className="text-2xl font-bold text-gray-900 dark:text-white">
          Scholarships
        </Text>
        <Button
          title="My Applications"
          variant="outline"
          size="sm"
          onPress={() => router.push("/scholarship/applications")}
        />
      </View>

      {isLoading ? (
        <View className="px-4">
          {[1, 2, 3].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </View>
      ) : !scholarships?.length ? (
        <EmptyState
          title="No scholarships available"
          description="Check back later for new scholarship opportunities."
        />
      ) : (
        <FlatList
          data={scholarships}
          keyExtractor={(item) => item.id}
          contentContainerClassName="px-4 pb-8"
          renderItem={({ item }) => {
            const isOpen = item.status === "open";
            const hasApplied = appliedIds.has(item.id);
            const deadlinePassed =
              item.applicationDeadline &&
              new Date(item.applicationDeadline) < new Date();

            return (
              <Pressable onPress={() => router.push(`/scholarship/${item.id}`)}>
                <Card className="mb-3">
                  <View className="flex-row items-start justify-between mb-2">
                    <View className="flex-1 mr-2">
                      <Text className="text-base font-semibold text-gray-900 dark:text-white">
                        {item.name}
                      </Text>
                      <Text className="text-xs text-gray-500 mt-0.5">
                        {item.academicYear}
                      </Text>
                    </View>
                    <View className="flex-row gap-1">
                      <Badge
                        label={item.type.replace("_", " ")}
                        variant="default"
                      />
                      {item.coveragePercent >= 100 && (
                        <Badge label="Full" variant="success" />
                      )}
                    </View>
                  </View>

                  {item.description && (
                    <Text
                      className="text-sm text-gray-600 dark:text-gray-400 mb-2"
                      numberOfLines={2}
                    >
                      {item.description}
                    </Text>
                  )}

                  <View className="flex-row items-center gap-3 mb-2">
                    <View>
                      <Text className="text-xs text-gray-500">Coverage</Text>
                      <Text className="text-sm font-semibold text-blue-600">
                        {item.coveragePercent}%
                      </Text>
                    </View>
                    {item.eligibilityRules?.minExamScore && (
                      <View>
                        <Text className="text-xs text-gray-500">Min Score</Text>
                        <Text className="text-sm font-semibold text-gray-900 dark:text-white">
                          {item.eligibilityRules.minExamScore}%
                        </Text>
                      </View>
                    )}
                    {item.applicationDeadline && (
                      <View>
                        <Text className="text-xs text-gray-500">Deadline</Text>
                        <Text className="text-sm font-semibold text-gray-900 dark:text-white">
                          {new Date(item.applicationDeadline).toLocaleDateString()}
                        </Text>
                      </View>
                    )}
                  </View>

                  {hasApplied ? (
                    <Badge label="Applied" variant="info" />
                  ) : isOpen && !deadlinePassed ? (
                    <Button
                      title="Apply Now"
                      size="sm"
                      className="self-start"
                      onPress={() => router.push(`/scholarship/${item.id}`)}
                    />
                  ) : (
                    <Badge
                      label={deadlinePassed ? "Deadline Passed" : "Closed"}
                      variant="error"
                    />
                  )}
                </Card>
              </Pressable>
            );
          }}
        />
      )}
    </SafeAreaView>
  );
}
