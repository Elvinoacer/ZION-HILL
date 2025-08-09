"use client";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

type MemberProgress = {
  id: number;
  name: string;
  milestones: { date: string; milestone: string }[];
  progress: number;
};

export default function ProgressTracking() {
  const members: MemberProgress[] = [
    {
      id: 1,
      name: "John Smith",
      milestones: [
        { date: "2023-09-01", milestone: "Joined Group" },
        { date: "2023-10-01", milestone: "Completed Romans Study" },
        { date: "2023-11-01", milestone: "Led Prayer Session" },
      ],
      progress: 75,
    },
    {
      id: 2,
      name: "Sarah Johnson",
      milestones: [
        { date: "2023-08-15", milestone: "Joined Group" },
        { date: "2023-10-15", milestone: "Completed Psalms Study" },
      ],
      progress: 50,
    },
  ];

  const data = [
    { name: "Sep", John: 10, Sarah: 5 },
    { name: "Oct", John: 50, Sarah: 30 },
    { name: "Nov", John: 75, Sarah: 50 },
  ];

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
        Progress Tracking
      </h2>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Growth Map</h3>
          <LineChart width={600} height={300} data={data} className="mt-4">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="John" stroke="#2563eb" />
            <Line type="monotone" dataKey="Sarah" stroke="#16a34a" />
          </LineChart>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Journey Timelines
          </h3>
          {members.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="p-4 bg-white rounded-lg shadow-sm mt-4"
            >
              <h4 className="font-semibold text-gray-900">{member.name}</h4>
              <div className="mt-2">
                {member.milestones.map((milestone, i) => (
                  <div key={i} className="flex items-center text-gray-600">
                    <span className="w-32">{milestone.date}</span>
                    <span>{milestone.milestone}</span>
                  </div>
                ))}
              </div>
              <div className="mt-2 text-sm text-gray-600">
                Progress: {member.progress}%
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
