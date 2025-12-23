import { View, Text, TouchableOpacity } from "react-native";
import Animated, { SlideInRight, SlideOutLeft } from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { Ionicons } from "@expo/vector-icons";
import { Task } from "../store/useTasks";

interface FocusCardProps {
  task: Task;
  onComplete: () => void;
  onSkip: () => void;
}

export function FocusCard({ task, onComplete, onSkip }: FocusCardProps) {
  const handleComplete = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onComplete();
  };

  return (
    <Animated.View
      entering={SlideInRight}
      exiting={SlideOutLeft}
      className="flex-1 justify-center items-center"
    >
      <View className="w-full aspect-square bg-white border-4 border-primary rounded-3xl p-8 justify-between shadow-[8px_8px_0px_0px_rgba(17,17,17,1)]">
        <View className="flex-row justify-between items-start">
          <View className="bg-accent px-3 py-1 rounded-full border border-primary">
            <Text className="font-bold text-xs uppercase text-primary">
              {task.category || "Foco"}
            </Text>
          </View>
          <TouchableOpacity onPress={onSkip} className="opacity-50">
            <Ionicons name="shuffle" size={24} color="#111" />
          </TouchableOpacity>
        </View>

        <Text className="font-heading text-4xl text-primary leading-tight mt-4">
          {task.text}
        </Text>

        <TouchableOpacity
          onPress={handleComplete}
          className="bg-primary w-full py-6 rounded-xl mt-8 active:scale-95 transition-transform"
        >
          <Text className="text-accent font-heading text-center text-xl uppercase">
            Feito!
          </Text>
        </TouchableOpacity>
      </View>

      <Text className="text-white/60 mt-8 font-body text-center px-10">
        Uma coisa de cada vez. Sem pressa.
      </Text>
    </Animated.View>
  );
}
