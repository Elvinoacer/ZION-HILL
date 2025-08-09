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
    <div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
        Stream Control Center
      </h2>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Multi-Platform Broadcasting
          </h3>
          <div className="mt-4 space-y-2">
            {streams.map((stream, index) => (
              <motion.div
                key={stream.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="p-4 bg-white rounded-lg shadow-sm flex items-center"
              >
                <Video className="h-5 w-5 text-blue-600 mr-2" />
                <div>
                  <div className="font-semibold text-gray-900">
                    {stream.platform}
                  </div>
                  <div className="text-sm text-gray-600">
                    Status: {stream.status} | Bitrate: {stream.bitrate} kbps
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="mt-4">
            <h4 className="text-md font-semibold text-gray-900">
              Bitrate Monitoring
            </h4>
            <LineChart
              width={600}
              height={300}
              data={bitrateData}
              className="mt-2"
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="YouTube" stroke="#2563eb" />
              <Line type="monotone" dataKey="Facebook" stroke="#16a34a" />
            </LineChart>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Equipment Automation
          </h3>
          <div className="mt-4 p-4 bg-white rounded-lg shadow-sm">
            <div className="text-sm text-gray-600">
              Camera Preset: {cameraPreset}
            </div>
            <div className="mt-2 space-x-2">
              {["Main", "Wide", "Close"].map((preset) => (
                <motion.button
                  key={preset}
                  onClick={() => handleCameraSwitch(preset)}
                  className={`px-4 py-2 rounded-lg ${
                    cameraPreset === preset
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                  whileHover={{ scale: 1.03 }}
                  aria-label={`Switch to ${preset} camera preset`}
                >
                  {preset}
                </motion.button>
              ))}
            </div>
            <div className="mt-4 text-sm text-gray-600">
              Lighting Scene: {lightingScene}
            </div>
            <div className="mt-2 space-x-2">
              {["Standard", "Warm", "Bright"].map((scene) => (
                <motion.button
                  key={scene}
                  onClick={() => handleLightingRecall(scene)}
                  className={`px-4 py-2 rounded-lg ${
                    lightingScene === scene
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 hover:bg-gray-300"
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
