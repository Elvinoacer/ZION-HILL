import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDrop, useDrag } from "react-dnd";
import {
  PieChart,
  AlertTriangle,
  DollarSign,
  Target,
  TrendingUp,
  Download,
  Scan,
  Plus,
  Minus,
  BarChart3,
  CreditCard,
  Calendar,
  Filter,
  Search,
  ChevronDown,
  X,
  Receipt,
  CheckCircle,
  Clock,
} from "lucide-react";
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { Transaction, Ministry } from "@/generated/prisma";
import { useDonationStore } from "@/store";

interface FinancialOversightProps {
  transactions: Transaction[];
}

// Custom tooltip for the pie chart
const CustomPieTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 rounded-lg shadow-md border border-gray-200">
        <p className="font-semibold text-gray-800">{data.name}</p>
        <p className="text-blue-600">KES {data.value.toLocaleString()}</p>
        <p className="text-sm text-gray-600">
          {((data.value / data.total) * 100).toFixed(1)}% of total
        </p>
      </div>
    );
  }
  return null;
};

export default function FinancialOversight({
  transactions,
}: FinancialOversightProps) {
  const { scanReceipt } = useDonationStore();
  const [ministries, setMinistries] = useState<Ministry[]>([
    {
      id: "1",
      name: "Youth Ministry",
      allocatedBudget: 10000,
      spentBudget: 4000,
    },
    {
      id: "2",
      name: "Missions Outreach",
      allocatedBudget: 15000,
      spentBudget: 8000,
    },
    {
      id: "3",
      name: "Children's Program",
      allocatedBudget: 8000,
      spentBudget: 3000,
    },
    {
      id: "4",
      name: "Worship Team",
      allocatedBudget: 12000,
      spentBudget: 9500,
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);
  const [scanningReceipts, setScanningReceipts] = useState<
    Record<string, boolean>
  >({});

  // Filter and process transaction data
  const { filteredTransactions, budgetStats, pieChartData } = useMemo(() => {
    // Apply filters
    const result = transactions.filter((transaction) => {
      const matchesSearch =
        searchQuery === "" ||
        transaction.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (transaction.description &&
          transaction.description
            .toLowerCase()
            .includes(searchQuery.toLowerCase()));

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "matched" && transaction.matched) ||
        (statusFilter === "unmatched" && !transaction.matched) ||
        (statusFilter === "approved" && transaction.approved) ||
        (statusFilter === "unapproved" && !transaction.approved);

      return matchesSearch && matchesStatus;
    });

    // Calculate budget statistics
    const totalAllocated = ministries.reduce(
      (sum, m) => sum + m.allocatedBudget,
      0
    );
    const totalSpent = ministries.reduce((sum, m) => sum + m.spentBudget, 0);
    const totalRemaining = totalAllocated - totalSpent;
    const utilizationRate =
      totalAllocated > 0 ? (totalSpent / totalAllocated) * 100 : 0;

    // Prepare pie chart data
    const pieData = ministries.map((ministry) => ({
      name: ministry.name,
      value: ministry.spentBudget,
      total: ministry.allocatedBudget,
      remaining: ministry.allocatedBudget - ministry.spentBudget,
      color: `hsl(${Math.random() * 360}, 70%, 60%)`, // Generate random colors
    }));

    return {
      filteredTransactions: result,
      budgetStats: {
        totalAllocated,
        totalSpent,
        totalRemaining,
        utilizationRate,
        ministryCount: ministries.length,
      },
      pieChartData: pieData,
    };
  }, [transactions, ministries, searchQuery, statusFilter]);

  const [, drop] = useDrop({
    accept: "FUND",
    drop: (item: { id: string; amount: number }, monitor) => {
      setMinistries((prev) =>
        prev.map((m) =>
          m.id === item.id
            ? { ...m, allocatedBudget: m.allocatedBudget + item.amount }
            : m
        )
      );
    },
  });

  const handleScanReceipt = async (id: string) => {
    setScanningReceipts((prev) => ({ ...prev, [id]: true }));
    try {
      await scanReceipt(id);
      // In a real app, you might want to use a toast notification instead of alert
      alert(`Receipt for transaction ${id} scanned successfully!`);
    } catch (error) {
      alert(`Failed to scan receipt for transaction ${id}. Please try again.`);
      console.error("Error scanning receipt:", error);
    } finally {
      setScanningReceipts((prev) => ({ ...prev, [id]: false }));
    }
  };

  const handleAdjustBudget = (id: string, amount: number) => {
    setMinistries((prev) =>
      prev.map((m) =>
        m.id === id
          ? { ...m, allocatedBudget: Math.max(0, m.allocatedBudget + amount) }
          : m
      )
    );
  };

  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#A4DE6C",
    "#D0ED57",
    "#8884D8",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl shadow-lg p-4 md:p-6 border border-blue-100"
        >
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                Financial Oversight
              </h2>
              <p className="text-gray-600 mt-2">
                Manage ministry budgets and expense reconciliation
              </p>
            </div>

            <button
              onClick={() => {
                /* Export functionality */
              }}
              className="flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 transition-colors"
            >
              <Download className="h-4 w-4 mr-2" />
              Export Reports
            </button>
          </div>

          {/* Budget Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
              <div className="flex items-center">
                <Target className="h-6 w-6 text-blue-600 mr-3" />
                <div>
                  <p className="text-sm text-blue-800">Total Allocated</p>
                  <p className="text-xl font-bold text-gray-900">
                    KES {budgetStats.totalAllocated.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 p-4 rounded-xl border border-purple-200">
              <div className="flex items-center">
                <DollarSign className="h-6 w-6 text-purple-600 mr-3" />
                <div>
                  <p className="text-sm text-purple-800">Total Spent</p>
                  <p className="text-xl font-bold text-gray-900">
                    KES {budgetStats.totalSpent.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-xl border border-green-200">
              <div className="flex items-center">
                <TrendingUp className="h-6 w-6 text-green-600 mr-3" />
                <div>
                  <p className="text-sm text-green-800">Utilization Rate</p>
                  <p className="text-xl font-bold text-gray-900">
                    {budgetStats.utilizationRate.toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 p-4 rounded-xl border border-amber-200">
              <div className="flex items-center">
                <PieChart className="h-6 w-6 text-amber-600 mr-3" />
                <div>
                  <p className="text-sm text-amber-800">Ministries</p>
                  <p className="text-xl font-bold text-gray-900">
                    {budgetStats.ministryCount}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Budget Planning Section */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Target className="h-5 w-5 mr-2 text-blue-600" />
              Ministry Budget Control
            </h3>

            <div className="flex flex-col lg:flex-row gap-6 mt-4">
              <div className="w-full lg:w-1/3">
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-200 mb-4">
                  <h4 className="text-md font-semibold text-blue-900 mb-2">
                    Available Funds
                  </h4>
                  <p className="text-blue-700 mb-3">
                    Drag funds to allocate to ministries
                  </p>
                  <div className="space-y-2">
                    <DraggableFund id="draggable-fund-1" amount={5000} />
                    <DraggableFund id="draggable-fund-2" amount={3000} />
                    <DraggableFund id="draggable-fund-3" amount={2000} />
                  </div>
                </div>

                {/* Budget Overview Chart */}
                <div className="bg-white p-4 rounded-xl border border-gray-200">
                  <h4 className="text-md font-semibold text-gray-900 mb-4">
                    Budget Distribution
                  </h4>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Pie
                          data={pieChartData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {pieChartData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomPieTooltip />} />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              <div
                ref={drop}
                className="w-full lg:w-2/3 p-4 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 min-h-[400px]"
              >
                <h4 className="text-md font-semibold text-gray-900 mb-4">
                  Budget Planner
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {ministries.map((ministry, index) => (
                    <motion.div
                      key={ministry.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="p-4 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h5 className="font-semibold text-gray-900">
                          {ministry.name}
                        </h5>
                        <div className="flex space-x-1">
                          <button
                            onClick={() =>
                              handleAdjustBudget(ministry.id, -500)
                            }
                            className="p-1 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                            aria-label={`Decrease budget for ${ministry.name}`}
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleAdjustBudget(ministry.id, 500)}
                            className="p-1 bg-green-100 text-green-600 rounded-lg hover:bg-green-200"
                            aria-label={`Increase budget for ${ministry.name}`}
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Allocated:</span>
                          <span className="font-medium">
                            KES {ministry.allocatedBudget.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Spent:</span>
                          <span className="font-medium">
                            KES {ministry.spentBudget.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Remaining:</span>
                          <span
                            className={`font-medium ${
                              ministry.allocatedBudget - ministry.spentBudget <
                              0
                                ? "text-red-600"
                                : "text-green-600"
                            }`}
                          >
                            KES{" "}
                            {(
                              ministry.allocatedBudget - ministry.spentBudget
                            ).toLocaleString()}
                          </span>
                        </div>
                      </div>

                      <div className="mt-3 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{
                            width: `${Math.min(
                              100,
                              (ministry.spentBudget /
                                ministry.allocatedBudget) *
                                100
                            )}%`,
                          }}
                        ></div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Expense Reconciliation Section */}
          <div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Receipt className="h-5 w-5 mr-2 text-blue-600" />
                Expense Reconciliation ({filteredTransactions.length})
              </h3>

              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search transactions..."
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
                  className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200"
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
                        <option value="matched">Matched</option>
                        <option value="unmatched">Unmatched</option>
                        <option value="approved">Approved</option>
                        <option value="unapproved">Unapproved</option>
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
              {filteredTransactions.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300"
                >
                  <Receipt className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">
                    No transactions match your current filters.
                  </p>
                  {(searchQuery || statusFilter !== "all") && (
                    <button
                      onClick={() => {
                        setSearchQuery("");
                        setStatusFilter("all");
                      }}
                      className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Clear all filters
                    </button>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-3"
                >
                  {filteredTransactions.map((transaction, index) => (
                    <motion.div
                      key={transaction.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="p-4 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <DollarSign className="h-5 w-5 text-blue-600 mr-2" />
                            <div className="font-semibold text-gray-900">
                              KES {transaction.amount.toLocaleString()}
                            </div>
                            {!transaction.approved && (
                              <span className="ml-3 px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full flex items-center">
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                Unapproved
                              </span>
                            )}
                            {transaction.matched && (
                              <span className="ml-3 px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full flex items-center">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Matched
                              </span>
                            )}
                          </div>

                          <div className="text-sm text-gray-600 mb-2">
                            {transaction.description || "No description"}
                          </div>

                          <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                            <span className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              {new Date(
                                transaction.createdAt
                              ).toLocaleDateString()}
                            </span>
                            <span>ID: {transaction.id}</span>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-2">
                          {!transaction.matched && (
                            <button
                              onClick={() => handleScanReceipt(transaction.id)}
                              disabled={scanningReceipts[transaction.id]}
                              className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {scanningReceipts[transaction.id] ? (
                                <Clock className="h-4 w-4 animate-pulse" />
                              ) : (
                                <>
                                  <Scan className="h-4 w-4 mr-2" />
                                  Scan Receipt
                                </>
                              )}
                            </button>
                          )}

                          <button className="flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                            <BarChart3 className="h-4 w-4 mr-2" />
                            Details
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function DraggableFund({ id, amount }: { id: string; amount: number }) {
  const [{ isDragging }, drag] = useDrag({
    type: "FUND",
    item: { id, amount },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <motion.div
      ref={drag}
      className={`p-3 bg-white rounded-xl shadow-sm flex items-center cursor-move border-2 border-dashed border-blue-300 hover:border-blue-500 transition-colors ${
        isDragging ? "opacity-50" : "opacity-100"
      }`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <DollarSign className="h-5 w-5 text-blue-600 mr-2" />
      <span className="font-medium">KES {amount.toLocaleString()}</span>
    </motion.div>
  );
}
