import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { useBrandEngagementStore } from "@/store";
import { Ticket, Asset } from "@prisma/client";

interface CrisisCommunicationProps {
  alerts: Ticket[];
  statements: Asset[];
}

export default function CrisisCommunication({ alerts, statements }: CrisisCommunicationProps) {
  const { createAlert, createStatement, sendAlert, sendStatement } = useBrandEngagementStore();

  const handleSendAlert = async (id: string) => {
    await sendAlert(id);
    alert(`Alert ${id} sent!`);
  };

  const handleSendStatement = async (id: string) => {
    await sendStatement(id);
    alert(`Statement ${id} sent!`);
  };

  const handleCreateAlert = async () => {
    // Placeholder for creating an alert. In a real app, you'd have a form to get the data.
    await createAlert({ title: "New Alert", priority: "HIGH", status: "Open", issue: "Crisis Alert", creatorId: "clw021111000008l701111111" }); // Assuming a default creatorId
    alert("New alert created!");
  };

  const handleCreateStatement = async () => {
    // Placeholder for creating a statement. In a real app, you'd have a form to get the data.
    await createStatement({ title: "New Statement", type: "DOCUMENT", url: "/new-statement.pdf", uploaderId: "clw021111000008l701111111" }); // Assuming a default uploaderId
    alert("New statement created!");
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
        Crisis Communication
      </h2>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Emergency Alert System
          </h3>
          <motion.button
            onClick={handleCreateAlert}
            className="mb-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-200"
            whileHover={{ scale: 1.03 }}
            aria-label="Create new alert"
          >
            Create New Alert
          </motion.button>
          <div className="mt-4 space-y-2">
            {alerts.length === 0 ? (
              <div className="text-center py-12 text-gray-600">
                No alerts found.
              </div>
            ) : (
              alerts.map((alert, index) => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="p-4 bg-white rounded-lg shadow-sm flex items-center"
                >
                  <AlertTriangle className="h-5 w-5 text-blue-600 mr-2" />
                  <div>
                    <div className="font-semibold text-gray-900">
                      {alert.title}
                    </div>
                    <div className="text-sm text-gray-600">
                      Urgency: {alert.priority} | Status: {alert.status}
                    </div>
                    <motion.button
                      onClick={() => handleSendAlert(alert.id)}
                      className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200"
                      whileHover={{ scale: 1.03 }}
                      aria-label={`Send ${alert.title}`}
                    >
                      Send Alert
                    </motion.button>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Pre-Approved Statements
          </h3>
          <motion.button
            onClick={handleCreateStatement}
            className="mb-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-200"
            whileHover={{ scale: 1.03 }}
            aria-label="Create new statement"
          >
            Create New Statement
          </motion.button>
          <div className="mt-4 space-y-2">
            {statements.length === 0 ? (
              <div className="text-center py-12 text-gray-600">
                No statements found.
              </div>
            ) : (
              statements.map((statement, index) => (
                <motion.div
                  key={statement.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="p-4 bg-white rounded-lg shadow-sm flex items-center"
                >
                  <AlertTriangle className="h-5 w-5 text-blue-600 mr-2" />
                  <div>
                    <div className="font-semibold text-gray-900">
                      {statement.name}
                    </div>
                    <div className="text-sm text-gray-600">
                      {statement.url || "N/A"}
                    </div>
                    <motion.button
                      onClick={() => handleSendStatement(statement.id)}
                      className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200"
                      whileHover={{ scale: 1.03 }}
                      aria-label={`Send ${statement.name}`}
                    >
                      Send Statement
                    </motion.button>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
