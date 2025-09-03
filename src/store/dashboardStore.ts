import { create } from "zustand";

interface UserProfile {
  name: string;
  email: string;
  baptismApplicationStatus?: string; // Add baptism status
  baptismDate?: string; // Add baptism date
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
  reconciliationStatus?: string;
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

interface CounselingSession {
  id: string;
  topic?: string | null;
  status: string;
  date: string; // Assuming it will be returned as a string
  counselor?: {
    name: string | null;
  } | null;
}

interface DashboardState {
  profile: UserProfile | null;
  upcomingEvents: Event[];
  recentSermons: Sermon[];
  givingHistory: Transaction[];
  bibleStudyProgress: BibleStudy | null;
  prayerRequests: PrayerRequest[];
  counselingSessions: CounselingSession[]; // Added
  newVolunteeringOpportunitiesCount: number; // New state property
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
  counselingSessions: [], // Added
  newVolunteeringOpportunitiesCount: 0, // Initialize new state property
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
        counselingSessionsResult, // Added
        newVolunteeringOpportunitiesCountResult, // Added
      ] = await Promise.allSettled([
        safeFetch(`/api/member-profile?userId=${userId}`, "Failed to fetch profile"),
        safeFetch("/api/events?type=EVENT", "Failed to fetch events"),
        safeFetch("/api/sermons", "Failed to fetch sermons"),
        safeFetch("/api/donations", "Failed to fetch donations"),
        safeFetch("/api/bible-study", "Failed to fetch bible study progress"),
        safeFetch("/api/prayer-requests", "Failed to fetch prayer requests"),
        safeFetch(`/api/user-counseling-sessions?userId=${userId}`, "Failed to fetch counseling sessions"), // Added
        safeFetch(`/api/volunteering-opportunities/new-count?userId=${userId}`, "Failed to fetch new volunteering opportunities count"), // Added
      ]);

      const update: Partial<DashboardState> = {};
      let aggregatedErrors: string[] = [];

      if (profileResult.status === "fulfilled") {
        update.profile = profileResult.value;
      } else {
        aggregatedErrors.push(profileResult.reason.message);
      }

      if (eventsResult.status === "fulfilled" && eventsResult.value && Array.isArray(eventsResult.value.events)) {
        update.upcomingEvents = eventsResult.value.events;
      }

      if (sermonsResult.status === "fulfilled" && sermonsResult.value && Array.isArray(sermonsResult.value.sermons)) {
        update.recentSermons = sermonsResult.value.sermons;
      }

      if (donationsResult.status === "fulfilled" && donationsResult.value && Array.isArray(donationsResult.value.donations)) {
        update.givingHistory = donationsResult.value.donations;
      }

      if (bibleStudyResult.status === "fulfilled") {
        update.bibleStudyProgress = bibleStudyResult.value;
      }

      if (prayerRequestsResult.status === "fulfilled" && Array.isArray(prayerRequestsResult.value)) {
        update.prayerRequests = prayerRequestsResult.value;
      }

      // Added counseling sessions result handling
      if (counselingSessionsResult.status === "fulfilled" && Array.isArray(counselingSessionsResult.value)) {
        update.counselingSessions = counselingSessionsResult.value;
      } else if (counselingSessionsResult.status === 'rejected') {
        aggregatedErrors.push(counselingSessionsResult.reason.message);
      }

      if (newVolunteeringOpportunitiesCountResult.status === "fulfilled") {
        update.newVolunteeringOpportunitiesCount = newVolunteeringOpportunitiesCountResult.value;
      } else {
        aggregatedErrors.push(newVolunteeringOpportunitiesCountResult.reason.message);
      }

      if (aggregatedErrors.length > 0) {
        set({ error: aggregatedErrors.join("; ") });
      }
      set(update);

    } catch (err: any) {
      set({ error: err.message });
    } finally {
      set({ loading: false });
    }
  },
}));
