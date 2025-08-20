// store/baptismCandidateStore.ts
import { create } from "zustand";
import { BaptismCandidate } from "@/lib/types";

interface BaptismCandidateState {
  candidates: BaptismCandidate[];
  isLoading: boolean;
  error: string | null;
  fetchCandidates: (searchTerm?: string) => Promise<void>;
  updateCandidate: (
    id: string,
    data: Partial<BaptismCandidate>
  ) => Promise<void>;
}

export const useBaptismCandidateStore = create<BaptismCandidateState>(
  (set, get) => ({
    candidates: [],
    isLoading: false,
    error: null,

    fetchCandidates: async (searchTerm?: string) => {
      set({ isLoading: true, error: null });
      try {
        const url = searchTerm
          ? `/api/baptism-candidates?search=${encodeURIComponent(searchTerm)}`
          : "/api/baptism-candidates";
        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to fetch baptism candidates");

        const data: BaptismCandidate[] = await res.json();
        set({ candidates: data, isLoading: false });
      } catch (err: any) {
        set({ error: err.message, isLoading: false });
      }
    },

    updateCandidate: async (id, data) => {
      // Optimistic update
      set((state) => ({
        candidates: state.candidates.map((c) =>
          c.id === id ? { ...c, ...data } : c
        ),
      }));

      try {
        const res = await fetch("/api/baptism-candidates", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, ...data }),
        });
        if (!res.ok) throw new Error("Failed to update baptism candidate");

        const updated: BaptismCandidate = await res.json();
        set((state) => ({
          candidates: state.candidates.map((c) => (c.id === id ? updated : c)),
        }));
      } catch (err: any) {
        set({ error: err.message });
        // Rollback if needed
        get().fetchCandidates();
      }
    },
  })
);
