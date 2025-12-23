import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useEffect, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { cn } from "../lib/utils";
import { RecurrenceType, Task, useTasks } from "../store/useTasks";
import { Button } from "./Button";

interface AddTaskModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (text: string, category: string, recurrence: RecurrenceType) => void;
  initialTask?: Task | null;
}

const DAYS_OF_WEEK = [
  { id: 0, label: "Todo domingo" },
  { id: 1, label: "Toda segunda-feira" },
  { id: 2, label: "Toda terça-feira" },
  { id: 3, label: "Toda quarta-feira" },
  { id: 4, label: "Toda quinta-feira" },
  { id: 5, label: "Toda sexta-feira" },
  { id: 6, label: "Todo sábado" },
];

export function AddTaskModal({
  visible,
  onClose,
  onSave,
  initialTask,
}: AddTaskModalProps) {
  const [text, setText] = useState("");
  const [currentScreen, setCurrentScreen] = useState<"main" | "recurrence">(
    "main"
  );
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [newCategoryText, setNewCategoryText] = useState("");
  const [recurrence, setRecurrence] = useState<number[]>([]);

  const { categories } = useTasks();

  useEffect(() => {
    if (visible) {
      if (initialTask) {
        setText(initialTask.text);
        setSelectedCategory(initialTask.category);
        setRecurrence(initialTask.recurrence);
      } else {
        setText("");
        setSelectedCategory("");
        setRecurrence([]);
      }
      setCurrentScreen("main");
      setIsCreatingCategory(false);
      setNewCategoryText("");
    }
  }, [visible, initialTask]);

  const handleSave = () => {
    if (!text.trim()) return;

    const finalCategory =
      isCreatingCategory && newCategoryText.trim()
        ? newCategoryText.trim()
        : selectedCategory;

    onSave(text, finalCategory, recurrence);
    onClose();
  };

  const toggleDay = (dayId: number) => {
    Haptics.selectionAsync();
    setRecurrence((prev) => {
      if (prev.includes(dayId)) return prev.filter((d) => d !== dayId);
      return [...prev, dayId].sort();
    });
  };

  const getRecurrenceLabel = () => {
    if (recurrence.length === 0) return "Nunca";
    if (recurrence.length === 7) return "Todos os dias";

    const weekDays =
      recurrence.length === 5 &&
      !recurrence.includes(0) &&
      !recurrence.includes(6);
    if (weekDays) return "Dias da semana";

    const weekend =
      recurrence.length === 2 &&
      recurrence.includes(0) &&
      recurrence.includes(6);
    if (weekend) return "Fim de semana";

    const shortNames = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
    return recurrence.map((day) => shortNames[day]).join(", ");
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 justify-end bg-black/60"
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        <Pressable className="flex-1" onPress={onClose} />

        <View className="bg-background rounded-t-3xl border-t-2 border-primary shadow-2xl overflow-hidden h-[92%]">
          <View className="flex-row items-center p-4 border-b border-gray-100 bg-white relative z-10">
            {currentScreen === "recurrence" && (
              <Pressable
                onPress={() => setCurrentScreen("main")}
                className="absolute left-4 z-20 p-2 flex-row items-center"
              >
                <Ionicons name="chevron-back" size={24} color="#111" />
                <Text className="text-primary font-bold ml-1">Voltar</Text>
              </Pressable>
            )}

            <Text className="font-heading text-xl text-primary flex-1 text-center">
              {currentScreen === "main"
                ? initialTask
                  ? "Editar Tarefa"
                  : "Nova Tarefa"
                : "Repetir"}
            </Text>

            {currentScreen === "main" && (
              <Pressable
                onPress={onClose}
                className="absolute right-4 p-2 bg-gray-100 rounded-full z-20"
              >
                <Ionicons name="close" size={20} color="#111" />
              </Pressable>
            )}
          </View>

          {currentScreen === "main" ? (
            <ScrollView
              className="flex-1"
              contentContainerStyle={{ padding: 24, paddingBottom: 150 }}
              keyboardShouldPersistTaps="handled"
            >
              <TextInput
                autoFocus={!initialTask}
                className="w-full text-3xl font-heading text-primary mb-8 leading-tight"
                placeholder="O que vamos fazer?"
                placeholderTextColor="#ccc"
                value={text}
                onChangeText={setText}
                multiline
              />

              <Pressable
                onPress={() => {
                  Keyboard.dismiss();
                  setCurrentScreen("recurrence");
                }}
                className="flex-row justify-between items-center bg-white p-4 rounded-xl border border-gray-200 mb-6 active:bg-gray-50"
              >
                <Text className="font-body text-lg text-primary">Repetir</Text>
                <View className="flex-row items-center">
                  <Text
                    className="text-muted text-base mr-2 max-w-[150px]"
                    numberOfLines={1}
                  >
                    {getRecurrenceLabel()}
                  </Text>
                  <Ionicons name="chevron-forward" size={20} color="#ccc" />
                </View>
              </Pressable>

              <View className="mb-8">
                <Text className="text-xs font-bold text-muted uppercase mb-3 ml-1">
                  Categoria
                </Text>

                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  className="flex-row mb-4"
                >
                  <Pressable
                    onPress={() => {
                      Haptics.selectionAsync();
                      setSelectedCategory("");
                      setIsCreatingCategory(false);
                    }}
                    className={cn(
                      "mr-2 px-4 py-2 rounded-full border-2",
                      !isCreatingCategory && selectedCategory === ""
                        ? "bg-accent border-primary"
                        : "bg-white border-gray-200"
                    )}
                  >
                    <Text
                      className={cn(
                        "font-bold text-sm",
                        !isCreatingCategory && selectedCategory === ""
                          ? "text-primary"
                          : "text-gray-400"
                      )}
                    >
                      Geral
                    </Text>
                  </Pressable>

                  {categories.map((cat) => (
                    <Pressable
                      key={cat}
                      onPress={() => {
                        Haptics.selectionAsync();
                        setSelectedCategory(cat);
                        setIsCreatingCategory(false);
                      }}
                      className={cn(
                        "mr-2 px-4 py-2 rounded-full border-2",
                        !isCreatingCategory && selectedCategory === cat
                          ? "bg-accent border-primary"
                          : "bg-white border-gray-200"
                      )}
                    >
                      <Text
                        className={cn(
                          "font-bold text-sm",
                          !isCreatingCategory && selectedCategory === cat
                            ? "text-primary"
                            : "text-gray-400"
                        )}
                      >
                        {cat}
                      </Text>
                    </Pressable>
                  ))}

                  <Pressable
                    onPress={() => {
                      Haptics.selectionAsync();
                      setIsCreatingCategory(true);
                    }}
                    className={cn(
                      "mr-2 px-4 py-2 rounded-full border-2 border-dashed",
                      isCreatingCategory
                        ? "bg-accent border-primary"
                        : "border-gray-300 bg-transparent"
                    )}
                  >
                    <Text className="font-bold text-sm text-primary">
                      + Nova
                    </Text>
                  </Pressable>
                </ScrollView>

                {isCreatingCategory && (
                  <View className="flex-row items-center bg-white border-2 border-primary rounded-xl px-4 h-16">
                    <TextInput
                      autoFocus
                      className="flex-1 font-body text-lg text-primary h-full"
                      placeholder="Nome da categoria (ex: Viagem)"
                      value={newCategoryText}
                      onChangeText={setNewCategoryText}
                    />
                  </View>
                )}
              </View>

              <Button
                title={initialTask ? "Atualizar Tarefa" : "Criar Tarefa"}
                onPress={handleSave}
              />
            </ScrollView>
          ) : (
            <ScrollView
              className="flex-1 bg-background"
              contentContainerStyle={{ paddingBottom: 50 }}
            >
              {DAYS_OF_WEEK.map((day) => {
                const isSelected = recurrence.includes(day.id);
                return (
                  <Pressable
                    key={day.id}
                    onPress={() => toggleDay(day.id)}
                    className="flex-row justify-between items-center p-5 border-b border-gray-200 active:bg-gray-50 bg-white"
                  >
                    <Text
                      className={cn(
                        "font-body text-base",
                        isSelected ? "text-primary font-bold" : "text-primary"
                      )}
                    >
                      {day.label}
                    </Text>

                    {isSelected && (
                      <Ionicons
                        name="checkmark"
                        size={24}
                        color="#D1C1F2"
                        style={{
                          textShadowColor: "black",
                          textShadowRadius: 1,
                        }}
                      />
                    )}
                    {isSelected && (
                      <Ionicons
                        name="checkmark"
                        size={24}
                        color="#111"
                        style={{ position: "absolute", right: 20 }}
                      />
                    )}
                  </Pressable>
                );
              })}
            </ScrollView>
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
