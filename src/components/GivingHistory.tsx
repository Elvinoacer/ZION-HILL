import { motion } from "framer-motion";
import { DollarSign, Calendar, CreditCard, Building, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { exportToCsv, exportToPdf, exportToXlsx, exportToDocx } from "@/lib/export";

type Donation = {
  id: number;
  date: string;
  amount: number;
  type: string;
  method: string;
  status: string;
};

type GivingHistoryProps = {
  donations: Donation[];
};

export default function GivingHistory({ donations }: GivingHistoryProps) {
  const handleExport = (format: "csv" | "pdf" | "xlsx" | "docx") => {
    const fileName = `giving-history-${new Date().toISOString()}`;
    switch (format) {
      case "csv":
        exportToCsv(donations, fileName);
        break;
      case "pdf":
        exportToPdf(donations, fileName);
        break;
      case "xlsx":
        exportToXlsx(donations, fileName);
        break;
      case "docx":
        exportToDocx(donations, fileName);
        break;
      default:
        break;
    }
  };

  return (
    <div className="bg-gradient-to-br from-white to-blue-50 rounded-xl shadow-lg overflow-hidden">
      <div className="p-4 flex justify-end">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-40">
            <div className="grid gap-4">
              <Button variant="ghost" onClick={() => handleExport("csv")}>Export as CSV</Button>
              <Button variant="ghost" onClick={() => handleExport("pdf")}>Export as PDF</Button>
              <Button variant="ghost" onClick={() => handleExport("xlsx")}>Export as XLSX</Button>
              <Button variant="ghost" onClick={() => handleExport("docx")}>Export as DOCX</Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-2 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <Calendar className="inline mr-1 h-4 w-4" aria-hidden="true" />{" "}
                Date
              </th>
              <th className="px-2 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <DollarSign
                  className="inline mr-1 h-4 w-4"
                  aria-hidden="true"
                />{" "}
                Amount
              </th>
              <th className="px-2 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-2 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Method
              </th>
              <th className="px-2 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {donations &&
              donations.map((donation) => (
                <motion.tr
                  key={donation.id}
                  whileHover={{ backgroundColor: "rgba(243, 244, 246, 0.5)" }}
                  transition={{ duration: 0.2 }}
                  role="row"
                >
                  <td className="px-2 md:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                    {new Date(donation.date).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-2 md:px-6 py-4 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-900">
                    KES {donation.amount.toLocaleString()}
                  </td>
                  <td className="px-2 md:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-600">
                    {donation.type}
                  </td>
                  <td className="px-2 md:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-600">
                    {donation.method}
                  </td>
                  <td className="px-2 md:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-600">
                    {donation.status}
                  </td>
                </motion.tr>
              ))}
          </tbody>
        </table>
      </div>
      {donations && donations.length === 0 && (
        <div className="text-center py-8 text-gray-600">
          No donation history available
        </div>
      )}
    </div>
  );
}
