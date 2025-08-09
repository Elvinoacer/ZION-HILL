import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Shield, Lock, Eye, EyeOff } from "lucide-react";
import { useParentalControlStore } from "@/store/parentalControlStore";

export default function ParentalControls() {
  const testUserId = "clw021111000008l701111111"; // Placeholder user ID
  const { controls, loading, error, fetchParentalControls, updateParentalControls } = useParentalControlStore();

  useEffect(() => {
    fetchParentalControls(testUserId);
  }, [fetchParentalControls, testUserId]);

  const handleToggle = async (control: keyof typeof controls) => {
    const updatedValue = !controls[control];
    await updateParentalControls(testUserId, { [control]: updatedValue });
  };

  const handleSliderChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newScreenTimeHours = parseInt(e.target.value);
    await updateParentalControls(testUserId, { screenTimeHours: newScreenTimeHours });
  };

  if (loading) return <div className="text-center py-8">Loading parental controls...</div>;
  if (error) return <div className="text-center py-8 text-red-500">Error: {error}</div>;

  return (
    <motion.div
      className="bg-gradient-to-br from-white to-blue-50 rounded-xl p-6 shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      role="region"
      aria-labelledby="parental-controls-heading"
    >
      <h3
        id="parental-controls-heading"
        className="text-xl font-semibold mb-4 flex items-center text-gray-800"
      >
        <Shield className="mr-2 h-5 w-5" aria-hidden="true" /> Parental Controls
      </h3>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
          <div className="flex items-center">
            <Lock className="h-5 w-5 mr-3 text-blue-600" aria-hidden="true" />
            <div>
              <div className="font-medium text-gray-800">Content Filtering</div>
              <div className="text-sm text-gray-600">
                Restrict inappropriate content
              </div>
            </div>
          </div>
          <button
            onClick={() => handleToggle("contentFilter")}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 ${
              controls.contentFilter
                ? "bg-gradient-to-r from-blue-500 to-indigo-600"
                : "bg-gray-200"
            }`}
            aria-checked={controls.contentFilter}
            role="switch"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                handleToggle("contentFilter");
              }
            }}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                controls.contentFilter ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
          <div className="flex items-center">
            <Eye className="h-5 w-5 mr-3 text-blue-600" aria-hidden="true" />
            <div>
              <div className="font-medium text-gray-800">
                Activity Monitoring
              </div>
              <div className="text-sm text-gray-600">
                Track child&apos;s activity
              </div>
            </div>
          </div>
          <button
            onClick={() => handleToggle("activityMonitoring")}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 ${
              controls.activityMonitoring
                ? "bg-gradient-to-r from-blue-500 to-indigo-600"
                : "bg-gray-200"
            }`}
            aria-checked={controls.activityMonitoring}
            role="switch"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                handleToggle("activityMonitoring");
              }
            }}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                controls.activityMonitoring ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        <div className="p-3 border border-gray-200 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <EyeOff
                className="h-5 w-5 mr-3 text-blue-600"
                aria-hidden="true"
              />
              <div>
                <div className="font-medium text-gray-800">
                  Screen Time Limit
                </div>
                <div className="text-sm text-gray-600">
                  Set daily usage limit
                </div>
              </div>
            </div>
            <button
              onClick={() => handleToggle("screenTimeLimit")}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 ${
                controls.screenTimeLimit
                  ? "bg-gradient-to-r from-blue-500 to-indigo-600"
                  : "bg-gray-200"
              }`}
              aria-checked={controls.screenTimeLimit}
              role="switch"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  handleToggle("screenTimeLimit");
                }
              }}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  controls.screenTimeLimit ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
          {controls.screenTimeLimit && (
            <div className="mt-3 pl-8">
              <label htmlFor="screenTimeHours" className="sr-only">
                Screen Time Hours
              </label>
              <input
                id="screenTimeHours"
                type="range"
                min="1"
                max="8"
                value={controls.screenTimeHours}
                onChange={handleSliderChange}
                className="w-full accent-blue-500"
                aria-valuemin={1}
                aria-valuemax={8}
                aria-valuenow={controls.screenTimeHours}
                aria-label="Set daily screen time limit"
              />
              <div className="text-sm text-gray-600 mt-1">
                {controls.screenTimeHours} hour
                {controls.screenTimeHours !== 1 ? "s" : ""} per day
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
          <div className="flex items-center">
            <Shield className="h-5 w-5 mr-3 text-blue-600" aria-hidden="true" />
            <div>
              <div className="font-medium text-gray-800">
                Messaging Restrictions
              </div>
              <div className="text-sm text-gray-600">
                Limit who can message your child
              </div>
            </div>
          </div>
          <button
            onClick={() => handleToggle("messagingRestrictions")}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 ${
              controls.messagingRestrictions
                ? "bg-gradient-to-r from-blue-500 to-indigo-600"
                : "bg-gray-200"
            }`}
            aria-checked={controls.messagingRestrictions}
            role="switch"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                handleToggle("messagingRestrictions");
              }
            }}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                controls.messagingRestrictions
                  ? "translate-x-6"
                  : "translate-x-1"
              }`}
            />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
