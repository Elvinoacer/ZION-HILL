"use client";

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
import { AnimatePresence, motion } from "framer-motion";
import {
  Award,
  Calendar,
  ChevronLeft,
  Church,
  Clock,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Share,
  Star,
  UserCheck,
  Users,
} from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface MemberProfile {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  image?: string;
  membersince?: string;
  location?: string;
  bio?: string;
  ministryMemberships: Array<{
    ministry: {
      id: string;
      name: string;
      description?: string;
    };
  }>;
  skills?: string[];
  achievements?: Array<{
    id: string;
    title: string;
    description?: string;
    date: string;
  }>;
}

const PublicMemberProfilePage = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState<MemberProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("about");

  useEffect(() => {
    if (id) {
      const fetchProfile = async () => {
        setLoading(true);
        try {
          const response = await fetch(`/api/members/${id}`);
          if (!response.ok) {
            throw new Error("Failed to fetch member profile.");
          }
          const data = await response.json();
          setProfile(data);
        } catch (err: any) {
          setError(err.message);
          toast.error(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchProfile();
    }
  }, [id]);

  const handleShareProfile = () => {
    if (navigator.share) {
      navigator
        .share({
          title: `${profile?.name}'s Profile`,
          text: `Check out ${profile?.name}'s profile on our church community`,
          url: window.location.href,
        })
        .catch(() => {
          navigator.clipboard.writeText(window.location.href);
          toast.success("Profile link copied to clipboard!");
        });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Profile link copied to clipboard!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="mb-6"
            >
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full"></div>
            </motion.div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Loading Member Profile
            </h1>
            <p className="text-gray-600">
              We're gathering the member information...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
            <div className="bg-red-100 p-4 rounded-full mb-6">
              <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Error Loading Profile
            </h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <Button
              onClick={() => window.location.reload()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
            <div className="bg-gray-100 p-4 rounded-full mb-6">
              <div className="w-12 h-12 bg-gray-400 rounded-full flex items-center justify-center">
                <UserCheck className="w-6 h-6 text-white" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Member Not Found
            </h1>
            <p className="text-gray-600">
              The member profile you're looking for doesn't exist or may have
              been moved.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <Button
            variant="ghost"
            onClick={() => window.history.back()}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </motion.div>

        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Card className="border-0 shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                <Avatar className="w-24 h-24 md:w-32 md:h-32 border-4 border-white/20 shadow-xl">
                  <AvatarImage
                    src={profile.image || "/images/default-avatar.png"}
                    alt={profile.name}
                  />
                  <AvatarFallback className="text-2xl font-bold bg-blue-500">
                    {profile.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-2xl md:text-3xl font-bold mb-2">
                    {profile.name}
                  </h1>

                  <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-4">
                    {profile.location && (
                      <div className="flex items-center text-blue-100">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>{profile.location}</span>
                      </div>
                    )}

                    {profile.membersince && (
                      <div className="flex items-center text-blue-100">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>
                          Member since{" "}
                          {new Date(profile.membersince).getFullYear()}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap justify-center md:justify-start gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={handleShareProfile}
                      className="bg-white/10 hover:bg-white/20 text-white border-0"
                    >
                      <Share className="h-4 w-4 mr-2" />
                      Share Profile
                    </Button>

                    <Button
                      variant="secondary"
                      size="sm"
                      className="bg-white/10 hover:bg-white/20 text-white border-0"
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Send Message
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-6"
        >
          <div className="flex space-x-1 bg-white rounded-lg p-1 shadow-sm border border-gray-200">
            {[
              {
                id: "about",
                label: "About",
                icon: <UserCheck className="h-4 w-4" />,
              },
              {
                id: "ministries",
                label: "Ministries",
                icon: <Church className="h-4 w-4" />,
              },
              {
                id: "skills",
                label: "Skills",
                icon: <Star className="h-4 w-4" />,
              },
              {
                id: "achievements",
                label: "Achievements",
                icon: <Award className="h-4 w-4" />,
              },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <AnimatePresence mode="wait">
            {activeTab === "about" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <UserCheck className="h-5 w-5 mr-2 text-blue-600" />
                      About
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {profile.bio ? (
                      <p className="text-gray-700 leading-relaxed">
                        {profile.bio}
                      </p>
                    ) : (
                      <p className="text-gray-500 italic">
                        No bio information available.
                      </p>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {profile.email && (
                        <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                          <Mail className="h-5 w-5 text-gray-500 mr-3" />
                          <div>
                            <p className="text-sm text-gray-600">Email</p>
                            <p className="font-medium">{profile.email}</p>
                          </div>
                        </div>
                      )}

                      {profile.phone && (
                        <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                          <Phone className="h-5 w-5 text-gray-500 mr-3" />
                          <div>
                            <p className="text-sm text-gray-600">Phone</p>
                            <p className="font-medium">{profile.phone}</p>
                          </div>
                        </div>
                      )}

                      {profile.membersince && (
                        <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                          <Clock className="h-5 w-5 text-gray-500 mr-3" />
                          <div>
                            <p className="text-sm text-gray-600">
                              Member Since
                            </p>
                            <p className="font-medium">
                              {new Date(profile.membersince).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                }
                              )}
                            </p>
                          </div>
                        </div>
                      )}

                      {profile.location && (
                        <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                          <MapPin className="h-5 w-5 text-gray-500 mr-3" />
                          <div>
                            <p className="text-sm text-gray-600">Location</p>
                            <p className="font-medium">{profile.location}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {activeTab === "ministries" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Church className="h-5 w-5 mr-2 text-blue-600" />
                      Ministry Involvement
                    </CardTitle>
                    <CardDescription>
                      Ministries and groups this member is involved with
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {profile.ministryMemberships.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {profile.ministryMemberships.map(
                          (membership, index) => (
                            <div
                              key={index}
                              className="p-4 bg-blue-50 rounded-lg border border-blue-100"
                            >
                              <div className="flex items-center mb-2">
                                <Users className="h-5 w-5 text-blue-600 mr-2" />
                                <h3 className="font-semibold text-blue-800">
                                  {membership.ministry.name}
                                </h3>
                              </div>
                              {membership.ministry.description && (
                                <p className="text-sm text-blue-700">
                                  {membership.ministry.description}
                                </p>
                              )}
                            </div>
                          )
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Church className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">
                          Not currently involved in any ministries.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {activeTab === "skills" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Star className="h-5 w-5 mr-2 text-blue-600" />
                      Skills & Talents
                    </CardTitle>
                    <CardDescription>
                      Areas of expertise and special talents
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {profile.skills && profile.skills.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {profile.skills.map((skill, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="px-3 py-1 bg-blue-100 text-blue-800 hover:bg-blue-200"
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">
                          No skills information available.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {activeTab === "achievements" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Award className="h-5 w-5 mr-2 text-blue-600" />
                      Achievements & Recognition
                    </CardTitle>
                    <CardDescription>
                      Notable accomplishments and recognition within the church
                      community
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {profile.achievements && profile.achievements.length > 0 ? (
                      <div className="space-y-4">
                        {profile.achievements.map((achievement) => (
                          <div
                            key={achievement.id}
                            className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100"
                          >
                            <div className="flex items-start">
                              <Award className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                              <div className="flex-1">
                                <h3 className="font-semibold text-blue-800">
                                  {achievement.title}
                                </h3>
                                {achievement.description && (
                                  <p className="text-sm text-blue-700 mt-1">
                                    {achievement.description}
                                  </p>
                                )}
                                <p className="text-xs text-blue-600 mt-2">
                                  {new Date(
                                    achievement.date
                                  ).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  })}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">
                          No achievements recorded yet.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Privacy Notice */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8 text-center"
        >
          <p className="text-sm text-gray-500">
            This is a public profile. For privacy reasons, some information may
            not be displayed.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default PublicMemberProfilePage;
