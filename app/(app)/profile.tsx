import { View, Text, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthStore } from "@/lib/auth-store";
import { useLogout } from "@/hooks/useAuth";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export default function ProfileScreen() {
  const user = useAuthStore((s) => s.user);
  const logout = useLogout();

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: () => logout.mutate(),
      },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900">
      <ScrollView className="flex-1 px-4 pt-4">
        <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Profile
        </Text>

        <Card className="mb-4 items-center">
          <View className="w-20 h-20 rounded-full bg-primary-100 dark:bg-primary-900 items-center justify-center mb-3">
            <Text className="text-2xl font-bold text-primary-600">
              {user?.firstName?.[0]}
              {user?.lastName?.[0]}
            </Text>
          </View>
          <Text className="text-lg font-semibold text-gray-900 dark:text-white">
            {user?.firstName} {user?.lastName}
          </Text>
          <Text className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {user?.email}
          </Text>
          <Badge
            label={user?.role?.toUpperCase() ?? ""}
            variant="info"
            size="md"
          />
        </Card>

        <Card className="mb-4">
          <View className="flex-row justify-between py-2 border-b border-gray-100 dark:border-gray-700">
            <Text className="text-sm text-gray-500">Role</Text>
            <Text className="text-sm font-medium text-gray-900 dark:text-white capitalize">
              {user?.role}
            </Text>
          </View>
          <View className="flex-row justify-between py-2 border-b border-gray-100 dark:border-gray-700">
            <Text className="text-sm text-gray-500">Email</Text>
            <Text className="text-sm font-medium text-gray-900 dark:text-white">
              {user?.email}
            </Text>
          </View>
          {user?.phone ? (
            <View className="flex-row justify-between py-2">
              <Text className="text-sm text-gray-500">Phone</Text>
              <Text className="text-sm font-medium text-gray-900 dark:text-white">
                {user.phone}
              </Text>
            </View>
          ) : null}
        </Card>

        <Button
          title="Sign Out"
          variant="outline"
          onPress={handleLogout}
          loading={logout.isPending}
          className="mb-8"
        />
      </ScrollView>
    </SafeAreaView>
  );
}
