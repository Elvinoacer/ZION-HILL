import { useResourceStore } from "@/store";
import { motion } from "framer-motion";
import { Download, Play } from "lucide-react";
import { useEffect, useState } from "react";

// Define the theme object here, as it's not being passed as a prop
const theme = {
  textPrimary: "text-gray-800",
  textSecondary: "text-gray-500",
  primary: "bg-blue-600",
  primaryHover: "hover:bg-blue-700",
  secondary: "bg-blue-100",
  secondaryHover: "hover:bg-blue-200",
};

export default function FeaturedResources() {
  const { sermons, resources, loading, error, fetchSermons, fetchResources } =
    useResourceStore();
  const [activeTab, setActiveTab] = useState<"sermons" | "studies">("sermons");
  const [isPlaying, setIsPlaying] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState<string | null>(null);

  useEffect(() => {
    fetchSermons();
    fetchResources();
  }, [fetchSermons, fetchResources]);

  const studies = resources.filter((res) => res.type === "RESOURCE"); // Assuming 'RESOURCE' type for studies

  const handlePlay = (id: string, title: string) => {
    setIsPlaying(id);
    setTimeout(() => {
      try {
        console.log(`Playing ${title}`);
        setIsPlaying(null);
      } catch (error) {
        console.error(`Play Error for ${title}:`, error);
        setIsPlaying(null);
      }
    }, 1000);
  };

  const handleDownload = (id: string, title: string) => {
    setIsDownloading(id);
    setTimeout(() => {
      try {
        console.log(`Downloading ${title}`);
        setIsDownloading(null);
      } catch (error) {
        console.error(`Download Error for ${title}:`, error);
        setIsDownloading(null);
      }
    }, 1000);
  };

  if (loading)
    return (
      <div className="text-center py-8">Loading featured resources...</div>
    );
  if (error)
    return <div className="text-center py-8 text-red-500">Error: {error}</div>;

  return (
    <motion.div
      className="bg-white rounded-xl shadow-md overflow-hidden bg-blue-50/50"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      role="region"
      aria-labelledby="featured-resources-heading"
    >
      <div className="p-6">
        <h3
          id="featured-resources-heading"
          className={`text-xl font-semibold mb-6 ${theme.textPrimary}`}
        >
          Featured Resources
        </h3>
        <div
          className="flex space-x-4 mb-6"
          role="tablist"
          aria-label="Featured resource tabs"
        >
          <motion.button
            onClick={() => setActiveTab("sermons")}
            className={`px-4 py-2 font-semibold rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-200 transition-all duration-200 ease-out ${
              activeTab === "sermons"
                ? `${theme.primary} text-white`
                : `${theme.secondary} ${theme.textSecondary} ${theme.secondaryHover}`
            }`}
            whileHover={{ scale: 1.03 }}
            role="tab"
            aria-selected={activeTab === "sermons"}
            aria-controls="sermons-tab"
            id="sermons-tab-button"
          >
            Recent Sermons
          </motion.button>
          <motion.button
            onClick={() => setActiveTab("studies")}
            className={`px-4 py-2 font-semibold rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-200 transition-all duration-200 ease-out ${
              activeTab === "studies"
                ? `${theme.primary} text-white`
                : `${theme.secondary} ${theme.textSecondary} ${theme.secondaryHover}`
            }`}
            whileHover={{ scale: 1.03 }}
            role="tab"
            aria-selected={activeTab === "studies"}
            aria-controls="studies-tab"
            id="studies-tab-button"
          >
            Study Materials
          </motion.button>
        </div>

        <div
          id={`${activeTab}-tab`}
          className="space-y-4"
          role="tabpanel"
          aria-labelledby={`${activeTab}-tab-button`}
        >
          {(activeTab === "sermons" ? sermons : studies).map(
            (resource, index) => (
              <motion.div
                key={resource.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{
                  y: -5,
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                }}
                className="border-l-4 border-blue-600 p-4 bg-white rounded-lg"
                role="article"
                aria-labelledby={`resource-title-${resource.id}`}
              >
                <div
                  id={`resource-title-${resource.id}`}
                  className={`font-semibold ${theme.textPrimary}`}
                >
                  {resource.name || resource.title}{" "}
                  {/* Use name for Asset, title for Sermon */}
                </div>
                <div className={`text-sm ${theme.textSecondary} mb-2`}>
                  {resource.createdAt &&
                    new Date(resource.createdAt).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  {/* Conditional rendering based on resource type */}
                  {resource.type === "SERMON" &&
                    ` • ${resource.speaker || "N/A"}`}
                  {resource.type === "RESOURCE" &&
                    ` • ${resource.author || "N/A"}`}
                  {resource.length && ` • ${resource.length}`}
                  {resource.pages && ` • ${resource.pages} pages`}
                </div>
                <div className="flex space-x-3">
                  {resource.type === "SERMON" && (
                    <motion.button
                      className={`flex items-center px-3 py-1 rounded-lg text-sm font-semibold transition-all duration-200 ease-out focus:outline-none focus:ring-4 focus:ring-blue-200 ${
                        isPlaying === resource.id
                          ? "bg-blue-400 text-white cursor-not-allowed"
                          : `${theme.primary} text-white ${theme.primaryHover}`
                      }`}
                      whileHover={{ scale: 1.03 }}
                      onClick={() =>
                        handlePlay(resource.id, resource.name || resource.title)
                      }
                      disabled={isPlaying === resource.id}
                      aria-label={`Play ${
                        resource.name || resource.title
                      } sermon`}
                    >
                      {isPlaying === resource.id ? (
                        <svg
                          className="animate-spin mr-1 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                      ) : (
                        <Play className="mr-1 h-4 w-4" aria-hidden="true" />
                      )}
                      {isPlaying === resource.id ? "Playing..." : "Listen"}
                    </motion.button>
                  )}
                  <motion.button
                    className={`flex items-center px-3 py-1 rounded-lg text-sm font-semibold transition-all duration-200 ease-out focus:outline-none focus:ring-4 focus:ring-blue-200 ${
                      isDownloading === resource.id
                        ? "bg-blue-400 text-white cursor-not-allowed"
                        : `${theme.primary} text-white ${theme.primaryHover}`
                    }`}
                    whileHover={{ scale: 1.03 }}
                    onClick={() =>
                      handleDownload(
                        resource.id,
                        resource.name || resource.title
                      )
                    }
                    disabled={isDownloading === resource.id}
                    aria-label={`Download ${resource.name || resource.title}`}
                  >
                    {isDownloading === resource.id ? (
                      <svg
                        className="animate-spin mr-1 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                    ) : (
                      <Download className="mr-1 h-4 w-4" aria-hidden="true" />
                    )}
                    {isDownloading === resource.id
                      ? "Downloading..."
                      : `Download (${resource.downloads || 0})`}
                  </motion.button>
                </div>
              </motion.div>
            )
          )}
          {(activeTab === "sermons" ? sermons : studies).length === 0 && (
            <div className="text-center py-8 text-gray-600">
              No {activeTab === "sermons" ? "sermons" : "study materials"}{" "}
              available
            </div>
          )}
        </div>

        <motion.button
          className={`mt-4 text-blue-600 hover:text-blue-800 text-sm font-semibold flex items-center transition-all duration-200 ease-out focus:outline-none focus:ring-4 focus:ring-blue-200`}
          whileHover={{ scale: 1.03 }}
          aria-label={`View all ${
            activeTab === "sermons" ? "sermons" : "materials"
          }`}
        >
          View All {activeTab === "sermons" ? "Sermons" : "Materials"} →
        </motion.button>
      </div>
    </motion.div>
  );
}
