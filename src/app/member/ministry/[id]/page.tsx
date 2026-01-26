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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Ministry } from "@/generated/prisma";
import {
  ArrowLeft,
  Mail,
  UserPlus,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Progress } from "@/components/ui/progress";

const MinistryDetailPage = () => {
  const { id } = useParams();
  const { data: session, status } = useSession();
  const [ministry, setMinistry] = useState<Ministry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMember, setIsMember] = useState(false);
  const [showAskClarityModal, setShowAskClarityModal] = useState(false);
  const [showJoinConfirmationModal, setShowJoinConfirmationModal] =
    useState(false);
  const [clarityMessage, setClarityMessage] = useState("");
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [messageProgress, setMessageProgress] = useState(0);

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
      toast.error(err.message, {
        icon: <AlertCircle className="h-5 w-5 text-red-600" />,
      });
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchMinistryDetails();
  }, [fetchMinistryDetails]);

  useEffect(() => {
    const checkMembership = async () => {
      if (!session?.user?.id || !ministry?.id) return;
      try {
        const response = await fetch(
          `/api/ministries-members?ministryId=${ministry.id}&userId=${session.user.id}`
        );
        if (!response.ok) {
          if (response.status === 404) {
            setIsMember(false);
            return;
          }
          throw new Error("Failed to check membership status");
        }
        const isMemberStatus = await response.json();
        setIsMember(isMemberStatus);
      } catch (err: any) {
        console.error("Error checking membership:", err);
        toast.error(err.message, {
          icon: <AlertCircle className="h-5 w-5 text-red-600" />,
        });
      }
    };

    if (status === "authenticated" && ministry) {
      checkMembership();
    }
  }, [session, status, ministry]);

  useEffect(() => {
    if (showAskClarityModal) {
      const progress = clarityMessage.trim()
        ? Math.min(clarityMessage.length / 5, 100)
        : 0;
      setMessageProgress(progress);
    }
  }, [clarityMessage, showAskClarityModal]);

  const handleJoinMinistry = async () => {
    if (status !== "authenticated") {
      toast.error("Please log in to join a ministry.", {
        icon: <AlertCircle className="h-5 w-5 text-red-600" />,
      });
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

      setIsMember(true);
      setShowJoinConfirmationModal(true);
      await fetchMinistryDetails();
      toast.success(`Successfully joined ${ministry.name}!`, {
        icon: <CheckCircle2 className="h-5 w-5 text-green-600" />,
      });
    } catch (err: any) {
      toast.error(err.message, {
        icon: <AlertCircle className="h-5 w-5 text-red-600" />,
      });
    }
  };

  const handleSendClarityMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status !== "authenticated") {
      toast.error("Please log in to send a message.", {
        icon: <AlertCircle className="h-5 w-5 text-red-600" />,
      });
      return;
    }
    if (
      !ministry?.id ||
      !ministry.leaderId ||
      !session?.user?.id ||
      !clarityMessage.trim()
    ) {
      toast.error("Message content and recipient are required.", {
        icon: <AlertCircle className="h-5 w-5 text-red-600" />,
      });
      return;
    }

    setIsSendingMessage(true);
    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderId: session.user.id,
          recipientId: ministry.leaderId,
          subject: `Inquiry about ${ministry.name} Ministry`,
          content: clarityMessage,
          type: "MINISTRY_INQUIRY",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to send message");
      }

      toast.success("Message sent to ministry leader!", {
        icon: <CheckCircle2 className="h-5 w-5 text-green-600" />,
      });
      setClarityMessage("");
      setShowAskClarityModal(false);
    } catch (err: any) {
      toast.error(err.message, {
        icon: <AlertCircle className="h-5 w-5 text-red-600" />,
      });
    } finally {
      setIsSendingMessage(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 flex items-center justify-center px-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="flex flex-col items-center"
        >
          <Loader2 className="h-16 w-16 text-indigo-600" />
          <p className="mt-4 text-sm sm:text-base text-gray-600">
            Loading ministry details...
          </p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center px-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center"
        >
          <div className="inline-flex items-center justify-center bg-red-100 p-4 rounded-full mb-4">
            <AlertCircle className="h-6 w-6 text-red-600" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
            Error
          </h1>
          <p className="text-sm text-red-600 mb-6">{error}</p>
          <Button
            onClick={() => window.location.reload()}
            className="bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-md transition-transform transform hover:scale-105"
          >
            Try Again
          </Button>
        </motion.div>
      </div>
    );
  }

  if (!ministry) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 flex items-center justify-center px-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center"
        >
          <div className="inline-flex items-center justify-center bg-gray-100 p-4 rounded-full mb-4">
            <AlertCircle className="h-6 w-6 text-gray-500" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
            Ministry Not Found
          </h1>
          <p className="text-sm text-gray-600 mb-6">
            The requested ministry could not be found.
          </p>
          <Link href="/ministry" passHref>
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-md transition-transform transform hover:scale-105">
              Back to Ministries
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        <Link href="/ministry" passHref>
          <Button
            variant="outline"
            className="mb-6 flex items-center border-gray-200 text-gray-600 hover:bg-gray-50 rounded-lg shadow-md transition-transform transform hover:scale-105"
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to All Ministries
          </Button>
        </Link>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            {ministry.name}
          </h1>
          <p className="text-base sm:text-lg text-gray-600 mt-2 max-w-2xl">
            Explore the details, events, and members of {ministry.name}.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          <motion.div
            className="lg:col-span-2 space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <MinistryInfo ministry={ministry} />
            <MinistryEvents ministryId={ministry.id} />
          </motion.div>
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <MinistryMembers ministryMembers={ministry.members || []} />
            <Card className="bg-white border-0 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-t-2xl">
                <CardTitle className="text-lg sm:text-xl font-bold text-indigo-700 flex items-center">
                  <UserPlus className="h-5 w-5 mr-2" />
                  Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                {status === "authenticated" ? (
                  isMember ? (
                    <Button
                      disabled
                      className="w-full flex items-center bg-green-500 hover:bg-green-600 text-white rounded-lg shadow-md transition-transform transform hover:scale-105"
                    >
                      <UserPlus className="mr-2 h-4 w-4" /> Joined
                    </Button>
                  ) : (
                    <Button
                      onClick={handleJoinMinistry}
                      className="w-full flex items-center bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg shadow-md transition-transform transform hover:scale-105"
                    >
                      <UserPlus className="mr-2 h-4 w-4" /> Join Ministry
                    </Button>
                  )
                ) : (
                  <Button
                    disabled
                    className="w-full flex items-center opacity-50 cursor-not-allowed bg-gray-300 text-gray-600 rounded-lg shadow-md"
                    title="Log in to join"
                  >
                    <UserPlus className="mr-2 h-4 w-4" /> Join Ministry (Login
                    Required)
                  </Button>
                )}
                <Button
                  onClick={() => setShowAskClarityModal(true)}
                  variant="outline"
                  className="w-full flex items-center border-gray-200 text-gray-600 hover:bg-gray-50 rounded-lg shadow-md transition-transform transform hover:scale-105"
                >
                  <Mail className="mr-2 h-4 w-4" /> Ask for Clarity
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <AnimatePresence>
          {showAskClarityModal && (
            <Dialog
              open={showAskClarityModal}
              onOpenChange={setShowAskClarityModal}
            >
              <DialogContent className="sm:max-w-md rounded-2xl bg-white shadow-xl p-6">
                <DialogHeader>
                  <DialogTitle className="text-lg sm:text-xl font-bold text-gray-800">
                    Ask about {ministry?.name}
                  </DialogTitle>
                  <DialogDescription className="text-sm text-gray-600">
                    Send a message to the ministry leader for clarity or
                    questions.
                  </DialogDescription>
                </DialogHeader>
                <form
                  onSubmit={handleSendClarityMessage}
                  className="space-y-4 py-4"
                >
                  <div>
                    <Input
                      type="text"
                      placeholder="Subject"
                      value={`Inquiry about ${ministry?.name} Ministry`}
                      readOnly
                      className="rounded-lg border-gray-200 bg-gray-50 text-sm sm:text-base focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200"
                    />
                  </div>
                  <div>
                    <Textarea
                      placeholder="Type your message here..."
                      value={clarityMessage}
                      onChange={(e) => setClarityMessage(e.target.value)}
                      rows={5}
                      required
                      className="rounded-lg border-gray-200 bg-gray-50 text-sm sm:text-base focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200"
                    />
                    <div className="mt-2">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-medium text-gray-600">
                          Message Progress
                        </span>
                        <span className="text-xs font-medium text-indigo-600">
                          {messageProgress}%
                        </span>
                      </div>
                      <Progress
                        value={messageProgress}
                        className="h-1.5 bg-gray-100"
                      />
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg shadow-md transition-transform transform hover:scale-105"
                    disabled={isSendingMessage}
                  >
                    {isSendingMessage ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      "Send Message"
                    )}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          )}
          {showJoinConfirmationModal && (
            <Dialog
              open={showJoinConfirmationModal}
              onOpenChange={setShowJoinConfirmationModal}
            >
              <DialogContent className="sm:max-w-md rounded-2xl bg-white shadow-xl">
                <DialogHeader>
                  <DialogTitle className="flex items-center space-x-2 text-lg sm:text-xl font-bold text-gray-800">
                    <CheckCircle2 className="h-6 w-6 text-green-600" />
                    <span>Joined {ministry.name}</span>
                  </DialogTitle>
                  <DialogDescription className="text-sm sm:text-base text-gray-600">
                    You have successfully joined {ministry.name}! Welcome to the
                    team.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button
                    onClick={() => setShowJoinConfirmationModal(false)}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg shadow-md transition-transform transform hover:scale-105"
                  >
                    Close
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </AnimatePresence>
      </motion.div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.6s ease-out;
        }
        .animate-slide-up {
          animation: slideUp 0.6s ease-out;
        }
      `}</style>
    </div>
  );
};

export default MinistryDetailPage;
