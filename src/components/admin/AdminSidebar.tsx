import Link from "next/link";
import { Home, BookOpen, Users, Film, FolderKanban } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { FaUser } from "react-icons/fa";
import { Icons } from "@/components/icons";
import AlertDialog from "@/components/ui/AlertDialog";
import { useState } from "react";

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdminSidebar = ({ isOpen, onClose }: AdminSidebarProps) => {
  const { data: session } = useSession();
  const userRoles = session?.user?.roles || [];
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleLogout = () => {
    signOut();
  };

  return (
    <>
      {/* Overlay for mobile */}
      <div
        className={`fixed inset-0 z-20 bg-black bg-opacity-50 transition-opacity lg:hidden ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      ></div>

      <div
        className={`fixed top-0 left-0 z-30 h-full w-64 bg-gray-800 text-white transform transition-transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:relative lg:translate-x-0 lg:w-64 flex-shrink-0 flex flex-col`}
      >
        <div className="p-4">
          <h2 className="text-2xl font-bold">Admin Panel</h2>
        </div>
        <nav className="mt-4 flex-grow">
          <ul>
            <li>
              <Link
                href="/admin/projects"
                className="flex items-center p-4 hover:bg-gray-700"
                onClick={onClose}
              >
                <FolderKanban className="mr-3" />
                Projects
              </Link>
            </li>

            <li>
              <Link
                href="/admin/devotionals"
                className="flex items-center p-4 hover:bg-gray-700"
                onClick={onClose}
              >
                <BookOpen className="mr-3" />
                Devotionals
              </Link>
            </li>
            <li>
              <Link
                href="/admin/media"
                className="flex items-center p-4 hover:bg-gray-700"
                onClick={onClose}
              >
                <Film className="mr-3" />
                Media
              </Link>
            </li>
            <li>
              <Link
                href="/admin/institutions"
                className="flex items-center p-4 hover:bg-gray-700"
                onClick={onClose}
              >
                <Users className="mr-3" />
                Institutions
              </Link>
            </li>
          </ul>
        </nav>
        <div className="p-4 border-t border-gray-700">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center border-2 border-gray-600 overflow-hidden flex-shrink-0">
              {session?.user?.photo ? (
                <img
                  src={session.user.photo}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <FaUser className="text-gray-400 text-4xl" />
              )}
            </div>
            <div className="ml-3 flex-1">
              <div className="font-semibold text-white truncate">
                {session?.user?.name || "Guest"}
              </div>
              <div className="text-xs text-gray-400 capitalize truncate">
                {userRoles.map((role) => role.replace(/_/g, " ")).join(", ") ||
                  "Public User"}
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsLogoutModalOpen(true)}
            className="w-full flex items-center justify-center mt-4 p-2 rounded-lg bg-red-600/10 text-red-500 hover:bg-red-600/20 hover:text-red-400 transition-all"
          >
            <Icons.logout className="mr-2 h-4 w-4" />
            <span>Log Out</span>
          </button>
        </div>
      </div>
      <AlertDialog
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
        title="Are you sure you want to log out?"
        description="You will be returned to the login page."
      />
    </>
  );
};

export default AdminSidebar;
