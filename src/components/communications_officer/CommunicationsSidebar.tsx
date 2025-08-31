import { LayoutDashboard, Megaphone, Newspaper } from "lucide-react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { FaUser } from "react-icons/fa";
import { Icons } from "@/components/icons";
import AlertDialog from "@/components/ui/AlertDialog";
import { useState } from "react";

interface CommunicationsSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const CommunicationsSidebar = ({
  isOpen,
  onClose,
}: CommunicationsSidebarProps) => {
  const { data: session } = useSession();
  const userRoles = session?.user?.roles || [];
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleLogout = () => {
    signOut();
  };

  return (
    <>
      <div
        className={`fixed inset-0 z-20 bg-black bg-opacity-50 transition-opacity lg:hidden ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      ></div>

      <div
        className={`fixed top-0 left-0 z-30 h-full w-64 bg-sky-800 text-white transform transition-transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:relative lg:translate-x-0 lg:w-64 flex-shrink-0 flex flex-col`}
      >
        <div className="p-4">
          <h2 className="text-2xl font-bold">Communications</h2>
        </div>
        <nav className="mt-4 flex-grow">
          <ul>
            <li>
              <Link
                href="/communications_officer/communications-officer"
                className="flex items-center p-4 hover:bg-sky-700"
                onClick={onClose}
              >
                <LayoutDashboard className="mr-3" />
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                href="/communications_officer/communications-officer/create-blog-post"
                className="flex items-center p-4 hover:bg-sky-700"
                onClick={onClose}
              >
                <Newspaper className="mr-3" />
                Create Blog Post
              </Link>
            </li>
            <li>
              <Link
                href="/communications_officer/admin/newsletter"
                className="flex items-center p-4 hover:bg-sky-700"
                onClick={onClose}
              >
                <Megaphone className="mr-3" />
                Newsletter
              </Link>
            </li>
          </ul>
        </nav>
        <div className="p-4 border-t border-sky-700">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full bg-sky-700 flex items-center justify-center border-2 border-sky-600 overflow-hidden flex-shrink-0">
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

export default CommunicationsSidebar;
