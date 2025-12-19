// app/index.tsx
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AddTaskModal } from "../src/components/AddTaskModal";
import { Button } from "../src/components/Button";
import { FocusCard } from "../src/components/FocusCard";
import { TaskItem } from "../src/components/TaskItem";
import { Toggle } from "../src/components/Toggle";
import { useTasks } from "../src/store/useTasks";

export default function Home() {
  const [isModalVisible, setModalVisible] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);

  const { tasks, toggleTask, addTask } = useTasks();

  const pendingTasks = tasks.filter((t) => !t.isCompleted);
  const activeTasksCount = pendingTasks.length;

  const currentFocusTask = pendingTasks[0];

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <StatusBar style="dark" />

      <View className="flex-1 p-6">
        {/* Header atualizado com a contagem de volta */}
        <View className="mb-4 mt-2">
          <Text className="font-heading text-5xl text-primary">Hoje</Text>

          {/* AQUI ESTÁ ELA DE VOLTA: */}
          <Text className="font-body text-muted text-lg mb-6">
            {activeTasksCount}{" "}
            {activeTasksCount === 1 ? "tarefa pendente" : "tarefas pendentes"}
          </Text>

          {/* Toggle do Modo Foco */}
          {activeTasksCount > 0 && (
            <Toggle
              label="Modo Foco Unico"
              value={isFocusMode}
              onValueChange={setIsFocusMode}
            />
          )}
        </View>

        {isFocusMode && currentFocusTask ? (
          <FocusCard
            task={currentFocusTask}
            onComplete={() => toggleTask(currentFocusTask.id)}
            onSkip={() => alert("Em breve: pular tarefa!")}
          />
        ) : (
          <>
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
              {tasks.length === 0 ? (
                <View className="mt-20 items-center opacity-50">
                  <Text className="font-heading text-6xl mb-2">🎈</Text>
                  <Text className="font-body text-lg text-center">
                    Tudo limpo!
                  </Text>
                </View>
              ) : (
                tasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    label={task.text}
                    isCompleted={task.isCompleted}
                    onToggle={() => toggleTask(task.id)}
                  />
                ))
              )}
              <View className="h-24" />
            </ScrollView>

            <View className="absolute bottom-4 left-6 right-6">
              <Button
                title="Nova Tarefa +"
                onPress={() => setModalVisible(true)}
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 4, height: 4 },
                  shadowOpacity: 1,
                  shadowRadius: 0,
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
