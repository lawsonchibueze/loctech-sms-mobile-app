import { useEffect } from "react";
import { Slot, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { registerGlobals } from "@livekit/react-native";
import { queryClient, asyncPersister } from "@/lib/query-client";
import { useAuthStore } from "@/lib/auth-store";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import "../global.css";

// Register LiveKit WebRTC globals
registerGlobals();

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
      <ErrorBoundary>
        <SafeAreaProvider>
          <PersistQueryClientProvider
            client={queryClient}
            persistOptions={{ persister: asyncPersister, maxAge: 1000 * 60 * 60 * 24 }}
          >
            <StatusBar style="auto" />
            <AuthGate />
          </PersistQueryClientProvider>
        </SafeAreaProvider>
      </ErrorBoundary>
    </GestureHandlerRootView>
  );
}
