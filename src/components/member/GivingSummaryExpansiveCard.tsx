import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Calendar,
  TrendingUp,
  BarChart3,
  Target,
  Clock,
  Heart,
} from "lucide-react";
import {
  format,
  differenceInWeeks,
  differenceInMonths,
  differenceInYears,
} from "date-fns";

interface Transaction {
  id: string;
  amount: number;
  date: string;
  type: string;
  method: string;
  status: string;
}

interface GivingSummaryExpansiveCardProps {
  givingHistory: Transaction[];
}

const GivingSummaryExpansiveCard = ({
  givingHistory,
}: GivingSummaryExpansiveCardProps) => {
  const totalGiven = givingHistory.reduce((sum, t) => sum + t.amount, 0);
  const firstTransactionDate =
    givingHistory.length > 0 ? new Date(givingHistory[0].date) : null;
  const lastTransactionDate =
    givingHistory.length > 0
      ? new Date(givingHistory[givingHistory.length - 1].date)
      : null;

  let avgPerWeek = 0;
  let avgPerMonth = 0;
  let avgPerYear = 0;
  let totalWeeks = 0;
  let totalMonths = 0;
  let totalYears = 0;

  if (firstTransactionDate && lastTransactionDate) {
    const totalAmount = totalGiven;

    totalWeeks =
      differenceInWeeks(lastTransactionDate, firstTransactionDate) + 1;
    if (totalWeeks > 0) avgPerWeek = totalAmount / totalWeeks;

    totalMonths =
      differenceInMonths(lastTransactionDate, firstTransactionDate) + 1;
    if (totalMonths > 0) avgPerMonth = totalAmount / totalMonths;

    totalYears =
      differenceInYears(lastTransactionDate, firstTransactionDate) + 1;
    if (totalYears > 0) avgPerYear = totalAmount / totalYears;
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const stats = [
    {
      title: "Weekly Average",
      value: avgPerWeek,
      icon: TrendingUp,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-100 dark:bg-blue-900/30",
      period: totalWeeks > 0 ? `${totalWeeks} weeks` : "N/A",
    },
    {
      title: "Monthly Average",
      value: avgPerMonth,
      icon: BarChart3,
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-100 dark:bg-green-900/30",
      period: totalMonths > 0 ? `${totalMonths} months` : "N/A",
    },
    {
      title: "Yearly Average",
      value: avgPerYear,
      icon: Target,
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-100 dark:bg-purple-900/30",
      period: totalYears > 0 ? `${totalYears} years` : "N/A",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="mb-8"
    >
      <Card className="bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-gray-900 shadow-xl rounded-2xl overflow-hidden border-0">
        <CardHeader className="pb-4 pt-6 px-6">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Heart className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              Giving Insights
            </CardTitle>
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
              <Clock className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-sm mt-2">
            Your giving patterns and averages over time
          </p>
        </CardHeader>

        <CardContent className="px-6 pb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 + 0.4 }}
                className="bg-white dark:bg-gray-700/50 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-600"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                    {stat.period}
                  </span>
                </div>

                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                  {stat.title}
                </h3>
                <p className={`text-2xl font-bold ${stat.color}`}>
                  {formatCurrency(stat.value)}
                </p>

                {stat.value > 0 && (
                  <div className="mt-3 bg-gray-100 dark:bg-gray-600 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${stat.bgColor}`}
                      style={{
                        width: `${Math.min(
                          (stat.value /
                            Math.max(avgPerWeek, avgPerMonth, avgPerYear)) *
                            100,
                          100
                        )}%`,
                      }}
                    />
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Additional Insights */}
          <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-4">
            <h4 className="font-semibold text-indigo-800 dark:text-indigo-300 text-sm mb-3 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Giving Timeline
            </h4>

            {firstTransactionDate && lastTransactionDate ? (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                    First Donation
                  </p>
                  <p className="text-sm font-semibold text-indigo-800 dark:text-indigo-200">
                    {format(firstTransactionDate, "MMM dd, yyyy")}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                    Most Recent
                  </p>
                  <p className="text-sm font-semibold text-indigo-800 dark:text-indigo-200">
                    {format(lastTransactionDate, "MMM dd, yyyy")}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-indigo-600 dark:text-indigo-400">
                No giving history available to calculate averages.
              </p>
            )}
          </div>

          {/* Total Given Summary */}
          <div className="mt-4 p-4 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-100">Total Given</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(totalGiven)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-blue-200">
                  {givingHistory.length} donations
                </p>
                <p className="text-xs text-blue-200">
                  {firstTransactionDate && lastTransactionDate
                    ? `${
                        differenceInMonths(
                          lastTransactionDate,
                          firstTransactionDate
                        ) + 1
                      } months`
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default GivingSummaryExpansiveCard;
