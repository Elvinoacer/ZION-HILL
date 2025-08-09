import { useState } from "react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { BarChart as BarChartIcon } from "lucide-react";

type Need = {
  id: number;
  ministry: string;
  sun9am: number;
  sun11am: number;
};

type RetentionMetric = {
  id: number;
  ministry: string;
  role: string;
  turnoverRate: number;
};

export default function ReportingAnalytics() {
  const [needs, setNeeds] = useState<Need[]>([
    { id: 1, ministry: "Nursery", sun9am: -3, sun11am: 2 },
    { id: 2, ministry: "Welcome", sun9am: 1, sun11am: -1 },
  ]);

  const [retentionMetrics, setRetentionMetrics] = useState<RetentionMetric[]>([
    { id: 1, ministry: "Nursery", role: "Caregiver", turnoverRate: 0.15 },
    { id: 2, ministry: "Welcome", role: "Greeter", turnoverRate: 0.1 },
  ]);

  const heatmapData = needs.map((need) => ({
    name: need.ministry,
    "9am": need.sun9am,
    "11am": need.sun11am,
  }));

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
        Reporting & Analytics
      </h2>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Gap Identification
          </h3>
          <div className="mt-4">
            <BarChart width={600} height={300} data={heatmapData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="9am" fill="#2563eb" />
              <Bar dataKey="11am" fill="#16a34a" />
            </BarChart>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Retention Metrics
          </h3>
          <div className="mt-4 space-y-2">
            {retentionMetrics.map((metric, index) => (
              <motion.div
                key={metric.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="p-4 bg-white rounded-lg shadow-sm flex items-center"
              >
                <BarChartIcon className="h-5 w-5 text-blue-600 mr-2" />
                <div>
                  <div className="font-semibold text-gray-900">
                    {metric.ministry} - {metric.role}
                  </div>
                  <div className="text-sm text-gray-600">
                    Turnover Rate: {(metric.turnoverRate * 100).toFixed(1)}%
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
