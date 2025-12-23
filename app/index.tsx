import { useState, useEffect, useCallback } from "react";
import { View, Text, ScrollView, Pressable, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Button } from "../src/components/Button";
import { TaskItem } from "../src/components/TaskItem";
import { AddTaskModal } from "../src/components/AddTaskModal";
import { FocusCard } from "../src/components/FocusCard";
import { Toggle } from "../src/components/Toggle";
import { useTasks, Task } from "../src/store/useTasks";
import { cn } from "../src/lib/utils";
import * as Haptics from "expo-haptics";
import { Ionicons } from "@expo/vector-icons";
import { registerForPushNotificationsAsync } from "../src/lib/notifications";
import DraggableFlatList, {
  ScaleDecorator,
  RenderItemParams,
} from "react-native-draggable-flatlist";

export default function Home() {
  const [isModalVisible, setModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string>("Todos");

  const {
    tasks,
    categories,
    toggleTask,
    removeTask,
    clearAllTasks,
    checkDailyReset,
    setTasks,
    sortTasksByPriority,
  } = useTasks();

  useEffect(() => {
    checkDailyReset();
    registerForPushNotificationsAsync();
    // Ordena por prioridade ao abrir o app
    sortTasksByPriority();
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

  const handleSortPress = () => {
    Alert.alert(
      "Ordenar Tarefas",
      "Deseja reorganizar a lista por prioridade (Alta > Média > Baixa)?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Ordenar",
          onPress: () => sortTasksByPriority(),
        },
      ]
    );
  };

  // Lógica inteligente para Drag & Drop com filtros
  const handleDragEnd = ({ data }: { data: Task[] }) => {
    if (selectedFilter === "Todos") {
      setTasks(data);
    } else {
      // Se estiver filtrado, precisamos mesclar a nova ordem com as tarefas ocultas
      const newTasks = [...tasks];
      let dataIndex = 0;

      // Percorre a lista original e substitui apenas os itens da categoria atual pela nova ordem
      for (let i = 0; i < newTasks.length; i++) {
        if (newTasks[i].category === selectedFilter) {
          if (data[dataIndex]) {
            newTasks[i] = data[dataIndex];
            dataIndex++;
          }
        }
      }
      setTasks(newTasks);
    }
  };

  const renderItem = useCallback(
    ({ item, drag, isActive }: RenderItemParams<Task>) => {
      return (
        <ScaleDecorator>
          <TaskItem
            label={item.text}
            category={item.category}
            recurrence={item.recurrence}
            priority={item.priority}
            reminderTime={item.reminderTime}
            isCompleted={item.isCompleted}
            onToggle={() => toggleTask(item.id)}
            onDelete={() => removeTask(item.id)}
            onPress={() => {
              setEditingTask(item);
              setModalVisible(true);
            }}
            drag={drag}
            isActive={isActive}
          />
        </ScaleDecorator>
      );
    },
    []
  );

  const containerClass =
    isFocusMode && currentFocusTask ? "bg-primary" : "bg-background";
  const textPrimaryClass =
    isFocusMode && currentFocusTask ? "text-white" : "text-primary";
  const textMutedClass =
    isFocusMode && currentFocusTask ? "text-white/60" : "text-muted";

  return (
    <SafeAreaView className={`flex-1 ${containerClass}`} edges={["top"]}>
      <StatusBar style={isFocusMode && currentFocusTask ? "light" : "dark"} />

      <View className="flex-1">
        <View className="mb-4 mt-4 px-6">
          <View className="flex-row justify-between items-center">
            <Text className={`font-heading text-5xl ${textPrimaryClass}`}>
              Hoje
            </Text>

            <View className="flex-row gap-2">
              {/* Botão de Ordenar por Prioridade */}
              {!isFocusMode && tasks.length > 1 && (
                <Pressable
                  onPress={handleSortPress}
                  className="p-2 bg-gray-100 rounded-full"
                >
                  <Ionicons name="filter" size={20} color="#111" />
                </Pressable>
              )}

              {/* Botão de Apagar Tudo */}
              {!isFocusMode && tasks.length > 0 && (
                <Pressable
                  onPress={handleClearAll}
                  className="p-2 bg-red-100 rounded-full"
                >
                  <Ionicons
                    name="trash-bin-outline"
                    size={20}
                    color="#FF4D4D"
                  />
                </Pressable>
              )}
            </View>
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
                className="-mx-6"
                contentContainerStyle={{ paddingHorizontal: 24 }}
              >
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
            <DraggableFlatList
              data={visibleTasks}
              onDragEnd={handleDragEnd}
              keyExtractor={(item) => item.id}
              renderItem={renderItem}
              contentContainerStyle={{
                paddingHorizontal: 24,
                paddingBottom: 100,
              }}
              showsVerticalScrollIndicator={false}
            />
            <View className="absolute bottom-4 left-6 right-6">
              <Button
                title="Nova Tarefa +"
                onPress={() => {
                  setEditingTask(null);
                  setModalVisible(true);
                }}
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
          initialTask={editingTask}
        />
      </View>
    </SafeAreaView>
  );
}
