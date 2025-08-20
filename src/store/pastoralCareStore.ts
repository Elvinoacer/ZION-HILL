import { create } from "zustand";
import { Session, User, Group, CounselingTopic } from "@/generated/prisma";

// Define a new interface for Counselor that extends User and includes counselingSessions
interface Counselor extends User {
  counselingSessions: Session[];
}

interface PastoralCareState {
  sessions: Session[];
  therapists: Counselor[]; // Changed type to Counselor[]
  counselingTopics: CounselingTopic[];
  loading: boolean;
  error: string | null;
  counselingTopicsFetched: boolean; // New state to track if topics have been fetched

  fetchSessions: () => Promise<void>;
  fetchTherapists: () => Promise<void>;
  fetchCounselingTopics: (forceFetch?: boolean) => Promise<void>;
  bookSession: (session: Omit<Session, "id">) => Promise<void>;
}

export const usePastoralCareStore = create<PastoralCareState>((set) => ({
  sessions: [],
  therapists: [],
  counselingTopics: [],
  loading: false,
  error: null,
  counselingTopicsFetched: false, // Initialize new state

  fetchSessions: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch("/api/pastoral-care?type=sessions");
      if (!response.ok)
        throw new Error(`Error fetching sessions: ${response.statusText}`);
      const sessions = await response.json();
      set({ sessions, loading: false });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      set({ error: message, loading: false });
    }
  },

  fetchTherapists: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch("/api/counselors");
      if (!response.ok)
        throw new Error(`Error fetching therapists: ${response.statusText}`);
      const therapists = await response.json();
      set({ therapists, loading: false });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      set({ error: message, loading: false });
    }
  },

  

  fetchCounselingTopics: async (forceFetch = false) => {
    set((state) => {
      if (!forceFetch && state.counselingTopicsFetched) {
        return {}; // Don't fetch if already fetched and not forced
      }
      return { loading: true, error: null };
    });

    try {
      const response = await fetch("/api/counseling-topics");
      if (!response.ok)
        throw new Error(
          `Error fetching counseling topics: ${response.statusText}`
        );
      const counselingTopics = await response.json();
      set({ counselingTopics, loading: false, counselingTopicsFetched: true });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      set({ error: message, loading: false, counselingTopicsFetched: false });
    }
  },

  

  bookSession: async (session) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch("/api/pastoral-care?type=book-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(session),
      });
      if (!response.ok)
        throw new Error(`Error booking session: ${response.statusText}`);
      const newSession = await response.json();
      set((state) => ({
        sessions: [...state.sessions, newSession],
        loading: false,
      }));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      set({ error: message, loading: false });
    }
  },
}));
