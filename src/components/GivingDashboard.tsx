"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader, AlertCircle } from 'lucide-react';
import GivingPieChart from './GivingPieChart';
import GivingLineChart from './GivingLineChart';

const GivingDashboard = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/member/giving-summary');
        if (!res.ok) {
          throw new Error('Failed to fetch giving summary');
        }
        const summaryData = await res.json();
        setData(summaryData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="md:col-span-1">
          <GivingPieChart data={data.pieChartData} />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="md:col-span-2">
          <GivingLineChart data={data.lineChartData} />
        </motion.div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl">
            <CardHeader>
                <CardTitle>Total Donations</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-3xl font-bold">KES {data.totalDonations.toLocaleString()}</p>
            </CardContent>
          </Card>
          <Card className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl">
            <CardHeader>
                <CardTitle>Average Donation</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-3xl font-bold">KES {data.averageDonation.toLocaleString()}</p>
            </CardContent>
          </Card>
      </div>
    </motion.div>
  );
};

const LoadingState = () => (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6">
      <div className="text-center space-y-3 sm:space-y-4">
        <Loader className="h-10 w-10 sm:h-12 sm:w-12 mx-auto text-blue-500 dark:text-blue-400 animate-spin" />
        <p className="text-base sm:text-lg">Loading Giving Dashboard...</p>
      </div>
    </div>
  );
  
  const ErrorState = ({ message }: { message: string }) => (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6">
      <Card className="bg-white dark:bg-gray-800 border border-red-500/50 shadow-lg p-6 sm:p-8 text-center max-w-sm sm:max-w-md">
        <AlertCircle className="h-10 w-10 sm:h-12 sm:w-12 mx-auto text-red-500 mb-3 sm:mb-4" />
        <h2 className="text-lg sm:text-xl font-bold">Error Loading Dashboard</h2>
        <p className="text-gray-600 dark:text-gray-300 my-3 sm:my-4 text-sm sm:text-base">{message}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Try Again
        </button>
      </Card>
    </div>
  );

export default GivingDashboard;
