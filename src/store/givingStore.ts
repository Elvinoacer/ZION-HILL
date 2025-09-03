import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { Giving } from "@/types/giving";

interface GivingState {
  giving: Giving[];
  loading: boolean;
  error: string | null;
  fetchedGiving: boolean;
  fetchGiving: () => Promise<void>;
  createGiving: (giving: Omit<Giving, "id" | "transactions">) => Promise<void>;
  updateGiving: (giving: Omit<Giving, "transactions">) => Promise<void>;
  deleteGiving: (id: string) => Promise<void>;
}

export const useGivingStore = create(
  immer<GivingState>((set) => ({
    giving: [],
    loading: false,
    error: null,
    fetchedGiving: false,

    fetchGiving: async () => {
      set((state) => {
        if (state.fetchedGiving) {
          return;
        }
        state.loading = true;
        state.error = null;
      });
      try {
        const response = await fetch("/api/giving");
        if (!response.ok) {
          throw new Error(`Error fetching giving: ${response.statusText}`);
        }
        const giving = await response.json();
        set((state) => {
          state.giving = giving;
          state.loading = false;
          state.fetchedGiving = true;
        });
      } catch (error: any) {
        set((state) => {
          state.error = error.message;
          state.loading = false;
        });
      }
    },

    createGiving: async (giving) => {
      set((state) => {
        state.loading = true;
        state.error = null;
      });
      try {
        const response = await fetch("/api/giving", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(giving),
        });
        if (!response.ok) {
          throw new Error(`Error creating giving: ${response.statusText}`);
        }
        const newGiving = await response.json();
        set((state) => {
          state.giving.push(newGiving);
          state.loading = false;
        });
      } catch (error: any) {
        set((state) => {
          state.error = error.message;
          state.loading = false;
        });
      }
    },

    updateGiving: async (giving) => {
      set((state) => {
        state.loading = true;
        state.error = null;
      });
      try {
        const response = await fetch(`/api/giving/${giving.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(giving),
        });
        if (!response.ok) {
          throw new Error(`Error updating giving: ${response.statusText}`);
        }
        const updatedGiving = await response.json();
        set((state) => {
          const index = state.giving.findIndex(
            (g) => g.id === updatedGiving.id
          );
          if (index !== -1) {
            state.giving[index] = updatedGiving;
          }
          state.loading = false;
        });
      } catch (error: any) {
        set((state) => {
          state.error = error.message;
          state.loading = false;
        });
      }
    },

    deleteGiving: async (id) => {
      set((state) => {
        state.loading = true;
        state.error = null;
      });
      try {
        const response = await fetch(`/api/giving/${id}`, {
          method: "DELETE",
        });
        if (!response.ok) {
          throw new Error(`Error deleting giving: ${response.statusText}`);
        }
        set((state) => {
          state.giving = state.giving.filter((g) => g.id !== id);
          state.loading = false;
        });
      } catch (error: any) {
        set((state) => {
          state.error = error.message;
          state.loading = false;
        });
      }
    },
  }))
);
