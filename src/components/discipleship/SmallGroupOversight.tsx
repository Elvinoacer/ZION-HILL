import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { Users, AlertTriangle } from "lucide-react";

type Group = {
  id: number;
  name: string;
  leader: string;
  members: number;
  attendance: number;
  prayerRequests: number;
  status: "Healthy" | "Struggling";
  coachingPrompt?: string;
};

export default function SmallGroupOversight() {
  const groups: Group[] = [
    {
      id: 1,
      name: "Alpha Group",
      leader: "John Smith",
      members: 12,
      attendance: 85,
      prayerRequests: 10,
      status: "Healthy",
      coachingPrompt: "Encourage deeper discussion on Romans study.",
    },
    {
      id: 2,
      name: "Beta Group",
      leader: "Sarah Johnson",
      members: 8,
      attendance: 60,
      prayerRequests: 3,
      status: "Struggling",
      coachingPrompt: "Check in with leader to address low engagement.",
    },
  ];

  const data = [
    { name: "Alpha Group", Attendance: 85, PrayerRequests: 10 },
    { name: "Beta Group", Attendance: 60, PrayerRequests: 3 },
  ];

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
        Small Group Oversight
      </h2>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Engagement Metrics
          </h3>
          <BarChart width={600} height={300} data={data} className="mt-4">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="Attendance" fill="#2563eb" />
            <Bar dataKey="PrayerRequests" fill="#16a34a" />
          </BarChart>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Group Health</h3>
          {groups.map((group, index) => (
            <motion.div
              key={group.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="p-4 bg-white rounded-lg shadow-sm mt-4 flex items-center"
            >
              <Users className="h-5 w-5 text-blue-600 mr-2" />
              <div>
                <div className="font-semibold text-gray-900">{group.name}</div>
                <div className="text-sm text-gray-600">
                  Leader: {group.leader} | Members: {group.members} |
                  Attendance: {group.attendance}% | Prayer Requests:{" "}
                  {group.prayerRequests}
                </div>
                <div
                  className={`text-sm ${
                    group.status === "Struggling"
                      ? "text-red-600"
                      : "text-green-600"
                  }`}
                >
                  Status: {group.status}
                  {group.status === "Struggling" && (
                    <AlertTriangle className="h-4 w-4 inline ml-1" />
                  )}
                </div>
                <div className="text-sm text-gray-600">
                  Coaching: {group.coachingPrompt}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
