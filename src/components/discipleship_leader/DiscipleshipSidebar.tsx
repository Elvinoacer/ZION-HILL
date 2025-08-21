import Link from "next/link";
import { LayoutDashboard, BookOpen, PlusCircle, Sun, Moon } from "lucide-react";

interface DiscipleshipSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const DiscipleshipSidebar = ({ isOpen, onClose }: DiscipleshipSidebarProps) => {
  return (
    <>
      <div
        className={`fixed inset-0 z-20 bg-black bg-opacity-50 transition-opacity lg:hidden ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      ></div>

      <div
        className={`fixed top-0 left-0 z-30 h-full w-64 bg-emerald-800 text-white transform transition-transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:relative lg:translate-x-0 lg:w-64 flex-shrink-0`}
      >
        <div className="p-4">
          <h2 className="text-2xl font-bold">Discipleship</h2>
        </div>
        <nav className="mt-4">
          <ul>
            <li>
              <Link
                href="/admin"
                className="flex items-center p-4 hover:bg-emerald-700"
                onClick={onClose}
              >
                <BookOpen className="mr-3" />
                Courses
              </Link>
            </li>
            <li>
              <Link
                href="/admin/new"
                className="flex items-center p-4 hover:bg-emerald-700"
                onClick={onClose}
              >
                <PlusCircle className="mr-3" />
                New Course
              </Link>
            </li>
            <li>
              <Link
                href="/courses/discipleship/theme-of-the-week/manage"
                className="flex items-center p-4 hover:bg-emerald-700"
                onClick={onClose}
              >
                <Sun className="mr-3" />
                Manage Theme
              </Link>
            </li>
            <li>
              <Link
                href="/courses/discipleship/theme-of-the-week/create"
                className="flex items-center p-4 hover:bg-emerald-700"
                onClick={onClose}
              >
                <Moon className="mr-3" />
                New Theme
              </Link>
            </li>
            <li>
              <Link
                href="/discipleship-leader"
                className="flex items-center p-4 hover:bg-emerald-700"
                onClick={onClose}
              >
                <LayoutDashboard className="mr-3" />
                Discipleship Leader Dashboard
              </Link>
            </li>
            <li>
              <Link
                href="/DiscipleshipHubDashboard"
                className="flex items-center p-4 hover:bg-emerald-700"
                onClick={onClose}
              >
                <LayoutDashboard className="mr-3" />
                (Future Dashboard)
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
};

export default DiscipleshipSidebar;
