import { View, Text, Switch, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { Card } from "@/components/ui/Card";

interface SettingRow {
  label: string;
  description?: string;
  key: string;
}

const notificationSettings: SettingRow[] = [
  { label: "Attendance Alerts", description: "Check-in/out reminders", key: "attendance" },
  { label: "Class Reminders", description: "Upcoming class notifications", key: "classes" },
  { label: "Payment Reminders", description: "Invoice and due date alerts", key: "payments" },
  { label: "Grade Updates", description: "New grades and results", key: "grades" },
  { label: "Chat Messages", description: "New message notifications", key: "chat" },
  { label: "Report Reminders", description: "Daily report submission reminders", key: "reports" },
  { label: "Certificate Alerts", description: "New certificate issued", key: "certificates" },
];

export default function SettingsScreen() {
  const [prefs, setPrefs] = useState<Record<string, boolean>>(
    Object.fromEntries(notificationSettings.map((s) => [s.key, true]))
  );

  const toggle = (key: string) => {
    setPrefs((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900">
      <ScrollView className="flex-1 px-4 pt-4" contentContainerClassName="pb-8">
        <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Settings</Text>

        <Text className="text-sm font-semibold text-gray-500 uppercase mb-2">Notification Preferences</Text>
        <Card className="mb-6">
          {notificationSettings.map((setting, index) => (
            <View
              key={setting.key}
              className={`flex-row items-center justify-between py-3 ${index < notificationSettings.length - 1 ? "border-b border-gray-100 dark:border-gray-700" : ""}`}
            >
              <View className="flex-1 mr-3">
                <Text className="text-sm font-medium text-gray-900 dark:text-white">{setting.label}</Text>
                {setting.description ? (
                  <Text className="text-xs text-gray-500">{setting.description}</Text>
                ) : null}
              </View>
              <Switch
                value={prefs[setting.key]}
                onValueChange={() => toggle(setting.key)}
                trackColor={{ false: "#d1d5db", true: "#3b82f6" }}
                thumbColor="#ffffff"
              />
            </View>
          ))}
        </Card>

        <Text className="text-sm font-semibold text-gray-500 uppercase mb-2">App</Text>
        <Card>
          <View className="flex-row items-center justify-between py-3">
            <Text className="text-sm text-gray-900 dark:text-white">Version</Text>
            <Text className="text-sm text-gray-500">1.0.0</Text>
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}
