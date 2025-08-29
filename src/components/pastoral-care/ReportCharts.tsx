'use client';

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  LineChart,
  Line,
} from 'recharts';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 border border-gray-200 rounded-lg shadow-sm">
        <p className="label font-bold">{`${label}`}</p>
        {payload.map((pld: any, index: number) => (
          <p key={index} style={{ color: pld.color }}>{`${pld.name}: ${pld.value}`}</p>
        ))}
      </div>
    );
  }

  return null;
};

export const SessionStatusChart = ({ data }: { data: any[] }) => (
  <ResponsiveContainer width="100%" height={250}>
    <PieChart>
      <Pie
        data={data}
        cx="50%"
        cy="50%"
        labelLine={false}
        outerRadius={80}
        fill="#8884d8"
        dataKey="value"
        nameKey="name"
        label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip content={<CustomTooltip />} />
      <Legend iconType="circle" />
    </PieChart>
  </ResponsiveContainer>
);

export const MonthlyTrendsChart = ({ data }: { data: any[] }) => (
  <ResponsiveContainer width="100%" height={300}>
    <LineChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
      <CartesianGrid strokeDasharray="3 3" vertical={false} />
      <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
      <YAxis stroke="#9ca3af" fontSize={12} />
      <Tooltip content={<CustomTooltip />} />
      <Legend iconType="plainline" />
      <Line type="monotone" dataKey="new" stroke="#3b82f6" strokeWidth={2} name="New Sessions" />
      <Line type="monotone" dataKey="completed" stroke="#10b981" strokeWidth={2} name="Completed" />
    </LineChart>
  </ResponsiveContainer>
);

export const TopTopicsChart = ({ data }: { data: any[] }) => (
  <ResponsiveContainer width="100%" height={300}>
    <BarChart data={data} layout="vertical" margin={{ top: 5, right: 20, left: 40, bottom: 5 }}>
      <CartesianGrid strokeDasharray="3 3" horizontal={false} />
      <XAxis type="number" stroke="#9ca3af" fontSize={12} />
      <YAxis type="category" dataKey="name" width={80} stroke="#9ca3af" fontSize={12} />
      <Tooltip content={<CustomTooltip />} />
      <Bar dataKey="value" fill="#3b82f6" name="Total Sessions" barSize={20} />
    </BarChart>
  </ResponsiveContainer>
);
