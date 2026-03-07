import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  type TouchableOpacityProps,
} from "react-native";

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

const variantStyles = {
  primary: "bg-primary-600 active:bg-primary-700",
  secondary: "bg-gray-600 active:bg-gray-700",
  outline: "border border-primary-600 bg-transparent",
  ghost: "bg-transparent",
} as const;

const variantTextStyles = {
  primary: "text-white",
  secondary: "text-white",
  outline: "text-primary-600",
  ghost: "text-primary-600",
} as const;

const sizeStyles = {
  sm: "px-3 py-2 rounded-lg",
  md: "px-4 py-3 rounded-xl",
  lg: "px-6 py-4 rounded-xl",
} as const;

const sizeTextStyles = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
} as const;

export function Button({
  title,
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  className = "",
  ...props
}: ButtonProps) {
  return (
    <TouchableOpacity
      className={`flex-row items-center justify-center ${variantStyles[variant]} ${sizeStyles[size]} ${
        disabled || loading ? "opacity-50" : ""
      } ${className}`}
      disabled={disabled || loading}
      activeOpacity={0.7}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === "primary" || variant === "secondary" ? "#fff" : "#2563EB"}
          size="small"
          className="mr-2"
        />
      ) : null}
      <Text
        className={`font-semibold ${variantTextStyles[variant]} ${sizeTextStyles[size]}`}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}
