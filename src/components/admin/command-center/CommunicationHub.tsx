import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Clock } from "lucide-react";

type Message = {
  id: number;
  subject: string;
  category: string;
  department?: string;
};

export default function CommunicationHub() {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, subject: "Prayer Request for John", category: "Prayer Request" },
    {
      id: 2,
      subject: "Facility Booking Inquiry",
      category: "Facility Inquiry",
    },
  ]);

  const [templates, setTemplates] = useState([
    {
      id: 1,
      title: "General Inquiry Response",
      content: "Thank you for reaching out...",
    },
  ]);

  const handleRouteMessage = (id: number, department: string) => {
    console.log(`Routing message ${id} to ${department} via RingCentral`);
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, department } : m))
    );
  };

  const handleSendResponse = (id: number) => {
    console.log(`Sending automated response for template ${id}`);
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
        Centralized Communication Hub
      </h2>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Unified Inbox Management
          </h3>
          <div className="mt-4">
            <select
              className="p-2 border rounded-lg mr-2"
              aria-label="Filter Messages"
            >
              <option>Urgent</option>
              <option>Ministry</option>
              <option>General</option>
            </select>
            <div className="mt-4 space-y-2">
              {messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="p-4 bg-white rounded-lg shadow-sm flex items-center"
                >
                  <Mail className="h-5 w-5 text-blue-600 mr-2" />
                  <div>
                    <div className="font-semibold text-gray-900">
                      {message.subject}
                    </div>
                    <div className="text-sm text-gray-600">
                      Category: {message.category} | Routed to:{" "}
                      {message.department || "Unassigned"}
                    </div>
                    <motion.button
                      onClick={() =>
                        handleRouteMessage(message.id, "Pastoral Care")
                      }
                      className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200"
                      whileHover={{ scale: 1.03 }}
                      aria-label={`Route ${message.subject} to department`}
                    >
                      Route to Department
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Automated Response System
          </h3>
          <div className="mt-4 space-y-2">
            <div className="text-sm text-gray-600">
              Office Hours Alert: Mon-Fri, 9 AM - 5 PM
            </div>
            {templates.map((template, index) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="p-4 bg-white rounded-lg shadow-sm flex items-center"
              >
                <Mail className="h-5 w-5 text-blue-600 mr-2" />
                <div>
                  <div className="font-semibold text-gray-900">
                    {template.title}
                  </div>
                  <div className="text-sm text-gray-600">
                    {template.content.slice(0, 50)}...
                  </div>
                  <motion.button
                    onClick={() => handleSendResponse(template.id)}
                    className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200"
                    whileHover={{ scale: 1.03 }}
                    aria-label={`Send ${template.title}`}
                  >
                    Send Response
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
