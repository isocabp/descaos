import { Ionicons } from "@expo/vector-icons";
import { useEffect, useMemo, useCallback, useState } from "react";
import {
  Alert,
  AppState,
  FlatList,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { AddTaskModal } from "@/src/components/AddTaskModal";
import { Button } from "@/src/components/Button";
import { FocusCard } from "@/src/components/FocusCard";
import { TaskItem } from "@/src/components/TaskItem";
import { cn } from "@/src/lib/utils";
import { useTasks } from "@/src/store/useTasks";

type TaskId = string;

export default function HomeScreen() {
  const insets = useSafeAreaInsets();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("Todos");
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [focusTaskId, setFocusTaskId] = useState<TaskId | null>(null);

  const {
    tasks,
    categories,
    toggleTask,
    addTask,
    removeTask,
    clearAllTasks,
    checkDailyReset,
  } = useTasks();

  useEffect(() => {
    checkDailyReset();
  }, [checkDailyReset]);

  useEffect(() => {
    const sub = AppState.addEventListener("change", (state) => {
      if (state === "active") checkDailyReset();
    });

    return () => sub.remove();
  }, [checkDailyReset]);

  const filters = useMemo(() => ["Todos", ...categories], [categories]);

  const pendingTasks = useMemo(
    () => tasks.filter((t) => !t.isCompleted),
    [tasks]
  );

  const visibleTasks = useMemo(() => {
    if (selectedFilter === "Todos") return tasks;
    return tasks.filter((t) => t.category === selectedFilter);
  }, [tasks, selectedFilter]);

  const tasksForFocus = useMemo(() => {
    if (selectedFilter === "Todos") return pendingTasks;
    return pendingTasks.filter((t) => t.category === selectedFilter);
  }, [pendingTasks, selectedFilter]);

  const currentFocusTask = useMemo(() => {
    if (tasksForFocus.length === 0) return null;
    if (!focusTaskId) return tasksForFocus[0];
    return tasksForFocus.find((t) => t.id === focusTaskId) ?? tasksForFocus[0];
  }, [tasksForFocus, focusTaskId]);

  useEffect(() => {
    if (!isFocusMode) return;
    if (tasksForFocus.length === 0) {
      setFocusTaskId(null);
      setIsFocusMode(false);
      return;
    }

    if (focusTaskId && tasksForFocus.some((t) => t.id === focusTaskId)) return;
    setFocusTaskId(tasksForFocus[0].id);
  }, [isFocusMode, tasksForFocus, focusTaskId]);

  const activeTasksCount = pendingTasks.length;

  const handleFilterChange = useCallback((filter: string) => {
    setSelectedFilter(filter);
    setFocusTaskId(null);
  }, []);

  const handleClearAll = useCallback(() => {
    Alert.alert("Apagar tudo?", "Isso vai excluir todas as tarefas.", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Apagar",
        style: "destructive",
        onPress: () => {
          setFocusTaskId(null);
          setIsFocusMode(false);
          clearAllTasks();
        },
      },
    ]);
  }, [clearAllTasks]);

  const handleSkipFocus = useCallback(() => {
    if (!currentFocusTask) return;
    if (tasksForFocus.length <= 1) return;

    const currentIndex = tasksForFocus.findIndex(
      (t) => t.id === currentFocusTask.id
    );
    const nextIndex = (currentIndex + 1) % tasksForFocus.length;
    setFocusTaskId(tasksForFocus[nextIndex].id);
  }, [tasksForFocus, currentFocusTask]);

  const headerSubtitle = useMemo(() => {
    if (activeTasksCount === 0) return "Tudo limpo por hoje.";
    if (activeTasksCount === 1) return "1 tarefa pendente";
    return `${activeTasksCount} tarefas pendentes`;
  }, [activeTasksCount]);

  const listBottomPadding = Math.max(24, insets.bottom + 96);

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <View className="px-6 pt-4 pb-2">
        <View className="flex-row items-center justify-between">
          <Text className="font-heading text-5xl text-primary">Hoje</Text>

          {tasks.length > 0 && (
            <Pressable
              onPress={handleClearAll}
              accessibilityRole="button"
              className="h-10 w-10 items-center justify-center rounded-2xl bg-surface"
            >
              <Ionicons name="trash-outline" size={18} color="#111111" />
            </Pressable>
          )}
        </View>

        <Text className="font-body text-muted text-lg mb-4">
          {headerSubtitle}
        </Text>

        <View className="mb-6">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingRight: 24 }}
          >
            {filters.map((filter) => (
              <Pressable
                key={filter}
                onPress={() => handleFilterChange(filter)}
                accessibilityRole="button"
                accessibilityState={{ selected: selectedFilter === filter }}
                className={cn(
                  "mr-3 px-4 py-2 rounded-full",
                  selectedFilter === filter ? "bg-accent" : "bg-surface"
                )}
              >
                <Text className="font-bold text-primary">{filter}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {tasksForFocus.length > 0 && (
          <FocusCard
            isFocusMode={isFocusMode}
            onToggleFocus={() => setIsFocusMode((v) => !v)}
            currentTask={currentFocusTask}
            onSkip={handleSkipFocus}
          />
        )}
      </View>

      <FlatList
        data={visibleTasks}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingBottom: listBottomPadding,
        }}
        renderItem={({ item }) => (
          <TaskItem
            task={item}
            isFocusMode={isFocusMode}
            isCurrentFocus={currentFocusTask?.id === item.id}
            onToggle={() => toggleTask(item.id)}
            onDelete={() => removeTask(item.id)}
            onFocus={() => {
              setIsFocusMode(true);
              setFocusTaskId(item.id);
            }}
          />
        )}
        ListEmptyComponent={
          <View className="mt-12 items-center">
            <Text className="font-body text-muted text-lg text-center">
              Nenhuma tarefa aqui ainda.
            </Text>
            <Text className="font-body text-muted text-base text-center mt-1">
              Toque em “Nova tarefa” para começar.
            </Text>
          </View>
        }
      />

      <View
        className="px-6"
        style={{
          paddingBottom: Math.max(16, insets.bottom + 12),
        }}
      >
        <Button onPress={() => setIsModalVisible(true)}>Nova tarefa</Button>
      </View>

      <AddTaskModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        categories={categories}
        onAddTask={(text, category, recurrence) =>
          addTask(text, category, recurrence)
        }
      />
    </SafeAreaView>
  );
}
