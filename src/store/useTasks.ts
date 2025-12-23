import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { zustandStorage } from "../lib/storage";
import * as Haptics from "expo-haptics";

export type RecurrenceType = number[];

export interface Task {
  id: string;
  text: string;
  category: string;
  isCompleted: boolean;
  recurrence: RecurrenceType;
  lastCompletedDate?: string;
  createdAt: number;
}

interface TasksState {
  tasks: Task[];
  categories: string[];
  addTask: (text: string, category: string, recurrence: RecurrenceType) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  toggleTask: (id: string) => void;
  removeTask: (id: string) => void;
  clearAllTasks: () => void;
  checkDailyReset: () => void;
}

export const useTasks = create<TasksState>()(
  persist(
    (set, get) => ({
      tasks: [],
      categories: [],

      addTask: (text: string, category: string, recurrence: RecurrenceType) => {
        set((state) => {
          let newCategories = state.categories;
          if (category.trim() !== "" && !state.categories.includes(category)) {
            newCategories = [...state.categories, category];
          }

          return {
            categories: newCategories,
            tasks: [
              {
                id: Date.now().toString(),
                text,
                category,
                recurrence,
                isCompleted: false,
                createdAt: Date.now(),
              },
              ...state.tasks,
            ],
          };
        });
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      },

      updateTask: (id, updates) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, ...updates } : task
          ),
        }));
        Haptics.selectionAsync();
      },

      toggleTask: (id: string) => {
        set((state) => ({
          tasks: state.tasks.map((task) => {
            if (task.id === id) {
              const isNowCompleted = !task.isCompleted;
              if (isNowCompleted) {
                Haptics.notificationAsync(
                  Haptics.NotificationFeedbackType.Success
                );
              } else {
                Haptics.selectionAsync();
              }

              return {
                ...task,
                isCompleted: isNowCompleted,
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

      checkDailyReset: () => {
        const today = new Date().toDateString();
        const currentDayIndex = new Date().getDay();

        set((state) => ({
          tasks: state.tasks.map((task) => {
            if (task.recurrence.length === 0 || !task.isCompleted) return task;

            if (task.lastCompletedDate === today) return task;

            if (task.recurrence.includes(currentDayIndex)) {
              return { ...task, isCompleted: false };
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
