import { create } from "zustand";
import {
  BibleStudy,
  BibleStudyProgress,
  Lesson,
  Group,
  PrayerRequest,
  Asset,
} from "@/generated/prisma";

interface DiscipleshipState {
  currentStudy: (BibleStudy & { lessons: Lesson[] }) | null;
  progress: BibleStudyProgress[];
  resources: Asset[];
  lessons: Lesson[];
  groups: Group[];
  prayerRequests: PrayerRequest[];
  loading: boolean;
  error: string | null;
  fetchCurrentStudy: () => Promise<void>;
  fetchProgress: () => Promise<void>;
  fetchResources: () => Promise<void>;
  fetchLessons: () => Promise<void>;
  fetchGroups: () => Promise<void>;
  fetchPrayerRequests: () => Promise<void>;
  createProgress: (progress: Omit<BibleStudyProgress, "id">) => Promise<void>;
  createLesson: (lesson: Omit<Lesson, "id">) => Promise<void>;
  createPrayerRequest: (
    prayerRequest: Omit<PrayerRequest, "id">
  ) => Promise<void>;
  trackPrayer: (id: string, isUrgent: boolean) => Promise<void>;
  priorityPrayer: (id: string) => Promise<void>;
  markLessonCompleted: (progressId: string) => Promise<void>;
  addDiscussionPrompt: (bibleStudyId: string, title: string) => Promise<void>;
  recordMeetingAttendance: (meetingId: string, userId: string) => Promise<void>;
  celebrateMilestone: (userId: string) => Promise<void>;
  initiateFollowUp: (userId: string) => Promise<void>;
  sendCheckIn: (checkInId: string) => Promise<void>;
}

