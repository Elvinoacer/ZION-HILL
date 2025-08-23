"use client";

import { motion } from "framer-motion";
import {
  BarChart2,
  BookOpen,
  Calendar,
  PencilLine,
  ShieldCheck,
  Sparkles,
  Users,
  Wand2,
} from "lucide-react";
import { useSession } from "next-auth/react";
import React, { useEffect, useMemo, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// shadcn/ui components (assumes your project has these installed)
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// Types — adjust imports to your actual paths
import {
  Event,
  Group,
  Ministry,
  MinistryMember,
  User,
} from "@/generated/prisma";
import { useMinistryStore } from "@/store";

interface MinistryInfoProps {
  ministry: Ministry & {
    leader: User | null;
    members: MinistryMember[];
    groups: Group[];
    events: Event[];
  };
}

// Lightweight skeleton shimmer
const Skeleton = ({ className = "" }: { className?: string }) => (
  <div
    className={`animate-pulse rounded-xl bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 ${className}`}
  />
);

// Custom tooltip for the chart
function GrowthTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border bg-white/95 px-3 py-2 shadow-sm">
        <p className="text-xs text-slate-500">{label}</p>
        <p className="text-sm font-semibold text-slate-800">
          Members: {payload[0].value}
        </p>
      </div>
    );
  }
  return null;
}

