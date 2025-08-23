"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Edit,
  Trash,
  FileText,
  UserPlus,
  Briefcase,
  Users,
  Search,
  Filter,
  MoreVertical,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  BarChart3,
  Download,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface VolunteeringOpportunity {
  id: string;
  title: string;
  description: string;
  type: string;
  imageUrl?: string;
  requiredPeople: number;
  currentApplicants: number;
  assignedPeople: number;
  isAssigned: boolean;
  coordinator: {
    name: string;
  };
  applications: VolunteeringApplication[];
  customFields: Record<string, string>;
  createdAt: string;
  location: string;
  timeCommitment: string;
}

interface VolunteeringApplication {
  id: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  applicant: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    skills?: string[];
  };
  appliedAt: string;
  coordinatorNotes?: string;
  opportunity: {
    id: string;
    title: string;
    coordinatorId: string;
    type: string;
  };
}

export default function VolunteerHubDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [opportunities, setOpportunities] = useState<VolunteeringOpportunity[]>(
    []
  );
  const [filteredOpportunities, setFilteredOpportunities] = useState<
    VolunteeringOpportunity[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [isOpportunityModalOpen, setIsOpportunityModalOpen] = useState(false);
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
  const [currentOpportunity, setCurrentOpportunity] =
    useState<VolunteeringOpportunity | null>(null);
  const [currentApplication, setCurrentApplication] =
    useState<VolunteeringApplication | null>(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    type: "",
    imageUrl: "",
    requiredPeople: 1,
    location: "",
    timeCommitment: "",
    customFields: {} as Record<string, string>,
  });
  const [newCustomFieldName, setNewCustomFieldName] = useState("");
  const [newCustomFieldValue, setNewCustomFieldValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<"opportunities" | "applications">(
    "opportunities"
  );
  const [expandedOpportunity, setExpandedOpportunity] = useState<string | null>(
    null
  );

  useEffect(() => {
    if (status === "loading") return;
    fetchOpportunities();
  }, [session, status, router]);

  useEffect(() => {
    filterOpportunities();
  }, [opportunities, searchQuery, statusFilter, typeFilter]);

  const fetchOpportunities = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        "/api/volunteering-opportunities?showAssigned=true"
      );
      if (!res.ok) {
        throw new Error("Failed to fetch opportunities");
      }
      const data = await res.json();
      setOpportunities(data);
    } catch (error) {
      console.error("Error fetching opportunities:", error);
      toast.error("Failed to load volunteering opportunities.");
    } finally {
      setLoading(false);
    }
  };

  const filterOpportunities = () => {
    let filtered = opportunities;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (opp) =>
          opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          opp.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          opp.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
          opp.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((opp) =>
        statusFilter === "assigned" ? opp.isAssigned : !opp.isAssigned
      );
    }

    // Apply type filter
    if (typeFilter !== "all") {
      filtered = filtered.filter((opp) => opp.type === typeFilter);
    }

    setFilteredOpportunities(filtered);
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddCustomField = () => {
    if (newCustomFieldName && newCustomFieldValue) {
      setForm((prev) => ({
        ...prev,
        customFields: {
          ...prev.customFields,
          [newCustomFieldName]: newCustomFieldValue,
        },
      }));
      setNewCustomFieldName("");
      setNewCustomFieldValue("");
    }
  };

  const handleRemoveCustomField = (fieldName: string) => {
    setForm((prev) => {
      const newCustomFields = { ...prev.customFields };
      delete newCustomFields[fieldName];
      return { ...prev, customFields: newCustomFields };
    });
  };

  const handleSubmitOpportunity = async () => {
    try {
      const method = currentOpportunity ? "PUT" : "POST";
      const url = currentOpportunity
        ? `/api/volunteering-opportunities/${currentOpportunity.id}`
        : "/api/volunteering-opportunities";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(
          errorData.message ||
            `Failed to ${currentOpportunity ? "update" : "create"} opportunity`
        );
      }

      toast.success(
        `Opportunity ${
          currentOpportunity ? "updated" : "created"
        } successfully!`
      );
      setIsOpportunityModalOpen(false);
      fetchOpportunities();
    } catch (error: any) {
      console.error("Error submitting opportunity:", error);
      toast.error(
        error.message ||
          `Failed to ${currentOpportunity ? "update" : "create"} opportunity.`
      );
    }
  };

  const handleDeleteOpportunity = async (id: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this opportunity? This action cannot be undone."
      )
    ) {
      return;
    }
    try {
      const res = await fetch(`/api/volunteering-opportunities/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to delete opportunity");
      }

      toast.success("Opportunity deleted successfully!");
      fetchOpportunities();
    } catch (error: any) {
      console.error("Error deleting opportunity:", error);
      toast.error(error.message || "Failed to delete opportunity.");
    }
  };

  const handleMarkAssigned = async (
    opportunity: VolunteeringOpportunity,
    isAssigned: boolean
  ) => {
    try {
      const res = await fetch(
        `/api/volunteering-opportunities/${opportunity.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ isAssigned }),
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(
          errorData.message || "Failed to update assignment status"
        );
      }

      toast.success(
        `Opportunity marked as ${isAssigned ? "assigned" : "unassigned"}!`
      );
      fetchOpportunities();
    } catch (error: any) {
      console.error("Error marking assigned:", error);
      toast.error(error.message || "Failed to update assignment status.");
    }
  };

  const handleAssignCounselorRole = async (applicantId: string) => {
    if (
      !confirm(
        "Are you sure you want to assign the COUNSELOR role to this user?"
      )
    ) {
      return;
    }
    try {
      const res = await fetch(`/api/users/assign-role/${applicantId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ roleToAdd: "COUNSELOR" }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to assign counselor role");
      }

      toast.success("COUNSELOR role assigned successfully!");
    } catch (error: any) {
      console.error("Error assigning counselor role:", error);
      toast.error(error.message || "Failed to assign counselor role.");
    }
  };

  const handleUpdateApplicationStatus = async (
    applicationId: string,
    status: "PENDING" | "APPROVED" | "REJECTED",
    coordinatorNotes?: string
  ) => {
    try {
      const res = await fetch(
        `/api/volunteering-applications/${applicationId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status, coordinatorNotes }),
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(
          errorData.message || "Failed to update application status"
        );
      }

      toast.success("Application status updated!");
      setIsApplicationModalOpen(false);
      fetchOpportunities();
    } catch (error: any) {
      console.error("Error updating application status:", error);
      toast.error("Error updating application status.");
    }
  };

  const openOpportunityModal = (opportunity?: VolunteeringOpportunity) => {
    if (opportunity) {
      setCurrentOpportunity(opportunity);
      setForm({
        title: opportunity.title,
        description: opportunity.description || "",
        type: opportunity.type,
        imageUrl: opportunity.imageUrl || "",
        requiredPeople: opportunity.requiredPeople,
        location: opportunity.location || "",
        timeCommitment: opportunity.timeCommitment || "",
        customFields: opportunity.customFields || {},
      });
    } else {
      setCurrentOpportunity(null);
      setForm({
        title: "",
        description: "",
        type: "",
        imageUrl: "",
        requiredPeople: 1,
        location: "",
        timeCommitment: "",
        customFields: {},
      });
    }
    setIsOpportunityModalOpen(true);
  };

  const openApplicationModal = (application: VolunteeringApplication) => {
    setCurrentApplication(application);
    setIsApplicationModalOpen(true);
  };

  const toggleExpandOpportunity = (id: string) => {
    setExpandedOpportunity(expandedOpportunity === id ? null : id);
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-lg font-medium text-gray-300">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  const allApplications = opportunities.flatMap((opp) =>
    opp.applications.map((app) => ({
      ...app,
      opportunity: {
        id: opp.id,
        title: opp.title,
        coordinatorId: opp.coordinator?.name || "",
        type: opp.type,
      },
    }))
  );

  const statusColors = {
    PENDING: "bg-yellow-900/30 text-yellow-300",
    APPROVED: "bg-green-900/30 text-green-300",
    REJECTED: "bg-red-900/30 text-red-300",
  };

  const typeColors = {
    Role: "bg-blue-900/30 text-blue-300",
    Activity: "bg-purple-900/30 text-purple-300",
    Task: "bg-green-900/30 text-green-300",
    Counselor: "bg-indigo-900/30 text-indigo-300",
    Other: "bg-gray-700 text-gray-300",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-gray-200 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Volunteer Coordinator Dashboard
            </h1>
            <p className="text-gray-400 mt-1">
              Manage opportunities and applications
            </p>
          </div>
          <motion.button
            onClick={() => openOpportunityModal()}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Plus className="h-4 w-4" />
            <span>New Opportunity</span>
          </motion.button>
        </div>

        {/* Tabs */}
        <div className="flex bg-gray-800 rounded-lg p-1 w-fit">
          <button
            onClick={() => setActiveTab("opportunities")}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === "opportunities"
                ? "bg-blue-600 text-white"
                : "text-gray-300 hover:text-white"
            }`}
          >
            <Briefcase className="h-4 w-4" />
            <span>Opportunities</span>
          </button>
          <button
            onClick={() => setActiveTab("applications")}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === "applications"
                ? "bg-blue-600 text-white"
                : "text-gray-300 hover:text-white"
            }`}
          >
            <Users className="h-4 w-4" />
            <span>Applications</span>
          </button>
        </div>

        {/* Filters and Search */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search opportunities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="p-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Statuses</option>
                <option value="assigned">Assigned</option>
                <option value="unassigned">Unassigned</option>
              </select>

              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="p-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="Role">Role</option>
                <option value="Activity">Activity</option>
                <option value="Task">Task</option>
                <option value="Counselor">Counselor</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
        </div>

        {/* Content */}
        {activeTab === "opportunities" ? (
          <div className="space-y-4">
            {filteredOpportunities.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Briefcase className="h-16 w-16 text-gray-500 mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">
                  No opportunities found
                </h3>
                <p className="text-gray-400 max-w-md">
                  {searchQuery || statusFilter !== "all" || typeFilter !== "all"
                    ? "Try adjusting your search or filters"
                    : "Create your first volunteering opportunity to get started."}
                </p>
                {!(
                  searchQuery ||
                  statusFilter !== "all" ||
                  typeFilter !== "all"
                ) && (
                  <button
                    onClick={() => openOpportunityModal()}
                    className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    Create Opportunity
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {filteredOpportunities.map((opportunity) => (
                  <div
                    key={opportunity.id}
                    className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 overflow-hidden"
                  >
                    <div className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-white text-lg">
                              {opportunity.title}
                            </h3>
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${
                                typeColors[
                                  opportunity.type as keyof typeof typeColors
                                ] || typeColors.Other
                              }`}
                            >
                              {opportunity.type}
                            </span>
                          </div>

                          <p className="text-gray-300 text-sm mb-3">
                            {opportunity.description.length > 120 &&
                            !expandedOpportunity
                              ? `${opportunity.description.substring(
                                  0,
                                  120
                                )}...`
                              : opportunity.description}
                            {opportunity.description.length > 120 && (
                              <button
                                onClick={() =>
                                  toggleExpandOpportunity(opportunity.id)
                                }
                                className="ml-1 text-blue-400 hover:text-blue-300 text-sm"
                              >
                                {expandedOpportunity === opportunity.id
                                  ? "Show less"
                                  : "Show more"}
                              </button>
                            )}
                          </p>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="text-gray-400">Required:</span>
                              <span className="ml-1 font-medium">
                                {opportunity.requiredPeople}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-400">Applicants:</span>
                              <span className="ml-1 font-medium">
                                {opportunity.currentApplicants}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-400">Assigned:</span>
                              <span className="ml-1 font-medium">
                                {opportunity.assignedPeople}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-400">Status:</span>
                              <span
                                className={`ml-1 font-medium ${
                                  opportunity.isAssigned
                                    ? "text-green-400"
                                    : "text-yellow-400"
                                }`}
                              >
                                {opportunity.isAssigned
                                  ? "Assigned"
                                  : "Unassigned"}
                              </span>
                            </div>
                          </div>

                          {(opportunity.location ||
                            opportunity.timeCommitment) && (
                            <div className="flex flex-wrap gap-3 mt-3 text-sm">
                              {opportunity.location && (
                                <div className="flex items-center text-gray-400">
                                  <MapPin className="h-3 w-3 mr-1" />
                                  {opportunity.location}
                                </div>
                              )}
                              {opportunity.timeCommitment && (
                                <div className="flex items-center text-gray-400">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {opportunity.timeCommitment}
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col gap-2 ml-4">
                          <button
                            onClick={() => openOpportunityModal(opportunity)}
                            className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                            aria-label="Edit opportunity"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() =>
                              handleDeleteOpportunity(opportunity.id)
                            }
                            className="p-2 bg-red-900/30 hover:bg-red-800/30 rounded-lg transition-colors"
                            aria-label="Delete opportunity"
                          >
                            <Trash className="h-4 w-4 text-red-400" />
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-700/50">
                        <div className="flex items-center gap-2">
                          <label
                            htmlFor={`assigned-switch-${opportunity.id}`}
                            className="text-sm text-gray-300"
                          >
                            Mark as assigned
                          </label>
                          <div className="relative inline-block w-10 h-5">
                            <input
                              id={`assigned-switch-${opportunity.id}`}
                              type="checkbox"
                              checked={opportunity.isAssigned}
                              onChange={(e) =>
                                handleMarkAssigned(
                                  opportunity,
                                  e.target.checked
                                )
                              }
                              className="sr-only"
                            />
                            <div
                              className={`block w-10 h-5 rounded-full transition-colors ${
                                opportunity.isAssigned
                                  ? "bg-green-500"
                                  : "bg-gray-600"
                              }`}
                            ></div>
                            <div
                              className={`absolute left-0.5 top-0.5 bg-white w-4 h-4 rounded-full transition-transform ${
                                opportunity.isAssigned
                                  ? "transform translate-x-5"
                                  : ""
                              }`}
                            ></div>
                          </div>
                        </div>

                        <div className="text-xs text-gray-400">
                          Created by{" "}
                          {opportunity.coordinator?.name || "Unknown"}
                        </div>
                      </div>
                    </div>

                    {/* Applications preview */}
                    {opportunity.applications.length > 0 && (
                      <div className="bg-gray-700/30 px-4 py-3 border-t border-gray-700/50">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium text-white">
                            Applications ({opportunity.applications.length})
                          </h4>
                          <button
                            onClick={() =>
                              setExpandedOpportunity(
                                expandedOpportunity === opportunity.id
                                  ? null
                                  : opportunity.id
                              )
                            }
                            className="text-blue-400 hover:text-blue-300 text-sm flex items-center"
                          >
                            {expandedOpportunity === opportunity.id ? (
                              <>
                                <span className="mr-1">Hide</span>
                                <ChevronUp className="h-4 w-4" />
                              </>
                            ) : (
                              <>
                                <span className="mr-1">Show</span>
                                <ChevronDown className="h-4 w-4" />
                              </>
                            )}
                          </button>
                        </div>

                        <AnimatePresence>
                          {expandedOpportunity === opportunity.id && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="mt-2 space-y-2 overflow-hidden"
                            >
                              {opportunity.applications.map((application) => (
                                <div
                                  key={application.id}
                                  className="p-2 bg-gray-600/30 rounded-lg flex items-center justify-between"
                                >
                                  <div>
                                    <div className="font-medium text-sm">
                                      {application.applicant.name}
                                    </div>
                                    <div className="text-xs text-gray-400">
                                      {application.applicant.email}
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span
                                      className={`px-2 py-1 rounded-full text-xs ${
                                        statusColors[application.status]
                                      }`}
                                    >
                                      {application.status}
                                    </span>
                                    <button
                                      onClick={() =>
                                        openApplicationModal(application)
                                      }
                                      className="p-1 bg-gray-500/30 hover:bg-gray-500/50 rounded"
                                      aria-label="View application"
                                    >
                                      <FileText className="h-3 w-3" />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {allApplications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Users className="h-16 w-16 text-gray-500 mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">
                  No applications yet
                </h3>
                <p className="text-gray-400 max-w-md">
                  Applications will appear here when volunteers apply to your
                  opportunities.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {allApplications.map((application) => (
                  <div
                    key={application.id}
                    className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-full bg-blue-900/30 flex items-center justify-center">
                          <span className="text-white font-medium">
                            {application.applicant.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </span>
                        </div>
                      </div>

                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                          <div>
                            <h3 className="font-semibold text-white">
                              {application.applicant.name}
                            </h3>
                            <p className="text-gray-400 text-sm">
                              {application.applicant.email}
                            </p>
                          </div>

                          <div className="flex items-center gap-2">
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${
                                statusColors[application.status]
                              }`}
                            >
                              {application.status}
                            </span>
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${
                                typeColors[
                                  application.opportunity
                                    .type as keyof typeof typeColors
                                ] || typeColors.Other
                              }`}
                            >
                              {application.opportunity.type}
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm mb-3">
                          <div>
                            <span className="text-gray-400">Applied for:</span>
                            <span className="ml-1 font-medium">
                              {opportunities.find(
                                (o) => o.id === application.opportunity.id
                              )?.title || "N/A"}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-400">Applied on:</span>
                            <span className="ml-1 font-medium">
                              {new Date(
                                application.appliedAt
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        {application.applicant.skills &&
                          application.applicant.skills.length > 0 && (
                            <div className="mb-3">
                              <span className="text-gray-400 text-sm">
                                Skills:{" "}
                              </span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {application.applicant.skills.map(
                                  (skill, index) => (
                                    <span
                                      key={index}
                                      className="px-2 py-1 bg-gray-700/50 text-xs rounded-full text-gray-300"
                                    >
                                      {skill}
                                    </span>
                                  )
                                )}
                              </div>
                            </div>
                          )}

                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => openApplicationModal(application)}
                            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors"
                          >
                            <FileText className="h-3 w-3 mr-1" />
                            View Details
                          </button>

                          {application.status === "APPROVED" &&
                            application.opportunity.type === "Counselor" && (
                              <button
                                onClick={() =>
                                  handleAssignCounselorRole(
                                    application.applicant.id
                                  )
                                }
                                className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm transition-colors"
                              >
                                <UserPlus className="h-3 w-3 mr-1" />
                                Assign Role
                              </button>
                            )}

                          {application.applicant.phone && (
                            <a
                              href={`tel:${application.applicant.phone}`}
                              className="px-3 py-1.5 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm transition-colors flex items-center"
                            >
                              <Phone className="h-3 w-3 mr-1" />
                              Call
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Opportunity Modal */}
        {isOpportunityModalOpen && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-xl border border-gray-700/50 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-white">
                    {currentOpportunity
                      ? "Edit Opportunity"
                      : "New Opportunity"}
                  </h2>
                  <button
                    onClick={() => setIsOpportunityModalOpen(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    <XCircle className="h-6 w-6" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Title
                    </label>
                    <input
                      name="title"
                      value={form.title}
                      onChange={handleFormChange}
                      placeholder="Volunteer Opportunity Title"
                      className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={form.description}
                      onChange={handleFormChange}
                      placeholder="Describe the opportunity in detail"
                      rows={4}
                      className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Type
                      </label>
                      <select
                        value={form.type}
                        onChange={(e) =>
                          handleSelectChange("type", e.target.value)
                        }
                        className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select type</option>
                        <option value="Role">Role</option>
                        <option value="Activity">Activity</option>
                        <option value="Task">Task</option>
                        <option value="Counselor">Counselor</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Required People
                      </label>
                      <input
                        name="requiredPeople"
                        type="number"
                        min="1"
                        value={form.requiredPeople}
                        onChange={handleFormChange}
                        className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Location
                      </label>
                      <input
                        name="location"
                        value={form.location}
                        onChange={handleFormChange}
                        placeholder="e.g., Main Sanctuary"
                        className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Time Commitment
                      </label>
                      <input
                        name="timeCommitment"
                        value={form.timeCommitment}
                        onChange={handleFormChange}
                        placeholder="e.g., 2 hours/week"
                        className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Image URL (optional)
                    </label>
                    <input
                      name="imageUrl"
                      value={form.imageUrl}
                      onChange={handleFormChange}
                      placeholder="https://example.com/image.jpg"
                      className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Custom Fields
                    </label>
                    <div className="flex gap-2 mb-2">
                      <input
                        placeholder="Field Name"
                        value={newCustomFieldName}
                        onChange={(e) => setNewCustomFieldName(e.target.value)}
                        className="flex-1 p-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <input
                        placeholder="Field Value"
                        value={newCustomFieldValue}
                        onChange={(e) => setNewCustomFieldValue(e.target.value)}
                        className="flex-1 p-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <button
                        onClick={handleAddCustomField}
                        disabled={!newCustomFieldName || !newCustomFieldValue}
                        className="p-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded-lg transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="space-y-2">
                      {Object.entries(form.customFields).map(([key, value]) => (
                        <div
                          key={key}
                          className="flex items-center justify-between gap-2 bg-gray-700/50 p-2 rounded"
                        >
                          <div className="flex-1 truncate">
                            <span className="font-medium text-gray-300">
                              {key}:
                            </span>{" "}
                            <span className="text-gray-400">
                              {String(value)}
                            </span>
                          </div>
                          <button
                            onClick={() => handleRemoveCustomField(key)}
                            className="p-1 text-red-400 hover:text-red-300"
                          >
                            <Trash className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-700/50">
                  <button
                    onClick={() => setIsOpportunityModalOpen(false)}
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmitOpportunity}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    {currentOpportunity ? "Save Changes" : "Create Opportunity"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Application Modal */}
        {isApplicationModalOpen && currentApplication && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-xl border border-gray-700/50 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-white">
                    Application Review
                  </h2>
                  <button
                    onClick={() => setIsApplicationModalOpen(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    <XCircle className="h-6 w-6" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-700/50 rounded-lg">
                    <div className="w-12 h-12 rounded-full bg-blue-900/30 flex items-center justify-center">
                      <span className="text-white font-medium">
                        {currentApplication.applicant.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-medium text-white">
                        {currentApplication.applicant.name}
                      </h3>
                      <p className="text-gray-400 text-sm">
                        {currentApplication.applicant.email}
                      </p>
                      {currentApplication.applicant.phone && (
                        <p className="text-gray-400 text-sm flex items-center gap-1 mt-1">
                          <Phone className="h-3 w-3" />
                          {currentApplication.applicant.phone}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Opportunity
                      </label>
                      <div className="p-2 bg-gray-700/50 rounded-lg">
                        <p className="text-white">
                          {opportunities.find(
                            (o) => o.id === currentApplication.opportunity.id
                          )?.title || "N/A"}
                        </p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Applied On
                      </label>
                      <div className="p-2 bg-gray-700/50 rounded-lg">
                        <p className="text-white">
                          {new Date(
                            currentApplication.appliedAt
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Status
                    </label>
                    <select
                      value={currentApplication.status}
                      onChange={(e) =>
                        setCurrentApplication({
                          ...currentApplication,
                          status: e.target.value as
                            | "PENDING"
                            | "APPROVED"
                            | "REJECTED",
                        })
                      }
                      className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="PENDING">Pending</option>
                      <option value="APPROVED">Approved</option>
                      <option value="REJECTED">Rejected</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Coordinator Notes
                    </label>
                    <textarea
                      value={currentApplication.coordinatorNotes || ""}
                      onChange={(e) =>
                        setCurrentApplication({
                          ...currentApplication,
                          coordinatorNotes: e.target.value,
                        })
                      }
                      placeholder="Add any notes about this application..."
                      rows={3}
                      className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {currentApplication.applicant.skills &&
                    currentApplication.applicant.skills.length > 0 && (
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Applicant Skills
                        </label>
                        <div className="flex flex-wrap gap-2 p-2 bg-gray-700/50 rounded-lg">
                          {currentApplication.applicant.skills.map(
                            (skill, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-gray-600 text-xs rounded-full text-gray-300"
                              >
                                {skill}
                              </span>
                            )
                          )}
                        </div>
                      </div>
                    )}
                </div>

                <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-700/50">
                  <button
                    onClick={() => setIsApplicationModalOpen(false)}
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() =>
                      handleUpdateApplicationStatus(
                        currentApplication.id,
                        currentApplication.status,
                        currentApplication.coordinatorNotes
                      )
                    }
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    Update Application
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
