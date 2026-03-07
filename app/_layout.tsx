import { useEffect } from "react";
import { Slot, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { QueryClientProvider } from "@tanstack/react-query";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { queryClient } from "@/lib/query-client";
import { useAuthStore } from "@/lib/auth-store";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import "../global.css";

const ROLE_HOME_ROUTES = {
  student: "/(app)/(student)",
  parent: "/(app)/(parent)",
  instructor: "/(app)/(instructor)",
  staff: "/(app)/(staff)",
  admin: "/(app)/(admin)",
} as const;

function AuthGate() {
  const { isAuthenticated, isLoading, user } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (!isAuthenticated && !inAuthGroup) {
      router.replace("/(auth)/login");
    } else if (isAuthenticated && inAuthGroup && user?.role) {
      const route = ROLE_HOME_ROUTES[user.role] ?? "/(app)/(student)";
      router.replace(route as never);
    }
  }, [isAuthenticated, isLoading, segments, user?.role]);

  return <Slot />;
}

export default function RootLayout() {
  const loadUser = useAuthStore((s) => s.loadUser);

  useEffect(() => {
    loadUser();
  }, []);

  usePushNotifications();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <StatusBar style="auto" />
          <AuthGate />
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
