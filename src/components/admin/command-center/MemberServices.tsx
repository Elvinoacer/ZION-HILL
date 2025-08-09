import { useState } from "react";
import { motion } from "framer-motion";
import { Users } from "lucide-react";

type User = {
  id: number;
  name: string;
  familyId?: string;
  email: string;
  isVisitor: boolean;
};

export default function MemberServices() {
  const [users, setUsers] = useState<User[]>([
    {
      id: 1,
      name: "John Doe",
      familyId: "FAM001",
      email: "john@example.com",
      isVisitor: false,
    },
    { id: 2, name: "Jane Smith", email: "jane@example.com", isVisitor: true },
  ]);

  const handleBulkUpdate = () => {
    console.log("Performing bulk update for member directory");
    setUsers((prev) =>
      prev.map((u) => ({
        ...u,
        email: u.email.replace("example.com", "church.org"),
      }))
    );
  };

  const handleSendVisitorEmail = (id: number) => {
    console.log(
      `Sending thank-you email to visitor ${id} via Postal Service API`
    );
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
        Member Services
      </h2>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Database Maintenance
          </h3>
          <div className="mt-4">
            <motion.button
              onClick={handleBulkUpdate}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200"
              whileHover={{ scale: 1.03 }}
              aria-label="Perform bulk update"
            >
              Bulk Update Directory
            </motion.button>
            <div className="mt-4 space-y-2">
              {users.map((user, index) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="p-4 bg-white rounded-lg shadow-sm flex items-center"
                >
                  <Users className="h-5 w-5 text-blue-600 mr-2" />
                  <div>
                    <div className="font-semibold text-gray-900">
                      {user.name}
                    </div>
                    <div className="text-sm text-gray-600">
                      Email: {user.email} | Family ID: {user.familyId || "None"}
                      {user.isVisitor && (
                        <span className="ml-2 text-blue-600">Visitor</span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Visitor Follow-Up
          </h3>
          <div className="mt-4 space-y-2">
            {users
              .filter((user) => user.isVisitor)
              .map((user, index) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="p-4 bg-white rounded-lg shadow-sm flex items-center"
                >
                  <Users className="h-5 w-5 text-blue-600 mr-2" />
                  <div>
                    <div className="font-semibold text-gray-900">
                      {user.name}
                    </div>
                    <div className="text-sm text-gray-600">
                      Email: {user.email}
                    </div>
                    <motion.button
                      onClick={() => handleSendVisitorEmail(user.id)}
                      className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200"
                      whileHover={{ scale: 1.03 }}
                      aria-label={`Send thank-you email to ${user.name}`}
                    >
                      Send Thank-You Email
                    </motion.button>
                  </div>
                </motion.div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
