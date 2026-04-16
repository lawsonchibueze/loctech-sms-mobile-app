import { useEffect, useRef } from "react";
import { Platform } from "react-native";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import Constants from "expo-constants";
import { api } from "@/lib/api";
import { useAuthStore } from "@/lib/auth-store";
import { NOTIFICATION_CHANNELS } from "@/lib/constants";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

async function setupAndroidChannels() {
  if (Platform.OS !== "android") return;

  for (const channel of NOTIFICATION_CHANNELS) {
    await Notifications.setNotificationChannelAsync(channel.id, {
      name: channel.name,
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#1E40AF",
    });
  }
}

async function registerForPushNotifications(): Promise<string | null> {
  if (!Device.isDevice) {
    console.log("Push notifications require a physical device");
    return null;
  }

  const { status: existingStatus } =
    await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    return null;
  }

  await setupAndroidChannels();

  const projectId = Constants.expoConfig?.extra?.eas?.projectId;
  const tokenData = await Notifications.getExpoPushTokenAsync({
    projectId,
  });

  return tokenData.data;
}

export function usePushNotifications() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const notificationListener =
    useRef<ReturnType<typeof Notifications.addNotificationReceivedListener> | null>(null);
  const responseListener =
    useRef<ReturnType<typeof Notifications.addNotificationResponseReceivedListener> | null>(null);

  useEffect(() => {
    if (!isAuthenticated) return;

    registerForPushNotifications()
      .then(async (token) => {
        if (!token) return;

        try {
          await api.post("/sms/notifications/device-tokens", {
            token,
            platform: Platform.OS as "ios" | "android",
            deviceId: Constants.installationId ?? "unknown",
          });
        } catch (error) {
          console.warn("Failed to register push token:", error);
        }
      })
      .catch((err) => {
        console.warn("Push notification setup skipped:", err?.message ?? err);
      });

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        console.log("Notification received:", notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const data = response.notification.request.content.data as Record<string, string>;
        if (!data?.type) return;

        const { router } = require('expo-router');

        switch (data.type) {
          case 'message':
          case 'mention':
            if (data.channelId) router.push(`/chat/${data.channelId}`);
            break;
          case 'class_reminder':
            if (data.resourceId) router.push(`/learn/classes/${data.resourceId}`);
            break;
          case 'payment_due':
            if (data.resourceId) router.push(`/payments/${data.resourceId}`);
            break;
          case 'grade_posted':
            router.push('/grades');
            break;
          case 'certificate':
            if (data.resourceId) router.push(`/certificates/${data.resourceId}`);
            break;
          case 'scholarship':
            if (data.resourceId) router.push(`/scholarship/${data.resourceId}`);
            break;
          case 'assignment_due':
            if (data.resourceId) router.push(`/learn/assignments/${data.resourceId}`);
            break;
          case 'call':
            if (data.callId) router.push(`/calls/incoming?callId=${data.callId}`);
            break;
          default:
            console.log('Unknown notification type:', data.type);
        }
      });

    return () => {
      notificationListener.current?.remove();
      responseListener.current?.remove();
    };
  }, [isAuthenticated]);
}
