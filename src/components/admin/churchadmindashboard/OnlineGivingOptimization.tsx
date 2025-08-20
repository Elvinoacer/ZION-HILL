import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CreditCard, AlertTriangle } from "lucide-react";
import { useDonationStore } from "@/store";

export default function OnlineGivingOptimization() {
  const { gateways, recurringGifts, loading, error, fetchGateways, fetchRecurringGifts, switchGateway, notifyDonor } = useDonationStore();

  useEffect(() => {
    fetchGateways();
    fetchRecurringGifts();
  }, [fetchGateways, fetchRecurringGifts]);

  const handleSwitchGateway = async (id: string) => {
    await switchGateway(id);
    alert(`Gateway ${id} switched to failover!`);
  };

  const handleNotifyDonor = async (id: string) => {
    await notifyDonor(id);
    alert(`Donor for recurring gift ${id} notified!`);
  };

  if (loading) return <div className="text-center py-8">Loading giving optimization data...</div>;
  if (error) return <div className="text-center py-8 text-red-500">Error: {error}</div>;

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
        Online Giving Optimization
      </h2>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Payment Gateway Management
          </h3>
          <div className="mt-4 space-y-2">
            {gateways.length === 0 ? (
              <div className="text-center py-12 text-gray-600">
                No payment gateways found.
              </div>
            ) : (
              Object.values(gateways || {}).map((gateway: any, index: number) => (
                <motion.div
                  key={gateway.id || (gateway.provider ? `${gateway.provider}-${index}` : index)}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="p-4 bg-white rounded-lg shadow-sm flex items-center"
                >
                  <CreditCard className="h-5 w-5 text-blue-600 mr-2" />
                  <div>
                    <div className="font-semibold text-gray-900">
                      {gateway.provider}
                    </div>
                    <div
                      className={`text-sm ${
                        gateway.status === "Online"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      Status: {gateway.status}
                      {gateway.status === "Offline" && (
                        <AlertTriangle className="h-4 w-4 inline ml-1" />
                      )}
                    </div>
                    {gateway.status === "Offline" && (
                      <motion.button
                        onClick={() => handleSwitchGateway(gateway.id)}
                        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200"
                        whileHover={{ scale: 1.03 }}
                        aria-label={`Switch gateway for ${gateway.provider}`}
                      >
                        Switch to Failover
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Recurring Gift Oversight
          </h3>
          <div className="mt-4 space-y-2">
            {recurringGifts.length === 0 ? (
              <div className="text-center py-12 text-gray-600">
                No recurring gifts found.
              </div>
            ) : (
              recurringGifts.map((gift, index) => (
                <motion.div
                  key={gift.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="p-4 bg-white rounded-lg shadow-sm flex items-center"
                >
                  <CreditCard className="h-5 w-5 text-blue-600 mr-2" />
                  <div>
                    <div className="font-semibold text-gray-900">
                      {gift.donorId} - ${gift.amount.toNumber()}
                    </div>
                    <div className="text-sm text-gray-600">
                      Expires: {new Date(gift.endDate).toLocaleDateString()}
                      {gift.status === "LowGiving" && (
                        <span className="text-red-600 ml-2">
                          Low Giving <AlertTriangle className="h-4 w-4 inline" />
                        </span>
                      )}
                    </div>
                    <motion.button
                      onClick={() => handleNotifyDonor(gift.id)}
                      className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200"
                      whileHover={{ scale: 1.03 }}
                      aria-label={`Notify donor for gift ${gift.id}`}
                    >
                      Notify Donor
                    </motion.button>
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
