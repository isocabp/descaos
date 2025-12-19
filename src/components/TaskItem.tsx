// src/components/TaskItem.tsx
import { View, Text } from "react-native";
import { Checkbox } from "./Checkbox";
import { cn } from "../lib/utils";

interface TaskItemProps {
  label: string;
  isCompleted: boolean;
  onToggle: () => void;
  // Removemos o onFocus daqui também
}

export function TaskItem({ label, isCompleted, onToggle }: TaskItemProps) {
  return (
    <View
      className={cn(
        "flex-row items-center p-4 mb-3 border-2 border-primary rounded-xl bg-surface",
        "shadow-[2px_2px_0px_0px_rgba(17,17,17,1)]"
      )}
    >
      <Checkbox checked={isCompleted} onPress={onToggle} />

      <Text
        className={cn(
          "font-body text-lg flex-1 text-primary mr-2",
          isCompleted && "line-through text-muted opacity-50"
        )}
        numberOfLines={1}
      >
        {label}
      </Text>
    </View>
  );
}
