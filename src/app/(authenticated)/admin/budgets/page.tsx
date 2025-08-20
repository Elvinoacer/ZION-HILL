// gemini2.5 pro
// "use client";

// import React, { useCallback, useEffect, useRef } from "react";
// // **FIX**: Removed the unnecessary import of useBudgetStore as it's defined in the same file.
// import { useBudgetStore } from "@/store/budgetStore";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
//   LineChart,
//   Line,
//   PieChart,
//   Pie,
//   Cell,
// } from "recharts";
// import { motion } from "framer-motion";
// import { format } from "date-fns";

// // --- HELPER FUNCTIONS & COMPONENTS ---
// // No changes needed here.

// const formatCurrency = (n: number) =>
//   new Intl.NumberFormat(undefined, {
//     style: "currency",
//     currency: "USD",
//     maximumFractionDigits: 0,
//   }).format(n ?? 0);

// const COLORS = [
//   "#0088FE",
//   "#00C49F",
//   "#FFBB28",
//   "#FF8042",
//   "#8884d8",
//   "#82ca9d",
// ];

// const ChartCard: React.FC<{ title: string; children: React.ReactNode }> = ({
//   title,
//   children,
// }) => (
//   <motion.div
//     className="bg-white shadow-md rounded-lg p-6"
//     initial={{ opacity: 0, y: 20 }}
//     animate={{ opacity: 1, y: 0 }}
//     transition={{ duration: 0.5 }}
//   >
//     <h3 className="text-xl font-semibold text-gray-700 mb-4">{title}</h3>
//     {children}
//   </motion.div>
// );

// // --- MAIN COMPONENT ---
// export default function BudgetsPage(): JSX.Element {
//   // We now get everything directly from the store. This is our single source of truth.
//   // No more local `displayBudgets` state is needed.
//   const {
//     ministryBudgets,
//     annualBudgetLimit,
//     expenses = [],
//     loading,
//     error,
//     fetchBudgets,
//     updateBudget,
//     setAnnualBudgetLimit,
//   } = useBudgetStore();

//   // We only need one ref for all debounce timers.
//   const debounceTimersRef = useRef<
//     Record<string, ReturnType<typeof setTimeout>>
//   >({});

//   const getCurrentFiscalYear = useCallback(() => new Date().getFullYear(), []);

//   // Initial data fetch.
//   useEffect(() => {
//     fetchBudgets();
//     // Also fetch expenses if they are needed for the charts on load.
//     // fetchExpenses();
//   }, [fetchBudgets]);

//   // Clean up any running timers when the component unmounts.
//   useEffect(() => {
//     return () => {
//       Object.values(debounceTimersRef.current).forEach(clearTimeout);
//     };
//   }, []);

//   // NOTE on Polling: The previous polling logic was removed.
//   // Polling with optimistic UI can be tricky, as a poll can overwrite what a user
//   // is currently editing. A better approach for live updates is using WebSockets
//   // or Server-Sent Events (SSE) to push changes from the server.
//   // A simple "Refetch" button could also be a good, non-disruptive UX choice.

//   const handleAllocatedChange = (ministryId: string, value: string) => {
//     const numericValue = Number(value || 0);
//     const budgetItem = ministryBudgets.find((b) => b.id === ministryId);
//     if (!budgetItem) return;

//     // Clear any existing timer for this specific input to reset the debounce.
//     if (debounceTimersRef.current[ministryId]) {
//       clearTimeout(debounceTimersRef.current[ministryId]);
//     }

//     // Set a new timer. The optimistic `updateBudget` action will be called after 800ms.
//     // The UI updates instantly because of the optimistic logic in the store.
//     debounceTimersRef.current[ministryId] = setTimeout(() => {
//       const fiscalYear = getCurrentFiscalYear();
//       updateBudget(
//         ministryId,
//         numericValue,
//         budgetItem.budgetRecordId,
//         fiscalYear
//       );
//     }, 800);
//   };

