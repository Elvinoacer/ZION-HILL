import { create } from "zustand";
import { ParentalControl } from "@/generated/prisma";

interface ParentalControlState {
  controls: Omit<ParentalControl, "id" | "userId"> & { userId?: string };
  loading: boolean;
  error: string | null;
  fetchParentalControls: (userId: string) => Promise<void>;
  updateParentalControls: (
    userId: string,
    updates: Partial<Omit<ParentalControl, "id" | "userId">>
  ) => Promise<void>;
}

export const useParentalControlStore = create<ParentalControlState>((set) => ({
  controls: {
    contentFilter: false,
    activityMonitoring: false,
    screenTimeLimit: false,
    screenTimeHours: 0,
    messagingRestrictions: false,
  },
  loading: false,
  error: null,

  fetchParentalControls: async (userId) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`/api/parental-controls?userId=${userId}`);
      if (!response.ok) {
        throw new Error(
          `Error fetching parental controls: ${response.statusText}`
        );
      }
      const data = await response.json();
      set({ controls: { ...data, userId }, loading: false });
    } catch (error: unknown) {
      set({ error: error.message, loading: false });
    }
  },

  updateParentalControls: async (userId, updates) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch("/api/parental-controls", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, ...updates }),
      });
      if (!response.ok) {
        throw new Error(
          `Error updating parental controls: ${response.statusText}`
        );
      }
      const updatedControls = await response.json();
      set({ controls: { ...updatedControls, userId }, loading: false });
    } catch (error: unknown) {
      set({ error: error.message, loading: false });
    }
  },
}));
