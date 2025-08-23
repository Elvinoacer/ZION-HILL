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
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import {
  DollarSign,
  TrendingUp,
  PieChart as PieChartIcon,
  BarChart3,
  Calendar,
  Download,
  Filter,
  Search,
  ChevronDown,
  Eye,
  Edit3,
  Save,
  X,
  AlertCircle,
  CheckCircle2,
  Wallet,
  Target,
  CreditCard,
  Building,
  Users,
  Sparkles,
} from "lucide-react";

type BudgetItem = {
  id: string;
  name: string;
  allocatedBudget: number;
  spent: number;
  budgetRecordId?: string | null;
};

export const formatCurrency = (n: number) =>
  new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n ?? 0);

const COLORS = [
  "#3B82F6", // Blue-500
  "#10B981", // Emerald-500
  "#F59E0B", // Amber-500
  "#EF4444", // Red-500
  "#8B5CF6", // Violet-500
  "#EC4899", // Pink-500
  "#06B6D4", // Cyan-500
  "#84CC16", // Lime-500
];

const ChartCard: React.FC<{
  title: string;
  children: React.ReactNode;
  icon: React.ReactNode;
}> = ({ title, children, icon }) => (
  <motion.div
    className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <div className="flex items-center gap-3 mb-6">
      <div className="p-2 bg-blue-100 rounded-lg text-blue-600">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
    </div>
    {children}
  </motion.div>
);

