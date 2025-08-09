import { create } from "zustand";
import { Asset, Ticket, User } from "@/generated/prisma";

interface BrandEngagementState {
  templates: Asset[];
  assets: Asset[];
  bulletins: Asset[];
  alerts: Ticket[];
  statements: Asset[];
  loading: boolean;
  error: string | null;
  fetchTemplates: () => Promise<void>;
  fetchAssets: () => Promise<void>;
  fetchBulletins: () => Promise<void>;
  fetchAlerts: () => Promise<void>;
  fetchStatements: () => Promise<void>;
  createAlert: (alert: Omit<Ticket, "id">) => Promise<void>;
  createStatement: (statement: Omit<Asset, "id">) => Promise<void>;
  postContent: (templateId: string, platforms: string[]) => Promise<void>;
  runStyleCheck: (assetId: string) => Promise<void>;
  sendCommunication: (communicationId: string) => Promise<void>;
  recordAttendance: (bulletinId: string) => Promise<void>;
  runAbTest: (testId: string) => Promise<void>;
  sendAlert: (alertId: string) => Promise<void>;
  sendStatement: (statementId: string) => Promise<void>;
}

export const useBrandEngagementStore = create<BrandEngagementState>((set) => ({
  templates: [],
  assets: [],
  bulletins: [],
  alerts: [],
  statements: [],
  loading: false,
  error: null,

  fetchTemplates: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch("/api/brand-engagement?type=templates");
      if (!response.ok) {
        throw new Error(`Error fetching templates: ${response.statusText}`);
      }
      const templates = await response.json();
      set({ templates, loading: false });
    } catch (error: unknown) {
      set({ error: error.message, loading: false });
    }
  },

  fetchAssets: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch("/api/brand-engagement?type=assets");
      if (!response.ok) {
        throw new Error(`Error fetching assets: ${response.statusText}`);
      }
      const assets = await response.json();
      set({ assets, loading: false });
    } catch (error: unknown) {
      set({ error: error.message, loading: false });
    }
  },

  fetchBulletins: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch("/api/brand-engagement?type=bulletins");
      if (!response.ok) {
        throw new Error(`Error fetching bulletins: ${response.statusText}`);
      }
      const bulletins = await response.json();
      set({ bulletins, loading: false });
    } catch (error: unknown) {
      set({ error: error.message, loading: false });
    }
  },

  fetchAlerts: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch("/api/brand-engagement?type=alerts");
      if (!response.ok) {
        throw new Error(`Error fetching alerts: ${response.statusText}`);
      }
      const alerts = await response.json();
      set({ alerts, loading: false });
    } catch (error: unknown) {
      set({ error: error.message, loading: false });
    }
  },

  fetchStatements: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch("/api/brand-engagement?type=statements");
      if (!response.ok) {
        throw new Error(`Error fetching statements: ${response.statusText}`);
      }
      const statements = await response.json();
      set({ statements, loading: false });
    } catch (error: unknown) {
      set({ error: error.message, loading: false });
    }
  },

  createAlert: async (alert) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch("/api/brand-engagement?type=alerts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(alert),
      });
      if (!response.ok) {
        throw new Error(`Error creating alert: ${response.statusText}`);
      }
      const newAlert = await response.json();
      set((state) => ({
        alerts: [...state.alerts, newAlert],
        loading: false,
      }));
    } catch (error: unknown) {
      set({ error: error.message, loading: false });
    }
  },

  createStatement: async (statement) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch("/api/brand-engagement?type=statements", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(statement),
      });
      if (!response.ok) {
        throw new Error(`Error creating statement: ${response.statusText}`);
      }
      const newStatement = await response.json();
      set((state) => ({
        statements: [...state.statements, newStatement],
        loading: false,
      }));
    } catch (error: unknown) {
      set({ error: error.message, loading: false });
    }
  },

  postContent: async (templateId, platforms) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch("/api/brand-engagement?type=posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ templateId, platforms }),
      });
      if (!response.ok) {
        throw new Error(`Error posting content: ${response.statusText}`);
      }
      set({ loading: false });
    } catch (error: unknown) {
      set({ error: error.message, loading: false });
    }
  },

  runStyleCheck: async (assetId) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch("/api/brand-engagement?type=style-checks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ assetId }),
      });
      if (!response.ok) {
        throw new Error(`Error running style check: ${response.statusText}`);
      }
      set({ loading: false });
    } catch (error: unknown) {
      set({ error: error.message, loading: false });
    }
  },

  sendCommunication: async (communicationId) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(
        "/api/brand-engagement?type=communications",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ communicationId }),
        }
      );
      if (!response.ok) {
        throw new Error(`Error sending communication: ${response.statusText}`);
      }
      set({ loading: false });
    } catch (error: unknown) {
      set({ error: error.message, loading: false });
    }
  },

  recordAttendance: async (bulletinId) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch("/api/brand-engagement?type=attendance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ bulletinId }),
      });
      if (!response.ok) {
        throw new Error(`Error recording attendance: ${response.statusText}`);
      }
      set({ loading: false });
    } catch (error: unknown) {
      set({ error: error.message, loading: false });
    }
  },

  runAbTest: async (testId) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch("/api/brand-engagement?type=ab-tests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ testId }),
      });
      if (!response.ok) {
        throw new Error(`Error running A/B test: ${response.statusText}`);
      }
      set({ loading: false });
    } catch (error: unknown) {
      set({ error: error.message, loading: false });
    }
  },

  sendAlert: async (alertId) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch("/api/brand-engagement?type=send-alert", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ alertId }),
      });
      if (!response.ok) {
        throw new Error(`Error sending alert: ${response.statusText}`);
      }
      set({ loading: false });
    } catch (error: unknown) {
      set({ error: error.message, loading: false });
    }
  },

  sendStatement: async (statementId) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(
        "/api/brand-engagement?type=send-statement",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ statementId }),
        }
      );
      if (!response.ok) {
        throw new Error(`Error sending statement: ${response.statusText}`);
      }
      set({ loading: false });
    } catch (error: unknown) {
      set({ error: error.message, loading: false });
    }
  },

  sendCommunication: async (communicationId) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(
        "/api/brand-engagement?type=communications",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ communicationId }),
        }
      );
      if (!response.ok) {
        throw new Error(`Error sending communication: ${response.statusText}`);
      }
      set({ loading: false });
    } catch (error: unknown) {
      set({ error: error.message, loading: false });
    }
  },

  recordAttendance: async (bulletinId) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch("/api/brand-engagement?type=attendance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ bulletinId }),
      });
      if (!response.ok) {
        throw new Error(`Error recording attendance: ${response.statusText}`);
      }
      set({ loading: false });
    } catch (error: unknown) {
      set({ error: error.message, loading: false });
    }
  },

  runAbTest: async (testId) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch("/api/brand-engagement?type=ab-tests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ testId }),
      });
      if (!response.ok) {
        throw new Error(`Error running A/B test: ${response.statusText}`);
      }
      set({ loading: false });
    } catch (error: unknown) {
      set({ error: error.message, loading: false });
    }
  },

  postContent: async (templateId, platforms) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch("/api/brand-engagement?type=posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ templateId, platforms }),
      });
      if (!response.ok) {
        throw new Error(`Error posting content: ${response.statusText}`);
      }
      set({ loading: false });
    } catch (error: unknown) {
      set({ error: error.message, loading: false });
    }
  },

  runStyleCheck: async (assetId) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch("/api/brand-engagement?type=style-checks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ assetId }),
      });
      if (!response.ok) {
        throw new Error(`Error running style check: ${response.statusText}`);
      }
      set({ loading: false });
    } catch (error: unknown) {
      set({ error: error.message, loading: false });
    }
  },

  sendCommunication: async (communicationId) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(
        "/api/brand-engagement?type=communications",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ communicationId }),
        }
      );
      if (!response.ok) {
        throw new Error(`Error sending communication: ${response.statusText}`);
      }
      set({ loading: false });
    } catch (error: unknown) {
      set({ error: error.message, loading: false });
    }
  },

  recordAttendance: async (bulletinId) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch("/api/brand-engagement?type=attendance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ bulletinId }),
      });
      if (!response.ok) {
        throw new Error(`Error recording attendance: ${response.statusText}`);
      }
      set({ loading: false });
    } catch (error: unknown) {
      set({ error: error.message, loading: false });
    }
  },

  postContent: async (templateId, platforms) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch("/api/brand-engagement?type=posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ templateId, platforms }),
      });
      if (!response.ok) {
        throw new Error(`Error posting content: ${response.statusText}`);
      }
      set({ loading: false });
    } catch (error: unknown) {
      set({ error: error.message, loading: false });
    }
  },

  runStyleCheck: async (assetId) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch("/api/brand-engagement?type=style-checks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ assetId }),
      });
      if (!response.ok) {
        throw new Error(`Error running style check: ${response.statusText}`);
      }
      set({ loading: false });
    } catch (error: unknown) {
      set({ error: error.message, loading: false });
    }
  },
}));
