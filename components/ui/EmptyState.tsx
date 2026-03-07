import { View, Text } from "react-native";
import { Button } from "./Button";

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  title,
  description,
  icon,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <View className="flex-1 items-center justify-center px-8 py-16">
      {icon ? <View className="mb-4">{icon}</View> : null}
      <Text className="text-lg font-semibold text-gray-900 dark:text-white text-center mb-2">
        {title}
      </Text>
      {description ? (
        <Text className="text-sm text-gray-500 dark:text-gray-400 text-center mb-6">
          {description}
        </Text>
      ) : null}
      {actionLabel && onAction ? (
        <Button title={actionLabel} onPress={onAction} size="sm" />
      ) : null}
    </View>
  );
}
