import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function registerForPushNotificationsAsync() {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (!Device.isDevice) {
    console.log("Notificações não funcionam em simulador web/desktop");
    return;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    return;
  }
}

export async function scheduleTaskNotification(title: string, date: Date) {
  const now = Date.now();
  const triggerTime = date.getTime();

  if (triggerTime <= now) return null;

  const seconds = Math.floor((triggerTime - now) / 1000);

  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: "Lembrete Descaos ⚡️",
      body: title,
      sound: true,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: seconds > 0 ? seconds : 1,
      repeats: false,
    },
  });
  return id;
}

export async function cancelTaskNotification(id: string) {
  await Notifications.cancelScheduledNotificationAsync(id);
}
