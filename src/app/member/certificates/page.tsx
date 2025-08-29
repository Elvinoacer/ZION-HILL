"use client";

import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

interface PublicCertificate {
  id: string;
  certificateType: string;
  recipientName: string;
  issuedDate: string;
  user: { name: string };
}

export default function PublicCertificatesPage() {
  const [certificates, setCertificates] = useState<PublicCertificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCertificates = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/certificates/public");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setCertificates(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, []);

  const handleViewCertificate = async (certificateId: string) => {
    const toastId = toast.loading("Verifying your access...");
    try {
      const response = await fetch(`/api/certificates/${certificateId}/url`);

      if (!response.ok) {
        if (response.status === 401) {
          toast.error(
            "Authentication required. Please log in to view your certificate.",
            { id: toastId }
          );
        } else if (response.status === 403) {
          toast.error(
            "Access Denied. You do not have permission to view this certificate.",
            { id: toastId }
          );
        } else {
          toast.error("A server error occurred. Please try again later.", {
            id: toastId,
          });
        }
        return;
      }

      const data = await response.json();
      if (data.url) {
        toast.success("Access granted! Opening certificate in a new tab.", {
          id: toastId,
        });
        window.open(data.url, "_blank", "noopener,noreferrer");
      } else {
        throw new Error("Certificate URL not found in the server response.");
      }
    } catch (err) {
      toast.error(
        "A network error occurred. Please check your connection and try again.",
        { id: toastId }
      );
      console.error("Failed to fetch certificate URL:", err);
    }
  };

  if (loading)
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="text-center mb-12">
          <Skeleton className="h-10 w-64 mx-auto mb-6" />
          <Skeleton className="h-4 w-80 mx-auto" />
        </div>
        <div className="max-w-5xl mx-auto space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-lg" />
          ))}
        </div>
      </div>
    );

  if (error)
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="container mx-auto py-12 px-4 text-center"
      >
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-red-600 mb-2">
            Error Loading Certificates
          </h2>
          <p className="text-red-500 mb-4">{error}</p>
          <Button
            variant="outline"
            className="border-red-300 text-red-600 hover:bg-red-50"
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </div>
      </motion.div>
    );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto py-12 px-4"
    >
      <div className="text-center mb-12">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl font-bold text-gray-800 mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
        >
          Issued Certificates
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-lg text-gray-600 max-w-2xl mx-auto"
        >
          Browse all publicly available certificates issued through our platform
        </motion.p>
      </div>

      {certificates.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100 max-w-2xl mx-auto"
        >
          <div className="bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-blue-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No certificates yet
          </h3>
          <p className="text-gray-500 mb-6">
            When certificates are issued, they'll appear here
          </p>
          <Button onClick={() => window.location.reload()}>Check Again</Button>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="max-w-5xl mx-auto"
        >
          {/* Mobile View - Cards */}
          <div className="md:hidden space-y-4">
            {certificates.map((certificate) => (
              <div
                key={certificate.id}
                className="bg-white p-4 rounded-lg shadow-md border border-gray-100"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-gray-800">
                      {certificate.recipientName}
                    </h3>
                    <span className="text-sm px-2 py-0.5 mt-1 inline-flex leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {certificate.certificateType}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewCertificate(certificate.id)}
                    className="group border-blue-100 hover:bg-blue-50 hover:border-blue-200 transition-colors"
                  >
                    <ExternalLink className="h-4 w-4 mr-2 text-blue-500" />
                    <span className="text-blue-600">View</span>
                  </Button>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200 text-sm text-gray-500">
                  <p>
                    <strong>Issued By:</strong> {certificate.user.name}
                  </p>
                  <p>
                    <strong>Date:</strong>{" "}
                    {format(new Date(certificate.issuedDate), "PPP")}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop View - Table */}
          <div className="hidden md:block overflow-hidden bg-white shadow-lg rounded-xl border border-gray-100">
            <Table className="min-w-full divide-y divide-gray-200">
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Recipient
                  </TableHead>
                  <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Certificate Type
                  </TableHead>
                  <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Issued By
                  </TableHead>
                  <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </TableHead>
                  <TableHead className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="bg-white divide-y divide-gray-200">
                {certificates.map((certificate, index) => (
                  <motion.tr
                    key={certificate.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <TableCell className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-medium">
                            {certificate.recipientName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {certificate.recipientName}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {certificate.certificateType}
                      </span>
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {certificate.user.name}
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {format(new Date(certificate.issuedDate), "PPP")}
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewCertificate(certificate.id)}
                        className="group border-blue-100 hover:bg-blue-50 hover:border-blue-200 transition-colors"
                      >
                        <ExternalLink className="h-4 w-4 mr-2 text-blue-500 group-hover:text-blue-600 transition-colors" />
                        <span className="text-blue-600 group-hover:text-blue-700">
                          View
                        </span>
                      </Button>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
