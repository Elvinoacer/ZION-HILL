import { useState } from "react";
import { motion } from "framer-motion";
import { Users, FileText, Loader2 } from "lucide-react";
import { usePastoralCareStore } from "@/store/pastoralCareStore";
import { Group } from "@/generated/prisma";
import { toast } from "sonner";

export default function SupportGroupOversight() {
  const { groups } = usePastoralCareStore();
  const [sharingLoading, setSharingLoading] = useState<string | null>(null); // Stores the ID of the item being shared

  const handleShareCurriculum = async (item: { url: string; title: string; groupId: string }) => {
    setSharingLoading(item.groupId + item.title); // Unique key for loading state
    try {
      const response = await fetch('/api/secure-materials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(item),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || 'Failed to share material');
      }

      toast.success(`Material '${item.title}' shared securely!`);
    } catch (error: any) {
      console.error("Error sharing material:", error);
      toast.error(`Failed to share material: ${error.message}`);
    } finally {
      setSharingLoading(null);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
        Support Group Oversight
      </h2>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Group Management
          </h3>
          <div className="mt-4 space-y-2">
            {groups.map((group, index) => (
              <motion.div
                key={group.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="p-4 bg-white rounded-lg shadow-sm flex items-center"
              >
                <Users className="h-5 w-5 text-blue-600 mr-2" />
                <div>
                  <div className="font-semibold text-gray-900">
                    {group.name}
                  </div>
                  <div className="text-sm text-gray-600">
                    Attendance: {group.attendance} (Anonymous)
                  </div>
                  <div className="mt-2">
                    {group.curriculum && group.curriculum.map((item, i) => (
                      <motion.button
                        key={i}
                        onClick={() => handleShareCurriculum({ url: item.url, title: item.title, groupId: group.id })}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200 mr-2"
                        whileHover={{ scale: 1.03 }}
                        aria-label={`Share ${item.title}`}
                        disabled={sharingLoading === (group.id + item.title)}
                      >
                        {sharingLoading === (group.id + item.title) ? (
                          <Loader2 className="h-4 w-4 inline mr-1 animate-spin" />
                        ) : (
                          <FileText className="h-4 w-4 inline mr-1" />
                        )}
                        Share {item.title}
                      </motion.button>
                    ))}
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
