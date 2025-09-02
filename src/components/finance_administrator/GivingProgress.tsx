'use client';
import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface GivingOpportunity {
  id: string;
  name: string;
  goalAmount: number | null;
}

interface ChartData extends GivingOpportunity {
  progress: number;
}

const GivingProgress = () => {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGivingData = async () => {
      try {
        const opportunitiesRes = await fetch('/api/giving');
        if (!opportunitiesRes.ok) {
          throw new Error('Failed to fetch giving opportunities');
        }
        const opportunities: GivingOpportunity[] = await opportunitiesRes.json();

        if (opportunities.length === 0) {
          setLoading(false);
          return;
        }

        const progressPromises = opportunities.map(async (opp) => {
          const progressRes = await fetch(`/api/giving/${opp.id}/progress`);
          if (!progressRes.ok) {
            throw new Error(`Failed to fetch progress for ${opp.name}`);
          }
          const progressData = await progressRes.json();
          return { ...opp, progress: progressData.progress };
        });

        const data = await Promise.all(progressPromises);
        setChartData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGivingData();
  }, []);

  if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div></div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Giving Progress</h2>
      {chartData.length === 0 ? (
        <div className="text-center text-gray-500 py-10">No giving opportunities found.</div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={chartData}
            margin={{
              top: 5,
              right: 20,
              left: -10,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip
              contentStyle={{ 
                borderRadius: '0.5rem',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                border: '1px solid #e5e7eb'
              }}
            />
            <Legend iconSize={10} />
            <Bar dataKey="progress" fill="#3b82f6" name="Progress (KES)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="goalAmount" fill="#a7f3d0" name="Goal (KES)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default GivingProgress;
