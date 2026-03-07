import { useState, useRef, useCallback } from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { Video, ResizeMode, type AVPlaybackStatus } from "expo-av";

interface Chapter {
  title: string;
  timestamp: number;
}

interface VideoPlayerProps {
  uri: string;
  chapters?: Chapter[];
  onProgress?: (positionMillis: number, durationMillis: number) => void;
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function VideoPlayer({ uri, chapters, onProgress }: VideoPlayerProps) {
  const videoRef = useRef<Video>(null);
  const [showChapters, setShowChapters] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const handlePlaybackStatusUpdate = useCallback(
    (status: AVPlaybackStatus) => {
      if (!status.isLoaded) return;
      setCurrentTime((status.positionMillis ?? 0) / 1000);
      setDuration((status.durationMillis ?? 0) / 1000);
      if (onProgress && status.positionMillis != null && status.durationMillis != null) {
        onProgress(status.positionMillis, status.durationMillis);
      }
    },
    [onProgress]
  );

  const seekToTimestamp = (timestamp: number) => {
    videoRef.current?.setPositionAsync(timestamp * 1000);
    setShowChapters(false);
  };

  return (
    <View>
      <Video
        ref={videoRef}
        source={{ uri }}
        useNativeControls
        resizeMode={ResizeMode.CONTAIN}
        style={{ width: "100%", aspectRatio: 16 / 9, backgroundColor: "#000" }}
        onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
      />

      {/* Progress info */}
      <View className="flex-row items-center justify-between px-2 py-1">
        <Text className="text-xs text-gray-500">
          {formatTime(currentTime)} / {formatTime(duration)}
        </Text>
        {chapters?.length ? (
          <TouchableOpacity onPress={() => setShowChapters(!showChapters)}>
            <Text className="text-xs text-primary-600 font-medium">
              {showChapters ? "Hide" : "Show"} Chapters ({chapters.length})
            </Text>
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Chapters list */}
      {showChapters && chapters?.length ? (
        <View className="border-t border-gray-200 dark:border-gray-700">
          <FlatList
            data={chapters}
            keyExtractor={(_, i) => String(i)}
            scrollEnabled={false}
            renderItem={({ item }) => {
              const isActive =
                currentTime >= item.timestamp &&
                (chapters.indexOf(item) === chapters.length - 1 ||
                  currentTime < chapters[chapters.indexOf(item) + 1].timestamp);

              return (
                <TouchableOpacity
                  onPress={() => seekToTimestamp(item.timestamp)}
                  className={`flex-row items-center px-4 py-3 ${
                    isActive ? "bg-primary-50 dark:bg-primary-900/20" : ""
                  }`}
                >
                  <Text className="text-xs text-primary-600 font-mono w-12">
                    {formatTime(item.timestamp)}
                  </Text>
                  <Text
                    className={`text-sm flex-1 ${
                      isActive
                        ? "text-primary-700 dark:text-primary-400 font-semibold"
                        : "text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {item.title}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />
        </View>
      ) : null}
    </View>
  );
}
