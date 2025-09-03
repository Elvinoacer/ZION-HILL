import React from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import {
  DollarSign,
  Heart,
  Gift,
  Target,
  TrendingUp,
  Calendar,
  ArrowUpRight,
} from "lucide-react";

interface Transaction {
  id: string;
  amount: number;
  date: string;
  type: string;
  method: string;
  status: string;
}

interface GivingSummaryCardsProps {
  givingHistory: Transaction[];
}

const GivingSummaryCards = ({ givingHistory }: GivingSummaryCardsProps) => {
  const totalGiven = givingHistory.reduce((sum, t) => sum + t.amount, 0);
  const tithesGiven = givingHistory
    .filter((t) => t.type === "Tithes")
    .reduce((acc, curr) => acc + curr.amount, 0);
  const specialOfferingsGiven = givingHistory
    .filter((t) => t.type === "Special Offerings")
    .reduce((acc, curr) => acc + curr.amount, 0);
  const projectSupportGiven = givingHistory
    .filter((t) => t.type === "Project/Support")
    .reduce((acc, curr) => acc + curr.amount, 0);

  // Calculate month-over-month growth
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

  const currentMonthTotal = givingHistory
    .filter((t) => {
      const date = new Date(t.date);
      return (
        date.getMonth() === currentMonth && date.getFullYear() === currentYear
      );
    })
    .reduce((sum, t) => sum + t.amount, 0);

  const lastMonthTotal = givingHistory
    .filter((t) => {
      const date = new Date(t.date);
      return (
        date.getMonth() === lastMonth && date.getFullYear() === lastMonthYear
      );
    })
    .reduce((sum, t) => sum + t.amount, 0);

  const growthPercentage =
    lastMonthTotal > 0
      ? ((currentMonthTotal - lastMonthTotal) / lastMonthTotal) * 100
      : currentMonthTotal > 0
      ? 100
      : 0;

  const cards = [
    {
      title: "Total Given",
      value: totalGiven,
      icon: DollarSign,
      gradient: "from-blue-500 to-indigo-600",
      iconBg: "bg-blue-100 dark:bg-blue-900/30",
      iconColor: "text-blue-600 dark:text-blue-400",
      growth: growthPercentage,
      description: "All-time contributions",
    },
    {
      title: "Tithes",
      value: tithesGiven,
      icon: Heart,
      gradient: "from-green-500 to-emerald-600",
      iconBg: "bg-green-100 dark:bg-green-900/30",
      iconColor: "text-green-600 dark:text-green-400",
      percentage: totalGiven > 0 ? (tithesGiven / totalGiven) * 100 : 0,
      description: "Regular tithes",
    },
    {
      title: "Special Offerings",
      value: specialOfferingsGiven,
      icon: Gift,
      gradient: "from-purple-500 to-violet-600",
      iconBg: "bg-purple-100 dark:bg-purple-900/30",
      iconColor: "text-purple-600 dark:text-purple-400",
      percentage:
        totalGiven > 0 ? (specialOfferingsGiven / totalGiven) * 100 : 0,
      description: "Special contributions",
    },
    {
      title: "Project/Support",
      value: projectSupportGiven,
      icon: Target,
      gradient: "from-amber-500 to-orange-600",
      iconBg: "bg-amber-100 dark:bg-amber-900/30",
      iconColor: "text-amber-600 dark:text-amber-400",
      percentage: totalGiven > 0 ? (projectSupportGiven / totalGiven) * 100 : 0,
      description: "Mission support",
    },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {cards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ y: -5 }}
          className="h-full"
        >
          <Card
            className={`bg-gradient-to-br ${card.gradient} text-white shadow-lg rounded-2xl overflow-hidden border-0 h-full`}
          >
            <div className="p-5">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-2 rounded-lg ${card.iconBg}`}>
                  <card.icon className={`h-5 w-5 ${card.iconColor}`} />
                </div>
                {card.growth !== undefined && (
                  <div className="flex items-center bg-white/20 backdrop-blur-sm rounded-full px-2 py-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    <span className="text-xs font-medium">
                      {card.growth > 0 ? "+" : ""}
                      {card.growth.toFixed(1)}%
                    </span>
                  </div>
                )}
              </div>

              <div className="mb-2">
                <h3 className="text-sm font-medium text-white/90">
                  {card.title}
                </h3>
                <p className="text-2xl font-bold text-white mt-1">
                  {formatCurrency(card.value)}
                </p>
              </div>

              {card.percentage !== undefined && (
                <div className="w-full bg-white/20 rounded-full h-2 mb-3">
                  <div
                    className={`h-2 rounded-full ${card.iconBg}`}
                    style={{ width: `${Math.min(card.percentage, 100)}%` }}
                  />
                </div>
              )}

              <div className="flex justify-between items-center">
                <p className="text-xs text-white/80">{card.description}</p>
                {card.percentage !== undefined && (
                  <span className="text-xs font-medium text-white/90">
                    {card.percentage.toFixed(1)}%
                  </span>
                )}
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute bottom-0 right-0 w-16 h-16 bg-white/10 rounded-tl-full" />
            <div className="absolute top-0 right-0 w-8 h-8 bg-white/10 rounded-bl-full" />
          </Card>
        </motion.div>
      ))}

      {/* Quick Stats Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="sm:col-span-2 lg:col-span-4"
      >
        <Card className="bg-gradient-to-r from-gray-800 to-gray-900 text-white shadow-lg rounded-2xl overflow-hidden border-0">
          <div className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Quick Stats</h3>
              <Calendar className="h-5 w-5 text-gray-400" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-white">
                  {givingHistory.length}
                </p>
                <p className="text-xs text-gray-300">Total Donations</p>
              </div>

              <div className="text-center">
                <p className="text-2xl font-bold text-white">
                  {givingHistory.filter((t) => t.status === "Completed").length}
                </p>
                <p className="text-xs text-gray-300">Completed</p>
              </div>

              <div className="text-center">
                <p className="text-2xl font-bold text-white">
                  {
                    new Set(
                      givingHistory.map((t) => new Date(t.date).getMonth())
                    ).size
                  }
                </p>
                <p className="text-xs text-gray-300">Active Months</p>
              </div>

              <div className="text-center">
                <p className="text-2xl font-bold text-white">
                  {currentMonthTotal > 0
                    ? formatCurrency(currentMonthTotal)
                    : "KES 0"}
                </p>
                <p className="text-xs text-gray-300">This Month</p>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-700">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-300">
                  Your generosity makes a difference
                </p>
                <ArrowUpRight className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default GivingSummaryCards;
