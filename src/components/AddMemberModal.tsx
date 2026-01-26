"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Search } from "lucide-react";

interface User {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
}

interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  ministryId: string;
  onMemberAdded: () => void;
}

const AddMemberModal = ({
  isOpen,
  onClose,
  ministryId,
  onMemberAdded,
}: AddMemberModalProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      if (isOpen) {
        setLoading(true);
        try {
          const res = await fetch(`/api/users`);
          const data = await res.json();
          setAllUsers(data);
          setSearchResults(data);
        } catch (error) {
          console.error("Failed to fetch users", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchUsers();
  }, [isOpen]);

  const handleSearch = () => {
    if (!searchQuery) {
      setSearchResults(allUsers);
      return;
    }
    const filteredUsers = allUsers.filter((user) =>
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSearchResults(filteredUsers);
  };

  const handleAddMember = async () => {
    if (!selectedUser) return;
    setIsAdding(true);
    try {
      const res = await fetch(`/api/ministries/add-member`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ministryId,
          userId: selectedUser.id,
        }),
      });

      if (res.ok) {
        onMemberAdded();
        onClose();
      } else {
        console.error("Failed to add member");
      }
    } catch (error) {
      console.error("Failed to add member", error);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Member</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Search for a user..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                handleSearch();
              }}
            />
          </div>
          <div>
            {searchResults.map((user) => (
              <div
                key={user.id}
                className={`p-2 rounded-md cursor-pointer ${
                  selectedUser?.id === user.id ? "bg-gray-200" : ""
                }`}
                onClick={() => setSelectedUser(user)}
              >
                {user.name} ({user.email})
              </div>
            ))}
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleAddMember}
            disabled={!selectedUser || isAdding}
          >
            {isAdding ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Add Member"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddMemberModal;
