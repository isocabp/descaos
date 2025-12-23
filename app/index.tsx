import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AddTaskModal } from "../src/components/AddTaskModal";
import { Button } from "../src/components/Button";
import { FocusCard } from "../src/components/FocusCard";
import { TaskItem } from "../src/components/TaskItem";
import { Toggle } from "../src/components/Toggle";
import { cn } from "../src/lib/utils";
import { Task, useTasks } from "../src/store/useTasks";

export default function Home() {
  const [isModalVisible, setModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string>("Todos");

  const {
    tasks,
    categories,
    toggleTask,
    addTask,
    updateTask,
    removeTask,
    clearAllTasks,
    checkDailyReset,
  } = useTasks();

  useEffect(() => {
    checkDailyReset();
  }, []);

  const dynamicFilters = ["Todos", ...categories];

  const visibleTasks = tasks.filter((t) => {
    if (selectedFilter === "Todos") return true;
    return t.category === selectedFilter;
  });

  const pendingVisibleTasks = visibleTasks.filter((t) => !t.isCompleted);
  const activeTasksCount = pendingVisibleTasks.length;
  const currentFocusTask = pendingVisibleTasks[0];

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

  const openModal = (task?: Task) => {
    if (task) {
      setEditingTask(task);
    } else {
      setEditingTask(null);
    }
    setModalVisible(true);
  };

  const handleSaveTask = (text: string, category: string, recurrence: any) => {
    if (editingTask) {
      updateTask(editingTask.id, { text, category, recurrence });
    } else {
      addTask(text, category, recurrence);
    }
  };

  const containerClass =
    isFocusMode && currentFocusTask ? "bg-primary" : "bg-background";
  const textPrimaryClass =
    isFocusMode && currentFocusTask ? "text-white" : "text-primary";
  const textMutedClass =
    isFocusMode && currentFocusTask ? "text-white/60" : "text-muted";

  return (
    <SafeAreaView
      className={`flex-1 ${containerClass} transition-colors duration-500`}
      edges={["top"]}
    >
      <StatusBar style={isFocusMode && currentFocusTask ? "light" : "dark"} />

      <View className="flex-1">
        <View className="mb-4 mt-4 px-6">
          <View className="flex-row justify-between items-center">
            <Text className={`font-heading text-5xl ${textPrimaryClass}`}>
              Hoje
            </Text>

            {!isFocusMode && tasks.length > 0 && (
              <Pressable
                onPress={handleClearAll}
                className="p-2 bg-red-100 rounded-full"
              >
                <Ionicons name="trash-bin-outline" size={20} color="#FF4D4D" />
              </Pressable>
            )}
          </View>

          <Text className={`font-body text-lg mb-4 ${textMutedClass}`}>
            {activeTasksCount}{" "}
            {activeTasksCount === 1 ? "tarefa pendente" : "tarefas pendentes"}
          </Text>

          {!isFocusMode && (
            <View className="mb-6">
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 0 }}
                className="-mx-6"
              >
                <View className="px-6 flex-row">
                  {dynamicFilters.map((filter) => (
                    <Pressable
                      key={filter}
                      onPress={() => handleFilterChange(filter)}
                      className={cn(
                        "mr-3 px-4 py-2 rounded-full border-2 transition-all",
                        selectedFilter === filter
                          ? "bg-accent border-primary"
                          : "bg-transparent border-gray-300"
                      )}
                    >
                      <Text
                        className={cn(
                          "font-bold",
                          selectedFilter === filter
                            ? "text-primary"
                            : "text-gray-400"
                        )}
                      >
                        {filter}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </ScrollView>
            </View>
          )}

          {activeTasksCount > 0 && (
            <Toggle
              label="Modo Foco"
              value={isFocusMode}
              onValueChange={setIsFocusMode}
            />
          )}
        </View>

        {isFocusMode && currentFocusTask ? (
          <View className="px-6 flex-1 justify-center">
            <FocusCard
              task={currentFocusTask}
              onComplete={() => toggleTask(currentFocusTask.id)}
              onSkip={() => {}}
            />
            <Pressable
              onPress={() => setIsFocusMode(false)}
              className="mt-10 self-center"
            >
              <Text className="text-white/50 font-bold uppercase text-xs tracking-widest">
                Sair do Foco
              </Text>
            </Pressable>
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
                    {selectedFilter === "Todos" ? "✨" : "🔍"}
                  </Text>
                  <Text className="font-body text-lg text-center text-primary">
                    {selectedFilter === "Todos"
                      ? "Tudo limpo!"
                      : `Nada em ${selectedFilter}.`}
                  </Text>
                </View>
              ) : (
                visibleTasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    label={task.text}
                    category={task.category}
                    recurrence={task.recurrence}
                    isCompleted={task.isCompleted}
                    onToggle={() => toggleTask(task.id)}
                    onDelete={() => removeTask(task.id)}
                    onPress={() => openModal(task)}
                  />
                ))
              )}
            </ScrollView>

            <View className="absolute bottom-4 left-6 right-6">
              <Button
                title="Nova Tarefa +"
                onPress={() => openModal()}
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
          onSave={handleSaveTask}
          initialTask={editingTask}
        />
      </View>
    </SafeAreaView>
  );
}
