import { Stack } from "expo-router";

export default function ScholarshipLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerBackTitle: "Back",
        headerTintColor: "#1E40AF",
        headerTitleStyle: { fontWeight: "600" },
      }}
    >
      <Stack.Screen name="index" options={{ title: "Scholarships" }} />
      <Stack.Screen name="[id]" options={{ title: "Scholarship Details" }} />
      <Stack.Screen name="applications" options={{ title: "My Applications" }} />
      <Stack.Screen name="status/[applicationId]" options={{ title: "Application Status" }} />
      <Stack.Screen name="exam" options={{ title: "Scholarship Exam", headerBackVisible: false }} />
    </Stack>
  );
}
