"use client";
import { churchConfig } from "@/lib/church-config";
import { Icons } from "@/components/icons";
import { AnimatePresence, motion } from "framer-motion";
import { Award, LayoutDashboardIcon } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
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
import AlertDialog from "@/components/ui/AlertDialog";
// test this

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
      path: "/member/dashboard",
      requiredRoles: ["MEMBER"],
    },
    {
      name: "Profile",
      icon: <FaUser />,
      path: "/member/member-profile",
      requiredRoles: ["MEMBER"],
    },
    {
      name: "Family",
      icon: <FaUsers />,
      path: "/member/family",
      requiredRoles: ["MEMBER"],
    },
    {
      name: "Ministry",
      icon: <FaChurch />,
      path: "/member/ministry",
      requiredRoles: ["MEMBER"],
    },
    {
      name: "Events",
      icon: <FaCalendarAlt />,
      path: "/events",
      requiredRoles: ["MEMBER"],
    },
    {
      name: "Resources",
      icon: <FaLandmark />,
      path: "/member/resources",
      requiredRoles: ["MEMBER"],
    },
    {
      name: "Bible Study",
      icon: <FaBible />,
      path: "/member/bible-study",
      requiredRoles: ["MEMBER"],
    },
    {
      name: "Financial Support",
      icon: <FaHandHoldingUsd />,
      path: "/member/member-financial-support",
      requiredRoles: ["MEMBER"],
    },
    {
      name: "Prayer Wall",
      icon: <FaPrayingHands />,
      path: "/member/prayer-wall",
      requiredRoles: ["MEMBER"],
    },
    {
      name: "Discussion Forums",
      icon: <FaComment />,
      path: "/member/discussion-forums",
      requiredRoles: ["MEMBER"],
    },
    {
      name: "Chat",
      icon: <FaComment />,
      path: "/member/chat",
      requiredRoles: ["MEMBER"],
    },
    {
      name: "Livestream",
      icon: <FaVideo />,
      path: "/livestream-integration",
      requiredRoles: ["MEMBER"],
    },

    {
      name: "Kids & Teens",
      icon: <FaChild />,
      path: "/member/kids-teens-resources",
      requiredRoles: ["MEMBER"],
    },
    {
      name: "Family Life",
      icon: <FaSitemap />,
      path: "/member/family-life",
      requiredRoles: ["MEMBER"],
    },
    {
      name: "Announcements",
      icon: <FaBullhorn />,
      path: "/member/announcements",
      requiredRoles: ["MEMBER"],
    },
    {
      name: "Volunteering",
      icon: <FaHandshake />,
      path: "/member/volunteering",
      requiredRoles: ["MEMBER"],
    },
    {
      name: "Certificates",
      icon: <FaCheckCircle />,
      path: "/member/certificates",
      requiredRoles: ["MEMBER"],
    },
    {
      name: "Worship Team",
      icon: <FaMusic />,
      path: "/member/worship-team",
      requiredRoles: ["MEMBER", "WORSHIP_LEADER"],
      checkMinistryMembership: true,
    },
    {
      name: "Baptism Application",
      icon: <FaCross />,
      path: "/member/baptism-application",
      requiredRoles: ["MEMBER"],
    },
    {
      name: "Counseling Request",
      icon: <FaHandHoldingHeart />,
      path: "/member/counseling-request",
      requiredRoles: ["MEMBER"],
    },
    {
      name: "Music Proposals",
      icon: <FaMusic />,
      path: "/member/music-proposals",
      requiredRoles: ["MEMBER"],
    },
    {
      name: "My Certificates",
      icon: <Award />,
      path: "/member/my-certificates",
      requiredRoles: ["MEMBER"],
    },
    {
      name: "Polls",
      icon: <FaPoll />,
      path: "/member/polls",
      requiredRoles: ["MEMBER"],
    },
    {
      name: "Testimonies Wall",
      icon: <FaQuoteRight />,
      path: "/member/testimonies-wall",
      requiredRoles: ["MEMBER"],
    },
    {
      name: "Birthdays",
      icon: <FaStar />,
      path: "/member/birthdays",
      requiredRoles: ["MEMBER"],
    },
  ];

  const rolesAndResponsibilitiesNavItems = [
    {
      name: "Admin Command Center",
      icon: <FaUserShield />,
      path: "/admin/institutions",
      requiredRoles: ["ADMIN"],
    },
    {
      name: "Kids & Teens Resources",
      icon: <FaChild />,
      path: "/children_youth_director/admin/kids-teens-resources",
      requiredRoles: ["CHILDREN_YOUTH_DIRECTOR"],
    },
    {
      name: "Brand Engagement Hub",
      icon: <FaBullhorn />,
      path: "/communications_officer/communications-officer",
      requiredRoles: ["COMMUNICATIONS_OFFICER"],
    },
    {
      name: "Counselor Dashboard",
      icon: <FaHandHoldingHeart />,
      path: "/counselor/counselor-dashboard",
      requiredRoles: ["COUNSELOR"],
    },
    {
      name: "Discipleship Hub Dashboard",
      icon: <FaBookOpen />,
      path: "discipleship_leader/admin",
      requiredRoles: ["DISCIPLESHIP_LEADER"],
    },
    {
      name: "Event Manager Dashboard",
      icon: <FaCalendarAlt />,
      path: "/events_manager/events-manager",
      requiredRoles: ["EVENTS_MANAGER"],
    },
    {
      name: "Finance Administrator Dashboard",
      icon: <FaFileInvoiceDollar />,
      path: "/finance_administrator/finance-administrator",
      requiredRoles: ["FINANCE_ADMINISTRATOR"],
    },
    {
      name: "Outreach Director Dashboard",
      icon: <FaHandshake />,
      path: "/outreach_director/outreach-director",
      requiredRoles: ["OUTREACH_DIRECTOR"],
    },

    {
      name: "Secretary Dashboard",
      icon: <FaFileInvoiceDollar />,
      path: "/secretary/secretary",
      requiredRoles: ["SECRETARY"],
    },
    {
      name: "Senior Pastor Dashboard",
      icon: <FaChurch />,
      path: "/senior_pastor/admin-dashboard",
      requiredRoles: ["SENIOR_PASTOR", "ADMIN"],
    },
    {
      name: "Small Group Leader Dashboard",
      icon: <FaUsers />,
      path: "/small_groups_leader/small-group-leader",
      requiredRoles: ["SMALL_GROUPS_LEADER"],
    },
    {
      name: "Digital Hub Dashboard",
      icon: <FaPhotoVideo />,
      path: "/tech_media_manager/DigitalHubDashboard",
      requiredRoles: ["TECH_MEDIA_MANAGER"],
    },
    {
      name: "Volunteer Hub Dashboard",
      icon: <FaHandshake />,
      path: "/volunteer_coordinator/VolunteerHubDashboard",
      requiredRoles: ["VOLUNTEER_COORDINATOR"],
    },
    {
      name: "Worship Leader Dashboard",
      icon: <FaMusic />,
      path: "/worship_leader",
      requiredRoles: ["WORSHIP_LEADER"],
    },
  ];

  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleLogout = () => {
    signOut();
  };

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
        <div className="flex items-center gap-3">
          <Image
            src="/images/kag-logo-free-bg.png"
            alt="The Worship Center Logo"
            width={64}
            height={64}
            className="h-10 w-10 md:h-16 md:w-16 rounded-full"
          />
          <span className="text-lg md:text-xl font-semibold text-white">
            The Worship Center
          </span>
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
          <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center border-2 border-gray-700 overflow-hidden flex-shrink-0">
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

      <AlertDialog
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
        title="Are you sure you want to log out?"
        description="You will be returned to the login page."
      />
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