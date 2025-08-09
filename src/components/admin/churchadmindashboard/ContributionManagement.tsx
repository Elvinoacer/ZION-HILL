import { useState } from "react";
import { motion } from "framer-motion";
import { DollarSign, AlertTriangle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { Transaction } from "@prisma/client";
import { useDonationStore } from "@/store";

interface ContributionManagementProps {
  donations: Transaction[];
}

export default function ContributionManagement({ donations }: ContributionManagementProps) {
  const { sendReceipt } = useDonationStore();
  const [filter, setFilter] = useState<
    "fundId" | "paymentMethod" | "demographic"
  >("fundId");

  const donationData = donations.reduce((acc, donation) => {
    const key =
      filter === "fundId"
        ? donation.fundId || "N/A"
        : filter === "paymentMethod"
        ? donation.paymentMethod || "N/A"
        : donation.demographic || "N/A";
    acc[key] = (acc[key] || 0) + donation.amount.toNumber(); // Assuming amount is Decimal from Prisma
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(donationData).map(([name, amount]) => ({
    name,
    Amount: amount,
  }));

  const handleSendReceipt = async (id: string, template: string) => {
    await sendReceipt(id, template);
    alert(`Receipt for donation ${id} sent!`);
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
        Contribution Management
      </h2>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Intelligent Giving Tracking
          </h3>
          <div className="mt-4">
            <select
              value={filter}
              onChange={(e) =>
                setFilter(
                  e.target.value as "fundId" | "paymentMethod" | "demographic"
                )
              }
              className="p-2 border rounded-lg mb-4"
              aria-label="Filter Donations"
            >
              <option value="fundId">Fund</option>
              <option value="paymentMethod">Payment Method</option>
              <option value="demographic">Demographic</option>
            </select>
            <BarChart
              width={600}
              height={300}
              data={chartData}
              className="mt-2"
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="Amount" fill="#2563eb" />
            </BarChart>
          </div>
          <div className="mt-4 space-y-2">
            {donations.length === 0 ? (
              <div className="text-center py-12 text-gray-600">
                No donations found.
              </div>
            ) : (
              donations.map((donation, index) => (
                <motion.div
                  key={donation.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="p-4 bg-white rounded-lg shadow-sm flex items-center"
                >
                  <DollarSign className="h-5 w-5 text-blue-600 mr-2" />
                  <div>
                    <div className="font-semibold text-gray-900">
                      ${donation.amount.toNumber()} - {donation.fundId || "N/A"}
                    </div>
                    <div className="text-sm text-gray-600">
                      {donation.paymentMethod || "N/A"} | {donation.demographic || "N/A"} |{" "}
                      {new Date(donation.createdAt).toLocaleDateString()}
                      {donation.anomaly && (
                        <span className="text-red-600 ml-2">
                          Anomaly <AlertTriangle className="h-4 w-4 inline" />
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Automated Receipting
          </h3>
          <div className="mt-4 space-y-2">
            {donations.length === 0 ? (
              <div className="text-center py-12 text-gray-600">
                No donations for receipting.
              </div>
            ) : (
              donations.map((donation, index) => (
                <motion.div
                  key={donation.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="p-4 bg-white rounded-lg shadow-sm flex items-center"
                >
                  <DollarSign className="h-5 w-5 text-blue-600 mr-2" />
                  <div>
                    <div className="font-semibold text-gray-900">
                      Donation {donation.id}
                    </div>
                    <div className="text-sm text-gray-600">
                      Fund: {donation.fundId || "N/A"}
                    </div>
                    <motion.button
                      onClick={() =>
                        handleSendReceipt(donation.id, donation.fundId || "default")
                      }
                      className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200"
                      whileHover={{ scale: 1.03 }}
                      aria-label={`Send receipt for donation ${donation.id}`}
                    >
                      Send Receipt
                    </motion.button>
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
