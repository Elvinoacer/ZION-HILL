import { motion } from "framer-motion";
import { DollarSign, Calendar, CreditCard, Building } from "lucide-react";

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
  return (
    <div className="bg-gradient-to-br from-white to-blue-50 rounded-xl shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <Calendar className="inline mr-1 h-4 w-4" aria-hidden="true" />{" "}
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <DollarSign
                  className="inline mr-1 h-4 w-4"
                  aria-hidden="true"
                />{" "}
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Method
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(donation.date).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    KES {donation.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {donation.type}
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
