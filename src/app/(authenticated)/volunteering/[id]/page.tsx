"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { safeFetch } from "@/lib/api";
import Image from "next/image";
import { Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

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
      toast.error("Failed to fetch volunteering opportunity details.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchOpportunity();
  }, [fetchOpportunity]);

  const handleApplyClick = () => {
    setIsApplying(true);
  };

  const handleApplicationSubmit = async () => {
    if (!opportunity || !userId) return;

    setIsSubmittingApplication(true);
    try {
      await safeFetch("/api/volunteering-applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          opportunityId: opportunity.id,
          applicantId: userId,
          notes: applicationNotes,
        }),
      });
      toast.success("Application submitted successfully!");
      setIsApplying(false);
      setApplicationNotes("");
      fetchOpportunity(); // Refresh opportunity to show updated status
    } catch (err: any) {
      toast.error(`Failed to submit application: ${err.message}`);
    } finally {
      setIsSubmittingApplication(false);
    }
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
            <Button onClick={fetchOpportunity} className="w-full">
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!opportunity) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Opportunity Not Found</CardTitle>
            <CardDescription>The requested volunteering opportunity could not be found.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const hasApplied = opportunity.applications.some(
    (app) => app.applicantId === userId
  );
  const isFull = opportunity.currentApplicants >= opportunity.requiredPeople;

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="overflow-hidden shadow-lg">
        {opportunity.imageUrl && (
          <div className="relative h-64 w-full">
            <Image
              src={opportunity.imageUrl}
              alt={opportunity.title}
              fill
              className="object-cover"
            />
          </div>
        )}
        <CardHeader>
          <CardTitle className="text-3xl font-bold">{opportunity.title}</CardTitle>
          <CardDescription className="text-lg">{opportunity.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between text-base text-gray-700">
            <span>Applicants: {opportunity.currentApplicants}/{opportunity.requiredPeople}</span>
            <span>Coordinator: {opportunity.coordinator.name}</span>
          </div>
          {userId && (
            <Button
              onClick={handleApplyClick}
              disabled={hasApplied || isFull || isSubmittingApplication}
              className="w-full"
            >
              {isSubmittingApplication ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : hasApplied ? (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" /> Applied
                </>
              ) : isFull ? (
                "Full"
              ) : (
                "Apply Now"
              )}
            </Button>
          )}
          {!userId && (
            <p className="text-center text-sm text-gray-500">
              Please log in to apply for this opportunity.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Application Dialog */}
      <Dialog open={isApplying} onOpenChange={setIsApplying}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Apply for {opportunity?.title}</DialogTitle>
            <DialogDescription>
              Provide any relevant notes for your application.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="e.g., My experience with..."
                value={applicationNotes}
                onChange={(e) => setApplicationNotes(e.target.value)}
                rows={5}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsApplying(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              onClick={handleApplicationSubmit}
              disabled={isSubmittingApplication}
            >
              {isSubmittingApplication && (
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

export default VolunteeringOpportunityPage;
