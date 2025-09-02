'use client';
import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface GivingHistory {
  id: string;
  date: string;
  type: string;
  amount: number;
}

const GivingHistoryChart = () => {
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const res = await fetch('/api/member/giving-history');
        if (!res.ok) {
          throw new Error('Failed to fetch giving history');
        }
        const data: GivingHistory[] = await res.json();

        if (data.length === 0) {
          setLoading(false);
          return;
        }

        const processedData = data.reduce((acc, item) => {
          const month = new Date(item.date).toLocaleString('default', { month: 'short' });
          const year = new Date(item.date).getFullYear();
          const monthYear = `${month} ${year}`;

          let monthData = acc.find((d) => d.name === monthYear);
          if (!monthData) {
            monthData = { name: monthYear };
            acc.push(monthData);
          }

          monthData[item.type] = (monthData[item.type] || 0) + item.amount;

          return acc;
        }, [] as any[]);

        setChartData(processedData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
  }, []);

  if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div></div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Giving History</h2>
      {chartData.length === 0 ? (
        <div className="text-center text-gray-500 py-10">No giving history to display in chart.</div>
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
            <Bar dataKey="Tithes" stackId="a" fill="#3b82f6" name="Tithes (KES)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Offerings" stackId="a" fill="#84cc16" name="Offerings (KES)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Building Fund" stackId="a" fill="#f97316" name="Building Fund (KES)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default GivingHistoryChart;
