import { Fund } from "@/generated/prisma";
import { motion } from "framer-motion";
import { DollarSign } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";

interface FundraisingTrackerProps {
  fundraisers: Fund[];
}

export default function FundraisingTracker({
  fundraisers,
}: FundraisingTrackerProps) {
  const chartData = fundraisers.map((f) => ({
    title: f.name,
    Goal: f.goalAmount,
    Raised: f.raisedAmount,
  }));

  console.log(fundraisers);

  const handleAddFundraiser = () => {
    console.log("Adding new fundraiser to /api/fundraisers");
    // In a real app, you would call a Zustand action here to create a new fundraiser
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
        Fundraising Progress
      </h2>
      <motion.button
        onClick={handleAddFundraiser}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200"
        whileHover={{ scale: 1.03 }}
        aria-label="Add new fundraiser"
      >
        Add New Fundraiser
      </motion.button>
      <div className="space-y-6">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="title" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="Goal" fill="#2563eb" />
            <Bar dataKey="Raised" fill="#16a34a" />
          </BarChart>
        </ResponsiveContainer>
        <div className="space-y-4">
          {fundraisers.length === 0 ? (
            <div className="text-center py-12 text-gray-600">
              No fundraisers found.
            </div>
          ) : (
            fundraisers.map((fundraiser, index) => (
              <motion.div
                key={fundraiser.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="p-4 bg-white rounded-lg shadow-sm flex items-center"
              >
                <DollarSign className="h-5 w-5 text-blue-600 mr-2" />
                <div>
                  <div className="font-semibold text-gray-900">
                    {fundraiser.name}
                  </div>
                  <div className="text-sm text-gray-600">
                    Raised: ${fundraiser.raisedAmount} / Goal: $
                    {fundraiser.goalAmount}
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full"
                      style={{
                        width: `${
                          fundraiser.raisedAmount &&
                          fundraiser.goalAmount &&
                          (parseInt(fundraiser.raisedAmount) /
                            parseInt(fundraiser.goalAmount)) *
                            100
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
