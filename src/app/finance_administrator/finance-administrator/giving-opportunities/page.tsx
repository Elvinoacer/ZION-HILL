import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Giving } from "@/types/giving";
import { useGivingStore } from "@/store";
import { Search, ChevronDown, X, Download, Plus, Edit, Trash } from "lucide-react";

interface GivingOpportunitiesProps {}

export default function GivingOpportunities({}: GivingOpportunitiesProps) {
  const { giving, fetchGiving, createGiving, } = useGivingStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGiving, setSelectedGiving] = useState<Giving | null>(null);

  useEffect(() => {
    fetchGiving();
  }, [fetchGiving]);

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

  const handleCreate = () => {
    setSelectedGiving(null);
    setIsModalOpen(true);
  };

  const handleEdit = (giving: Giving) => {
    setSelectedGiving(giving);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    // await deleteGiving(id);
  };

  const handleSave = async (giving: Omit<Giving, 'id' | 'transactions'>) => {
    if (selectedGiving) {
      // await updateGiving({ ...giving, id: selectedGiving.id });
    } else {
      await createGiving(giving);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
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
            onClick={handleCreate}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Giving Opportunity
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
                <GivingCard
                  key={giving.id}
                  giving={giving}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>
      {isModalOpen && (
        <GivingOpportunityModal
          giving={selectedGiving}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

const GivingCard = ({ giving, onEdit, onDelete }: { giving: Giving, onEdit: (giving: Giving) => void, onDelete: (id: string) => void }) => {
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
        <div className="flex gap-2">
          <button onClick={() => onEdit(giving)} className="p-2 text-blue-600 hover:bg-blue-100 rounded-full">
            <Edit className="h-5 w-5" />
          </button>
          <button onClick={() => onDelete(giving.id)} className="p-2 text-red-600 hover:bg-red-100 rounded-full">
            <Trash className="h-5 w-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const GivingOpportunityModal = ({ giving, onClose, onSave }: { giving: Giving | null, onClose: () => void, onSave: (giving: Omit<Giving, 'id' | 'transactions'>) => void }) => {
  const [name, setName] = useState(giving?.name || "");
  const [description, setDescription] = useState(giving?.description || "");
  const [goalAmount, setGoalAmount] = useState(giving?.goalAmount || 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ name, description, goalAmount });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">{giving ? "Edit" : "Create"} Giving Opportunity</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
              <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
              <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label htmlFor="goalAmount" className="block text-sm font-medium text-gray-700">Goal Amount</label>
              <input type="number" id="goalAmount" value={goalAmount} onChange={(e) => setGoalAmount(Number(e.target.value))} className="w-full p-2 border border-gray-300 rounded-lg" />
            </div>
          </div>
          <div className="flex justify-end gap-4 mt-6">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}
