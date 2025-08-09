import { motion } from "framer-motion";
import {
  BookOpen,
  FileText,
  Video,
  Music,
  Download,
  Search,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Asset } from "@prisma/client";

interface ResourcesOverviewProps {
  resources: Asset[];
}

const theme = {
  primary: "bg-blue-600",
  primaryHover: "hover:bg-blue-700",
  secondary: "bg-gray-200",
  secondaryHover: "hover:bg-gray-300",
  textPrimary: "text-gray-900",
  textSecondary: "text-gray-600",
  accentBlue: "bg-blue-100",
  accentGreen: "bg-green-100",
  accentPurple: "bg-purple-100",
};

export default function ResourcesOverview({ resources }: ResourcesOverviewProps) {
  const [activeCategory, setActiveCategory] = useState<
    "all" | "sermon" | "study" | "audio" | "document"
  >("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isDownloading, setIsDownloading] = useState<string | null>(null);

  const filteredResources = resources.filter((resource) => {
    const matchesCategory =
      activeCategory === "all" || resource.type.toLowerCase() === activeCategory;
    const matchesSearch =
      searchQuery.trim() === "" ||
      resource.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case "VIDEO":
        return <Video className="h-5 w-5 text-blue-600" aria-hidden="true" />;
      case "AUDIO":
        return <Music className="h-5 w-5 text-purple-600" aria-hidden="true" />;
      case "DOCUMENT":
        return <FileText className="h-5 w-5 text-green-600" aria-hidden="true" />;
      default:
        return <FileText className="h-5 w-5 text-gray-600" aria-hidden="true" />;
    }
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

  return (
    <motion.div
      className=" rounded-xl shadow-md overflow-hidden bg-blue-50/50"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      role="region"
      aria-labelledby="resources-overview-heading"
    >
      <div className="p-6">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <h2
            id="resources-overview-heading"
            className={`text-2xl font-semibold flex items-center ${theme.textPrimary}`}
          >
            <BookOpen className="mr-2 h-5 w-5" aria-hidden="true" /> Church
            Resources
          </h2>
          <div className="relative w-full sm:w-64">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-600"
              aria-hidden="true"
            />
            <input
              type="text"
              id="resource-search"
              placeholder="Search resources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-200 focus:border-blue-600 text-gray-900"
              aria-describedby="resource-search-desc"
            />
            <p id="resource-search-desc" className="sr-only">
              Search for resources by title, speaker, author, artist, category,
              or format.
            </p>
          </div>
        </div>

        <div
          className="flex flex-wrap gap-3 mb-6"
          role="tablist"
          aria-label="Resource categories"
        >
          {[
            { id: "all", label: "All Resources" },
            { id: "sermon", label: "Sermons" },
            { id: "study", label: "Bible Studies" },
            { id: "audio", label: "Worship Music" },
            { id: "document", label: "Documents" },
          ].map((category) => (
            <motion.button
              key={category.id}
              onClick={() =>
                setActiveCategory(
                  category.id as
                    | "all"
                    | "sermon"
                    | "study"
                    | "audio"
                    | "document"
                )
              }
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ease-out focus:outline-none focus:ring-4 focus:ring-blue-200 ${
                activeCategory === category.id
                  ? `${theme.primary} text-white`
                  : `${theme.secondary} ${theme.textSecondary} ${theme.secondaryHover}`
              }`}
              whileHover={{ scale: 1.03 }}
              role="tab"
              aria-selected={activeCategory === category.id}
              aria-controls={`${category.id}-resources`}
              id={`${category.id}-tab`}
            >
              {category.label}
            </motion.button>
          ))}
        </div>
      </div>

      <div
        id={`${activeCategory}-resources`}
        className="px-6 pb-6"
        role="tabpanel"
        aria-labelledby={`${activeCategory}-tab`}
      >
        {filteredResources.length === 0 ? (
          <div className="text-center py-12 text-gray-600">
            No resources found matching your criteria
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((resource, index) => (
              <motion.div
                key={resource.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{
                  y: -5,
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                }}
                className={`border border-gray-200 rounded-lg overflow-hidden bg-white ${
                  resource.type === "sermon" ? "lg:col-span-2" : ""
                }`}
                role="article"
                aria-labelledby={`resource-title-${resource.id}`}
              >
                <div className="relative h-48">
                  <Image
                    src={resource.url || "/placeholder-resource.jpg"} // Assuming 'url' field for image
                    alt={`Image for ${resource.name}`}
                    className="w-full h-full object-cover"
                    width={resource.type === "sermon" ? 600 : 300}
                    height={192}
                  />
                  <div
                    className={`absolute bottom-2 right-2 px-2 py-1 rounded text-xs flex items-center ${
                      resource.type === "VIDEO"
                        ? theme.accentBlue
                        : resource.type === "AUDIO"
                        ? theme.accentPurple
                        : theme.accentGreen
                    }`}
                  >
                    {getIcon(resource.type)}
                    <span
                      className={`ml-1 ${
                        resource.type === "VIDEO"
                          ? "text-blue-800"
                          : resource.type === "AUDIO"
                          ? "text-purple-800"
                          : "text-green-800"
                      }`}
                    >
                      {resource.type === "VIDEO"
                        ? "Video"
                        : resource.type === "AUDIO"
                        ? "Audio"
                        : "PDF"}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3
                    id={`resource-title-${resource.id}`}
                    className={`font-semibold text-lg mb-1 ${theme.textPrimary}`}
                  >
                    {resource.name}
                  </h3>

                  {/* Displaying relevant fields based on resource type */}
                  <div className={`text-sm ${theme.textSecondary} mb-2`}>
                    {resource.type === "SERMON" && (
                      <>{resource.speaker || "N/A"} • {resource.length || "N/A"}</>
                    )}
                    {resource.type === "STUDY" && (
                      <>{resource.author || "N/A"} • {resource.pages || "N/A"} pages</>
                    )}
                    {resource.type === "AUDIO" && (
                      <>{resource.artist || "N/A"} • {resource.tracks || "N/A"} tracks</>
                    )}
                    {resource.type === "DOCUMENT" && (
                      <>{resource.category || "N/A"} • {resource.pages || "N/A"} pages</>
                    )}
                  </div>

                  <div className="flex justify-between items-center mt-3">
                    <div className={`text-sm ${theme.textSecondary}`}>
                      {new Date(resource.createdAt).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}{" "}
                      • {resource.downloads || 0} downloads
                    </div>
                    <motion.button
                      className={`flex items-center px-3 py-1 rounded-lg text-sm font-semibold transition-all duration-200 ease-out focus:outline-none focus:ring-4 focus:ring-blue-200 ${
                        isDownloading === resource.id
                          ? "bg-blue-400 text-white cursor-not-allowed"
                          : `${theme.primary} text-white ${theme.primaryHover}`
                      }`}
                      whileHover={{ scale: 1.03 }}
                      onClick={() =>
                        handleDownload(resource.id, resource.name)
                      }
                      disabled={isDownloading === resource.id}
                      aria-label={`Download ${resource.name}`}
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
                        : "Download"}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
