import { create } from "zustand";
import { Session, User, Group } from "@/generated/prisma";

interface PastoralCareState {
  sessions: Session[];
  therapists: User[];
  groups: Group[];
  loading: boolean;
  error: string | null;
  fetchSessions: () => Promise<void>;
  fetchTherapists: () => Promise<void>;
  fetchGroups: () => Promise<void>;
  bookSession: (session: Omit<Session, "id">) => Promise<void>;
}

export const usePastoralCareStore = create<PastoralCareState>((set) => ({
  sessions: [],
  therapists: [],
  groups: [],
  loading: false,
  error: null,

  fetchSessions: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch("/api/pastoral-care?type=sessions");
      if (!response.ok) {
        throw new Error(`Error fetching sessions: ${response.statusText}`);
      }
      const sessions = await response.json();
      set({ sessions, loading: false });
    } catch (error: unknown) {
      set({ error: error.message, loading: false });
    }
  },

  fetchTherapists: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch("/api/pastoral-care?type=therapists");
      if (!response.ok) {
        throw new Error(`Error fetching therapists: ${response.statusText}`);
      }
      const therapists = await response.json();
      set({ therapists, loading: false });
    } catch (error: unknown) {
      set({ error: error.message, loading: false });
    }
  },

  fetchGroups: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch("/api/pastoral-care?type=groups");
      if (!response.ok) {
        throw new Error(`Error fetching groups: ${response.statusText}`);
      }
      const groups = await response.json();
      set({ groups, loading: false });
    } catch (error: unknown) {
      set({ error: error.message, loading: false });
    }
  },

  bookSession: async (session) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch("/api/pastoral-care?type=book-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(session),
      });
      if (!response.ok) {
        throw new Error(`Error booking session: ${response.statusText}`);
      }
      const newSession = await response.json();
      set((state) => ({
        sessions: [...state.sessions, newSession],
        loading: false,
      }));
    } catch (error: unknown) {
      set({ error: error.message, loading: false });
    }
  },
}));
