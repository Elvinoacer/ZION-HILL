import { LayoutDashboard, Megaphone, Newspaper } from "lucide-react";
import Link from "next/link";

interface CommunicationsSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const CommunicationsSidebar = ({
  isOpen,
  onClose,
}: CommunicationsSidebarProps) => {
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
        } lg:relative lg:translate-x-0 lg:w-64 flex-shrink-0`}
      >
        <div className="p-4">
          <h2 className="text-2xl font-bold">Communications</h2>
        </div>
        <nav className="mt-4">
          <ul>
            <li>
              <Link
                href="/communications-officer"
                className="flex items-center p-4 hover:bg-sky-700"
                onClick={onClose}
              >
                <Newspaper className="mr-3" />
                Blog
              </Link>
            </li>
            <li>
              <Link
                href="/admin/newsletter"
                className="flex items-center p-4 hover:bg-sky-700"
                onClick={onClose}
              >
                <Megaphone className="mr-3" />
                Newsletter
              </Link>
            </li>
            <li>
              <Link
                href="/BrandEngagementHubDashboard"
                className="flex items-center p-4 hover:bg-sky-700"
                onClick={onClose}
              >
                <LayoutDashboard className="mr-3" />
                (Future Dash)
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
};

export default CommunicationsSidebar;