export default function MinistryInfo({ ministry }: MinistryInfoProps) {
  const { data: session } = useSession();
  const { updateMinistry } = useMinistryStore();

  // Edit state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState({
    name: ministry?.name ?? "",
    description: ministry?.description ?? "",
    leaderId: ministry?.leaderId ?? "",
  });

  // Growth data state
  const [fetchedGrowthData, setFetchedGrowthData] = useState<any[]>([]);
  const [isGrowthDataLoading, setIsGrowthDataLoading] = useState(true);
  const [growthDataError, setGrowthDataError] = useState<string | null>(null);

  const isLeader = useMemo(() => {
    return Boolean(
      ministry?.leader?.id && session?.user?.id === ministry.leader?.id
    );
  }, [ministry?.leader?.id, session?.user?.id]);

  useEffect(() => {
    let isMounted = true;
    const fetchGrowthData = async () => {
      if (!ministry?.id) return;
      setIsGrowthDataLoading(true);
      setGrowthDataError(null);
      try {
        const response = await fetch(
          `/api/ministries/${ministry.id}/growth-data`
        );
        if (!response.ok) throw new Error("Failed to fetch growth data");
        const data = await response.json();
        if (isMounted) setFetchedGrowthData(Array.isArray(data) ? data : []);
      } catch (err: any) {
        if (isMounted) setGrowthDataError(err.message ?? "Unknown error");
      } finally {
        if (isMounted) setIsGrowthDataLoading(false);
      }
    };
    fetchGrowthData();
    return () => {
      isMounted = false;
    };
  }, [ministry?.id]);

  const stats = useMemo(
    () => [
      {
        icon: Users,
        label: "Members",
        value: ministry?.members?.length ?? 0,
        hint: "Total registered members",
      },
      {
        icon: BookOpen,
        label: "Active Groups",
        value: ministry?.groups?.length ?? 0,
        hint: "Small groups & teams",
      },
      {
        icon: Calendar,
        label: "Upcoming Events",
        value: ministry?.events?.length ?? 0,
        hint: "Scheduled activities",
      },
    ],
    [
      ministry?.members?.length,
      ministry?.groups?.length,
      ministry?.events?.length,
    ]
  );

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateMinistry(ministry.id, editData);
      setShowEditModal(false);
    } catch (error) {
      console.error("Error updating ministry:", error);
    }
  };

  if (!ministry) {
    return (
      <Card className="border-0 bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <CardContent className="p-8">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-6 w-6 text-slate-400" />
            <p className="text-slate-600">No ministry data available.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="relative">
      {/* Decorative gradient blobs */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-10 -right-16 h-56 w-56 rounded-full bg-gradient-to-br from-blue-200/60 to-indigo-200/60 blur-3xl" />
        <div className="absolute -bottom-10 -left-16 h-56 w-56 rounded-full bg-gradient-to-br from-emerald-200/60 to-teal-200/60 blur-3xl" />
      </div>

      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        aria-labelledby="ministry-info-heading"
        className="rounded-2xl border border-slate-200/60 bg-white/80 p-5 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-white/70 md:p-7"
      >
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 items-center gap-4">
            <Avatar className="h-12 w-12 ring-2 ring-slate-200">
              {ministry?.leader?.photo ? (
                <AvatarImage
                  src={ministry.leader.photo}
                  alt={`${ministry?.leader?.name ?? "Leader"} photo`}
                />
              ) : (
                <AvatarFallback>
                  {ministry?.leader?.name?.slice(0, 2)?.toUpperCase() ?? "NA"}
                </AvatarFallback>
              )}
            </Avatar>
            <div className="min-w-0">
              <h3
                id="ministry-info-heading"
                className="truncate text-lg font-semibold tracking-tight text-slate-800 md:text-xl"
              >
                {ministry.name}
              </h3>
              <p className="mt-0.5 flex flex-wrap items-center gap-2 text-sm text-slate-600">
                <span className="inline-flex items-center gap-1">
                  <Sparkles className="h-4 w-4" aria-hidden />
                  Led by{" "}
                  <span className="font-medium text-slate-800">
                    {ministry?.leader?.name ?? "N/A"}
                  </span>
                </span>
                <Badge variant="secondary" className="rounded-full">
                  Ministry
                </Badge>
              </p>
            </div>
          </div>

          {isLeader && (
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
                <DialogTrigger asChild>
                  <Button variant="default" className="rounded-xl">
                    <PencilLine className="mr-2 h-4 w-4" /> Edit
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Edit ministry</DialogTitle>
                    <DialogDescription>
                      Update basic information. Changes are saved for everyone.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleEditSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={editData.name}
                        onChange={(e) =>
                          setEditData((s) => ({ ...s, name: e.target.value }))
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        rows={4}
                        value={editData.description}
                        onChange={(e) =>
                          setEditData((s) => ({
                            ...s,
                            description: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="leaderId">Leader ID</Label>
                      <Input
                        id="leaderId"
                        value={editData.leaderId}
                        onChange={(e) =>
                          setEditData((s) => ({
                            ...s,
                            leaderId: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <DialogFooter className="gap-2 sm:gap-0">
                      <Button
                        type="button"
                        variant="secondary"
                        className="rounded-xl"
                        onClick={() => setShowEditModal(false)}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" className="rounded-xl">
                        Save changes
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </div>

        {/* Description */}
        {ministry.description ? (
          <p className="mt-4 text-sm leading-6 text-slate-700 md:text-base">
            {ministry.description}
          </p>
        ) : (
          <p className="mt-4 text-sm italic text-slate-500">
            No description provided.
          </p>
        )}

        {/* Stats */}
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.05 * i }}
            >
              <Card className="group h-full border-slate-200/70 bg-gradient-to-b from-white to-slate-50/70 transition-colors">
                <CardContent className="flex items-center gap-3 p-4">
                  <div className="rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
                    <s.icon className="h-5 w-5 text-blue-600" aria-hidden />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs uppercase tracking-wide text-slate-500">
                      {s.label}
                    </p>
                    <div className="flex items-baseline gap-2">
                      <span className="truncate text-2xl font-bold text-slate-800">
                        {s.value}
                      </span>
                      <span className="truncate text-xs text-slate-500">
                        {s.hint}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Growth Chart */}
        <Card className="mt-6 border-slate-200/70 bg-white/80">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base font-semibold text-slate-800 md:text-lg">
              <BarChart2 className="h-5 w-5" aria-hidden /> Ministry Growth
            </CardTitle>
            <CardDescription>Monthly member count</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-48 w-full md:h-64">
              {isGrowthDataLoading ? (
                <Skeleton className="h-full w-full" />
              ) : growthDataError ? (
                <div className="flex h-full items-center justify-center rounded-xl border border-red-200 bg-red-50/60 text-sm text-red-700">
                  {growthDataError}
                </div>
              ) : (fetchedGrowthData?.length ?? 0) === 0 ? (
                <div className="flex h-full flex-col items-center justify-center rounded-xl border border-slate-200/70 bg-slate-50/60 p-4 text-center">
                  <Wand2 className="mb-2 h-5 w-5 text-slate-400" />
                  <p className="text-sm text-slate-600">
                    No growth data available yet.
                  </p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={fetchedGrowthData}
                    margin={{ top: 8, right: 16, left: 4, bottom: 8 }}
                  >
                    <defs>
                      <linearGradient id="gradLine" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="0%"
                          stopColor="#2563eb"
                          stopOpacity={0.9}
                        />
                        <stop
                          offset="100%"
                          stopColor="#2563eb"
                          stopOpacity={0.2}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis
                      dataKey="month"
                      tick={{ fontSize: 12, fill: "#475569" }}
                      tickMargin={8}
                      axisLine={{ stroke: "#e2e8f0" }}
                    />
                    <YAxis
                      tick={{ fontSize: 12, fill: "#475569" }}
                      axisLine={{ stroke: "#e2e8f0" }}
                    />
                    <Tooltip content={<GrowthTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="members"
                      stroke="#2563eb"
                      strokeWidth={2.5}
                      dot={{ r: 2.5, strokeWidth: 1.5, stroke: "#2563eb" }}
                      activeDot={{ r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.section>
    </div>
  );
}
