import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import GivingPieChart from './GivingPieChart';
import GivingLineChart from '././GivingLineChart';
import { format, startOfDay, startOfWeek, startOfMonth, startOfYear, eachDayOfInterval, eachWeekOfInterval, eachMonthOfInterval, eachYearOfInterval } from 'date-fns';

interface Transaction {
  id: string;
  amount: number;
  date: string;
  type: string;
  method: string;
  status: string;
}

interface GivingDashboardProps {
  givingHistory: Transaction[];
}

const GivingDashboard = ({ givingHistory }: GivingDashboardProps) => {

  // Process data for Pie Chart
  const pieChartData = givingHistory.reduce((acc, t) => {
    const existing = acc.find(item => item.name === t.type);
    if (existing) {
      existing.value += t.amount;
    } else {
      acc.push({ name: t.type, value: t.amount });
    }
    return acc;
  }, [] as { name: string; value: number }[]);

  // Process data for Line Chart
  const processLineChartData = (history: Transaction[], timeFrame: 'daily' | 'weekly' | 'monthly' | 'annually') => {
    if (history.length === 0) return [];

    const sortedHistory = [...history].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const firstDate = new Date(sortedHistory[0].date);
    const lastDate = new Date(sortedHistory[sortedHistory.length - 1].date);

    let interval: Date[] = [];
    let dateFormat = '';

    switch (timeFrame) {
      case 'daily':
        interval = eachDayOfInterval({ start: startOfDay(firstDate), end: startOfDay(lastDate) });
        dateFormat = 'MMM d';
        break;
      case 'weekly':
        interval = eachWeekOfInterval({ start: startOfWeek(firstDate), end: startOfWeek(lastDate) });
        dateFormat = 'MMM d, yyyy';
        break;
      case 'monthly':
        interval = eachMonthOfInterval({ start: startOfMonth(firstDate), end: startOfMonth(lastDate) });
        dateFormat = 'MMM yyyy';
        break;
      case 'annually':
        interval = eachYearOfInterval({ start: startOfYear(firstDate), end: startOfYear(lastDate) });
        dateFormat = 'yyyy';
        break;
    }

    const aggregatedData = interval.map(date => {
      const formattedDate = format(date, dateFormat);
      return {
        date: formattedDate,
        Tithes: 0,
        'Special Offerings': 0,
        'Project/Support': 0,
      };
    });

    history.forEach(t => {
      let keyDate: Date;
      switch (timeFrame) {
        case 'daily':
          keyDate = startOfDay(new Date(t.date));
          break;
        case 'weekly':
          keyDate = startOfWeek(new Date(t.date));
          break;
        case 'monthly':
          keyDate = startOfMonth(new Date(t.date));
          break;
        case 'annually':
          keyDate = startOfYear(new Date(t.date));
          break;
      }
      const formattedKeyDate = format(keyDate, dateFormat);
      const dataPoint = aggregatedData.find(d => d.date === formattedKeyDate);
      if (dataPoint) {
        dataPoint[t.type as 'Tithes' | 'Special Offerings' | 'Project/Support'] += t.amount;
      }
    });

    return aggregatedData;
  };

  const lineChartData = {
    daily: processLineChartData(givingHistory, 'daily'),
    weekly: processLineChartData(givingHistory, 'weekly'),
    monthly: processLineChartData(givingHistory, 'monthly'),
    annually: processLineChartData(givingHistory, 'annually'),
  };

  // Calculate Total and Average Donations
  const totalDonations = givingHistory.reduce((sum, t) => sum + t.amount, 0);
  const averageDonation = givingHistory.length > 0 ? totalDonations / givingHistory.length : 0;

  const tithesGiven = givingHistory.filter(t => t.type === 'Tithes').reduce((acc, curr) => acc + curr.amount, 0);
  const specialOfferingsGiven = givingHistory.filter(t => t.type === 'Special Offerings').reduce((acc, curr) => acc + curr.amount, 0);
  const projectSupportGiven = givingHistory.filter(t => t.type === 'Project/Support').reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="md:col-span-1">
          <GivingPieChart data={pieChartData} />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="md:col-span-2">
          <GivingLineChart data={lineChartData} />
        </motion.div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="col-span-1 bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-lg rounded-2xl p-3 text-center">
            <h3 className="text-sm sm:text-base font-semibold text-blue-100">Total Given</h3>
            <p className="text-xl sm:text-2xl font-bold text-white">KES {totalDonations.toLocaleString()}</p>
          </Card>
          <Card className="col-span-1 bg-gradient-to-br from-purple-500 to-purple-700 text-white shadow-lg rounded-2xl p-3 text-center">
            <h3 className="text-sm sm:text-base font-semibold text-purple-100">Tithes</h3>
            <p className="text-xl sm:text-2xl font-bold text-white">KES {tithesGiven.toLocaleString()}</p>
          </Card>
          <Card className="col-span-1 bg-gradient-to-br from-green-500 to-green-700 text-white shadow-lg rounded-2xl p-3 text-center">
            <h3 className="text-sm sm:text-base font-semibold text-green-100">Special Offerings</h3>
            <p className="text-xl sm:text-2xl font-bold text-white">KES {specialOfferingsGiven.toLocaleString()}</p>
          </Card>
          <Card className="col-span-1 bg-gradient-to-br from-yellow-500 to-yellow-700 text-white shadow-lg rounded-2xl p-3 text-center">
            <h3 className="text-sm sm:text-base font-semibold text-yellow-100">Project/Support</h3>
            <p className="text-xl sm:text-2xl font-bold text-white">KES {projectSupportGiven.toLocaleString()}</p>
          </Card>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl">
            <CardHeader>
                <CardTitle>Total Donations</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-3xl font-bold">KES {totalDonations.toLocaleString()}</p>
            </CardContent>
          </Card>
          <Card className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl">
            <CardHeader>
                <CardTitle>Average Donation</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-3xl font-bold">KES {averageDonation.toLocaleString()}</p>
            </CardContent>
          </Card>
      </div>
    </motion.div>
  );
};

export default GivingDashboard;