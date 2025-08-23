import { motion } from "framer-motion";
import { Video } from "lucide-react";
import { useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useDigitalHubStore } from "@/store/digitalHubStore";

type Stream = {
  id: number;
  platform: "YouTube" | "Facebook" | "Website";
  status: "Live" | "Offline";
  bitrate: number;
};

export default function StreamControlCenter() {
  const { switchCameraPreset, recallLightingScene } = useDigitalHubStore();

  const [streams, setStreams] = useState<Stream[]>([
    { id: 1, platform: "YouTube", status: "Live", bitrate: 5000 },
    { id: 2, platform: "Facebook", status: "Live", bitrate: 4500 },
    { id: 3, platform: "Website", status: "Offline", bitrate: 0 },
  ]);

  const [cameraPreset, setCameraPreset] = useState("Main");
  const [lightingScene, setLightingScene] = useState("Standard");

  const bitrateData = [
    { time: "10:00", YouTube: 5000, Facebook: 4500 },
    { time: "10:05", YouTube: 4800, Facebook: 4600 },
    { time: "10:10", YouTube: 5100, Facebook: 4400 },
  ];

  const handleCameraSwitch = async (preset: string) => {
    setCameraPreset(preset);
    await switchCameraPreset(preset);
    alert(`Camera preset switched to: ${preset}`);
  };

  const handleLightingRecall = async (scene: string) => {
    setLightingScene(scene);
    await recallLightingScene(scene);
    alert(`Lighting scene recalled: ${scene}`);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8"> {/* Added responsive padding */}
      <h2 className="text-2xl font-semibold text-white mb-6">
        Stream Control Center
      </h2>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-white">
            Multi-Platform Broadcasting
          </h3>
          <div className="mt-4 space-y-2">
            {streams.map((stream, index) => (
              <motion.div
                key={stream.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="p-4 bg-gray-700/50 rounded-lg shadow-sm flex items-center border border-gray-600" /* Dark theme background and border */
              >
                <Video className="h-5 w-5 text-blue-400 mr-2" /> {/* Dark theme icon color */}
                <div>
                  <div className="font-semibold text-white"> {/* Dark theme text */}
                    {stream.platform}
                  </div>
                  <div className="text-sm text-gray-300"> {/* Dark theme text */}
                    Status: {stream.status} | Bitrate: {stream.bitrate} kbps
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="mt-4">
            <h4 className="text-md font-semibold text-white">
              Bitrate Monitoring
            </h4>
            <div className="w-full overflow-x-auto"> {/* Added for responsiveness */}
              <LineChart
                width={600} /* Keep fixed width for chart content */
                height={300}
                data={bitrateData}
                className="mt-2"
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#4b5563" /> {/* Darker grid lines */}
                <XAxis dataKey="time" stroke="#d1d5db" /> {/* Light text for axis */}
                <YAxis stroke="#d1d5db" /> {/* Light text for axis */}
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', borderColor: '#4b5563', color: '#d1d5db' }} /> {/* Darker tooltip */}
                <Line type="monotone" dataKey="YouTube" stroke="#60a5fa" /> {/* Lighter blue */}
                <Line type="monotone" dataKey="Facebook" stroke="#4ade80" /> {/* Lighter green */}
              </LineChart>
            </div>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">
            Equipment Automation
          </h3>
          <div className="mt-4 p-4 bg-gray-700/50 rounded-lg shadow-sm border border-gray-600"> {/* Dark theme background and border */}
            <div className="text-sm text-gray-300"> {/* Dark theme text */}
              Camera Preset: {cameraPreset}
            </div>
            <div className="mt-2 space-x-2">
              {["Main", "Wide", "Close"].map((preset) => (
                <motion.button
                  key={preset}
                  onClick={() => handleCameraSwitch(preset)}
                  className={`px-4 py-2 rounded-lg ${
                    cameraPreset === preset
                      ? "bg-blue-700 text-white" /* Dark theme primary button */
                      : "bg-gray-600 hover:bg-gray-500 text-gray-200" /* Dark theme secondary button */
                  }`}
                  whileHover={{ scale: 1.03 }}
                  aria-label={`Switch to ${preset} camera preset`}
                >
                  {preset}
                </motion.button>
              ))}
            </div>
            <div className="mt-4 text-sm text-gray-300"> {/* Dark theme text */}
              Lighting Scene: {lightingScene}
            </div>
            <div className="mt-2 space-x-2">
              {["Standard", "Warm", "Bright"].map((scene) => (
                <motion.button
                  key={scene}
                  onClick={() => handleLightingRecall(scene)}
                  className={`px-4 py-2 rounded-lg ${
                    lightingScene === scene
                      ? "bg-blue-700 text-white" /* Dark theme primary button */
                      : "bg-gray-600 hover:bg-gray-500 text-gray-200" /* Dark theme secondary button */
                  }`}
                  whileHover={{ scale: 1.03 }}
                  aria-label={`Recall ${scene} lighting scene`}
                >
                  {scene}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
