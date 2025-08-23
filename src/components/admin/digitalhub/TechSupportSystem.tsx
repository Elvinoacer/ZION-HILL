import { useState } from "react";
import { motion } from "framer-motion";
import { Wrench, AlertTriangle } from "lucide-react";
import { useDigitalHubStore } from "@/store/digitalHubStore";

type Ticket = {
  id: number;
  issue: string;
  priority: "Low" | "High";
  assignedTo: string;
};

type Equipment = {
  id: number;
  name: string;
  maintenanceDate: string;
  warrantyExpires: string;
  status: "Operational" | "Needs Replacement";
};

export default function TechSupportSystem() {
  const { createTicket } = useDigitalHubStore();
  const [tickets, setTickets] = useState<Ticket[]>([
    {
      id: 1,
      issue: "Projector Failure",
      priority: "High",
      assignedTo: "Tech Team",
    },
  ]);
  const [newIssue, setNewIssue] = useState("");
  const [newPriority, setNewPriority] = useState<"Low" | "High">("Low");

  const [equipment, setEquipment] = useState<Equipment[]>([
    {
      id: 1,
      name: "Main Camera",
      maintenanceDate: "2024-01-15",
      warrantyExpires: "2024-06-30",
      status: "Operational",
    },
  ]);

  const handleCreateTicket = async () => {
    if (newIssue) {
      await createTicket(newIssue, newPriority);
      setTickets((prev) => [
        ...prev,
        { id: prev.length + 1, issue: newIssue, priority: newPriority, assignedTo: "Tech Team" },
      ]);
      setNewIssue("");
      alert("Ticket created!");
    } else {
      alert("Please enter an issue description.");
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8"> {/* Added responsive padding */}
      <h2 className="text-2xl font-semibold text-white mb-6">
        Tech Support System
      </h2>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-white">
            Ticketing System
          </h3>
          <div className="mt-4 p-4 bg-gray-700/50 rounded-lg shadow-sm border border-gray-600"> {/* Dark theme background and border */}
            <div className="flex flex-col sm:flex-row gap-2 mb-4"> {/* Responsive layout for form elements */}
              <input
                type="text"
                placeholder="Describe issue"
                value={newIssue}
                onChange={(e) => setNewIssue(e.target.value)}
                className="p-2 border rounded-lg flex-1 bg-gray-900 text-gray-200 border-gray-700 focus:ring-blue-400 focus:border-blue-400" /* Dark theme input */
                aria-label="Issue description"
              />
              <select
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value as "Low" | "High")}
                className="p-2 border rounded-lg bg-gray-900 text-gray-200 border-gray-700 focus:ring-blue-400 focus:border-blue-400" /* Dark theme select */
                aria-label="Priority"
              >
                <option value="Low">Low</option>
                <option value="High">High</option>
              </select>
              <motion.button
                onClick={handleCreateTicket}
                className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-500" /* Dark theme button */
                whileHover={{ scale: 1.03 }}
                aria-label="Create ticket"
              >
                Create Ticket
              </motion.button>
            </div>
            <div className="mt-4 space-y-2">
              {tickets.map((ticket, index) => (
                <motion.div
                  key={ticket.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="p-4 bg-gray-800 rounded-lg shadow-sm flex items-center border border-gray-700" /* Dark theme background and border */
                >
                  <Wrench className="h-5 w-5 text-blue-400 mr-2" /> {/* Dark theme icon color */}
                  <div>
                    <div className="font-semibold text-white"> {/* Dark theme text */}
                      {ticket.issue}
                    </div>
                    <div
                      className={`text-sm ${
                        ticket.priority === "High"
                          ? "text-red-400" /* Dark theme red */
                          : "text-gray-300" /* Dark theme gray */
                      }`}
                    >
                      Priority: {ticket.priority} | Assigned:{" "}
                      {ticket.assignedTo}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">
            Equipment Tracking
          </h3>
          <div className="mt-4 space-y-2">
            {equipment.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="p-4 bg-gray-700/50 rounded-lg shadow-sm flex items-center border border-gray-600" /* Dark theme background and border */
              >
                <Wrench className="h-5 w-5 text-blue-400 mr-2" /> {/* Dark theme icon color */}
                <div>
                  <div className="font-semibold text-white">{item.name}</div> {/* Dark theme text */}
                  <div className="text-sm text-gray-300"> {/* Dark theme text */}
                    Maintenance: {item.maintenanceDate} | Warranty:{" "}
                    {item.warrantyExpires}
                  </div>
                  <div
                    className={`text-sm ${
                      item.status === "Needs Replacement"
                        ? "text-red-400" /* Dark theme red */
                        : "text-green-400" /* Dark theme green */
                    }`}
                  >
                    Status: {item.status}
                    {item.status === "Needs Replacement" && (
                      <AlertTriangle className="h-4 w-4 inline ml-1" />
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
