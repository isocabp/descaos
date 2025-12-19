// src/components/AddTaskModal.tsx
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useState } from "react";
import {
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
import { RecurrenceType, useTasks } from "../store/useTasks";
import { Button } from "./Button";

interface AddTaskModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (text: string, category: string, recurrence: RecurrenceType) => void;
}

export function AddTaskModal({ visible, onClose, onAdd }: AddTaskModalProps) {
  const [text, setText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Geral");
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [newCategoryText, setNewCategoryText] = useState("");

  // Novo estado para recorrência
  const [recurrence, setRecurrence] = useState<RecurrenceType>("none");

  const { categories } = useTasks();

  const handleAdd = () => {
    if (!text.trim()) return;

    const finalCategory =
      isCreatingCategory && newCategoryText.trim()
        ? newCategoryText.trim()
        : selectedCategory;

    // Passamos a recorrência aqui
    onAdd(text, finalCategory, recurrence);

    // Resets
    setText("");
    setNewCategoryText("");
    setIsCreatingCategory(false);
    setSelectedCategory("Geral");
    setRecurrence("none");
    onClose();
  };

  const RecurrenceOption = ({
    type,
    label,
    icon,
  }: {
    type: RecurrenceType;
    label: string;
    icon: any;
  }) => (
    <Pressable
      onPress={() => {
        Haptics.selectionAsync();
        setRecurrence(type);
      }}
      className={cn(
        "flex-1 mr-2 p-3 rounded-xl border-2 flex-row items-center justify-center",
        recurrence === type
          ? "bg-primary border-primary"
          : "bg-white border-gray-200"
      )}
    >
      <Ionicons
        name={icon}
        size={18}
        color={recurrence === type ? "#BDFF00" : "#111"}
      />
      <Text
        className={cn(
          "ml-2 font-bold text-xs",
          recurrence === type ? "text-accent" : "text-primary"
        )}
      >
        {label}
      </Text>
    </Pressable>
  );

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 justify-end bg-black/50"
      >
        <Pressable className="flex-1" onPress={onClose} />

        <View className="bg-background rounded-t-3xl border-t-2 border-primary shadow-2xl h-auto max-h-[85%]">
          <View className="p-6 pb-2 flex-row justify-between items-center border-b border-gray-100">
            <Text className="font-heading text-2xl text-primary">
              Nova Tarefa
            </Text>
            <Pressable onPress={onClose} className="p-2">
              <Text className="text-primary font-bold text-lg">✕</Text>
            </Pressable>
          </View>

          <ScrollView contentContainerStyle={{ padding: 24 }}>
            <TextInput
              autoFocus={!isCreatingCategory}
              className="w-full p-4 border-2 border-primary rounded-xl font-body text-lg bg-white mb-6 min-h-[80px]"
              placeholder="Ex: Tomar vitaminas..."
              placeholderTextColor="#9CA3AF"
              value={text}
              onChangeText={setText}
              multiline
              textAlignVertical="top"
            />

            {/* Seletor de Recorrência */}
            <View className="mb-6">
              <Text className="font-heading text-sm text-muted mb-3 uppercase">
                Repetir
              </Text>
              <View className="flex-row">
                <RecurrenceOption
                  type="none"
                  label="Nunca"
                  icon="ban-outline"
                />
                <RecurrenceOption
                  type="daily"
                  label="Todo Dia"
                  icon="sync-outline"
                />
                <RecurrenceOption
                  type="mon-fri"
                  label="Seg-Sex"
                  icon="briefcase-outline"
                />
              </View>
            </View>

            {/* Seletor de Categoria */}
            <View className="mb-8">
              <Text className="font-heading text-sm text-muted mb-3 uppercase">
                Categoria
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="flex-row"
              >
                {categories.map((cat) => (
                  <Pressable
                    key={cat}
                    onPress={() => {
                      Haptics.selectionAsync();
                      setSelectedCategory(cat);
                      setIsCreatingCategory(false);
                    }}
                    className={cn(
                      "mr-3 px-4 py-2 rounded-full border-2 border-primary",
                      !isCreatingCategory && selectedCategory === cat
                        ? "bg-accent"
                        : "bg-white"
                    )}
                  >
                    <Text className="font-bold text-primary">{cat}</Text>
                  </Pressable>
                ))}

                <Pressable
                  onPress={() => {
                    Haptics.selectionAsync();
                    setIsCreatingCategory(true);
                  }}
                  className={cn(
                    "mr-3 px-4 py-2 rounded-full border-2 border-dashed border-primary",
                    isCreatingCategory ? "bg-accent" : "bg-transparent"
                  )}
                >
                  <Text className="font-bold text-primary">+ Nova</Text>
                </Pressable>
              </ScrollView>

              {isCreatingCategory && (
                <TextInput
                  autoFocus
                  className="mt-4 w-full p-3 border-b-2 border-primary font-body text-base"
                  placeholder="Nome da categoria (ex: Viagem)"
                  value={newCategoryText}
                  onChangeText={setNewCategoryText}
                />
              )}
            </View>

            <Button title="Criar Tarefa" onPress={handleAdd} />
            <View className="h-10" />
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
