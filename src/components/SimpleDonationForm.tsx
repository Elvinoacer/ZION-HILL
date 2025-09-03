"use client";
import React, { useState } from "react";
import {
  FiDollarSign,
  FiPhone,
  FiGift,
  FiCheckCircle,
  FiAlertCircle,
  FiLock,
  FiShield,
  FiArrowLeft,
  FiHeart,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";

interface SimpleDonationFormProps {
  plan: {
    id: string;
    name: string;
    description?: string;
    imageUrl?: string;
  };
  donationType: "plan" | "giving";
  onSuccess?: () => void;
}

const SimpleDonationForm: React.FC<SimpleDonationFormProps> = ({
  plan,
  donationType,
  onSuccess,
}) => {
  const { data: session } = useSession();
  const [amount, setAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [activeTab, setActiveTab] = useState<"once" | "monthly">("once");

  // Suggested amounts based on donation type
  const suggestedAmounts = {
    once: [500, 1000, 2000, 5000],
    monthly: [500, 1000, 2000, 5000],
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setIsSubmitting(true);

    // Use custom amount if provided, otherwise use selected amount
    const donationAmount = customAmount ? parseFloat(customAmount) : amount;

    // Validate inputs
    if (!donationAmount || donationAmount <= 0) {
      setMessage({
        text: "Please enter a valid donation amount",
        type: "error",
      });
      setIsSubmitting(false);
      return;
    }
    if (!phone.match(/^2547\d{8}$/)) {
      setMessage({
        text: "Please enter a valid M-Pesa number (2547XXXXXXXX)",
        type: "error",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const paymentRes = await fetch("/api/intasend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: donationAmount,
          phone,
          email: session?.user?.email,
          name: session?.user?.name,
          donationId: plan.id,
          donationType: donationType,
          description: `Giving to ${plan.name}`,
          frequency: activeTab,
        }),
      });

      if (!paymentRes.ok) {
        const errorData = await paymentRes.json();
        throw new Error(errorData.error || "Failed to process donation");
      }

      const paymentData = await paymentRes.json();
      const transactionId = paymentData.transactionId;

      setMessage({
        text: "M-Pesa STK Push initiated. Please complete the transaction on your phone.",
        type: "success",
      });

      // Poll for transaction status
      const pollInterval = setInterval(async () => {
        try {
          const statusRes = await fetch("/api/transaction-status", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ transactionId }),
          });

          if (statusRes.ok) {
            const statusData = await statusRes.json();
            if (statusData.status === "APPROVED") {
              clearInterval(pollInterval);
              setShowThankYou(true);
              if (onSuccess) {
                onSuccess();
              }
            }
          }
        } catch (error) {
          console.error("Error polling transaction status:", error);
        }
      }, 3000); // Poll every 3 seconds
    } catch (err) {
      const error = err as Error;
      setMessage({ text: error.message || "An error occurred", type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatPhoneNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    let formatted = cleaned;

    if (cleaned.startsWith("0") && cleaned.length > 1) {
      formatted = "254" + cleaned.substring(1);
    } else if (cleaned.startsWith("7") && cleaned.length >= 9) {
      formatted = "254" + cleaned;
    } else if (cleaned.startsWith("254") && cleaned.length >= 12) {
      formatted = cleaned;
    }

    return formatted.substring(0, 12);
  };

  const handleAmountSelect = (amt: number) => {
    setAmount(amt);
    setCustomAmount(""); // Clear custom amount when selecting a preset
  };

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value);
    // Only clear the preset amount if custom amount has a value
    if (value) {
      setAmount(null);
    }
  };

  return (
    <AnimatePresence mode="wait">
      {showThankYou ? (
        <motion.div
          key="thank-you"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700"
        >
          <div className="p-6 sm:p-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/30 mb-5"
            >
              <FiCheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
            </motion.div>

            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              Thank You for Your Generosity!
            </h3>

            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Your {activeTab === "monthly" ? "monthly " : ""}donation of{" "}
              <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                KES {amount?.toLocaleString() || customAmount}
              </span>{" "}
              to {plan.name} is being processed.
            </p>

            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
              Please check your phone to complete the M-Pesa payment.
            </p>

            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                <strong>Next steps:</strong> Check your phone for an M-Pesa
                prompt to complete your donation.
              </p>
            </div>

            <button
              onClick={() => {
                setShowThankYou(false);
                setAmount(null);
                setCustomAmount("");
                setPhone("");
              }}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center"
            >
              <FiHeart className="mr-2 h-5 w-5" />
              Make Another Donation
            </button>
          </div>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{ duration: 0.3 }}
          onSubmit={handleSubmit}
          className="bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white relative">
            <div className="absolute top-4 left-4">
              <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center">
                <FiHeart className="h-5 w-5" />
              </div>
            </div>
            <h2 className="text-xl font-bold text-center">
              Support {plan.name}
            </h2>
            {plan.description && (
              <p className="text-indigo-100 mt-2 text-center text-sm">
                {plan.description}
              </p>
            )}
          </div>

          <div className="p-5 sm:p-6">
            {/* Donation Frequency Tabs */}
            <div className="mb-6">
              <div className="flex bg-gray-100 dark:bg-gray-700 p-1 rounded-xl">
                {["once", "monthly"].map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab as "once" | "monthly")}
                    className={`flex-1 py-2 px-4 rounded-xl text-sm font-medium transition-all duration-300 ${
                      activeTab === tab
                        ? "bg-white dark:bg-gray-800 shadow-md text-indigo-600 dark:text-indigo-400"
                        : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                    }`}
                  >
                    {tab === "once" ? "One-time" : "Monthly"}
                  </button>
                ))}
              </div>
            </div>

            {/* Amount Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Donation Amount (KES)
              </label>

              {/* Suggested Amounts */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                {suggestedAmounts[activeTab].map((amt) => (
                  <motion.button
                    key={amt}
                    type="button"
                    onClick={() => handleAmountSelect(amt)}
                    whileTap={{ scale: 0.95 }}
                    className={`py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                      amount === amt && !customAmount
                        ? "bg-indigo-600 text-white shadow-md"
                        : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 shadow-sm hover:shadow-md"
                    } border border-gray-200 dark:border-gray-700`}
                  >
                    {amt.toLocaleString()}
                  </motion.button>
                ))}
              </div>

              {/* Custom Amount */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiDollarSign className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="number"
                  className="block w-full pl-10 pr-12 py-4 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="Custom amount"
                  value={customAmount}
                  onChange={(e) => handleCustomAmountChange(e.target.value)}
                  min="1"
                  step="1"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <span className="text-gray-500 dark:text-gray-400">KES</span>
                </div>
              </div>
            </div>

            {/* Phone Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                M-Pesa Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiPhone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="tel"
                  className="block w-full pl-10 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  value={phone}
                  onChange={(e) => setPhone(formatPhoneNumber(e.target.value))}
                  placeholder="2547XXXXXXXX"
                  required
                  pattern="^2547\d{8}$"
                  title="Please enter a valid M-Pesa number starting with 254"
                />
              </div>
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Format: 2547XXXXXXXX (e.g., 254712345678)
              </p>
            </div>

            {/* Messages */}
            <AnimatePresence>
              {message && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className={`mb-6 rounded-xl p-4 ${
                    message.type === "success"
                      ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300"
                      : "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300"
                  }`}
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-0.5">
                      {message.type === "success" ? (
                        <FiCheckCircle className="h-5 w-5" />
                      ) : (
                        <FiAlertCircle className="h-5 w-5" />
                      )}
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium">{message.text}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileTap={{ scale: isSubmitting ? 1 : 0.99 }}
              className={`w-full flex justify-center items-center py-4 px-6 rounded-xl shadow-md text-lg font-medium text-white ${
                isSubmitting
                  ? "bg-indigo-400 dark:bg-indigo-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300`}
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  <FiGift className="mr-2 h-5 w-5" />
                  {activeTab === "monthly"
                    ? "Start Monthly Donation"
                    : "Donate Now"}
                </>
              )}
            </motion.button>
          </div>

          {/* Security Footer */}
          <div className="bg-gray-50 dark:bg-gray-800/50 px-6 py-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-center space-x-2">
              <FiLock className="h-4 w-4 text-gray-400" />
              <FiShield className="h-4 w-4 text-gray-400" />
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Secure payment processing. Your information is safe with us.
              </span>
            </div>
          </div>
        </motion.form>
      )}
    </AnimatePresence>
  );
};

export default SimpleDonationForm;
