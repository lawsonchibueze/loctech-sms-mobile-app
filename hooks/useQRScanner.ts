import { useState, useCallback } from "react";
import { Alert } from "react-native";

interface QRData {
  branchId: string;
  timestamp: number;
  rotationKey: string;
}

export function useQRScanner() {
  const [scanned, setScanned] = useState(false);

  const parseQRCode = useCallback((data: string): QRData | null => {
    try {
      const parsed = JSON.parse(data);
      if (!parsed.branchId || !parsed.timestamp || !parsed.rotationKey) {
        return null;
      }

      // Check if QR code is expired (older than 90 seconds)
      const age = Date.now() - parsed.timestamp;
      if (age > 90000) {
        Alert.alert("Expired QR Code", "This QR code has expired. Please scan a fresh one.");
        return null;
      }

      return parsed as QRData;
    } catch {
      Alert.alert("Invalid QR Code", "This QR code is not valid for attendance.");
      return null;
    }
  }, []);

  const resetScanner = useCallback(() => {
    setScanned(false);
  }, []);

  return { scanned, setScanned, parseQRCode, resetScanner };
}
