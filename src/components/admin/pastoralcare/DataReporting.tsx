import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { BarChart as BarChartIcon, AlertTriangle } from "lucide-react";
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const trendsRes = await fetch('/api/pastoral-care-analytics/trends');
        if (!trendsRes.ok) throw new Error('Failed to fetch trends');
        const trendsData = await trendsRes.json();
        setTrends(trendsData);

        const followUpsRes = await fetch('/api/pastoral-care-analytics/followups');
        if (!followUpsRes.ok) throw new Error('Failed to fetch follow-ups');
        const followUpsData = await followUpsRes.json();
        setFollowUps(followUpsData);

      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center py-12">
      <svg
        className="animate-spin h-8 w-8 text-blue-600"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
      <p className="ml-3 text-lg font-medium text-blue-600">Loading analytics data...</p>
    </div>
  );

  if (error) return (
    <div className="flex items-center justify-center py-12 text-red-500">
      <AlertTriangle className="h-8 w-8 text-red-600" />
      <p className="ml-3 text-lg font-medium text-red-600">Error: {error}</p>
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
      className="bg-white rounded-xl shadow-2xl p-6 border border-gray-200 backdrop-blur-sm"
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
        Data & Reporting
      </h2>
      <div className="space-y-6">
        <Card className="shadow-md rounded-lg border border-gray-100">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-800">Counseling Needs Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="Count" fill="#4F46E5" /> {/* Changed fill color to indigo-600 */}
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-md rounded-lg border border-gray-100">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-800">Follow-Up Survey Responses</CardTitle>
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
                    className="p-4 bg-gray-50 rounded-lg shadow-sm flex items-center border border-gray-100"
                  >
                    <BarChartIcon className="h-6 w-6 text-blue-600 mr-3 flex-shrink-0" />
                    <div>
                      <div className="font-semibold text-gray-900">
                        Member {followUp.memberId}
                      </div>
                      <div className="text-sm text-gray-700">
                        <span className="font-medium">{followUp.days}-Day Check-In:</span> {followUp.response}
                      </div>
                      <div className="text-xs text-gray-500">
                        Session Date: {new Date(followUp.sessionDate).toLocaleDateString()}
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <p className="text-gray-600 py-4 text-center">No follow-up data found.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
