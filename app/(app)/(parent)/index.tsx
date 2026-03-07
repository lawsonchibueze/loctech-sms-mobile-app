import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useAuthStore } from "@/lib/auth-store";
import { useChildren } from "@/hooks/useParent";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { SkeletonCard } from "@/components/ui/Skeleton";

export default function ParentDashboard() {
  const user = useAuthStore((s) => s.user);
  const router = useRouter();
  const { data: children, isLoading } = useChildren();

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900">
      <ScrollView className="flex-1 px-4 pt-4">
        <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
          Parent Dashboard
        </Text>
        <Text className="text-base text-gray-500 dark:text-gray-400 mb-6">
          {user?.firstName} {user?.lastName}
        </Text>

        <Text className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          My Children
        </Text>

        {isLoading ? (
          [1, 2].map((i) => <SkeletonCard key={i} />)
        ) : !children?.length ? (
          <EmptyState
            title="No children linked"
            description="Your children's profiles will appear here once linked by the school."
          />
        ) : (
          children.map((child) => (
            <TouchableOpacity
              key={child.id}
              onPress={() =>
                router.push(`/(app)/(parent)/children/${child.id}`)
              }
            >
              <Card className="mb-3">
                <View className="flex-row items-center gap-3">
                  <View className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900 items-center justify-center">
                    <Text className="text-lg font-bold text-primary-600">
                      {child.name.charAt(0)}
                    </Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-base font-semibold text-gray-900 dark:text-white">
                      {child.name}
                    </Text>
                    <Text className="text-xs text-gray-500">
                      {child.courses} courses | {child.attendanceRate}% attendance
                    </Text>
                  </View>
                </View>
              </Card>
            </TouchableOpacity>
          ))
        )}

        <Card className="mb-4 mt-4">
          <Text className="text-base font-semibold text-gray-900 dark:text-white mb-2">
            Payment Summary
          </Text>
          <Text className="text-sm text-gray-500">No outstanding payments</Text>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}
