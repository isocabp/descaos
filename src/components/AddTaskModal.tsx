// src/components/AddTaskModal.tsx
import {
  Modal,
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from "react-native";
import { useState } from "react";
import { Button } from "./Button";
import { cn } from "../lib/utils";

interface AddTaskModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (text: string) => void;
}

export function AddTaskModal({ visible, onClose, onAdd }: AddTaskModalProps) {
  const [text, setText] = useState("");

  const handleAdd = () => {
    if (!text.trim()) return;
    onAdd(text);
    setText("");
    onClose();
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
        className="flex-1 justify-end bg-black/50"
      >
        <Pressable className="flex-1" onPress={onClose} />

        <View className="bg-background p-6 rounded-t-3xl border-t-2 border-primary shadow-2xl">
          <View className="flex-row justify-between items-center mb-6">
            <Text className="font-heading text-2xl text-primary">
              Nova Tarefa
            </Text>
            <Pressable onPress={onClose}>
              <Text className="text-primary font-bold text-lg">X</Text>
            </Pressable>
          </View>

          <TextInput
            autoFocus
            className="w-full p-4 border-2 border-primary rounded-xl font-body text-lg bg-white mb-6"
            placeholder="O que vamos fazer?"
            placeholderTextColor="#9CA3AF"
            value={text}
            onChangeText={setText}
            onSubmitEditing={handleAdd}
          />

          <Button title="Criar Tarefa" onPress={handleAdd} />
          {/* Espaço extra para o teclado no iOS */}
          <View className="h-8" />
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
