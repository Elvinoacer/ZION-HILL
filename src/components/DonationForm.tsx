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
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";

interface DonationFormProps {
  plan: {
    id: string;
    name: string;
    description?: string;
    imageUrl?: string;
  };
  donationType: 'plan' | 'giving';
  onSuccess?: () => void;
}

const DonationForm: React.FC<DonationFormProps> = ({ plan, donationType, onSuccess }) => {
  const { data: session } = useSession();
  const [amount, setAmount] = useState<number | null>(null);
  const [phone, setPhone] = useState<string>("");
  const [name, setName] = useState<string>(session?.user?.name || "");
  const [email, setEmail] = useState<string>(session?.user?.email || "");
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<"once" | "monthly">("once");
  const [showThankYou, setShowThankYou] = useState(false);

  // Suggested amounts based on donation type
  const suggestedAmounts = {
    once: [500, 1000, 2000, 5000],
    monthly: [200, 500, 1000, 2000],
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setIsSubmitting(true);

    // Validate inputs
    if (!amount || amount <= 0) {
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
          amount,
          phone,
          email: email,
          name: name,
          donationId: plan.id,
          donationType: donationType,
          description: `Giving to ${plan.name}`,
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

  return (
    <AnimatePresence>
      {showThankYou ? (
        <motion.div
          key="thank-you"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-white rounded-xl shadow-xl overflow-hidden"
        >
          <div className="p-8 text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <FiCheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Thank You!
            </h3>
            <p className="text-gray-600 mb-6">
              Your donation of{" "}
              <span className="font-semibold">
                KES {amount?.toLocaleString()}
              </span>{" "}
              to {plan.name} is being processed.
            </p>
            <p className="text-gray-600 mb-8">
              Please check your phone to complete the M-Pesa payment.
            </p>
            <button
              onClick={() => {
                setShowThankYou(false);
                setAmount(null);
                setPhone("");
              }}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              Make Another Donation
            </button>
          </div>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow-xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
            <h2 className="text-xl font-bold">Support {plan.name}</h2>
            {plan.description && (
              <p className="text-indigo-100 mt-1">{plan.description}</p>
            )}
          </div>

          <div className="p-6">
            {/* Donation Type Toggle */}
            <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
              {["once", "monthly"].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab as "once" | "monthly")}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    activeTab === tab
                      ? "bg-white shadow-sm text-indigo-700"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  {tab === "once" ? "One-time" : "Monthly"} Donation
                </button>
              ))}
            </div>

            {/* Amount Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Donation Amount (KES)
              </label>
              <div className="relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiDollarSign className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="number"
                  className="block w-full pl-10 pr-12 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-lg"
                  placeholder="0.00"
                  value={amount || ""}
                  onChange={(e) => setAmount(parseFloat(e.target.value))}
                  min="1"
                  step="1"
                  required
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <span className="text-gray-500">KES</span>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-4 gap-2">
                {suggestedAmounts[activeTab].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setAmount(amt)}
                    className={`py-2 rounded-md text-sm font-medium transition-colors ${
                      amount === amt
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {amt.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>

            {/* Name and Email Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Email
                </label>
                <input
                  type="email"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            {/* Phone Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                M-Pesa Phone Number
              </label>
              <div className="relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-.none">
                  <FiPhone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="tel"
                  className="block w-full pl-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={phone}
                  onChange={(e) => setPhone(formatPhoneNumber(e.target.value))}
                  placeholder="2547XXXXXXXX"
                  required
                  pattern="^2547\d{8}$"
                  title="Please enter a valid M-Pesa number starting with 254"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
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
                  className={`mb-6 rounded-lg p-4 ${
                    message.type === "success"
                      ? "bg-green-50 text-green-700"
                      : "bg-red-50 text-red-700"
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
                      <p className="text-sm">{message.text}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full flex justify-center items-center py-4 px-6 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white ${
                isSubmitting
                  ? "bg-indigo-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors`}
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
                  {activeTab === "once"
                    ? "Donate Now"
                    : "Start Monthly Donation"}
                </>
              )}
            </button>
          </div>

          {/* Security Footer */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-center space-x-2">
              <FiLock className="h-4 w-4 text-gray-400" />
              <FiShield className="h-4 w-4 text-gray-400" />
              <span className="text-xs text-gray-500">
                Secure payment processing. Your information is safe with us.
              </span>
            </div>
          </div>
        </motion.form>
      )}
    </AnimatePresence>
  );
};

export default DonationForm;
