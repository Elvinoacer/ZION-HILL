import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { BarChart as BarChartIcon, AlertTriangle, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Trend = {
  id: number;
  need: string;
  count: number;
};

type FollowUp = {
  id: number;
  memberId: string; // Changed to string to match dummy data
  days: 30 | 60 | 90;
  response: string;
  sessionDate: string; // Added to match dummy data
};

export default function DataReporting() {
  const [trends, setTrends] = useState<Trend[]>([]);
  const [followUps, setFollowUps] = useState<FollowUp[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const trendsRes = await fetch("/api/pastoral-care-analytics/trends");
      if (!trendsRes.ok) throw new Error("Failed to fetch trends");
      const trendsData = await trendsRes.json();
      setTrends(trendsData);

      const followUpsRes = await fetch("/api/pastoral-care-analytics/followups");
      if (!followUpsRes.ok) throw new Error("Failed to fetch follow-ups");
      const followUpsData = await followUpsRes.json();
      setFollowUps(followUpsData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
        <p className="ml-3 text-lg font-medium text-blue-400">
          Loading analytics data...
        </p>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center py-12">
        <div className="bg-red-900/30 border border-red-700/50 rounded-xl p-6 max-w-md mx-auto text-center text-white shadow-lg">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-900/50 mb-4">
            <AlertTriangle className="h-6 w-6 text-red-400" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-red-400 mb-2">
            Error
          </h2>
          <p className="text-red-300 mb-6">{error}</p>
          <button
            onClick={fetchData}
            className="bg-red-800/50 hover:bg-red-800/80 text-red-200 font-semibold py-2 px-4 rounded-lg border border-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );

  const chartData = trends.map((trend) => ({
    name: trend.need,
    Count: trend.count,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-800 rounded-xl shadow-2xl p-6 border border-gray-700/50"
    >
      <h2 className="text-2xl font-bold text-white mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
        Data & Reporting
      </h2>
      <div className="space-y-6">
        <Card className="shadow-lg rounded-xl border border-gray-700/50 bg-gray-800">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-white">
              Counseling Needs Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" tick={{ fill: "#D1D5DB" }} />
                <YAxis stroke="#9CA3AF" tick={{ fill: "#D1D5DB" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    borderColor: "#4B5563",
                    color: "#F9FAFB",
                  }}
                  labelStyle={{ color: "#F9FAFB" }}
                  itemStyle={{ color: "#F9FAFB" }}
                />
                <Bar dataKey="Count" fill="#60A5FA" /> {/* blue-400 */}
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-lg rounded-xl border border-gray-700/50 bg-gray-800">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-white">
              Follow-Up Survey Responses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mt-4 space-y-3">
              {followUps.length > 0 ? (
                followUps.map((followUp, index) => (
                  <motion.div
                    key={followUp.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="p-4 bg-gray-700/50 rounded-lg shadow-sm flex items-center border border-gray-700"
                  >
                    <BarChartIcon
                      className="h-6 w-6 text-blue-400 mr-3 flex-shrink-0"
                    />
                    <div>
                      <div className="font-semibold text-white">
                        Member {followUp.memberId}
                      </div>
                      <div className="text-sm text-gray-300">
                        <span className="font-medium">
                          {followUp.days}-Day Check-In:
                        </span>{" "}
                        {followUp.response}
                      </div>
                      <div className="text-xs text-gray-400">
                        Session Date:{" "}
                        {new Date(followUp.sessionDate).toLocaleDateString()}
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <p className="text-gray-400 py-4 text-center">
                  No follow-up data found.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}

