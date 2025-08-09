import { useState } from "react";
import { motion } from "framer-motion";
import { Book } from "lucide-react";
import { useDiscipleshipStore } from "@/store";
import { Asset, PrayerRequest } from "@prisma/client";

interface ResourceDistributionProps {
  resources: Asset[];
}

export default function ResourceDistribution({ resources }: ResourceDistributionProps) {
  const { prayerRequests } = useDiscipleshipStore(); // Re-using prayerRequests as a proxy for discussions
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDiscussions = prayerRequests.filter((pr) =>
    pr.request.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
        Resource Distribution
      </h2>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Digital Library
          </h3>
          <div className="mt-4 space-y-2">
            {resources.length === 0 ? (
              <div className="text-center py-12 text-gray-600">
                No resources found.
              </div>
            ) : (
              resources.map((resource, index) => (
                <motion.div
                  key={resource.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="p-4 bg-white rounded-lg shadow-sm flex items-center"
                >
                  <Book className="h-5 w-5 text-blue-600 mr-2" />
                  <div>
                    <div className="font-semibold text-gray-900">
                      {resource.name}
                    </div>
                    <div className="text-sm text-gray-600">
                      Type: {resource.type}
                    </div>
                    <a
                      href={resource.url || "#"}
                      className="mt-1 text-blue-600 hover:underline"
                      aria-label={`Download ${resource.name}`}
                    >
                      Download
                    </a>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Discussion Archives
          </h3>
          <div className="mt-4">
            <input
              type="text"
              placeholder="Search past topics"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="p-2 border rounded-lg w-full"
              aria-label="Search discussion archives"
            />
            <div className="mt-4 space-y-2">
              {filteredDiscussions.length === 0 ? (
                <div className="text-center py-12 text-gray-600">
                  No discussions found.
                </div>
              ) : (
                filteredDiscussions.map((discussion, index) => (
                  <motion.div
                    key={discussion.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="p-4 bg-white rounded-lg shadow-sm flex items-center"
                  >
                    <Book className="h-5 w-5 text-blue-600 mr-2" />
                    <div>
                      <div className="font-semibold text-gray-900">
                        {discussion.request}
                      </div>
                      <div className="text-sm text-gray-600">
                        Status: {discussion.status}
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
