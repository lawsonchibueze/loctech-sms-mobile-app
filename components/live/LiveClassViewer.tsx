import { useEffect, useState } from "react";
import { View, Text } from "react-native";
import {
  LiveKitRoom,
  AudioSession,
  useTracks,
  VideoTrack,
  isTrackReference,
} from "@livekit/react-native";
import { Track } from "livekit-client";
import { Badge } from "@/components/ui/Badge";

interface LiveClassViewerProps {
  token: string;
  serverUrl: string;
  onDisconnected?: () => void;
}

function ViewerContent() {
  const tracks = useTracks([Track.Source.Camera, Track.Source.ScreenShare], {
    onlySubscribed: true,
  });

  const videoTrack = tracks.find(
    (t) => isTrackReference(t) && t.source === Track.Source.Camera
  );
  const screenTrack = tracks.find(
    (t) => isTrackReference(t) && t.source === Track.Source.ScreenShare
  );

  const displayTrack = screenTrack ?? videoTrack;

  if (!displayTrack || !isTrackReference(displayTrack)) {
    return (
      <View className="flex-1 bg-black items-center justify-center">
        <Text className="text-gray-400 text-sm">Waiting for host video...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black">
      <VideoTrack trackRef={displayTrack} style={{ flex: 1 }} />
    </View>
  );
}

export function LiveClassViewer({ token, serverUrl, onDisconnected }: LiveClassViewerProps) {
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const setup = async () => {
      await AudioSession.startAudioSession();
    };
    setup();
    return () => {
      AudioSession.stopAudioSession();
    };
  }, []);

  return (
    <LiveKitRoom
      serverUrl={serverUrl}
      token={token}
      connect={true}
      options={{ adaptiveStream: true, dynacast: true }}
      onConnected={() => setConnected(true)}
      onDisconnected={() => {
        setConnected(false);
        onDisconnected?.();
      }}
    >
      {connected ? (
        <View className="absolute top-2 right-2 z-10">
          <Badge label="CONNECTED" variant="success" />
        </View>
      ) : null}
      <ViewerContent />
    </LiveKitRoom>
  );
}
