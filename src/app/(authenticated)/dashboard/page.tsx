"use client";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useDashboardStore } from "@/store/dashboardStore";
import { Icons } from "@/components/icons";
import Link from "next/link"; // Added

interface ThemeOfTheWeek {
  id: string;
  title: string;
  verse: string;
  reference: string;
  createdAt: string;
}

const DashboardPage = () => {
  const { data: session } = useSession();
  const [themeOfTheWeek, setThemeOfTheWeek] = useState<ThemeOfTheWeek | null>(null);
  const {
    profile,
    upcomingEvents,
    recentSermons,
    givingHistory,
    bibleStudyProgress,
    prayerRequests,
    counselingSessions, // Added
    newVolunteeringOpportunitiesCount, // Added
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
            setThemeOfTheWeek(data[0]); // Get the most recent theme
          }
        }
      } catch (error) {
        console.error("Failed to fetch theme of the week:", error);
      }
    };

    fetchThemeOfTheWeek();
  }, [session, fetchDashboardData]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center justify-center space-y-6 h-[60vh]">
            <Icons.spinner className="h-12 w-12 animate-spin text-blue-600" />
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold text-slate-800">Loading your spiritual journey</h1>
              <p className="text-lg text-slate-600">Gathering your personalized dashboard...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white p-8 rounded-xl shadow-sm max-w-2xl mx-auto">
            <div className="text-center space-y-6">
              <div className="inline-flex items-center justify-center bg-red-100 p-4 rounded-full">
                <Icons.warning className="h-8 w-8 text-red-600" />
              </div>
              <h1 className="text-2xl font-bold text-slate-800">Something went wrong</h1>
              <p className="text-slate-600">{error}</p>
              <Button className="bg-blue-600 hover:bg-blue-700">Try Again</Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-6 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        <div className="space-y-4">
          {themeOfTheWeek && (
            <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-4 sm:p-6 rounded-xl shadow-lg overflow-hidden mb-6 sm:mb-8">
              <div className="absolute -top-2 -right-2 h-16 w-16 bg-white bg-opacity-10 rounded-full transform rotate-45"></div>
              <div className="absolute -bottom-4 -left-4 h-24 w-24 bg-white bg-opacity-10 rounded-full transform -rotate-30"></div>
              <div className="relative z-10 text-center">
                <h2 className="text-xs sm:text-sm font-bold uppercase opacity-80 mb-1">Theme of the Week</h2>
                <h3 className="text-2xl sm:text-3xl font-extrabold mb-2 leading-tight">{themeOfTheWeek.title}</h3>
                <p className="text-base sm:text-lg font-medium mb-3 italic">"{themeOfTheWeek.verse}"</p>
                <p className="text-xs sm:text-sm opacity-90">{themeOfTheWeek.reference}</p>
              </div>
            </div>
          )}
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 tracking-tight">
            Spiritual Dashboard
          </h1>
          <p className="text-lg sm:text-xl text-slate-600">
            Welcome back, 
            <span className="text-blue-600 font-semibold">
              {profile?.name || "Beloved"}
            </span>
            . May your day be blessed.
          </p>
          {newVolunteeringOpportunitiesCount > 0 && (
            <Link href="/volunteering" className="block mt-4">
              <div className="bg-yellow-100 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg flex items-center justify-between shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <Icons.bell className="h-6 w-6 text-yellow-600" />
                  <p className="font-medium text-sm sm:text-base">
                    New Volunteering Opportunities!
                  </p>
                </div>
                <span className="bg-yellow-600 text-white text-xs sm:text-sm font-bold px-2 sm:px-3 py-1 rounded-full">
                  {newVolunteeringOpportunitiesCount}
                </span>
              </div>
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Profile Card */}
          <Card className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-md transition-all">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-slate-50 border-b border-slate-100">
              <div className="flex items-center space-x-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <Icons.user className="h-5 w-5 text-blue-600" />
                </div>
                <CardTitle className="text-lg font-semibold text-slate-800">Your Profile</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              {profile ? (
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Icons.userCircle className="h-5 w-5 text-slate-400" />
                    <span className="text-slate-700 text-sm sm:text-base">{profile.name}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Icons.mail className="h-5 w-5 text-slate-400" />
                    <span className="text-slate-700 text-sm sm:text-base break-all">{profile.email}</span>
                  </div>
                </div>
              ) : (
                <p className="text-slate-400 italic">No profile data available</p>
              )}
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-md transition-all">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-slate-50 border-b border-slate-100">
              <div className="flex items-center space-x-4">
                <div className="bg-purple-100 p-3 rounded-full">
                  <Icons.calendar className="h-5 w-5 text-purple-600" />
                </div>
                <CardTitle className="text-lg font-semibold text-slate-800">Upcoming Events</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              {upcomingEvents.length > 0 ? (
                <ul className="space-y-4">
                  {upcomingEvents.map((event) => (
                    <li key={event.id} className="flex items-start space-x-3">
                      <div className="bg-purple-50 p-2 rounded-lg">
                        <div className="text-center w-12">
                          <div className="text-xs sm:text-sm font-medium text-purple-800">
                            {new Date(event.date).toLocaleDateString("en-US", {
                              month: "short",
                            })}
                          </div>
                          <div className="text-lg sm:text-xl font-bold text-purple-600">{new Date(event.date).getDate()}</div>
                        </div>
                      </div>
                      <div className="pt-1">
                        <h3 className="font-medium text-slate-800 text-sm sm:text-base">{event.title}</h3>
                        <p className="text-xs sm:text-sm text-slate-500">{event.location || "Church Venue"}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 space-y-2">
                  <Icons.calendarOff className="h-8 w-8 text-slate-300" />
                  <p className="text-slate-400">No upcoming events</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Sermons */}
          <Card className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-md transition-all">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-slate-50 border-b border-slate-100">
              <div className="flex items-center space-x-4">
                <div className="bg-amber-100 p-3 rounded-full">
                  <Icons.audioLines className="h-5 w-5 text-amber-600" />
                </div>
                <CardTitle className="text-lg font-semibold text-slate-800">Recent Sermons</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              {recentSermons.length > 0 ? (
                <ul className="space-y-2">
                  {recentSermons.map((sermon) => (
                    <li key={sermon.id} className="group">
                      <div className="flex items-center space-x-3 p-2 rounded-lg group-hover:bg-slate-50 transition-colors">
                        <div className="bg-amber-50 p-2 rounded-lg">
                          <Icons.playCircle className="h-5 w-5 text-amber-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-slate-800 truncate text-sm sm:text-base">{sermon.title}</h3>
                          <p className="text-xs sm:text-sm text-slate-500">
                            {sermon.speaker?.name || "Pastor"} • {new Date(sermon.date).toLocaleDateString()}
                          </p>
                        </div>
                        <Button variant="ghost" size="sm" className="text-blue-600 px-2">
                          Listen
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 space-y-2">
                  <Icons.audioLinesOff className="h-8 w-8 text-slate-300" />
                  <p className="text-slate-400">No recent sermons</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Giving History */}
          <Card className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-md transition-all">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-slate-50 border-b border-slate-100">
              <div className="flex items-center space-x-4">
                <div className="bg-emerald-100 p-3 rounded-full">
                  <Icons.handCoins className="h-5 w-5 text-emerald-600" />
                </div>
                <CardTitle className="text-lg font-semibold text-slate-800">Giving History</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              {givingHistory.length > 0 ? (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <h3 className="font-medium text-slate-800 mb-2 sm:mb-0">Recent Contributions</h3>
                    <span className="text-sm font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
                      Total: ${givingHistory.reduce((sum, item) => sum + item.amount, 0).toFixed(2)}
                    </span>
                  </div>
                  <ul className="space-y-3">
                    {givingHistory.slice(0, 3).map((transaction) => (
                      <li key={transaction.id} className="flex justify-between items-center text-sm sm:text-base">
                        <div>
                          <p className="font-medium text-slate-800">
                            {transaction.description || "General Donation"}
                          </p>
                          <p className="text-xs sm:text-sm text-slate-500">{new Date(transaction.date).toLocaleDateString()}</p>
                        </div>
                        <span className="font-semibold text-emerald-600">${transaction.amount.toFixed(2)}</span>
                      </li>
                    ))}
                  </ul>
                  {givingHistory.length > 3 && (
                    <Button variant="ghost" className="w-full text-blue-600">
                      View All
                    </Button>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 space-y-2">
                  <Icons.piggyBank className="h-8 w-8 text-slate-300" />
                  <p className="text-slate-400">No giving history yet</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Bible Study Progress */}
          <Card className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-md transition-all">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-slate-50 border-b border-slate-100">
              <div className="flex items-center space-x-4">
                <div className="bg-indigo-100 p-3 rounded-full">
                  <Icons.bookOpen className="h-5 w-5 text-indigo-600" />
                </div>
                <CardTitle className="text-lg font-semibold text-slate-800">Bible Study</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              {bibleStudyProgress ? (
                <div className="space-y-4">
                  <h3 className="font-medium text-slate-800">{bibleStudyProgress.title}</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-slate-600">
                      <span>Progress</span>
                      <span>{bibleStudyProgress.progress || 0}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-indigo-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                        style={{
                          width: `${bibleStudyProgress.progress || 0}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                  <Button className="w-full bg-indigo-600 hover:bg-indigo-700">Continue Study</Button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 space-y-4">
                  <Icons.bookOpenCheck className="h-8 w-8 text-slate-300" />
                  <p className="text-slate-400">No active study</p>
                  <Button className="bg-indigo-600 hover:bg-indigo-700">Start a Study</Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Prayer Requests */}
          <Card className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-md transition-all">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-slate-50 border-b border-slate-100">
              <div className="flex items-center space-x-4">
                <div className="bg-pink-100 p-3 rounded-full">
                  <Icons.pray className="h-5 w-5 text-pink-600" />
                </div>
                <CardTitle className="text-lg font-semibold text-slate-800">Prayer Requests</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              {prayerRequests.length > 0 ? (
                <div className="space-y-4">
                  <ul className="space-y-3">
                    {prayerRequests.slice(0, 2).map((request) => (
                      <li key={request.id} className="p-3 rounded-lg bg-slate-50">
                        <div className="flex items-start space-x-3">
                          {request.isUrgent ? (
                            <Icons.alertTriangle className="h-5 w-5 text-pink-500 flex-shrink-0 mt-1" />
                          ) : (
                            <Icons.pray className="h-5 w-5 text-blue-500 flex-shrink-0 mt-1" />
                          )}
                          <p className="text-slate-700 text-sm sm:text-base">{request.request}</p>
                        </div>
                        {request.isUrgent && (
                          <div className="mt-2 text-xs font-medium text-pink-600">Urgent Prayer</div>
                        )}
                      </li>
                    ))}
                  </ul>
                  {prayerRequests.length > 2 && (
                    <Button variant="ghost" className="w-full text-blue-600">
                      View All ({prayerRequests.length})
                    </Button>
                  )}
                  <Link href="/prayer-wall">
                    <Button className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white">
                      <Icons.plus className="h-4 w-4 mr-2" />
                      New Prayer Request
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 space-y-4">
                  <Icons.pray className="h-8 w-8 text-slate-300" />
                  <p className="text-slate-400">No prayer requests</p>
                  <Link href="/prayer-wall">
                    <Button className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white">
                      <Icons.plus className="h-4 w-4 mr-2" />
                      Submit Request
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Counseling Sessions */}
          <Card className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-md transition-all">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-slate-50 border-b border-slate-100">
              <div className="flex items-center space-x-4">
                <div className="bg-teal-100 p-3 rounded-full">
                  <Icons.messageSquare className="h-5 w-5 text-teal-600" />
                </div>
                <CardTitle className="text-lg font-semibold text-slate-800">Counseling</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              {counselingSessions.length > 0 ? (
                <ul className="space-y-4">
                  {counselingSessions.slice(0,1).map((session) => (
                    <li key={session.id} className="flex items-start space-x-3">
                      <div className="bg-teal-50 p-2 rounded-lg mt-1">
                        <Icons.messageSquare className="h-5 w-5 text-teal-500" />
                      </div>
                      <div>
                        <h3 className="font-medium text-slate-800 text-sm sm:text-base">Topic: {session.topic?.name || "N/A"}</h3>
                        <p className="text-xs sm:text-sm text-slate-500">
                          Status: {session.status}
                        </p>
                        {session.counselor && (
                          <p className="text-xs sm:text-sm text-slate-500">
                            With: {session.counselor.name || "Unassigned"}
                          </p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 space-y-2">
                  <Icons.messageSquareOff className="h-8 w-8 text-slate-300" />
                  <p className="text-slate-400 text-center text-sm">No active counseling sessions.</p>
                </div>
              )}
              <div className="mt-4">
                <Link href="/counseling-request" passHref>
                  <Button className="w-full bg-teal-600 hover:bg-teal-700">Request a Session</Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Baptism Application Status Card */}
          <Card className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-md transition-all">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-slate-50 border-b border-slate-100">
              <div className="flex items-center space-x-4">
                <div className="bg-sky-100 p-3 rounded-full">
                  <Icons.droplet className="h-5 w-5 text-sky-600" />
                </div>
                <CardTitle className="text-lg font-semibold text-slate-800">Baptism Status</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              {profile?.baptismApplicationStatus ? (
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Icons.checkCircle className="h-5 w-5 text-sky-500" />
                    <span className="text-slate-700 font-medium text-sm sm:text-base">Status: {profile.baptismApplicationStatus}</span>
                  </div>
                  {profile.baptismDate && (
                    <div className="flex items-center space-x-3">
                      <Icons.calendar className="h-5 w-5 text-slate-400" />
                      <span className="text-slate-700 text-sm sm:text-base">
                        Date: {new Date(profile.baptismDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  <p className="text-xs sm:text-sm text-slate-500 pt-2">
                    {profile.baptismApplicationStatus === "PENDING" && "Your application is under review. We will contact you soon."}
                    {profile.baptismApplicationStatus === "APPROVED" && "Congratulations! Your application has been approved."}
                    {profile.baptismApplicationStatus === "SCHEDULED" && "Your baptism is scheduled. Please check your email for details."}
                    {profile.baptismApplicationStatus === "COMPLETED" && "Praise God! Your baptism has been completed."}
                    {profile.baptismApplicationStatus === "REJECTED" && <span className="text-red-500">Your application was not approved at this time. Please contact us for more information.</span>}
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 space-y-4">
                  <Icons.dropletOff className="h-8 w-8 text-slate-300" />
                  <p className="text-slate-400 text-sm">No application found.</p>
                  <Link href="/baptism-application" passHref>
                    <Button className="w-full bg-sky-600 hover:bg-sky-700">Apply for Baptism</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
