import { View, Text } from "react-native";
import { Button } from "@/components/ui/Button";
import { useRouter } from "expo-router";

interface Props {
  message?: string;
}

/**
 * Shown when the user gets a 403 Forbidden from the API.
 * Provides a user-friendly message and a back button instead
 * of a raw error screen.
 */
export function PermissionDenied({ message }: Props) {
  const router = useRouter();

  return (
    <View className="flex-1 items-center justify-center p-6 bg-gray-50 dark:bg-gray-900">
      <Text className="text-5xl mb-4">🔒</Text>
      <Text className="text-xl font-bold text-gray-900 dark:text-white mb-2">
        Access Restricted
      </Text>
      <Text className="text-sm text-gray-500 text-center mb-6 max-w-xs">
        {message || "You do not have permission to access this feature. Contact your administrator if you believe this is an error."}
      </Text>
      <Button
        title="Go Back"
        variant="outline"
        onPress={() => router.canGoBack() ? router.back() : router.replace("/")}
      />
    </View>
  );
}
