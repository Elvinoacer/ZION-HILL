"use client";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { useThemeOfTheWeekStore } from "@/store/themeOfTheWeekStore";

const ThemeOfTheWeekDisplay = () => {
  const { theme, loading, error, fetchTheme } = useThemeOfTheWeekStore();

  useEffect(() => {
    fetchTheme();
  }, [fetchTheme]);

  if (loading) return <div className="text-center py-4">Loading theme...</div>;
  if (error) return <div className="text-center py-4 text-red-500">Error: {error}</div>;
  if (!theme) return <div className="text-center py-4 text-gray-500">No theme of the week available.</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-r from-purple-700 to-purple-600 rounded-xl px-8 py-4 text-white shadow-lg"
    >
      <h2 className="text-xl font-bold mb-2">Theme of the Week</h2>
      <p className="text-2xl font-extrabold mb-3 leading-tight">{theme.title}</p>
      <p className="text-base italic mb-4">'{theme.verse}'</p>
      <p className="text-sm text-purple-100">{theme.reference}</p>
    </motion.div>
  );
};

export default ThemeOfTheWeekDisplay;
