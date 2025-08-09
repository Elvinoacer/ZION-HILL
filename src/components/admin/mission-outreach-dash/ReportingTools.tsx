import { useState } from "react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { BarChart2 } from "lucide-react";

export default function ReportingTools() {
  const [metrics, setMetrics] = useState<any[]>([
    { id: 1, name: "Souls Saved", value: 50 },
    { id: 2, name: "Baptisms", value: 30 },
    { id: 3, name: "Community Service Hours", value: 200 },
  ]);

  const chartData = metrics.map((m: any) => ({
    name: m.name,
    Value: m.value,
  }));

  const handleGenerateReport = () => {
    console.log("Generating report with metrics via API call (placeholder)");
    // In a real app, you would call a backend API to generate a report
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
        Reporting Tools
      </h2>
      <motion.button
        onClick={handleGenerateReport}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200"
        whileHover={{ scale: 1.03 }}
        aria-label="Generate report"
      >
        Generate Report
      </motion.button>
      <div className="space-y-6">
        <BarChart width={600} height={300} data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="Value" fill="#2563eb" />
        </BarChart>
        <div className="space-y-4">
          {metrics.map((metric: any, index: number) => (
            <motion.div
              key={metric.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="p-4 bg-white rounded-lg shadow-sm flex items-center"
            >
              <BarChart2 className="h-5 w-5 text-blue-600 mr-2" />
              <div>
                <div className="font-semibold text-gray-900">{metric.name}</div>
                <div className="text-sm text-gray-600">
                  Value: {metric.value}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
