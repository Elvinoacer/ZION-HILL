'use client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { motion } from 'framer-motion';
import { Handshake, Users, TrendingUp, Gift, Calendar, Loader, AlertCircle } from 'lucide-react';

interface DonorRecord {
  id: string;
  donorName: string;
  date: string;
  amount: number;
  planName: string;
}

export default function DonorsPage() {
  const [donorRecords, setDonorRecords] = useState<DonorRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDonorRecords = async () => {
      try {
        const response = await fetch("/api/donor-records");
        if (!response.ok) throw new Error("Failed to fetch donor records.");
        const data = await response.json();
        setDonorRecords(data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
      } catch (err) {
        const error = err as Error;
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDonorRecords();
  }, []);

  const totalDonations = donorRecords.length;
  const uniqueDonors = new Set(donorRecords.map(r => r.donorName)).size;
  const totalAmount = donorRecords.reduce((sum, r) => sum + r.amount, 0);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <StatsSection totalDonations={totalDonations} uniqueDonors={uniqueDonors} totalAmount={totalAmount} />
        {donorRecords.length > 0 ? (
          <DonorsTable records={donorRecords} />
        ) : (
          <NoDonorsFound />
        )}
      </main>
    </div>
  );
}

const Header = () => (
  <motion.header 
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-gradient-to-r from-blue-800 to-indigo-900 text-white text-center py-16 md:py-24 relative overflow-hidden"
  >
    <div className="absolute inset-0 bg-pattern opacity-10"></div>
    <div className="container mx-auto px-4 relative">
      <Users className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-blue-200 mb-3 sm:mb-4" />
      <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold tracking-tight">Our Wall of Gratitude</h1>
      <p className="mt-3 sm:mt-4 text-base sm:text-lg md:text-xl text-blue-100 max-w-3xl mx-auto">Celebrating the generous hearts that fuel our mission and uplift our community.</p>
    </div>
  </motion.header>
);

const StatsSection = ({ totalDonations, uniqueDonors, totalAmount }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
    <Card className="bg-white/90 backdrop-blur-md p-4 sm:p-6 rounded-2xl shadow-lg border border-gray-200/80 -mt-16 sm:-mt-20 md:-mt-24 mb-8 sm:mb-16 sticky top-4 z-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 text-center">
        <StatItem icon={Gift} value={totalDonations} label="Total Donations" />
        <StatItem icon={Users} value={uniqueDonors} label="Unique Donors" />
        <StatItem icon={TrendingUp} value={`KES ${totalAmount.toLocaleString()}`} label="Total Amount Raised" />
      </div>
    </Card>
  </motion.div>
);

const StatItem = ({ icon: Icon, value, label }) => (
  <div className="p-3 sm:p-4">
    <Icon className="h-8 w-8 sm:h-10 sm:w-10 mx-auto text-blue-600 mb-2 sm:mb-3" />
    <div className="text-xl sm:text-3xl font-bold text-gray-800">{value}</div>
    <div className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">{label}</div>
  </div>
);

const DonorsTable = ({ records }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
    <Card className="shadow-xl border-gray-200/80 rounded-2xl overflow-hidden">
      <CardHeader className="p-4 sm:p-6 pb-0">
        <CardTitle className="text-lg sm:text-xl font-bold text-gray-800">Donation History</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="md:hidden">
          {records.map(record => <DonorCard key={record.id} record={record} />)}
        </div>
        <div className="hidden md:block overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-sm sm:text-base">Donor Name</TableHead>
                <TableHead className="text-sm sm:text-base">Date</TableHead>
                <TableHead className="text-sm sm:text-base">Amount</TableHead>
                <TableHead className="text-sm sm:text-base">Donation Plan</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {records.map(record => <DonorRow key={record.id} record={record} />)}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

const DonorCard = ({ record }) => (
  <div className="border-b p-3 sm:p-4 space-y-1.5 sm:space-y-2">
    <p className="font-bold text-gray-800 text-base sm:text-lg">{record.donorName}</p>
    <div className="flex justify-between text-sm">
      <span className="text-gray-600">{record.planName}</span>
      <span className="font-semibold text-green-600">KES {record.amount.toLocaleString()}</span>
    </div>
    <div className="text-xs text-gray-400 flex items-center gap-1">
      <Calendar className="h-3 w-3" />
      {new Date(record.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
    </div>
  </div>
);

const DonorRow = ({ record }) => (
  <TableRow>
    <TableCell className="font-medium text-sm sm:text-base">{record.donorName}</TableCell>
    <TableCell className="text-sm sm:text-base">{new Date(record.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</TableCell>
    <TableCell><span className="font-semibold text-green-600 text-sm sm:text-base">KES {record.amount.toLocaleString()}</span></TableCell>
    <TableCell className="text-sm sm:text-base">{record.planName}</TableCell>
  </TableRow>
);

const LoadingState = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 sm:p-6">
    <div className="text-center space-y-3 sm:space-y-4">
      <Loader className="h-10 w-10 sm:h-12 sm:w-12 mx-auto text-blue-600 animate-spin" />
      <p className="text-base sm:text-lg text-gray-600">Loading Donor Records...</p>
    </div>
  </div>
);

const ErrorState = ({ message }) => (
  <div className="min-h-screen flex items-center justify-center bg-red-50 p-4 sm:p-6">
    <Card className="p-6 sm:p-8 text-center max-w-sm sm:max-w-md">
      <AlertCircle className="h-10 w-10 sm:h-12 sm:w-12 mx-auto text-red-500 mb-3 sm:mb-4" />
      <h2 className="text-lg sm:text-xl font-bold text-gray-800">Error Loading Donors</h2>
      <p className="text-gray-600 my-3 sm:my-4 text-sm sm:text-base">{message}</p>
      <button onClick={() => window.location.reload()} className="px-5 py-2 sm:px-6 sm:py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm sm:text-base">Try Again</button>
    </Card>
  </div>
);

const NoDonorsFound = () => (
  <div className="text-center py-16 sm:py-24">
    <Handshake className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400" />
    <h3 className="mt-3 sm:mt-4 text-base sm:text-lg font-semibold text-gray-800">No Donations Yet</h3>
    <p className="mt-1 sm:mt-2 text-sm text-gray-600">Be the first to support our mission and see your name here!</p>
  </div>
);
