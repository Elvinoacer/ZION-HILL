import { motion } from "framer-motion";

export default function StatsCard({
  title,
  value,
  change,
  gradient,
}: {
  title: string;
  value: string;
  change: string;
  gradient: string;
}) {
  const isPositive = change.startsWith("+");

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className={`bg-gradient-to-r ${gradient} rounded-xl shadow-md p-6 text-white`}
    >
      <h3 className="text-sm font-medium opacity-80">{title}</h3>
      <p className="text-2xl font-bold mt-2">{value}</p>
      <div className="flex items-center mt-3">
        <span
          className={`text-sm ${
            isPositive ? "text-green-200" : "text-red-200"
          }`}
        >
          {change}
        </span>
        <span className="text-xs ml-1 opacity-70">from last month</span>
      </div>
    </motion.div>
  );
}
