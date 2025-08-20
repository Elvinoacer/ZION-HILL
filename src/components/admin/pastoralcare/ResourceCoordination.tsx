import React, { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Pencil, Trash2, Plus, AlertTriangle, Search, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { debounce } from "lodash";

interface Counselor {
  id: string;
  name: string;
  email: string;
}

interface UserSearchResult {
  id: string;
  name: string;
  email: string;
}

const ResourceCoordination = () => {
  const [counselors, setCounselors] = useState<Counselor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddEditDialogOpen, setIsAddEditDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<UserSearchResult[]>([]);
  const [isSearchingUsers, setIsSearchingUsers] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserSearchResult | null>(null);
  const [counselorToEdit, setCounselorToEdit] = useState<Counselor | null>(null); // Keep for edit dialog logic if needed later

  const fetchCounselors = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/counselors");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setCounselors(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const searchUsers = useCallback(
    debounce(async (query: string) => {
      if (query.length < 2) {
        setSearchResults([]);
        setIsSearchingUsers(false);
        return;
      }
      setIsSearchingUsers(true);
      try {
        const response = await fetch(`/api/users/search?query=${query}`);
        if (!response.ok) {
          throw new Error("Failed to search users.");
        }
        const data = await response.json();
        setSearchResults(data);
      } catch (err) {
        console.error("Error searching users:", err);
        toast.error("Failed to search users.");
      } finally {
        setIsSearchingUsers(false);
      }
    }, 500),
    []
  );

  useEffect(() => {
    fetchCounselors();
  }, []);

  useEffect(() => {
    searchUsers(searchQuery);
  }, [searchQuery, searchUsers]);

  const handleAddCounselor = async () => {
    if (!selectedUser) {
      toast.error("Please select a user to add as counselor.");
      return;
    }

    const toastId = toast.loading("Adding counselor...");

    try {
      const response = await fetch("/api/counselors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: selectedUser.id }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add counselor.");
      }

      toast.success("Counselor added successfully.", { id: toastId });
      fetchCounselors();
      setIsAddEditDialogOpen(false);
      setSelectedUser(null);
      setSearchQuery("");
      setSearchResults([]);
    } catch (err: any) {
      toast.error(err.message || "Failed to add counselor. Please try again.", {
        id: toastId,
      });
      console.error(err);
    }
  };

  const handleDeleteCounselor = async (id: string) => {
    const toastId = toast.loading("Deleting counselor...");
    try {
      const response = await fetch(`/api/counselors?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete counselor.");
      }

      toast.success("Counselor deleted successfully.", { id: toastId });
      fetchCounselors();
    } catch (err) {
      toast.error("Failed to delete counselor. Please try again.", {
        id: toastId,
      });
      console.error(err);
    }
  };

  const openAddCounselorDialog = () => {
    setIsAddEditDialogOpen(true);
    setSelectedUser(null);
    setSearchQuery("");
    setSearchResults([]);
  };

  if (loading) return (
    <div className="flex items-center justify-center py-12">
      <svg
        className="animate-spin h-8 w-8 text-blue-600"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
      <p className="ml-3 text-lg font-medium text-blue-600">Loading counselors...</p>
    </div>
  );

  if (error) return (
    <div className="flex items-center justify-center py-12 text-red-500">
      <AlertTriangle className="h-8 w-8 text-red-600" />
      <p className="ml-3 text-lg font-medium text-red-600">Error: {error}</p>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl shadow-2xl p-6 border border-gray-200 backdrop-blur-sm"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Counselor Management</h2>
        <Button onClick={openAddCounselorDialog} className="bg-blue-600 hover:bg-blue-700 text-white flex items-center">
          <Plus className="h-5 w-5 mr-2" /> Add New Counselor
        </Button>
      </div>

      {counselors.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p className="text-xl">No counselors found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white shadow-lg rounded-lg border border-gray-200">
          <Table className="w-full">
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="text-gray-700 font-semibold">Name</TableHead>
                <TableHead className="text-gray-700 font-semibold">Email</TableHead>
                <TableHead className="text-gray-700 font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {counselors.map((counselor) => (
                <TableRow key={counselor.id} className="hover:bg-gray-50 transition-colors">
                  <TableCell className="font-medium text-gray-800">{counselor.name}</TableCell>
                  <TableCell className="text-gray-700">{counselor.email}</TableCell>
                  <TableCell className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleDeleteCounselor(counselor.id)} className="text-red-600 hover:bg-red-50 hover:text-red-700">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={isAddEditDialogOpen} onOpenChange={setIsAddEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px] p-6 rounded-xl shadow-2xl">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-2xl font-bold text-gray-900">Add New Counselor</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search users by name or email..."
                className="pl-9 pr-3 py-2 border-gray-300 focus:ring-blue-500 focus:border-blue-500 rounded-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {isSearchingUsers && (
                <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-500 animate-spin" />
              )}
            </div>
            <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-lg">
              {searchResults.length === 0 && searchQuery.length > 1 && !isSearchingUsers ? (
                <p className="p-4 text-center text-gray-500">No users found.</p>
              ) : searchResults.length === 0 && searchQuery.length <= 1 && !isSearchingUsers ? (
                <p className="p-4 text-center text-gray-500">Start typing to search for users.</p>
              ) : (
                <ul className="divide-y divide-gray-100">
                  {searchResults.map((user) => (
                    <li
                      key={user.id}
                      className={`p-3 cursor-pointer hover:bg-gray-50 ${selectedUser?.id === user.id ? "bg-blue-50" : ""}`}
                      onClick={() => setSelectedUser(user)}
                    >
                      <p className="font-medium text-gray-800">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {selectedUser && (
              <div className="p-3 border border-blue-200 bg-blue-50 rounded-lg flex items-center justify-between">
                <div>
                  <p className="font-semibold text-blue-800">Selected: {selectedUser.name}</p>
                  <p className="text-sm text-blue-600">{selectedUser.email}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setSelectedUser(null)} className="text-blue-500 hover:bg-blue-100">
                  Clear
                </Button>
              </div>
            )}
          </div>
          <DialogFooter className="flex justify-end space-x-2 mt-4">
            <Button type="button" variant="outline" onClick={() => setIsAddEditDialogOpen(false)} className="text-gray-700 hover:bg-gray-100">Cancel</Button>
            <Button type="button" onClick={handleAddCounselor} disabled={!selectedUser} className="bg-blue-600 hover:bg-blue-700 text-white">
              Add Counselor
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default ResourceCoordination;