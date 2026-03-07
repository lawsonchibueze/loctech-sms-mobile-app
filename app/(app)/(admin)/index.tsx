import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useAuthStore } from "@/lib/auth-store";
import { useBranches } from "@/hooks/useAdmin";
import { Card } from "@/components/ui/Card";
import { StatCard } from "@/components/dashboard/StatCard";

export default function AdminDashboard() {
  const user = useAuthStore((s) => s.user);
  const router = useRouter();
  const { data: branches } = useBranches();

  const totalStaff = branches?.reduce((sum, b) => sum + b.staffCount, 0) ?? 0;
  const totalStudents = branches?.reduce((sum, b) => sum + b.studentCount, 0) ?? 0;

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900">
      <ScrollView className="flex-1 px-4 pt-4">
        <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Admin Dashboard</Text>
        <Text className="text-base text-gray-500 dark:text-gray-400 mb-6">{user?.firstName} {user?.lastName}</Text>

        <View className="flex-row gap-3 mb-4">
          <StatCard label="Branches" value={branches?.length ?? 0} color="text-primary-600" />
          <StatCard label="Staff" value={totalStaff} color="text-green-600" />
          <StatCard label="Students" value={totalStudents} color="text-amber-600" />
        </View>

        <Text className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Branches</Text>
        {branches?.map((branch) => (
          <TouchableOpacity key={branch.id} onPress={() => router.push(`/(app)/(admin)/branches/${branch.id}`)}>
            <Card className="mb-3">
              <Text className="text-sm font-semibold text-gray-900 dark:text-white">{branch.name}</Text>
              <Text className="text-xs text-gray-500">{branch.location}</Text>
              <View className="flex-row gap-4 mt-2">
                <Text className="text-xs text-gray-500">{branch.staffCount} staff</Text>
                <Text className="text-xs text-gray-500">{branch.studentCount} students</Text>
              </View>
            </Card>
          </TouchableOpacity>
        ))}

        <Text className="text-sm font-semibold text-gray-700 dark:text-gray-300 mt-4 mb-3">Quick Actions</Text>
        <View className="gap-3 mb-8">
          <TouchableOpacity onPress={() => router.push("/(app)/(admin)/instructor-reports")}>
            <Card><Text className="text-sm font-medium text-gray-900 dark:text-white">Instructor Reports</Text></Card>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("/(app)/(admin)/staff-management")}>
            <Card><Text className="text-sm font-medium text-gray-900 dark:text-white">Staff Management</Text></Card>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("/(app)/(admin)/reports/financial")}>
            <Card><Text className="text-sm font-medium text-gray-900 dark:text-white">Financial Reports</Text></Card>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
