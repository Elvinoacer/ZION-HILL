import { useState } from "react";
import { motion } from "framer-motion";
import {
  Award,
  AlertTriangle,
  Star,
  Heart,
  MessageCircle,
  TrendingUp,
  Gift,
  Zap,
} from "lucide-react";

type Volunteer = {
  id: number;
  name: string;
  hours: number;
  riskAlert: boolean;
  satisfaction: number;
  lastActive: string;
  role: string;
  badges: string[];
};

export default function VolunteerEngagement() {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([
    {
      id: 1,
      name: "John Doe",
      hours: 100,
      riskAlert: false,
      satisfaction: 4.8,
      lastActive: "2 days ago",
      role: "Greeter",
      badges: ["Gold", "Mentor"],
    },
    {
      id: 2,
      name: "Jane Smith",
      hours: 45,
      riskAlert: true,
      satisfaction: 3.2,
      lastActive: "3 weeks ago",
      role: "Nursery",
      badges: ["Silver"],
    },
    {
      id: 3,
      name: "Robert Johnson",
      hours: 250,
      riskAlert: false,
      satisfaction: 4.9,
      lastActive: "1 day ago",
      role: "Worship",
      badges: ["Platinum", "Mentor", "Trainer"],
    },
    {
      id: 4,
      name: "Sarah Williams",
      hours: 75,
      riskAlert: false,
      satisfaction: 4.5,
      lastActive: "5 days ago",
      role: "Youth",
      badges: ["Gold"],
    },
  ]);

  const [activeTab, setActiveTab] = useState<
    "appreciation" | "feedback" | "recognition"
  >("appreciation");

  const handleAwardBadge = (id: number) => {
    console.log(`Awarding badge to volunteer ${id}`);
    // In a real app, this would update the volunteer's badges
  };

  const handleAnalyzeFeedback = (id: number) => {
    console.log(
      `Analyzing feedback for volunteer ${id} with AI sentiment analysis`
    );
  };

  const handleSendAppreciation = (id: number) => {
    console.log(`Sending appreciation message to volunteer ${id}`);
  };

  const milestones = [50, 100, 250, 500, 1000];
  const badgeOptions = [
    "Gold",
    "Silver",
    "Bronze",
    "Mentor",
    "Trainer",
    "Leader",
  ];

  return (
    <div className="text-gray-200">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <h2 className="text-2xl font-semibold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Volunteer Engagement
        </h2>

        {/* Tab Navigation */}
        <div className="flex bg-gray-700 rounded-lg p-1 w-fit">
          <button
            onClick={() => setActiveTab("appreciation")}
            className={`flex items-center gap-1 px-3 py-2 text-xs sm:text-sm rounded-md transition-colors ${
              activeTab === "appreciation"
                ? "bg-blue-600 text-white"
                : "text-gray-300 hover:text-white"
            }`}
          >
            <Star className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Appreciation</span>
          </button>
          <button
            onClick={() => setActiveTab("feedback")}
            className={`flex items-center gap-1 px-3 py-2 text-xs sm:text-sm rounded-md transition-colors ${
              activeTab === "feedback"
                ? "bg-blue-600 text-white"
                : "text-gray-300 hover:text-white"
            }`}
          >
            <MessageCircle className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Feedback</span>
          </button>
          <button
            onClick={() => setActiveTab("recognition")}
            className={`flex items-center gap-1 px-3 py-2 text-xs sm:text-sm rounded-md transition-colors ${
              activeTab === "recognition"
                ? "bg-blue-600 text-white"
                : "text-gray-300 hover:text-white"
            }`}
          >
            <Award className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Recognition</span>
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Appreciation Tools */}
        {activeTab === "appreciation" && (
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-400" />
              Appreciation Tools
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-blue-900/20 p-4 rounded-lg border border-blue-700/30">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="h-5 w-5 text-blue-400" />
                  <h4 className="font-medium text-white">Quick Appreciation</h4>
                </div>
                <p className="text-sm text-gray-300 mb-3">
                  Send a quick thank you to volunteers who need encouragement
                </p>
                <button className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors">
                  Send Group Thank You
                </button>
              </div>

              <div className="bg-purple-900/20 p-4 rounded-lg border border-purple-700/30">
                <div className="flex items-center gap-2 mb-2">
                  <Gift className="h-5 w-5 text-purple-400" />
                  <h4 className="font-medium text-white">Reward Center</h4>
                </div>
                <p className="text-sm text-gray-300 mb-3">
                  Manage and distribute volunteer rewards and incentives
                </p>
                <button className="w-full px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm transition-colors">
                  View Reward Options
                </button>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3">
              {volunteers.map((volunteer, index) => (
                <motion.div
                  key={volunteer.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="p-4 bg-gray-700/50 rounded-lg border border-gray-600/50 hover:border-blue-500/30 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                    <div className="bg-blue-900/30 p-2 rounded-lg">
                      <Award className="h-5 w-5 text-blue-400" />
                    </div>

                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                        <div>
                          <div className="font-semibold text-white">
                            {volunteer.name}
                          </div>
                          <div className="text-sm text-blue-300">
                            {volunteer.role}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1 text-sm text-yellow-300">
                            <Star className="h-4 w-4 fill-yellow-400/20" />
                            <span>{volunteer.satisfaction}/5</span>
                          </div>
                          <div className="text-xs text-gray-400">
                            {volunteer.lastActive}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-3">
                        <div className="flex items-center gap-1 px-2 py-1 bg-gray-600/50 rounded-full text-xs">
                          <TrendingUp className="h-3 w-3 text-green-400" />
                          <span>{volunteer.hours} hours</span>
                        </div>

                        {volunteer.badges.map((badge, i) => (
                          <span
                            key={i}
                            className="px-2 py-1 bg-yellow-900/30 text-yellow-300 rounded-full text-xs"
                          >
                            {badge}
                          </span>
                        ))}
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <motion.button
                          onClick={() => handleSendAppreciation(volunteer.id)}
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors"
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          Send Thanks
                        </motion.button>

                        <motion.button
                          onClick={() => handleAwardBadge(volunteer.id)}
                          className="px-3 py-1.5 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm transition-colors"
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          Award Badge
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Feedback Collection */}
        {activeTab === "feedback" && (
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-blue-400" />
              Feedback Collection & Analysis
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-green-900/20 p-4 rounded-lg border border-green-700/30">
                <div className="flex items-center gap-2 mb-2">
                  <Heart className="h-5 w-5 text-green-400" />
                  <h4 className="font-medium text-white">
                    Satisfaction Overview
                  </h4>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">Avg. Rating</span>
                  <span className="text-lg font-semibold text-green-400">
                    {(
                      volunteers.reduce(
                        (sum, volunteer) => sum + volunteer.satisfaction,
                        0
                      ) / volunteers.length
                    ).toFixed(1)}
                    /5
                  </span>
                </div>
              </div>

              <div className="bg-amber-900/20 p-4 rounded-lg border border-amber-700/30">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-5 w-5 text-amber-400" />
                  <h4 className="font-medium text-white">At-Risk Volunteers</h4>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">Need Attention</span>
                  <span className="text-lg font-semibold text-amber-400">
                    {volunteers.filter((v) => v.riskAlert).length}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3">
              {volunteers.map((volunteer, index) => (
                <motion.div
                  key={volunteer.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className={`p-4 rounded-lg border transition-colors ${
                    volunteer.riskAlert
                      ? "bg-red-900/20 border-red-700/30 hover:border-red-500/30"
                      : "bg-gray-700/50 border-gray-600/50 hover:border-blue-500/30"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                    <div
                      className={`p-2 rounded-lg ${
                        volunteer.riskAlert ? "bg-red-900/30" : "bg-blue-900/30"
                      }`}
                    >
                      {volunteer.riskAlert ? (
                        <AlertTriangle className="h-5 w-5 text-red-400" />
                      ) : (
                        <MessageCircle className="h-5 w-5 text-blue-400" />
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                        <div>
                          <div className="font-semibold text-white">
                            {volunteer.name}
                          </div>
                          <div className="text-sm text-blue-300">
                            {volunteer.role}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {volunteer.riskAlert && (
                            <div className="flex items-center gap-1 px-2 py-1 bg-red-900/30 text-red-300 rounded-full text-xs">
                              <AlertTriangle className="h-3 w-3" />
                              <span>At Risk</span>
                            </div>
                          )}

                          <div className="flex items-center gap-1 text-sm text-yellow-300">
                            <Star className="h-4 w-4 fill-yellow-400/20" />
                            <span>{volunteer.satisfaction}/5</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-sm text-gray-300 mb-3">
                        Last active: {volunteer.lastActive}
                        {volunteer.riskAlert && (
                          <span className="text-red-300 ml-2">
                            • Needs follow-up
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <motion.button
                          onClick={() => handleAnalyzeFeedback(volunteer.id)}
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors"
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          Analyze Feedback
                        </motion.button>

                        <motion.button
                          onClick={() => handleSendAppreciation(volunteer.id)}
                          className="px-3 py-1.5 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm transition-colors"
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          Request Feedback
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Recognition */}
        {activeTab === "recognition" && (
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Award className="h-5 w-5 text-purple-400" />
              Recognition Programs
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {milestones.map((milestone) => (
                <div
                  key={milestone}
                  className="bg-gray-700/50 p-4 rounded-lg border border-gray-600/50 text-center"
                >
                  <div className="text-2xl font-bold text-white">
                    {milestone}+
                  </div>
                  <div className="text-sm text-gray-300">Hours Club</div>
                  <div className="text-xs text-blue-400 mt-1">
                    {volunteers.filter((v) => v.hours >= milestone).length}{" "}
                    members
                  </div>
                </div>
              ))}
            </div>

            <div className="mb-6">
              <h4 className="text-md font-medium text-white mb-3">
                Available Badges
              </h4>
              <div className="flex flex-wrap gap-2">
                {badgeOptions.map((badge) => (
                  <div
                    key={badge}
                    className="px-3 py-2 bg-purple-900/30 border border-purple-700/30 rounded-lg"
                  >
                    <div className="text-sm text-purple-300">{badge}</div>
                  </div>
                ))}
              </div>
            </div>

            <h4 className="text-md font-medium text-white mb-3">
              Top Volunteers
            </h4>
            <div className="grid grid-cols-1 gap-3">
              {volunteers
                .sort((a, b) => b.hours - a.hours)
                .slice(0, 3)
                .map((volunteer, index) => (
                  <motion.div
                    key={volunteer.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="p-4 bg-gray-700/50 rounded-lg border border-gray-600/50 hover:border-purple-500/30 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="bg-purple-900/30 p-2 rounded-lg">
                          <Award className="h-5 w-5 text-purple-400" />
                        </div>
                        <div>
                          <div className="font-semibold text-white">
                            {volunteer.name}
                          </div>
                          <div className="text-sm text-purple-300">
                            {volunteer.hours} hours • {volunteer.role}
                          </div>
                        </div>
                      </div>

                      <div className="text-2xl font-bold text-yellow-400">
                        #{index + 1}
                      </div>
                    </div>
                  </motion.div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
