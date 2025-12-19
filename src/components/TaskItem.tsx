// src/components/TaskItem.tsx
import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";
import { cn } from "../lib/utils";
import { RecurrenceType } from "../store/useTasks";
import { Checkbox } from "./Checkbox";

interface TaskItemProps {
  label: string;
  category: string;
  isCompleted: boolean;
  recurrence?: RecurrenceType; // Novo prop opcional
  onToggle: () => void;
  onDelete: () => void;
}

export function TaskItem({
  label,
  category,
  isCompleted,
  recurrence = "none",
  onToggle,
  onDelete,
}: TaskItemProps) {
  return (
    <View
      className={cn(
        "flex-row items-center p-4 mb-3 border-2 border-primary rounded-xl bg-surface",
        "shadow-[2px_2px_0px_0px_rgba(17,17,17,1)]"
      )}
    >
      <Checkbox checked={isCompleted} onPress={onToggle} />

      <View className="flex-1 mr-2 ml-1">
        <View className="flex-row items-center mb-1">
          {/* Tag de Categoria */}
          <View className="bg-gray-100 px-2 py-0.5 rounded-md border border-gray-200 mr-2">
            <Text className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
              {category}
            </Text>
          </View>

          {/* Ícone de Recorrência (Se existir) */}
          {recurrence !== "none" && (
            <View className="flex-row items-center">
              <Ionicons name="sync" size={10} color="#9CA3AF" />
              <Text className="text-[10px] text-gray-400 font-bold ml-1 uppercase">
                {recurrence === "daily" ? "Todo dia" : "Seg-Sex"}
              </Text>
            </View>
          )}
        </View>

        <Text
          className={cn(
            "font-body text-lg text-primary",
            isCompleted && "line-through text-muted opacity-50"
          )}
          numberOfLines={1}
        >
          {label}
        </Text>
      </View>

      <TouchableOpacity
        onPress={onDelete}
        className="p-2 opacity-30 active:opacity-100"
      >
        <Ionicons name="trash-outline" size={20} color="#FF4D4D" />
      </TouchableOpacity>
    </View>
  );
}
