import { motion } from "framer-motion";
import { Ticket } from "@/generated/prisma";
import { useAdminStore } from "@/store";

interface RecentTasksProps {
  tasks: Ticket[];
}

export default function RecentTasks({ tasks }: RecentTasksProps) {
  const { updateTaskStatus } = useAdminStore();

  const handleCheckboxChange = async (taskId: string, currentStatus: string) => {
    const newStatus = currentStatus === "Open" ? "Closed" : "Open";
    await updateTaskStatus(taskId, newStatus);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.1 }}
      className="bg-white rounded-xl shadow-sm overflow-hidden"
    >
      <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4">
        <h2 className="text-lg font-semibold text-white">Your Tasks</h2>
      </div>
      <ul className="divide-y divide-gray-100">
        {tasks.length > 0 ? (
          tasks.map((task, index) => (
            <motion.li
              key={task.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 * index }}
              className="p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start">
                <input
                  id={`task-${task.id}`}
                  name={`task-${task.id}`}
                  type="checkbox"
                  checked={task.status === "Closed"} // Assuming 'Closed' status means completed
                  onChange={() => handleCheckboxChange(task.id, task.status)}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded mt-1"
                  aria-label={`Mark "${task.issue}" as complete`}
                />
                <label
                  htmlFor={`task-${task.id}`}
                  className="ml-3 block text-sm text-gray-700"
                >
                  {task.issue}
                </label>
              </div>
            </motion.li>
          ))
        ) : (
          <li className="p-6 text-center text-gray-500">No tasks assigned</li>
        )}
      </ul>
    </motion.div>
  );
}
