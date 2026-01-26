import { useEffect } from "react";
import { motion } from "framer-motion";
import { Heart, AlertTriangle } from "lucide-react";
import { useDiscipleshipStore, useUserStore } from "@/store";
import { User } from "@/generated/prisma";

export default function MemberCare() {
  const { celebrateMilestone, initiateFollowUp } = useDiscipleshipStore();
  const { users, loading, error, fetchUsers } = useUserStore(); // Assuming useUserStore has a fetchUsers

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleCelebrate = async (id: string) => {
    await celebrateMilestone(id);
    alert(`Milestone celebrated for member ${id}!`);
  };

  const handleFollowUp = async (id: string) => {
    await initiateFollowUp(id);
    alert(`Follow-up initiated for member ${id}!`);
  };

  if (loading) return <div className="text-center py-8">Loading member data...</div>;
  if (error) return <div className="text-center py-8 text-red-500">Error: {error}</div>;

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Member Care</h2>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Spiritual Health Monitoring
          </h3>
          <div className="mt-4 space-y-2">
            {users.length === 0 ? (
              <div className="text-center py-12 text-gray-600">
                No members found.
              </div>
            ) : (
              users.map((member) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="p-4 bg-white rounded-lg shadow-sm flex items-center"
                >
                  <Heart className="h-5 w-5 text-blue-600 mr-2" />
                  <div>
                    <div className="font-semibold text-gray-900">
                      {member.name}
                    </div>
                    <div className="text-sm text-gray-600">
                      Milestones:{" "}
                      {/* Assuming milestones are part of the User model or can be derived */}
                      N/A
                    </div>
                    <motion.button
                      onClick={() =>
                        handleCelebrate(member.id)
                      }
                      className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200"
                      whileHover={{ scale: 1.03 }}
                      aria-label={`Celebrate milestone for ${member.name}`}
                    >
                      Celebrate Milestone
                    </motion.button>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Personalized Follow-Up
          </h3>
          <div className="mt-4 space-y-2">
            {users.map((member) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="p-4 bg-white rounded-lg shadow-sm flex items-center"
              >
                <Heart className="h-5 w-5 text-blue-600 mr-2" />
                <div>
                  <div className="font-semibold text-gray-900">
                    {member.name}
                  </div>
                  <div className="text-sm text-gray-600">
                    {/* Assuming participation and riskAlert are part of the User model or can be derived */}
                    Participation: N/A
                    {/* {member.riskAlert && (
                      <span className="text-red-600 ml-2">
                        Declining Participation{" "}
                        <AlertTriangle className="h-4 w-4 inline" />
                      </span>
                    )} */}
                  </div>
                  {/* {member.riskAlert && ( */}
                    <motion.button
                      onClick={() => handleFollowUp(member.id)}
                      className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200"
                      whileHover={{ scale: 1.03 }}
                      aria-label={`Follow up with ${member.name}`}
                    >
                      Initiate Follow-Up
                    </motion.button>
                  {/* )} */}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
