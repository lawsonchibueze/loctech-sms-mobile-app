import { Component, type ReactNode } from "react";
import { View, Text } from "react-native";
import { Button } from "@/components/ui/Button";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <View className="flex-1 items-center justify-center p-6 bg-gray-50 dark:bg-gray-900">
          <Text className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Something went wrong
          </Text>
          <Text className="text-sm text-gray-500 text-center mb-4">
            {this.state.error?.message ?? "An unexpected error occurred"}
          </Text>
          <Button
            title="Try Again"
            variant="outline"
            onPress={() => this.setState({ hasError: false, error: undefined })}
          />
        </View>
      );
    }

    return this.props.children;
  }
}
