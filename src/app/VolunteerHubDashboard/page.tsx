"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Plus,
  Edit,
  Trash,
  FileText,
  UserPlus,
  Briefcase,
  Users,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

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
}

interface VolunteeringApplication {
  id: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  applicant: {
    id: string;
    name: string;
    email: string;
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
    customFields: {} as Record<string, string>,
  });
  const [newCustomFieldName, setNewCustomFieldName] = useState("");
  const [newCustomFieldValue, setNewCustomFieldValue] = useState("");

  useEffect(() => {
    if (status === "loading") return;
    fetchOpportunities();
  }, [session, status, router]);

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
        customFields: {},
      });
    }
    setIsOpportunityModalOpen(true);
  };

  const openApplicationModal = (application: VolunteeringApplication) => {
    setCurrentApplication(application);
    setIsApplicationModalOpen(true);
  };

  if (status === "loading" || loading) {
    return <div className="container mx-auto p-4">Loading dashboard...</div>;
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

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Volunteer Coordinator Dashboard
          </h1>
          <p className="text-muted-foreground">
            Manage opportunities and applications
          </p>
        </div>
        <Button onClick={() => openOpportunityModal()}>
          <Plus className="mr-2 h-4 w-4" />
          New Opportunity
        </Button>
      </div>

      <Tabs defaultValue="opportunities" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-xs">
          <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
          <TabsTrigger value="applications">Applications</TabsTrigger>
        </TabsList>

        <TabsContent value="opportunities" className="mt-6 space-y-4">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <Card key={i}>
                  <Skeleton className="h-48 w-full rounded-t-lg" />
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : opportunities.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Briefcase className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No opportunities yet</h3>
              <p className="text-muted-foreground text-center max-w-md">
                Create your first volunteering opportunity to get started.
              </p>
              <Button className="mt-4" onClick={() => openOpportunityModal()}>
                Create Opportunity
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {opportunities.map((opportunity) => (
                <Card
                  key={opportunity.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  {opportunity.imageUrl ? (
                    <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
                      <img
                        src={opportunity.imageUrl}
                        alt={opportunity.title}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  ) : (
                    <div className="relative h-48 w-full overflow-hidden rounded-t-lg bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
                      <Briefcase className="h-16 w-16 text-muted-foreground" />
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{opportunity.title}</span>
                      <Badge variant="outline" className="capitalize">
                        {opportunity.type}
                      </Badge>
                    </CardTitle>
                    <CardDescription>
                      {opportunity.description.length > 100
                        ? `${opportunity.description.substring(0, 100)}...`
                        : opportunity.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          Required
                        </span>
                        <span className="font-medium">
                          {opportunity.requiredPeople}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          Applicants
                        </span>
                        <span className="font-medium">
                          {opportunity.currentApplicants}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          Assigned
                        </span>
                        <span className="font-medium">
                          {opportunity.assignedPeople}
                        </span>
                      </div>
                    </div>

                    {Object.keys(opportunity.customFields).length > 0 && (
                      <div className="mt-4 pt-4 border-t">
                        <h4 className="text-sm font-medium mb-2 text-muted-foreground">
                          Custom Fields
                        </h4>
                        <div className="space-y-1">
                          {Object.entries(opportunity.customFields).map(
                            ([key, value]) => (
                              <div
                                key={key}
                                className="flex items-center justify-between text-sm"
                              >
                                <span className="text-muted-foreground">
                                  {key}
                                </span>
                                <span className="font-medium">
                                  {String(value)}
                                </span>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex flex-col space-y-2">
                    <div className="flex items-center justify-between w-full">
                      <Label htmlFor={`assigned-switch-${opportunity.id}`}>
                        Fully Assigned
                      </Label>
                      <Switch
                        id={`assigned-switch-${opportunity.id}`}
                        checked={opportunity.isAssigned}
                        onCheckedChange={(checked) =>
                          handleMarkAssigned(opportunity, checked)
                        }
                      />
                    </div>
                    <div className="flex space-x-2 w-full">
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => openOpportunityModal(opportunity)}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        className="flex-1"
                        onClick={() => handleDeleteOpportunity(opportunity.id)}
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="applications" className="mt-6 space-y-4">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <Card key={i}>
                  <CardHeader className="space-y-2">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : allApplications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No applications yet</h3>
              <p className="text-muted-foreground text-center max-w-md">
                Applications will appear here when volunteers apply to your
                opportunities.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allApplications.map((application) => (
                <Card
                  key={application.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage
                          src={`https://avatar.vercel.sh/${application.applicant.email}`}
                        />
                        <AvatarFallback>
                          {application.applicant.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle>{application.applicant.name}</CardTitle>
                        <CardDescription>
                          {application.applicant.email}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Applied for
                        </p>
                        <p className="font-medium">
                          {opportunities.find(
                            (o) => o.id === application.opportunity.id
                          )?.title || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Applied on
                        </p>
                        <p className="font-medium">
                          {new Date(application.appliedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Status</p>
                        <Badge
                          variant={
                            application.status === "APPROVED"
                              ? "default"
                              : application.status === "REJECTED"
                              ? "destructive"
                              : "secondary"
                          }
                        >
                          {application.status}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col space-y-2">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => openApplicationModal(application)}
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      View Application
                    </Button>
                    {application.status === "APPROVED" &&
                      application.opportunity.type === "Counselor" && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="secondary"
                              className="w-full"
                              onClick={() =>
                                handleAssignCounselorRole(
                                  application.applicant.id
                                )
                              }
                            >
                              <UserPlus className="mr-2 h-4 w-4" />
                              Assign Counselor Role
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            Grant this user counselor permissions
                          </TooltipContent>
                        </Tooltip>
                      )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Opportunity Modal */}
      <Dialog
        open={isOpportunityModalOpen}
        onOpenChange={setIsOpportunityModalOpen}
      >
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              {currentOpportunity ? (
                <>
                  <Edit className="mr-2 h-5 w-5" />
                  Edit Opportunity
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-5 w-5" />
                  New Opportunity
                </>
              )}
            </DialogTitle>
            <DialogDescription>
              {currentOpportunity
                ? "Update this volunteering opportunity"
                : "Create a new volunteering opportunity"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                value={form.title}
                onChange={handleFormChange}
                placeholder="Volunteer Opportunity Title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleFormChange}
                placeholder="Describe the opportunity in detail"
                rows={4}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select
                  onValueChange={(value) => handleSelectChange("type", value)}
                  value={form.type}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Role">Role</SelectItem>
                    <SelectItem value="Activity">Activity</SelectItem>
                    <SelectItem value="Task">Task</SelectItem>
                    <SelectItem value="Counselor">Counselor</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="requiredPeople">Required People</Label>
                <Input
                  id="requiredPeople"
                  name="requiredPeople"
                  type="number"
                  min="1"
                  value={form.requiredPeople}
                  onChange={handleFormChange}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="imageUrl">Image URL (optional)</Label>
              <Input
                id="imageUrl"
                name="imageUrl"
                value={form.imageUrl}
                onChange={handleFormChange}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div className="space-y-2">
              <Label>Custom Fields</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Field Name"
                  value={newCustomFieldName}
                  onChange={(e) => setNewCustomFieldName(e.target.value)}
                  className="flex-1"
                />
                <Input
                  placeholder="Field Value"
                  value={newCustomFieldValue}
                  onChange={(e) => setNewCustomFieldValue(e.target.value)}
                  className="flex-1"
                />
                <Button
                  onClick={handleAddCustomField}
                  disabled={!newCustomFieldName || !newCustomFieldValue}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="mt-2 space-y-2">
                {Object.entries(form.customFields).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex items-center justify-between gap-2 bg-muted/50 p-2 rounded"
                  >
                    <div className="flex-1 truncate">
                      <span className="font-medium">{key}:</span>{" "}
                      <span className="text-muted-foreground">
                        {String(value)}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveCustomField(key)}
                    >
                      <Trash className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSubmitOpportunity}>
              {currentOpportunity ? "Save Changes" : "Create Opportunity"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Application Modal */}
      <Dialog
        open={isApplicationModalOpen}
        onOpenChange={setIsApplicationModalOpen}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Application Review</DialogTitle>
            <DialogDescription>
              Update the status of this volunteer application
            </DialogDescription>
          </DialogHeader>
          {currentApplication && (
            <div className="space-y-4 py-4">
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarImage
                    src={`https://avatar.vercel.sh/${currentApplication.applicant.email}`}
                  />
                  <AvatarFallback>
                    {currentApplication.applicant.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-medium">
                    {currentApplication.applicant.name}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {currentApplication.applicant.email}
                  </p>
                </div>
              </div>

              <div className="grid gap-2">
                <Label>Opportunity</Label>
                <p className="font-medium">
                  {opportunities.find(
                    (o) => o.id === currentApplication.opportunity.id
                  )?.title || "N/A"}
                </p>
              </div>

              <div className="grid gap-2">
                <Label>Applied On</Label>
                <p>
                  {new Date(currentApplication.appliedAt).toLocaleDateString()}
                </p>
              </div>

              <div className="grid gap-2">
                <Label>Status</Label>
                <Select
                  onValueChange={(value: "PENDING" | "APPROVED" | "REJECTED") =>
                    handleUpdateApplicationStatus(
                      currentApplication.id,
                      value,
                      currentApplication.coordinatorNotes
                    )
                  }
                  value={currentApplication.status}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="APPROVED">Approved</SelectItem>
                    <SelectItem value="REJECTED">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="coordinatorNotes">Coordinator Notes</Label>
                <Textarea
                  id="coordinatorNotes"
                  name="coordinatorNotes"
                  value={currentApplication.coordinatorNotes || ""}
                  onChange={(e) =>
                    setCurrentApplication((prev) =>
                      prev
                        ? { ...prev, coordinatorNotes: e.target.value }
                        : null
                    )
                  }
                  placeholder="Add any notes about this application..."
                  rows={3}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              onClick={() =>
                handleUpdateApplicationStatus(
                  currentApplication!.id,
                  currentApplication!.status,
                  currentApplication!.coordinatorNotes
                )
              }
            >
              Update Application
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
