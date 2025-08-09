import { motion } from "framer-motion";
import { DollarSign, History, PieChart, TrendingUp } from "lucide-react";
import { useState } from "react";
import GivingHistory from "./GivingHistory";

type Donation = {
  id: number;
  date: string;
  amount: number;
  type: string;
  method: string;
  status: string;
};

type Fund = {
  name: string;
  current: number;
  goal: number;
};

export default function DonationsOverview() {
  const [activeTab, setActiveTab] = useState<"give" | "history" | "reports">(
    "give"
  );
  const [donationAmount, setDonationAmount] = useState(50);
  const [selectedFund, setSelectedFund] = useState("General Fund");
  const [paymentMethod, setPaymentMethod] = useState("credit");
  const [isDonating, setIsDonating] = useState(false);

  const donationHistory: Donation[] = [
    {
      id: 1,
      date: "2023-11-01",
      amount: 150.0,
      type: "Tithe",
      method: "Credit Card",
      status: "Completed",
    },
    {
      id: 2,
      date: "2023-10-15",
      amount: 50.0,
      type: "Building Fund",
      method: "Bank Transfer",
      status: "Completed",
    },
    {
      id: 3,
      date: "2023-10-01",
      amount: 120.0,
      type: "Tithe",
      method: "Credit Card",
      status: "Completed",
    },
  ];

  const donationFunds: Fund[] = [
    { name: "General Fund", current: 12500, goal: 20000 },
    { name: "Missions", current: 8700, goal: 15000 },
    { name: "Building Fund", current: 35600, goal: 50000 },
  ];

  const handleDonate = () => {
    if (donationAmount <= 0) {
      console.error("Donation amount must be greater than 0");
      return;
    }
    if (!donationFunds.some((fund) => fund.name === selectedFund)) {
      console.error("Invalid fund selected");
      return;
    }
    setIsDonating(true);
    setTimeout(() => {
      console.log(
        `Donated $${donationAmount} to ${selectedFund} via ${paymentMethod}`
      );
      setIsDonating(false);
    }, 1000);
  };

  return (
    <motion.div
      className="bg-gradient-to-br from-white to-blue-50 rounded-xl shadow-lg overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      role="region"
      aria-labelledby="donations-overview-heading"
    >
      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <h2
            id="donations-overview-heading"
            className="text-2xl font-semibold flex items-center text-gray-800"
          >
            <DollarSign className="mr-2 h-5 w-5" aria-hidden="true" /> Donations
          </h2>
        </div>

        <div
          className="flex space-x-4 border-b border-gray-200 mb-6"
          role="tablist"
          aria-label="Donation tabs"
        >
          <button
            onClick={() => setActiveTab("give")}
            className={`px-4 py-2 font-semibold rounded-t-lg focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-offset-2 transition-all duration-200 ease-out ${
              activeTab === "give"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
            role="tab"
            aria-selected={activeTab === "give"}
            aria-controls="give-tab"
            id="give-tab-button"
          >
            Give Now
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`px-4 py-2 font-semibold rounded-t-lg focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-offset-2 transition-all duration-200 ease-out ${
              activeTab === "history"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
            role="tab"
            aria-selected={activeTab === "history"}
            aria-controls="history-tab"
            id="history-tab-button"
          >
            My Giving History
          </button>
          <button
            onClick={() => setActiveTab("reports")}
            className={`px-4 py-2 font-semibold rounded-t-lg focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-offset-2 transition-all duration-200 ease-out ${
              activeTab === "reports"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
            role="tab"
            aria-selected={activeTab === "reports"}
            aria-controls="reports-tab"
            id="reports-tab-button"
          >
            Fund Reports
          </button>
        </div>
      </div>

      <div
        id={`${activeTab}-tab`}
        className="px-8 pb-8"
        role="tabpanel"
        aria-labelledby={`${activeTab}-tab-button`}
      >
        {activeTab === "give" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-800">
                Make a Donation
              </h3>

              <div className="mb-6">
                <label
                  htmlFor="fund-select"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Select Fund
                </label>
                <select
                  id="fund-select"
                  value={selectedFund}
                  onChange={(e) => setSelectedFund(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                  aria-describedby="fund-select-desc"
                >
                  {donationFunds.map((fund) => (
                    <option key={fund.name} value={fund.name}>
                      {fund.name}
                    </option>
                  ))}
                </select>
                <p id="fund-select-desc" className="sr-only">
                  Select the fund to which you want to donate.
                </p>
              </div>

              <div className="mb-6">
                <label
                  htmlFor="donation-amount"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Amount ($)
                </label>
                <div className="grid grid-cols-4 gap-2 mb-2">
                  {[10, 25, 50, 100].map((amount) => (
                    <motion.button
                      key={amount}
                      onClick={() => setDonationAmount(amount)}
                      className={`py-2 rounded-lg font-semibold transition-all duration-200 ease-out focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-offset-2 ${
                        donationAmount === amount
                          ? "bg-blue-600 text-white hover:bg-blue-700"
                          : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                      }`}
                      whileHover={{ scale: 1.05 }}
                      aria-label={`Set donation amount to ${amount} dollars`}
                    >
                      ${amount}
                    </motion.button>
                  ))}
                </div>
                <input
                  id="donation-amount"
                  type="number"
                  value={donationAmount}
                  onChange={(e) => setDonationAmount(Number(e.target.value))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                  min="1"
                  aria-describedby="donation-amount-desc"
                />
                <p id="donation-amount-desc" className="sr-only">
                  Enter the amount you wish to donate in dollars.
                </p>
              </div>

              <div className="mb-6">
                <legend className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Method
                </legend>
                <div className="space-y-2">
                  {[
                    { value: "credit", label: "Credit/Debit Card" },
                    { value: "bank", label: "Bank Transfer" },
                    { value: "mobile", label: "Mobile Payment" },
                  ].map((method) => (
                    <label
                      key={method.value}
                      className="flex items-center space-x-3"
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={method.value}
                        checked={paymentMethod === method.value}
                        onChange={() => setPaymentMethod(method.value)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                        aria-checked={paymentMethod === method.value}
                        aria-label={`Select ${method.label} as payment method`}
                      />
                      <span className="text-gray-800">{method.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <motion.button
                className={`w-full py-3 rounded-lg font-semibold transition-all duration-200 ease-out focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-offset-2 ${
                  isDonating
                    ? "bg-blue-400 text-white cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
                onClick={handleDonate}
                disabled={isDonating}
                whileHover={{ scale: 1.05 }}
                aria-label={`Donate ${donationAmount} dollars to ${selectedFund}`}
              >
                {isDonating ? "Processing..." : `Donate $${donationAmount}`}
              </motion.button>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-800">
                <PieChart className="mr-2 h-5 w-5" aria-hidden="true" /> Fund
                Progress
              </h3>

              {donationFunds.map((fund) => (
                <div key={fund.name} className="mb-6">
                  <div className="flex justify-between mb-1">
                    <span className="font-medium text-gray-800">
                      {fund.name}
                    </span>
                    <span className="text-gray-600">
                      ${fund.current.toLocaleString()} of $
                      {fund.goal.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2.5 rounded-full"
                      style={{ width: `${(fund.current / fund.goal) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}

              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg">
                <h4 className="font-semibold text-indigo-800 mb-2">
                  Why Give?
                </h4>
                <p className="text-indigo-700 text-sm">
                  Your generous giving supports the ministry and mission of our
                  church. Together we can make an impact in our community and
                  around the world.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "history" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <GivingHistory donations={donationHistory} />
            <motion.button
              className="mt-4 text-blue-600 hover:text-blue-800 text-sm font-semibold flex items-center transition-all duration-200 ease-out focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-offset-2"
              whileHover={{ scale: 1.05 }}
              aria-label="View full donation history"
            >
              <History className="mr-1 h-4 w-4" aria-hidden="true" /> View Full
              History
            </motion.button>
          </motion.div>
        )}

        {activeTab === "reports" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-800">
                <TrendingUp className="mr-2 h-5 w-5" aria-hidden="true" />{" "}
                Annual Giving
              </h3>
              <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400">
                [Chart implementation pending]
              </div>
              <div className="mt-4 text-sm text-gray-600">
                Total given this year:{" "}
                <span className="font-semibold">$8,420.00</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-800">
                <PieChart className="mr-2 h-5 w-5" aria-hidden="true" /> Fund
                Allocation
              </h3>
              <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400">
                [Chart implementation pending]
              </div>
              <div className="mt-4 text-sm text-gray-600">
                <div className="flex justify-between mb-1">
                  <span>
                    General Fund: <span className="font-semibold">42%</span>
                  </span>
                  <span>$12,500</span>
                </div>
                <div className="flex justify-between mb-1">
                  <span>
                    Missions: <span className="font-semibold">28%</span>
                  </span>
                  <span>$8,700</span>
                </div>
                <div className="flex justify-between">
                  <span>
                    Building Fund: <span className="font-semibold">30%</span>
                  </span>
                  <span>$35,600</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
