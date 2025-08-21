import Link from "next/link";
import {
  Calendar,
  DollarSign,
  Home,
  Users,
  Heart,
  BookOpen,
  Settings,
  LayoutDashboard,
  Church,
} from "lucide-react";

interface LeadershipSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const LeadershipSidebar = ({ isOpen, onClose }: LeadershipSidebarProps) => {
  return (
    <>
      <div
        className={`fixed inset-0 z-20 bg-black bg-opacity-50 transition-opacity lg:hidden ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      ></div>

      <div
        className={`fixed top-0 left-0 z-30 h-full w-64 bg-blue-800 text-white transform transition-transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:relative lg:translate-x-0 lg:w-64 flex-shrink-0`}
      >
        <div className="p-4">
          <h2 className="text-2xl font-bold">Leadership</h2>
        </div>
        <nav className="mt-4">
          <ul>
            <li>
              <Link
                href="/admin/events"
                className="flex items-center p-4 hover:bg-blue-700"
                onClick={onClose}
              >
                <Calendar className="mr-3" />
                Events
              </Link>
            </li>
            <li>
              <Link
                href="/financials"
                className="flex items-center p-4 hover:bg-blue-700"
                onClick={onClose}
              >
                <DollarSign className="mr-3" />
                Financials
              </Link>
            </li>
            <li>
              <Link
                href="/admin/institutions"
                className="flex items-center p-4 hover:bg-blue-700"
                onClick={onClose}
              >
                <Church className="mr-3" />
                Institutions
              </Link>
            </li>
            <li>
              <Link
                href="/pastoral-care"
                className="flex items-center p-4 hover:bg-blue-700"
                onClick={onClose}
              >
                <Heart className="mr-3" />
                Pastoral Care
              </Link>
            </li>
            <li>
              <Link
                href="/prayer-requests"
                className="flex items-center p-4 hover:bg-blue-700"
                onClick={onClose}
              >
                <BookOpen className="mr-3" />
                Prayer Requests
              </Link>
            </li>
            <li>
              <Link
                href="/preaching-calendar"
                className="flex items-center p-4 hover:bg-blue-700"
                onClick={onClose}
              >
                <Calendar className="mr-3" />
                Preaching Calendar
              </Link>
            </li>
            <li>
              <Link
                href="/role-management"
                className="flex items-center p-4 hover:bg-blue-700"
                onClick={onClose}
              >
                <Settings className="mr-3" />
                Role Management
              </Link>
            </li>
            <li>
              <Link
                href="/users"
                className="flex items-center p-4 hover:bg-blue-700"
                onClick={onClose}
              >
                <Users className="mr-3" />
                Users
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
};

export default LeadershipSidebar;
