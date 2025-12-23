import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { zustandStorage } from "../lib/storage";
import * as Haptics from "expo-haptics";
import { cancelTaskNotification } from "../lib/notifications";

export type RecurrenceType = number[];
export type PriorityType = "high" | "medium" | "low";

export interface Task {
  id: string;
  text: string;
  category: string;
  isCompleted: boolean;
  recurrence: RecurrenceType;
  priority: PriorityType;
  reminderTime?: string;
  notificationId?: string;
  lastCompletedDate?: string;
  createdAt: number;
}

interface TasksState {
  tasks: Task[];
  categories: string[];
  addTask: (task: Omit<Task, "id" | "isCompleted" | "createdAt">) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  toggleTask: (id: string) => void;
  removeTask: (id: string) => void;
  clearAllTasks: () => void;
  checkDailyReset: () => void;
  setTasks: (tasks: Task[]) => void;
  sortTasksByPriority: () => void; // <--- NOVA FUNÇÃO
}

export const useTasks = create<TasksState>()(
  persist(
    (set, get) => ({
      tasks: [],
      categories: [],

      addTask: (newTask) => {
        set((state) => {
          let newCategories = state.categories;
          if (
            newTask.category.trim() !== "" &&
            !state.categories.includes(newTask.category)
          ) {
            newCategories = [...state.categories, newTask.category];
          }

          return {
            categories: newCategories,
            tasks: [
              {
                ...newTask,
                id: Date.now().toString(),
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
        const currentTask = get().tasks.find((t) => t.id === id);

        if (
          currentTask?.notificationId &&
          (updates.isCompleted ||
            updates.reminderTime !== currentTask.reminderTime)
        ) {
          cancelTaskNotification(currentTask.notificationId);
        }

        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, ...updates } : task
          ),
        }));
        Haptics.selectionAsync();
      },

      toggleTask: (id: string) => {
        const task = get().tasks.find((t) => t.id === id);
        if (task?.notificationId) {
          cancelTaskNotification(task.notificationId);
        }

        set((state) => ({
          tasks: state.tasks.map((t) => {
            if (t.id === id) {
              const isNowCompleted = !t.isCompleted;
              if (isNowCompleted) {
                Haptics.notificationAsync(
                  Haptics.NotificationFeedbackType.Success
                );
              } else {
                Haptics.selectionAsync();
              }
              return {
                ...t,
                isCompleted: isNowCompleted,
                lastCompletedDate: isNowCompleted
                  ? new Date().toDateString()
                  : undefined,
              };
            }
            return t;
          }),
        }));
      },

      removeTask: (id: string) => {
        const task = get().tasks.find((t) => t.id === id);
        if (task?.notificationId) cancelTaskNotification(task.notificationId);

        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== id),
        }));
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      },

      clearAllTasks: () => {
        get().tasks.forEach((t) => {
          if (t.notificationId) cancelTaskNotification(t.notificationId);
        });
        set({ tasks: [] });
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      },

      setTasks: (newTasks) => {
        set({ tasks: newTasks });
      },

      sortTasksByPriority: () => {
        const priorityWeight = { high: 3, medium: 2, low: 1 };
        set((state) => ({
          tasks: [...state.tasks].sort((a, b) => {
            // Se um está completo e o outro não, o pendente vem primeiro
            if (a.isCompleted !== b.isCompleted) {
              return a.isCompleted ? 1 : -1;
            }
            // Ordena por peso da prioridade (Maior primeiro)
            const weightA = priorityWeight[a.priority] || 0;
            const weightB = priorityWeight[b.priority] || 0;
            return weightB - weightA;
          }),
        }));
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
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
