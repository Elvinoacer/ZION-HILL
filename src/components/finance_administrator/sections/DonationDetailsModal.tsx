import { Transaction } from "@/generated/prisma";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  DollarSign,
  CreditCard,
  Calendar,
  User,
  Mail,
  Info,
  Type,
} from "lucide-react";

interface DonationDetailsModalProps {
  donation: Transaction | null;
  onClose: () => void;
}

export default function DonationDetailsModal({
  donation,
  onClose,
}: DonationDetailsModalProps) {
  if (!donation) return null;

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
              <DollarSign className="h-6 w-6 mr-3 text-blue-600" />
              Donation Details
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
              icon={<Info className="h-5 w-5 text-gray-500" />}
              label="Transaction ID"
              value={donation.id}
            />
            <DetailRow
              icon={<DollarSign className="h-5 w-5 text-gray-500" />}
              label="Amount"
              value={`KES ${donation.amount.toLocaleString()}`}
            />
            <DetailRow
              icon={<Type className="h-5 w-5 text-gray-500" />}
              label="Type"
              value={donation.type || "N/A"}
            />
            <DetailRow
              icon={<CreditCard className="h-5 w-5 text-gray-500" />}
              label="Payment Method"
              value={donation.method || "N/A"}
            />
            <DetailRow
              icon={<Calendar className="h-5 w-5 text-gray-500" />}
              label="Date"
              value={new Date(donation.date).toLocaleString()}
            />
            <DetailRow
              icon={<User className="h-5 w-5 text-gray-500" />}
              label="Donor Name"
              value={donation.donorName || "Anonymous"}
            />
            <DetailRow
              icon={<Mail className="h-5 w-5 text-gray-500" />}
              label="Donor Email"
              value={donation.donorEmail || "N/A"}
            />
            <DetailRow
              icon={<Info className="h-5 w-5 text-gray-500" />}
              label="Description"
              value={donation.description || "N/A"}
            />
            <DetailRow
              icon={<Info className="h-5 w-5 text-gray-500" />}
              label="Recurring"
              value={donation.recurring ? "Yes" : "No"}
            />
            <DetailRow
              icon={<Info className="h-5 w-5 text-gray-500" />}
              label="Anomaly"
              value={donation.anomaly ? "Yes" : "No"}
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