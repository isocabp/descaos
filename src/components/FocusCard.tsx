import { Button } from "@/src/components/Button";
import { cn } from "@/src/lib/utils";
import { Task } from "@/src/store/useTasks";
import { Pressable, Text, View } from "react-native";

type Props = {
  isFocusMode: boolean;
  onToggleFocus: () => void;
  currentTask: Task | null;
  onSkip: () => void;
};

export function FocusCard({
  isFocusMode,
  onToggleFocus,
  currentTask,
  onSkip,
}: Props) {
  if (!currentTask) return null;

  return (
    <View className="bg-surface rounded-3xl p-5">
      <View className="flex-row items-center justify-between mb-3">
        <Text className="font-bold text-primary text-lg">Modo foco</Text>

        <Pressable
          onPress={onToggleFocus}
          accessibilityRole="switch"
          accessibilityState={{ checked: isFocusMode }}
          className={cn(
            "rounded-full px-4 py-2",
            isFocusMode ? "bg-accent" : "bg-background"
          )}
        >
          <Text className="font-bold text-primary">
            {isFocusMode ? "Ativo" : "Inativo"}
          </Text>
        </Pressable>
      </View>

      <Text className="font-body text-muted mb-1">Agora:</Text>
      <Text className="font-heading text-2xl text-primary mb-4">
        {currentTask.text}
      </Text>

      {isFocusMode && (
        <View className="flex-row gap-3">
          <View className="flex-1">
            <Button onPress={onSkip} variant="secondary">
              Pular
            </Button>
          </View>
        </View>
      )}
    </View>
  );
}