export default function BudgetsContent(): JSX.Element {
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
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
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

  // Filter budgets based on search and filters
  const filteredBudgets = displayBudgets.filter((budget) => {
    const matchesSearch =
      searchQuery === "" ||
      budget.name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "under" &&
        budget.spent / budget.allocatedBudget < 0.8) ||
      (statusFilter === "over" &&
        budget.spent / budget.allocatedBudget >= 0.8) ||
      (statusFilter === "critical" &&
        budget.spent / budget.allocatedBudget >= 1);

    return matchesSearch && matchesStatus;
  });

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

  const totalAllocated = displayBudgets.reduce(
    (s, m) => s + (m.allocatedBudget || 0),
    0
  );
  const totalSpent = displayBudgets.reduce((s, m) => s + (m.spent || 0), 0);
  const totalRemaining = displayBudgets.reduce(
    (s, m) => s + ((m.allocatedBudget || 0) - (m.spent || 0)),
    0
  );

  const budgetVsActualData = filteredBudgets.map((m) => ({
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

  const budgetAllocationData = filteredBudgets.map((m) => ({
    name: m.name,
    value: m.allocatedBudget,
  }));

  const getUtilizationColor = (utilization: number) => {
    if (utilization >= 1) return "text-red-600 bg-red-100";
    if (utilization >= 0.8) return "text-amber-600 bg-amber-100";
    if (utilization >= 0.6) return "text-blue-600 bg-blue-100";
    return "text-green-600 bg-green-100";
  };

  const getUtilizationIcon = (utilization: number) => {
    if (utilization >= 1) return <AlertCircle className="h-4 w-4" />;
    if (utilization >= 0.8) return <AlertCircle className="h-4 w-4" />;
    return <CheckCircle2 className="h-4 w-4" />;
  };

  if (loading && displayBudgets.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-8">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex justify-center"
            >
              <div className="h-16 w-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <Wallet className="h-8 w-8 text-white" />
              </div>
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
        className="min-h-screen bg-gradient-to-br from-slate-50 to-red-50/30 py-12 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-red-200">
            <div className="bg-red-500 p-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-3">
                <AlertCircle className="h-6 w-6" />
                Financial Data Error
              </h2>
            </div>
            <div className="p-6 text-center">
              <p className="text-lg text-gray-700 mb-6">{String(error)}</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-red-500 text-white font-medium rounded-lg shadow-md hover:bg-red-600 transition-colors flex items-center mx-auto"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
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
      className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 py-8 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="inline-flex items-center justify-center p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4">
            <Wallet className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Ministry Financial Oversight
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Comprehensive budget management and spending analytics for{" "}
            <span className="font-semibold text-blue-600">
              {getCurrentFiscalYear()}
            </span>
          </p>
        </motion.div>

        {/* Annual Budget Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden"
        >
          <div className="p-6 md:p-8 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                  <Target className="h-8 w-8 text-blue-600" />
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

        {/* Summary Cards */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Allocated
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  {formatCurrency(totalAllocated)}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <CreditCard className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Spent</p>
                <p className="text-2xl font-bold text-purple-600">
                  {formatCurrency(totalSpent)}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Remaining
                </p>
                <p
                  className={`text-2xl font-bold ${
                    totalRemaining >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {formatCurrency(Math.abs(totalRemaining))}
                </p>
              </div>
              <div
                className={`p-3 rounded-lg ${
                  totalRemaining >= 0 ? "bg-green-100" : "bg-red-100"
                }`}
              >
                {totalRemaining >= 0 ? (
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                ) : (
                  <AlertCircle className="h-6 w-6 text-red-600" />
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Ministry Budget Table */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden"
        >
          <div className="p-6 md:p-8">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                  <Building className="h-8 w-8 text-indigo-600" />
                  Ministry Budget Allocations
                </h2>
                <p className="text-gray-600 mt-2">
                  Manage and track budget allocations across all ministries
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search ministries..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                  <ChevronDown
                    className={`h-4 w-4 ml-2 transition-transform ${
                      showFilters ? "rotate-180" : ""
                    }`}
                  />
                </button>
              </div>
            </div>

            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Status
                      </label>
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="all">All Status</option>
                        <option value="under">Under Budget</option>
                        <option value="over">Approaching Limit</option>
                        <option value="critical">Over Budget</option>
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

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
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredBudgets.map((ministry) => {
                    const remaining =
                      (ministry.allocatedBudget || 0) - (ministry.spent || 0);
                    const utilization = ministry.allocatedBudget
                      ? (ministry.spent || 0) / ministry.allocatedBudget
                      : 0;

                    return (
                      <motion.tr
                        key={ministry.id}
                        whileHover={{
                          backgroundColor: "rgba(59, 130, 246, 0.03)",
                        }}
                        className="transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                              <Users className="h-5 w-5 text-indigo-600" />
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
                            <span
                              className={`text-sm font-medium px-2 py-1 rounded-full ${getUtilizationColor(
                                utilization
                              )} flex items-center gap-1`}
                            >
                              {getUtilizationIcon(utilization)}
                              {(utilization * 100).toFixed(1)}%
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                              <Eye className="h-4 w-4" />
                            </button>
                            <button className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                              <Edit3 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <AnimatePresence>
              {filteredBudgets.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-12"
                >
                  <div className="bg-gray-50 rounded-2xl p-8 border-2 border-dashed border-gray-300">
                    <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-700 mb-2">
                      No ministries match your criteria
                    </h3>
                    <p className="text-gray-500">
                      Try adjusting your search or filters
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
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
          <ChartCard
            title="Budget vs. Actual Spending"
            icon={<BarChart3 className="h-5 w-5" />}
          >
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
                    fill="#6366f1"
                  />
                  <Bar
                    dataKey="spent"
                    name="Actual Spent"
                    radius={[4, 4, 0, 0]}
                    fill="#10b981"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          {/* Spending Trend Chart */}
          <ChartCard
            title="Monthly Spending Trend"
            icon={<TrendingUp className="h-5 w-5" />}
          >
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
          </ChartCard>

          {/* Budget Allocation Chart */}
          <ChartCard
            title="Budget Allocation Overview"
            icon={<PieChartIcon className="h-5 w-5" />}
          >
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
          </ChartCard>
        </motion.div>
      </div>
    </motion.div>
  );
}

// Add missing icon component
const RefreshCw = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
    />
  </svg>
);
