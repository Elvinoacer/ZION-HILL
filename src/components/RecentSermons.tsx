import { motion } from "framer-motion";
import { Play, Download } from "lucide-react";

type Sermon = {
  id: number;
  title: string;
  date: string;
  speaker: string;
  length: string;
  downloads: number;
  format: "video" | "audio";
  image: string;
};

type RecentSermonsProps = {
  sermons: Sermon[];
};

export default function RecentSermons({ sermons }: RecentSermonsProps) {
  const handlePlay = (id: number, title: string) => {
    try {
      const sermon = sermons.find((s) => s.id === id);
      if (!sermon) throw new Error(`Sermon with ID ${id} not found`);
      console.log(`Playing ${title}`);
    } catch (error) {
      console.error("Play Error:", error);
    }
  };

  const handleDownload = (id: number, title: string) => {
    try {
      const sermon = sermons.find((s) => s.id === id);
      if (!sermon) throw new Error(`Sermon with ID ${id} not found`);
      console.log(`Downloading ${title}`);
    } catch (error) {
      console.error("Download Error:", error);
    }
  };

  return (
    <motion.div
      className="bg-gradient-to-br from-white to-blue-50 rounded-xl shadow-lg p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      role="region"
      aria-labelledby="recent-sermons-heading"
    >
      <h3
        id="recent-sermons-heading"
        className="text-xl font-semibold mb-4 text-gray-800"
      >
        Recent Sermons
      </h3>
      {sermons.length === 0 ? (
        <div className="text-center py-8 text-gray-600">
          No recent sermons available
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {sermons.map((sermon) => (
            <motion.div
              key={sermon.id}
              whileHover={{
                scale: 1.02,
                y: -5,
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="border border-gray-200 rounded-lg p-4 bg-white"
              role="article"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  handlePlay(sermon.id, sermon.title);
                }
              }}
              aria-labelledby={`sermon-title-${sermon.id}`}
            >
              <h4
                id={`sermon-title-${sermon.id}`}
                className="font-semibold text-lg text-gray-800 mb-2"
              >
                {sermon.title}
              </h4>
              <div className="text-sm text-gray-600 mb-2">
                {new Date(sermon.date).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}{" "}
                • {sermon.speaker} • {sermon.length}
              </div>
              <div className="flex space-x-3">
                <motion.button
                  className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-all duration-200 ease-out focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-offset-2"
                  onClick={() => handlePlay(sermon.id, sermon.title)}
                  whileHover={{ scale: 1.05 }}
                  aria-label={`Play ${sermon.title}`}
                >
                  <Play className="mr-1 h-4 w-4" aria-hidden="true" />{" "}
                  {sermon.format === "video" ? "Watch" : "Listen"}
                </motion.button>
                <motion.button
                  className="flex items-center bg-gray-100 text-gray-800 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-200 transition-all duration-200 ease-out focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-offset-2"
                  onClick={() => handleDownload(sermon.id, sermon.title)}
                  whileHover={{ scale: 1.05 }}
                  aria-label={`Download ${sermon.title}`}
                >
                  <Download className="mr-1 h-4 w-4" aria-hidden="true" />{" "}
                  Download ({sermon.downloads})
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
      <motion.button
        className="mt-6 text-blue-600 hover:text-blue-800 text-sm font-semibold transition-all duration-200 ease-out focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-offset-2"
        whileHover={{ scale: 1.05 }}
        aria-label="View all sermons"
      >
        View All Sermons →
      </motion.button>
    </motion.div>
  );
}
