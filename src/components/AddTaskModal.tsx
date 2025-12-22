import { useEffect, useMemo, useState } from "react";
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
import { Button } from "@/src/components/Button";
import { Toggle } from "@/src/components/Toggle";
import { cn } from "@/src/lib/utils";
import { type RecurrenceType } from "@/src/store/useTasks";

type Props = {
  visible: boolean;
  onClose: () => void;
  categories: string[];
  onAddTask: (
    text: string,
    category: string,
    recurrence: RecurrenceType
  ) => void;
};

const MAX_TEXT = 80;
const MAX_CATEGORY = 30;

export function AddTaskModal({
  visible,
  onClose,
  categories,
  onAddTask,
}: Props) {
  const [text, setText] = useState("");
  const [category, setCategory] = useState("");
  const [useExistingCategory, setUseExistingCategory] = useState(true);
  const [selectedExistingCategory, setSelectedExistingCategory] =
    useState<string>(categories[0] ?? "Geral");
  const [recurrence, setRecurrence] = useState<RecurrenceType>("none");

  useEffect(() => {
    if (!visible) return;
    setSelectedExistingCategory(categories[0] ?? "Geral");
  }, [visible, categories]);

  const finalCategory = useMemo(() => {
    if (useExistingCategory) return selectedExistingCategory;
    return category.trim();
  }, [useExistingCategory, selectedExistingCategory, category]);

  const isValid = useMemo(() => {
    const trimmedText = text.trim();
    if (!trimmedText) return false;
    if (!finalCategory) return false;
    return true;
  }, [text, finalCategory]);

  const handleClose = () => {
    onClose();
    setText("");
    setCategory("");
    setUseExistingCategory(true);
    setRecurrence("none");
  };

  const handleCreate = () => {
    if (!isValid) return;
    onAddTask(text.trim(), finalCategory, recurrence);
    handleClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={handleClose}
    >
      <Pressable className="flex-1 bg-black/50" onPress={handleClose} />

      <KeyboardAvoidingView
        behavior={Platform.select({ ios: "padding", android: undefined })}
        className="absolute left-0 right-0 bottom-0"
      >
        <View className="bg-surface rounded-t-3xl px-6 pt-6 pb-8">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="font-heading text-3xl text-primary">
              Nova tarefa
            </Text>
            <Pressable
              onPress={handleClose}
              accessibilityRole="button"
              className="h-10 w-10 items-center justify-center rounded-2xl bg-background"
            >
              <Text className="text-primary text-lg">✕</Text>
            </Pressable>
          </View>

          <Text className="font-bold text-primary mb-2">Descrição</Text>
          <View className="bg-background rounded-2xl px-4 py-3">
            <TextInput
              value={text}
              onChangeText={(v) => setText(v.slice(0, MAX_TEXT))}
              placeholder="Ex: Enviar relatório"
              placeholderTextColor="#9CA3AF"
              className="text-primary font-body text-base"
              maxLength={MAX_TEXT}
              returnKeyType="done"
            />
            <Text className="text-muted text-xs mt-2 text-right">
              {text.length}/{MAX_TEXT}
            </Text>
          </View>

          <View className="mt-6">
            <Text className="font-bold text-primary mb-2">Categoria</Text>

            <View className="flex-row gap-3 mb-3">
              <Pressable
                onPress={() => setUseExistingCategory(true)}
                accessibilityRole="button"
                accessibilityState={{ selected: useExistingCategory }}
                className={cn(
                  "flex-1 rounded-2xl px-4 py-3 items-center",
                  useExistingCategory ? "bg-accent" : "bg-background"
                )}
              >
                <Text className="font-bold text-primary">Existente</Text>
              </Pressable>

              <Pressable
                onPress={() => setUseExistingCategory(false)}
                accessibilityRole="button"
                accessibilityState={{ selected: !useExistingCategory }}
                className={cn(
                  "flex-1 rounded-2xl px-4 py-3 items-center",
                  !useExistingCategory ? "bg-accent" : "bg-background"
                )}
              >
                <Text className="font-bold text-primary">Nova</Text>
              </Pressable>
            </View>

            {useExistingCategory ? (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingRight: 24 }}
              >
                {categories.map((c) => {
                  const active = c === selectedExistingCategory;
                  return (
                    <Pressable
                      key={c}
                      onPress={() => setSelectedExistingCategory(c)}
                      accessibilityRole="button"
                      accessibilityState={{ selected: active }}
                      className={cn(
                        "mr-3 rounded-full px-4 py-2",
                        active ? "bg-accent" : "bg-background"
                      )}
                    >
                      <Text className="font-bold text-primary">{c}</Text>
                    </Pressable>
                  );
                })}
              </ScrollView>
            ) : (
              <View className="bg-background rounded-2xl px-4 py-3">
                <TextInput
                  value={category}
                  onChangeText={(v) => setCategory(v.slice(0, MAX_CATEGORY))}
                  placeholder="Ex: Trabalho"
                  placeholderTextColor="#9CA3AF"
                  className="text-primary font-body text-base"
                  maxLength={MAX_CATEGORY}
                  returnKeyType="done"
                />
                <Text className="text-muted text-xs mt-2 text-right">
                  {category.length}/{MAX_CATEGORY}
                </Text>
              </View>
            )}
          </View>

          <View className="mt-6">
            <Text className="font-bold text-primary mb-3">Recorrência</Text>

            <View className="gap-3">
              <Toggle
                label="Sem recorrência"
                active={recurrence === "none"}
                onPress={() => setRecurrence("none")}
              />
              <Toggle
                label="Diária"
                active={recurrence === "daily"}
                onPress={() => setRecurrence("daily")}
              />
              <Toggle
                label="Seg–Sex"
                active={recurrence === "mon-fri"}
                onPress={() => setRecurrence("mon-fri")}
              />
            </View>
          </View>

          <View className="mt-8">
            <Button onPress={handleCreate} disabled={!isValid}>
              Criar tarefa
            </Button>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
