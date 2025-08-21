"use client";
import { Icons } from "@/components/icons";
import { AnimatePresence, motion } from "framer-motion";
import { Award, LayoutDashboardIcon } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  FaBible,
  FaBookOpen,
  FaBullhorn,
  FaCalendarAlt,
  FaCheckCircle,
  FaChild,
  FaChurch,
  FaComment,
  FaFileInvoiceDollar,
  FaHandHoldingHeart,
  FaHandHoldingUsd,
  FaHandshake,
  FaLandmark,
  FaMusic,
  FaPhotoVideo,
  FaPray,
  FaPrayingHands,
  FaSitemap,
  FaStar,
  FaTimes,
  FaUser,
  FaUsers,
  FaUsersCog,
  FaUserShield,
  FaVideo,
  FaCross,
  FaPoll,
  FaQuoteRight,
} from "react-icons/fa";

const SidebarContent = ({ setSidebarOpen }) => {
  const pathname = usePathname();
  const { data: session } = useSession();
  const userRoles = session?.user?.roles || [];
  const userId = session?.user?.id;

  const [isWorshipMinistryMember, setIsWorshipMinistryMember] = useState(false);

  useEffect(() => {
    const checkWorshipMembership = async () => {
      if (userId) {
        try {
          const res = await fetch(
            `/api/ministries/check-membership?userId=${userId}&ministryName=Worship Ministry`
          );
          if (res.ok) {
            const data = await res.json();
            setIsWorshipMinistryMember(data.isMember);
          } else {
            console.error(
              "Failed to check worship ministry membership:",
              res.statusText
            );
            setIsWorshipMinistryMember(false);
          }
        } catch (error) {
          console.error("Error checking worship ministry membership:", error);
          setIsWorshipMinistryMember(false);
        }
      } else {
        setIsWorshipMinistryMember(false);
      }
    };

    checkWorshipMembership();
  }, [userId]);

  const hasRole = (roles: string[]) => {
    return roles.some((role) => userRoles.includes(role));
  };

  const memberNavItems = [
    {
      name: "Dashboard",
      icon: <LayoutDashboardIcon />,
      path: "/dashboard",
      requiredRoles: ["MEMBER", "ADMIN"],
    },
    {
      name: "Profile",
      icon: <FaUser />,
      path: "/member-profile",
      requiredRoles: ["MEMBER", "ADMIN"],
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
      requiredRoles: ["MEMBER", "ADMIN"],
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
      name: "Chat",
      icon: <FaComment />,
      path: "/chat",
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
      name: "Announcements",
      icon: <FaBullhorn />,
      path: "/announcements",
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
    {
      name: "Worship Team",
      icon: <FaMusic />,
      path: "/worship-team",
      requiredRoles: ["MEMBER", "WORSHIP_LEADER", "ADMIN"],
      checkMinistryMembership: true,
    },
    {
      name: "Baptism Application",
      icon: <FaCross />,
      path: "/baptism-application",
      requiredRoles: ["MEMBER", "ADMIN"],
    },
    {
      name: "Counseling Request",
      icon: <FaHandHoldingHeart />,
      path: "/counseling-request",
      requiredRoles: ["MEMBER", "ADMIN"],
    },
    {
      name: "Music Proposals",
      icon: <FaMusic />,
      path: "/music-proposals",
      requiredRoles: ["MEMBER", "ADMIN"],
    },
    {
      name: "My Certificates",
      icon: <Award />,
      path: "/my-certificates",
      requiredRoles: ["MEMBER", "ADMIN"],
    },
    {
      name: "Polls",
      icon: <FaPoll />,
      path: "/polls",
      requiredRoles: ["MEMBER", "ADMIN"],
    },
    {
      name: "Testimonies Wall",
      icon: <FaQuoteRight />,
      path: "/testimonies-wall",
      requiredRoles: ["MEMBER", "ADMIN"],
    },
  ];

  const rolesAndResponsibilitiesNavItems = [
    {
      name: "Admin Command Center",
      icon: <FaUserShield />,
      path: "/AdminCommandCenterDashboard",
      requiredRoles: ["ADMIN"],
    },
    {
      name: "Kids & Teens Resources",
      icon: <FaChild />,
      path: "/admin/kids-teens-resources",
      requiredRoles: ["CHILDREN_YOUTH_DIRECTOR", "ADMIN"],
    },
    {
      name: "Brand Engagement Hub",
      icon: <FaBullhorn />,
      path: "/BrandEngagementHubDashboard",
      requiredRoles: ["COMMUNICATIONS_OFFICER", "ADMIN"],
    },
    {
      name: "Counselor Dashboard",
      icon: <FaHandHoldingHeart />,
      path: "/counselor-dashboard",
      requiredRoles: ["COUNSELOR", "ADMIN"],
    },
    {
      name: "Discipleship Hub Dashboard",
      icon: <FaBookOpen />,
      path: "/DiscipleshipHubDashboard",
      requiredRoles: ["DISCIPLESHIP_LEADER", "ADMIN"],
    },
    {
      name: "Event Manager Dashboard",
      icon: <FaCalendarAlt />,
      path: "/events-manager/eventdashboard",
      requiredRoles: ["EVENTS_MANAGER", "ADMIN"],
    },
    {
      name: "Finance Administrator Dashboard",
      icon: <FaFileInvoiceDollar />,
      path: "/finance-administrator",
      requiredRoles: ["FINANCE_ADMINISTRATOR", "ADMIN"],
    },
    {
      name: "Leadership Dashboard",
      icon: <FaUsersCog />,
      path: "/role-management",
      requiredRoles: [
        "ADMIN",
        "PRAYER_MANAGER",
        "COUNSELOR",
        "VOLUNTEER",
        "EVENTS_MANAGER",
        "SENIOR_PASTOR",
        "FINANCE_ADMINISTRATOR",
        "VOLUNTEER_COORDINATOR",
        "WORSHIP_LEADER",
        "OVERALL_MINISTRIES_COORDINATOR",
        "MEN_MINISTRY_COORDINATOR",
        "WOMEN_MINISTRY_COORDINATOR",
        "YOUTH_MINISTRY_COORDINATOR",
        "COUPLES_AND_FAMILY_MINISTRY_COORDINATOR",
        "CHILDREN_MINISTRY_COORDINATOR",
        "YOUNG_ADULTS_MINISTRY_COORDINATOR",
        "ELDERS_MINISTRY_COORDINATOR",
        "SINGLES_MINISTRY_COORDINATOR",
        "OUTREACH_DIRECTOR",
        "DISCIPLESHIP_LEADER",
        "TECH_MEDIA_MANAGER",
        "SMALL_GROUPS_LEADER",
        "CHILDREN_YOUTH_DIRECTOR",
        "SECRETARY",
        "COMMUNICATIONS_OFFICER",
        "MISSIONS_PASTOR",
      ],
    },
    {
      name: "Outreach Director Dashboard",
      icon: <FaHandshake />,
      path: "/outreach-director",
      requiredRoles: ["OUTREACH_DIRECTOR", "ADMIN"],
    },
    {
      name: "Ministry Coordinator Dashboard",
      icon: <FaUsersCog />,
      path: "/ministry-coordinator",
      requiredRoles: ["MINISTRY_COORDINATOR", "ADMIN"],
    },
    {
      name: "Secretary Dashboard",
      icon: <FaFileInvoiceDollar />,
      path: "/secretary",
      requiredRoles: ["SECRETARY", "ADMIN"],
    },
    {
      name: "Senior Pastor Dashboard",
      icon: <FaChurch />,
      path: "/admin-dashboard",
      requiredRoles: ["SENIOR_PASTOR", "ADMIN"],
    },
    {
      name: "Small Group Leader Dashboard",
      icon: <FaUsers />,
      path: "/small-group-leader",
      requiredRoles: ["SMALL_GROUP_LEADER", "ADMIN"],
    },
    {
      name: "Digital Hub Dashboard",
      icon: <FaPhotoVideo />,
      path: "/DigitalHubDashboard",
      requiredRoles: ["TECH_MEDIA_MANAGER", "ADMIN"],
    },
    {
      name: "Volunteer Hub Dashboard",
      icon: <FaHandshake />,
      path: "/VolunteerHubDashboard",
      requiredRoles: ["VOLUNTEER_COORDINATOR", "ADMIN"],
    },
    {
      name: "Worship Leader Dashboard",
      icon: <FaMusic />,
      path: "/worship-leader",
      requiredRoles: ["WORSHIP_LEADER", "ADMIN"],
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
          .filter((item) => {
            const roleCheck = hasRole(item.requiredRoles);
            if (item.checkMinistryMembership) {
              return roleCheck && isWorshipMinistryMember;
            }
            return roleCheck;
          })
          .map((item) => (
            <NavItem
              key={item.name}
              item={item}
              setSidebarOpen={setSidebarOpen}
            />
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

      <nav className="p-4 overflow-y-auto flex-grow custom-scrollbar">
        {session?.user && (
          <>
            <NavSection
              title="Member Area"
              items={memberNavItems}
              setSidebarOpen={setSidebarOpen}
            />
            {/* New Roles & Responsibilities Section */}
            <NavSection
              title="Roles & Responsibilities"
              items={rolesAndResponsibilitiesNavItems}
              setSidebarOpen={setSidebarOpen}
            />
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
            <div className="text-xs text-gray-400 mb-2">
              {userRoles.map((role) => role.replace(/_/g, " ")).join(", ") ||
                "Public User"}
            </div>
            <button
              onClick={() => signOut()}
              className="w-full text-left text-sm text-red-400 hover:text-red-300 transition-colors"
            >
              Log Out
            </button>
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
