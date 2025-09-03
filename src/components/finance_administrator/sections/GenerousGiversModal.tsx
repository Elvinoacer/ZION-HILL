import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';
import { Download, X, ArrowDown, ArrowUp, Search } from "lucide-react";

interface GenerousGiversModalProps {
  onClose: () => void;
}

interface GivingTransaction {
    id: string;
    date: string;
    amount: number;
    user: { name: string; email: string } | null;
    giving: { name: string } | null;
}

export default function GenerousGiversModal({ onClose }: GenerousGiversModalProps) {
  const [givingHistory, setGivingHistory] = useState<GivingTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortColumn, setSortColumn] = useState<string>("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [opportunityFilter, setOpportunityFilter] = useState<string>("");
  const [amountFilter, setAmountFilter] = useState<string>("");

  useEffect(() => {
    const fetchGivingHistory = async () => {
      try {
        const response = await fetch("/api/giving/analytics");
        if (!response.ok) {
          throw new Error("Failed to fetch giving history");
        }
        const data = await response.json();
        setGivingHistory(data.givingHistory);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGivingHistory();
  }, []);

  const sortedGivingHistory = useMemo(() => {
    let sorted = [...givingHistory].sort((a, b) => {
      let compare = 0;
      if (sortColumn === 'givingOpportunity') {
        const nameA = a.giving?.name || '';
        const nameB = b.giving?.name || '';
        compare = nameA.localeCompare(nameB);
      } else if (sortColumn === 'amount') {
        compare = a.amount - b.amount;
      } else if (sortColumn === 'date') {
        compare = new Date(a.date).getTime() - new Date(b.date).getTime();
      } else if (sortColumn === 'name') {
        const nameA = a.user?.name || '';
        const nameB = b.user?.name || '';
        compare = nameA.localeCompare(nameB);
      }

      return sortDirection === 'asc' ? compare : -compare;
    });

    return sorted.filter(transaction => {
        const opportunityMatch = !opportunityFilter || (transaction.giving?.name && transaction.giving.name.toLowerCase().includes(opportunityFilter.toLowerCase()));
        const amountMatch = !amountFilter || transaction.amount >= Number(amountFilter);
        return opportunityMatch && amountMatch;
    });
  }, [givingHistory, sortColumn, sortDirection, opportunityFilter, amountFilter]);

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('desc');
    }
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [["Date", "Name", "Email", "Amount", "Giving Opportunity"]],
      body: sortedGivingHistory.map((transaction) => [
        new Date(transaction.date).toLocaleDateString(),
        transaction.user?.name || "Anonymous",
        transaction.user?.email || "N/A",
        `KES ${transaction.amount.toLocaleString()}`,
        transaction.giving?.name || "N/A",
      ]),
    });
    doc.save("generous-givers.pdf");
  };

  const SortableHeader = ({ column, title }: { column: string, title: string }) => (
    <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort(column)}>
      <div className="flex items-center">
        {title}
        {sortColumn === column && (
          sortDirection === 'asc' ? <ArrowUp className="ml-2 h-4 w-4" /> : <ArrowDown className="ml-2 h-4 w-4" />
        )}
      </div>
    </th>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-5xl h-[95vh] flex flex-col"
      >
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
          <h2 className="text-3xl font-bold text-gray-800">Generous Givers</h2>
          <div className="flex items-center gap-4">
            <button
              onClick={exportToPDF}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg text-sm font-medium"
            >
              <Download className="h-4 w-4 mr-2" />
              Export PDF
            </button>
            <button onClick={onClose} className="p-2 text-gray-500 hover:bg-gray-200 rounded-full transition-colors">
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                type="text"
                placeholder="Filter by opportunity..."
                value={opportunityFilter}
                onChange={(e) => setOpportunityFilter(e.target.value)}
                className="p-3 pl-10 border rounded-lg w-full bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all duration-300 shadow-sm"
                />
            </div>
            <div className="relative flex-grow">
                <Download className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                type="number"
                placeholder="Filter by minimum amount..."
                value={amountFilter}
                onChange={(e) => setAmountFilter(e.target.value)}
                className="p-3 pl-10 border rounded-lg w-full bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all duration-300 shadow-sm"
                />
            </div>
        </div>
        <div className="flex-grow overflow-y-auto custom-scrollbar">
          {loading ? (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="mt-4 text-lg font-medium text-gray-600">Loading Donors...</p>
                </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full">
                <div className="text-center text-red-600 bg-red-50 p-6 rounded-lg">
                    <X className="h-12 w-12 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold">Error</h3>
                    <p>{error}</p>
                </div>
            </div>
          ) : (
            <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full table-auto divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr className="">
                    <SortableHeader column="date" title="Date" />
                    <SortableHeader column="name" title="Name" />
                    <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <SortableHeader column="amount" title="Amount" />
                    <SortableHeader column="givingOpportunity" title="Giving Opportunity" />
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {sortedGivingHistory.map((transaction, index) => (
                    <tr key={transaction.id} className={`transition-colors duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50`}>
                        <td className="p-4 whitespace-nowrap text-sm text-gray-700">{new Date(transaction.date).toLocaleDateString()}</td>
                        <td className="p-4 whitespace-nowrap text-sm font-medium text-gray-900">{transaction.user?.name || "Anonymous"}</td>
                        <td className="p-4 whitespace-nowrap text-sm text-gray-600">{transaction.user?.email || "N/A"}</td>
                        <td className="p-4 whitespace-nowrap text-sm font-semibold text-green-600">KES {transaction.amount.toLocaleString()}</td>
                        <td className="p-4 whitespace-nowrap text-sm text-gray-800">{transaction.giving?.name || "N/A"}</td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
