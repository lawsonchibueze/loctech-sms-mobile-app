import { View, Text } from "react-native";

interface DayData {
  day: string;
  status: "present" | "late" | "absent" | "half_day" | "excused" | null;
}

const STATUS_COLORS: Record<string, string> = {
  present: "bg-green-500",
  late: "bg-amber-500",
  absent: "bg-red-500",
  half_day: "bg-blue-500",
  excused: "bg-gray-400",
};

interface AttendanceChartProps {
  data: DayData[];
  title?: string;
}

export function AttendanceChart({ data, title = "This Week" }: AttendanceChartProps) {
  return (
    <View>
      {title ? (
        <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          {title}
        </Text>
      ) : null}
      <View className="flex-row justify-between gap-1">
        {data.map((day, i) => (
          <View key={i} className="items-center flex-1">
            <View
              className={`w-full h-8 rounded-lg ${
                day.status ? STATUS_COLORS[day.status] : "bg-gray-200 dark:bg-gray-700"
              }`}
            />
            <Text className="text-xs text-gray-500 mt-1">{day.day}</Text>
          </View>
        ))}
      </View>
      <View className="flex-row flex-wrap gap-x-4 gap-y-1 mt-3">
        {Object.entries(STATUS_COLORS).map(([status, color]) => (
          <View key={status} className="flex-row items-center gap-1">
            <View className={`w-2.5 h-2.5 rounded-full ${color}`} />
            <Text className="text-xs text-gray-500 capitalize">{status.replace("_", " ")}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
