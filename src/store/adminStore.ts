import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
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

export const useAdminStore = create(immer<AdminState>((set) => ({
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
        return;
      }
      state.loading = true;
      state.error = null;
    });
    try {
      const response = await fetch("/api/admin-dashboard?type=stats");
      if (!response.ok) {
        throw new Error(`Error fetching admin stats: ${response.statusText}`);
      }
      const stats = await response.json();
      set((state) => {
        state.stats = stats;
        state.loading = false;
        state.fetchedAdminStats = true;
      });
    } catch (error: unknown) {
      set((state) => {
        state.error = error.message;
        state.loading = false;
      });
    }
  },

  fetchMinistries: async () => {
    set((state) => {
      if (state.fetchedMinistries) {
        return;
      }
      state.loading = true;
      state.error = null;
    });
    try {
      const response = await fetch("/api/admin-dashboard?type=ministries");
      if (!response.ok) {
        throw new Error(`Error fetching ministries: ${response.statusText}`);
      }
      const ministries = await response.json();
      set((state) => {
        state.ministries = ministries;
        state.loading = false;
        state.fetchedMinistries = true;
      });
    } catch (error: unknown) {
      set((state) => {
        state.error = error.message;
        state.loading = false;
      });
    }
  },

  fetchTasks: async () => {
    set((state) => {
      if (state.fetchedTasks) {
        return;
      }
      state.loading = true;
      state.error = null;
    });
    try {
      const response = await fetch("/api/admin-dashboard?type=tasks");
      if (!response.ok) {
        throw new Error(`Error fetching tasks: ${response.statusText}`);
      }
      const tasks = await response.json();
      set((state) => {
        state.tasks = tasks;
        state.loading = false;
        state.fetchedTasks = true;
      });
    } catch (error: unknown) {
      set((state) => {
        state.error = error.message;
        state.loading = false;
      });
    }
  },

  fetchActivityLogs: async () => {
    set((state) => {
      if (state.fetchedActivityLogs) {
        return;
      }
      state.loading = true;
      state.error = null;
    });
    try {
      const response = await fetch("/api/admin-dashboard?type=activity");
      if (!response.ok) {
        throw new Error(`Error fetching activity logs: ${response.statusText}`);
      }
      const activityLogs = await response.json();
      set((state) => {
        state.activityLogs = activityLogs;
        state.loading = false;
        state.fetchedActivityLogs = true;
      });
    } catch (error: unknown) {
      set((state) => {
        state.error = error.message;
        state.loading = false;
      });
    }
  },

  updateTaskStatus: async (taskId, status) => {
    set((state) => {
      state.loading = true;
      state.error = null;
    });
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
      set((state) => {
        const task = state.tasks.find((task) => task.id === taskId);
        if (task) {
          task.status = updatedTask.status;
        }
        state.loading = false;
      });
    } catch (error: unknown) {
      set((state) => {
        state.error = error.message;
        state.loading = false;
      });
    }
  }, // Added comma here
})));
