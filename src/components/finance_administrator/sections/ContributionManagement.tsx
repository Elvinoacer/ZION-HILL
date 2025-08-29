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
import DonationDetailsModal from "./DonationDetailsModal";

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
  const { fetchDonations } = useDonationStore();
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
  const [selectedDonation, setSelectedDonation] = useState<Transaction | null>(
    null
  );

  // Filter and process donation data
  const { filteredDonations, chartData, stats } = useMemo(() => {
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
      chartData,
      stats: {
        totalAmount,
        averageDonation,
        donationCount: result.length,
        anomalyCount,
      },
    };
  }, [donations, filter, searchQuery, statusFilter, dateRange]);

  const handleSendReceipt = async (donation: Transaction) => {
    setSendingReceipts((prev) => ({ ...prev, [donation.id]: true }));
    try {
      const response = await fetch('/api/send-receipt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          donorName: donation.donorName,
          donorEmail: donation.donorEmail,
          amount: donation.amount,
          date: donation.date,
          method: donation.method,
          type: donation.type,
          description: donation.description,
        }),
      });

      if (response.ok) {
        alert(`Receipt for donation ${donation.id} sent successfully!`);
      } else {
        const { error } = await response.json();
        alert(`Failed to send receipt for donation ${donation.id}: ${error}`);
      }
    } catch (error) {
      alert(`Failed to send receipt for donation ${donation.id}. Please try again.`);
      console.error("Error sending receipt:", error);
    } finally {
      setSendingReceipts((prev) => ({ ...prev, [donation.id]: false }));
    }
  };

  const handleViewDetails = (donation: Transaction) => {
    setSelectedDonation(donation);
  };

  const handleCloseModal = () => {
    setSelectedDonation(null);
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            Contribution Management
          </h2>
          <p className="text-gray-600 mt-1">
            Track and manage all church donations and contributions
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => exportData("csv")}
            className="flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 transition-colors text-sm font-medium"
          >
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </button>
          
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Donations"
          value={`KES ${stats.totalAmount.toLocaleString()}`}
          icon={<DollarSign className="h-6 w-6 text-blue-600" />}
          color="blue"
        />
        <StatCard
          title="Total Transactions"
          value={stats.donationCount.toString()}
          icon={<CreditCard className="h-6 w-6 text-purple-600" />}
          color="purple"
        />
        <StatCard
          title="Average Donation"
          value={`KES ${stats.averageDonation.toLocaleString(undefined, {
            maximumFractionDigits: 0,
          })}`}
          icon={<BarChart3 className="h-6 w-6 text-green-600" />}
          color="green"
        />
        <StatCard
          title="Anomalies Detected"
          value={stats.anomalyCount.toString()}
          icon={<AlertTriangle className="h-6 w-6 text-amber-600" />}
          color="amber"
        />
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
          <div className="relative flex-1 w-full md:max-w-md">
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
            className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors w-full md:w-auto"
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
              className="mt-4 pt-4 border-t border-gray-200"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FilterSelect
                  label="Group By"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value as any)}
                  options={[
                    { value: "fundId", label: "Fund" },
                    { value: "paymentMethod", label: "Payment Method" },
                    { value: "demographic", label: "Demographic" },
                  ]}
                />
                <FilterSelect
                  label="Status"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  options={[
                    { value: "all", label: "All Status" },
                    { value: "normal", label: "Normal" },
                    { value: "anomaly", label: "Anomaly" },
                  ]}
                />
                <FilterSelect
                  label="Date Range"
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  options={[
                    { value: "all", label: "All Time" },
                    { value: "recent", label: "Last 7 Days" },
                  ]}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Chart Section */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
          Donation Overview
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 5, right: 20, left: -10, bottom: 40 }}
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

      {/* Donations List */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <CreditCard className="h-5 w-5 mr-2 text-blue-600" />
          Recent Donations ({filteredDonations.length})
        </h3>
        <AnimatePresence>
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
            <div className="space-y-4">
              {filteredDonations.map((donation) => (
                <DonationCard
                  key={donation.id}
                  donation={donation}
                  isSending={sendingReceipts[donation.id]}
                  onSendReceipt={handleSendReceipt}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>
      <DonationDetailsModal
        donation={selectedDonation}
        onClose={handleCloseModal}
      />
    </div>
  );
}

const StatCard = ({ title, value, icon, color }: { title: string, value: string, icon: React.ReactNode, color: string }) => (
  <div className={`bg-${color}-50 p-4 rounded-xl border border-${color}-200 flex items-center`}>
    <div className={`p-3 rounded-lg bg-${color}-100 mr-4`}>{icon}</div>
    <div>
      <p className={`text-sm text-${color}-800`}>{title}</p>
      <p className="text-xl font-bold text-gray-900">{value}</p>
    </div>
  </div>
);

const FilterSelect = ({ label, value, onChange, options }: { label: string, value: string, onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void, options: { value: string, label: string }[] }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <select
      value={value}
      onChange={onChange}
      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

const DonationCard = ({ donation, isSending, onSendReceipt, onViewDetails }: { donation: Transaction, isSending: boolean, onSendReceipt: (donation: Transaction) => void, onViewDetails: (donation: Transaction) => void }) => {
  if (!donation) return null;

  return (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className="p-4 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
  >
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex-1">
        <div className="flex items-center mb-2">
          <span className="font-semibold text-lg text-gray-900">
            KES {donation.amount.toLocaleString()}
          </span>
          {donation.anomaly && (
            <span className="ml-3 px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full flex items-center">
              <AlertTriangle className="h-3 w-3 mr-1" />
              Anomaly
            </span>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-600">
          <div className="flex items-center">
            <CreditCard className="h-4 w-4 mr-2 text-gray-400" />
            <span>{donation.type || "N/A"}</span>
          </div>
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-2 text-gray-400" />
            <span>{donation.description || "N/A"}</span>
          </div>
          <div className="flex items-center">
            <Send className="h-4 w-4 mr-2 text-gray-400" />
            <span>{donation.method || "N/A"}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-gray-400" />
            <span>{new Date(donation.date).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
        <button
          onClick={() => onSendReceipt(donation)}
          disabled={isSending}
          className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
        >
          {isSending ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <Send className="h-4 w-4 mr-2" />
              Send Receipt
            </>
          )}
        </button>
        <button 
            onClick={() => onViewDetails(donation)}
            className="flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium">
          <Receipt className="h-4 w-4 mr-2" />
          View Details
        </button>
      </div>
    </div>
  </motion.div>
);}