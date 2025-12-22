import * as Haptics from "expo-haptics";

export async function hapticSelection() {
  try {
    await Haptics.selectionAsync();
  } catch {
    return;
  }
}

export async function hapticImpact(style: Haptics.ImpactFeedbackStyle) {
  try {
    await Haptics.impactAsync(style);
  } catch {
    return;
  }
}

export async function hapticNotification(
  type: Haptics.NotificationFeedbackType
) {
  try {
    await Haptics.notificationAsync(type);
  } catch {
    return;
  }
}
