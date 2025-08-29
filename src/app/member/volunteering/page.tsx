"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Inbox, Loader2, LogIn, X } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface VolunteeringOpportunity {
  id: string;
  title: string;
  description: string;
  type: string;
  imageUrl?: string;
  requiredPeople: number;
  currentApplicants: number;
  isAssigned: boolean;
  coordinator: {
    name: string;
  };
  applications: {
    id: string;
    status: string;
    applicant: {
      id: string;
    };
  }[];
  customFields: any;
}

interface UserApplication {
  id: string;
  opportunityId: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  appliedAt: string;
  opportunity: {
    title: string;
  };
}

const statusStyles: { [key: string]: string } = {
  PENDING:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300 border-yellow-400/50",
  APPROVED:
    "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 border-green-400/50",
  REJECTED:
    "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300 border-red-400/50",
};

const LoadingSkeleton = () => (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
    <div className="max-w-7xl mx-auto">
      <Skeleton className="h-12 w-1/3 mb-4" />
      <Skeleton className="h-6 w-2/3 mb-10" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(6)].map((_, i) => (
          <Card
            key={i}
            className="bg-white dark:bg-gray-800/50 rounded-2xl shadow-sm overflow-hidden"
          >
            <Skeleton className="h-48 w-full" />
            <CardHeader>
              <Skeleton className="h-8 w-3/4" />
            </CardHeader>
            <CardContent className="space-y-3">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-5/6" />
            </CardContent>
            <CardFooter>
              <Skeleton className="h-12 w-full rounded-lg" />
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  </div>
);

export default function VolunteeringPage() {
  const { data: session, status } = useSession();
  const [opportunities, setOpportunities] = useState<VolunteeringOpportunity[]>(
    []
  );
  const [userApplications, setUserApplications] = useState<UserApplication[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [actioning, setActioning] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const [opps, apps] = await Promise.all([
        fetch("/api/volunteering-opportunities").then((res) =>
          res.ok ? res.json() : Promise.reject("Failed to fetch opportunities")
        ),
        session?.user
          ? fetch("/api/volunteering-applications").then((res) =>
              res.ok
                ? res.json()
                : Promise.reject("Failed to fetch applications")
            )
          : Promise.resolve([]),
      ]);
      setOpportunities(opps);
      setUserApplications(apps);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load volunteering data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchData();
  }, [session]);

  const handleAction = async (action: "apply" | "withdraw", id: string) => {
    if (status !== "authenticated") {
      toast.info("Please log in to get involved.");
      return;
    }
    setActioning(id);
    try {
      let res;
      if (action === "apply") {
        res = await fetch("/api/volunteering-applications", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ opportunityId: id }),
        });
      } else {
        if (!confirm("Are you sure you want to withdraw this application?")) {
          setActioning(null);
          return;
        }
        res = await fetch(`/api/volunteering-applications/${id}`, {
          method: "DELETE",
        });
      }

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || `Failed to ${action} application`);
      }
      toast.success(
        `Application ${
          action === "apply" ? "submitted" : "withdrawn"
        } successfully!`
      );
      fetchData();
    } catch (error: any) {
      toast.error(error.message || `Failed to ${action} application.`);
    } finally {
      setActioning(null);
    }
  };

  if (loading) return <LoadingSkeleton />;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-rose-500 via-red-500 to-orange-500 bg-clip-text text-transparent">
            Serve With Us
          </h1>
          <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-500 dark:text-gray-400">
            Find meaningful ways to use your gifts and time to make a difference
            in our community.
          </p>
        </motion.div>

        {session?.user && userApplications.length > 0 && (
          <MyApplications
            applications={userApplications}
            onWithdraw={handleAction}
            withdrawingId={actioning}
          />
        )}

        <div className="mt-12">
          <h2 className="text-3xl font-bold text-center mb-10">
            Current Opportunities
          </h2>
          {opportunities.length === 0 ? (
            <NoOpportunities />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatePresence>
                {opportunities.map((opp) => (
                  <OpportunityCard
                    key={opp.id}
                    opportunity={opp}
                    userApplications={userApplications}
                    onApply={handleAction}
                    applyingId={actioning}
                    session={session}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const OpportunityCard = ({
  opportunity,
  userApplications,
  onApply,
  applyingId,
  session,
}: any) => {
  const userApplication = userApplications.find(
    (app: UserApplication) => app.opportunityId === opportunity.id
  );
  const progress =
    opportunity.requiredPeople > 0
      ? (opportunity.currentApplicants / opportunity.requiredPeople) * 100
      : 0;
  const isFull = opportunity.currentApplicants >= opportunity.requiredPeople;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="h-full flex flex-col bg-white dark:bg-gray-800/50 rounded-2xl shadow-lg border border-gray-200/80 dark:border-gray-700/60 overflow-hidden transform hover:-translate-y-1.5 transition-transform duration-300">
        {opportunity.imageUrl && (
          <div className="aspect-w-16 aspect-h-9 w-full overflow-hidden">
            <img
              src={opportunity.imageUrl}
              alt={opportunity.title}
              className="object-cover w-full h-full"
            />
          </div>
        )}
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-800 dark:text-gray-100">
            {opportunity.title}
          </CardTitle>
          <Badge variant="secondary" className="font-medium mt-1">
            {opportunity.type}
          </Badge>
        </CardHeader>
        <CardContent className="flex-grow">
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
            {opportunity.description}
          </p>
          <div>
            <Label className="text-xs font-semibold text-gray-500">
              PROGRESS
            </Label>
            <Progress value={progress} className="mt-1 h-2" />
            <p className="text-xs text-right mt-1 text-gray-500">
              {opportunity.currentApplicants} of {opportunity.requiredPeople}{" "}
              spots filled
            </p>
          </div>
        </CardContent>
        <CardFooter className="p-4 bg-gray-50 dark:bg-gray-800 border-t dark:border-gray-700/60">
          {session?.user ? (
            userApplication ? (
              <Button variant="outline" className="w-full" disabled>
                {" "}
                <Check className="mr-2 h-4 w-4" /> Applied (
                {userApplication.status})
              </Button>
            ) : (
              <Link href={`/member/volunteering/${opportunity.id}`} passHref>
                <Button
                  className="w-full"
                  disabled={isFull || applyingId === opportunity.id}
                >
                  {isFull ? "Full" : "View Details"}
                </Button>
              </Link>
            )
          ) : (
            <Button className="w-full" disabled>
              <LogIn className="mr-2 h-4 w-4" /> Log in to Apply
            </Button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
};

const MyApplications = ({ applications, onWithdraw, withdrawingId }: any) => (
  <div className="mb-12">
    <h2 className="text-3xl font-bold text-center mb-6">My Applications</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {applications.map((app: UserApplication) => (
        <Card
          key={app.id}
          className="bg-white dark:bg-gray-800/50 rounded-2xl shadow-md"
        >
          <CardHeader>
            <CardTitle className="text-lg">{app.opportunity.title}</CardTitle>
            <CardDescription>
              Applied on: {new Date(app.appliedAt).toLocaleDateString()}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <Badge className={statusStyles[app.status]}>{app.status}</Badge>
            {app.status === "PENDING" && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onWithdraw("withdraw", app.id)}
                disabled={withdrawingId === app.id}
              >
                {withdrawingId === app.id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <X className="h-4 w-4" />
                )}
                <span className="ml-2">Withdraw</span>
              </Button>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

const NoOpportunities = () => (
  <div className="text-center col-span-full py-16 px-6 bg-white dark:bg-gray-800/40 rounded-2xl shadow-sm">
    <Inbox className="mx-auto h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
    <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
      No Opportunities Available
    </h3>
    <p className="mt-2 text-gray-500 dark:text-gray-400">
      Please check back later for new ways to serve.
    </p>
  </div>
);
