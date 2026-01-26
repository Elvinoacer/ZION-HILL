import { motion } from "framer-motion";
import { FileText, Music, Download, BookOpen } from "lucide-react";
import { useState, useEffect } from "react";
import { useResourceStore } from "@/store";
import { Asset } from "@/generated/prisma";

export default function ServiceMaterials() {
  const [searchTerm, setSearchTerm] = useState("");
  const { resources, loading, error, fetchResources } = useResourceStore();

  useEffect(() => {
    fetchResources(); // Fetch all resources
  }, [fetchResources]);

  const filteredMaterials = resources.filter(
    (material) =>
      material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getIcon = (type: string) => {
    switch (type) {
      case "DOCUMENT":
        return <FileText className="h-5 w-5 text-blue-600" aria-hidden="true" />;
      case "AUDIO":
        return <Music className="h-5 w-5 text-blue-600" aria-hidden="true" />;
      default:
        return <BookOpen className="h-5 w-5 text-blue-600" aria-hidden="true" />;
    }
  };

  if (loading) return <div className="text-center py-8">Loading service materials...</div>;
  if (error) return <div className="text-center py-8 text-red-500">Error: {error}</div>;

  return (
    <motion.div
      className="bg-gradient-to-br from-white to-blue-50 rounded-xl p-6 shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      role="region"
      aria-labelledby="service-materials-heading"
    >
      <div className="flex justify-between items-center mb-6">
        <h3
          id="service-materials-heading"
          className="text-xl font-semibold text-gray-800"
        >
          Service Materials
        </h3>
        <div className="relative">
          <label htmlFor="material-search" className="sr-only">
            Search materials
          </label>
          <svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            id="material-search"
            type="text"
            placeholder="Search by title or type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800 placeholder-gray-500"
            aria-describedby="search-desc"
          />
          <p id="search-desc" className="sr-only">
            Search materials by title or type (e.g., sermon, worship).
          </p>
        </div>
      </div>

      <ul className="space-y-4" role="list">
        {filteredMaterials.length === 0 ? (
          <div className="text-center py-12 text-gray-600">
            No service materials found.
          </div>
        ) : (
          filteredMaterials.map((material) => (
            <motion.li
              key={material.id}
              whileHover={{ x: 5 }}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              role="listitem"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  console.log(`Selected ${material.name}`);
                }
              }}
            >
              <div className="flex items-center">
                <div className="mr-4">{getIcon(material.type)}</div>
                <div>
                  <div className="font-medium text-gray-800">
                    {material.name}
                  </div>
                  <div className="text-sm text-gray-600">
                    {new Date(material.createdAt).toLocaleDateString()} •{" "}
                    {material.downloads || 0} downloads
                  </div>
                </div>
              </div>
              <button
                className="flex items-center text-blue-600 hover:text-blue-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
                aria-label={`Download ${material.name}`}
              >
                <Download className="mr-1 h-4 w-4" aria-hidden="true" /> Download
              </button>
            </motion.li>
          ))
        )}
      </ul>

      <button
        className="mt-4 text-blue-600 hover:text-blue-800 transition-colors text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
        aria-label="View all service materials"
      >
        View All Materials →
      </button>
    </motion.div>
  );
}
