import { motion } from "framer-motion";
import { useState } from "react";
import { useFamilyStore } from "@/store";

export default function CreateFamilyUnitForm() {
  const { createFamily } = useFamilyStore();
  const [familyName, setFamilyName] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createFamily({ name: familyName });
    setFamilyName("");
  };

  return (
    <motion.div
      className="bg-gradient-to-br from-white to-blue-50 rounded-xl p-6 shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      role="region"
      aria-labelledby="create-family-unit-heading"
    >
      <h3
        id="create-family-unit-heading"
        className="text-xl font-semibold mb-4 text-gray-800"
      >
        Create Family Unit
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="familyName"
            className="block text-sm font-medium text-gray-800 mb-1"
          >
            Family Unit Name
          </label>
          <input
            id="familyName"
            type="text"
            name="familyName"
            value={familyName}
            onChange={(e) => setFamilyName(e.target.value)}
            placeholder="Enter family unit name"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-white text-gray-800 placeholder-gray-500"
            required
            aria-required="true"
            aria-describedby="family-name-desc"
          />
          <p id="family-name-desc" className="text-sm text-gray-600 mt-1">
            Enter the name for the new family unit (e.g., "The Smith Family").
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-2 rounded-md hover:from-blue-600 hover:to-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
        >
          Create Family Unit
        </motion.button>
      </form>
    </motion.div>
  );
}
