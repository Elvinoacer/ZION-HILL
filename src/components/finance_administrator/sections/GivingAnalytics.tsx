import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { DollarSign, Users, BarChart3, Eye } from "lucide-react";
import GenerousGiversModal from "./GenerousGiversModal";

interface GivingAnalyticsData {
  totalGiving: number;
  numberOfGivers: number;
  averageGiving: number;
  givingHistory: any[];
}

export default function GivingAnalytics() {
  const [analytics, setAnalytics] = useState<GivingAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch("/api/giving/analytics");
        if (!response.ok) {
          throw new Error("Failed to fetch giving analytics");
        }
        const data = await response.json();
        setAnalytics(data);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!analytics) {
    return <div>No analytics data found.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
          Giving Analytics
        </h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          <Eye className="h-4 w-4 mr-2" />
          View Our Generous Givers
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          title="Total Giving"
          value={`KES ${analytics.totalGiving.toLocaleString()}`}
          icon={<DollarSign className="h-6 w-6 text-blue-600" />}
          color="blue"
        />
        <StatCard
          title="Number of Givers"
          value={analytics.numberOfGivers.toString()}
          icon={<Users className="h-6 w-6 text-purple-600" />}
          color="purple"
        />
        <StatCard
          title="Average Giving"
          value={`KES ${analytics.averageGiving.toLocaleString(undefined, {
            maximumFractionDigits: 0,
          })}`}
          icon={<BarChart3 className="h-6 w-6 text-green-600" />}
          color="green"
        />
      </div>
      {isModalOpen && <GenerousGiversModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
}

const StatCard = ({ title, value, icon, color }: { title: string, value: string, icon: React.ReactNode, color: string }) => (
  <div className={`bg-${color}-50 p-4 rounded-xl border border-${color}-200 flex items-center`}>
    <div className={`p-3 rounded-lg bg-${color}-100 mr-4`}>{icon}</div>
    <div>
      <p className={`text-sm text-${color}-800`}>{title}</p>
      <p className="text-xl font-bold text-gray-900">{value}</p>
    </div>
  </div>
);
