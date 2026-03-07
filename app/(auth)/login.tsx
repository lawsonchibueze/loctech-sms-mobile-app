import { useState } from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLogin, ApiError } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [instituteCode, setInstituteCode] = useState("");

  const login = useLogin();

  const handleLogin = () => {
    if (!email.trim() || !password.trim() || !instituteCode.trim()) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    login.mutate(
      {
        email: email.trim().toLowerCase(),
        password,
        instituteCode: instituteCode.trim(),
      },
      {
        onError: (error) => {
          const message =
            error instanceof ApiError
              ? error.message
              : "Something went wrong. Please try again.";
          Alert.alert("Login Failed", message);
        },
      }
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          contentContainerClassName="flex-1 justify-center px-6"
          keyboardShouldPersistTaps="handled"
        >
          <View className="mb-10">
            <Text className="text-3xl font-bold text-primary-800 dark:text-primary-400">
              Loctech SMS
            </Text>
            <Text className="text-base text-gray-500 dark:text-gray-400 mt-2">
              Sign in to your account
            </Text>
          </View>

          <Input
            label="Institute Code"
            placeholder="e.g. LOCTECH"
            value={instituteCode}
            onChangeText={setInstituteCode}
            autoCapitalize="characters"
            autoCorrect={false}
          />

          <Input
            label="Email"
            placeholder="you@example.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Input
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            isPassword
          />

          <Button
            title="Sign In"
            onPress={handleLogin}
            loading={login.isPending}
            className="mt-2"
            size="lg"
          />

          <Link href="/(auth)/forgot-password" asChild>
            <Text className="text-primary-600 text-center mt-4 text-sm font-medium">
              Forgot your password?
            </Text>
          </Link>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
