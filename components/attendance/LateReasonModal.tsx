import { useState } from "react";
import { View, Text, Modal, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

const QUICK_REASONS = [
  "Traffic congestion",
  "Public transport delay",
  "Medical appointment",
  "Family emergency",
  "Vehicle breakdown",
];

interface LateReasonModalProps {
  visible: boolean;
  onSubmit: (reason: string) => void;
  onDismiss: () => void;
  loading?: boolean;
}

export function LateReasonModal({
  visible,
  onSubmit,
  onDismiss,
  loading,
}: LateReasonModalProps) {
  const [reason, setReason] = useState("");
  const [selectedQuick, setSelectedQuick] = useState<string | null>(null);

  const handleSubmit = () => {
    const finalReason = selectedQuick ?? reason.trim();
    if (!finalReason) return;
    onSubmit(finalReason);
    setReason("");
    setSelectedQuick(null);
  };

  const handleQuickSelect = (quickReason: string) => {
    setSelectedQuick(quickReason === selectedQuick ? null : quickReason);
    setReason("");
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onDismiss}
    >
      <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1 px-6 pt-6"
        >
          <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Why are you late?
          </Text>
          <Text className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            Please provide a reason for your late arrival.
          </Text>

          <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Quick select
          </Text>
          <View className="flex-row flex-wrap gap-2 mb-6">
            {QUICK_REASONS.map((qr) => (
              <Button
                key={qr}
                title={qr}
                variant={selectedQuick === qr ? "primary" : "outline"}
                size="sm"
                onPress={() => handleQuickSelect(qr)}
              />
            ))}
          </View>

          <Input
            label="Or type your reason"
            placeholder="Enter reason..."
            value={reason}
            onChangeText={(text) => {
              setReason(text);
              setSelectedQuick(null);
            }}
            multiline
            numberOfLines={3}
          />

          <View className="mt-auto mb-6 gap-3">
            <Button
              title="Submit Reason"
              onPress={handleSubmit}
              loading={loading}
              disabled={!reason.trim() && !selectedQuick}
              size="lg"
            />
            <Button
              title="Skip for now"
              variant="ghost"
              onPress={onDismiss}
            />
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
}
