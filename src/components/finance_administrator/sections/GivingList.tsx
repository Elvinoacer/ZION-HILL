import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Giving } from "@/types/giving";
import { useGivingStore } from "@/store";
import { Search, ChevronDown, X, Download, Edit, Trash } from "lucide-react";
import CreateGivingOpportunityModal from "./CreateGivingOpportunityModal";

interface GivingListProps {
  giving: Giving[];
}

export default function GivingList({ giving }: GivingListProps) {
  const { deleteGiving } = useGivingStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredGiving = useMemo(() => {
    return giving.filter((g) => {
      const matchesSearch =
        searchQuery === "" ||
        g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (g.description &&
          g.description.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesSearch;
    });
  }, [giving, searchQuery]);

  const exportData = (format: "csv" | "json") => {
    const data =
      format === "csv"
        ? convertToCSV(filteredGiving)
        : JSON.stringify(filteredGiving, null, 2);

    const blob = new Blob([data], {
      type: format === "csv" ? "text/csv" : "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `giving-${
      new Date().toISOString().split("T")[0]
    }.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const convertToCSV = (data: Giving[]) => {
    const headers = [
      "ID",
      "Name",
      "Description",
      "Goal Amount",
      "Start Date",
      "End Date",
    ];
    const rows = data.map((g) => [
      g.id,
      g.name,
      g.description || "N/A",
      g.goalAmount || "N/A",
      g.startDate ? new Date(g.startDate).toLocaleDateString() : "N/A",
      g.endDate ? new Date(g.endDate).toLocaleDateString() : "N/A",
    ]);

    return [headers, ...rows].map((row) => row.join(",")).join("\n");
  };

  return (
    <div className="space-y-6">
      <CreateGivingOpportunityModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            Giving Opportunities
          </h2>
          <p className="text-gray-600 mt-1">
            Manage and track all giving opportunities.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
          >
            Create Giving Opportunity
          </button>
          <button
            onClick={() => exportData("csv")}
            className="flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 transition-colors text-sm font-medium"
          >
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <div className="relative flex-1 w-full md:max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search giving opportunities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          Giving Opportunities ({filteredGiving.length})
        </h3>
        <AnimatePresence>
          {filteredGiving.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300"
            >
              <p className="text-gray-600">
                No giving opportunities match your current filters.
              </p>
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                  }}
                  className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
                >
                  Clear all filters
                </button>
              )}
            </motion.div>
          ) : (
            <div className="space-y-4">
              {filteredGiving.map((giving) => (
                <GivingCard key={giving.id} giving={giving} onDelete={deleteGiving} />
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

const GivingCard = ({ giving, onDelete }: { giving: Giving, onDelete: (id: string) => void }) => {
  if (!giving) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-4 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center mb-2">
            <span className="font-semibold text-lg text-gray-900">
              {giving.name}
            </span>
          </div>
          <p className="text-sm text-gray-600">{giving.description}</p>
        </div>
        <div className="flex space-x-2">
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <Edit className="h-4 w-4" />
          </button>
          <button onClick={() => onDelete(giving.id)} className="p-2 hover:bg-gray-100 rounded-full">
            <Trash className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};