//   const handleAnnualLimitChange = (val: string) => {
//     const num = Number(val || 0);

//     // This first call updates the UI instantly without hitting the API.
//     setAnnualBudgetLimit(num, { optimistic: true });

//     // Clear previous timer.
//     if (debounceTimersRef.current["annual_limit"]) {
//       clearTimeout(debounceTimersRef.current["annual_limit"]);
//     }

//     // Set a new timer to make the actual API call.
//     debounceTimersRef.current["annual_limit"] = setTimeout(() => {
//       setAnnualBudgetLimit(num); // This call triggers the API request.
//     }, 800);
//   };

//   // All calculations now use `ministryBudgets` directly from the store.
//   const totalAllocated = ministryBudgets.reduce(
//     (s, m) => s + (m.allocatedBudget || 0),
//     0
//   );
//   const totalSpent = ministryBudgets.reduce((s, m) => s + (m.spent || 0), 0);
//   const totalRemaining = totalAllocated - totalSpent;

//   // Chart data sources also use the store state directly.
//   const budgetVsActualData = ministryBudgets.map((m) => ({
//     name: m.name,
//     allocated: m.allocatedBudget,
//     spent: m.spent,
//   }));

//   const monthlySpending: { [key: string]: number } = {};
//   expenses.forEach((expense: any) => {
//     const monthYear = format(new Date(expense.date), "MMM yyyy");
//     monthlySpending[monthYear] =
//       (monthlySpending[monthYear] || 0) + expense.amount;
//   });

//   const spendingTrendData = Object.keys(monthlySpending)
//     .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
//     .map((monthYear) => ({
//       month: monthYear,
//       totalSpent: monthlySpending[monthYear],
//     }));

//   const budgetAllocationData = ministryBudgets.map((m) => ({
//     name: m.name,
//     value: m.allocatedBudget,
//   }));

//   if (loading && ministryBudgets.length === 0) {
//     return <div className="p-8 text-center">Loading budgets...</div>;
//   }

//   if (error && ministryBudgets.length === 0) {
//     return <div className="p-8 text-center text-red-600">Error: {error}</div>;
//   }

//   return (
//     <div className="container mx-auto py-8 px-4">
//       <h1 className="text-4xl font-bold text-gray-800 mb-8">
//         Ministry Budgets & Financial Oversight
//       </h1>

//       {/* Display a general error message if something fails after the initial load */}
//       {error && !loading && (
//         <div
//           className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6"
//           role="alert"
//         >
//           <p className="font-bold">Update Failed</p>
//           <p>{error} Your last change was reverted.</p>
//         </div>
//       )}

//       {/* Annual Budget Limit Card */}
//       <div className="bg-white shadow-md rounded-lg p-6 mb-8">
//         <h2 className="text-2xl font-semibold text-gray-700 mb-4">
//           Annual Church Budget Limit
//         </h2>
//         <div className="flex items-center">
//           <label htmlFor="annualBudget" className="text-lg text-gray-600 mr-4">
//             Set Limit:
//           </label>
//           <input
//             type="number"
//             id="annualBudget"
//             // Use `key` to force re-render if store value changes from external source
//             key={annualBudgetLimit}
//             defaultValue={annualBudgetLimit ?? ""}
//             onChange={(e) => handleAnnualLimitChange(e.target.value)}
//             className="border border-gray-300 rounded-md p-2 text-lg w-48"
//             placeholder="e.g., 100000"
//           />
//         </div>
//       </div>

