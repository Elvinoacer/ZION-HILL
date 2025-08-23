import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CreditCard,
  AlertTriangle,
  RefreshCw,
  Bell,
  TrendingUp,
  DollarSign,
  Users,
  Calendar,
  Filter,
  Search,
  ChevronDown,
  X,
  Wifi,
  WifiOff,
  Server,
  Activity,
  ArrowRightLeft,
} from "lucide-react";
import { useDonationStore } from "@/store";

export default function OnlineGivingOptimization() {
  const {
    gateways,
    recurringGifts,
    loading,
    error,
    fetchGateways,
    fetchRecurringGifts,
    switchGateway,
    notifyDonor,
  } = useDonationStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);
  const [switchingGateways, setSwitchingGateways] = useState<
    Record<string, boolean>
  >({});
  const [notifyingDonors, setNotifyingDonors] = useState<
    Record<string, boolean>
  >({});

  useEffect(() => {
    fetchGateways();
    fetchRecurringGifts();
  }, [fetchGateways, fetchRecurringGifts]);

  // Filter and process data
  const { filteredGateways, filteredRecurringGifts, stats } = useMemo(() => {
    // Filter gateways
    const filteredGateways = gateways.filter(
      (gateway) =>
        gateway.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
        gateway.status.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Filter recurring gifts
    const filteredRecurringGifts = recurringGifts.filter(
      (gift) =>
        gift.donorId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        gift.status.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Calculate stats
    const onlineGateways = gateways.filter((g) => g.status === "Online").length;
    const activeRecurringGifts = recurringGifts.filter(
      (g) => g.status === "Active"
    ).length;
    const expiringSoon = recurringGifts.filter((gift) => {
      const endDate = new Date(gift.endDate);
      const today = new Date();
      const diffTime = endDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 30 && diffDays >= 0;
    }).length;
    const lowGiving = recurringGifts.filter(
      (g) => g.status === "LowGiving"
    ).length;

    return {
      filteredGateways,
      filteredRecurringGifts,
      stats: {
        totalGateways: gateways.length,
        onlineGateways,
        totalRecurring: recurringGifts.length,
        activeRecurring: activeRecurringGifts,
        expiringSoon,
        lowGiving,
      },
    };
  }, [gateways, recurringGifts, searchQuery, statusFilter, typeFilter]);

  const handleSwitchGateway = async (id: string) => {
    setSwitchingGateways((prev) => ({ ...prev, [id]: true }));
    try {
      await switchGateway(id);
      // In a real app, you might want to use a toast notification instead of alert
      alert(`Gateway switched to failover successfully!`);
    } catch (error) {
      alert(`Failed to switch gateway. Please try again.`);
      console.error("Error switching gateway:", error);
    } finally {
      setSwitchingGateways((prev) => ({ ...prev, [id]: false }));
    }
  };

  const handleNotifyDonor = async (id: string) => {
    setNotifyingDonors((prev) => ({ ...prev, [id]: true }));
    try {
      await notifyDonor(id);
      // In a real app, you might want to use a toast notification instead of alert
      alert(`Donor notified successfully!`);
    } catch (error) {
      alert(`Failed to notify donor. Please try again.`);
      console.error("Error notifying donor:", error);
    } finally {
      setNotifyingDonors((prev) => ({ ...prev, [id]: false }));
    }
  };

  const handleRetry = () => {
    fetchGateways();
    fetchRecurringGifts();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Online":
        return <Wifi className="h-4 w-4 text-green-500" />;
      case "Offline":
        return <WifiOff className="h-4 w-4 text-red-500" />;
      case "Degraded":
        return <Activity className="h-4 w-4 text-amber-500" />;
      default:
        return <Server className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Online":
        return "bg-green-100 text-green-800";
      case "Offline":
        return "bg-red-100 text-red-800";
      case "Degraded":
        return "bg-amber-100 text-amber-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getGiftStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "LowGiving":
        return "bg-amber-100 text-amber-800";
      case "Expired":
        return "bg-red-100 text-red-800";
      case "Paused":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const isExpiringSoon = (endDate: string) => {
    const end = new Date(endDate);
    const today = new Date();
    const diffTime = end.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30 && diffDays >= 0;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg font-medium text-indigo-700">
            Loading giving optimization data...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg border border-red-200 text-center">
        <div className="bg-red-100 p-3 rounded-full inline-flex mb-4">
          <AlertTriangle className="h-6 w-6 text-red-500" />
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">
          Error Loading Data
        </h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={handleRetry}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 flex items-center justify-center"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Retry
        </button>
      </div>
    );
  }

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
                Online Giving Optimization
              </h2>
              <p className="text-gray-600 mt-2">
                Manage payment gateways and recurring donations
              </p>
            </div>

            <button
              onClick={handleRetry}
              className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Data
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
              <div className="flex items-center">
                <Server className="h-6 w-6 text-blue-600 mr-3" />
                <div>
                  <p className="text-sm text-blue-800">Payment Gateways</p>
                  <p className="text-xl font-bold text-gray-900">
                    {stats.totalGateways}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-xl border border-green-200">
              <div className="flex items-center">
                <Wifi className="h-6 w-6 text-green-600 mr-3" />
                <div>
                  <p className="text-sm text-green-800">Online Gateways</p>
                  <p className="text-xl font-bold text-gray-900">
                    {stats.onlineGateways}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 p-4 rounded-xl border border-purple-200">
              <div className="flex items-center">
                <CreditCard className="h-6 w-6 text-purple-600 mr-3" />
                <div>
                  <p className="text-sm text-purple-800">Recurring Gifts</p>
                  <p className="text-xl font-bold text-gray-900">
                    {stats.totalRecurring}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 p-4 rounded-xl border border-amber-200">
              <div className="flex items-center">
                <AlertTriangle className="h-6 w-6 text-amber-600 mr-3" />
                <div>
                  <p className="text-sm text-amber-800">Need Attention</p>
                  <p className="text-xl font-bold text-gray-900">
                    {stats.lowGiving +
                      (stats.totalGateways - stats.onlineGateways)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Gateway Management Section */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Server className="h-5 w-5 mr-2 text-blue-600" />
                Payment Gateway Management ({filteredGateways.length})
              </h3>

              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search gateways..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {filteredGateways.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300"
                >
                  <Server className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No payment gateways found.</p>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  {filteredGateways.map((gateway, index) => (
                    <motion.div
                      key={gateway.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="p-4 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center">
                          <CreditCard className="h-5 w-5 text-blue-600 mr-2" />
                          <h4 className="font-semibold text-gray-900">
                            {gateway.provider}
                          </h4>
                        </div>
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                            gateway.status
                          )} flex items-center`}
                        >
                          {getStatusIcon(gateway.status)}
                          <span className="ml-1">{gateway.status}</span>
                        </span>
                      </div>

                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex justify-between">
                          <span>Type:</span>
                          <span className="font-medium">
                            {gateway.type || "Primary"}
                          </span>
                        </div>

                        <div className="flex justify-between">
                          <span>Transactions:</span>
                          <span className="font-medium">
                            {gateway.transactionCount || "N/A"}
                          </span>
                        </div>

                        <div className="flex justify-between">
                          <span>Success Rate:</span>
                          <span className="font-medium">
                            {gateway.successRate
                              ? `${gateway.successRate}%`
                              : "N/A"}
                          </span>
                        </div>
                      </div>

                      <div className="mt-4">
                        {gateway.status === "Offline" && (
                          <button
                            onClick={() => handleSwitchGateway(gateway.id)}
                            disabled={switchingGateways[gateway.id]}
                            className="w-full flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {switchingGateways[gateway.id] ? (
                              <RefreshCw className="h-4 w-4 animate-spin" />
                            ) : (
                              <>
                                <ArrowRightLeft className="h-4 w-4 mr-2" />
                                Switch to Failover
                              </>
                            )}
                          </button>
                        )}

                        {gateway.status === "Degraded" && (
                          <button className="w-full flex items-center justify-center px-4 py-2 bg-amber-100 text-amber-800 rounded-lg hover:bg-amber-200 transition-colors">
                            <Activity className="h-4 w-4 mr-2" />
                            Monitor Performance
                          </button>
                        )}

                        {gateway.status === "Online" && (
                          <button className="w-full flex items-center justify-center px-4 py-2 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 transition-colors">
                            <Wifi className="h-4 w-4 mr-2" />
                            Online & Healthy
                          </button>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Recurring Gift Oversight Section */}
          <div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <CreditCard className="h-5 w-5 mr-2 text-blue-600" />
                Recurring Gift Oversight ({filteredRecurringGifts.length})
              </h3>

              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search recurring gifts..."
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
                        <option value="Active">Active</option>
                        <option value="LowGiving">Low Giving</option>
                        <option value="Expired">Expired</option>
                        <option value="Paused">Paused</option>
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
              {filteredRecurringGifts.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300"
                >
                  <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No recurring gifts found.</p>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-3"
                >
                  {filteredRecurringGifts.map((gift, index) => (
                    <motion.div
                      key={gift.id}
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
                              ${gift.amount.toNumber()} / month
                            </div>
                            <span
                              className={`ml-3 px-2 py-1 text-xs font-medium rounded-full ${getGiftStatusColor(
                                gift.status
                              )}`}
                            >
                              {gift.status}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                            <div className="flex items-center">
                              <span className="font-medium mr-2">Donor:</span>
                              {gift.donorId}
                            </div>
                            <div className="flex items-center">
                              <span className="font-medium mr-2">Expires:</span>
                              <span
                                className={
                                  isExpiringSoon(gift.endDate)
                                    ? "text-amber-600 font-medium"
                                    : ""
                                }
                              >
                                {new Date(gift.endDate).toLocaleDateString()}
                                {isExpiringSoon(gift.endDate) && " (Soon)"}
                              </span>
                            </div>
                          </div>

                          <div className="mt-2 text-xs text-gray-500 flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            Started:{" "}
                            {new Date(gift.startDate).toLocaleDateString()}
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-2">
                          {(gift.status === "LowGiving" ||
                            isExpiringSoon(gift.endDate)) && (
                            <button
                              onClick={() => handleNotifyDonor(gift.id)}
                              disabled={notifyingDonors[gift.id]}
                              className="flex items-center justify-center px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {notifyingDonors[gift.id] ? (
                                <RefreshCw className="h-4 w-4 animate-spin" />
                              ) : (
                                <>
                                  <Bell className="h-4 w-4 mr-2" />
                                  Notify Donor
                                </>
                              )}
                            </button>
                          )}

                          <button className="flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                            <TrendingUp className="h-4 w-4 mr-2" />
                            View History
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
