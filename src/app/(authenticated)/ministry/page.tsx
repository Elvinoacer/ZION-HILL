"use client";
"use client";
import { useEffect } from "react";
import MinistryInfo from "@/components/MinistryInfo";
import MinistryMembers from "@/components/MinistryMembers";
import MinistryEvents from "@/components/MinistryEvents";
import { useMinistryStore } from "@/store";

export default function MinistryPage() {
  const {
    ministries,
    ministryMembers,
    loading,
    error,
    fetchMinistries,
    fetchMinistryMembers,
  } = useMinistryStore();

  useEffect(() => {
    fetchMinistries();
    fetchMinistryMembers();
  }, [fetchMinistries, fetchMinistryMembers]);

  if (loading)
    return <div className="text-center py-8">Loading ministry data...</div>;
  if (error)
    return <div className="text-center py-8 text-red-500">Error: {error}</div>;

  // For simplicity, let's assume we are displaying the first ministry found
  const currentMinistry = ministries[1];
  console.log(ministryMembers, "ministryMembers");

  return (
    <div className="space-y-8 p-4 bg-gradient-to-b from-gray-50 to-blue-50 min-h-screen">
      <h1 id="ministry-page-heading" className="sr-only">
        Ministry Management Dashboard
      </h1>
      {currentMinistry && <MinistryInfo ministry={currentMinistry} />}
      <div
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        role="main"
        aria-labelledby="ministry-page-heading"
      >
        <MinistryMembers ministryMembers={ministryMembers} />
        {currentMinistry && <MinistryEvents ministryId={currentMinistry.id} />}
      </div>
    </div>
  );
}
