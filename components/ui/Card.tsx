import { View, type ViewProps } from "react-native";

interface CardProps extends ViewProps {
  variant?: "elevated" | "outlined" | "filled";
}

const variantStyles = {
  elevated: "bg-white dark:bg-gray-800 shadow-sm shadow-black/10 rounded-2xl",
  outlined: "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl",
  filled: "bg-gray-100 dark:bg-gray-800 rounded-2xl",
} as const;

export function Card({
  variant = "elevated",
  className = "",
  children,
  ...props
}: CardProps) {
  return (
    <View className={`p-4 ${variantStyles[variant]} ${className}`} {...props}>
      {children}
    </View>
  );
}
