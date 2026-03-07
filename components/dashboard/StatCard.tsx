import { View, Text } from "react-native";
import { Card } from "@/components/ui/Card";

interface StatCardProps {
  label: string;
  value: string | number;
  trend?: { direction: "up" | "down" | "neutral"; value: string };
  color?: string;
}

export function StatCard({ label, value, trend, color = "text-primary-600" }: StatCardProps) {
  return (
    <Card className="flex-1">
      <Text className={`text-2xl font-bold ${color}`}>{value}</Text>
      <Text className="text-xs text-gray-500 dark:text-gray-400 mt-1">{label}</Text>
      {trend ? (
        <Text
          className={`text-xs mt-1 font-medium ${
            trend.direction === "up"
              ? "text-green-600"
              : trend.direction === "down"
              ? "text-red-600"
              : "text-gray-500"
          }`}
        >
          {trend.direction === "up" ? "+" : trend.direction === "down" ? "-" : ""}
          {trend.value}
        </Text>
      ) : null}
    </Card>
  );
}
