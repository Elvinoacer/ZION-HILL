
// components/UserProfile.tsx
import { motion } from "framer-motion";
import { Edit, Mail, Phone, MapPin, Calendar, Users } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useUserStore } from "@/store"; // Import the user store
import { useSession } from "next-auth/react";

export default function UserProfile() {
  const { currentUser, loading, error, fetchCurrentUser, updateUserProfile } =
    useUserStore();
    const {data:session}= useSession()
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    birthdate: "",
    membersince: "",
    photo: "",
  });
  const userId= session?.user.id||""
  
  // Placeholder for userId - in a real app, this would come from auth context


  useEffect(() => {
    fetchCurrentUser(userId);
  }, [fetchCurrentUser, userId]);

  useEffect(() => {
    if (currentUser) {
      setProfileData({
        name: currentUser.name || "",
        membersince: currentUser.membersince || "",
        email: currentUser.email || "",
        phone: currentUser.phone || "",
        address: currentUser.address || "",
        birthdate: currentUser.birthdate
          ? new Date(currentUser.birthdate).toISOString().split("T")[0]
          : "",
        photo: currentUser.photo || "/images/default-avatar.png", // Use a placeholder if no photo
      });
    }
  }, [currentUser]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    await updateUserProfile(userId, profileData);
    setIsEditing(false);
  };

  if (loading)
    return <div className="text-center py-8">Loading profile...</div>;
  if (error)
    return <div className="text-center py-8 text-red-500">Error: {error}</div>;
  if (!currentUser)
    return <div className="text-center py-8">No user data found.</div>;

  return (
    <motion.div
      className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="flex justify-between items-start mb-6">
        <h3 className="text-xl font-bold text-gray-800">My Profile</h3>
        {isEditing ? (
          <button
            onClick={handleSave}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Save Changes
          </button>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors font-medium"
          >
            <Edit className="mr-2 h-4 w-4" /> Edit Profile
          </button>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-shrink-0 flex flex-col items-center">
          <div className="relative w-32 h-32 mb-4">
            <Image
              src={profileData.photo || "/images/default-avatar.png"}
              alt={profileData?.name}
              width={128}
              height={128}
              className="rounded-full object-cover border-4 border-blue-100"
              priority
            />
            {isEditing && (
              <button className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md hover:bg-gray-500 transition-colors">
                <Edit className="h-4 w-4 text-blue-600" />
              </button>
            )}
          </div>
          <h4 className="text-lg font-medium text-center text-gray-800">
            {profileData.name}
          </h4>
        </div>

        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Full Name
            </label>
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={profileData.name}
                onChange={handleChange}
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            ) : (
              <div className="p-2.5 rounded-lg bg-gray-50 text-gray-800">
                {profileData.name}
              </div>
            )}
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-600 mb-1 flex items-center">
              <Mail className="mr-2 h-4 w-4 text-gray-500" /> Email
            </label>
            {isEditing ? (
              <input
                type="email"
                name="email"
                value={profileData.email}
                onChange={handleChange}
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            ) : (
              <div className="p-2.5 rounded-lg bg-gray-50 text-gray-800">
                {profileData.email}
              </div>
            )}
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-600 mb-1 flex items-center">
              <Phone className="mr-2 h-4 w-4 text-gray-500" /> Phone
            </label>
            {isEditing ? (
              <input
                type="tel"
                name="phone"
                value={profileData.phone}
                onChange={handleChange}
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            ) : (
              <div className="p-2.5 rounded-lg bg-gray-50 text-gray-800">
                {profileData.phone}
              </div>
            )}
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-600 mb-1 flex items-center">
              <MapPin className="mr-2 h-4 w-4 text-gray-500" /> Address
            </label>
            {isEditing ? (
              <input
                type="text"
                name="address"
                value={profileData.address}
                onChange={handleChange}
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            ) : (
              <div className="p-2.5 rounded-lg bg-gray-50 text-gray-800">
                {profileData.address}
              </div>
            )}
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-600 mb-1 flex items-center">
              <Calendar className="mr-2 h-4 w-4 text-gray-500" /> Birthdate
            </label>
            {isEditing ? (
              <input
                type="date"
                name="birthdate"
                value={profileData.birthdate}
                onChange={handleChange}
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            ) : (
              <div className="p-2.5 rounded-lg bg-gray-50 text-gray-800">
                {profileData.birthdate
                  ? new Date(profileData.birthdate).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )
                  : "N/A"}
              </div>
            )}
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-600 mb-1 flex items-center">
              <Users className="mr-2 h-4 w-4 text-gray-500" /> Member Since
            </label>
            <input
              value={profileData.membersince}
              onChange={(e) =>
                setProfileData((prev) => ({
                  ...prev,
                  membersince: e.target.value,
                }))
              }
              type="date"
              className="p-2.5 rounded-lg bg-gray-50 text-gray-800"
            />
            {currentUser.membersince
              ? new Date(currentUser.membersince).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
              : "N/A"}
            {/* </input> */}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
