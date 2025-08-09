import { useState } from "react";
import { motion } from "framer-motion";
import { MessageSquare, AlertTriangle } from "lucide-react";
import { useDiscipleshipStore } from "@/store";

type PrayerRequest = {
  id: number;
  request: string;
  urgent: boolean;
};

type CheckIn = {
  id: number;
  member: string;
  type: string;
  trigger: string;
};

export default function CommunicationChannels() {
  const { priorityPrayer, sendCheckIn } = useDiscipleshipStore();
  const [prayerRequests, setPrayerRequests] = useState<PrayerRequest[]>([
    { id: 1, request: "Healing for Sarah", urgent: false },
    { id: 2, request: "Medical emergency in SG-12", urgent: true },
  ]);

  const [checkIns, setCheckIns] = useState<CheckIn[]>([
    { id: 1, member: "John Doe", type: "Absence", trigger: "3-day absence" },
    { id: 2, member: "Jane Smith", type: "Birthday", trigger: "2025-08-04" },
  ]);

  const handlePriorityPrayer = async (id: number) => {
    await priorityPrayer(id.toString());
    setPrayerRequests((prev) =>
      prev.map((pr) => (pr.id === id ? { ...pr, urgent: true } : pr))
    );
    alert(`Prayer request ${id} marked as urgent!`);
  };

  const handleSendCheckIn = async (id: number) => {
    await sendCheckIn(id.toString());
    alert(`Automated check-in for ${id} sent!`);
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
        Communication Channels
      </h2>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Secure Messaging
          </h3>
          <div className="mt-4 space-y-2">
            {prayerRequests.map((pr, index) => (
              <motion.div
                key={pr.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="p-4 bg-white rounded-lg shadow-sm flex items-center"
              >
                <MessageSquare className="h-5 w-5 text-blue-600 mr-2" />
                <div>
                  <div className="font-semibold text-gray-900">
                    {pr.request}
                  </div>
                  <div className="text-sm text-gray-600">
                    {pr.urgent && (
                      <span className="text-red-600">
                        Urgent <AlertTriangle className="h-4 w-4 inline" />
                      </span>
                    )}
                  </div>
                  {!pr.urgent && (
                    <motion.button
                      onClick={() => handlePriorityPrayer(pr.id)}
                      className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200"
                      whileHover={{ scale: 1.03 }}
                      aria-label={`Mark ${pr.request} as urgent`}
                    >
                      Mark as Urgent
                    </motion.button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Automated Check-Ins
          </h3>
          <div className="mt-4 space-y-2">
            {checkIns.map((checkIn, index) => (
              <motion.div
                key={checkIn.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="p-4 bg-white rounded-lg shadow-sm flex items-center"
              >
                <MessageSquare className="h-5 w-5 text-blue-600 mr-2" />
                <div>
                  <div className="font-semibold text-gray-900">
                    {checkIn.member}
                  </div>
                  <div className="text-sm text-gray-600">
                    {checkIn.type}: {checkIn.trigger}
                  </div>
                  <motion.button
                    onClick={() => handleSendCheckIn(checkIn.id)}
                    className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200"
                    whileHover={{ scale: 1.03 }}
                    aria-label={`Send check-in for ${checkIn.member}`}
                  >
                    Send Check-In
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
