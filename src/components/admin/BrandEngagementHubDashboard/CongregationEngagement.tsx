import { useState } from "react";
import { motion } from "framer-motion";
import { Users } from "lucide-react";
import { Asset } from "@prisma/client";
import { useBrandEngagementStore } from "@/store";

interface CongregationEngagementProps {
  bulletins: Asset[];
}

export default function CongregationEngagement({ bulletins }: CongregationEngagementProps) {
  const { sendCommunication, recordAttendance } = useBrandEngagementStore();

  const [communications, setCommunications] = useState<any[]>([
    {
      id: 1,
      title: "Youth Retreat Invite",
      targetRoles: ["Youth"],
      channels: ["Email", "App"],
    },
    {
      id: 2,
      title: "Senior Fellowship",
      targetRoles: ["Seniors"],
      channels: ["SMS"],
    },
  ]);

  const handleSendCommunication = async (id: number) => {
    await sendCommunication(id.toString());
    alert(`Communication ${id} sent!`);
  };

  const handleAttendEvent = async (id: string) => {
    await recordAttendance(id);
    alert(`Attendance recorded for bulletin event ${id}`);
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
        Congregation Engagement
      </h2>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Targeted Communication
          </h3>
          <div className="mt-4 space-y-2">
            {communications.map((comm, index) => (
              <motion.div
                key={comm.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="p-4 bg-white rounded-lg shadow-sm flex items-center"
              >
                <Users className="h-5 w-5 text-blue-600 mr-2" />
                <div>
                  <div className="font-semibold text-gray-900">
                    {comm.title}
                  </div>
                  <div className="text-sm text-gray-600">
                    Target: {comm.targetRoles.join(", ")} | Channels:{" "}
                    {comm.channels.join(", ")}
                  </div>
                  <motion.button
                    onClick={() => handleSendCommunication(comm.id)}
                    className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200"
                    whileHover={{ scale: 1.03 }}
                    aria-label={`Send ${comm.title}`}
                  >
                    Send Campaign
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Interactive Bulletin
          </h3>
          <div className="mt-4 space-y-2">
            {bulletins.length === 0 ? (
              <div className="text-center py-12 text-gray-600">
                No bulletins found.
              </div>
            ) : (
              bulletins.map((bulletin, index) => (
                <motion.div
                  key={bulletin.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="p-4 bg-white rounded-lg shadow-sm flex items-center"
                >
                  <Users className="h-5 w-5 text-blue-600 mr-2" />
                  <div>
                    <div className="font-semibold text-gray-900">
                      {bulletin.name}
                    </div>
                    <a
                      href={bulletin.url || "#"}
                      className="text-sm text-blue-600 hover:underline"
                      aria-label={`View ${bulletin.name}`}
                    >
                      View Bulletin
                    </a>
                    <motion.button
                      onClick={() => handleAttendEvent(bulletin.id)}
                      className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200"
                      whileHover={{ scale: 1.03 }}
                      aria-label={`Attend event in ${bulletin.name}`}
                    >
                      I&apos;ll Attend
                    </motion.button>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
