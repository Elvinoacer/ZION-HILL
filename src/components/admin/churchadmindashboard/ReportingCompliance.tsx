import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Download,
  Clock,
  CheckCircle,
  AlertCircle,
  Filter,
  Search,
  ChevronDown,
  X,
  Calendar,
  User,
  Shield,
  BarChart3,
  Receipt,
  FileCheck,
  FileWarning,
} from "lucide-react";
import { AuditLog } from "@/generated/prisma";
import { useDonationStore } from "@/store";

interface ReportingComplianceProps {
  auditLogs: AuditLog[];
}

type FinancialReport = {
  id: number;
  fiscalYear: string;
  type: "1099" | "Contribution Statement" | "Annual Report" | "Tax Filing";
  status: "Generated" | "Pending" | "Approved" | "Filed";
  dueDate?: string;
  generatedDate?: string;
};

export default function ReportingCompliance({
  auditLogs,
}: ReportingComplianceProps) {
  const { generateReport } = useDonationStore();
  const [reports, setReports] = useState<FinancialReport[]>([
    {
      id: 1,
      fiscalYear: "2025",
      type: "1099",
      status: "Pending",
      dueDate: "2025-01-31",
    },
    {
      id: 2,
      fiscalYear: "2025",
      type: "Contribution Statement",
      status: "Generated",
      generatedDate: "2025-01-15",
    },
    {
      id: 3,
      fiscalYear: "2024",
      type: "Annual Report",
      status: "Approved",
      generatedDate: "2024-12-15",
    },
    {
      id: 4,
      fiscalYear: "2024",
      type: "Tax Filing",
      status: "Filed",
      generatedDate: "2024-04-15",
      dueDate: "2024-04-15",
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);
  const [generatingReports, setGeneratingReports] = useState<
    Record<number, boolean>
  >({});

  // Filter and process data
  const { filteredReports, filteredAuditLogs, reportStats } = useMemo(() => {
    // Filter reports
    const filteredReports = reports.filter((report) => {
      const matchesSearch =
        searchQuery === "" ||
        report.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.fiscalYear.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || report.status === statusFilter;
      const matchesType = typeFilter === "all" || report.type === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });

    // Filter audit logs
    const filteredAuditLogs =
      auditLogs?.filter(
        (log) =>
          searchQuery === "" ||
          log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
          log.userId.toLowerCase().includes(searchQuery.toLowerCase())
      ) || [];

    // Calculate stats
    const generatedCount = reports.filter(
      (r) =>
        r.status === "Generated" ||
        r.status === "Approved" ||
        r.status === "Filed"
    ).length;
    const pendingCount = reports.filter((r) => r.status === "Pending").length;
    const dueSoonCount = reports.filter((r) => {
      if (!r.dueDate || r.status === "Filed") return false;
      const dueDate = new Date(r.dueDate);
      const today = new Date();
      const diffTime = dueDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 30 && diffDays >= 0;
    }).length;

    return {
      filteredReports,
      filteredAuditLogs,
      reportStats: {
        total: reports.length,
        generated: generatedCount,
        pending: pendingCount,
        dueSoon: dueSoonCount,
      },
    };
  }, [reports, auditLogs, searchQuery, statusFilter, typeFilter]);

  const handleGenerateReport = async (id: number) => {
    setGeneratingReports((prev) => ({ ...prev, [id]: true }));
    try {
      await generateReport(id.toString());
      setReports((prev) =>
        prev.map((r) =>
          r.id === id
            ? {
                ...r,
                status: "Generated",
                generatedDate: new Date().toISOString().split("T")[0],
              }
            : r
        )
      );
      // In a real app, you might want to use a toast notification instead of alert
      alert(`Report generated successfully!`);
    } catch (error) {
      alert(`Failed to generate report. Please try again.`);
      console.error("Error generating report:", error);
    } finally {
      setGeneratingReports((prev) => ({ ...prev, [id]: false }));
    }
  };

  const handleDownloadReport = (id: number) => {
    // Simulate download
    alert(`Downloading report ${id}...`);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Generated":
        return <FileText className="h-4 w-4 text-blue-500" />;
      case "Pending":
        return <Clock className="h-4 w-4 text-amber-500" />;
      case "Approved":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "Filed":
        return <Shield className="h-4 w-4 text-purple-500" />;
      default:
        return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Generated":
        return "bg-blue-100 text-blue-800";
      case "Pending":
        return "bg-amber-100 text-amber-800";
      case "Approved":
        return "bg-green-100 text-green-800";
      case "Filed":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "1099":
        return <Receipt className="h-5 w-5 text-blue-600" />;
      case "Contribution Statement":
        return <FileText className="h-5 w-5 text-green-600" />;
      case "Annual Report":
        return <BarChart3 className="h-5 w-5 text-purple-600" />;
      case "Tax Filing":
        return <FileCheck className="h-5 w-5 text-red-600" />;
      default:
        return <FileText className="h-5 w-5 text-gray-600" />;
    }
  };

  const isDueSoon = (dueDate?: string) => {
    if (!dueDate) return false;
    const due = new Date(dueDate);
    const today = new Date();
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30 && diffDays >= 0;
  };

  const isOverdue = (dueDate?: string) => {
    if (!dueDate) return false;
    const due = new Date(dueDate);
    const today = new Date();
    return due < today;
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
                Reporting & Compliance
              </h2>
              <p className="text-gray-600 mt-2">
                Manage financial reports and maintain audit trails
              </p>
            </div>

            <button
              onClick={() => {
                /* Export all functionality */
              }}
              className="flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 transition-colors"
            >
              <Download className="h-4 w-4 mr-2" />
              Export All
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
              <div className="flex items-center">
                <FileText className="h-6 w-6 text-blue-600 mr-3" />
                <div>
                  <p className="text-sm text-blue-800">Total Reports</p>
                  <p className="text-xl font-bold text-gray-900">
                    {reportStats.total}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-xl border border-green-200">
              <div className="flex items-center">
                <CheckCircle className="h-6 w-6 text-green-600 mr-3" />
                <div>
                  <p className="text-sm text-green-800">Generated</p>
                  <p className="text-xl font-bold text-gray-900">
                    {reportStats.generated}
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
                    {reportStats.pending}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-red-50 p-4 rounded-xl border border-red-200">
              <div className="flex items-center">
                <AlertCircle className="h-6 w-6 text-red-600 mr-3" />
                <div>
                  <p className="text-sm text-red-800">Due Soon</p>
                  <p className="text-xl font-bold text-gray-900">
                    {reportStats.dueSoon}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Reports Section */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <FileText className="h-5 w-5 mr-2 text-blue-600" />
                Financial Reports ({filteredReports.length})
              </h3>

              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search reports..."
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
                        <option value="Pending">Pending</option>
                        <option value="Generated">Generated</option>
                        <option value="Approved">Approved</option>
                        <option value="Filed">Filed</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Report Type
                      </label>
                      <select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="all">All Types</option>
                        <option value="1099">1099 Forms</option>
                        <option value="Contribution Statement">
                          Contribution Statements
                        </option>
                        <option value="Annual Report">Annual Reports</option>
                        <option value="Tax Filing">Tax Filings</option>
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
              {filteredReports.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300"
                >
                  <FileWarning className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">
                    No reports match your current filters.
                  </p>
                  {(searchQuery ||
                    statusFilter !== "all" ||
                    typeFilter !== "all") && (
                    <button
                      onClick={() => {
                        setSearchQuery("");
                        setStatusFilter("all");
                        setTypeFilter("all");
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
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  {filteredReports.map((report, index) => (
                    <motion.div
                      key={report.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="p-4 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center">
                          {getTypeIcon(report.type)}
                          <h4 className="font-semibold text-gray-900 ml-2">
                            {report.type}
                          </h4>
                        </div>
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                            report.status
                          )} flex items-center`}
                        >
                          {getStatusIcon(report.status)}
                          <span className="ml-1">{report.status}</span>
                        </span>
                      </div>

                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex justify-between">
                          <span>Fiscal Year:</span>
                          <span className="font-medium">
                            {report.fiscalYear}
                          </span>
                        </div>

                        {report.generatedDate && (
                          <div className="flex justify-between">
                            <span>Generated:</span>
                            <span className="font-medium">
                              {new Date(
                                report.generatedDate
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        )}

                        {report.dueDate && (
                          <div className="flex justify-between">
                            <span>Due Date:</span>
                            <span
                              className={`font-medium ${
                                isOverdue(report.dueDate)
                                  ? "text-red-600"
                                  : isDueSoon(report.dueDate)
                                  ? "text-amber-600"
                                  : "text-green-600"
                              }`}
                            >
                              {new Date(report.dueDate).toLocaleDateString()}
                              {isOverdue(report.dueDate) && " (Overdue)"}
                              {isDueSoon(report.dueDate) &&
                                !isOverdue(report.dueDate) &&
                                " (Due Soon)"}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="mt-4 flex flex-col sm:flex-row gap-2">
                        {report.status === "Pending" && (
                          <button
                            onClick={() => handleGenerateReport(report.id)}
                            disabled={generatingReports[report.id]}
                            className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {generatingReports[report.id] ? (
                              <Clock className="h-4 w-4 animate-spin" />
                            ) : (
                              <>
                                <FileText className="h-4 w-4 mr-2" />
                                Generate
                              </>
                            )}
                          </button>
                        )}

                        {(report.status === "Generated" ||
                          report.status === "Approved" ||
                          report.status === "Filed") && (
                          <button
                            onClick={() => handleDownloadReport(report.id)}
                            className="flex items-center justify-center px-4 py-2 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 transition-colors"
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </button>
                        )}

                        <button className="flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                          <BarChart3 className="h-4 w-4 mr-2" />
                          Preview
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Audit Trail Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Shield className="h-5 w-5 mr-2 text-blue-600" />
              Audit Trail ({filteredAuditLogs.length})
            </h3>

            <AnimatePresence mode="wait">
              {filteredAuditLogs.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300"
                >
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No audit logs found.</p>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-3"
                >
                  {filteredAuditLogs.map((log, index) => (
                    <motion.div
                      key={log.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="p-4 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <User className="h-5 w-5 text-blue-600 mr-2" />
                            <div className="font-semibold text-gray-900">
                              {log.action}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                            <div className="flex items-center">
                              <span className="font-medium mr-2">User:</span>
                              {log.userId}
                            </div>
                            <div className="flex items-center">
                              <span className="font-medium mr-2">Time:</span>
                              {new Date(log.timestamp).toLocaleString()}
                            </div>
                          </div>

                          <div className="mt-2 text-xs text-gray-500 flex items-center">
                            <Shield className="h-3 w-3 mr-1" />
                            Hash: {log.id.slice(0, 8)}...{log.id.slice(-8)}
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-2">
                          <button className="flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                            <FileText className="h-4 w-4 mr-2" />
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
