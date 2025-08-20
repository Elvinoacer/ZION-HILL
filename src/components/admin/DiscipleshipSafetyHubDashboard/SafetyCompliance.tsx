import { useAdminStore, useResourceStore } from "@/store";
import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { useEffect } from "react";
import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from "recharts";

export default function SafetyCompliance() {
  const {
    tickets,
    loading: adminLoading,
    error: adminError,
    fetchTasks,
    createTicket,
  } = useAdminStore();
  const {
    equipment: rooms,
    loading: resourceLoading,
    error: resourceError,
    fetchEquipment,
  } = useResourceStore();

  useEffect(() => {
    fetchTasks(); // Assuming tickets are fetched via fetchTasks
    fetchEquipment(); // Assuming rooms are fetched via fetchEquipment (resources of type 'VENUE')
  }, [fetchTasks, fetchEquipment]);

  const incidents = (tickets || []).filter((ticket) => ticket.type === "INCIDENT"); // Filter tickets for incidents

  const chartData = rooms.map((room) => ({
    name: room.name,
    Current: room.currentOccupancy || 0,
    Max: room.capacity || 0,
    Adults: room.requiredAdults || 0,
  }));

  const handleReportIncident = async () => {
    console.log("Submitting incident report");
    // Placeholder for incident details. In a real app, you'd have a form.
    await createTicket({
      issue: "New Incident",
      priority: "HIGH",
      status: "Open",
      type: "INCIDENT",
    });
  };

  if (adminLoading || resourceLoading)
    return (
      <div className="text-center py-8">Loading safety compliance data...</div>
    );
  if (adminError || resourceError)
    return (
      <div className="text-center py-8 text-red-500">
        Error: {adminError || resourceError}
      </div>
    );

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
        Safety & Compliance
      </h2>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Room Monitoring
          </h3>
          <div className="mt-4">
            <BarChart width={600} height={300} data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="Current" fill="#2563eb" />
              <Bar dataKey="Max" fill="#16a34a" />
              <Bar dataKey="Adults" fill="#eab308" />
            </BarChart>
          </div>
          <div className="mt-4 space-y-2">
            {rooms.length === 0 ? (
              <div className="text-center py-12 text-gray-600">
                No rooms found.
              </div>
            ) : (
              rooms.map((room, index) => (
                <motion.div
                  key={room.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="p-4 bg-white rounded-lg shadow-sm flex items-center"
                >
                  <AlertTriangle className="h-5 w-5 text-blue-600 mr-2" />
                  <div>
                    <div className="font-semibold text-gray-900">
                      {room.name}
                    </div>
                    <div className="text-sm text-gray-600">
                      Current: {room.currentOccupancy || 0}/{room.capacity || 0}{" "}
                      | Required Adults: {room.requiredAdults || 0}
                      {/* Assuming a ratio check based on currentOccupancy and requiredAdults */}
                      {room.currentOccupancy &&
                        room.requiredAdults &&
                        room.currentOccupancy / room.requiredAdults > 2 && (
                          <span className="text-red-600 ml-2">
                            Ratio Alert{" "}
                            <AlertTriangle className="h-4 w-4 inline" />
                          </span>
                        )}
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Incident Reporting
          </h3>
          <div className="mt-4 space-y-2">
            <motion.button
              onClick={handleReportIncident}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200"
              whileHover={{ scale: 1.03 }}
              aria-label="Report new incident"
            >
              Report Incident
            </motion.button>
            {incidents.length === 0 ? (
              <div className="text-center py-12 text-gray-600">
                No incidents reported.
              </div>
            ) : (
              incidents.map((incident, index) => (
                <motion.div
                  key={incident.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="p-4 bg-white rounded-lg shadow-sm flex items-center"
                >
                  <AlertTriangle className="h-5 w-5 text-blue-600 mr-2" />
                  <div>
                    <div className="font-semibold text-gray-900">
                      {incident.issue}
                    </div>
                    <div className="text-sm text-gray-600">
                      {incident.status === "Anonymous"
                        ? "Anonymous"
                        : "Reported"}
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
