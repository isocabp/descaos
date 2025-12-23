import React from "react";
import { Pressable, View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { cn } from "../lib/utils";
import { Ionicons } from "@expo/vector-icons";

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
          "w-8 h-8 border-2 border-primary rounded-lg items-center justify-center mr-4",
          !checked && "bg-white shadow-[2px_2px_0px_0px_rgba(17,17,17,1)]",
          checked && "bg-accent shadow-none"
        )}
      >
        {checked && <Ionicons name="checkmark-sharp" size={20} color="#111" />}
      </Animated.View>
    </Pressable>
  );
}
