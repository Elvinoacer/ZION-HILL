import { useState } from "react";
import { motion } from "framer-motion";
import { Database } from "lucide-react";
import { useDigitalHubStore } from "@/store/digitalHubStore";

type Asset = {
  id: number;
  title: string;
  type: "video" | "audio" | "image";
  scripture: string;
  speaker: string;
};

export default function DigitalAssetManagement() {
  const { tagAsset } = useDigitalHubStore();
  const [assets, setAssets] = useState<Asset[]>([
    {
      id: 1,
      title: "Finding Peace Sermon",
      type: "video",
      scripture: "John 16:33",
      speaker: "Pastor John Smith",
    },
  ]);

  const handleTagAsset = async (id: number) => {
    await tagAsset(id.toString(), "AI-Tagged"); // Assuming a default tag
    alert(`Asset ${id} tagged!`);
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
        Digital Asset Management
      </h2>
      <div>
        <h3 className="text-lg font-semibold text-gray-900">
          AI Tagging System
        </h3>
        <div className="mt-4 space-y-2">
          {assets.map((asset, index) => (
            <motion.div
              key={asset.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="p-4 bg-white rounded-lg shadow-sm flex items-center"
            >
              <Database className="h-5 w-5 text-blue-600 mr-2" />
              <div>
                <div className="font-semibold text-gray-900">{asset.title}</div>
                <div className="text-sm text-gray-600">
                  Type: {asset.type} | Scripture: {asset.scripture} | Speaker:{" "}
                  {asset.speaker}
                </div>
                <motion.button
                  onClick={() => handleTagAsset(asset.id)}
                  className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200"
                  whileHover={{ scale: 1.03 }}
                  aria-label={`Tag asset ${asset.title}`}
                >
                  Tag Asset
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
