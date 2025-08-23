import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DollarSign,
  AlertTriangle,
  Filter,
  Download,
  Send,
  Receipt,
  BarChart3,
  CreditCard,
  Users,
  Calendar,
  ChevronDown,
  X,
  Search,
  RefreshCw,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Transaction } from "@/generated/prisma";
import { useDonationStore } from "@/store";

interface ContributionManagementProps {
  donations: Transaction[];
}

// Custom tooltip for the chart
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded-lg shadow-md border border-gray-200">
        <p className="font-semibold text-gray-800">{label}</p>
        <p className="text-blue-600">KES {payload[0].value.toLocaleString()}</p>
      </div>
    );
  }
  return null;
};

export default function ContributionManagement({
  donations,
}: ContributionManagementProps) {
  const { sendReceipt } = useDonationStore();
  const [filter, setFilter] = useState<
    "fundId" | "paymentMethod" | "demographic"
  >("fundId");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateRange, setDateRange] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);
  const [sendingReceipts, setSendingReceipts] = useState<
    Record<string, boolean>
  >({});

  // Filter and process donation data
  const { filteredDonations, donationData, chartData, stats } = useMemo(() => {
    // Apply filters
    let result = donations.filter((donation) => {
      const matchesSearch =
        searchQuery === "" ||
        donation.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (donation.fundId &&
          donation.fundId.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (donation.paymentMethod &&
          donation.paymentMethod
            .toLowerCase()
            .includes(searchQuery.toLowerCase()));

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "anomaly" && donation.anomaly) ||
        (statusFilter === "normal" && !donation.anomaly);

      const matchesDate =
        dateRange === "all" ||
        (dateRange === "recent" &&
          new Date(donation.createdAt) >
            new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));

      return matchesSearch && matchesStatus && matchesDate;
    });

    // Prepare chart data
    const donationData = result.reduce((acc, donation) => {
      const key =
        filter === "fundId"
          ? donation.fundId || "Uncategorized"
          : filter === "paymentMethod"
          ? donation.paymentMethod || "Unknown"
          : donation.demographic || "Unknown";
      acc[key] = (acc[key] || 0) + donation.amount;
      return acc;
    }, {} as Record<string, number>);

    const chartData = Object.entries(donationData)
      .map(([name, amount]) => ({ name, Amount: amount }))
      .sort((a, b) => b.Amount - a.Amount);

    // Calculate stats
    const totalAmount = result.reduce(
      (sum, donation) => sum + donation.amount,
      0
    );
    const averageDonation = result.length > 0 ? totalAmount / result.length : 0;
    const anomalyCount = result.filter((d) => d.anomaly).length;

    return {
      filteredDonations: result,
      donationData,
      chartData,
      stats: {
        totalAmount,
        averageDonation,
        donationCount: result.length,
        anomalyCount,
      },
    };
  }, [donations, filter, searchQuery, statusFilter, dateRange]);

  const handleSendReceipt = async (id: string, template: string) => {
    setSendingReceipts((prev) => ({ ...prev, [id]: true }));
    try {
      await sendReceipt(id, template);
      // In a real app, you might want to use a toast notification instead of alert
      alert(`Receipt for donation ${id} sent successfully!`);
    } catch (error) {
      alert(`Failed to send receipt for donation ${id}. Please try again.`);
      console.error("Error sending receipt:", error);
    } finally {
      setSendingReceipts((prev) => ({ ...prev, [id]: false }));
    }
  };

  const handleSendAllReceipts = async () => {
    if (filteredDonations.length === 0) return;

    if (!confirm(`Send receipts to all ${filteredDonations.length} donors?`))
      return;

    for (const donation of filteredDonations) {
      await handleSendReceipt(donation.id, donation.fundId || "default");
    }
  };

  const exportData = (format: "csv" | "json") => {
    const data =
      format === "csv"
        ? convertToCSV(filteredDonations)
        : JSON.stringify(filteredDonations, null, 2);

    const blob = new Blob([data], {
      type: format === "csv" ? "text/csv" : "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `donations-${
      new Date().toISOString().split("T")[0]
    }.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const convertToCSV = (data: Transaction[]) => {
    const headers = [
      "ID",
      "Amount",
      "Fund",
      "Payment Method",
      "Demographic",
      "Date",
      "Anomaly",
    ];
    const rows = data.map((d) => [
      d.id,
      d.amount,
      d.fundId || "N/A",
      d.paymentMethod || "N/A",
      d.demographic || "N/A",
      new Date(d.createdAt).toLocaleDateString(),
      d.anomaly ? "Yes" : "No",
    ]);

    return [headers, ...rows].map((row) => row.join(",")).join("\n");
  };

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
                Contribution Management
              </h2>
              <p className="text-gray-600 mt-2">
                Track and manage all church donations and contributions
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => exportData("csv")}
                className="flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 transition-colors"
              >
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </button>
              <button
                onClick={handleSendAllReceipts}
                disabled={filteredDonations.length === 0}
                className="flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="h-4 w-4 mr-2" />
                Send All Receipts
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
              <div className="flex items-center">
                <DollarSign className="h-6 w-6 text-blue-600 mr-3" />
                <div>
                  <p className="text-sm text-blue-800">Total Donations</p>
                  <p className="text-xl font-bold text-gray-900">
                    KES {stats.totalAmount.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 p-4 rounded-xl border border-purple-200">
              <div className="flex items-center">
                <CreditCard className="h-6 w-6 text-purple-600 mr-3" />
                <div>
                  <p className="text-sm text-purple-800">Total Transactions</p>
                  <p className="text-xl font-bold text-gray-900">
                    {stats.donationCount}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-xl border border-green-200">
              <div className="flex items-center">
                <BarChart3 className="h-6 w-6 text-green-600 mr-3" />
                <div>
                  <p className="text-sm text-green-800">Average Donation</p>
                  <p className="text-xl font-bold text-gray-900">
                    KES{" "}
                    {stats.averageDonation.toLocaleString(undefined, {
                      maximumFractionDigits: 0,
                    })}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 p-4 rounded-xl border border-amber-200">
              <div className="flex items-center">
                <AlertTriangle className="h-6 w-6 text-amber-600 mr-3" />
                <div>
                  <p className="text-sm text-amber-800">Anomalies Detected</p>
                  <p className="text-xl font-bold text-gray-900">
                    {stats.anomalyCount}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search donations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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

            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Group By
                      </label>
                      <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value as any)}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="fundId">Fund</option>
                        <option value="paymentMethod">Payment Method</option>
                        <option value="demographic">Demographic</option>
                      </select>
                    </div>

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
                        <option value="normal">Normal</option>
                        <option value="anomaly">Anomaly</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date Range
                      </label>
                      <select
                        value={dateRange}
                        onChange={(e) => setDateRange(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="all">All Time</option>
                        <option value="recent">Last 7 Days</option>
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Chart Section */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
              Donation Overview
            </h3>

            <div className="bg-white p-4 rounded-xl border border-gray-200">
              <div className="h-64 md:h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 40 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                      dataKey="name"
                      angle={-45}
                      textAnchor="end"
                      height={60}
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis
                      tickFormatter={(value) => `KES ${value.toLocaleString()}`}
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar
                      dataKey="Amount"
                      fill="#3b82f6"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Donations List */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <CreditCard className="h-5 w-5 mr-2 text-blue-600" />
              Recent Donations ({filteredDonations.length})
            </h3>

            <AnimatePresence mode="wait">
              {filteredDonations.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300"
                >
                  <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">
                    No donations match your current filters.
                  </p>
                  {(searchQuery ||
                    statusFilter !== "all" ||
                    dateRange !== "all") && (
                    <button
                      onClick={() => {
                        setSearchQuery("");
                        setStatusFilter("all");
                        setDateRange("all");
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
                  {filteredDonations.map((donation, index) => (
                    <motion.div
                      key={donation.id}
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
                              KES {donation.amount.toLocaleString()}
                            </div>
                            {donation.anomaly && (
                              <span className="ml-3 px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full flex items-center">
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                Anomaly
                              </span>
                            )}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600">
                            <div className="flex items-center">
                              <span className="font-medium mr-2">Fund:</span>
                              {donation.fundId || "Uncategorized"}
                            </div>
                            <div className="flex items-center">
                              <span className="font-medium mr-2">Method:</span>
                              {donation.paymentMethod || "Unknown"}
                            </div>
                            <div className="flex items-center">
                              <span className="font-medium mr-2">Date:</span>
                              {new Date(
                                donation.createdAt
                              ).toLocaleDateString()}
                            </div>
                          </div>

                          {donation.demographic && (
                            <div className="mt-2 text-sm text-gray-600 flex items-center">
                              <Users className="h-4 w-4 mr-1" />
                              {donation.demographic}
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-2">
                          <button
                            onClick={() =>
                              handleSendReceipt(
                                donation.id,
                                donation.fundId || "default"
                              )
                            }
                            disabled={sendingReceipts[donation.id]}
                            className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {sendingReceipts[donation.id] ? (
                              <RefreshCw className="h-4 w-4 animate-spin" />
                            ) : (
                              <>
                                <Send className="h-4 w-4 mr-2" />
                                Send Receipt
                              </>
                            )}
                          </button>

                          <button className="flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                            <Receipt className="h-4 w-4 mr-2" />
                            View Details
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
