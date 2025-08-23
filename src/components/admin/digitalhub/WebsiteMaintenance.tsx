import { useState } from "react";
import { motion } from "framer-motion";
import { useDrop, useDrag } from "react-dnd";
import { Monitor, AlertTriangle } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { useDigitalHubStore } from "@/store/digitalHubStore";

type ContentBlock = {
  id: number;
  type: "text" | "image" | "video";
  content: string;
};

export default function WebsiteMaintenance() {
  const { saveContentVersion } = useDigitalHubStore();
  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>([
    { id: 1, type: "text", content: "Welcome to our church!" },
  ]);

  const [uptimeStatus, setUptimeStatus] = useState("Online");
  const performanceData = [
    { time: "10:00", LoadTime: 1.2 },
    { time: "10:05", LoadTime: 1.3 },
    { time: "10:10", LoadTime: 1.1 },
  ];

  const [, drop] = useDrop({
    accept: "CONTENT_BLOCK",
    drop: (item: ContentBlock, monitor) => {
      setContentBlocks((prev) => [...prev, { ...item, id: prev.length + 1 }]);
    },
  });

  const handleSaveContentVersion = async () => {
    await saveContentVersion(contentBlocks);
    alert("Content version saved!");
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8"> {/* Added responsive padding */}
      <h2 className="text-2xl font-semibold text-white mb-6">
        Website and App Maintenance
      </h2>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-white">
            Uptime Monitoring
          </h3>
          <div className="mt-4 p-4 bg-gray-700/50 rounded-lg shadow-sm border border-gray-600"> {/* Dark theme background and border */}
            <div
              className={`text-sm ${
                uptimeStatus === "Online" ? "text-green-400" : "text-red-400" /* Dark theme colors */
              }`}
            >
              Status: {uptimeStatus}
              {uptimeStatus !== "Online" && (
                <AlertTriangle className="h-4 w-4 inline ml-1" />
              )}
            </div>
            <div className="mt-4">
              <h4 className="text-md font-semibold text-white">
                Performance Metrics
              </h4>
              <div className="w-full overflow-x-auto"> {/* Added for responsiveness */}
                <LineChart
                  width={600} /* Keep fixed width for chart content */
                  height={300}
                  data={performanceData}
                  className="mt-2"
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#4b5563" /> {/* Darker grid lines */}
                  <XAxis dataKey="time" stroke="#d1d5db" /> {/* Light text for axis */}
                  <YAxis stroke="#d1d5db" /> {/* Light text for axis */}
                  <Tooltip contentStyle={{ backgroundColor: '#1f2937', borderColor: '#4b5563', color: '#d1d5db' }} /> {/* Darker tooltip */}
                  <Line type="monotone" dataKey="LoadTime" stroke="#60a5fa" /> {/* Lighter blue */}
                </LineChart>
              </div>
            </div>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">
            Content Updates
          </h3>
          <div className="flex flex-col lg:flex-row space-y-6 lg:space-y-0 lg:space-x-6 mt-4"> {/* Changed to flex-col on mobile, flex-row on lg */}
            <div className="w-full lg:w-1/3"> {/* Full width on mobile, 1/3 on lg */}
              <h4 className="text-md font-semibold text-white">
                Available Blocks
              </h4>
              <div className="mt-2 space-y-2">
                {[
                  { id: 2, type: "image", content: "/images/banner.jpg" },
                  { id: 3, type: "video", content: "/videos/promo.mp4" },
                ].map((block) => (
                  <DraggableContentBlock key={block.id} block={block} />
                ))}
              </div>
            </div>
            <div
              ref={drop}
              className="w-full lg:w-2/3 p-4 bg-gray-800 rounded-lg border-2 border-dashed border-gray-600" /* Dark theme background and border */
            >
              <h4 className="text-md font-semibold text-white">
                Sandbox Editor
              </h4>
              <div className="mt-2 space-y-2">
                {contentBlocks.map((block, index) => (
                  <motion.div
                    key={block.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="p-3 bg-gray-700/50 rounded-lg shadow-sm flex items-center border border-gray-600" /* Dark theme background and border */
                  >
                    <Monitor className="h-5 w-5 text-blue-400 mr-2" /> {/* Dark theme icon color */}
                    <span className="text-gray-300"> {/* Dark theme text */}
                      {block.type}: {block.content}
                    </span>
                  </motion.div>
                ))}
              </div>
              <motion.button
                onClick={handleSaveContentVersion}
                className="mt-2 px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-500" /* Dark theme button */
                whileHover={{ scale: 1.03 }}
                aria-label="Save content version"
              >
                Save Version
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DraggableContentBlock({ block }: { block: ContentBlock }) {
  const [{ isDragging }, drag] = useDrag({
    type: "CONTENT_BLOCK",
    item: block,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      className={`p-3 bg-gray-700/50 rounded-lg shadow-sm flex items-center cursor-move border border-gray-600 ${
        isDragging ? "opacity-50" : "opacity-100"
      }`}
    >
      <Monitor className="h-5 w-5 text-blue-400 mr-2" /> {/* Dark theme icon color */}
      <span className="text-gray-300"> {/* Dark theme text */}
        {block.type}: {block.content}
      </span>
    </div>
  );
}
