import { useState } from "react";
import { motion } from "framer-motion";
import { Users } from "lucide-react";
import { BibleStudy, PrayerRequest } from "@/generated/prisma";
import { useDiscipleshipStore } from "@/store";

interface GroupFacilitationProps {
  currentStudy: (BibleStudy & { lessons: any[] }) | null; // Assuming lessons are part of BibleStudy
  prayerRequests: PrayerRequest[];
}

export default function GroupFacilitation({ currentStudy, prayerRequests }: GroupFacilitationProps) {
  const { trackPrayer, createPrayerRequest, addDiscussionPrompt, recordMeetingAttendance } = useDiscipleshipStore();
  const [newPrayerRequestText, setNewPrayerRequestText] = useState("");
  const [newPromptText, setNewPromptText] = useState("");

  const handleAddPrompt = async () => {
    if (newPromptText.trim() === "" || !currentStudy?.id) return;
    await addDiscussionPrompt(currentStudy.id, newPromptText);
    setNewPromptText("");
    alert("Discussion prompt added!");
  };

  const handleTrackPrayer = async (id: string, isUrgent: boolean) => {
    await trackPrayer(id, isUrgent);
    alert(`Prayer request ${id} urgency toggled!`);
  };

  const handleCreatePrayerRequest = async () => {
    if (newPrayerRequestText.trim() === "") return;
    await createPrayerRequest({ request: newPrayerRequestText, isUrgent: false, isPublic: true, userId: "clw021111000008l701111111" }); // Assuming a default userId
    setNewPrayerRequestText("");
    alert("Prayer request created!");
  };

  const handleRecordAttendance = async (meetingId: string) => {
    // Placeholder for userId - in a real app, this would come from auth context
    const userId = "clw021111000008l701111111"; // Replace with actual user ID
    await recordMeetingAttendance(meetingId, userId);
    alert(`Attendance recorded for meeting ${meetingId}!`);
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
        Group Facilitation Tools
      </h2>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Meeting Management
          </h3>
          <div className="mt-4 p-4 bg-white rounded-lg shadow-sm">
            <div className="font-semibold text-gray-900">{currentStudy?.title || "No current study"}</div>
            <div className="mt-2">
              <h4 className="text-md font-semibold text-gray-900">
                Discussion Prompts
              </h4>
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Add new discussion prompt"
                  value={newPromptText}
                  onChange={(e) => setNewPromptText(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
                <button
                  onClick={handleAddPrompt}
                  className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg"
                >
                  Add Prompt
                </button>
              </div>
              {currentStudy?.lessons.length === 0 ? (
                <div className="text-center py-4 text-gray-600">
                  No discussion prompts found.
                </div>
              ) : (
                currentStudy?.lessons.map((lesson, index) => (
                  <motion.div
                    key={lesson.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="text-sm text-gray-600"
                  >
                    {index + 1}. {lesson.title}
                  </motion.div>
                ))
              )}
            </div>
            <div className="mt-4">
              <h4 className="text-md font-semibold text-gray-900">
                Prayer Requests
              </h4>
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Add new prayer request"
                  value={newPrayerRequestText}
                  onChange={(e) => setNewPrayerRequestText(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
                <button
                  onClick={handleCreatePrayerRequest}
                  className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg"
                >
                  Add Prayer Request
                </button>
              </div>
              {prayerRequests.length === 0 ? (
                <div className="text-center py-4 text-gray-600">
                  No prayer requests found.
                </div>
              ) : (
                prayerRequests.map((pr, index) => (
                  <motion.div
                    key={pr.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="p-3 bg-gray-50 rounded-lg flex items-center"
                  >
                    <Users className="h-5 w-5 text-blue-600 mr-2" />
                    <div>
                      <div className="text-sm text-gray-600">
                        {pr.request} ({pr.isUrgent ? "Urgent" : "Not Urgent"})
                      </div>
                      <motion.button
                        onClick={() =>
                          handleTrackPrayer(
                            pr.id,
                            !pr.isUrgent
                          )
                        }
                        className="mt-1 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200"
                        whileHover={{ scale: 1.03 }}
                        aria-label={`Toggle urgency for ${pr.request}`}
                      >
                        {pr.isUrgent ? "Mark as Not Urgent" : "Mark as Urgent"}
                      </motion.button>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Attendance Tracking
          </h3>
          <div className="mt-4 space-y-2">
            {/* Placeholder for meetings, as they are not directly from the store */}
            <div className="text-center py-12 text-gray-600">
              No meetings found.
            </div>
            <motion.button
              onClick={() => handleRecordAttendance("someMeetingId")}
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200"
              whileHover={{ scale: 1.03 }}
              aria-label="Record attendance"
            >
              Record Attendance (Placeholder)
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}
