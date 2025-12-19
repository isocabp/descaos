// src/store/useTasks.ts
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { zustandStorage } from "../lib/storage"; // Nosso wrapper do MMKV
import * as Haptics from "expo-haptics";

export interface Task {
  id: string;
  text: string;
  isCompleted: boolean;
  createdAt: number;
}

interface TasksState {
  tasks: Task[];
  addTask: (text: string) => void;
  toggleTask: (id: string) => void;
  removeTask: (id: string) => void;
}

export const useTasks = create<TasksState>()(
  persist(
    (set) => ({
      tasks: [],

      addTask: (text: string) => {
        set((state) => ({
          tasks: [
            {
              id: Date.now().toString(), // ID simples baseado em tempo
              text,
              isCompleted: false,
              createdAt: Date.now(),
            },
            ...state.tasks, // Adiciona no topo
          ],
        }));
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      },

      toggleTask: (id: string) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, isCompleted: !task.isCompleted } : task
          ),
        }));
        // O Haptics já está no componente visual, então não duplicamos aqui
      },

      removeTask: (id: string) => {
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        }));
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      },
    }),
    {
      name: "tasks-storage", // Nome da chave no banco
      storage: createJSONStorage(() => zustandStorage), // Usa nosso MMKV
    }
  )
);
