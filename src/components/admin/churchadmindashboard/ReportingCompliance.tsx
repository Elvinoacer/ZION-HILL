import { useState } from "react";
import { motion } from "framer-motion";
import { FileText } from "lucide-react";
import { AuditLog } from "@/generated/prisma";
import { useDonationStore } from "@/store";

interface ReportingComplianceProps {
  auditLogs: AuditLog[];
}

type FinancialReport = {
  id: number;
  fiscalYear: string;
  type: "1099" | "Contribution Statement";
  status: "Generated" | "Pending";
};

export default function ReportingCompliance({
  auditLogs,
}: ReportingComplianceProps) {
  const { generateReport } = useDonationStore();
  const [reports, setReports] = useState<FinancialReport[]>([
    { id: 1, fiscalYear: "2025", type: "1099", status: "Pending" },
    {
      id: 2,
      fiscalYear: "2025",
      type: "Contribution Statement",
      status: "Generated",
    },
  ]);

  const handleGenerateReport = async (id: number) => {
    await generateReport(id.toString());
    setReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "Generated" } : r))
    );
    alert(`Report ${id} generated!`);
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
        Reporting & Compliance
      </h2>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Tax Preparation
          </h3>
          <div className="mt-4 space-y-2">
            {reports.map((report, index) => (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="p-4 bg-white rounded-lg shadow-sm flex items-center"
              >
                <FileText className="h-5 w-5 text-blue-600 mr-2" />
                <div>
                  <div className="font-semibold text-gray-900">
                    {report.type} - {report.fiscalYear}
                  </div>
                  <div className="text-sm text-gray-600">
                    Status: {report.status}
                  </div>
                  {report.status === "Pending" && (
                    <motion.button
                      onClick={() => handleGenerateReport(report.id)}
                      className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200"
                      whileHover={{ scale: 1.03 }}
                      aria-label={`Generate ${report.type}`}
                    >
                      Generate Report
                    </motion.button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Audit Trail</h3>
          <div className="mt-4 space-y-2">
            {auditLogs?.length === 0 || !auditLogs ? (
              <div className="text-center py-12 text-gray-600">
                No audit logs found.
              </div>
            ) : (
              auditLogs?.map((log, index) => (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="p-4 bg-white rounded-lg shadow-sm flex items-center"
                >
                  <FileText className="h-5 w-5 text-blue-600 mr-2" />
                  <div>
                    <div className="font-semibold text-gray-900">
                      {log.action} by {log.userId}
                    </div>
                    <div className="text-sm text-gray-600">
                      Timestamp: {new Date(log.timestamp).toLocaleString()} |
                      Hash: {log.id}
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
