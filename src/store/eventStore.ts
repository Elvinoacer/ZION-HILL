import { create } from "zustand";
import { Event } from "@/generated/prisma";

interface EventState {
  events: Event[];
  loading: boolean;
  error: string | null;
  fetchEvents: (type?: string) => Promise<void>;
  createEvent: (event: Omit<Event, "id">) => Promise<void>;
  updateEvent: (id: string, event: Partial<Event>) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
  confirmEvent: (id: string) => Promise<void>;
  rescheduleEvent: (id: string, date: Date) => Promise<void>;
  rsvpToEvent: (eventId: string, userId: string) => Promise<void>;
  __originalEvents?: Event[]; // Added for optimistic updates
  __deletedEvent?: Event; // Added for optimistic updates
  __deletedEventIndex?: number; // Added for optimistic updates
}

export const useEventStore = create<EventState>((set, get) => ({
  events: [],
  loading: false,
  error: null,

  fetchEvents: async (type) => {
    set({ loading: true, error: null });
    try {
      const url = type ? `/api/events?type=${type}` : "/api/events";
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Error fetching events: ${response.statusText}`);
      }
      const events = await response.json();
      set({ events, loading: false });
    } catch (error: unknown) {
      set({ error: error.message, loading: false });
    }
  },

  createEvent: async (event) => {
    set({ loading: true, error: null });
    console.log("EventStore: createEvent called with event data:", event);
    try {
      const response = await fetch("/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(event),
      });
      console.log("EventStore: Response from /api/events POST:", response);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Error creating event: ${response.statusText}`);
      }
      const newEvent = await response.json();
      set((state) => ({
        events: [...state.events, newEvent],
        loading: false,
      }));
    } catch (error: unknown) {
      console.error("EventStore: Error in createEvent:", error);
      set({ error: (error as Error).message, loading: false });
    }
  },

  confirmEvent: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(
        `/api/admin-command-center?type=confirm-event`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id }),
        }
      );
      if (!response.ok) {
        throw new Error(`Error confirming event: ${response.statusText}`);
      }
      const confirmedEvent = await response.json();
      set((state) => ({
        events: state.events.map((event) =>
          event.id === id ? { ...event, status: confirmedEvent.status } : event
        ),
        loading: false,
      }));
    } catch (error: unknown) {
      set({ error: error.message, loading: false });
    }
  },

  rescheduleEvent: async (id, date) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(
        `/api/admin-command-center?type=reschedule-event`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id, date }),
        }
      );
      if (!response.ok) {
        throw new Error(`Error rescheduling event: ${response.statusText}`);
      }
      const rescheduledEvent = await response.json();
      set((state) => ({
        events: state.events.map((event) =>
          event.id === id ? { ...event, date: rescheduledEvent.date } : event
        ),
        loading: false,
      }));
    } catch (error: unknown) {
      set({ error: error.message, loading: false });
    }
  },

  rsvpToEvent: async (eventId, userId) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch("/api/events/rsvp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ eventId, userId }),
      });
      if (!response.ok) {
        throw new Error(`Error RSVPing to event: ${response.statusText}`);
      }
      // Optionally, update the event in the store to reflect the new participant
      // For now, we'll just refetch events to ensure consistency
      get().fetchEvents();
      set({ loading: false });
    } catch (error: unknown) {
      set({ error: error.message, loading: false });
    }
  },

  updateEvent: async (id, event) => {
    set((state) => {
      const originalEvents = state.events;
      const updatedEvents = state.events.map((e) =>
        e.id === id ? { ...e, ...event } : e
      );
      return { events: updatedEvents, loading: true, error: null, __originalEvents: originalEvents };
    });
    try {
      const response = await fetch(`/api/events?id=${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(event),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Error updating event: ${response.statusText}`);
      }
      set({ loading: false });
    } catch (error: unknown) {
      console.error("EventStore: Error in updateEvent:", error);
      set((state) => ({
        events: state.__originalEvents || state.events,
        error: (error as Error).message,
        loading: false,
        __originalEvents: undefined,
      }));
    }
  },

  deleteEvent: async (id) => {
    set((state) => {
      const originalEvents = state.events;
      const eventToDelete = state.events.find((e) => e.id === id);
      const eventIndex = state.events.findIndex((e) => e.id === id);
      const updatedEvents = state.events.filter((e) => e.id !== id);
      return { events: updatedEvents, loading: true, error: null, __originalEvents: originalEvents, __deletedEvent: eventToDelete, __deletedEventIndex: eventIndex };
    });
    try {
      const response = await fetch(`/api/events?id=${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Error deleting event: ${response.statusText}`);
      }
      set({ loading: false });
    } catch (error: unknown) {
      console.error("EventStore: Error in deleteEvent:", error);
      set((state) => {
        const eventsToRollback = state.__originalEvents || state.events;
        if (state.__deletedEvent && state.__deletedEventIndex !== undefined) {
          eventsToRollback.splice(state.__deletedEventIndex, 0, state.__deletedEvent);
        }
        return {
          events: eventsToRollback,
          error: (error as Error).message,
          loading: false,
          __originalEvents: undefined,
          __deletedEvent: undefined,
          __deletedEventIndex: undefined,
        };
      });
    }
  },
}));
