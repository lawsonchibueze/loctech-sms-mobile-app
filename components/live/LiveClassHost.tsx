import { useEffect, useState } from "react";
import { View, Text } from "react-native";
import {
  LiveKitRoom,
  AudioSession,
  useTracks,
  VideoTrack,
  useLocalParticipant,
  isTrackReference,
} from "@livekit/react-native";
import { Track } from "livekit-client";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

interface LiveClassHostProps {
  token: string;
  serverUrl: string;
  onDisconnected?: () => void;
}

function HostControls() {
  const { localParticipant } = useLocalParticipant();
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [micEnabled, setMicEnabled] = useState(true);

  const toggleCamera = async () => {
    await localParticipant.setCameraEnabled(!cameraEnabled);
    setCameraEnabled(!cameraEnabled);
  };

  const toggleMic = async () => {
    await localParticipant.setMicrophoneEnabled(!micEnabled);
    setMicEnabled(!micEnabled);
  };

  return (
    <View className="flex-row justify-center gap-4 py-3 px-4">
      <Button
        title={micEnabled ? "Mute" : "Unmute"}
        variant={micEnabled ? "outline" : "primary"}
        size="sm"
        onPress={toggleMic}
        className="bg-white/10"
      />
      <Button
        title={cameraEnabled ? "Cam Off" : "Cam On"}
        variant={cameraEnabled ? "outline" : "primary"}
        size="sm"
        onPress={toggleCamera}
        className="bg-white/10"
      />
    </View>
  );
}

function HostVideoPreview() {
  const tracks = useTracks([Track.Source.Camera], { onlySubscribed: false });
  const localVideo = tracks.find(
    (t) => isTrackReference(t) && t.source === Track.Source.Camera
  );

  if (!localVideo || !isTrackReference(localVideo)) {
    return (
      <View className="flex-1 bg-black items-center justify-center">
        <Text className="text-gray-400 text-sm">Camera off</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black">
      <VideoTrack trackRef={localVideo} style={{ flex: 1 }} mirror={true} />
    </View>
  );
}

export function LiveClassHost({ token, serverUrl, onDisconnected }: LiveClassHostProps) {
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
      audio={true}
      video={true}
      onConnected={() => setConnected(true)}
      onDisconnected={() => {
        setConnected(false);
        onDisconnected?.();
      }}
    >
      {connected ? (
        <View className="absolute top-2 right-2 z-10">
          <Badge label="LIVE" variant="error" />
        </View>
      ) : null}
      <HostVideoPreview />
      <HostControls />
    </LiveKitRoom>
  );
}
