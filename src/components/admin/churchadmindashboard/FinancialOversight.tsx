import { useState } from "react";
import { motion } from "framer-motion";
import { useDrop, useDrag } from "react-dnd";
import { PieChart, AlertTriangle, DollarSign } from "lucide-react";
import { Transaction, Ministry } from "@prisma/client";
import { useDonationStore } from "@/store";

interface FinancialOversightProps {
  transactions: Transaction[];
}

export default function FinancialOversight({ transactions }: FinancialOversightProps) {
  const { scanReceipt } = useDonationStore();
  const [ministries, setMinistries] = useState<Ministry[]>([
    { id: "1", name: "Youth", allocatedBudget: 10000, spentBudget: 4000 },
    { id: "2", name: "Missions", allocatedBudget: 15000, spentBudget: 8000 },
  ]);

  const [, drop] = useDrop({
    accept: "FUND",
    drop: (item: { id: string; amount: number }, monitor) => {
      setMinistries((prev) =>
        prev.map((m) =>
          m.id === item.id ? { ...m, allocatedBudget: m.allocatedBudget + item.amount } : m
        )
      );
    },
  });

  const handleScanReceipt = async (id: string) => {
    await scanReceipt(id);
    alert(`Receipt for transaction ${id} scanned!`);
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
        Financial Oversight
      </h2>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Ministry Budget Control
          </h3>
          <div className="flex space-x-6 mt-4">
            <div className="w-1/3">
              <h4 className="text-md font-semibold text-gray-900">
                Available Funds
              </h4>
              <div className="mt-2">
                <DraggableFund id="draggable-fund-1" amount={5000} />
              </div>
            </div>
            <div
              ref={drop}
              className="w-2/3 p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300"
            >
              <h4 className="text-md font-semibold text-gray-900">
                Budget Planner
              </h4>
              <div className="mt-2 space-y-2">
                {ministries.map((ministry, index) => (
                  <motion.div
                    key={ministry.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="p-3 bg-white rounded-lg shadow-sm flex items-center"
                  >
                    <PieChart className="h-5 w-5 text-blue-600 mr-2" />
                    <div>
                      <div className="font-semibold text-gray-900">
                        {ministry.name}
                      </div>
                      <div className="text-sm text-gray-600">
                        Allocated: KES {ministry.allocatedBudget} | Spent: KES {ministry.spentBudget} | Remaining: KES {ministry.allocatedBudget - ministry.spentBudget}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Expense Reconciliation
          </h3>
          <div className="mt-4 space-y-2">
            {transactions.length === 0 ? (
              <div className="text-center py-12 text-gray-600">
                No transactions found.
              </div>
            ) : (
              transactions.map((transaction, index) => (
                <motion.div
                  key={transaction.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="p-4 bg-white rounded-lg shadow-sm flex items-center"
                >
                  <PieChart className="h-5 w-5 text-blue-600 mr-2" />
                  <div>
                    <div className="font-semibold text-gray-900">
                      KES {transaction.amount} - {transaction.description}
                    </div>
                    <div className="text-sm text-gray-600">
                      Matched: {transaction.matched ? "Yes" : "No"}
                      {!transaction.approved && (
                        <span className="text-red-600 ml-2">
                          Unapproved <AlertTriangle className="h-4 w-4 inline" />
                        </span>
                      )}
                    </div>
                    {!transaction.matched && (
                      <motion.button
                        onClick={() => handleScanReceipt(transaction.id)}
                        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200"
                        whileHover={{ scale: 1.03 }}
                        aria-label={`Scan receipt for transaction ${transaction.id}`}
                      >
                        Scan Receipt
                      </motion.button>
                    )}
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

function DraggableFund({ id, amount }: { id: string; amount: number }) {
  const [{ isDragging }, drag] = useDrag({
    type: "FUND",
    item: { id, amount },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      className={`p-3 bg-white rounded-lg shadow-sm flex items-center cursor-move ${
        isDragging ? "opacity-50" : "opacity-100"
      }`}
    >
      <DollarSign className="h-5 w-5 text-blue-600 mr-2" />
      <span>KES {amount}</span>
    </div>
  );
}
