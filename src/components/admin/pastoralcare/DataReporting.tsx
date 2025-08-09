import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { BarChart as BarChartIcon } from "lucide-react";
import { useEffect, useState } from "react";

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

  if (loading) {
    return <div className="text-center py-8">Loading analytics data...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">Error: {error}</div>;
  }

  const chartData = trends.map((trend) => ({
    name: trend.need,
    Count: trend.count,
  }));

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
        Data & Reporting
      </h2>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Trend Identification
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="Count" fill="#2563eb" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Follow-Up Surveys
          </h3>
          <div className="mt-4 space-y-2">
            {followUps.length > 0 ? (
              followUps.map((followUp, index) => (
                <motion.div
                  key={followUp.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="p-4 bg-white rounded-lg shadow-sm flex items-center"
                >
                  <BarChartIcon className="h-5 w-5 text-blue-600 mr-2" />
                  <div>
                    <div className="font-semibold text-gray-900">
                      Member {followUp.memberId}
                    </div>
                    <div className="text-sm text-gray-600">
                      {followUp.days}-Day Check-In: {followUp.response}
                    </div>
                    <div className="text-xs text-gray-500">
                      Session Date: {new Date(followUp.sessionDate).toLocaleDateString()}
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <p className="text-gray-600">No follow-up data found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