//       {/* Ministry Allocations Table */}
//       <div className="bg-white shadow-md rounded-lg p-6 mb-8">
//         <h2 className="text-2xl font-semibold text-gray-700 mb-4">
//           Ministry Budget Allocations ({getCurrentFiscalYear()})
//         </h2>
//         <div className="overflow-x-auto">
//           <table className="min-w-full bg-white">
//             <thead>{/* Table headers */}</thead>
//             <tbody>
//               {ministryBudgets.map((ministry) => (
//                 <tr key={ministry.id} className="hover:bg-gray-50">
//                   <td className="py-4 px-4 border-b text-lg text-gray-900">
//                     {ministry.name}
//                   </td>
//                   <td className="py-4 px-4 border-b">
//                     {/* This is now an "uncontrolled" input with a key.
//                       `defaultValue` sets the initial value. `onChange` triggers the debounced update.
//                       Using `key` ensures that if the value is changed from another source (like a poll),
//                       the input will correctly re-render with the new value from the store.
//                       This provides a smooth editing experience without re-rendering on every keystroke.
//                     */}
//                     <input
//                       key={ministry.id}
//                       type="number"
//                       defaultValue={ministry.allocatedBudget || ""}
//                       onChange={(e) =>
//                         handleAllocatedChange(ministry.id, e.target.value)
//                       }
//                       className="border border-gray-300 rounded-md p-2 text-lg w-32"
//                     />
//                   </td>
//                   <td className="py-4 px-4 border-b text-lg text-gray-700">
//                     {formatCurrency(ministry.spent || 0)}
//                   </td>
//                   <td className="py-4 px-4 border-b text-lg text-gray-700">
//                     {formatCurrency(
//                       (ministry.allocatedBudget || 0) - (ministry.spent || 0)
//                     )}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//         <div className="mt-6 text-right">
//           <p className="text-xl font-bold text-gray-800">
//             Total Allocated: {formatCurrency(totalAllocated)}
//           </p>
//           <p className="text-xl font-bold text-gray-800">
//             Total Spent: {formatCurrency(totalSpent)}
//           </p>
//           <p className="text-xl font-bold text-gray-800">
//             Total Remaining: {formatCurrency(totalRemaining)}
//           </p>
//         </div>
//       </div>

//       {/* Charts Section */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
//         <ChartCard title="Ministry Budget vs. Actual Spending">
//           <ResponsiveContainer width="100%" height={300}>
//             <BarChart data={budgetVsActualData}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="name" />
//               <YAxis tickFormatter={formatCurrency} />
//               <Tooltip formatter={(value: number) => formatCurrency(value)} />
//               <Legend />
//               <Bar dataKey="allocated" fill="#8884d8" name="Allocated Budget" />
//               <Bar dataKey="spent" fill="#82ca9d" name="Spent" />
//             </BarChart>
//           </ResponsiveContainer>
//         </ChartCard>
//         {/* Other charts remain the same */}
//       </div>
//     </div>
//   );
// }

/**
 * grok
 */

"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { Icons } from "@/components/icons";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useBudgetStore } from "@/store/budgetStore";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { motion } from "framer-motion";
import { format } from "date-fns";

type BudgetItem = {
  id: string;
  name: string;
  allocatedBudget: number;
  spent: number;
  budgetRecordId?: string | null;
};

const formatCurrency = (n: number) =>
  new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n ?? 0);

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884d8",
  "#82ca9d",
];

const ChartCard: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => (
  <motion.div
    className="bg-white shadow-md rounded-lg p-6"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <h3 className="text-xl font-semibold text-gray-700 mb-4">{title}</h3>
    {children}
  </motion.div>
);

