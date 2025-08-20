"use client";
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
import {
  FaHandHoldingHeart,
  FaUsers,
  FaCalendarAlt,
  FaMoneyBillWave,
} from "react-icons/fa";

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
  const [totalDonations, setTotalDonations] = useState(0);
  const [uniqueDonors, setUniqueDonors] = useState(0);

  useEffect(() => {
    const fetchDonorRecords = async () => {
      try {
        const response = await fetch("/api/donor-records");
        if (!response.ok) {
          throw new Error("Failed to fetch donor records.");
        }
        const data = await response.json();
        setDonorRecords(data);

        // Calculate stats
        const total = data.reduce(
          (sum: number, record: DonorRecord) => sum + record.amount,
          0
        );
        setTotalDonations(total);

        const donors = new Set(
          data.map((record: DonorRecord) => record.donorName)
        );
        setUniqueDonors(donors.size);
      } catch (err) {
        const error = err as Error;
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDonorRecords();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-lg text-indigo-700 font-medium">
            Loading donor records...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-white">
        <div className="max-w-md p-6 bg-white rounded-xl shadow-md border border-red-100">
          <div className="flex items-center mb-4">
            <div className="bg-red-100 p-2 rounded-full mr-3">
              <svg
                className="h-6 w-6 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-800">
              Error Loading Donors
            </h2>
          </div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full blur opacity-75 animate-pulse"></div>
              <div className="relative bg-gradient-to-r from-indigo-600 to-purple-700 p-6 rounded-full shadow-xl">
                <FaUsers className="h-12 w-12 text-white" />
              </div>
            </div>
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              Our Generous Donors
            </span>
          </h1>
          <p className="mt-3 text-xl text-gray-600 max-w-2xl mx-auto">
            We're grateful for every contribution that helps us fulfill our
            mission.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-xl shadow-md p-6 text-center border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="text-3xl font-bold text-indigo-700 mb-2">
              {donorRecords.length}
            </div>
            <div className="text-gray-600 flex items-center justify-center">
              <FaHandHoldingHeart className="mr-2 text-indigo-500" />
              Total Donations
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 text-center border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="text-3xl font-bold text-purple-700 mb-2">
              {uniqueDonors}
            </div>
            <div className="text-gray-600 flex items-center justify-center">
              <FaUsers className="mr-2 text-purple-500" />
              Unique Donors
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 text-center border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="text-3xl font-bold text-blue-700 mb-2">
              KES {totalDonations.toLocaleString()}
            </div>
            <div className="text-gray-600 flex items-center justify-center">
              <FaMoneyBillWave className="mr-2 text-blue-500" />
              Total Amount
            </div>
          </div>
        </div>

        {/* Donation History Table */}
        <Card className="shadow-lg border-gray-200 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600">
            <CardTitle className="text-white flex items-center">
              <FaCalendarAlt className="mr-3" />
              Donation History
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table className="min-w-full">
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Donor Name
                    </TableHead>
                    <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </TableHead>
                    <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </TableHead>
                    <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Donation Plan
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="bg-white divide-y divide-gray-200">
                  {donorRecords.map((record) => (
                    <TableRow
                      key={record.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {record.donorName}
                      </TableCell>
                      <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(record.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </TableCell>
                      <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-medium">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          KES {record.amount.toLocaleString()}
                        </span>
                      </TableCell>
                      <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {record.planName}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Empty State */}
        {donorRecords.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-indigo-100 p-4 rounded-full inline-flex mb-4">
              <FaHandHoldingHeart className="h-8 w-8 text-indigo-600" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              No Donations Yet
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Be the first to support our mission and see your name here!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
