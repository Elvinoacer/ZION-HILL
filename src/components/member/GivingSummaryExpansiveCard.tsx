import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format, differenceInWeeks, differenceInMonths, differenceInYears } from 'date-fns';

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

const GivingSummaryExpansiveCard = ({ givingHistory }: GivingSummaryExpansiveCardProps) => {
  const totalGiven = givingHistory.reduce((sum, t) => sum + t.amount, 0);
  const firstTransactionDate = givingHistory.length > 0 ? new Date(givingHistory[0].date) : null;
  const lastTransactionDate = givingHistory.length > 0 ? new Date(givingHistory[givingHistory.length - 1].date) : null;

  let avgPerWeek = 0;
  let avgPerMonth = 0;
  let avgPerYear = 0;

  if (firstTransactionDate && lastTransactionDate) {
    const totalAmount = totalGiven;

    const weeks = differenceInWeeks(lastTransactionDate, firstTransactionDate) + 1;
    if (weeks > 0) avgPerWeek = totalAmount / weeks;

    const months = differenceInMonths(lastTransactionDate, firstTransactionDate) + 1;
    if (months > 0) avgPerMonth = totalAmount / months;

    const years = differenceInYears(lastTransactionDate, firstTransactionDate) + 1;
    if (years > 0) avgPerYear = totalAmount / years;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="mb-8"
    >
      <Card className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">Giving Summary</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300">Average per Week</h3>
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">KES {avgPerWeek.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300">Average per Month</h3>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">KES {avgPerMonth.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300">Average per Year</h3>
            <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">KES {avgPerYear.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
          </div>
        </CardContent>
        <div className="mt-6 text-center text-gray-500 dark:text-gray-400 text-sm">
          {firstTransactionDate && lastTransactionDate ? (
            <p>Based on your giving history from {format(firstTransactionDate, 'MMM dd, yyyy')} to {format(lastTransactionDate, 'MMM dd, yyyy')}.</p>
          ) : (
            <p>No giving history available to calculate averages.</p>
          )}
        </div>
      </Card>
    </motion.div>
  );
};

export default GivingSummaryExpansiveCard;
