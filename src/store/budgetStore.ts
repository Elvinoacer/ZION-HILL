// // store/budgetStore.ts
// // This file contains the refactored Zustand store with optimistic updates.

// import { create } from "zustand";

// // This enum import is assumed to be correct from your original code.
// // import { ReconciliationStatus } from "@/generated/prisma";
// // Using a placeholder since the definition is not available.
// enum ReconciliationStatus {
//   PENDING = "PENDING",
//   RECONCILED = "RECONCILED",
//   DISCREPANCY = "DISCREPANCY",
// }

// // --- INTERFACES ---
// // These interfaces define the shape of our state. No changes here.
// interface MinistryBudget {
//   id: string;
//   name: string;
//   allocatedBudget: number;
//   spent: number;
//   budgetRecordId: string | null;
//   fiscalYear: number;
// }

// interface Expense {
//   id: string;
//   amount: number;
//   description: string | null;
//   date: string;
//   reconciliationStatus: ReconciliationStatus;
//   user: { id: string; name: string | null; email: string | null } | null;
//   fund: { id: string; name: string } | null;
// }

// interface BudgetState {
//   ministryBudgets: MinistryBudget[];
//   annualBudgetLimit: number;
//   expenses: Expense[];
//   loading: boolean;
//   error: string | null;
//   fetchBudgets: (silent?: boolean) => Promise<MinistryBudget[]>;
//   updateBudget: (
//     ministryId: string,
//     newAllocatedBudget: number,
//     budgetRecordId: string | null,
//     fiscalYear: number
//   ) => Promise<void>;
//   setAnnualBudgetLimit: (
//     limit: number,
//     options?: { optimistic?: boolean }
//   ) => Promise<void>;
//   fetchExpenses: () => Promise<void>;
//   updateExpenseStatus: (
//     id: string,
//     status: ReconciliationStatus
//   ) => Promise<void>;
// }

// // --- ZUSTAND STORE ---
// // NOTE: This is now in the same file as the component, so no separate import is needed.
// export const useBudgetStore = create<BudgetState>((set, get) => ({
//   // Initial state
//   ministryBudgets: [],
//   annualBudgetLimit: 0,
//   expenses: [],
//   loading: false,
//   error: null,

//   // --- ACTIONS ---

//   fetchBudgets: async (silent = false) => {
//     // A 'silent' flag prevents the loading spinner on background refetches/polls.
//     if (!silent) {
//       set({ loading: true, error: null });
//     }
//     try {
//       const budgetsResponse = await fetch("/api/admin/budgets");
//       if (!budgetsResponse.ok)
//         throw new Error(`HTTP error! status: ${budgetsResponse.status}`);
//       const budgetsData: MinistryBudget[] = await budgetsResponse.json();

//       const financialSettingsResponse = await fetch(
//         "/api/admin/financial-settings"
//       );
//       if (!financialSettingsResponse.ok)
//         throw new Error(
//           `HTTP error! status: ${financialSettingsResponse.status}`
//         );
//       const financialSettingsData = await financialSettingsResponse.json();

//       set({
//         ministryBudgets: budgetsData,
//         annualBudgetLimit: financialSettingsData.annualBudgetLimit,
//         loading: false,
//       });
//       return budgetsData; // Return data for any logic that needs it (like polling)
//     } catch (error: any) {
//       console.error("Failed to fetch budgets or financial settings:", error);
//       if (!silent) {
//         set({ error: error.message, loading: false });
//       }
//       return []; // Return empty on error
//     }
//   },

//   /**
//    * REFACTORED with Optimistic Updates
//    * This function now updates the UI state *before* the API call.
//    * If the API call fails, it reverts the state to what it was before.
//    */
//   updateBudget: async (
//     ministryId,
//     newAllocatedBudget,
//     budgetRecordId,
//     fiscalYear
//   ) => {
//     const originalBudgets = get().ministryBudgets;

//     // 1. Optimistically update the state immediately for a flicker-free UI.
//     set((state) => ({
//       ministryBudgets: state.ministryBudgets.map((mb) =>
//         mb.id === ministryId
//           ? { ...mb, allocatedBudget: newAllocatedBudget }
//           : mb
//       ),
//     }));

//     try {
//       // 2. Perform the API call.
//       const method = budgetRecordId ? "PUT" : "POST";
//       const body = budgetRecordId
//         ? { budgetRecordId, allocatedAmount: newAllocatedBudget }
//         : { ministryId, allocatedAmount: newAllocatedBudget, fiscalYear };

