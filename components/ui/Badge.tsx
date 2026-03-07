import { View, Text } from "react-native";

interface BadgeProps {
  label: string;
  variant?: "default" | "success" | "warning" | "error" | "info";
  size?: "sm" | "md";
}

const variantStyles = {
  default: "bg-gray-100 dark:bg-gray-700",
  success: "bg-green-100 dark:bg-green-900/30",
  warning: "bg-amber-100 dark:bg-amber-900/30",
  error: "bg-red-100 dark:bg-red-900/30",
  info: "bg-blue-100 dark:bg-blue-900/30",
} as const;

const variantTextStyles = {
  default: "text-gray-700 dark:text-gray-300",
  success: "text-green-700 dark:text-green-400",
  warning: "text-amber-700 dark:text-amber-400",
  error: "text-red-700 dark:text-red-400",
  info: "text-blue-700 dark:text-blue-400",
} as const;

export function Badge({ label, variant = "default", size = "sm" }: BadgeProps) {
  return (
    <View
      className={`${variantStyles[variant]} ${
        size === "sm" ? "px-2 py-0.5" : "px-3 py-1"
      } rounded-full self-start`}
    >
      <Text
        className={`${variantTextStyles[variant]} ${
          size === "sm" ? "text-xs" : "text-sm"
        } font-medium`}
      >
        {label}
      </Text>
    </View>
  );
}
