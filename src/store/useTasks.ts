// src/store/useTasks.ts
import * as Haptics from "expo-haptics";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { zustandStorage } from "../lib/storage";

// Tipos de recorrência
export type RecurrenceType = "none" | "daily" | "mon-fri";

export interface Task {
  id: string;
  text: string;
  category: string;
  isCompleted: boolean;
  recurrence: RecurrenceType; // Novo campo
  lastCompletedDate?: string; // Para saber quando foi feita
  createdAt: number;
}

interface TasksState {
  tasks: Task[];
  categories: string[];
  addTask: (text: string, category: string, recurrence: RecurrenceType) => void;
  toggleTask: (id: string) => void;
  removeTask: (id: string) => void;
  clearAllTasks: () => void;
  checkDailyReset: () => void; // A função que roda ao abrir o app
}

export const useTasks = create<TasksState>()(
  persist(
    (set, get) => ({
      tasks: [],
      categories: ["Geral"],

      addTask: (text: string, category: string, recurrence: RecurrenceType) => {
        set((state) => {
          const newCategories = state.categories.includes(category)
            ? state.categories
            : [...state.categories, category];

          return {
            categories: newCategories,
            tasks: [
              {
                id: Date.now().toString(),
                text,
                category,
                recurrence, // Salvando a frequencia
                isCompleted: false,
                createdAt: Date.now(),
              },
              ...state.tasks,
            ],
          };
        });
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      },

      toggleTask: (id: string) => {
        set((state) => ({
          tasks: state.tasks.map((task) => {
            if (task.id === id) {
              const isNowCompleted = !task.isCompleted;
              return {
                ...task,
                isCompleted: isNowCompleted,
                // Salva a data de hoje se completou
                lastCompletedDate: isNowCompleted
                  ? new Date().toDateString()
                  : undefined,
              };
            }
            return task;
          }),
        }));
      },

      removeTask: (id: string) => {
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        }));
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      },

      clearAllTasks: () => {
        set({ tasks: [] });
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      },

      // MÁGICA: Reinicia tarefas recorrentes se virou o dia
      checkDailyReset: () => {
        const today = new Date().toDateString();
        const currentDayOfWeek = new Date().getDay(); // 0 = Domingo, 6 = Sábado
        const isWeekend = currentDayOfWeek === 0 || currentDayOfWeek === 6;

        set((state) => ({
          tasks: state.tasks.map((task) => {
            // Se não é recorrente ou não está completa, ignora
            if (task.recurrence === "none" || !task.isCompleted) return task;

            // Se foi completada hoje, mantém completada
            if (task.lastCompletedDate === today) return task;

            // Lógica de reset:
            let shouldReset = false;

            if (task.recurrence === "daily") {
              shouldReset = true; // Todo dia reseta
            } else if (task.recurrence === "mon-fri") {
              shouldReset = !isWeekend; // Só reseta se for dia de semana
            }

            if (shouldReset) {
              return { ...task, isCompleted: false }; // "Ressuscita" a tarefa
            }

            return task;
          }),
        }));
      },
    }),
    {
      name: "tasks-storage",
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);
