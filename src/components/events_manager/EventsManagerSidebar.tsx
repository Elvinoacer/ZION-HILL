import Link from "next/link";
import { LayoutDashboard, Calendar, Inbox, Home } from "lucide-react";

interface EventsManagerSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const EventsManagerSidebar = ({
  isOpen,
  onClose,
}: EventsManagerSidebarProps) => {
  return (
    <>
      <div
        className={`fixed inset-0 z-20 bg-black bg-opacity-50 transition-opacity lg:hidden ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      ></div>

      <div
        className={`fixed top-0 left-0 z-30 h-full w-64 bg-purple-800 text-white transform transition-transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:relative lg:translate-x-0 lg:w-64 flex-shrink-0`}
      >
        <div className="p-4">
          <h2 className="text-2xl font-bold">Events Manager</h2>
        </div>
        <nav className="mt-4">
          <ul>
            <li>
              <Link
                href="/events-manager"
                className="flex items-center p-4 hover:bg-purple-700"
                onClick={onClose}
              >
                <Home className="mr-3" />
                Overview
              </Link>
            </li>
            <li>
              <Link
                href="/events-manager/dashboard"
                className="flex items-center p-4 hover:bg-purple-700"
                onClick={onClose}
              >
                <LayoutDashboard className="mr-3" />
                Cards Overview
              </Link>
            </li>
            <li>
              <Link
                href="/events-manager/eventdashboard"
                className="flex items-center p-4 hover:bg-purple-700"
                onClick={onClose}
              >
                <Calendar className="mr-3" />
                Event Dashboard
              </Link>
            </li>
            <li>
              <Link
                href="/events-manager/inbox"
                className="flex items-center p-4 hover:bg-purple-700"
                onClick={onClose}
              >
                <Inbox className="mr-3" />
                Inbox
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
};

export default EventsManagerSidebar;
