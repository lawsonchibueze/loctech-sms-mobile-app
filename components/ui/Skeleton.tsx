import { useEffect } from "react";
import { View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  className?: string;
}

export function Skeleton({
  width = "100%",
  height = 20,
  borderRadius = 8,
  className = "",
}: SkeletonProps) {
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(withTiming(0.7, { duration: 800 }), -1, true);
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        {
          width: width as number,
          height,
          borderRadius,
          backgroundColor: "#D1D5DB",
        },
        animatedStyle,
      ]}
      className={className}
    />
  );
}

export function SkeletonCard() {
  return (
    <View className="bg-white dark:bg-gray-800 rounded-2xl p-4 mb-3">
      <Skeleton width="60%" height={16} className="mb-3" />
      <Skeleton width="100%" height={12} className="mb-2" />
      <Skeleton width="80%" height={12} />
    </View>
  );
}
