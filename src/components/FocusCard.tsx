import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Text, TouchableOpacity, View } from "react-native";
import Animated, { SlideInRight, SlideOutLeft } from "react-native-reanimated";
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
      <View className="w-full aspect-square bg-white border-2 border-gray-100 rounded-[32px] p-8 justify-between shadow-lg shadow-gray-200/50">
        <View className="flex-row justify-between items-start">
          <View className="bg-gray-50 px-4 py-2 rounded-full">
            <Text className="font-bold text-xs uppercase text-gray-500 tracking-wider">
              {task.category || "Foco"}
            </Text>
          </View>
          <TouchableOpacity onPress={onSkip} className="opacity-30 p-2">
            <Ionicons name="shuffle" size={24} color="#111" />
          </TouchableOpacity>
        </View>

        <Text className="font-heading text-4xl text-primary leading-tight mt-4 text-center">
          {task.text}
        </Text>

        <TouchableOpacity
          onPress={handleComplete}
          className="bg-primary w-full py-5 rounded-2xl mt-8 active:scale-95 transition-transform shadow-md"
        >
          <Text className="text-white font-bold text-center text-lg uppercase tracking-wide">
            Concluir
          </Text>
        </TouchableOpacity>
      </View>

      <Text className="text-gray-400 mt-10 font-body text-center text-sm tracking-wide uppercase">
        Foco total • Uma coisa de cada vez
      </Text>
    </Animated.View>
  );
}
