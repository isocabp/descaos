import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Pressable, Text, View } from "react-native";
import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import Animated, { FadeIn, FadeOut, Layout } from "react-native-reanimated";
import { cn } from "../lib/utils";
import { PriorityType, RecurrenceType } from "../store/useTasks";
import { Checkbox } from "./Checkbox";

interface TaskItemProps {
  label: string;
  category: string;
  isCompleted: boolean;
  recurrence?: RecurrenceType;
  priority?: PriorityType;
  reminderTime?: string;
  onToggle: () => void;
  onDelete: () => void;
  onPress: () => void;
  drag?: () => void;
  isActive?: boolean;
}

export function TaskItem({
  label,
  category,
  isCompleted,
  recurrence = [],
  priority = "medium",
  reminderTime,
  onToggle,
  onDelete,
  onPress,
  drag,
  isActive,
}: TaskItemProps) {
  const getRecurrenceLabel = () => {
    if (!recurrence || recurrence.length === 0) return null;
    if (recurrence.length === 7) return "Todo dia";
    return recurrence.length > 0 ? "Recorrente" : null;
  };

  const recurrenceText = getRecurrenceLabel();

  const renderRightActions = () => (
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

  const priorityColor =
    priority === "high"
      ? "bg-red-400"
      : priority === "medium"
      ? "bg-orange-300"
      : "bg-blue-300";

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
          onLongPress={drag}
          disabled={isActive}
          className={cn(
            "flex-row items-center p-4 border-2 border-transparent bg-white rounded-2xl",
            isActive
              ? "opacity-80 scale-105 shadow-xl border-accent"
              : "shadow-sm"
          )}
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 4,
            elevation: 2,
          }}
        >
          <View className="ml-1">
            <Checkbox checked={isCompleted} onPress={onToggle} />
          </View>

          <View className="flex-1 mr-2 ml-3">
            <View className="flex-row items-center mb-1.5 flex-wrap">
              {/* Prioridade Dot */}
              <View
                className={cn("w-2 h-2 rounded-full mr-2", priorityColor)}
              />

              {category !== "" && (
                <View className="bg-gray-50 px-2 py-0.5 rounded-md border border-gray-100 mr-2">
                  <Text className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                    {category}
                  </Text>
                </View>
              )}

              {reminderTime && (
                <Ionicons
                  name="alarm-outline"
                  size={12}
                  color="#9CA3AF"
                  style={{ marginRight: 4 }}
                />
              )}

              {recurrence.length > 0 && (
                <Ionicons name="repeat" size={12} color="#9CA3AF" />
              )}
            </View>

            <Text
              className={cn(
                "font-body text-lg text-primary leading-tight",
                isCompleted && "line-through text-muted opacity-50"
              )}
              numberOfLines={2}
            >
              {label}
            </Text>
          </View>

          <Pressable
            onPressIn={drag}
            className="p-2 opacity-30 active:opacity-100"
          >
            <Ionicons name="reorder-three" size={24} color="#111" />
          </Pressable>
        </Pressable>
      </Swipeable>
    </Animated.View>
  );
}
