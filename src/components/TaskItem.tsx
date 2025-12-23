import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Checkbox } from "./Checkbox";
import { cn } from "../lib/utils";
import { RecurrenceType } from "../store/useTasks";
import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import Animated, { Layout, FadeIn, FadeOut } from "react-native-reanimated";
import * as Haptics from "expo-haptics";

interface TaskItemProps {
  label: string;
  category: string;
  isCompleted: boolean;
  recurrence?: RecurrenceType;
  onToggle: () => void;
  onDelete: () => void;
  onPress: () => void;
}

export function TaskItem({
  label,
  category,
  isCompleted,
  recurrence = [],
  onToggle,
  onDelete,
  onPress,
}: TaskItemProps) {
  const getRecurrenceLabel = () => {
    if (!recurrence || recurrence.length === 0) return null;
    if (recurrence.length === 7) return "Todo dia";
    const weekDays =
      recurrence.length === 5 &&
      !recurrence.includes(0) &&
      !recurrence.includes(6);
    if (weekDays) return "Dias úteis";
    const weekend =
      recurrence.length === 2 &&
      recurrence.includes(0) &&
      recurrence.includes(6);
    if (weekend) return "Fim de semana";
    const shortNames = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
    return recurrence.map((d) => shortNames[d]).join(", ");
  };

  const recurrenceText = getRecurrenceLabel();

  const renderRightActions = () => {
    return (
      <Pressable
        onPress={() => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          onDelete();
        }}
        className="bg-red-500 justify-center items-center w-20 rounded-r-2xl mb-3 h-full"
      >
        <Ionicons name="trash-outline" size={24} color="white" />
      </Pressable>
    );
  };

  return (
    <Animated.View
      layout={Layout.springify()}
      entering={FadeIn}
      exiting={FadeOut}
      className="mb-3"
    >
      <Swipeable renderRightActions={renderRightActions}>
        <Pressable
          onPress={onPress}
          className={cn(
            "flex-row items-center p-4 border-2 border-primary rounded-2xl bg-surface",
            "shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] active:translate-y-[1px] active:shadow-none transition-all"
          )}
        >
          <Checkbox checked={isCompleted} onPress={onToggle} />

          <View className="flex-1 mr-2 ml-1">
            <View className="flex-row items-center mb-1 flex-wrap">
              {category !== "" && (
                <View className="bg-gray-100 px-2 py-0.5 rounded-md border border-gray-200 mr-2">
                  <Text className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                    {category}
                  </Text>
                </View>
              )}

              {recurrenceText && (
                <View className="flex-row items-center">
                  <Ionicons name="repeat" size={10} color="#9CA3AF" />
                  <Text className="text-[10px] text-gray-400 font-bold ml-1 uppercase">
                    {recurrenceText}
                  </Text>
                </View>
              )}
            </View>

            <Text
              className={cn(
                "font-body text-lg text-primary",
                isCompleted && "line-through text-muted opacity-50"
              )}
              numberOfLines={2}
            >
              {label}
            </Text>
          </View>

          <Ionicons name="chevron-forward" size={16} color="#E5E7EB" />
        </Pressable>
      </Swipeable>
    </Animated.View>
  );
}
