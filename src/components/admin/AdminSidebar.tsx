import Link from "next/link";
import { Home, BookOpen, Users, Film, FolderKanban } from "lucide-react";

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdminSidebar = ({ isOpen, onClose }: AdminSidebarProps) => {
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
        } lg:relative lg:translate-x-0 lg:w-64 flex-shrink-0`}
      >
        <div className="p-4">
          <h2 className="text-2xl font-bold">Admin Panel</h2>
        </div>
        <nav className="mt-4">
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
                href="/admin/kids-teens-resources"
                className="flex items-center p-4 hover:bg-gray-700"
                onClick={onClose}
              >
                <Users className="mr-3" />
                Kids & Teens
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
                href="/AdminCommandCenterDashboard"
                className="flex items-center p-4 hover:bg-gray-700"
                onClick={onClose}
              >
                <Home className="mr-3" />
                (Future Dashboard)
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
};

export default AdminSidebar;
