"use client";
// app/profile/page.tsx
import UserProfile from "@/components/UserProfile";
import FamilyMembers from "@/components/FamilyMembers";
import MembershipStatus from "@/components/MembershipStatus";

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <UserProfile />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FamilyMembers />
        <MembershipStatus />
      </div>
    </div>
  );
}
