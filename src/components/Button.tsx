import * as Haptics from "expo-haptics";
import { Text, TouchableOpacity, TouchableOpacityProps } from "react-native";
import { cn } from "../lib/utils";

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: "primary" | "secondary";
}

export function Button({
  title,
  variant = "primary",
  className,
  onPress,
  style,
  ...props
}: ButtonProps) {
  const handlePress = (e: any) => {
    Haptics.selectionAsync();
    onPress?.(e);
  };

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={handlePress}
      className={cn(
        "w-full py-4 rounded-xl border-2 border-primary flex items-center justify-center mb-4",
        variant === "primary" ? "bg-primary" : "bg-white",
        className
      )}
      style={[
        {
          shadowColor: "#111",
          shadowOffset: { width: 4, height: 4 },
          shadowOpacity: 1,
          shadowRadius: 0,
          elevation: 5,
        },
        style,
      ]}
      {...props}
    >
      <Text
        className={cn(
          "font-bold text-lg font-heading",
          variant === "primary" ? "text-accent" : "text-primary"
        )}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}