export const useDiscipleshipStore = create<DiscipleshipState>((set) => ({
  currentStudy: null,
  progress: [],
  resources: [],
  lessons: [],
  groups: [],
  prayerRequests: [],
  loading: false,
  error: null,

  fetchCurrentStudy: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch("/api/bible-study?type=current");
      if (!response.ok) {
        throw new Error(`Error fetching current study: ${response.statusText}`);
      }
      const study = await response.json();
      set({ currentStudy: study, loading: false });
    } catch (error: unknown) {
      set({ error: error.message, loading: false });
    }
  },

  fetchProgress: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch("/api/bible-study?type=progress");
      if (!response.ok) {
        throw new Error(`Error fetching progress: ${response.statusText}`);
      }
      const progress = await response.json();
      set({ progress, loading: false });
    } catch (error: unknown) {
      set({ error: error.message, loading: false });
    }
  },

  fetchResources: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch("/api/bible-study?type=resources");
      if (!response.ok) {
        throw new Error(`Error fetching resources: ${response.statusText}`);
      }
      const resources = await response.json();
      set({ resources, loading: false });
    } catch (error: unknown) {
      set({ error: error.message, loading: false });
    }
  },

  fetchLessons: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch("/api/discipleship-admin?type=lessons");
      if (!response.ok) {
        throw new Error(`Error fetching lessons: ${response.statusText}`);
      }
      const lessons = await response.json();
      set({ lessons, loading: false });
    } catch (error: unknown) {
      set({ error: error.message, loading: false });
    }
  },

  fetchGroups: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch("/api/discipleship-admin?type=groups");
      if (!response.ok) {
        throw new Error(`Error fetching groups: ${response.statusText}`);
      }
      const groups = await response.json();
      set({ groups, loading: false });
    } catch (error: unknown) {
      set({ error: error.message, loading: false });
    }
  },

  fetchPrayerRequests: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(
        "/api/discipleship-admin?type=prayer-requests"
      );
      if (!response.ok) {
        throw new Error(
          `Error fetching prayer requests: ${response.statusText}`
        );
      }
      const prayerRequests = await response.json();
      set({ prayerRequests, loading: false });
    } catch (error: unknown) {
      set({ error: error.message, loading: false });
    }
  },

  createProgress: async (progress) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch("/api/bible-study", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(progress),
      });
      if (!response.ok) {
        throw new Error(`Error creating progress: ${response.statusText}`);
      }
      const newProgress = await response.json();
      set((state) => ({
        progress: [...state.progress, newProgress],
        loading: false,
      }));
    } catch (error: unknown) {
      set({ error: error.message, loading: false });
    }
  },

  createLesson: async (lesson) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch("/api/discipleship-admin?type=lessons", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(lesson),
      });
      if (!response.ok) {
        throw new Error(`Error creating lesson: ${response.statusText}`);
      }
      const newLesson = await response.json();
      set((state) => ({
        lessons: [...state.lessons, newLesson],
        loading: false,
      }));
    } catch (error: unknown) {
      set({ error: error.message, loading: false });
    }
  },

  createPrayerRequest: async (prayerRequest) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(
        "/api/discipleship-admin?type=prayer-requests",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(prayerRequest),
        }
      );
      if (!response.ok) {
        throw new Error(
          `Error creating prayer request: ${response.statusText}`
        );
      }
      const newPrayerRequest = await response.json();
      set((state) => ({
        prayerRequests: [...state.prayerRequests, newPrayerRequest],
        loading: false,
      }));
    } catch (error: unknown) {
      set({ error: error.message, loading: false });
    }
  },

  trackPrayer: async (id, isUrgent) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch("/api/discipleship?type=track-prayer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, isUrgent }),
      });
      if (!response.ok) {
        throw new Error(`Error tracking prayer: ${response.statusText}`);
      }
      const updatedPrayer = await response.json();
      set((state) => ({
        prayerRequests: state.prayerRequests.map((req) =>
          req.id === id ? { ...req, isUrgent: updatedPrayer.isUrgent } : req
        ),
        loading: false,
      }));
    } catch (error: unknown) {
      set({ error: error.message, loading: false });
    }
  },

  priorityPrayer: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch("/api/discipleship?type=priority-prayer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });
      if (!response.ok) {
        throw new Error(
          `Error setting priority prayer: ${response.statusText}`
        );
      }
      const updatedPrayer = await response.json();
      set((state) => ({
        prayerRequests: state.prayerRequests.map((req) =>
          req.id === id ? { ...req, isUrgent: updatedPrayer.isUrgent } : req
        ),
        loading: false,
      }));
    } catch (error: unknown) {
      set({ error: error.message, loading: false });
    }
  },

  markLessonCompleted: async (progressId) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch("/api/bible-study", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ type: "mark-completed", progressId }),
      });
      if (!response.ok) {
        throw new Error(
          `Error marking lesson as completed: ${response.statusText}`
        );
      }
      const updatedProgress = await response.json();
      set((state) => ({
        progress: state.progress.map((p) =>
          p.id === progressId
            ? { ...p, completed: updatedProgress.completed }
            : p
        ),
        loading: false,
      }));
    } catch (error: unknown) {
      set({ error: error.message, loading: false });
    }
  },

  addDiscussionPrompt: async (bibleStudyId, title) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch("/api/discipleship?type=add-prompt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ bibleStudyId, title }),
      });
      if (!response.ok) {
        throw new Error(
          `Error adding discussion prompt: ${response.statusText}`
        );
      }
      set({ loading: false });
    } catch (error: unknown) {
      set({ error: error.message, loading: false });
    }
  },

  recordMeetingAttendance: async (meetingId, userId) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch("/api/discipleship?type=record-attendance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ meetingId, userId }),
      });
      if (!response.ok) {
        throw new Error(
          `Error recording meeting attendance: ${response.statusText}`
        );
      }
      set({ loading: false });
    } catch (error: unknown) {
      set({ error: error.message, loading: false });
    }
  },

  celebrateMilestone: async (userId) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch("/api/discipleship?type=celebrate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });
      if (!response.ok) {
        throw new Error(`Error celebrating milestone: ${response.statusText}`);
      }
      set({ loading: false });
    } catch (error: unknown) {
      set({ error: error.message, loading: false });
    }
  },

  initiateFollowUp: async (userId) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch("/api/discipleship?type=follow-up", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });
      if (!response.ok) {
        throw new Error(`Error initiating follow-up: ${response.statusText}`);
      }
      set({ loading: false });
    } catch (error: unknown) {
      set({ error: error.message, loading: false });
    }
  },

  sendCheckIn: async (checkInId) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch("/api/discipleship?type=send-check-in", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ checkInId }),
      });
      if (!response.ok) {
        throw new Error(`Error sending check-in: ${response.statusText}`);
      }
      set({ loading: false });
    } catch (error: unknown) {
      set({ error: error.message, loading: false });
    }
  },

  celebrateMilestone: async (userId) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch("/api/discipleship?type=celebrate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });
      if (!response.ok) {
        throw new Error(`Error celebrating milestone: ${response.statusText}`);
      }
      set({ loading: false });
    } catch (error: unknown) {
      set({ error: error.message, loading: false });
    }
  },

  initiateFollowUp: async (userId) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch("/api/discipleship?type=follow-up", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });
      if (!response.ok) {
        throw new Error(`Error initiating follow-up: ${response.statusText}`);
      }
      set({ loading: false });
    } catch (error: unknown) {
      set({ error: error.message, loading: false });
    }
  },

  addDiscussionPrompt: async (bibleStudyId, title) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch("/api/discipleship?type=add-prompt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ bibleStudyId, title }),
      });
      if (!response.ok) {
        throw new Error(
          `Error adding discussion prompt: ${response.statusText}`
        );
      }
      set({ loading: false });
    } catch (error: unknown) {
      set({ error: error.message, loading: false });
    }
  },

  recordMeetingAttendance: async (meetingId, userId) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch("/api/discipleship?type=record-attendance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ meetingId, userId }),
      });
      if (!response.ok) {
        throw new Error(
          `Error recording meeting attendance: ${response.statusText}`
        );
      }
      set({ loading: false });
    } catch (error: unknown) {
      set({ error: error.message, loading: false });
    }
  },
}));
