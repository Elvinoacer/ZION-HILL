"use client";
import { Icons } from "@/components/icons";
import { AnimatePresence, motion } from "framer-motion";
import { LayoutDashboardIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaBible, FaChurch, FaLandmark, FaUsers } from "react-icons/fa";

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

  const publicNavItems = [
    { name: "Home", icon: <Icons.home />, path: "/" },
    { name: "About Us", icon: <Icons.users />, path: "/about" },
    { name: "Projects", icon: <Icons.building />, path: "/projects" },
    { name: "Services", icon: <Icons.cross />, path: "/services" },
    { name: "Blog", icon: <Icons.pen />, path: "/blog" },
    { name: "Donations", icon: <Icons.dollar />, path: "/donations" },
    { name: "Contact", icon: <Icons.mail />, path: "/contact" },
    {
      name: "Newsletter",
      icon: <Icons.newspaper />,
      path: "/newsletter-subscriptions",
    },
    { name: "Volunteering", icon: <Icons.handshake />, path: "/volunteering" },
    { name: "Certificates", icon: <Icons.checkCircle />, path: "/certificates" }, // Added
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
      icon: <Icons.user />,
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
      icon: <Icons.calendar />,
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
      icon: <Icons.pray />,
      path: "/prayer-requests",
      requiredRoles: ["MEMBER", "ADMIN", "COUNSELING_COORDINATOR"],
    },
    {
      name: "Testimonials",
      icon: <Icons.star />,
      path: "/testimonials",
      requiredRoles: ["MEMBER", "ADMIN"],
    },
    {
      name: "Prayer Wall",
      icon: <Icons.prayHands />,
      path: "/prayer-wall",
      requiredRoles: ["MEMBER", "ADMIN"],
    },
    {
      name: "Discussion Forums",
      icon: <Icons.message />,
      path: "/discussion-forums",
      requiredRoles: ["MEMBER", "ADMIN"],
    },
    {
      name: "Livestream",
      icon: <Icons.video />,
      path: "/livestream-integration",
      requiredRoles: ["MEMBER", "ADMIN", "TECH_MEDIA_MANAGER"],
    },
    {
      name: "Bible Reading Plans",
      icon: <Icons.bibleOpen />,
      path: "/bible-reading-plans",
      requiredRoles: ["MEMBER", "ADMIN", "DISCIPLESHIP_LEADER"],
    },
    {
      name: "Kids & Teens",
      icon: <Icons.child />,
      path: "/kids-teens-resources",
      requiredRoles: ["MEMBER", "ADMIN", "CHILDREN_YOUTH_DIRECTOR"],
    },
    {
      name: "Family Life",
      icon: <Icons.familyTree />,
      path: "/family-life",
      requiredRoles: ["MEMBER", "ADMIN"],
    },
    {
      name: "Volunteering",
      icon: <Icons.handshake />,
      path: "/volunteering",
      requiredRoles: ["MEMBER", "ADMIN"],
    },
    {
      name: "Certificates",
      icon: <Icons.checkCircle />,
      path: "/certificates",
      requiredRoles: ["MEMBER", "ADMIN"],
    },
  ];

  const adminNavItems = [
    {
      name: "Admin Dashboard",
      icon: <Icons.admin />,
      path: "/admin/dashboard",
      requiredRoles: ["ADMIN"],
    },
    {
      name: "User Management",
      icon: <Icons.users />,
      path: "/admin/users",
      requiredRoles: ["ADMIN"],
    },
    {
      name: "Ministry Management",
      icon: <Icons.church />,
      path: "/admin/ministries",
      requiredRoles: ["ADMIN"],
    },
    {
      name: "Event Management",
      icon: <Icons.calendar />,
      path: "/admin/events",
      requiredRoles: ["ADMIN"],
    },
    {
      name: "Financial Management",
      icon: <Icons.dollar />,
      path: "/admin/financials",
      requiredRoles: ["ADMIN"],
    },
    {
      name: "Outreach Management",
      icon: <Icons.handshake />,
      path: "/admin/outreach",
      requiredRoles: ["ADMIN"],
    },
    {
      name: "Pastoral Care",
      icon: <Icons.counseling />,
      path: "/admin/pastoral-care",
      requiredRoles: ["ADMIN"],
    },
    {
      name: "Newsletter Sender",
      icon: <Icons.newspaper />,
      path: "/admin/newsletter",
      requiredRoles: ["ADMIN", "COMMUNICATIONS_OFFICER"],
    },
    {
      name: "Prayer Request Management",
      icon: <Icons.pray />,
      path: "/admin/prayer-requests",
      requiredRoles: ["ADMIN", "PRAYER_MANAGER"],
    },
    {
      name: "Project Management",
      icon: <Icons.building />,
      path: "/admin/projects",
      requiredRoles: ["ADMIN"],
    },
  ];

  const leadershipNavItems = [
    {
      name: "Worship Leader",
      icon: <Icons.music />,
      path: "/worship-leader",
      requiredRoles: ["WORSHIP_LEADER", "ADMIN"],
    },
    {
      name: "Ministry Coordinator",
      icon: <Icons.organization />,
      path: "/ministry-coordinator",
      requiredRoles: ["MINISTRY_COORDINATOR", "ADMIN"],
    },
    {
      name: "Discipleship Leader",
      icon: <Icons.bibleOpen />,
      path: "/discipleship-leader",
      requiredRoles: ["DISCIPLESHIP_LEADER", "ADMIN"],
    },
    {
      name: "Tech & Media",
      icon: <Icons.media />,
      path: "/tech-media-manager",
      requiredRoles: ["TECH_MEDIA_MANAGER", "ADMIN"],
    },
    {
      name: "Finance Admin",
      icon: <Icons.finance />,
      path: "/finance-administrator",
      requiredRoles: ["FINANCE_ADMINISTRATOR", "ADMIN"],
    },
    {
      name: "Children/Youth",
      icon: <Icons.child />,
      path: "/children-youth-director",
      requiredRoles: ["CHILDREN_YOUTH_DIRECTOR", "ADMIN"],
    },
    {
      name: "Communications",
      icon: <Icons.megaphone />,
      path: "/communications-officer",
      requiredRoles: ["COMMUNICATIONS_OFFICER", "ADMIN"],
    },
    {
      name: "Senior Pastor",
      icon: <Icons.church />,
      path: "/senior-pastor",
      requiredRoles: ["SENIOR_PASTOR", "ADMIN"],
    },
  ];

  const NavItem = ({ item }) => (
    <motion.li whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
      <Link
        href={item.path}
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

  const NavSection = ({ title, items }) => (
    <>
      <h3 className="text-xs uppercase font-semibold text-gray-400 mb-2 px-3">
        {title}
      </h3>
      <ul className="space-y-1 mb-6">
        {items
          .filter((item) => hasRole(item.requiredRoles))
          .map((item) => (
            <NavItem key={item.name} item={item} />
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
          <Icons.close />
        </button>
      </div>

      <nav className="p-4 overflow-y-auto flex-grow">
        {session?.user ? (
          <>
            <NavSection title="Member Area" items={memberNavItems} />

            {hasRole(allLeadershipRoles) && (
              <>
                <NavSection title="Admin & Leadership" items={adminNavItems} />
                <NavSection title="Ministry Tools" items={leadershipNavItems} />
              </>
            )}
          </>
        ) : (
          <ul className="space-y-1">
            {publicNavItems.map((item) => (
              <NavItem key={item.name} item={item} />
            ))}
          </ul>
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
              <Icons.user className="text-gray-400" />
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
