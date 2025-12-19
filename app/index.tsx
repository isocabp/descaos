// app/index.tsx
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react"; // ADICIONEI useEffect
import { Alert, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AddTaskModal } from "../src/components/AddTaskModal";
import { Button } from "../src/components/Button";
import { FocusCard } from "../src/components/FocusCard";
import { TaskItem } from "../src/components/TaskItem";
import { Toggle } from "../src/components/Toggle";
import { cn } from "../src/lib/utils";
import { useTasks } from "../src/store/useTasks";

export default function Home() {
  const [isModalVisible, setModalVisible] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string>("Todos");

  // Adicione checkDailyReset aqui na desestruturação
  const {
    tasks,
    categories,
    toggleTask,
    addTask,
    removeTask,
    clearAllTasks,
    checkDailyReset,
  } = useTasks();

  // EFEITO MÁGICO: Roda ao montar a tela
  useEffect(() => {
    checkDailyReset();
  }, []);

  const dynamicFilters = ["Todos", ...categories];

  const pendingTasks = tasks.filter((t) => !t.isCompleted);

  const visibleTasks = tasks.filter((t) => {
    if (selectedFilter === "Todos") return true;
    return t.category === selectedFilter;
  });

  const activeTasksCount = pendingTasks.length;

  const tasksForFocus =
    selectedFilter === "Todos"
      ? pendingTasks
      : pendingTasks.filter((t) => t.category === selectedFilter);

  const currentFocusTask = tasksForFocus[0];

  const handleFilterChange = (filter: string) => {
    Haptics.selectionAsync();
    setSelectedFilter(filter);
  };

  const handleClearAll = () => {
    Alert.alert("Apagar Tudo?", "Isso vai excluir todas as tarefas.", [
      { text: "Cancelar", style: "cancel" },
      { text: "Apagar", style: "destructive", onPress: () => clearAllTasks() },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <StatusBar style="dark" />

      <View className="flex-1">
        <View className="mb-4 mt-4 px-6">
          <View className="flex-row justify-between items-center">
            <Text className="font-heading text-5xl text-primary">Hoje</Text>
            {tasks.length > 0 && (
              <Pressable
                onPress={handleClearAll}
                className="p-2 bg-red-100 rounded-full"
              >
                <Ionicons name="trash-bin-outline" size={20} color="#FF4D4D" />
              </Pressable>
            )}
          </View>

          <Text className="font-body text-muted text-lg mb-4">
            {activeTasksCount}{" "}
            {activeTasksCount === 1 ? "tarefa pendente" : "tarefas pendentes"}
          </Text>

          <View className="mb-6">
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 24 }}
            >
              {dynamicFilters.map((filter) => (
                <Pressable
                  key={filter}
                  onPress={() => handleFilterChange(filter)}
                  className={cn(
                    "mr-3 px-4 py-2 rounded-full border-2 transition-all",
                    selectedFilter === filter
                      ? "bg-primary border-primary"
                      : "bg-transparent border-gray-300"
                  )}
                >
                  <Text
                    className={cn(
                      "font-bold",
                      selectedFilter === filter
                        ? "text-accent"
                        : "text-gray-400"
                    )}
                  >
                    {filter}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>

          {activeTasksCount > 0 && (
            <Toggle
              label="Modo Foco Unico"
              value={isFocusMode}
              onValueChange={setIsFocusMode}
            />
          )}
        </View>

        {isFocusMode && currentFocusTask ? (
          <View className="px-6 flex-1">
            <FocusCard
              task={currentFocusTask}
              onComplete={() => toggleTask(currentFocusTask.id)}
              onSkip={() => alert("Em breve: pular tarefa!")}
            />
          </View>
        ) : (
          <>
            <ScrollView
              className="flex-1"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                paddingHorizontal: 24,
                paddingBottom: 100,
              }}
            >
              {visibleTasks.length === 0 ? (
                <View className="mt-20 items-center opacity-50">
                  <Text className="font-heading text-6xl mb-2">
                    {selectedFilter === "Todos" ? "🎈" : "🔍"}
                  </Text>
                  <Text className="font-body text-lg text-center">
                    {selectedFilter === "Todos"
                      ? "Tudo limpo por hoje!"
                      : `Nenhuma tarefa de ${selectedFilter}.`}
                  </Text>
                </View>
              ) : (
                visibleTasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    label={task.text}
                    category={task.category}
                    recurrence={task.recurrence} // Passando recorrência
                    isCompleted={task.isCompleted}
                    onToggle={() => toggleTask(task.id)}
                    onDelete={() => removeTask(task.id)}
                  />
                ))
              )}
            </ScrollView>

            <View className="absolute bottom-4 left-6 right-6">
              <Button
                title="Nova Tarefa +"
                onPress={() => setModalVisible(true)}
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 4, height: 4 },
                  shadowOpacity: 1,
                  elevation: 5,
                }}
              />
            </View>
          </>
        )}

        <AddTaskModal
          visible={isModalVisible}
          onClose={() => setModalVisible(false)}
          onAdd={addTask}
        />
      </View>
    </SafeAreaView>
  );
}