export default function BudgetsPage(): JSX.Element {
  const {
    ministryBudgets = [],
    annualBudgetLimit,
    expenses = [],
    loading,
    error,
    fetchBudgets,
    fetchExpenses,
    updateBudget,
    setAnnualBudgetLimit,
  } = useBudgetStore() as any;

  const [displayBudgets, setDisplayBudgets] = useState<BudgetItem[]>([]);
  const [displayAnnualLimit, setDisplayAnnualLimit] = useState<number>(
    annualBudgetLimit ?? 0
  );
  const [editingAnnual, setEditingAnnual] = useState(false);
  const editingValuesRef = useRef<Record<string, number>>({});
  const editingTimersRef = useRef<
    Record<string, ReturnType<typeof setTimeout>>
  >({});
  const editingSetRef = useRef<Set<string>>(new Set());
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const limitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const getCurrentFiscalYear = useCallback(() => new Date().getFullYear(), []);

  // Sync displayAnnualLimit when annualBudgetLimit changes, but only if not editing
  useEffect(() => {
    if (!editingAnnual) {
      setDisplayAnnualLimit(annualBudgetLimit ?? 0);
    }
  }, [annualBudgetLimit, editingAnnual]);

  // Initial fetch
  useEffect(() => {
    fetchBudgets();
    fetchExpenses();
  }, [fetchBudgets, fetchExpenses]);

  // Merge store budgets into displayBudgets without wiping edits
  useEffect(() => {
    if (!ministryBudgets.length) return;

    setDisplayBudgets((prev) => {
      const freshMap = new Map(ministryBudgets.map((m: any) => [m.id, m]));
      let changed = false;

      const merged = prev.map((local) => {
        const fresh = freshMap.get(local.id);
        if (!fresh) {
          changed = true;
          return local;
        }

        // If currently editing, use the local edited value
        if (editingSetRef.current.has(local.id)) {
          return local;
        }

        // If not editing, and fresh data is different, update
        if (
          fresh.allocatedBudget !== local.allocatedBudget ||
          fresh.spent !== local.spent ||
          fresh.name !== local.name
        ) {
          changed = true;
          return { ...fresh };
        }
        return local;
      });

      // Add new items from store that are not in displayBudgets
      ministryBudgets.forEach((m: any) => {
        if (!merged.some((x) => x.id === m.id)) {
          merged.push({ ...m });
          changed = true;
        }
      });

      return changed ? merged : prev;
    });
  }, [ministryBudgets]);

  // Poll for spent updates
  useEffect(() => {
    let cancelled = false;

    const poll = async () => {
      if (editingSetRef.current.size > 0) return;
      try {
        const maybe = await fetchBudgets(true);
        if (!cancelled && Array.isArray(maybe) && maybe.length > 0) {
          setDisplayBudgets((prev) =>
            prev.map((p) => {
              const fresh = maybe.find((b: any) => b.id === p.id);
              return fresh && !editingSetRef.current.has(p.id)
                ? { ...p, spent: fresh.spent }
                : p;
            })
          );
        }
      } catch (err) {
        console.error("Budget poll failed:", err);
      }
    };

    const startTimeout = setTimeout(poll, 2000);
    const interval = setInterval(poll, 10000);

    return () => {
      cancelled = true;
      clearTimeout(startTimeout);
      clearInterval(interval);
    };
  }, [fetchBudgets]);

  // Commit update after debounce
  const commitUpdate = useCallback(
    async (
      ministryId: string,
      newAllocatedBudget: number,
      budgetRecordId: string | null,
      fiscalYear: number
    ) => {
      try {
        await updateBudget(
          ministryId,
          newAllocatedBudget,
          budgetRecordId,
          fiscalYear
        );
      } catch (err) {
        console.error("Failed to persist budget change:", err);
        // Revert to store value on error
        setDisplayBudgets((prev) =>
          prev.map((item) =>
            item.id === ministryId
              ? {
                  ...item,
                  allocatedBudget:
                    ministryBudgets.find((b: any) => b.id === ministryId)
                      ?.allocatedBudget ?? 0,
                }
              : item
          )
        );
      } finally {
        delete editingValuesRef.current[ministryId];
        editingSetRef.current.delete(ministryId);
      }
    },
    [updateBudget, ministryBudgets]
  );

  const handleAllocatedChange = (ministryId: string, value: string) => {
    const numeric = Number(value || 0);
    editingSetRef.current.add(ministryId);
    editingValuesRef.current[ministryId] = numeric;

    // Update only the specific budget item being edited
    setDisplayBudgets((prev) =>
      prev.map((item) =>
        item.id === ministryId ? { ...item, allocatedBudget: numeric } : item
      )
    );

    if (editingTimersRef.current[ministryId]) {
      clearTimeout(editingTimersRef.current[ministryId]);
    }

    const local =
      ministryBudgets.find((b: any) => b.id === ministryId) ||
      displayBudgets.find((b) => b.id === ministryId);
    const budgetRecordId = local?.budgetRecordId ?? null;
    const fiscalYear = getCurrentFiscalYear();

    editingTimersRef.current[ministryId] = setTimeout(() => {
      commitUpdate(ministryId, numeric, budgetRecordId, fiscalYear);
      delete editingTimersRef.current[ministryId];
    }, 800);
  };

  const handleAllocatedBlur = (ministryId: string) => {
    if (editingTimersRef.current[ministryId]) {
      clearTimeout(editingTimersRef.current[ministryId]);
      delete editingTimersRef.current[ministryId];
      const numeric =
        editingValuesRef.current[ministryId] ??
        displayBudgets.find((b) => b.id === ministryId)?.allocatedBudget ??
        0;
      const local =
        ministryBudgets.find((b: any) => b.id === ministryId) ||
        displayBudgets.find((b) => b.id === ministryId);
      const budgetRecordId = local?.budgetRecordId ?? null;
      commitUpdate(ministryId, numeric, budgetRecordId, getCurrentFiscalYear());
    }
    editingSetRef.current.delete(ministryId);
  };

  const commitAnnualUpdate = useCallback(
    async (numeric: number) => {
      try {
        await setAnnualBudgetLimit(numeric);
      } catch (err) {
        console.error("Failed to persist annual budget limit:", err);
        // Revert to store value on error
        setDisplayAnnualLimit(annualBudgetLimit ?? 0);
      } finally {
        setEditingAnnual(false);
      }
    },
    [setAnnualBudgetLimit, annualBudgetLimit]
  );

  const handleAnnualLimitChange = (value: string) => {
    const numeric = Number(value || 0);
    setEditingAnnual(true);
    setDisplayAnnualLimit(numeric);

    if (limitTimerRef.current) clearTimeout(limitTimerRef.current);
    limitTimerRef.current = setTimeout(() => {
      commitAnnualUpdate(numeric);
    }, 800);
  };

  const handleAnnualLimitBlur = () => {
    if (limitTimerRef.current) {
      clearTimeout(limitTimerRef.current);
      commitAnnualUpdate(displayAnnualLimit);
    } else {
      setEditingAnnual(false);
    }
  };

  useEffect(() => {
    return () => {
      Object.values(editingTimersRef.current).forEach((t) => clearTimeout(t));
      if (limitTimerRef.current) clearTimeout(limitTimerRef.current);
    };
  }, []);

  const totalAllocated = displayBudgets.reduce(
    (s, m) => s + (m.allocatedBudget || 0),
    0
  );
  const totalSpent = displayBudgets.reduce((s, m) => s + (m.spent || 0), 0);
  const totalRemaining = displayBudgets.reduce(
    (s, m) => s + ((m.allocatedBudget || 0) - (m.spent || 0)),
    0
  );

  const budgetVsActualData = displayBudgets.map((m) => ({
    name: m.name,
    allocated: m.allocatedBudget,
    spent: m.spent,
  }));

  const monthlySpending: { [key: string]: number } = {};
  expenses.forEach((expense: any) => {
    const monthYear = format(new Date(expense.date), "MMM yyyy");
    monthlySpending[monthYear] =
      (monthlySpending[monthYear] || 0) + expense.amount;
  });

  const spendingTrendData = Object.keys(monthlySpending)
    .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
    .map((monthYear) => ({
      month: monthYear,
      totalSpent: monthlySpending[monthYear],
    }));

  const budgetAllocationData = displayBudgets.map((m) => ({
    name: m.name,
    value: m.allocatedBudget,
  }));

  if (loading && displayBudgets.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-8">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex justify-center"
            >
              <Icons.finance className="h-16 w-16 text-blue-600" />
            </motion.div>
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-3xl font-bold text-gray-800"
            >
              Loading Financial Data
            </motion.h1>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex justify-center space-x-4"
            >
              {[...Array(3)].map((_, i) => (
                <Skeleton
                  key={i}
                  className="h-12 w-12 rounded-full bg-blue-200/50"
                />
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  if (error && displayBudgets.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gradient-to-br from-gray-50 to-red-50 py-12 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-red-600 p-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Icons.warning className="h-6 w-6" />
                Financial Data Error
              </h2>
            </div>
            <div className="p-6 text-center">
              <p className="text-lg text-gray-700 mb-6">{String(error)}</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-red-600 text-white font-medium rounded-lg shadow-md hover:bg-red-700 transition-colors"
              >
                Retry Loading Data
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header Section */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-700">
            Ministry Financial Oversight
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive budget management and spending analytics for{" "}
            {getCurrentFiscalYear()}
          </p>
        </motion.div>

        {/* Annual Budget Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100"
        >
          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                  <Icons.budget className="h-8 w-8 text-blue-600" />
                  Annual Church Budget Limit
                </h2>
                <p className="text-gray-600 mt-2">
                  Total allocated budget for all ministries and church
                  operations
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xl">
                    $
                  </span>
                  <input
                    type="number"
                    id="annualBudget"
                    value={displayAnnualLimit ?? ""}
                    onChange={(e) => handleAnnualLimitChange(e.target.value)}
                    onBlur={handleAnnualLimitBlur}
                    className="pl-8 border border-gray-300 rounded-lg p-3 text-xl w-48 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="100,000"
                  />
                </div>
                <span className="text-xl font-medium text-gray-700">USD</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Ministry Budget Table */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100"
        >
          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                <Icons.ministry className="h-8 w-8 text-indigo-600" />
                Ministry Budget Allocations
              </h2>
              <div className="bg-blue-50 text-blue-800 px-4 py-2 rounded-lg font-medium">
                Fiscal Year: {getCurrentFiscalYear()}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Ministry
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Allocated Budget
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Spent
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Remaining
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Utilization
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {displayBudgets.map((ministry) => {
                    const remaining =
                      (ministry.allocatedBudget || 0) - (ministry.spent || 0);
                    const utilization = ministry.allocatedBudget
                      ? (ministry.spent || 0) / ministry.allocatedBudget
                      : 0;

                    return (
                      <motion.tr
                        key={ministry.id}
                        whileHover={{
                          backgroundColor: "rgba(59, 130, 246, 0.05)",
                        }}
                        className="transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                              <Icons.ministry className="h-5 w-5 text-indigo-600" />
                            </div>
                            <div className="ml-4">
                              <div className="text-lg font-medium text-gray-900">
                                {ministry.name}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                              $
                            </span>
                            <input
                              ref={(el) =>
                                (inputRefs.current[ministry.id] = el)
                              }
                              type="number"
                              value={ministry.allocatedBudget || ""}
                              onChange={(e) =>
                                handleAllocatedChange(
                                  ministry.id,
                                  e.target.value
                                )
                              }
                              onBlur={() => handleAllocatedBlur(ministry.id)}
                              className="pl-8 border border-gray-300 rounded-md p-2 text-lg w-32 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            />
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-lg font-medium text-gray-900">
                          {formatCurrency(ministry.spent || 0)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-lg font-medium">
                          <span
                            className={
                              remaining >= 0 ? "text-green-600" : "text-red-600"
                            }
                          >
                            {formatCurrency(remaining)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-32 bg-gray-200 rounded-full h-2.5 mr-2">
                              <div
                                className={`h-2.5 rounded-full ${
                                  utilization > 1
                                    ? "bg-red-500"
                                    : utilization > 0.8
                                    ? "bg-yellow-500"
                                    : "bg-green-500"
                                }`}
                                style={{
                                  width: `${Math.min(100, utilization * 100)}%`,
                                }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium text-gray-700">
                              {(utilization * 100).toFixed(1)}%
                            </span>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <motion.div
                whileHover={{ y: -5 }}
                className="bg-blue-50 p-6 rounded-xl border border-blue-100"
              >
                <h3 className="text-lg font-medium text-blue-800 mb-2">
                  Total Allocated
                </h3>
                <p className="text-3xl font-bold text-blue-600">
                  {formatCurrency(totalAllocated)}
                </p>
              </motion.div>
              <motion.div
                whileHover={{ y: -5 }}
                className="bg-purple-50 p-6 rounded-xl border border-purple-100"
              >
                <h3 className="text-lg font-medium text-purple-800 mb-2">
                  Total Spent
                </h3>
                <p className="text-3xl font-bold text-purple-600">
                  {formatCurrency(totalSpent)}
                </p>
              </motion.div>
              <motion.div
                whileHover={{ y: -5 }}
                className={`p-6 rounded-xl border ${
                  totalRemaining >= 0
                    ? "bg-green-50 border-green-100"
                    : "bg-red-50 border-red-100"
                }`}
              >
                <h3
                  className={`text-lg font-medium ${
                    totalRemaining >= 0 ? "text-green-800" : "text-red-800"
                  } mb-2`}
                >
                  {totalRemaining >= 0 ? "Total Remaining" : "Over Budget"}
                </h3>
                <p
                  className={`text-3xl font-bold ${
                    totalRemaining >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {formatCurrency(Math.abs(totalRemaining))}
                </p>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Data Visualization Section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {/* Budget vs Actual Chart */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Icons.chartBar className="h-6 w-6 text-blue-600" />
              Budget vs. Actual Spending
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={budgetVsActualData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fill: "#6b7280" }} />
                  <YAxis
                    tickFormatter={formatCurrency}
                    tick={{ fill: "#6b7280" }}
                  />
                  <Tooltip
                    formatter={(value: number) => formatCurrency(value)}
                    contentStyle={{
                      background: "rgba(255, 255, 255, 0.96)",
                      border: "1px solid #e5e7eb",
                      borderRadius: "0.5rem",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                  <Legend />
                  <Bar
                    dataKey="allocated"
                    name="Allocated Budget"
                    radius={[4, 4, 0, 0]}
                  >
                    {budgetVsActualData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill="#6366f1" />
                    ))}
                  </Bar>
                  <Bar
                    dataKey="spent"
                    name="Actual Spent"
                    radius={[4, 4, 0, 0]}
                  >
                    {budgetVsActualData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill="#10b981" />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Spending Trend Chart */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Icons.chartLine className="h-6 w-6 text-purple-600" />
              Monthly Spending Trend
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={spendingTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fill: "#6b7280" }} />
                  <YAxis
                    tickFormatter={formatCurrency}
                    tick={{ fill: "#6b7280" }}
                  />
                  <Tooltip
                    formatter={(value: number) => formatCurrency(value)}
                    contentStyle={{
                      background: "rgba(255, 255, 255, 0.96)",
                      border: "1px solid #e5e7eb",
                      borderRadius: "0.5rem",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="totalSpent"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    activeDot={{ r: 8 }}
                    name="Total Spent"
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Budget Allocation Chart */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Icons.chartPie className="h-6 w-6 text-green-600" />
              Budget Allocation Overview
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={budgetAllocationData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    innerRadius={40}
                    paddingAngle={5}
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {budgetAllocationData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                        stroke="#fff"
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => formatCurrency(value)}
                    contentStyle={{
                      background: "rgba(255, 255, 255, 0.96)",
                      border: "1px solid #e5e7eb",
                      borderRadius: "0.5rem",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
