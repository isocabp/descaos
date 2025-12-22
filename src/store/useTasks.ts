import * as Haptics from "expo-haptics";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { zustandStorage } from "@/src/lib/storage";
import { hapticImpact, hapticNotification } from "@/src/lib/haptics";

export type RecurrenceType = "none" | "daily" | "mon-fri";

export interface Task {
  id: string;
  text: string;
  category: string;
  isCompleted: boolean;
  recurrence: RecurrenceType;
  lastCompletedDate?: string;
  createdAt: number;
}

type TasksState = {
  tasks: Task[];
  categories: string[];
  addTask: (text: string, category: string, recurrence: RecurrenceType) => void;
  toggleTask: (taskId: string) => void;
  removeTask: (taskId: string) => void;
  clearAllTasks: () => void;
  checkDailyReset: () => void;
};

const DEFAULT_CATEGORY = "Geral";

function createId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}

function toLocalDateKey(date = new Date()) {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function normalizeCategory(input: string) {
  const value = input.trim();
  return value.length > 0 ? value : DEFAULT_CATEGORY;
}

export const useTasks = create<TasksState>()(
  persist(
    (set) => ({
      tasks: [],
      categories: [DEFAULT_CATEGORY],

      addTask: (text, category, recurrence) => {
        const finalText = text.trim();
        if (!finalText) return;

        const finalCategory = normalizeCategory(category);

        set((state) => {
          const nextCategories = state.categories.includes(finalCategory)
            ? state.categories
            : [...state.categories, finalCategory];

          const task: Task = {
            id: createId(),
            text: finalText,
            category: finalCategory,
            recurrence,
            isCompleted: false,
            createdAt: Date.now(),
          };

          return {
            tasks: [task, ...state.tasks],
            categories: nextCategories,
          };
        });

        void hapticImpact(Haptics.ImpactFeedbackStyle.Light);
      },

      toggleTask: (taskId) => {
        const today = toLocalDateKey();

        set((state) => ({
          tasks: state.tasks.map((task) => {
            if (task.id !== taskId) return task;

            const nextCompleted = !task.isCompleted;

            if (nextCompleted) {
              void hapticImpact(Haptics.ImpactFeedbackStyle.Medium);
              return { ...task, isCompleted: true, lastCompletedDate: today };
            }

            void hapticImpact(Haptics.ImpactFeedbackStyle.Light);
            return { ...task, isCompleted: false };
          }),
        }));
      },

      removeTask: (taskId) => {
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== taskId),
        }));

        void hapticNotification(Haptics.NotificationFeedbackType.Warning);
      },

      clearAllTasks: () => {
        set({ tasks: [] });
        void hapticNotification(Haptics.NotificationFeedbackType.Warning);
      },

      checkDailyReset: () => {
        const today = toLocalDateKey();
        const day = new Date().getDay();
        const isWeekend = day === 0 || day === 6;

        set((state) => ({
          tasks: state.tasks.map((task) => {
            if (task.recurrence === "none" || !task.isCompleted) return task;
            if (task.lastCompletedDate === today) return task;

            if (task.recurrence === "daily") {
              return { ...task, isCompleted: false };
            }

            if (task.recurrence === "mon-fri" && !isWeekend) {
              return { ...task, isCompleted: false };
            }

            return task;
          }),
        }));
      },
    }),
    {
      name: "tasks-storage",
      version: 1,
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);
