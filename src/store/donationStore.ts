import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
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
  totalDonations: number;
  currentPage: number;
  pageSize: number;
  fetchDonations: (
    page?: number,
    pageSize?: number,
    searchQuery?: string,
    reconciliationStatusFilter?: string,
    dateRange?: string
  ) => Promise<void>;
  fetchTransactions: () => Promise<void>;
  fetchGateways: () => Promise<void>;
  fetchRecurringGifts: () => Promise<void>;
  createDonation: (donation: Omit<Transaction, "id">) => Promise<void>;
  setCurrentPage: (page: number) => void;
  setPageSize: (size: number) => void;
  scanReceipt: (transactionId: string) => Promise<void>;
  generateReport: (reportId: string) => Promise<void>;
  switchGateway: (gatewayId: string) => Promise<void>;
  notifyDonor: (giftId: string) => Promise<void>;
}

export const useDonationStore = create(
  immer<DonationState>((set, get) => ({
    donations: [],
    transactions: [],
    gateways: [],
    recurringGifts: [],
    loading: false,
    error: null,
    fetchedDonations: false,
    fetchedTransactions: false,
    fetchedGateways: false,
    fetchedRecurringGifts: false,
    totalDonations: 0,
    currentPage: 1,
    pageSize: 10,

    setCurrentPage: (page: number) =>
      set((state) => {
        state.currentPage = page;
      }),
    setPageSize: (size: number) =>
      set((state) => {
        state.pageSize = size;
      }),

    fetchDonations: async (
      page = get().currentPage,
      pageSize = get().pageSize,
      searchQuery = "",
      reconciliationStatusFilter = "all",
      dateRange = "all"
    ) => {
      set((state) => {
        if (state.fetchedDonations) {
          return;
        }
        state.loading = true;
        state.error = null;
      });
      try {
        const params = new URLSearchParams();
        params.append("page", page.toString());
        params.append("pageSize", pageSize.toString());
        if (searchQuery) params.append("searchQuery", searchQuery);
        if (reconciliationStatusFilter !== "all")
          params.append(
            "reconciliationStatusFilter",
            reconciliationStatusFilter
          );
        if (dateRange !== "all") params.append("dateRange", dateRange);

        const response = await fetch(`/api/donations?${params.toString()}`);
        if (!response.ok) {
          throw new Error(`Error fetching donations: ${response.statusText}`);
        }
        const { donations, totalCount } = await response.json();
        set((state) => {
          state.donations = donations;
          state.totalDonations = totalCount;
          state.loading = false;
          state.fetchedDonations = true;
        });
      } catch (error: any) {
        set((state) => {
          state.error = error.message;
          state.loading = false;
        });
      }
    },

    fetchTransactions: async () => {
      set((state) => {
        if (state.fetchedTransactions) {
          return;
        }
        state.loading = true;
        state.error = null;
      });
      try {
        const response = await fetch("/api/transactions");
        if (!response.ok) {
          throw new Error(
            `Error fetching transactions: ${response.statusText}`
          );
        }
        const transactions = await response.json();
        set((state) => {
          state.transactions = transactions;
          state.loading = false;
          state.fetchedTransactions = true;
        });
      } catch (error: any) {
        set((state) => {
          state.error = error.message;
          state.loading = false;
        });
      }
    },

    fetchGateways: async () => {
      set((state) => {
        if (state.fetchedGateways) {
          return;
        }
        state.loading = true;
        state.error = null;
      });
      try {
        const response = await fetch("/api/church-admin?type=gateways");
        if (!response.ok) {
          throw new Error(`Error fetching gateways: ${response.statusText}`);
        }
        const gateways = await response.json();
        set((state) => {
          state.gateways = gateways;
          state.loading = false;
          state.fetchedGateways = true;
        });
      } catch (error: any) {
        set((state) => {
          state.error = error.message;
          state.loading = false;
        });
      }
    },

    fetchRecurringGifts: async () => {
      set((state) => {
        if (state.fetchedRecurringGifts) {
          return;
        }
        state.loading = true;
        state.error = null;
      });
      try {
        const response = await fetch("/api/church-admin?type=recurring-gifts");
        if (!response.ok) {
          throw new Error(
            `Error fetching recurring gifts: ${response.statusText}`
          );
        }
        const recurringGifts = await response.json();
        set((state) => {
          state.recurringGifts = recurringGifts;
          state.loading = false;
          state.fetchedRecurringGifts = true;
        });
      } catch (error: any) {
        set((state) => {
          state.error = error.message;
          state.loading = false;
        });
      }
    },

    createDonation: async (donation) => {
      set((state) => {
        state.loading = true;
        state.error = null;
      });
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
        set((state) => {
          state.donations.push(newDonation);
          state.loading = false;
        });
      } catch (error: any) {
        set((state) => {
          state.error = error.message;
          state.loading = false;
        });
      }
    },

    scanReceipt: async (transactionId) => {
      set((state) => {
        state.loading = true;
        state.error = null;
      });
      try {
        const response = await fetch("/api/church-admin?type=scan-receipt", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ transactionId }),
        });
        if (!response.ok) {
          throw new Error(`Error scanning receipt: ${response.statusText}`);
        }
        set((state) => {
          state.loading = false;
        });
      } catch (error: any) {
        set((state) => {
          state.error = error.message;
          state.loading = false;
        });
      }
    },

    generateReport: async (reportId) => {
      set((state) => {
        state.loading = true;
        state.error = null;
      });
      try {
        const response = await fetch("/api/church-admin?type=generate-report", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ reportId }),
        });
        if (!response.ok) {
          throw new Error(`Error generating report: ${response.statusText}`);
        }
        set((state) => {
          state.loading = false;
        });
      } catch (error: any) {
        set((state) => {
          state.error = error.message;
          state.loading = false;
        });
      }
    },

    switchGateway: async (gatewayId) => {
      set((state) => {
        state.loading = true;
        state.error = null;
      });
      try {
        const response = await fetch("/api/church-admin?type=switch-gateway", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ gatewayId }),
        });
        if (!response.ok) {
          throw new Error(`Error switching gateway: ${response.statusText}`);
        }
        set((state) => {
          state.loading = false;
        });
      } catch (error: any) {
        set((state) => {
          state.error = error.message;
          state.loading = false;
        });
      }
    },

    notifyDonor: async (giftId) => {
      set((state) => {
        state.loading = true;
        state.error = null;
      });
      try {
        const response = await fetch("/api/church-admin?type=notify-donor", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ giftId }),
        });
        if (!response.ok) {
          throw new Error(`Error notifying donor: ${response.statusText}`);
        }
        set((state) => {
          state.loading = false;
        });
      } catch (error: any) {
        set((state) => {
          state.error = error.message;
          state.loading = false;
        });
      }
    },
  }))
);
