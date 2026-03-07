import { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { Button } from "@/components/ui/Button";

interface QRScannerProps {
  onScan: (data: string) => void;
  scanned: boolean;
  onReset: () => void;
}

export function QRScanner({ onScan, scanned, onReset }: QRScannerProps) {
  const [permission, requestPermission] = useCameraPermissions();

  if (!permission) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-gray-500">Requesting camera permission...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View className="flex-1 items-center justify-center px-8">
        <Text className="text-lg font-semibold text-gray-900 dark:text-white text-center mb-2">
          Camera Access Required
        </Text>
        <Text className="text-sm text-gray-500 text-center mb-6">
          We need camera access to scan QR codes for attendance check-in.
        </Text>
        <Button title="Grant Permission" onPress={requestPermission} />
      </View>
    );
  }

  return (
    <View className="flex-1">
      <CameraView
        style={StyleSheet.absoluteFillObject}
        barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
        onBarcodeScanned={
          scanned ? undefined : (result) => onScan(result.data)
        }
      />

      {/* Scan overlay */}
      <View className="flex-1 items-center justify-center">
        <View className="w-64 h-64 border-2 border-white rounded-3xl" />
        <Text className="text-white text-sm mt-4 font-medium">
          {scanned ? "QR Code scanned!" : "Point camera at the QR code"}
        </Text>
      </View>

      {scanned && (
        <View className="absolute bottom-12 left-0 right-0 px-6">
          <Button title="Scan Again" variant="secondary" onPress={onReset} />
        </View>
      )}
    </View>
  );
}
