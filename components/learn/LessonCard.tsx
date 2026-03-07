import { View, Text, TouchableOpacity } from "react-native";

interface LessonCardProps {
  title: string;
  type: "video" | "text" | "quiz";
  duration?: number;
  isCompleted: boolean;
  onPress: () => void;
}

const TYPE_ICONS: Record<string, string> = {
  video: "V",
  text: "T",
  quiz: "Q",
};

export function LessonCard({
  title,
  type,
  duration,
  isCompleted,
  onPress,
}: LessonCardProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center px-4 py-3 border-b border-gray-100 dark:border-gray-800"
    >
      <View
        className={`w-8 h-8 rounded-full items-center justify-center mr-3 ${
          isCompleted
            ? "bg-green-100 dark:bg-green-900/30"
            : "bg-gray-100 dark:bg-gray-800"
        }`}
      >
        <Text
          className={`text-xs font-bold ${
            isCompleted
              ? "text-green-600"
              : "text-gray-500 dark:text-gray-400"
          }`}
        >
          {isCompleted ? "✓" : TYPE_ICONS[type]}
        </Text>
      </View>
      <View className="flex-1">
        <Text
          className={`text-sm ${
            isCompleted
              ? "text-gray-500 line-through"
              : "text-gray-900 dark:text-white font-medium"
          }`}
        >
          {title}
        </Text>
        {duration ? (
          <Text className="text-xs text-gray-400 mt-0.5">
            {Math.floor(duration / 60)} min
          </Text>
        ) : null}
      </View>
    </TouchableOpacity>
  );
}
