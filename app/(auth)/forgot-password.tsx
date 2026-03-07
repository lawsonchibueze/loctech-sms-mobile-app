import { useState } from "react";
import { View, Text, Alert, KeyboardAvoidingView, Platform } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useForgotPassword } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const router = useRouter();
  const forgotPassword = useForgotPassword();

  const handleSubmit = () => {
    if (!email.trim()) {
      Alert.alert("Error", "Please enter your email address");
      return;
    }

    forgotPassword.mutate(email.trim().toLowerCase(), {
      onSuccess: () => {
        Alert.alert(
          "Check Your Email",
          "If an account exists with that email, you will receive password reset instructions.",
          [{ text: "OK", onPress: () => router.back() }]
        );
      },
      onError: () => {
        Alert.alert(
          "Check Your Email",
          "If an account exists with that email, you will receive password reset instructions.",
          [{ text: "OK", onPress: () => router.back() }]
        );
      },
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 justify-center px-6"
      >
        <View className="mb-8">
          <Text className="text-2xl font-bold text-gray-900 dark:text-white">
            Reset Password
          </Text>
          <Text className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Enter your email address and we'll send you instructions to reset
            your password.
          </Text>
        </View>

        <Input
          label="Email"
          placeholder="you@example.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />

        <Button
          title="Send Reset Link"
          onPress={handleSubmit}
          loading={forgotPassword.isPending}
          size="lg"
        />

        <Button
          title="Back to Login"
          variant="ghost"
          onPress={() => router.back()}
          className="mt-3"
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
