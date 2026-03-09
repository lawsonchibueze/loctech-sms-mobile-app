import { Tabs, useRouter } from "expo-router";
import { Text, View } from "react-native";
import { useRole } from "@/hooks/useRole";
import { useAuthStore } from "@/lib/auth-store";
import type { Role } from "@/lib/types";

type TabConfig = {
  name: string;
  title: string;
  icon: string;
};

const TAB_CONFIGS: Record<Role, TabConfig[]> = {
  student: [
    { name: "(student)", title: "Home", icon: "H" },
    { name: "courses", title: "Courses", icon: "C" },
    { name: "learn", title: "Learn", icon: "L" },
    { name: "chat", title: "Chat", icon: "M" },
    { name: "profile", title: "Profile", icon: "P" },
  ],
  parent: [
    { name: "(parent)", title: "Home", icon: "H" },
    { name: "children", title: "Children", icon: "C" },
    { name: "chat", title: "Chat", icon: "M" },
    { name: "notifications", title: "Alerts", icon: "A" },
    { name: "profile", title: "Profile", icon: "P" },
  ],
  instructor: [
    { name: "(instructor)", title: "Home", icon: "H" },
    { name: "classes", title: "Classes", icon: "C" },
    { name: "students-tab", title: "Students", icon: "S" },
    { name: "chat", title: "Chat", icon: "M" },
    { name: "profile", title: "Profile", icon: "P" },
  ],
  staff: [
    { name: "(staff)", title: "Home", icon: "H" },
    { name: "chat", title: "Chat", icon: "M" },
    { name: "profile", title: "Profile", icon: "P" },
  ],
  admin: [
    { name: "(admin)", title: "Home", icon: "H" },
    { name: "reports", title: "Reports", icon: "R" },
    { name: "staff-tab", title: "Staff", icon: "S" },
    { name: "settings", title: "Settings", icon: "G" },
    { name: "profile", title: "Profile", icon: "P" },
  ],
};

const ALL_ROLE_GROUPS = [
  "(student)",
  "(parent)",
  "(instructor)",
  "(staff)",
  "(admin)",
] as const;

function TabIcon({ label, focused }: { label: string; focused: boolean }) {
  return (
    <View
      className={`w-8 h-8 rounded-full items-center justify-center ${
        focused ? "bg-primary-600" : "bg-gray-200 dark:bg-gray-700"
      }`}
    >
      <Text
        className={`text-sm font-bold ${
          focused ? "text-white" : "text-gray-600 dark:text-gray-300"
        }`}
      >
        {label}
      </Text>
    </View>
  );
}

export default function AppLayout() {
  const role = useRole();
  const isLoading = useAuthStore((s) => s.isLoading);

  if (isLoading || !role) return null;

  const visibleTabs = TAB_CONFIGS[role];
  const visibleNames = new Set(visibleTabs.map((t) => t.name));

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#2563EB",
        tabBarInactiveTintColor: "#6B7280",
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: "#E5E7EB",
          paddingBottom: 4,
          paddingTop: 4,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
        },
      }}
    >
      {/* Render visible tabs for the current role */}
      {visibleTabs.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            tabBarIcon: ({ focused }) => (
              <TabIcon label={tab.icon} focused={focused} />
            ),
          }}
        />
      ))}

      {/* Hide role groups not belonging to this user */}
      {ALL_ROLE_GROUPS.filter((g) => !visibleNames.has(g)).map((group) => (
        <Tabs.Screen
          key={group}
          name={group}
          options={{ href: null }}
        />
      ))}

      {/* Hide tabs not used by this role */}
      {[
        "notifications",
        "profile",
        "settings",
        "chat",
        "courses",
        "learn",
        "children",
        "classes",
        "students-tab",
        "crm",
        "reports",
        "staff-tab",
      ]
        .filter((n) => !visibleNames.has(n))
        .map((name) => (
          <Tabs.Screen key={name} name={name} options={{ href: null }} />
        ))}
    </Tabs>
  );
}
