"use client";
import React, { use } from "react";
import { Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { safeFetch } from "@/lib/api";
import Image from "next/image";
import {
  Loader2,
  Users,
  Calendar,
  MapPin,
  Info,
  CheckCircle,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

interface Ministry {
  id: string;
  name: string;
  description: string;
  photo?: string;
  leader?: { name: string };
  _count?: { members: number };
  events?: Array<{
    id: string;
    title: string;
    date: string;
    location: string;
    imageUrl?: string;
  }>;
}

const MinistryDetailPageContent = ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { data: session } = useSession();
  const { id } = use(params);
  const [ministry, setMinistry] = React.useState<Ministry | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [isJoining, setIsJoining] = React.useState(false);
  const [hasRequestedToJoin, setHasRequestedToJoin] = React.useState(false);

  const fetchMinistry = React.useCallback(async () => {
    try {
      const data = await safeFetch<Ministry>(`/api/ministries?id=${id}`);
      setMinistry(data);
      if (session?.user?.id) {
        const joinRequests = await safeFetch<any[]>(
          `/api/ministry-join-requests?userId=${session.user.id}&ministryId=${id}`
        );
        setHasRequestedToJoin(joinRequests.length > 0);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id, session?.user?.id]);

  React.useEffect(() => {
    fetchMinistry();
  }, [fetchMinistry]);

  const handleJoinMinistry = async () => {
    if (!session?.user?.id) {
      toast.error("You must be logged in to join a ministry.");
      return;
    }
    setIsJoining(true);
    try {
      await safeFetch("/api/ministry-join-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: session.user.id, ministryId: id }),
      });
      toast.success(
        "Your request to join the ministry has been sent for approval!"
      );
      setHasRequestedToJoin(true);
    } catch (err: any) {
      toast.error(`Failed to send join request: ${err.message}`);
    } finally {
      setIsJoining(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white flex items-center justify-center animate-fade-in">
        <Loader2 className="h-10 w-10 animate-spin text-blue-400" />
        <p className="ml-3 text-lg text-gray-300">
          Loading ministry details...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-4 sm:p-6 flex items-center justify-center animate-fade-in">
        <Card className="w-full max-w-md bg-gray-800/50 backdrop-blur-sm border border-gray-700/30 shadow-lg">
          <CardHeader>
            <CardTitle className="text-white">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-400 mb-4">Failed to load ministry: {error}</p>
            <Button onClick={() => window.location.reload()} className="mt-4 w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-300">
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!ministry) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-4 sm:p-6 flex items-center justify-center animate-fade-in">
        <Card className="w-full max-w-md bg-gray-800/50 backdrop-blur-sm border border-gray-700/30 shadow-lg">
          <CardHeader>
            <CardTitle className="text-white">Ministry Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-400">
              The ministry you are looking for does not exist.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-4 sm:p-6 animate-fade-in">
      <Card className="overflow-hidden shadow-lg bg-gray-800/50 backdrop-blur-sm border border-gray-700/30 rounded-lg">
        {ministry.photo && (
          <div className="relative h-64 w-full overflow-hidden rounded-t-lg">
            <Image
              src={ministry.photo}
              alt={ministry.name}
              layout="fill"
              objectFit="cover"
              className="transition-transform duration-300 hover:scale-105"
            />
          </div>
        )}
        <CardHeader>
          <CardTitle className="text-3xl sm:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
            {ministry.name}
          </CardTitle>
          {ministry.leader && (
            <p className="text-md text-gray-400">
            Led by: {ministry.leader.name}
          </p>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-gray-300 text-lg leading-relaxed">
            {ministry.description}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center text-gray-400">
              <Users className="h-5 w-5 mr-2 text-blue-400" />
              <span>{ministry._count?.members || 0} Members</span>
            </div>
            {/* Add more ministry details here if available, e.g., mission, vision */}
          </div>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
            Upcoming Events
          </h2>
          {ministry.events && ministry.events.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ministry.events.map((event) => (
                <Card
                  key={event.id}
                  className="flex items-center p-4 bg-gray-800/50 backdrop-blur-sm border border-gray-700/30 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                >
                  {event.imageUrl && (
                    <div className="relative h-20 w-20 mr-4 rounded-md overflow-hidden flex-shrink-0">
                      <Image
                        src={event.imageUrl}
                        alt={event.title}
                        layout="fill"
                        objectFit="cover"
                      />
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-lg text-white">{event.title}</h3>
                    <p className="text-sm text-gray-400 flex items-center">
                      <Calendar className="h-4 w-4 mr-1 text-blue-400" />{" "}
                      {new Date(event.date).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-400 flex items-center">
                      <MapPin className="h-4 w-4 mr-1 text-blue-400" /> {event.location}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-center py-4">
              No upcoming events for this ministry.
            </p>
          )}

          <div className="mt-8 pt-6 border-t border-gray-700">
            {session?.user?.id ? (
              hasRequestedToJoin ? (
                <Button
                  disabled
                  className="bg-gray-700 text-gray-400 cursor-not-allowed w-full"
                >
                  <CheckCircle className="h-5 w-5 mr-2" /> Request
                  Pending/Approved
                </Button>
              ) : (
                <Button
                  onClick={handleJoinMinistry}
                  disabled={isJoining}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  {isJoining ? (
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  ) : (
                    <Info className="h-5 w-5 mr-2" />
                  )}
                  Join Ministry
                </Button>
              )
            ) : (
              <p className="text-gray-400 text-sm text-center">
                Log in to send a request to join this ministry.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const MinistryDetailPage = ({ params }: { params: { id: string } }) => (
  <Suspense
    fallback={
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-blue-400" />
        <p className="ml-3 text-lg text-gray-300">Loading page...</p>
      </div>
    }
  >
    <MinistryDetailPageContent params={params} />
  </Suspense>
);

export default MinistryDetailPage;
