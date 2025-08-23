"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { safeFetch } from "@/lib/api";
import Image from "next/image";
import { Loader2, CheckCircle2, Users, Mail, Info, XCircle, UserCheck, UserPlus, Hourglass } from "lucide-react";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

interface VolunteeringOpportunity {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  requiredPeople: number;
  currentApplicants: number;
  assignedPeople: number;
  isAssigned: boolean;
  coordinator: {
    name: string;
    email: string;
  };
  applications: {
    applicantId: string;
    status: string;
  }[];
}

const LoadingSkeleton = () => (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
            <Skeleton className="h-64 w-full rounded-2xl mb-8" />
            <div className="space-y-4">
                <Skeleton className="h-12 w-3/4" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-5/6" />
            </div>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <Skeleton className="h-24 rounded-xl" />
                <Skeleton className="h-24 rounded-xl" />
            </div>
            <Skeleton className="h-12 w-full mt-8 rounded-lg" />
        </div>
    </div>
);

const VolunteeringOpportunityPage = () => {
  const { id } = useParams();
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const [opportunity, setOpportunity] = useState<VolunteeringOpportunity | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isApplying, setIsApplying] = useState(false);
  const [applicationNotes, setApplicationNotes] = useState("");
  const [isSubmittingApplication, setIsSubmittingApplication] = useState(false);

  const fetchOpportunity = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const response = await safeFetch<VolunteeringOpportunity>(
        `/api/volunteering-opportunities/${id}`
      );
      setOpportunity(response);
    } catch (err: any) {
      setError(err.message);
      toast.error("Failed to fetch opportunity details.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchOpportunity();
  }, [fetchOpportunity]);

  const handleApplicationSubmit = async () => {
    if (!opportunity || !userId) return;

    setIsSubmittingApplication(true);
    try {
      await safeFetch("/api/volunteering-applications", {
        method: "POST",
        body: JSON.stringify({ opportunityId: opportunity.id, applicantId: userId, notes: applicationNotes }),
      });
      toast.success("Application submitted successfully!", { description: "The coordinator will review your application shortly." });
      setIsApplying(false);
      setApplicationNotes("");
      fetchOpportunity();
    } catch (err: any) {
      toast.error(`Failed to submit application: ${err.message}`);
    } finally {
      setIsSubmittingApplication(false);
    }
  };

  if (loading) return <LoadingSkeleton />;
  if (error) return <ErrorDisplay message={error} onRetry={fetchOpportunity} />;
  if (!opportunity) return <NotFoundDisplay />;

  const { title, description, imageUrl, requiredPeople, currentApplicants, coordinator, applications } = opportunity;
  const userApplication = applications.find(app => app.applicantId === userId);
  const progress = requiredPeople > 0 ? (currentApplicants / requiredPeople) * 100 : 0;
  const isFull = currentApplicants >= requiredPeople;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Card className="overflow-hidden shadow-2xl rounded-3xl bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700/60">
                {imageUrl && (
                    <div className="relative h-56 sm:h-72 w-full">
                        <Image src={imageUrl} alt={title} fill className="object-cover" priority />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    </div>
                )}
                <CardHeader className={`p-6 ${imageUrl ? 'sm:p-8 -mt-16 z-10 relative text-white' : ''}`}>
                    <CardTitle className="text-3xl sm:text-4xl font-extrabold tracking-tight drop-shadow-lg">{title}</CardTitle>
                </CardHeader>
                <CardContent className="p-6 sm:p-8 space-y-6">
                    <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 leading-relaxed">{description}</p>
                    
                    <div className="space-y-4 pt-6 border-t border-gray-200 dark:border-gray-700/60">
                        <h3 className="text-lg font-semibold flex items-center gap-2"><Info className="h-5 w-5 text-blue-500"/>Details</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-sm">
                            <div className="flex items-center gap-3">
                                <Users className="h-5 w-5 text-gray-400"/>
                                <span className="font-medium text-gray-800 dark:text-gray-200">Volunteers Needed:</span>
                                <span>{requiredPeople}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <UserCheck className="h-5 w-5 text-gray-400"/>
                                <span className="font-medium text-gray-800 dark:text-gray-200">Current Applicants:</span>
                                <span>{currentApplicants}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Mail className="h-5 w-5 text-gray-400"/>
                                <span className="font-medium text-gray-800 dark:text-gray-200">Coordinator:</span>
                                <a href={`mailto:${coordinator.email}`} className="text-blue-500 hover:underline">{coordinator.name}</a>
                            </div>
                        </div>
                        <div>
                            <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">Applicant Progress</Label>
                            <Progress value={progress} className="mt-2 h-3" />
                            <p className="text-xs text-right mt-1 text-gray-500">{currentApplicants} of {requiredPeople} spots filled</p>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="p-6 sm:p-8 bg-gray-50 dark:bg-gray-800/50 border-t dark:border-gray-700/60">
                    {userId ? (
                        <Button onClick={() => setIsApplying(true)} disabled={!!userApplication || isFull} className="w-full py-3 text-lg font-semibold bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed">
                            {userApplication ? (
                                <><CheckCircle2 className="mr-2 h-5 w-5" /> {`You've Applied (${userApplication.status})`}</>
                            ) : isFull ? (
                                "Opportunity Full"
                            ) : (
                                <><UserPlus className="mr-2 h-5 w-5"/> Apply Now</>
                            )}
                        </Button>
                    ) : (
                        <p className="text-center text-sm text-gray-500 dark:text-gray-400 w-full">Please log in to apply for this opportunity.</p>
                    )}
                </CardFooter>
            </Card>
        </motion.div>

        <Dialog open={isApplying} onOpenChange={setIsApplying}>
            <DialogContent className="sm:max-w-md bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">Apply for: {opportunity?.title}</DialogTitle>
                    <DialogDescription>A short note can help the coordinator know you better.</DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-2">
                    <Label htmlFor="notes">Notes (Optional)</Label>
                    <Textarea id="notes" placeholder="e.g., I have previous experience in..." value={applicationNotes} onChange={(e) => setApplicationNotes(e.target.value)} rows={4} className="bg-gray-100 dark:bg-gray-700 border-0 focus:ring-2 focus:ring-blue-500"/>
                </div>
                <DialogFooter>
                    <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
                    <Button type="button" onClick={handleApplicationSubmit} disabled={isSubmittingApplication}>
                        {isSubmittingApplication ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...</> : "Submit Application"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

const ErrorDisplay = ({ message, onRetry }: { message: string, onRetry: () => void }) => (
    <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center p-8 bg-red-50 dark:bg-red-900/20 border-red-500/50">
            <CardHeader className="flex flex-col items-center">
                <XCircle className="h-12 w-12 text-red-500 mb-4"/>
                <CardTitle className="text-2xl font-bold text-red-600 dark:text-red-400">Error</CardTitle>
                <CardDescription className="text-red-500 dark:text-red-300">{message}</CardDescription>
            </CardHeader>
            <CardContent><Button onClick={onRetry} variant="destructive">Try Again</Button></CardContent>
        </Card>
    </div>
);

const NotFoundDisplay = () => (
    <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center p-8">
            <CardHeader className="flex flex-col items-center">
                <Hourglass className="h-12 w-12 text-gray-400 mb-4"/>
                <CardTitle className="text-2xl font-bold">Opportunity Not Found</CardTitle>
                <CardDescription>The requested volunteering opportunity could not be found or may no longer be available.</CardDescription>
            </CardHeader>
        </Card>
    </div>
);

export default VolunteeringOpportunityPage;
