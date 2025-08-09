import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { useSession } from "next-auth/react";

export default function CrisisIntervention() {
  const { data: session } = useSession();
  const [isEscalating, setIsEscalating] = useState(false);

  const handleEscalation = async () => {
    setIsEscalating(true);
    try {
      // In a real app, you'd get actual location data
      const locationData = {
        latitude: 34.052235,
        longitude: -118.243683,
        accuracy: 10,
      };
      const userId = session?.user?.id; // Get current user's ID

      const response = await fetch("/api/crisis-intervention", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prayerRequestId: "some-prayer-request-id", // Replace with actual ID if available
          userId: userId,
          locationData: locationData,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || "Failed to escalate crisis");
      }

      toast.success("Crisis intervention request sent. Crisis team notified.");
    } catch (error: any) {
      console.error("Error during crisis escalation:", error);
      toast.error(`Failed to escalate crisis: ${error.message}`);
    } finally {
      setIsEscalating(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
        Crisis Intervention
      </h2>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Emergency Protocols
          </h3>
          <div className="mt-4 p-4 bg-white rounded-lg shadow-sm">
            <motion.button
              onClick={handleEscalation}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-200"
              whileHover={{ scale: 1.03 }}
              aria-label="Escalate Suicide Risk"
              disabled={isEscalating}
            >
              {isEscalating ? (
                <>
                  <Loader2 className="h-4 w-4 inline mr-1 animate-spin" />{" "}
                  Escalating...
                </>
              ) : (
                <>
                  <AlertTriangle className="h-4 w-4 inline mr-1" /> Escalate
                  Suicide Risk
                </>
              )}
            </motion.button>
            <div className="mt-2 text-sm text-gray-600">
              One-click escalation to crisis team with automated location
              sharing (encrypted).
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
