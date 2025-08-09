import { create } from "zustand";
import { AuditLog, Ticket, User, Ministry, Group } from "@/generated/prisma";

interface AdminState {
  stats: {
    totalMembers: number;
    totalMembersChange: string;
    activeVolunteers: number;
    activeVolunteersChange: string;
    upcomingEvents: number;
    upcomingEventsChange: string;
    smallGroups: number;
    smallGroupsChange: string;
  } | null;
  ministries: (Ministry & { leader: User | null })[];
  tasks: Ticket[];
  activityLogs: AuditLog[];
  loading: boolean;
  error: string | null;
  fetchedAdminStats: boolean;
  fetchedMinistries: boolean;
  fetchedTasks: boolean;
  fetchedActivityLogs: boolean;
  fetchAdminStats: () => Promise<void>;
  fetchMinistries: () => Promise<void>;
  fetchTasks: () => Promise<void>;
  fetchActivityLogs: () => Promise<void>;
  updateTaskStatus: (taskId: string, status: string) => Promise<void>;
}

export const useAdminStore = create<AdminState>((set) => ({
  stats: null,
  ministries: [],
  tasks: [],
  activityLogs: [],
  loading: false,
  error: null,
  fetchedAdminStats: false,
  fetchedMinistries: false,
  fetchedTasks: false,
  fetchedActivityLogs: false,

  fetchAdminStats: async () => {
    set((state) => {
      if (state.fetchedAdminStats) {
        return {}; // Already fetched, do nothing
      }
      return { loading: true, error: null };
    });
    try {
      const response = await fetch("/api/admin-dashboard?type=stats");
      if (!response.ok) {
        throw new Error(`Error fetching admin stats: ${response.statusText}`);
      }
      const stats = await response.json();
      set({ stats, loading: false, fetchedAdminStats: true });
    } catch (error: unknown) {
      set({ error: error.message, loading: false });
    }
  },

  fetchMinistries: async () => {
    set((state) => {
      if (state.fetchedMinistries) {
        return {}; // Already fetched, do nothing
      }
      return { loading: true, error: null };
    });
    try {
      const response = await fetch("/api/admin-dashboard?type=ministries");
      if (!response.ok) {
        throw new Error(`Error fetching ministries: ${response.statusText}`);
      }
      const ministries = await response.json();
      set({ ministries, loading: false, fetchedMinistries: true });
    } catch (error: unknown) {
      set({ error: error.message, loading: false });
    }
  },

  fetchTasks: async () => {
    set((state) => {
      if (state.fetchedTasks) {
        return {}; // Already fetched, do nothing
      }
      return { loading: true, error: null };
    });
    try {
      const response = await fetch("/api/admin-dashboard?type=tasks");
      if (!response.ok) {
        throw new Error(`Error fetching tasks: ${response.statusText}`);
      }
      const tasks = await response.json();
      set({ tasks, loading: false, fetchedTasks: true });
    } catch (error: unknown) {
      set({ error: error.message, loading: false });
    }
  },

  fetchActivityLogs: async () => {
    set((state) => {
      if (state.fetchedActivityLogs) {
        return {}; // Already fetched, do nothing
      }
      return { loading: true, error: null };
    });
    try {
      const response = await fetch("/api/admin-dashboard?type=activity");
      if (!response.ok) {
        throw new Error(`Error fetching activity logs: ${response.statusText}`);
      }
      const activityLogs = await response.json();
      set({ activityLogs, loading: false, fetchedActivityLogs: true });
    } catch (error: unknown) {
      set({ error: error.message, loading: false });
    }
  },

  updateTaskStatus: async (taskId, status) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch("/api/admin-dashboard", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ type: "task-status", taskId, status }),
      });
      if (!response.ok) {
        throw new Error(`Error updating task status: ${response.statusText}`);
      }
      const updatedTask = await response.json();
      set((state) => ({
        tasks: state.tasks.map((task) =>
          task.id === taskId ? { ...task, status: updatedTask.status } : task
        ),
        loading: false,
      }));
    } catch (error: unknown) {
      set({ error: error.message, loading: false });
    }
  },
}));
