import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { DollarSign } from "lucide-react";

type FinancialData = {
  id: number;
  eventId: number;
  budget: number;
  expenses: number;
  revenue: number;
  vendorPayments: { vendor: string; status: "Paid" | "Pending" }[];
};

export default function FinancialOversight() {
  const financials: FinancialData[] = [
    {
      id: 1,
      eventId: 1,
      budget: 5000,
      expenses: 3000,
      revenue: 4000,
      vendorPayments: [
        { vendor: "AudioTech", status: "Paid" },
        { vendor: "Caterer", status: "Pending" },
      ],
    },
  ];

  const data = [
    { name: "Youth Camp", Budget: 5000, Expenses: 3000, Revenue: 4000 },
  ];

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
        Financial Oversight
      </h2>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Budget Overview
          </h3>
          <BarChart width={600} height={300} data={data} className="mt-4">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="Budget" fill="#2563eb" />
            <Bar dataKey="Expenses" fill="#dc2626" />
            <Bar dataKey="Revenue" fill="#16a34a" />
          </BarChart>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Vendor Payments
          </h3>
          <div className="mt-4 space-y-2">
            {financials[0].vendorPayments.map((payment, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="p-4 bg-white rounded-lg shadow-sm flex items-center"
              >
                <DollarSign className="h-5 w-5 text-blue-600 mr-2" />
                <div>
                  <div className="font-semibold text-gray-900">
                    {payment.vendor}
                  </div>
                  <div
                    className={`text-sm ${
                      payment.status === "Paid"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    Status: {payment.status}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Profit/Loss</h3>
          <div className="p-4 bg-white rounded-lg shadow-sm mt-4">
            <div className="text-sm text-gray-600">
              Profit/Loss: ${financials[0].revenue - financials[0].expenses}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
