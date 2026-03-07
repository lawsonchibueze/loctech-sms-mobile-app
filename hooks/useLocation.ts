import { useState, useCallback } from "react";
import { Alert } from "react-native";
import * as Location from "expo-location";

interface Coords {
  latitude: number;
  longitude: number;
}

export function useLocation() {
  const [coords, setCoords] = useState<Coords | null>(null);
  const [loading, setLoading] = useState(false);

  const requestLocation = useCallback(async (): Promise<Coords | null> => {
    setLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Location Permission",
          "Location access helps verify your attendance. You can still check in without it."
        );
        setLoading(false);
        return null;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const result = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
      setCoords(result);
      setLoading(false);
      return result;
    } catch {
      setLoading(false);
      return null;
    }
  }, []);

  return { coords, loading, requestLocation };
}
