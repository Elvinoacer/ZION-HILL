"use client";
import { Icons } from "@/components/icons";
import { AnimatePresence, motion } from "framer-motion";
import { LayoutDashboardIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaBible,
  FaChurch,
  FaLandmark,
  FaUsers,
  FaUser,
  FaCalendarAlt,
  FaPray,
  FaStar,
  FaPrayingHands,
  FaComment,
  FaVideo,
  FaBookOpen,
  FaChild,
  FaSitemap,
  FaHandshake,
  FaCheckCircle,
  FaUserShield,
  FaUsersCog,
  FaDollarSign,
  FaHandHoldingHeart,
  FaNewspaper,
  FaBuilding,
  FaMusic,
  FaPhotoVideo,
  FaFileInvoiceDollar,
  FaBullhorn,
  FaTimes,
  FaHandHoldingUsd,
} from "react-icons/fa";

const SidebarContent = ({ setSidebarOpen }) => {
  const pathname = usePathname();
  const { data: session } = useSession();
  const userRoles = session?.user?.roles || [];

  const hasRole = (roles: string[]) => {
    return roles.some((role) => userRoles.includes(role));
  };

  const allLeadershipRoles = [
    "ADMIN",
    "WORSHIP_LEADER",
    "MINISTRY_COORDINATOR",
    "OUTREACH_DIRECTOR",
    "DISCIPLESHIP_LEADER",
    "EVENTS_MANAGER",
    "COUNSELING_COORDINATOR",
    "TECH_MEDIA_MANAGER",
    "FINANCE_ADMINISTRATOR",
    "VOLUNTEER_COORDINATOR",
    "SMALL_GROUP_LEADER",
    "CHILDREN_YOUTH_DIRECTOR",
    "SECRETARY",
    "COMMUNICATIONS_OFFICER",
    "MISSION_PASTOR",
    "SENIOR_PASTOR",
  ];

  const memberNavItems = [
    {
      name: "Dashboard",
      icon: <LayoutDashboardIcon />,
      path: "/dashboard",
      requiredRoles: ["MEMBER", ...allLeadershipRoles],
    },
    {
      name: "Profile",
      icon: <FaUser />,
      path: "/member-profile",
      requiredRoles: ["MEMBER", ...allLeadershipRoles],
    },
    {
      name: "Family",
      icon: <FaUsers />,
      path: "/family",
      requiredRoles: ["MEMBER", "ADMIN"],
    },
    {
      name: "Ministry",
      icon: <FaChurch />,
      path: "/ministry",
      requiredRoles: ["MEMBER", "ADMIN", "MINISTRY_COORDINATOR"],
    },
    {
      name: "Events",
      icon: <FaCalendarAlt />,
      path: "/events",
      requiredRoles: ["MEMBER", "ADMIN", "EVENTS_MANAGER"],
    },
    {
      name: "Resources",
      icon: <FaLandmark />,
      path: "/resources",
      requiredRoles: ["MEMBER", "ADMIN", "TECH_MEDIA_MANAGER"],
    },
    {
      name: "Bible Study",
      icon: <FaBible />,
      path: "/bible-study",
      requiredRoles: ["MEMBER", "ADMIN", "DISCIPLESHIP_LEADER"],
    },
    {
      name: "Prayer Requests",
      icon: <FaPray />,
      path: "/prayer-requests",
      requiredRoles: ["MEMBER", "ADMIN", "COUNSELING_COORDINATOR"],
    },
    {
      name: "Testimonials",
      icon: <FaStar />,
      path: "/testimonials",
      requiredRoles: ["MEMBER", "ADMIN"],
    },
    {
      name: "Financial Support",
      icon: <FaHandHoldingUsd />,
      path: "/member-financial-support",
      requiredRoles: ["MEMBER", ...allLeadershipRoles],
    },
    {
      name: "Prayer Wall",
      icon: <FaPrayingHands />,
      path: "/prayer-wall",
      requiredRoles: ["MEMBER", "ADMIN"],
    },
    {
      name: "Discussion Forums",
      icon: <FaComment />,
      path: "/discussion-forums",
      requiredRoles: ["MEMBER", "ADMIN"],
    },
    {
      name: "Livestream",
      icon: <FaVideo />,
      path: "/livestream-integration",
      requiredRoles: ["MEMBER", "ADMIN", "TECH_MEDIA_MANAGER"],
    },
    {
      name: "Bible Reading Plans",
      icon: <FaBookOpen />,
      path: "/bible-reading-plans",
      requiredRoles: ["MEMBER", "ADMIN", "DISCIPLESHIP_LEADER"],
    },
    {
      name: "Kids & Teens",
      icon: <FaChild />,
      path: "/kids-teens-resources",
      requiredRoles: ["MEMBER", "ADMIN", "CHILDREN_YOUTH_DIRECTOR"],
    },
    {
      name: "Family Life",
      icon: <FaSitemap />,
      path: "/family-life",
      requiredRoles: ["MEMBER", "ADMIN"],
    },
    {
      name: "Volunteering",
      icon: <FaHandshake />,
      path: "/volunteering",
      requiredRoles: ["MEMBER", "ADMIN"],
    },
    {
      name: "Certificates",
      icon: <FaCheckCircle />,
      path: "/certificates",
      requiredRoles: ["MEMBER", "ADMIN"],
    },
  ];

  const adminNavItems = [
    {
      name: "Admin Dashboard",
      icon: <FaUserShield />,
      path: "/admin/dashboard",
      requiredRoles: ["ADMIN"],
    },
    {
      name: "User Management",
      icon: <FaUsersCog />,
      path: "/admin/users",
      requiredRoles: ["ADMIN"],
    },
    {
      name: "Ministry Management",
      icon: <FaChurch />,
      path: "/admin/ministries",
      requiredRoles: ["ADMIN"],
    },
    {
      name: "Event Management",
      icon: <FaCalendarAlt />,
      path: "/admin/events",
      requiredRoles: ["ADMIN"],
    },
    {
      name: "Financial Management",
      icon: <FaDollarSign />,
      path: "/admin/financials",
      requiredRoles: ["ADMIN"],
    },
    {
      name: "Outreach Management",
      icon: <FaHandshake />,
      path: "/admin/outreach",
      requiredRoles: ["ADMIN"],
    },
    {
      name: "Pastoral Care",
      icon: <FaHandHoldingHeart />,
      path: "/admin/pastoral-care",
      requiredRoles: ["ADMIN"],
    },
    {
      name: "Newsletter Sender",
      icon: <FaNewspaper />,
      path: "/admin/newsletter",
      requiredRoles: ["ADMIN", "COMMUNICATIONS_OFFICER"],
    },
    {
      name: "Prayer Request Management",
      icon: <FaPray />,
      path: "/admin/prayer-requests",
      requiredRoles: ["ADMIN", "PRAYER_MANAGER"],
    },
    {
      name: "Project Management",
      icon: <FaBuilding />,
      path: "/admin/projects",
      requiredRoles: ["ADMIN"],
    },
  ];

  const leadershipNavItems = [
    {
      name: "Worship Leader",
      icon: <FaMusic />,
      path: "/worship-leader",
      requiredRoles: ["WORSHIP_LEADER", "ADMIN"],
    },
    {
      name: "Ministry Coordinator",
      icon: <FaUsersCog />,
      path: "/ministry-coordinator",
      requiredRoles: ["MINISTRY_COORDINATOR", "ADMIN"],
    },
    {
      name: "Discipleship Leader",
      icon: <FaBookOpen />,
      path: "/discipleship-leader",
      requiredRoles: ["DISCIPLESHIP_LEADER", "ADMIN"],
    },
    {
      name: "Tech & Media",
      icon: <FaPhotoVideo />,
      path: "/tech-media-manager",
      requiredRoles: ["TECH_MEDIA_MANAGER", "ADMIN"],
    },
    {
      name: "Finance Admin",
      icon: <FaFileInvoiceDollar />,
      path: "/finance-administrator",
      requiredRoles: ["FINANCE_ADMINISTRATOR", "ADMIN"],
    },
    {
      name: "Children/Youth",
      icon: <FaChild />,
      path: "/children-youth-director",
      requiredRoles: ["CHILDREN_YOUTH_DIRECTOR", "ADMIN"],
    },
    {
      name: "Communications",
      icon: <FaBullhorn />,
      path: "/communications-officer",
      requiredRoles: ["COMMUNICATIONS_OFFICER", "ADMIN"],
    },
    {
      name: "Senior Pastor",
      icon: <FaChurch />,
      path: "/senior- pastor",
      requiredRoles: ["SENIOR_PASTOR", "ADMIN"],
    },
  ];

  const NavItem = ({ item, setSidebarOpen }) => (
    <motion.li whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
      <Link
        href={item.path}
        onClick={() => setSidebarOpen(false)}
        className={`flex items-center p-3 rounded-lg transition-all ${
          pathname === item.path
            ? "bg-blue-600/10 text-blue-600 border-l-4 border-blue-600"
            : "hover:bg-gray-100/5 text-gray-300 hover:text-white"
        }`}
      >
        <span className="mr-3">{item.icon}</span>
        <span className="font-medium">{item.name}</span>
      </Link>
    </motion.li>
  );

  const NavSection = ({ title, items, setSidebarOpen }) => (
    <>
      <h3 className="text-xs uppercase font-semibold text-gray-400 mb-2 px-3">
        {title}
      </h3>
      <ul className="space-y-1 mb-6">
        {items
          .filter((item) => hasRole(item.requiredRoles))
          .map((item) => (
            <NavItem key={item.name} item={item} setSidebarOpen={setSidebarOpen} />
          ))}
      </ul>
    </>
  );

  return (
    <div className="flex h-full flex-col bg-gray-900 border-r border-gray-800">
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <div className="text-xl font-bold flex items-center text-white">
          <Icons.logo className="mr-2 h-6 w-6 text-blue-500" />
          <span>ChurchConnect</span>
        </div>
        <button
          onClick={() => setSidebarOpen(false)}
          className="text-gray-400 hover:text-white lg:hidden"
        >
          <FaTimes />
        </button>
      </div>

      <nav className="p-4 overflow-y-auto flex-grow">
        {session?.user && (
          <>
            <NavSection title="Member Area" items={memberNavItems} setSidebarOpen={setSidebarOpen} />

            {hasRole(allLeadershipRoles) && (
              <>
                <NavSection title="Admin & Leadership" items={adminNavItems} setSidebarOpen={setSidebarOpen} />
                <NavSection title="Ministry Tools" items={leadershipNavItems} setSidebarOpen={setSidebarOpen} />
              </>
            )}
          </>
        )}
      </nav>

      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center border border-gray-700">
            {session?.user?.photo ? (
              <img
                src={session.user.photo}
                alt="Profile"
                className="rounded-full"
              />
            ) : (
              <FaUser className="text-gray-400" />
            )}
          </div>
          <div className="ml-3">
            <div className="font-medium text-white">
              {session?.user?.name || "Guest"}
            </div>
            <div className="text-xs text-gray-400">
              {userRoles.map((role) => role.replace(/_/g, " ")).join(", ") ||
                "Public User"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const sidebarVariants = {
    open: { x: 0 },
    closed: { x: "-100%" },
  };

  return (
    <>
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial="closed"
              animate="open"
              exit="closed"
              variants={sidebarVariants}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed inset-y-0 left-0 w-72 bg-gray-900 text-white shadow-xl z-30 lg:hidden"
            >
              <SidebarContent setSidebarOpen={setSidebarOpen} />
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 z-20 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          </>
        )}
      </AnimatePresence>

      <div className="hidden lg:flex w-72 bg-gray-900 text-white">
        <SidebarContent setSidebarOpen={setSidebarOpen} />
      </div>
    </>
  );
};

export default Sidebar;
