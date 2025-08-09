import { motion } from "framer-motion";
import { Calendar } from "lucide-react";
import { useState } from "react";
import { usePastoralCareStore } from "@/store/pastoralCareStore";
import { CounselingSession } from "@/generated/prisma";
import { toast } from "sonner";

type Session = CounselingSession;

export default function CounselingManagement() {
  const { sessions, bookSession } = usePastoralCareStore();
  const [newSession, setNewSession] = useState({
    clientId: "",
    date: "",
    counselorId: "",
  });
  const [bookingLoading, setBookingLoading] = useState(false);

  const handleBookSession = async () => {
    setBookingLoading(true);
    try {
      // Basic validation
      if (!newSession.clientId || !newSession.date || !newSession.counselorId) {
        toast.error("Please fill in all required fields.");
        setBookingLoading(false);
        return;
      }

      // The `bookSession` in the store expects an Omit<Session, "id">, so we construct it.
      // Assuming status and progress have default values or are set by the backend.
      await bookSession({
        clientId: newSession.clientId,
        date: new Date(newSession.date),
        counselorId: newSession.counselorId,
        status: "Scheduled", // Default status
        progress: 0, // Default progress
        notes: "", // Default notes
      });
      toast.success("Session booked successfully!");
      setNewSession({ clientId: "", date: "", counselorId: "" });
    } catch (error: any) {
      toast.error(`Failed to book session: ${error.message}`);
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
        Counseling Session Management
      </h2>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Appointment Scheduling
          </h3>
          <div className="mt-4 p-4 bg-white rounded-lg shadow-sm">
            <input
              type="text"
              placeholder="Client ID"
              value={newSession.clientId}
              onChange={(e) =>
                setNewSession({ ...newSession, clientId: e.target.value })
              }
              className="p-2 border rounded-lg mr-2"
              aria-label="Client ID"
            />
            <input
              type="date"
              value={newSession.date}
              onChange={(e) =>
                setNewSession({ ...newSession, date: e.target.value })
              }
              className="p-2 border rounded-lg mr-2"
              aria-label="Session Date"
            />
            <input
              type="text"
              placeholder="Counselor ID"
              value={newSession.counselorId}
              onChange={(e) =>
                setNewSession({ ...newSession, counselorId: e.target.value })
              }
              className="p-2 border rounded-lg mr-2"
              aria-label="Counselor ID"
            />
            <motion.button
              onClick={handleBookSession}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200"
              whileHover={{ scale: 1.03 }}
              aria-label="Book Counseling Session"
              disabled={bookingLoading}
            >
              {bookingLoading ? "Booking..." : "Book Session"}
            </motion.button>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Session Tracking
          </h3>
          <div className="mt-4 space-y-2">
            {sessions.length > 0 ? (
              sessions.map((session, index) => (
                <motion.div
                  key={session.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="p-4 bg-white rounded-lg shadow-sm flex items-center"
                >
                  <Calendar className="h-5 w-5 text-blue-600 mr-2" />
                  <div>
                    <div className="font-semibold text-gray-900">
                      Client {session.clientId} - Counselor {session.counselorId}
                    </div>
                    <div className="text-sm text-gray-600">
                      Date: {new Date(session.date).toLocaleDateString()} | Status: {session.status} | Progress:{" "}
                      {session.progress}%
                    </div>
                    <div className="text-sm text-gray-600">
                      Notes: {session.notes || "[No Notes]"}
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <p className="text-gray-600">No counseling sessions found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
