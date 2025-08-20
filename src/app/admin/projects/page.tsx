"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { safeFetch } from "@/lib/api";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2,
  PlusCircle,
  Edit2,
  Trash2,
  FileImage,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import { useSession } from "next-auth/react";
import { Label } from "@/components/ui/label";

interface Project {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  fundraisingGoal?: number;
  fundraisingProgress?: number;
  hasApplied?: boolean;
}

const projectSchema = z.object({
  title: z.string().min(1, "Project title is required"),
  description: z.string().min(1, "Description is required"),
  fundraisingGoal: z.coerce.number().positive("Goal must be a positive number"),
  imageUrl: z.string().optional(),
});

type ProjectFormData = z.infer<typeof projectSchema>;

const AdminProjectsPage = () => {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const [projects, setProjects] = useState<Project[]>([]);
  const [donationPlans, setDonationPlans] = useState<any[]>([]);
  const [volunteeringOpportunities, setVolunteeringOpportunities] = useState<
    any[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isApplyingProject, setIsApplyingProject] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projectApplicationNotes, setProjectApplicationNotes] = useState("");
  const [isSubmittingProjectApplication, setIsSubmittingProjectApplication] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
  });

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const [
        projectsResponse,
        donationPlansResponse,
        volunteeringOpportunitiesResponse,
        projectApplicationsResponse,
      ] = await Promise.all([
        safeFetch<{ data: Project[] }>("/api/projects"),
        safeFetch<any[]>("/api/donation-plans?type=PROJECT"),
        safeFetch<any[]>("/api/volunteering-opportunities?type=PROJECT"),
        userId ? safeFetch<any[]>(`/api/project-applications?applicantId=${userId}`) : Promise.resolve([]),
      ]);

      console.log('projectsResponse', projectsResponse);
      console.log('donationPlansResponse', donationPlansResponse);
      console.log('volunteeringOpportunitiesResponse', volunteeringOpportunitiesResponse);
      console.log('projectApplicationsResponse', projectApplicationsResponse);

      const projectsWithApplicationStatus = projectsResponse.data.map(project => ({
        ...project,
        hasApplied: projectApplicationsResponse.some(app => app.projectId === project.id),
      }));

      setProjects(projectsWithApplicationStatus);
      setDonationPlans(donationPlansResponse);
      setVolunteeringOpportunities(volunteeringOpportunitiesResponse);
    } catch (err: any) {
      setError(err.message);
      toast.error("Failed to fetch projects");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleImageUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await safeFetch<{ url: string }>("/api/upload-image", {
        method: "POST",
        body: formData,
      });
      return response.url;
    } catch (error) {
      console.error("Image upload failed:", error);
      toast.error("Failed to upload image");
      return null;
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProjectApplicationSubmit = async () => {
    if (!selectedProject || !userId) return;

    setIsSubmittingProjectApplication(true);
    try {
      await safeFetch("/api/project-applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectId: selectedProject.id,
          applicantId: userId,
          notes: projectApplicationNotes,
        }),
      });
      toast.success("Project application submitted successfully!");
      setIsApplyingProject(false);
      setSelectedProject(null);
      setProjectApplicationNotes("");
      fetchProjects(); // Refresh projects to show updated status
    } catch (err: any) {
      toast.error(`Failed to submit project application: ${err.message}`);
    } finally {
      setIsSubmittingProjectApplication(false);
    }
  };

  const onSubmit: SubmitHandler<ProjectFormData> = async (data) => {
    setIsSubmitting(true);
    let imageUrl = editingProject?.imageUrl;
    const imageFile = (document.getElementById("imageUrl") as HTMLInputElement)
      ?.files?.[0];

    try {
      if (imageFile) {
        const uploadedUrl = await handleImageUpload(imageFile);
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        }
      }

      const projectData = { ...data, imageUrl };

      if (editingProject) {
        await safeFetch(`/api/projects?id=${editingProject.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(projectData),
        });
        toast.success("Project updated successfully");
      } else {
        await safeFetch("/api/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(projectData),
        });
        toast.success("Project created successfully");
      }

      fetchProjects();
      setIsModalOpen(false);
      setEditingProject(null);
      reset();
      setImagePreview(null);
    } catch (error) {
      console.error("Failed to save project:", error);
      toast.error("Failed to save project");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this project?")) {
      try {
        await safeFetch(`/api/projects?id=${id}`, {
          method: "DELETE",
        });
        toast.success("Project deleted successfully");
        fetchProjects();
      } catch (error) {
        console.error("Failed to delete project:", error);
        toast.error("Failed to delete project");
      }
    }
  };

  const openEditModal = (project: Project) => {
    setEditingProject(project);
    reset({
      title: project.title,
      description: project.description,
      fundraisingGoal: project.fundraisingGoal,
      imageUrl: project.imageUrl,
    });
    setImagePreview(project.imageUrl || null);
    setIsModalOpen(true);
  };

  const openCreateModal = () => {
    setEditingProject(null);
    reset({
      title: "",
      description: "",
      fundraisingGoal: 0,
      imageUrl: "",
    });
    setImagePreview(null);
    setIsModalOpen(true);
  };

  const handleApplyProjectClick = (project: Project) => {
    setSelectedProject(project);
    setProjectApplicationNotes("");
    setIsApplyingProject(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={fetchProjects} className="w-full">
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <div>
              <CardTitle className="text-2xl font-bold">
                Our Community Projects
              </CardTitle>
              <CardDescription>
                Join us in making a difference. Here are the projects we are passionately working on to serve our community and spread His love.
              </CardDescription>
            </div>
            <Button onClick={openCreateModal} className="gap-2">
              <PlusCircle className="h-4 w-4" />
              New Project
            </Button>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead className="w-[120px]">Banner</TableHead>
                    <TableHead>Project</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Resources</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {console.log('rendering projects', projects)}
                  {projects.length > 0 ? (
                    projects.map((project) => {
                      const donationPlan = donationPlans.find(
                        (dp) => dp.name === project.title
                      );
                      const volunteeringOpportunity =
                        volunteeringOpportunities.find(
                          (vo) => vo.title === `Volunteer for ${project.title}`
                        );
                      const progress =
                        project.fundraisingGoal && project.fundraisingProgress
                          ? (project.fundraisingProgress /
                              project.fundraisingGoal) *
                            100
                          : 0;

                      return (
                        <TableRow
                          key={project.id}
                          className="hover:bg-gray-50/50"
                        >
                          <TableCell>
                            <div className="relative h-16 w-24 rounded-md overflow-hidden border">
                              <Image
                                src={
                                  project.imageUrl || "/images/default-2.png"
                                }
                                alt={project.title}
                                fill
                                className="object-cover"
                              />
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">{project.title}</div>
                            <div className="text-sm text-gray-500 line-clamp-2">
                              {project.description}
                            </div>
                          </TableCell>
                          <TableCell>
                            {project.fundraisingGoal !== null && project.fundraisingGoal !== undefined ? (
                              <div className="space-y-1">
                                <div className="flex justify-between text-sm">
                                  <span>
                                    KES
                                    {project.fundraisingProgress?.toLocaleString()}
                                  </span>
                                  <span className="text-gray-500">
                                    KES
                                    {project.fundraisingGoal.toLocaleString()}
                                  </span>
                                </div>
                                <Progress value={progress} className="h-2" />
                                <div className="text-right text-sm font-medium">
                                  {Math.round(progress)}%
                                </div>
                              </div>
                            ) : (
                              <span className="text-gray-400">No goal set</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col gap-2">
                              {donationPlan ? (
                                <Link
                                  href={`/finance-administrator/donation-plans/${donationPlan.id}`}
                                >
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full gap-2"
                                  >
                                    Donation Plan
                                    <ArrowRight className="h-3 w-3" />
                                  </Button>
                                </Link>
                              ) : (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  disabled
                                  className="w-full"
                                >
                                  No Donation Plan
                                </Button>
                              )}
                              {volunteeringOpportunity ? (
                                <Link
                                  href={`/admin/volunteering/${volunteeringOpportunity.id}`}
                                >
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full gap-2"
                                  >
                                    Volunteering
                                    <ArrowRight className="h-3 w-3" />
                                  </Button>
                                </Link>
                              ) : (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  disabled
                                  className="w-full"
                                >
                                  No Volunteering
                                </Button>
                              )}
                              {userId && (
                                <Button
                                  onClick={() => handleApplyProjectClick(project)}
                                  disabled={project.hasApplied || isSubmittingProjectApplication}
                                  variant="outline"
                                  size="sm"
                                  className="w-full gap-2"
                                >
                                  {isSubmittingProjectApplication && selectedProject?.id === project.id ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  ) : project.hasApplied ? (
                                    <>
                                      <CheckCircle2 className="mr-2 h-4 w-4" /> Applied
                                    </>
                                  ) : (
                                    "Apply to Project"
                                  )}
                                </Button>
                              )}
                              {!userId && (
                                <p className="text-center text-sm text-gray-500">
                                  Log in to apply.
                                </p>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => openEditModal(project)}
                                className="gap-1"
                              >
                                <Edit2 className="h-3 w-3" />
                                Edit
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDelete(project.id)}
                                className="gap-1"
                              >
                                <Trash2 className="h-3 w-3" />
                                Delete
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center">
                        No projects found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {editingProject ? "Edit Project" : "Create New Project"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="title" className="block text-sm font-medium">
                Project Title
              </label>
              <Input
                id="title"
                placeholder="Enter project title"
                {...register("title")}
                className={errors.title ? "border-red-500" : ""}
              />
              {errors.title && (
                <p className="text-sm text-red-500">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="description"
                className="block text-sm font-medium"
              >
                Description
              </label>
              <Textarea
                id="description"
                placeholder="Enter project description"
                rows={4}
                {...register("description")}
                className={errors.description ? "border-red-500" : ""}
              />
              {errors.description && (
                <p className="text-sm text-red-500">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="fundraisingGoal"
                className="block text-sm font-medium"
              >
                Fundraising Goal (KES)
              </label>
              <Input
                id="fundraisingGoal"
                type="number"
                placeholder="Enter fundraising goal"
                {...register("fundraisingGoal")}
                className={errors.fundraisingGoal ? "border-red-500" : ""}
              />
              {errors.fundraisingGoal && (
                <p className="text-sm text-red-500">
                  {errors.fundraisingGoal.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="imageUrl" className="block text-sm font-medium">
                Banner Image
              </label>
              <div className="flex items-center gap-4">
                <label
                  htmlFor="imageUrl"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50"
                >
                  {imagePreview ? (
                    <div className="relative w-full h-full">
                      <Image
                        src={imagePreview}
                        alt="Preview"
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <FileImage className="h-8 w-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500">
                        Click to upload an image
                      </p>
                    </div>
                  )}
                  <input
                    id="imageUrl"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="outline"
                type="button"
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingProject(null);
                  reset();
                  setImagePreview(null);
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {editingProject ? "Update Project" : "Create Project"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Project Application Dialog */}
      <Dialog open={isApplyingProject} onOpenChange={setIsApplyingProject}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Apply for {selectedProject?.title}</DialogTitle>
            <DialogDescription>
              Provide any relevant notes for your application.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="projectNotes">Notes (Optional)</Label>
              <Textarea
                id="projectNotes"
                placeholder="e.g., My skills and experience..."
                value={projectApplicationNotes}
                onChange={(e) => setProjectApplicationNotes(e.target.value)}
                rows={5}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsApplyingProject(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              onClick={handleProjectApplicationSubmit}
              disabled={isSubmittingProjectApplication}
            >
              {isSubmittingProjectApplication && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Submit Application
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminProjectsPage;
