import { useState } from "react";
import { motion } from "framer-motion";
import { Share2, CheckCircle } from "lucide-react";
import { Asset } from "@/generated/prisma";
import { useBrandEngagementStore } from "@/store";

interface ContentCreationProps {
  templates: Asset[];
  assets: Asset[];
}

export default function ContentCreation({ templates, assets }: ContentCreationProps) {
  const { postContent, runStyleCheck } = useBrandEngagementStore();
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);

  const platforms = ["Website", "Facebook", "Instagram", "YouTube"];

  const handlePost = async (templateId: string) => {
    await postContent(templateId, selectedPlatforms);
    alert("Content posted successfully!");
  };

  const handleStyleCheck = async (assetId: string) => {
    await runStyleCheck(assetId);
    alert("Style check initiated!");
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
        Content Creation & Distribution
      </h2>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Unified Publishing Console
          </h3>
          <div className="mt-4">
            <div className="flex space-x-2">
              {platforms.map((platform) => (
                <motion.button
                  key={platform}
                  className={`px-4 py-2 rounded-lg ${
                    selectedPlatforms.includes(platform)
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                  onClick={() =>
                    setSelectedPlatforms((prev) =>
                      prev.includes(platform)
                        ? prev.filter((p) => p !== platform)
                        : [...prev, platform]
                    )
                  }
                  whileHover={{ scale: 1.03 }}
                  aria-label={`Toggle ${platform} for posting`}
                >
                  {platform}
                </motion.button>
              ))}
            </div>
            <div className="mt-4 space-y-2">
              {templates.length === 0 ? (
                <div className="text-center py-12 text-gray-600">
                  No templates found.
                </div>
              ) : (
                templates.map((template, index) => (
                  <motion.div
                    key={template.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="p-4 bg-white rounded-lg shadow-sm flex items-center"
                  >
                    <Share2 className="h-5 w-5 text-blue-600 mr-2" />
                    <div>
                      <div className="font-semibold text-gray-900">
                        {template.name}
                      </div>
                      <div className="text-sm text-gray-600">
                        {/* Assuming template.url or similar for display */}
                        Template ID: {template.id}
                      </div>
                      <motion.button
                        onClick={() => handlePost(template.id)}
                        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200"
                        whileHover={{ scale: 1.03 }}
                        aria-label={`Post ${template.name}`}
                      >
                        Post to Selected Platforms
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
            Brand Asset Management
          </h3>
          <div className="mt-4 space-y-2">
            {assets.length === 0 ? (
              <div className="text-center py-12 text-gray-600">
                No assets found.
              </div>
            ) : (
              assets.map((asset, index) => (
                <motion.div
                  key={asset.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="p-4 bg-white rounded-lg shadow-sm flex items-center"
                >
                  <CheckCircle className="h-5 w-5 text-blue-600 mr-2" />
                  <div>
                    <div className="font-semibold text-gray-900">
                      {asset.name}
                    </div>
                    <div className="text-sm text-gray-600">
                      Type: {asset.type}
                    </div>
                    <motion.button
                      onClick={() => handleStyleCheck(asset.id)}
                      className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200"
                      whileHover={{ scale: 1.03 }}
                      aria-label={`Check style for ${asset.name}`}
                    >
                      Run Style Check
                    </motion.button>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
