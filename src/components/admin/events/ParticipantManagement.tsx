import { motion } from "framer-motion";
import { Users } from "lucide-react";
import { useState } from "react";

type Participant = {
  id: number;
  name: string;
  eventId: number;
  status: "Registered" | "Waitlisted" | "Invited";
  price?: number;
};

export default function ParticipantManagement() {
  const [participants, setParticipants] = useState<Participant[]>([
    { id: 1, name: "John Smith", eventId: 1, status: "Registered", price: 50 },
    { id: 2, name: "Sarah Johnson", eventId: 1, status: "Waitlisted" },
  ]);

  const inviteGroup = (group: string) => {
    console.log(`Inviting ${group} group to event`);
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
        Participant Management
      </h2>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">RSVP System</h3>
          <div className="mt-4 space-y-2">
            {participants.map((participant, index) => (
              <motion.div
                key={participant.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="p-4 bg-white rounded-lg shadow-sm flex items-center"
              >
                <Users className="h-5 w-5 text-blue-600 mr-2" />
                <div>
                  <div className="font-semibold text-gray-900">
                    {participant.name}
                  </div>
                  <div className="text-sm text-gray-600">
                    Status: {participant.status}
                    {participant.price && ` | Price: $${participant.price}`}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Targeted Invitations
          </h3>
          <div className="mt-4">
            <motion.button
              onClick={() => inviteGroup("Youth")}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200"
              whileHover={{ scale: 1.03 }}
            >
              Invite Youth Group
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}
