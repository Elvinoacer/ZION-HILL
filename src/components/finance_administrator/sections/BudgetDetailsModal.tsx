import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  DollarSign,
  TrendingUp,
  PieChart as PieChartIcon,
  Building,
} from "lucide-react";

interface BudgetDetailsModalProps {
  budget: any | null;
  onClose: () => void;
}

export default function BudgetDetailsModal({
  budget,
  onClose,
}: BudgetDetailsModalProps) {
  if (!budget) return null;

  const remaining = budget.allocatedBudget - budget.spent;
  const utilization = budget.allocatedBudget
    ? (budget.spent / budget.allocatedBudget) * 100
    : 0;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
          className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 p-6 relative"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center pb-4 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <Building className="h-6 w-6 mr-3 text-indigo-600" />
              Budget Details
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-6 space-y-4">
            <DetailRow
              icon={<Building className="h-5 w-5 text-gray-500" />}
              label="Ministry"
              value={budget.name}
            />
            <DetailRow
              icon={<DollarSign className="h-5 w-5 text-gray-500" />}
              label="Allocated Budget"
              value={`KES ${budget.allocatedBudget.toLocaleString()}`}
            />
            <DetailRow
              icon={<TrendingUp className="h-5 w-5 text-gray-500" />}
              label="Spent Amount"
              value={`KES ${budget.spent.toLocaleString()}`}
            />
            <DetailRow
              icon={<PieChartIcon className="h-5 w-5 text-gray-500" />}
              label="Remaining Amount"
              value={`KES ${remaining.toLocaleString()}`}
            />
            <DetailRow
              icon={<PieChartIcon className="h-5 w-5 text-gray-500" />}
              label="Utilization"
              value={`${utilization.toFixed(2)}%`}
            />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

const DetailRow = ({ icon, label, value }) => (
  <div className="flex items-start py-2 border-b border-gray-100">
    <div className="w-8 h-8 flex items-center justify-center mr-4">{icon}</div>
    <div className="flex-1">
      <p className="text-sm font-medium text-gray-600">{label}</p>
      <p className="text-md font-semibold text-gray-900">{value}</p>
    </div>
  </div>
);