//       const response = await fetch("/api/admin/budgets", {
//         method,
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(body),
//       });

//       if (!response.ok) {
//         throw new Error(`API call failed: ${response.statusText}`);
//       }

//       const updatedBudgetRecord = await response.json();

//       // 3. On success, finalize the state with the correct budgetRecordId from the server.
//       set((state) => ({
//         ministryBudgets: state.ministryBudgets.map((mb) =>
//           mb.id === ministryId
//             ? { ...mb, budgetRecordId: updatedBudgetRecord.id }
//             : mb
//         ),
//         error: null,
//       }));
//     } catch (error: any) {
//       console.error("Failed to update budget, reverting.", error);
//       // 4. On failure, revert to the original state and set an error message.
//       set({
//         ministryBudgets: originalBudgets,
//         error: "Failed to save budget.",
//       });
//     }
//   },

//   /**
//    * REFACTORED with Optimistic Updates
//    * Allows for an immediate UI update for the annual limit, with an API call to follow.
//    */
//   setAnnualBudgetLimit: async (
//     limit: number,
//     options?: { optimistic?: boolean }
//   ) => {
//     const originalLimit = get().annualBudgetLimit;

//     // Optimistically set the state immediately for instant UI feedback.
//     set({ annualBudgetLimit: limit });

//     // If this is just the optimistic part of a debounce, don't hit the API yet.
//     if (options?.optimistic) return;

//     try {
//       const response = await fetch("/api/admin/financial-settings", {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ annualBudgetLimit: limit }),
//       });

//       if (!response.ok) {
//         throw new Error(`API call failed: ${response.statusText}`);
//       }
//       // On success, the state is already correct. We can clear any previous errors.
//       set({ error: null });
//     } catch (error: any) {
//       console.error("Failed to set annual budget limit, reverting.", error);
//       // On failure, revert to the original state.
//       set({ annualBudgetLimit: originalLimit, error: "Failed to save limit." });
//     }
//   },

//   // No changes needed for the following actions.
//   fetchExpenses: async () => {
//     set({ loading: true, error: null });
//     try {
//       const response = await fetch("/api/admin/expenses");
//       if (!response.ok)
//         throw new Error(`HTTP error! status: ${response.status}`);
//       const data: Expense[] = await response.json();
//       set({ expenses: data, loading: false });
//     } catch (error: any) {
//       console.error("Failed to fetch expenses:", error);
//       set({ error: error.message, loading: false });
//     }
//   },

//   updateExpenseStatus: async (id: string, status: ReconciliationStatus) => {
//     // This could also be converted to an optimistic update for better UX.
//     set({ loading: true, error: null });
//     try {
//       const response = await fetch("/api/admin/expenses", {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ id, reconciliationStatus: status }),
//       });

//       if (!response.ok)
//         throw new Error(`HTTP error! status: ${response.status}`);
//       const updatedExpense: Expense = await response.json();
//       set((state) => ({
//         expenses: state.expenses.map((exp) =>
//           exp.id === id
//             ? {
//                 ...exp,
//                 reconciliationStatus: updatedExpense.reconciliationStatus,
//               }
//             : exp
//         ),
//         loading: false,
//       }));
//     } catch (error: any) {
//       console.error("Failed to update expense status:", error);
//       set({ error: error.message, loading: false });
//     }
//   },
// }));

import { create } from "zustand";
import { ReconciliationStatus } from "@/generated/prisma"; // Import the enum

interface MinistryBudget {
  id: string; // Ministry ID
  name: string;
  allocatedBudget: number;
  spent: number;
  budgetRecordId: string | null; // ID of the MinistryBudget record in DB
  fiscalYear: number;
}

interface Expense {
  id: string;
  amount: number;
  description: string | null;
  date: string; // Assuming ISO string from Prisma DateTime
  reconciliationStatus: ReconciliationStatus;
  user: {
    id: string;
    name: string | null;
    email: string | null;
  } | null;
  fund: {
    id: string;
    name: string;
  } | null;
}

