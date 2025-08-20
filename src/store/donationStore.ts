import { create } from "zustand";
import { Transaction, Gateway, RecurringGift } from "@/generated/prisma";

interface DonationState {
  donations: Transaction[];
  transactions: Transaction[];
  gateways: Gateway[];
  recurringGifts: RecurringGift[];
  loading: boolean;
  error: string | null;
  fetchedDonations: boolean;
  fetchedTransactions: boolean;
  fetchedGateways: boolean;
  fetchedRecurringGifts: boolean;
  fetchDonations: () => Promise<void>;
  fetchTransactions: () => Promise<void>;
  fetchGateways: () => Promise<void>;
  fetchRecurringGifts: () => Promise<void>;
  createDonation: (donation: Omit<Transaction, "id">) => Promise<void>;
  sendReceipt: (donationId: string, template: string) => Promise<void>;
  scanReceipt: (transactionId: string) => Promise<void>;
  generateReport: (reportId: string) => Promise<void>;
  switchGateway: (gatewayId: string) => Promise<void>;
  notifyDonor: (giftId: string) => Promise<void>;
}

export const useDonationStore = create<DonationState>((set) => ({
  donations: [],
  gateways: [],
  recurringGifts: [],
  loading: false,
  error: null,
  fetchedDonations: false,
  fetchedGateways: false,
  fetchedRecurringGifts: false,
  fetchedTransactions: false,

  fetchDonations: async () => {
    set((state) => {
      if (state.fetchedDonations) {
        return {}; // Already fetched, do nothing
      }
      return { loading: true, error: null };
    });
    try {
      const response = await fetch("/api/donations");
      if (!response.ok) {
        throw new Error(`Error fetching donations: ${response.statusText}`);
      }
      const donations = await response.json();
      set({ donations, loading: false, fetchedDonations: true });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  fetchTransactions: async () => {
    set((state) => {
      if (state.fetchedTransactions) {
        return {}; // Already fetched, do nothing
      }
      return { loading: true, error: null };
    });
    try {
      const response = await fetch("/api/transactions");
      if (!response.ok) {
        throw new Error(`Error fetching transactions: ${response.statusText}`);
      }
      const transactions = await response.json();
      set({ transactions, loading: false, fetchedTransactions: true });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  fetchGateways: async () => {
    set((state) => {
      if (state.fetchedGateways) {
        return {}; // Already fetched, do nothing
      }
      return { loading: true, error: null };
    });
    try {
      const response = await fetch("/api/church-admin?type=gateways");
      if (!response.ok) {
        throw new Error(`Error fetching gateways: ${response.statusText}`);
      }
      const gateways = await response.json();
      set({ gateways, loading: false, fetchedGateways: true });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  fetchRecurringGifts: async () => {
    set((state) => {
      if (state.fetchedRecurringGifts) {
        return {}; // Already fetched, do nothing
      }
      return { loading: true, error: null };
    });
    try {
      const response = await fetch("/api/church-admin?type=recurring-gifts");
      if (!response.ok) {
        throw new Error(`Error fetching recurring gifts: ${response.statusText}`);
      }
      const recurringGifts = await response.json();
      set({ recurringGifts, loading: false, fetchedRecurringGifts: true });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  createDonation: async (donation) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch("/api/donations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(donation),
      });
      if (!response.ok) {
        throw new Error(`Error creating donation: ${response.statusText}`);
      }
      const newDonation = await response.json();
      set((state) => ({
        donations: [...state.donations, newDonation],
        loading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  sendReceipt: async (donationId, template) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch('/api/church-admin?type=send-receipt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ donationId, template }),
      });
      if (!response.ok) {
        throw new Error(`Error sending receipt: ${response.statusText}`);
      }
      set({ loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  scanReceipt: async (transactionId) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch('/api/church-admin?type=scan-receipt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ transactionId }),
      });
      if (!response.ok) {
        throw new Error(`Error scanning receipt: ${response.statusText}`);
      }
      set({ loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  generateReport: async (reportId) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch('/api/church-admin?type=generate-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reportId }),
      });
      if (!response.ok) {
        throw new Error(`Error generating report: ${response.statusText}`);
      }
      set({ loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  switchGateway: async (gatewayId) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch('/api/church-admin?type=switch-gateway', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ gatewayId }),
      });
      if (!response.ok) {
        throw new Error(`Error switching gateway: ${response.statusText}`);
      }
      set({ loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  notifyDonor: async (giftId) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch('/api/church-admin?type=notify-donor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ giftId }),
      });
      if (!response.ok) {
        throw new Error(`Error notifying donor: ${response.statusText}`);
      }
      set({ loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },
}));
