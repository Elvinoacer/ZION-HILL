"use client";
import RoleDashboard from "@/components/admin/RoleDashboard";
import { ministryType, useMinistryStore } from "@/store";
import { use, useEffect, useState } from "react";

export default function RolePage({
  params,
}: {
  params: Promise<{ role: string }>;
}) {
  const { role } = use(params);

  const userole = decodeURIComponent(role);
  const { ministries, loading, error, fetchMinistries } = useMinistryStore();
  const [ministry, setMinistry] = useState<ministryType>({
    description: "",
    id: "",
    leader: null,
    leaderId: "",
    name: "",
  });

  useEffect(() => {
    fetchMinistries();
    const ministry = ministries.find((m) => m.id === userole);
    setMinistry(ministry);
  }, [fetchMinistries, userole]);

  if (loading)
    return <div className="text-center py-8">Loading ministry data...</div>;
  if (error)
    return <div className="text-center py-8 text-red-500">Error: {error}</div>;

  // if (!ministry) {
  //   return notFound();
  // }

  return <RoleDashboard ministry={ministry} />;
}
