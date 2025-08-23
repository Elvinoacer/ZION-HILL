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
import {
  Pencil,
  Trash2,
  Plus,
  AlertTriangle,
  Search,
  Loader2,
} from "lucide-react";
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
  const [selectedUser, setSelectedUser] = useState<UserSearchResult | null>(
    null
  );
  const [counselorToEdit, setCounselorToEdit] = useState<Counselor | null>(
    null
  ); // Keep for edit dialog logic if needed later

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

  if (loading)
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
        <p className="ml-3 text-lg font-medium text-blue-400">
          Loading counselors...
        </p>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center py-12">
        <div className="bg-red-900/30 border border-red-700/50 rounded-xl p-6 max-w-md mx-auto text-center text-white shadow-lg">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-900/50 mb-4">
            <AlertTriangle className="h-6 w-6 text-red-400" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-red-400 mb-2">
            Error
          </h2>
          <p className="text-red-300 mb-6">{error}</p>
          <button
            onClick={fetchCounselors}
            className="bg-red-800/50 hover:bg-red-800/80 text-red-200 font-semibold py-2 px-4 rounded-lg border border-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-800 rounded-xl shadow-2xl p-6 border border-gray-700/50"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Counselor Management
        </h2>
        <Button
          onClick={openAddCounselorDialog}
          className="bg-blue-700 hover:bg-blue-800 text-white flex items-center"
        >
          <Plus className="h-5 w-5 mr-2" /> Add New Counselor
        </Button>
      </div>

      {counselors.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <p className="text-xl">No counselors found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-gray-800 shadow-lg rounded-lg border border-gray-700/50">
          <Table className="w-full">
            <TableHeader className="bg-gray-700/30">
              <TableRow>
                <TableHead className="text-gray-300 font-semibold">
                  Name
                </TableHead>
                <TableHead className="text-gray-300 font-semibold">
                  Email
                </TableHead>
                <TableHead className="text-gray-300 font-semibold">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-700">
              {counselors.map((counselor) => (
                <TableRow
                  key={counselor.id}
                  className="hover:bg-gray-700 transition-colors"
                >
                  <TableCell className="font-medium text-white">
                    {counselor.name}
                  </TableCell>
                  <TableCell className="text-gray-300">
                    {counselor.email}
                  </TableCell>
                  <TableCell className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteCounselor(counselor.id)}
                      className="text-red-400 hover:bg-red-900/30 hover:text-red-300 border-red-700/50"
                    >
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
        <DialogContent className="sm:max-w-[500px] p-6 rounded-xl shadow-2xl bg-gray-800 text-white border-gray-700/50">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-2xl font-bold text-white">
              Add New Counselor
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search users by name or email..."
                className="pl-9 pr-3 py-2 border-gray-700 focus:ring-blue-400 focus:border-blue-400 rounded-lg bg-gray-900 text-gray-200"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {isSearchingUsers && (
                <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-400 animate-spin" />
              )}
            </div>
            <div className="max-h-60 overflow-y-auto border border-gray-700 rounded-lg">
              {searchResults.length === 0 &&
              searchQuery.length > 1 &&
              !isSearchingUsers ? (
                <p className="p-4 text-center text-gray-400">No users found.</p>
              ) : searchResults.length === 0 &&
                searchQuery.length <= 1 &&
                !isSearchingUsers ? (
                <p className="p-4 text-center text-gray-400">
                  Start typing to search for users.
                </p>
              ) : (
                <ul className="divide-y divide-gray-700">
                  {searchResults.map((user) => (
                    <li
                      key={user.id}
                      className={`p-3 cursor-pointer hover:bg-gray-700/50 ${selectedUser?.id === user.id ? "bg-blue-900/30" : ""}`}
                      onClick={() => setSelectedUser(user)}
                    >
                      <p className="font-medium text-white">{user.name}</p>
                      <p className="text-sm text-gray-300">{user.email}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {selectedUser && (
              <div className="p-3 border border-blue-700/50 bg-blue-900/30 rounded-lg flex items-center justify-between">
                <div>
                  <p className="font-semibold text-blue-400">
                    Selected: {selectedUser.name}
                  </p>
                  <p className="text-sm text-blue-300">
                    {selectedUser.email}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedUser(null)}
                  className="text-blue-400 hover:bg-blue-900/30"
                >
                  Clear
                </Button>
              </div>
            )}
          </div>
          <DialogFooter className="flex justify-end space-x-2 mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsAddEditDialogOpen(false)}
              className="text-gray-300 hover:bg-gray-700/50 border-gray-700"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleAddCounselor}
              disabled={!selectedUser}
              className="bg-blue-700 hover:bg-blue-800 text-white"
            >
              Add Counselor
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default ResourceCoordination;