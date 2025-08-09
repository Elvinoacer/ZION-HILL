import { useState } from "react";
import { motion } from "framer-motion";
import { Film, Scissors } from "lucide-react";
import { useDigitalHubStore } from "@/store/digitalHubStore";

type Sermon = {
  id: number;
  title: string;
  status: "Processing" | "Completed";
  highlights: string[];
  audioStatus: "Mastered" | "Pending";
};

export default function MediaProduction() {
  const { processSermon } = useDigitalHubStore();
  const [sermons, setSermons] = useState<Sermon[]>([
    {
      id: 1,
      title: "Finding Peace",
      status: "Processing",
      highlights: ["0:30-1:00", "5:20-6:10"],
      audioStatus: "Pending",
    },
  ]);

  const handleProcessSermon = async (id: number) => {
    await processSermon(id.toString());
    setSermons((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, status: "Completed", audioStatus: "Mastered" } : s
      )
    );
    alert(`Sermon ${id} processed!`);
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
        Media Production Pipeline
      </h2>
      <div>
        <h3 className="text-lg font-semibold text-gray-900">
          Sermon Post-Production
        </h3>
        <div className="mt-4 space-y-2">
          {sermons.map((sermon, index) => (
            <motion.div
              key={sermon.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="p-4 bg-white rounded-lg shadow-sm flex items-center"
            >
              <Film className="h-5 w-5 text-blue-600 mr-2" />
              <div>
                <div className="font-semibold text-gray-900">
                  {sermon.title}
                </div>
                <div className="text-sm text-gray-600">
                  Status: {sermon.status} | Audio: {sermon.audioStatus}
                </div>
                <div className="text-sm text-gray-600">
                  Highlights: {sermon.highlights.join(", ")}
                </div>
                <motion.button
                  onClick={() => handleProcessSermon(sermon.id)}
                  className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200"
                  whileHover={{ scale: 1.03 }}
                  aria-label={`Process sermon ${sermon.title}`}
                >
                  <Scissors className="h-4 w-4 inline mr-1" /> Process Sermon
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