interface BudgetState {
  ministryBudgets: MinistryBudget[];
  annualBudgetLimit: number;
  expenses: Expense[]; // New state for expenses
  loading: boolean;
  error: string | null;
  fetchBudgets: (silent?: boolean) => Promise<MinistryBudget[]>;
  updateBudget: (
    ministryId: string,
    newAllocatedBudget: number,
    budgetRecordId: string | null,
    fiscalYear: number
  ) => Promise<void>;
  setAnnualBudgetLimit: (limit: number) => Promise<void>;
  fetchExpenses: () => Promise<void>; // New action to fetch expenses
  updateExpenseStatus: (
    id: string,
    status: ReconciliationStatus
  ) => Promise<void>; // New action to update expense status
}

export const useBudgetStore = create<BudgetState>((set, get) => ({
  ministryBudgets: [],
  annualBudgetLimit: 0,
  expenses: [], // Initialize expenses array
  loading: false,
  error: null,

  fetchBudgets: async (silent = false) => {
    if (!silent) set({ loading: true, error: null });
    try {
      // Fetch ministry budgets
      const budgetsResponse = await fetch("/api/admin/budgets");
      if (!budgetsResponse.ok) {
        throw new Error(`HTTP error! status: ${budgetsResponse.status}`);
      }
      const budgetsData: MinistryBudget[] = await budgetsResponse.json();

      // Fetch annual budget limit
      const financialSettingsResponse = await fetch(
        "/api/admin/financial-settings"
      );
      if (!financialSettingsResponse.ok) {
        throw new Error(
          `HTTP error! status: ${financialSettingsResponse.status}`
        );
      }
      const financialSettingsData = await financialSettingsResponse.json();

      set({
        ministryBudgets: budgetsData,
        annualBudgetLimit: financialSettingsData.annualBudgetLimit,
      });
      if (!silent) set({ loading: false });
      return budgetsData;
    } catch (error: any) {
      console.error("Failed to fetch budgets or financial settings:", error);
      set({ error: error.message });
      if (!silent) set({ loading: false });
      throw error;
    }
  },

  updateBudget: async (
    ministryId,
    newAllocatedBudget,
    budgetRecordId,
    fiscalYear
  ) => {
    set({ error: null });
    try {
      let updatedBudgetRecord: MinistryBudget;

      if (budgetRecordId) {
        // Update existing budget record
        const response = await fetch("/api/admin/budgets", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            budgetRecordId,
            allocatedAmount: newAllocatedBudget,
            // spentAmount and status can also be updated if needed
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        updatedBudgetRecord = await response.json();
      } else {
        // Create new budget record if it doesn't exist for the current fiscal year
        const response = await fetch("/api/admin/budgets", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ministryId,
            allocatedAmount: newAllocatedBudget,
            fiscalYear,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        updatedBudgetRecord = await response.json();
      }

      // Update the local state with the new allocated budget and budgetRecordId
      set((state) => ({
        ministryBudgets: state.ministryBudgets.map((mb) =>
          mb.id === ministryId
            ? {
                ...mb,
                allocatedBudget: newAllocatedBudget,
                budgetRecordId: updatedBudgetRecord.id, // Update with the new record ID
              }
            : mb
        ),
      }));
    } catch (error: any) {
      console.error("Failed to update budget:", error);
      set({ error: error.message });
      throw error;
    }
  },

  setAnnualBudgetLimit: async (limit: number) => {
    set({ error: null });
    try {
      const response = await fetch("/api/admin/financial-settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ annualBudgetLimit: limit }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const updatedSetting = await response.json();
      set({
        annualBudgetLimit: updatedSetting.annualBudgetLimit,
      });
    } catch (error: any) {
      console.error("Failed to set annual budget limit:", error);
      set({ error: error.message });
      throw error;
    }
  },

  fetchExpenses: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch("/api/admin/expenses");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: Expense[] = await response.json();
      set({ expenses: data, loading: false });
    } catch (error: any) {
      console.error("Failed to fetch expenses:", error);
      set({ error: error.message, loading: false });
    }
  },

  updateExpenseStatus: async (id: string, status: ReconciliationStatus) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch("/api/admin/expenses", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, reconciliationStatus: status }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const updatedExpense: Expense = await response.json();
      set((state) => ({
        expenses: state.expenses.map((exp) =>
          exp.id === id
            ? {
                ...exp,
                reconciliationStatus: updatedExpense.reconciliationStatus,
              }
            : exp
        ),
        loading: false,
      }));
    } catch (error: any) {
      console.error("Failed to update expense status:", error);
      set({ error: error.message, loading: false });
    }
  },
}));
