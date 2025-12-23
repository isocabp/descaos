import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React from "react";
import { Pressable } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { cn } from "../lib/utils";

interface CheckboxProps {
  checked: boolean;
  onPress: () => void;
}

export function Checkbox({ checked, onPress }: CheckboxProps) {
  const scale = useSharedValue(1);

  const handlePress = () => {
    Haptics.selectionAsync();
    scale.value = withSpring(0.8, {}, () => {
      scale.value = withSpring(1);
    });
    onPress();
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable onPress={handlePress} className="active:opacity-80">
      <Animated.View
        style={animatedStyle}
        className={cn(
          "w-6 h-6 border-2 border-primary rounded-lg items-center justify-center",
          !checked && "bg-transparent border-gray-300",
          checked && "bg-accent border-accent"
        )}
      >
        {checked && (
          <Ionicons name="checkmark-sharp" size={16} color="#111111" />
        )}
      </Animated.View>
    </Pressable>
  );
}
