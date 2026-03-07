import { useState } from "react";
import { View, Text, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { QRScanner } from "@/components/attendance/QRScanner";
import { LateReasonModal } from "@/components/attendance/LateReasonModal";
import { useQRScanner } from "@/hooks/useQRScanner";
import { useLocation } from "@/hooks/useLocation";
import { useCheckIn, useSubmitLateReason } from "@/hooks/useAttendance";
import { Button } from "@/components/ui/Button";

export default function InstructorCheckInScreen() {
  const router = useRouter();
  const { scanned, setScanned, parseQRCode, resetScanner } = useQRScanner();
  const { requestLocation } = useLocation();
  const checkIn = useCheckIn();
  const submitLateReason = useSubmitLateReason();
  const [lateModalVisible, setLateModalVisible] = useState(false);
  const [attendanceId, setAttendanceId] = useState<string | null>(null);

  const handleScan = async (data: string) => {
    setScanned(true);
    const qrData = parseQRCode(data);
    if (!qrData) {
      resetScanner();
      return;
    }

    const location = await requestLocation();

    checkIn.mutate(
      {
        qrData: data,
        latitude: location?.latitude,
        longitude: location?.longitude,
      },
      {
        onSuccess: (record) => {
          if (record.isLate) {
            setAttendanceId(record.id);
            setLateModalVisible(true);
          } else {
            Alert.alert("Checked In", "You have been checked in successfully!", [
              { text: "OK", onPress: () => router.back() },
            ]);
          }
        },
        onError: (error) => {
          Alert.alert("Check-in Failed", error.message);
          resetScanner();
        },
      }
    );
  };

  const handleLateReason = (reason: string) => {
    if (!attendanceId) return;

    submitLateReason.mutate(
      { attendanceId, reason },
      {
        onSuccess: () => {
          setLateModalVisible(false);
          Alert.alert(
            "Checked In (Late)",
            "You have been checked in. Your late reason has been recorded.",
            [{ text: "OK", onPress: () => router.back() }]
          );
        },
        onError: () => {
          setLateModalVisible(false);
          router.back();
        },
      }
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      <View className="absolute top-12 left-4 right-4 z-10 flex-row items-center justify-between">
        <Button
          title="Cancel"
          variant="ghost"
          size="sm"
          onPress={() => router.back()}
          className="bg-black/40"
        />
        <Text className="text-white font-semibold text-lg">Scan QR Code</Text>
        <View className="w-16" />
      </View>

      <QRScanner onScan={handleScan} scanned={scanned} onReset={resetScanner} />

      <LateReasonModal
        visible={lateModalVisible}
        onSubmit={handleLateReason}
        onDismiss={() => {
          setLateModalVisible(false);
          router.back();
        }}
        loading={submitLateReason.isPending}
      />
    </SafeAreaView>
  );
}
