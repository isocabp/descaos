import { cn } from "@/src/lib/utils";
import { Pressable, Text, View } from "react-native";

type Props = {
  label: string;
  active: boolean;
  onPress: () => void;
};

export function Toggle({ label, active, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="switch"
      accessibilityState={{ checked: active }}
      className={cn(
        "rounded-2xl px-4 py-4 flex-row items-center justify-between",
        active ? "bg-accent" : "bg-background"
      )}
    >
      <Text className="font-bold text-primary">{label}</Text>

      <View
        className={cn(
          "h-6 w-10 rounded-full p-1",
          active ? "bg-primary/20" : "bg-primary/10"
        )}
      >
        <View
          className={cn(
            "h-4 w-4 rounded-full bg-primary",
            active ? "ml-auto" : "mr-auto"
          )}
        />
      </View>
    </Pressable>
  );
}
