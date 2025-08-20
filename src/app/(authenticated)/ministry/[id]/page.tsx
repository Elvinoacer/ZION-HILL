// src/app/(authenticated)/ministry/[id]/page.tsx
"use client";

import MinistryEvents from "@/components/MinistryEvents";
import MinistryInfo from "@/components/MinistryInfo";
import MinistryMembers from "@/components/MinistryMembers";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"; // Import Radix Dialog components
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Ministry } from "@/generated/prisma";
import { ArrowLeft, Mail, UserPlus } from "lucide-react";
import { useSession } from "next-auth/react"; // Import useSession
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

const MinistryDetailPage = () => {
  const { id } = useParams();
  const { data: session, status } = useSession(); // Get session
  const [ministry, setMinistry] = useState<Ministry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMember, setIsMember] = useState(false); // State to track if user is a member
  const [showAskClarityModal, setShowAskClarityModal] = useState(false); // State for modal
  const [clarityMessage, setClarityMessage] = useState("");
  const [isSendingMessage, setIsSendingMessage] = useState(false);

  // Define fetchMinistryDetails outside useEffect and memoize it
  const fetchMinistryDetails = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/ministries?id=${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch ministry details");
      }
      const data = await response.json();
      setMinistry(data);
    } catch (err: any) {
      console.error("Error fetching ministry details:", err);
      setError(err.message || "Failed to load ministry details.");
    } finally {
      setLoading(false);
    }
  }, [id]); // Dependency on 'id'

  useEffect(() => {
    fetchMinistryDetails();
  }, [fetchMinistryDetails]); // Dependency on the memoized function

  // Check if current user is a member of this ministry
  useEffect(() => {
    const checkMembership = async () => {
      if (!session?.user?.id || !ministry?.id) return;
      try {
        const response = await fetch(
          `/api/ministry-members?ministryId=${ministry.id}&userId=${session.user.id}`
        );
        if (!response.ok) {
          // If the API returns 404 or similar for not found, it's not an error, just not a member
          if (response.status === 404) {
            setIsMember(false);
            return;
          }
          throw new Error("Failed to check membership status");
        }
        const isMemberStatus = await response.json(); // This should be a boolean from the API
        setIsMember(isMemberStatus);
      } catch (err: any) {
        console.error("Error checking membership:", err);
        toast.error(err.message);
      }
    };

    if (status === "authenticated" && ministry) {
      checkMembership();
    }
  }, [session, status, ministry]);

  const handleJoinMinistry = async () => {
    if (status !== "authenticated") {
      toast.error("Please log in to join a ministry.");
      return;
    }
    if (!ministry?.id || !session?.user?.id) return;

    try {
      const response = await fetch("/api/ministry-members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ministryId: ministry.id,
          userId: session.user.id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to join ministry");
      }

      toast.success(`Successfully joined ${ministry.name}!`);
      setIsMember(true);
      // Optionally re-fetch ministry details to update member count
      await fetchMinistryDetails(); // <--- Add this line
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleSendClarityMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status !== "authenticated") {
      toast.error("Please log in to send a message.");
      return;
    }
    if (
      !ministry?.id ||
      !ministry.leaderId ||
      !session?.user?.id ||
      !clarityMessage.trim()
    ) {
      toast.error("Message content and recipient are required.");
      return;
    }

    setIsSendingMessage(true);
    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderId: session.user.id,
          recipientId: ministry.leaderId, // Send to ministry leader
          subject: `Inquiry about ${ministry.name} Ministry`,
          content: clarityMessage,
          type: "MINISTRY_INQUIRY", // Use the new specific message type
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to send message");
      }

      toast.success("Message sent to ministry leader!");
      setClarityMessage("");
      setShowAskClarityModal(false);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsSendingMessage(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 text-center">
        <p className="text-lg text-gray-600">Loading ministry details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 text-center">
        <p className="text-lg text-red-500">Error: {error}</p>
      </div>
    );
  }

  if (!ministry) {
    return (
      <div className="container mx-auto py-8 text-center">
        <p className="text-lg text-gray-600">Ministry not found.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <Link href="/ministry" passHref>
        <Button variant="outline" className="mb-6 flex items-center">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to All Ministries
        </Button>
      </Link>

      <h1 className="text-3xl font-bold text-gray-900 mb-6">{ministry.name}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <MinistryInfo ministry={ministry} />
          <MinistryEvents ministryId={ministry.id} />
        </div>
        <div className="space-y-6">
          <MinistryMembers ministryMembers={ministry.members || []} />
          <Card className="shadow-lg rounded-lg">
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {status === "authenticated" ? (
                isMember ? (
                  <Button
                    disabled
                    className="w-full flex items-center bg-green-500 hover:bg-green-600 text-white"
                  >
                    <UserPlus className="mr-2 h-4 w-4" /> Joined
                  </Button>
                ) : (
                  <Button
                    onClick={handleJoinMinistry}
                    className="w-full flex items-center"
                  >
                    <UserPlus className="mr-2 h-4 w-4" /> Join Ministry
                  </Button>
                )
              ) : (
                <Button
                  disabled
                  className="w-full flex items-center"
                  title="Log in to join"
                >
                  <UserPlus className="mr-2 h-4 w-4" /> Join Ministry (Login
                  Required)
                </Button>
              )}
              <Button
                onClick={() => setShowAskClarityModal(true)}
                variant="outline"
                className="w-full flex items-center"
              >
                <Mail className="mr-2 h-4 w-4" /> Ask for Clarity
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Ask for Clarity Modal */}
      <Dialog open={showAskClarityModal} onOpenChange={setShowAskClarityModal}>
        <DialogContent className="sm:max-w-[425px] p-6">
          <DialogHeader>
            <DialogTitle>Ask about {ministry?.name}</DialogTitle>
            <DialogDescription>
              Send a message to the ministry leader for clarity or questions.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSendClarityMessage} className="space-y-4 py-4">
            <Input
              type="text"
              placeholder="Subject (e.g., Inquiry about activities)"
              value={`Inquiry about ${ministry?.name} Ministry`}
              readOnly
            />
            <Textarea
              placeholder="Type your message here..."
              value={clarityMessage}
              onChange={(e) => setClarityMessage(e.target.value)}
              rows={5}
              required
            />
            <Button
              type="submit"
              className="w-full"
              disabled={isSendingMessage}
            >
              {isSendingMessage ? "Sending..." : "Send Message"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MinistryDetailPage;
