"use client";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import NotificationPermissionModal from "@/components/NotificationPermissionModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useDashboardStore } from "@/store/dashboardStore";
import { Icons } from "@/components/icons";
import Link from "next/link";

interface ThemeOfTheWeek {
  id: string;
  title: string;
  verse: string;
  reference: string;
  createdAt: string;
}

const DashboardPage = () => {
  const { data: session } = useSession();
  const [showNotificationModal, setShowNotificationModal] = useState(false);

  useEffect(() => {
    if ("Notification" in window) {
      if (Notification.permission === "default") {
        setShowNotificationModal(true);
      }
    }
  }, []);
  const [themeOfTheWeek, setThemeOfTheWeek] = useState<ThemeOfTheWeek | null>(
    null
  );
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const {
    profile,
    upcomingEvents,
    recentSermons,
    givingHistory,
    bibleStudyProgress,
    prayerRequests,
    counselingSessions,
    newVolunteeringOpportunitiesCount,
    loading,
    error,
    fetchDashboardData,
  } = useDashboardStore();

  useEffect(() => {
    if (session?.user?.id) {
      fetchDashboardData(session.user.id);
    }

    const fetchThemeOfTheWeek = async () => {
      try {
        const response = await fetch("/api/theme-of-the-week");
        if (response.ok) {
          const data = await response.json();
          if (data && data.length > 0) {
            setThemeOfTheWeek(data[0]);
          }
        }
      } catch (error) {
        console.error("Failed to fetch theme of the week:", error);
      }
    };

    fetchThemeOfTheWeek();

    const fetchAnnouncements = async () => {
      try {
        const response = await fetch("/api/announcements");
        if (response.ok) {
          const data = await response.json();
          setAnnouncements(data);
        }
      } catch (error) {
        console.error("Failed to fetch announcements:", error);
      }
    };

    fetchAnnouncements();
  }, [session, fetchDashboardData]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 flex items-center justify-center p-4">
        <div className="text-center space-y-6 animate-fade-in">
          <Icons.spinner className="h-12 w-12 animate-spin text-blue-600 mx-auto" />
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Loading Your Spiritual Journey
          </h1>
          <p className="text-lg text-gray-600">
            Gathering your personalized dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl max-w-md w-full text-center space-y-6 animate-fade-in">
          <div className="inline-flex items-center justify-center bg-red-100 p-4 rounded-full">
            <Icons.warning className="h-8 w-8 text-red-600" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
            Something Went Wrong
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">{error}</p>
          <Button className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg shadow-md transition-transform transform hover:scale-105">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 py-6 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Theme of the Week */}
        {themeOfTheWeek && (
          <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl shadow-lg sm:shadow-2xl overflow-hidden mb-6 sm:mb-8 animate-slide-up">
            {/* Subtle gradient circles */}
            <div className="absolute top-0 right-0 h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full transform rotate-45 -translate-y-1/3 translate-x-1/3"></div>
            <div className="absolute bottom-0 left-0 h-20 w-20 sm:h-24 sm:w-24 md:h-32 md:w-32 bg-gradient-to-tr from-purple-400/15 to-pink-400/15 rounded-full transform -rotate-30 translate-y-1/3 -translate-x-1/3"></div>

            <div className="relative z-10 text-center space-y-2 sm:space-y-3 md:space-y-4">
              <h2 className="text-xs sm:text-sm font-semibold uppercase tracking-wider opacity-90">
                Theme of the Week
              </h2>
              <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold leading-snug sm:leading-tight px-2">
                {themeOfTheWeek.title}
              </h3>
              <p className="text-sm sm:text-base md:text-lg font-medium italic opacity-95 px-4">
                "{themeOfTheWeek.verse}"
              </p>
              <p className="text-xs sm:text-sm md:text-base opacity-85">
                {themeOfTheWeek.reference}
              </p>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="space-y-4 animate-fade-in">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-800 tracking-tight">
            Your Spiritual Dashboard
          </h1>
          <p className="text-lg sm:text-xl text-gray-600">
            Welcome back,{" "}
            <span className="text-blue-600 font-semibold">
              {profile?.name || "Beloved"}
            </span>
            . May your journey be blessed.
          </p>
          {newVolunteeringOpportunitiesCount > 0 && (
            <Link href="/volunteering" className="block">
              <div className="bg-yellow-100 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg flex items-center justify-between shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-[1.01]">
                <div className="flex items-center space-x-3">
                  <Icons.bell className="h-6 w-6 text-yellow-600" />
                  <p className="font-medium text-sm sm:text-base">
                    New Volunteering Opportunities!
                  </p>
                </div>
                <span className="bg-yellow-600 text-white text-xs sm:text-sm font-bold px-3 py-1 rounded-full">
                  {newVolunteeringOpportunitiesCount}
                </span>
              </div>
            </Link>
          )}
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Announcements Card */}
          <Card className="bg-white border-0 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 animate-slide-up">
            <CardHeader className="bg-gradient-to-r from-rose-50 to-red-50 p-4 sm:p-6">
              <div className="flex items-center space-x-4">
                <div className="bg-rose-100 p-3 rounded-full">
                  <Icons.megaphone className="h-5 w-5 text-rose-600" />
                </div>
                <CardTitle className="text-lg sm:text-xl font-semibold text-gray-800">
                  Announcements
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              {announcements.length > 0 ? (
                <div className="space-y-4">
                  <ul className="divide-y divide-gray-200">
                    {announcements.slice(0, 3).map((announcement) => (
                      <li key={announcement.id} className="py-3">
                        <h3 className="font-medium text-gray-800 text-sm">
                          {announcement.title}
                        </h3>
                        <p className="text-xs text-gray-500 line-clamp-2">
                          {announcement.content}
                        </p>
                      </li>
                    ))}
                  </ul>
                  {announcements.length > 3 && (
                    <Link href="/member/announcements">
                      <Button
                        variant="outline"
                        className="w-full text-rose-600 border-rose-200 hover:bg-rose-50"
                      >
                        View All Announcements
                      </Button>
                    </Link>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 space-y-3">
                  <Icons.megaphone className="h-8 w-8 text-gray-300" />
                  <p className="text-gray-400 text-sm">No announcements</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card className="bg-white border-0 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 animate-slide-up">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 p-4 sm:p-6">
              <div className="flex items-center space-x-4">
                <div className="bg-purple-100 p-3 rounded-full">
                  <Icons.calendar className="h-5 w-5 text-purple-600" />
                </div>
                <CardTitle className="text-lg sm:text-xl font-semibold text-gray-800">
                  Upcoming Events
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              {upcomingEvents.length > 0 ? (
                <div className="space-y-4">
                  <ul className="divide-y divide-gray-200">
                    {upcomingEvents.slice(0, 3).map((event) => (
                      <li key={event.id} className="py-3 flex items-center space-x-4">
                        <div className="flex-shrink-0 text-center w-14 bg-purple-50 p-2 rounded-lg">
                          <p className="text-xs font-medium text-purple-800">
                            {new Date(event.date).toLocaleDateString("en-US", { month: "short" })}
                          </p>
                          <p className="text-xl font-bold text-purple-600">
                            {new Date(event.date).getDate()}
                          </p>
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-800 text-sm">
                            {event.title}
                          </h3>
                          <p className="text-xs text-gray-500">
                            {event.location || "Church Venue"}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                  {upcomingEvents.length > 3 && (
                    <Link href="/member/events">
                      <Button
                        variant="outline"
                        className="w-full text-purple-600 border-purple-200 hover:bg-purple-50"
                      >
                        View All Events
                      </Button>
                    </Link>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 space-y-3">
                  <Icons.calendarOff className="h-8 w-8 text-gray-300" />
                  <p className="text-gray-400 text-sm">No upcoming events</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Sermons */}
          <Card className="bg-white border-0 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 animate-slide-up">
            <CardHeader className="bg-gradient-to-r from-amber-50 to-yellow-50 p-4 sm:p-6">
              <div className="flex items-center space-x-4">
                <div className="bg-amber-100 p-3 rounded-full">
                  <Icons.audioLines className="h-5 w-5 text-amber-600" />
                </div>
                <CardTitle className="text-lg sm:text-xl font-semibold text-gray-800">
                  Recent Sermons
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              {recentSermons.length > 0 ? (
                <div className="space-y-4">
                  <ul className="divide-y divide-gray-200">
                    {recentSermons.slice(0, 3).map((sermon) => (
                      <li key={sermon.id} className="py-3 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="bg-amber-100 p-2 rounded-full">
                            <Icons.playCircle className="h-5 w-5 text-amber-600" />
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-800 text-sm">
                              {sermon.title}
                            </h3>
                            <p className="text-xs text-gray-500">
                              {sermon.speaker?.name || "Pastor"} •{" "}
                              {new Date(sermon.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                            </p>
                          </div>
                        </div>
                        <Link href={`/sermons/${sermon.id}`}>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-amber-600 hover:bg-amber-100"
                          >
                            Listen
                          </Button>
                        </Link>
                      </li>
                    ))}
                  </ul>
                  {recentSermons.length > 3 && (
                    <Link href="/sermons">
                      <Button
                        variant="outline"
                        className="w-full text-amber-600 border-amber-200 hover:bg-amber-50"
                      >
                        View All Sermons
                      </Button>
                    </Link>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 space-y-3">
                  <Icons.audioLinesOff className="h-8 w-8 text-gray-300" />
                  <p className="text-gray-400 text-sm">No recent sermons</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Bible Study Progress */}
          <Card className="bg-white border-0 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 animate-slide-up">
            <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 p-4 sm:p-6">
              <div className="flex items-center space-x-4">
                <div className="bg-indigo-100 p-3 rounded-full">
                  <Icons.bookOpen className="h-5 w-5 text-indigo-600" />
                </div>
                <CardTitle className="text-lg sm:text-xl font-semibold text-gray-800">
                  Bible Study
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 flex flex-col">
              {bibleStudyProgress ? (
                <div className="space-y-3 flex-grow">
                  <h3 className="font-medium text-gray-800 text-sm">
                    {bibleStudyProgress.title}
                  </h3>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Progress</span>
                      <span>{bibleStudyProgress.progress || 0}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-indigo-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                        style={{
                          width: `${bibleStudyProgress.progress || 0}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                  <div className="pt-2">
                    <Link href="/member/bible-study">
                      <Button
                        variant="outline"
                        className="w-full text-indigo-600 border-indigo-200 hover:bg-indigo-50"
                      >
                        Continue Study
                      </Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 space-y-4 flex-grow">
                  <Icons.bookOpenCheck className="h-8 w-8 text-gray-300" />
                  <p className="text-gray-400 text-sm">No active study</p>
                  <Link href="/member/bible-study">
                    <Button
                      variant="outline"
                      className="w-full text-indigo-600 border-indigo-200 hover:bg-indigo-50"
                    >
                      Start a New Study
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Giving History */}
          <Card className="bg-white border-0 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 animate-slide-up">
            <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 p-4 sm:p-6">
              <div className="flex items-center space-x-4">
                <div className="bg-emerald-100 p-3 rounded-full">
                  <Icons.handCoins className="h-5 w-5 text-emerald-600" />
                </div>
                <CardTitle className="text-lg sm:text-xl font-semibold text-gray-800">
                  Giving History
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              {givingHistory.length > 0 ? (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 bg-emerald-50 rounded-lg">
                    <h3 className="font-semibold text-gray-800 text-base">
                      Total Contributions
                    </h3>
                    <span className="text-lg font-bold text-emerald-600">
                      KES{" "}
                      {givingHistory
                        .reduce((sum, item) => sum + item.amount, 0)
                        .toFixed(2)}
                    </span>
                  </div>
                  <ul className="divide-y divide-gray-200">
                    {givingHistory.slice(0, 3).map((transaction) => (
                      <li
                        key={transaction.id}
                        className="py-3 flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="bg-gray-100 p-2 rounded-full">
                            <Icons.arrowRight className="h-4 w-4 text-gray-500" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-800 text-sm">
                              {transaction.type || "General Donation"}
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(transaction.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                            </p>
                          </div>
                        </div>
                        <span className="font-semibold text-gray-700 text-sm">
                          KES {transaction.amount.toFixed(2)}
                        </span>
                      </li>
                    ))}
                  </ul>
                  {givingHistory.length > 3 && (
                    <Link href="/member/giving">
                      <Button
                        variant="outline"
                        className="w-full text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                      >
                        View All Contributions
                      </Button>
                    </Link>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 space-y-3">
                  <Icons.piggyBank className="h-8 w-8 text-gray-300" />
                  <p className="text-gray-400 text-sm">No giving history yet</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Prayer Requests */}
          <Card className="bg-white border-0 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 animate-slide-up">
            <CardHeader className="bg-gradient-to-r from-pink-50 to-rose-50 p-4 sm:p-6">
              <div className="flex items-center space-x-4">
                <div className="bg-pink-100 p-3 rounded-full">
                  <Icons.pray className="h-5 w-5 text-pink-600" />
                </div>
                <CardTitle className="text-lg sm:text-xl font-semibold text-gray-800">
                  Prayer Requests
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 flex flex-col">
              {prayerRequests.length > 0 ? (
                <div className="space-y-4 flex-grow">
                  <ul className="divide-y divide-gray-200">
                    {prayerRequests.slice(0, 2).map((request) => (
                      <li key={request.id} className="py-3">
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0">
                            {request.isUrgent ? (
                              <Icons.alertTriangle className="h-5 w-5 text-pink-500" />
                            ) : (
                              <Icons.pray className="h-5 w-5 text-blue-500" />
                            )}
                          </div>
                          <p className="text-sm text-gray-700 line-clamp-2">
                            {request.request}
                          </p>
                        </div>
                        {request.isUrgent && (
                          <p className="mt-1 text-xs font-medium text-pink-600 text-right">
                            Urgent
                          </p>
                        )}
                      </li>
                    ))}
                  </ul>
                  <div className="pt-2 space-y-2">
                    {prayerRequests.length > 2 && (
                      <Link href="/member/prayer-wall">
                        <Button
                          variant="outline"
                          className="w-full text-pink-600 border-pink-200 hover:bg-pink-50"
                        >
                          View All Requests
                        </Button>
                      </Link>
                    )}
                    <Link href="/member/prayer-wall">
                      <Button className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white">
                        <Icons.plus className="h-4 w-4 mr-2" />
                        New Request
                      </Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 space-y-4 flex-grow">
                  <Icons.pray className="h-8 w-8 text-gray-300" />
                  <p className="text-gray-400 text-sm">No prayer requests</p>
                  <Link href="/member/prayer-wall">
                    <Button className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white">
                      <Icons.plus className="h-4 w-4 mr-2" />
                      Submit a Request
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Counseling Sessions */}
          <Card className="bg-white border-0 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 animate-slide-up">
            <CardHeader className="bg-gradient-to-r from-teal-50 to-cyan-50 p-4 sm:p-6">
              <div className="flex items-center space-x-4">
                <div className="bg-teal-100 p-3 rounded-full">
                  <Icons.messageSquare className="h-5 w-5 text-teal-600" />
                </div>
                <CardTitle className="text-lg sm:text-xl font-semibold text-gray-800">
                  Counseling
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 flex flex-col">
              {counselingSessions.length > 0 ? (
                <div className="space-y-4 flex-grow">
                  <ul className="divide-y divide-gray-200">
                    {counselingSessions.slice(0, 2).map((session) => (
                      <li key={session.id} className="py-3">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-gray-800 text-sm">
                            Topic: {session.topic?.name || "N/A"}
                          </h3>
                          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                            session.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                            session.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {session.status}
                          </span>
                        </div>
                        {session.counselor && (
                          <p className="text-xs text-gray-500 mt-1">
                            With: {session.counselor.name || "Unassigned"}
                          </p>
                        )}
                      </li>
                    ))}
                  </ul>
                  <div className="pt-2">
                    <Link href="/member/counseling">
                      <Button
                        variant="outline"
                        className="w-full text-teal-600 border-teal-200 hover:bg-teal-50"
                      >
                        View All Sessions
                      </Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 space-y-4 flex-grow">
                  <Icons.messageSquareOff className="h-8 w-8 text-gray-300" />
                  <p className="text-gray-400 text-sm text-center">
                    No active counseling sessions.
                  </p>
                  <Link href="/member/counseling-request">
                    <Button
                      variant="outline"
                      className="w-full text-teal-600 border-teal-200 hover:bg-teal-50"
                    >
                      Request a Session
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Baptism Application Status */}
          <Card className="bg-white border-0 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 animate-slide-up">
            <CardHeader className="bg-gradient-to-r from-sky-50 to-blue-50 p-4 sm:p-6">
              <div className="flex items-center space-x-4">
                <div className="bg-sky-100 p-3 rounded-full">
                  <Icons.droplet className="h-5 w-5 text-sky-600" />
                </div>
                <CardTitle className="text-lg sm:text-xl font-semibold text-gray-800">
                  Baptism Status
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 flex flex-col">
              {profile?.baptismApplicationStatus ? (
                <div className="space-y-3 flex-grow">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-800 text-sm">Application Status</h3>
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      profile.baptismApplicationStatus === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                      profile.baptismApplicationStatus === 'APPROVED' || profile.baptismApplicationStatus === 'SCHEDULED' ? 'bg-blue-100 text-blue-800' :
                      profile.baptismApplicationStatus === 'REJECTED' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {profile.baptismApplicationStatus}
                    </span>
                  </div>
                  {profile.baptismDate && (
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Icons.calendar className="h-4 w-4" />
                      <span>
                        Scheduled for {new Date(profile.baptismDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </span>
                    </div>
                  )}
                  <p className="text-xs text-gray-500 pt-1">
                    {profile.baptismApplicationStatus === "PENDING" &&
                      "Your application is under review. We will contact you soon."}
                    {profile.baptismApplicationStatus === "APPROVED" &&
                      "Congratulations! Your application has been approved. Check your email for the next steps."}
                    {profile.baptismApplicationStatus === "SCHEDULED" &&
                      "Your baptism is scheduled! We look forward to celebrating with you."}
                    {profile.baptismApplicationStatus === "COMPLETED" &&
                      "Praise God! You have been baptized."}
                    {profile.baptismApplicationStatus === "REJECTED" && (
                      <span className="text-red-600">
                        Your application was not approved at this time. Please contact the church office for more information.
                      </span>
                    )}
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 space-y-4 flex-grow">
                  <Icons.dropletOff className="h-8 w-8 text-gray-300" />
                  <p className="text-gray-400 text-sm">No application found.</p>
                  <Link href="/member/baptism-application">
                    <Button
                      variant="outline"
                      className="w-full text-sky-600 border-sky-200 hover:bg-sky-50"
                    >
                      Apply for Baptism
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Custom Tailwind Animations */}
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
      {showNotificationModal && (
        <NotificationPermissionModal
          onClose={() => setShowNotificationModal(false)}
        />
      )}
    </div>
  );
};

export default DashboardPage;
