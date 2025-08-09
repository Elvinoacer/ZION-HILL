"use client";
import { motion } from "framer-motion";
import { FaPray } from "react-icons/fa";
import { useState } from "react";

type PrayerRequest = {
  id: number;
  category: "Healing" | "Salvation";
  content: string;
  anonymous: boolean;
};

export default function SeasonalPlanning() {
  const [prayerRequests, setPrayerRequests] = useState<PrayerRequest[]>([
    {
      id: 1,
      category: "Healing",
      content: "Pray for recovery from illness",
      anonymous: true,
    },
    {
      id: 2,
      category: "Salvation",
      content: "Pray for family member's faith",
      anonymous: false,
    },
  ]);

  const [newRequest, setNewRequest] = useState({
    category: "Healing",
    content: "",
    anonymous: true,
  });

  const handleAddRequest = () => {
    setPrayerRequests([
      ...prayerRequests,
      { id: prayerRequests.length + 1, ...newRequest },
    ]);
    setNewRequest({ category: "Healing", content: "", anonymous: true });
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
        Seasonal Planning
      </h2>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Worship Team Coordination
          </h3>
          <div className="p-4 bg-white rounded-lg shadow-sm mt-4">
            <div className="text-sm text-gray-600">
              Schedule: Advent Service - Dec 1, 2023
            </div>
            <motion.button
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200"
              whileHover={{ scale: 1.03 }}
            >
              Generate Preparation Materials
            </motion.button>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Digital Prayer Wall
          </h3>
          <div className="p-4 bg-white rounded-lg shadow-sm mt-4">
            <div className="space-y-2">
              {prayerRequests.map((request, index) => (
                <motion.div
                  key={request.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-center"
                >
                  <FaPray className="h-5 w-5 text-blue-600 mr-2" />
                  <div>
                    <div className="font-semibold text-gray-900">
                      {request.category}
                    </div>
                    <div className="text-sm text-gray-600">
                      {request.anonymous ? "Anonymous" : "Public"}:{" "}
                      {request.content}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="mt-4">
              <select
                value={newRequest.category}
                onChange={(e) =>
                  setNewRequest({
                    ...newRequest,
                    category: e.target.value as any,
                  })
                }
                className="p-2 border rounded-lg"
              >
                <option value="Healing">Healing</option>
                <option value="Salvation">Salvation</option>
              </select>
              <input
                type="text"
                value={newRequest.content}
                onChange={(e) =>
                  setNewRequest({ ...newRequest, content: e.target.value })
                }
                placeholder="Enter prayer request"
                className="ml-2 p-2 border rounded-lg w-64"
              />
              <label className="ml-2">
                <input
                  type="checkbox"
                  checked={newRequest.anonymous}
                  onChange={(e) =>
                    setNewRequest({
                      ...newRequest,
                      anonymous: e.target.checked,
                    })
                  }
                />
                Anonymous
              </label>
              <motion.button
                onClick={handleAddRequest}
                className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200"
                whileHover={{ scale: 1.03 }}
              >
                Add Request
              </motion.button>
            </div>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Fasting Campaigns & Devotionals
          </h3>
          <div className="p-4 bg-white rounded-lg shadow-sm mt-4">
            <div className="text-sm text-gray-600">
              Campaign: 7-Day Prayer & Fasting (Jan 2024)
            </div>
            <motion.button
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200"
              whileHover={{ scale: 1.03 }}
            >
              Send Email/SMS Devotionals
            </motion.button>
            <div className="mt-2 text-sm text-gray-600">
              Progress: 3/7 days completed
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
