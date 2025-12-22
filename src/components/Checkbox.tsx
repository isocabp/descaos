import { cn } from "@/src/lib/utils";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

type Props = {
  checked: boolean;
  onPress: () => void;
};

export function Checkbox({ checked, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      className="flex-row items-center"
    >
      <View
        className={cn(
          "h-6 w-6 rounded-lg items-center justify-center mr-3",
          checked ? "bg-accent" : "bg-surface"
        )}
      >
        {checked && <Ionicons name="checkmark" size={16} color="#111111" />}
      </View>

      <Text
        className={cn(
          "font-bold text-base",
          checked ? "text-muted" : "text-primary"
        )}
      >
        {checked ? "Concluída" : "Pendente"}
      </Text>
    </Pressable>
  );
}
