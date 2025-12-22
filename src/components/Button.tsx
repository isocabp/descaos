import { cn } from "@/src/lib/utils";
import { Pressable, Text } from "react-native";

type Props = {
  children: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "danger";
};

export function Button({
  children,
  onPress,
  disabled,
  variant = "primary",
}: Props) {
  const base = "rounded-2xl py-4 items-center justify-center active:opacity-90";

  const variantClass =
    variant === "primary"
      ? "bg-accent"
      : variant === "danger"
      ? "bg-danger"
      : "bg-surface";

  const textClass = variant === "secondary" ? "text-primary" : "text-primary";

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled }}
      className={cn(
        base,
        variantClass,
        disabled ? "opacity-40" : "opacity-100"
      )}
    >
      <Text className={cn("font-bold text-lg", textClass)}>{children}</Text>
    </Pressable>
  );
}
