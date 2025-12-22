import { Checkbox } from "@/src/components/Checkbox";
import { cn } from "@/src/lib/utils";
import { Task } from "@/src/store/useTasks";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

type Props = {
  task: Task;
  isFocusMode: boolean;
  isCurrentFocus: boolean;
  onToggle: () => void;
  onDelete: () => void;
  onFocus: () => void;
};

export function TaskItem({
  task,
  isFocusMode,
  isCurrentFocus,
  onToggle,
  onDelete,
  onFocus,
}: Props) {
  return (
    <Pressable
      onPress={onFocus}
      disabled={isFocusMode}
      accessibilityRole="button"
      className={cn(
        "bg-surface rounded-3xl p-5 mb-4",
        isCurrentFocus ? "border-2 border-accent" : "border border-transparent"
      )}
    >
      <View className="flex-row items-start justify-between">
        <View className="flex-1 pr-4">
          <Text
            className={cn(
              "font-heading text-2xl",
              task.isCompleted ? "text-muted" : "text-primary"
            )}
          >
            {task.text}
          </Text>

          <Text className="font-body text-muted mt-1">{task.category}</Text>
        </View>

        <Pressable
          onPress={onDelete}
          accessibilityRole="button"
          className="h-10 w-10 items-center justify-center rounded-2xl bg-background"
        >
          <Ionicons name="trash-outline" size={18} color="#111111" />
        </Pressable>
      </View>

      <View className="mt-4">
        <Checkbox checked={task.isCompleted} onPress={onToggle} />
      </View>
    </Pressable>
  );
}
