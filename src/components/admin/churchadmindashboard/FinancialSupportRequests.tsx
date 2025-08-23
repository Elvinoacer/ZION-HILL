"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  DollarSign,
  Calendar,
  Filter,
  Search,
  ChevronDown,
  X,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Download,
  MoreHorizontal,
  Eye,
  MessageSquare,
  RefreshCw,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface FinancialSupportRequest {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  amountRequested: number;
  reason: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "UNDER_REVIEW";
  createdAt: string;
  urgency?: "LOW" | "MEDIUM" | "HIGH";
  notes?: string;
}

export default function FinancialSupportRequests() {
  const [requests, setRequests] = useState<FinancialSupportRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState<Record<string, boolean>>(
    {}
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [urgencyFilter, setUrgencyFilter] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedRequest, setSelectedRequest] =
    useState<FinancialSupportRequest | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/financial-support");
      if (!response.ok) {
        throw new Error("Failed to fetch requests.");
      }
      const data = await response.json();
      setRequests(data);
    } catch (error) {
      toast.error("Failed to load financial support requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleStatusChange = async (id: string, status: string) => {
    setUpdatingStatus((prev) => ({ ...prev, [id]: true }));
    try {
      const response = await fetch(`/api/financial-support/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error("Failed to update status.");
      }

      toast.success("Status updated successfully.");
      fetchRequests(); // Refresh the list
    } catch (error: any) {
      toast.error("An error occurred while updating the status.");
      console.error(error);
    } finally {
      setUpdatingStatus((prev) => ({ ...prev, [id]: false }));
    }
  };

  const handleViewDetails = (request: FinancialSupportRequest) => {
    setSelectedRequest(request);
    setShowDetailModal(true);
  };

  const filteredRequests = requests.filter((request) => {
    const matchesSearch =
      searchQuery === "" ||
      request.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.reason.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || request.status === statusFilter;
    const matchesUrgency =
      urgencyFilter === "all" || request.urgency === urgencyFilter;

    return matchesSearch && matchesStatus && matchesUrgency;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "APPROVED":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "REJECTED":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "UNDER_REVIEW":
        return <Clock className="h-4 w-4 text-amber-500" />;
      default:
        return <Clock className="h-4 w-4 text-blue-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "bg-green-100 text-green-800 border-green-200";
      case "REJECTED":
        return "bg-red-100 text-red-800 border-red-200";
      case "UNDER_REVIEW":
        return "bg-amber-100 text-amber-800 border-amber-200";
      default:
        return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };

  const getUrgencyColor = (urgency?: string) => {
    switch (urgency) {
      case "HIGH":
        return "bg-red-100 text-red-800 border-red-200";
      case "MEDIUM":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "LOW":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const stats = {
    total: requests.length,
    pending: requests.filter((r) => r.status === "PENDING").length,
    approved: requests.filter((r) => r.status === "APPROVED").length,
    rejected: requests.filter((r) => r.status === "REJECTED").length,
    underReview: requests.filter((r) => r.status === "UNDER_REVIEW").length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg font-medium text-indigo-700">
            Loading financial support requests...
          </p>
        </div>
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
                Financial Support Requests
              </h2>
              <p className="text-gray-600 mt-2">
                Review and manage financial assistance requests
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => fetchRequests()}
                className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </button>
              <button
                onClick={() => {
                  /* Export functionality */
                }}
                className="flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 transition-colors"
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
              <div className="flex items-center">
                <User className="h-6 w-6 text-blue-600 mr-3" />
                <div>
                  <p className="text-sm text-blue-800">Total Requests</p>
                  <p className="text-xl font-bold text-gray-900">
                    {stats.total}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 p-4 rounded-xl border border-amber-200">
              <div className="flex items-center">
                <Clock className="h-6 w-6 text-amber-600 mr-3" />
                <div>
                  <p className="text-sm text-amber-800">Pending</p>
                  <p className="text-xl font-bold text-gray-900">
                    {stats.pending}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-xl border border-green-200">
              <div className="flex items-center">
                <CheckCircle className="h-6 w-6 text-green-600 mr-3" />
                <div>
                  <p className="text-sm text-green-800">Approved</p>
                  <p className="text-xl font-bold text-gray-900">
                    {stats.approved}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-red-50 p-4 rounded-xl border border-red-200">
              <div className="flex items-center">
                <XCircle className="h-6 w-6 text-red-600 mr-3" />
                <div>
                  <p className="text-sm text-red-800">Rejected</p>
                  <p className="text-xl font-bold text-gray-900">
                    {stats.rejected}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="mb-6">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search requests..."
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
                        <option value="PENDING">Pending</option>
                        <option value="UNDER_REVIEW">Under Review</option>
                        <option value="APPROVED">Approved</option>
                        <option value="REJECTED">Rejected</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Urgency
                      </label>
                      <select
                        value={urgencyFilter}
                        onChange={(e) => setUrgencyFilter(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="all">All Urgency</option>
                        <option value="HIGH">High</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="LOW">Low</option>
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Requests Table */}
          <div className="overflow-hidden rounded-xl border border-gray-200">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Requester
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Reason
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <AnimatePresence mode="wait">
                    {filteredRequests.length === 0 ? (
                      <motion.tr
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <td colSpan={7} className="px-4 py-8 text-center">
                          <div className="flex flex-col items-center">
                            <User className="h-12 w-12 text-gray-400 mb-4" />
                            <p className="text-gray-600">
                              No requests match your current filters.
                            </p>
                            {(searchQuery ||
                              statusFilter !== "all" ||
                              urgencyFilter !== "all") && (
                              <button
                                onClick={() => {
                                  setSearchQuery("");
                                  setStatusFilter("all");
                                  setUrgencyFilter("all");
                                }}
                                className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
                              >
                                Clear all filters
                              </button>
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    ) : (
                      filteredRequests.map((request) => (
                        <motion.tr
                          key={request.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-4 py-4">
                            <div className="flex items-center">
                              <div className="h-10 w-10 flex-shrink-0 bg-blue-100 rounded-full flex items-center justify-center">
                                <User className="h-5 w-5 text-blue-600" />
                              </div>
                              <div className="ml-4">
                                <div className="font-medium text-gray-900">
                                  {request.name || "Anonymous"}
                                </div>
                                {request.urgency && (
                                  <Badge
                                    className={`mt-1 ${getUrgencyColor(
                                      request.urgency
                                    )}`}
                                  >
                                    {request.urgency.toLowerCase()}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="space-y-1">
                              {request.email && (
                                <div className="flex items-center text-sm text-gray-600">
                                  <Mail className="h-4 w-4 mr-2" />
                                  {request.email}
                                </div>
                              )}
                              {request.phone && (
                                <div className="flex items-center text-sm text-gray-600">
                                  <Phone className="h-4 w-4 mr-2" />
                                  {request.phone}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center text-sm font-medium text-gray-900">
                              <DollarSign className="h-4 w-4 mr-1 text-green-600" />
                              KES {request.amountRequested.toFixed(2)}
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="text-sm text-gray-600 max-w-xs truncate">
                              {request.reason}
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <Badge
                              className={`flex items-center w-min ${getStatusColor(
                                request.status
                              )}`}
                            >
                              {getStatusIcon(request.status)}
                              <span className="ml-1 capitalize">
                                {request.status.toLowerCase().replace("_", " ")}
                              </span>
                            </Badge>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center text-sm text-gray-600">
                              <Calendar className="h-4 w-4 mr-2" />
                              {new Date(request.createdAt).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleViewDetails(request)}
                                className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                                title="View details"
                              >
                                <Eye className="h-4 w-4" />
                              </button>

                              {request.status === "PENDING" ||
                              request.status === "UNDER_REVIEW" ? (
                                <>
                                  <button
                                    onClick={() =>
                                      handleStatusChange(request.id, "APPROVED")
                                    }
                                    disabled={updatingStatus[request.id]}
                                    className="p-2 text-green-600 hover:text-green-700 transition-colors disabled:opacity-50"
                                    title="Approve request"
                                  >
                                    {updatingStatus[request.id] ? (
                                      <RefreshCw className="h-4 w-4 animate-spin" />
                                    ) : (
                                      <CheckCircle className="h-4 w-4" />
                                    )}
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleStatusChange(request.id, "REJECTED")
                                    }
                                    disabled={updatingStatus[request.id]}
                                    className="p-2 text-red-600 hover:text-red-700 transition-colors disabled:opacity-50"
                                    title="Reject request"
                                  >
                                    <XCircle className="h-4 w-4" />
                                  </button>
                                </>
                              ) : (
                                <button
                                  onClick={() =>
                                    handleStatusChange(
                                      request.id,
                                      "UNDER_REVIEW"
                                    )
                                  }
                                  disabled={updatingStatus[request.id]}
                                  className="p-2 text-amber-600 hover:text-amber-700 transition-colors disabled:opacity-50"
                                  title="Mark for review"
                                >
                                  <Clock className="h-4 w-4" />
                                </button>
                              )}
                            </div>
                          </td>
                        </motion.tr>
                      ))
                    )}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {showDetailModal && selectedRequest && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-xl font-bold text-gray-900">
                    Request Details
                  </h3>
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-2">
                        Requester Information
                      </h4>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <User className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-gray-900">
                            {selectedRequest.name || "Anonymous"}
                          </span>
                        </div>
                        {selectedRequest.email && (
                          <div className="flex items-center">
                            <Mail className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="text-gray-900">
                              {selectedRequest.email}
                            </span>
                          </div>
                        )}
                        {selectedRequest.phone && (
                          <div className="flex items-center">
                            <Phone className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="text-gray-900">
                              {selectedRequest.phone}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-2">
                        Request Details
                      </h4>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-gray-900 font-medium">
                            KES {selectedRequest.amountRequested.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-gray-900">
                            {new Date(
                              selectedRequest.createdAt
                            ).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Badge
                            className={getStatusColor(selectedRequest.status)}
                          >
                            {getStatusIcon(selectedRequest.status)}
                            <span className="ml-1 capitalize">
                              {selectedRequest.status
                                .toLowerCase()
                                .replace("_", " ")}
                            </span>
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">
                      Reason for Request
                    </h4>
                    <p className="text-gray-900 bg-gray-50 p-4 rounded-lg">
                      {selectedRequest.reason}
                    </p>
                  </div>

                  {selectedRequest.notes && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-2">
                        Additional Notes
                      </h4>
                      <p className="text-gray-900 bg-blue-50 p-4 rounded-lg">
                        {selectedRequest.notes}
                      </p>
                    </div>
                  )}

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      onClick={() => setShowDetailModal(false)}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Close
                    </button>
                    <button
                      onClick={() => {
                        // Handle contact action
                        setShowDetailModal(false);
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Contact Requester
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
