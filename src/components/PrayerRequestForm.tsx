// components/PrayerRequestForm.tsx
import { motion } from "framer-motion";
import { useState } from "react";

export default function PrayerRequestForm() {
  const [request, setRequest] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);

  return (
    <motion.div
      className="bg-white rounded-xl p-6 shadow"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-xl font-bold mb-4">Submit Prayer Request</h3>
      <textarea
        className="w-full p-3 border border-gray-300 rounded-lg mb-4"
        rows={4}
        placeholder="Enter your prayer request..."
        value={request}
        onChange={(e) => setRequest(e.target.value)}
      />
      <div className="flex items-center mb-4">
        <input
          type="checkbox"
          id="anonymous"
          checked={isAnonymous}
          onChange={() => setIsAnonymous(!isAnonymous)}
          className="mr-2"
        />
        <label htmlFor="anonymous">Submit anonymously</label>
      </div>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
      >
        Submit Request
      </motion.button>
    </motion.div>
  );
}
