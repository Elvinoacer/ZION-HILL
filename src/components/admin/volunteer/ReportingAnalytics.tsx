import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
} from "recharts";
import {
  BarChart as BarChartIcon,
  TrendingUp,
  TrendingDown,
  PieChart as PieChartIcon,
} from "lucide-react";

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
  trend: "up" | "down";
};

type EngagementMetric = {
  id: number;
  metric: string;
  value: number;
  change: number;
};

export default function ReportingAnalytics() {
  const [needs, setNeeds] = useState<Need[]>([
    { id: 1, ministry: "Nursery", sun9am: -3, sun11am: 2 },
    { id: 2, ministry: "Welcome", sun9am: 1, sun11am: -1 },
    { id: 3, ministry: "Youth", sun9am: -2, sun11am: -1 },
    { id: 4, ministry: "Worship", sun9am: 0, sun11am: 1 },
    { id: 5, ministry: "Outreach", sun9am: 2, sun11am: 3 },
  ]);

  const [retentionMetrics, setRetentionMetrics] = useState<RetentionMetric[]>([
    {
      id: 1,
      ministry: "Nursery",
      role: "Caregiver",
      turnoverRate: 0.15,
      trend: "down",
    },
    {
      id: 2,
      ministry: "Welcome",
      role: "Greeter",
      turnoverRate: 0.1,
      trend: "up",
    },
    {
      id: 3,
      ministry: "Youth",
      role: "Mentor",
      turnoverRate: 0.12,
      trend: "up",
    },
    {
      id: 4,
      ministry: "Worship",
      role: "Musician",
      turnoverRate: 0.08,
      trend: "down",
    },
    {
      id: 5,
      ministry: "Outreach",
      role: "Coordinator",
      turnoverRate: 0.2,
      trend: "up",
    },
  ]);

  const [engagementMetrics, setEngagementMetrics] = useState<
    EngagementMetric[]
  >([
    { id: 1, metric: "Avg. Hours/Volunteer", value: 4.2, change: 0.3 },
    { id: 2, metric: "Satisfaction Score", value: 8.7, change: -0.2 },
    { id: 3, metric: "Training Completion", value: 78, change: 5 },
    { id: 4, metric: "Response Rate", value: 92, change: 2 },
  ]);

  const [timeRange, setTimeRange] = useState<"week" | "month" | "quarter">(
    "week"
  );
  const [activeTab, setActiveTab] = useState<
    "gaps" | "retention" | "engagement"
  >("gaps");

  const heatmapData = useMemo(
    () =>
      needs.map((need) => ({
        name: need.ministry,
        "9am": need.sun9am,
        "11am": need.sun11am,
      })),
    [needs]
  );

  const pieData = useMemo(
    () => [
      { name: "Nursery", value: 25 },
      { name: "Welcome", value: 20 },
      { name: "Youth", value: 18 },
      { name: "Worship", value: 15 },
      { name: "Outreach", value: 22 },
    ],
    []
  );

  const trendData = useMemo(
    () => [
      { name: "Jan", volunteers: 45 },
      { name: "Feb", volunteers: 52 },
      { name: "Mar", volunteers: 48 },
      { name: "Apr", volunteers: 55 },
      { name: "May", volunteers: 60 },
      { name: "Jun", volunteers: 65 },
    ],
    []
  );

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 border border-gray-700 p-3 rounded-lg shadow-lg">
          <p className="text-white font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p
              key={`item-${index}`}
              className="text-sm"
              style={{ color: entry.color }}
            >
              {entry.dataKey}:{" "}
              {entry.value > 0 ? `+${entry.value}` : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="text-gray-200">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <h2 className="text-2xl font-semibold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Reporting & Analytics
        </h2>

        {/* Time Range Selector */}
        <div className="flex bg-gray-700 rounded-lg p-1 w-fit">
          <button
            onClick={() => setTimeRange("week")}
            className={`px-3 py-1 text-xs sm:text-sm rounded-md transition-colors ${
              timeRange === "week"
                ? "bg-blue-600 text-white"
                : "text-gray-300 hover:text-white"
            }`}
          >
            Week
          </button>
          <button
            onClick={() => setTimeRange("month")}
            className={`px-3 py-1 text-xs sm:text-sm rounded-md transition-colors ${
              timeRange === "month"
                ? "bg-blue-600 text-white"
                : "text-gray-300 hover:text-white"
            }`}
          >
            Month
          </button>
          <button
            onClick={() => setTimeRange("quarter")}
            className={`px-3 py-1 text-xs sm:text-sm rounded-md transition-colors ${
              timeRange === "quarter"
                ? "bg-blue-600 text-white"
                : "text-gray-300 hover:text-white"
            }`}
          >
            Quarter
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex overflow-x-auto mb-6 bg-gray-800 rounded-lg p-1">
        <button
          onClick={() => setActiveTab("gaps")}
          className={`flex items-center gap-2 px-4 py-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors ${
            activeTab === "gaps"
              ? "bg-blue-600 text-white"
              : "text-gray-300 hover:text-white"
          }`}
        >
          <BarChartIcon className="h-4 w-4" />
          Gap Analysis
        </button>
        <button
          onClick={() => setActiveTab("retention")}
          className={`flex items-center gap-2 px-4 py-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors ${
            activeTab === "retention"
              ? "bg-blue-600 text-white"
              : "text-gray-300 hover:text-white"
          }`}
        >
          <TrendingUp className="h-4 w-4" />
          Retention
        </button>
        <button
          onClick={() => setActiveTab("engagement")}
          className={`flex items-center gap-2 px-4 py-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors ${
            activeTab === "engagement"
              ? "bg-blue-600 text-white"
              : "text-gray-300 hover:text-white"
          }`}
        >
          <PieChartIcon className="h-4 w-4" />
          Engagement
        </button>
      </div>

      <div className="space-y-6">
        {/* Gap Identification */}
        {activeTab === "gaps" && (
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <BarChartIcon className="h-5 w-5 text-blue-400" />
              Volunteer Gap Analysis
            </h3>

            <div className="h-64 sm:h-80 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={heatmapData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
                  <XAxis dataKey="name" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="9am"
                    name="9:00 AM Service"
                    fill="#3B82F6"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="11am"
                    name="11:00 AM Service"
                    fill="#10B981"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4 flex flex-wrap gap-4 justify-center">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded"></div>
                <span className="text-sm text-gray-300">9:00 AM Service</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span className="text-sm text-gray-300">11:00 AM Service</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-700/50 p-4 rounded-lg">
                <h4 className="text-md font-medium text-white mb-2">
                  Largest Gaps
                </h4>
                <div className="space-y-2">
                  {needs
                    .filter((need) => need.sun9am < 0 || need.sun11am < 0)
                    .sort(
                      (a, b) => a.sun9am + a.sun11am - (b.sun9am + b.sun11am)
                    )
                    .slice(0, 3)
                    .map((need) => (
                      <div
                        key={need.id}
                        className="flex justify-between items-center text-sm"
                      >
                        <span className="text-gray-300">{need.ministry}</span>
                        <span className="text-red-400 font-medium">
                          {Math.min(need.sun9am, need.sun11am)} volunteers
                          needed
                        </span>
                      </div>
                    ))}
                </div>
              </div>

              <div className="bg-gray-700/50 p-4 rounded-lg">
                <h4 className="text-md font-medium text-white mb-2">
                  Surplus Areas
                </h4>
                <div className="space-y-2">
                  {needs
                    .filter((need) => need.sun9am > 0 || need.sun11am > 0)
                    .sort(
                      (a, b) => b.sun9am + b.sun11am - (a.sun9am + a.sun11am)
                    )
                    .slice(0, 3)
                    .map((need) => (
                      <div
                        key={need.id}
                        className="flex justify-between items-center text-sm"
                      >
                        <span className="text-gray-300">{need.ministry}</span>
                        <span className="text-green-400 font-medium">
                          +{Math.max(need.sun9am, need.sun11am)} extra
                          volunteers
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Retention Metrics */}
        {activeTab === "retention" && (
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-400" />
              Retention Metrics
            </h3>

            <div className="h-64 sm:h-80 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={trendData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
                  <XAxis dataKey="name" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1F2937",
                      borderColor: "#374151",
                      color: "#F3F4F6",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="volunteers"
                    stroke="#3B82F6"
                    strokeWidth={2}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-3">
              {retentionMetrics.map((metric, index) => (
                <motion.div
                  key={metric.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="p-4 bg-gray-700/50 rounded-lg border border-gray-600/50 hover:border-blue-500/30 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-900/30 p-2 rounded-lg">
                        <BarChartIcon className="h-4 w-4 text-blue-400" />
                      </div>
                      <div>
                        <div className="font-semibold text-white">
                          {metric.ministry} - {metric.role}
                        </div>
                        <div className="text-sm text-gray-300">
                          Turnover Rate:{" "}
                          {(metric.turnoverRate * 100).toFixed(1)}%
                        </div>
                      </div>
                    </div>
                    <div
                      className={`flex items-center gap-1 ${
                        metric.trend === "up"
                          ? "text-red-400"
                          : "text-green-400"
                      }`}
                    >
                      {metric.trend === "up" ? (
                        <TrendingUp className="h-4 w-4" />
                      ) : (
                        <TrendingDown className="h-4 w-4" />
                      )}
                      <span className="text-xs font-medium">
                        {metric.trend === "up" ? "+2.5%" : "-1.2%"}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Engagement Metrics */}
        {activeTab === "engagement" && (
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <PieChartIcon className="h-5 w-5 text-blue-400" />
              Engagement Metrics
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1F2937",
                        borderColor: "#374151",
                        color: "#F3F4F6",
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-4">
                <h4 className="text-md font-medium text-white">Key Metrics</h4>
                {engagementMetrics.map((metric, index) => (
                  <div
                    key={metric.id}
                    className="p-3 bg-gray-700/50 rounded-lg border border-gray-600/50"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-300">
                        {metric.metric}
                      </span>
                      <span className="font-semibold text-white">
                        {metric.value}
                        {metric.metric === "Satisfaction Score" ? "" : "%"}
                      </span>
                    </div>
                    <div
                      className={`flex items-center gap-1 mt-1 text-xs ${
                        metric.change >= 0 ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      {metric.change >= 0 ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : (
                        <TrendingDown className="h-3 w-3" />
                      )}
                      <span>
                        {metric.change >= 0 ? "+" : ""}
                        {metric.change}
                        {metric.metric === "Satisfaction Score" ? "" : "%"} from
                        last period
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
