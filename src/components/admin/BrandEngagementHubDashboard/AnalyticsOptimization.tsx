import { useState } from "react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { BarChart2 } from "lucide-react";
import { useBrandEngagementStore } from "@/store";

type Metric = {
  id: number;
  platform: string;
  reach?: number;
  clicks?: number;
  openRate?: string;
};

export default function AnalyticsOptimization() {
  const { runAbTest } = useBrandEngagementStore();

  const [metrics, setMetrics] = useState<Metric[]>([
    { id: 1, platform: "Facebook", reach: 1200, clicks: 42 },
    { id: 2, platform: "Email", openRate: "68%" },
  ]);

  const [abTests, setAbTests] = useState([
    {
      id: 1,
      title: "Sermon Thumbnail A vs. B",
      metric: "Clicks",
      status: "Running",
    },
  ]);

  const chartData = metrics
    .filter((m) => m.reach)
    .map((m) => ({
      platform: m.platform,
      Reach: m.reach,
      Clicks: m.clicks,
    }));

  const handleRunAbTest = async (id: number) => {
    await runAbTest(id.toString());
    alert(`A/B test ${id} initiated!`);
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
        Analytics & Optimization
      </h2>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Performance Dashboards
          </h3>
          <div className="mt-4">
            <BarChart width={600} height={300} data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="platform" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="Reach" fill="#2563eb" />
              <Bar dataKey="Clicks" fill="#16a34a" />
            </BarChart>
            <div className="mt-4 space-y-2">
              {metrics.map((metric, index) => (
                <motion.div
                  key={metric.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="p-4 bg-white rounded-lg shadow-sm flex items-center"
                >
                  <BarChart2 className="h-5 w-5 text-blue-600 mr-2" />
                  <div>
                    <div className="font-semibold text-gray-900">
                      {metric.platform}
                    </div>
                    <div className="text-sm text-gray-600">
                      {metric.reach
                        ? `Reach: ${metric.reach} | Clicks: ${metric.clicks}`
                        : `Open Rate: ${metric.openRate}`}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            A/B Testing Tools
          </h3>
          <div className="mt-4 space-y-2">
            {abTests.map((test, index) => (
              <motion.div
                key={test.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="p-4 bg-white rounded-lg shadow-sm flex items-center"
              >
                <BarChart2 className="h-5 w-5 text-blue-600 mr-2" />
                <div>
                  <div className="font-semibold text-gray-900">
                    {test.title}
                  </div>
                  <div className="text-sm text-gray-600">
                    Metric: {test.metric} | Status: {test.status}
                  </div>
                  <motion.button
                    onClick={() => handleRunAbTest(test.id)}
                    className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200"
                    whileHover={{ scale: 1.03 }}
                    aria-label={`Run ${test.title}`}
                  >
                    Run Test
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
