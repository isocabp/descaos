// src/components/Toggle.tsx
import { Pressable, View, Text } from "react-native";
import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { cn } from "../lib/utils";

interface ToggleProps {
  value: boolean;
  onValueChange: (val: boolean) => void;
  label: string;
}

export function Toggle({ value, onValueChange, label }: ToggleProps) {
  const handlePress = () => {
    Haptics.selectionAsync();
    onValueChange(!value);
  };

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: withTiming(value ? 28 : 0) }], // Move a bolinha
  }));

  return (
    <Pressable
      onPress={handlePress}
      className="flex-row items-center justify-between mb-6"
    >
      <Text className="font-heading text-xl text-primary">{label}</Text>

      <View
        className={cn(
          "w-14 h-8 rounded-full border-2 border-primary justify-center px-1 transition-colors",
          value ? "bg-accent" : "bg-gray-200"
        )}
      >
        <Animated.View
          style={thumbStyle}
          className="w-5 h-5 rounded-full bg-primary border border-primary"
        />
      </View>
    </Pressable>
  );
}
