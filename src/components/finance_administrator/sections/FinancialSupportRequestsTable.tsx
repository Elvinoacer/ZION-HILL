import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiDollarSign, FiUser, FiMail, FiPhone, FiCalendar, FiInfo, FiCheckCircle, FiXCircle, FiClock } from "react-icons/fi";
import { FinancialSupportRequest } from "@/generated/prisma";

interface FinancialSupportRequestsTableProps {
  requests: FinancialSupportRequest[];
  onUpdateStatus: (id: string, status: string) => void;
}

export default function FinancialSupportRequestsTable({
  requests,
  onUpdateStatus,
}: FinancialSupportRequestsTableRequestsTableProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "APPROVED":
        return "bg-green-100 text-green-800";
      case "REJECTED":
        return "bg-red-100 text-red-800";
      case "IN_REVIEW":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-white shadow-xl rounded-lg overflow-hidden">
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Financial Support Requests
        </h3>
        {requests.length === 0 ? (
          <div className="text-center py-12 text-gray-600">
            No financial support requests found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Requester
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Amount
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Reason
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Date
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {requests.map((request) => (
                  <motion.tr
                    key={request.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FiUser className="h-5 w-5 text-gray-400 mr-2" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {request.name || "Anonymous"}
                          </div>
                          {request.email && (
                            <div className="text-sm text-gray-500 flex items-center">
                              <FiMail className="h-4 w-4 mr-1" />
                              {request.email}
                            </div>
                          )}
                          {request.phone && (
                            <div className="text-sm text-gray-500 flex items-center">
                              <FiPhone className="h-4 w-4 mr-1" />
                              {request.phone}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center">
                        <FiDollarSign className="h-5 w-5 text-green-600 mr-1" />
                        KES {request.amountRequested.toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 max-w-xs truncate">
                        {request.reason}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          getStatusColor(request.status)
                        }`}
                      >
                        {request.status.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <FiCalendar className="h-4 w-4 mr-1" />
                        {new Date(request.createdAt).toLocaleDateString()}
                      </div>
                      <div className="flex items-center">
                        <FiClock className="h-4 w-4 mr-1" />
                        {new Date(request.createdAt).toLocaleTimeString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => onUpdateStatus(request.id, "APPROVED")}
                        className="text-green-600 hover:text-green-900 mr-3"
                        title="Approve Request"
                      >
                        <FiCheckCircle className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => onUpdateStatus(request.id, "REJECTED")}
                        className="text-red-600 hover:text-red-900 mr-3"
                        title="Reject Request"
                      >
                        <FiXCircle className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => onUpdateStatus(request.id, "IN_REVIEW")}
                        className="text-blue-600 hover:text-blue-900"
                        title="Mark as In Review"
                      >
                        <FiInfo className="h-5 w-5" />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
