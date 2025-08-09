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
    <div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
        Tech Support System
      </h2>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Ticketing System
          </h3>
          <div className="mt-4 p-4 bg-white rounded-lg shadow-sm">
            <input
              type="text"
              placeholder="Describe issue"
              value={newIssue}
              onChange={(e) => setNewIssue(e.target.value)}
              className="p-2 border rounded-lg mr-2"
              aria-label="Issue description"
            />
            <select
              value={newPriority}
              onChange={(e) => setNewPriority(e.target.value as "Low" | "High")}
              className="p-2 border rounded-lg mr-2"
              aria-label="Priority"
            >
              <option value="Low">Low</option>
              <option value="High">High</option>
            </select>
            <motion.button
              onClick={handleCreateTicket}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200"
              whileHover={{ scale: 1.03 }}
              aria-label="Create ticket"
            >
              Create Ticket
            </motion.button>
            <div className="mt-4 space-y-2">
              {tickets.map((ticket, index) => (
                <motion.div
                  key={ticket.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="p-4 bg-white rounded-lg shadow-sm flex items-center"
                >
                  <Wrench className="h-5 w-5 text-blue-600 mr-2" />
                  <div>
                    <div className="font-semibold text-gray-900">
                      {ticket.issue}
                    </div>
                    <div
                      className={`text-sm ${
                        ticket.priority === "High"
                          ? "text-red-600"
                          : "text-gray-600"
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
          <h3 className="text-lg font-semibold text-gray-900">
            Equipment Tracking
          </h3>
          <div className="mt-4 space-y-2">
            {equipment.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="p-4 bg-white rounded-lg shadow-sm flex items-center"
              >
                <Wrench className="h-5 w-5 text-blue-600 mr-2" />
                <div>
                  <div className="font-semibold text-gray-900">{item.name}</div>
                  <div className="text-sm text-gray-600">
                    Maintenance: {item.maintenanceDate} | Warranty:{" "}
                    {item.warrantyExpires}
                  </div>
                  <div
                    className={`text-sm ${
                      item.status === "Needs Replacement"
                        ? "text-red-600"
                        : "text-green-600"
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
