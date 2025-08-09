import { create } from "zustand";

interface UserProfile {
  name: string;
  email: string;
  // Add other profile fields as needed
}

interface Event {
  id: string;
  title: string;
  date: string;
  location?: string;
}

interface Sermon {
  id: string;
  title: string;
  date: string;
  speaker?: { name: string };
}

interface Transaction {
  id: string;
  amount: number;
  date: string;
  description?: string;
}

interface BibleStudy {
  id: string;
  title: string;
  progress?: number; // Assuming a progress field
}

interface PrayerRequest {
  id: string;
  request: string;
  isUrgent: boolean;
}

interface DashboardState {
  profile: UserProfile | null;
  upcomingEvents: Event[];
  recentSermons: Sermon[];
  givingHistory: Transaction[];
  bibleStudyProgress: BibleStudy | null;
  prayerRequests: PrayerRequest[];
  loading: boolean;
  error: string | null;
  fetchDashboardData: (userId: string) => Promise<void>;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  profile: null,
  upcomingEvents: [],
  recentSermons: [],
  givingHistory: [],
  bibleStudyProgress: null,
  prayerRequests: [],
  loading: false,
  error: null,
  fetchDashboardData: async (userId) => {
    set({ loading: true, error: null });
    try {
      const safeFetch = async (url: string, errorMessage: string) => {
        const res = await fetch(url);
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({ message: 'Unknown error' }));
          throw new Error(`${errorMessage}: ${errorData.message || res.statusText}`);
        }
        return res.json();
      };

      const [
        profileResult,
        eventsResult,
        sermonsResult,
        donationsResult,
        bibleStudyResult,
        prayerRequestsResult,
      ] = await Promise.allSettled([
        safeFetch(`/api/member-profile?userId=${userId}`, "Failed to fetch profile"),
        safeFetch("/api/events?type=EVENT", "Failed to fetch events"),
        safeFetch("/api/sermons", "Failed to fetch sermons"),
        safeFetch("/api/donations", "Failed to fetch donations"),
        safeFetch("/api/bible-study", "Failed to fetch bible study progress"),
        safeFetch("/api/prayer-requests", "Failed to fetch prayer requests"),
      ]);

      const update: Partial<DashboardState> = {};
      let aggregatedErrors: string[] = [];

      if (profileResult.status === "fulfilled") {
        update.profile = profileResult.value;
      } else {
        aggregatedErrors.push(profileResult.reason.message);
      }

      if (eventsResult.status === "fulfilled") {
        update.upcomingEvents = eventsResult.value;
      } else {
        aggregatedErrors.push(eventsResult.reason.message);
      }

      if (sermonsResult.status === "fulfilled") {
        update.recentSermons = sermonsResult.value;
      } else {
        aggregatedErrors.push(sermonsResult.reason.message);
      }

      if (donationsResult.status === "fulfilled") {
        update.givingHistory = donationsResult.value;
      } else {
        aggregatedErrors.push(donationsResult.reason.message);
      }

      if (bibleStudyResult.status === "fulfilled") {
        update.bibleStudyProgress = bibleStudyResult.value;
      } else {
        aggregatedErrors.push(bibleStudyResult.reason.message);
      }

      if (prayerRequestsResult.status === "fulfilled") {
        update.prayerRequests = prayerRequestsResult.value;
      } else {
        aggregatedErrors.push(prayerRequestsResult.reason.message);
      }

      if (aggregatedErrors.length > 0) {
        set({ error: aggregatedErrors.join("; ") });
      }
      set(update);

      set(update);
    } catch (err: any) {
      set({ error: err.message });
    } finally {
      set({ loading: false });
    }
  },
}));
