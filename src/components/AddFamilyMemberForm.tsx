import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useFamilyStore } from "@/store";
import { User as PrismaUser } from "@prisma/client";

interface AddFamilyMemberFormProps {
  familyId: string;
  onMemberAdded: () => void;
}

export default function AddFamilyMemberForm({
  familyId,
  onMemberAdded,
}: AddFamilyMemberFormProps) {
  const { addFamilyMember } = useFamilyStore();
  const [users, setUsers] = useState<PrismaUser[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/users"); // Assuming an API endpoint to fetch all users
        if (!response.ok) {
          throw new Error(`Error fetching users: ${response.statusText}`);
        }
        const data = await response.json();
        setUsers(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoadingUsers(false);
      }
    };
    fetchUsers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedUserId) {
      try {
        await addFamilyMember(familyId, selectedUserId);
        onMemberAdded();
        setSelectedUserId(null);
      } catch (err: any) {
        setError(err.message);
      }
    }
  };

  if (loadingUsers) return <div className="text-center">Loading users...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <motion.div
      className="bg-white rounded-xl p-6 shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h4 className="text-lg font-semibold mb-4">Add Member to Family</h4>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="user-select"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Select User
          </label>
          <select
            id="user-select"
            value={selectedUserId || ""}
            onChange={(e) => setSelectedUserId(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
            required
          >
            <option value="" disabled>
              Select a user
            </option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name} ({user.email})
              </option>
            ))}
          </select>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Add Member
        </motion.button>
      </form>
    </motion.div>
  );
}
