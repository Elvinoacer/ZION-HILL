"use client";
import React, { useEffect, useState, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { motion } from "framer-motion";
import { ChevronRight, BookOpen, Menu, X } from "lucide-react";

const markdownContent = `
# Zion Hill Church Platform Documentation

Welcome to the comprehensive documentation for the Zion Hill Church Platform. This document provides an overview of the platform's features, functionalities, and how different user roles can interact with it to foster spiritual growth, community engagement, and efficient church administration.

## 1. Introduction

The Zion Hill Church Platform is a holistic digital solution designed to connect, empower, and serve our church family and the wider community. It aims to streamline church operations, enhance member experience, facilitate spiritual development, and expand our outreach efforts through a user-friendly and feature-rich environment.

## 2. Core Features

The platform offers a wide array of features, including:

- **Worship & Services:** Access to live streams, past sermons, and service schedules.
- **Ministries:** Information and engagement opportunities across various demographic and purpose-driven ministries.
- **Outreach Programs:** Details on community service, evangelism, and mission trips.
- **Discipleship & Spiritual Growth:** Tools for Bible study, spiritual development courses, and prayer initiatives.
- **Events & Conferences:** A centralized hub for all church events, including registration and management.
- **Online Giving:** Secure and convenient ways to contribute financially to the church and its projects.
- **Member Management:** Personalized profiles, family management, and access to member-specific resources.
- **Administrative Tools:** Comprehensive dashboards for leaders and administrators to manage various church operations.

## 3. User Roles & Dashboards

The platform is designed to cater to diverse needs within the church, with tailored experiences for each role:

### 3.1. Guests

- **Access:** Public pages, live worship services, past sermon links.
- **Purpose:** Explore the church, its mission, and public offerings.

### 3.2. Members

- **Access:** All public content, plus a personalized dashboard.
- **Dashboard Features:**
  - **Profile Management:** View and update personal details, register children and spouse.
  - **Service & Event Information:** Access service materials, schedules, live service links, and track attendance.
  - **Ministry Involvement:** See ministry details, upcoming events, and connect with other members.
  - **Donations:** View giving history, donate to specific programs or projects, and pledge resources.
  - **Spiritual Growth:** Track Bible study progress, access sermons and teachings, participate in prayer walls and discussion forums.
  - **Community Engagement:** Participate in polls, send anonymous messages to other members, invite members for fellowship.
  - **Announcements:** Receive all church announcements.
  - **Celebrations:** Be celebrated on special occasions like birthdays.

### 3.3. Admins (General)

- **Access:** Comprehensive administrative dashboard with delegated roles and activities.
- **Purpose:** Oversee and manage various church operations.

### 3.4. Worship Leader

- **Dashboard Features:**
  - **Service Management:** Create/edit worship services (Sunday, Midweek, Holy Communion), assign team members (musicians, vocalists, AV crew).
  - **Song Management:** Draft and drop interface for song arrangement, auto-generate PDFs for team members, view musician/vocalist availability.
  - **Communication:** Send rehearsal reminders, share rehearsal recordings, manage worship team announcement board.
  - **Live Stream Integration:** Start/stop YouTube/Facebook streams, monitor live chat.
  - **Analytics:** View worship analytics (most performed songs, team participation metrics, service duration trends).
  - **Song Proposals:** Review and manage song proposals from members.

### 3.5. Overall Ministries Coordinator

- **Dashboard Features:**
  - **Ministry Oversight & Administration:** Track ministry performance (attendance, growth trends), budget monitoring (view/approve expense reports, set limits).
  - **Cross-Ministry Coordination:** Prevent event collisions, manage shared resources, approve special requests.
  - **Volunteer Management:** Automated reminders, training coordination, centralized training portal.
  - **Communication Hub:** Cross-ministry announcements, bulletin board system, read receipts tracking.
  - **Reporting to Leadership:** Automated monthly reports (participation, financial summaries, upcoming needs).
  - **Ministry Health Monitoring:** Needs assessment (survey system, evaluation forms), intervention triggers (alerts for declining participation, budget overruns, volunteer shortages).

### 3.6. Outreach Director

- **Dashboard Features:**
  - **Program Tracking:** Live activity map visualizing outreach locations, color-coded by program type.
  - **Volunteer Mobilization:** Skill-based matching, real-time signup sheets, digital waivers, automated reminders.
  - **Mission Trip Coordination:** Manage trip lifecycle (fundraising, documents, live updates, impact reporting).
  - **Community Partnerships:** Partner database, MOU tracking with renewal alerts.
  - **Resource Allocation:** Donation distribution logs, tax receipts for donors.
  - **Evangelism Tools:** Digital outreach (social media integration, engagement metrics), street ministry kits (printable resources).

### 3.7. Discipleship Leader

- **Dashboard Features:**
  - **Discipleship Program Management:** Curriculum builder (modular lesson plans, multimedia resources), progress tracking (individual growth maps).
  - **Small Group Oversight:** Group health monitoring (engagement metrics, prayer request frequency), leader support (automated coaching, flagging struggling groups).
  - **Sacramental Preparation:** Baptism pipeline (candidate tracking, class completion), communion scheduling.
  - **Prayer & Fasting Coordination:** Digital prayer walls, anonymous request system, categorized prayers, fasting campaigns.
  - **Resource Distribution:** Digital library (role-specific materials), discussion archives.

### 3.8. Events Manager

- **Dashboard Features:**
  - **Event Planning & Logistics:** Master calendar system (conflict-free scheduling, venue/equipment collision detection), resource allocation (assign equipment, track teams).
  - **Participants Management:** Intelligent RSVP system (capacity control, waitlist), dynamic pricing for paid events, targeted invitations.
  - **Financial Oversight:** Budget guardianship (real-time expense tracking, vendor payment status), per-event profit/loss statements.
  - **Sponsorship Management:** Donor recognition system (thank-you emails, logo placement).
  - **Post-Event Analysis:** Automated feedback collection (survey generation, sentiment analysis), media archiving (photo/video tagging).

### 3.9. Counseling Coordinator

- **Dashboard Features:**
  - **Counseling Session Management:** Appointment scheduling (confidential booking, counselor matching), session tracking (secure case notes, progress tracking).
  - **Resource Coordination:** Referral network (professional partnerships database).
  - **Crisis Intervention:** Emergency protocols (one-click suicide risk escalation, location sharing).
  - **Support Group Oversight:** Group management (anonymous attendance tracking, curriculum distribution), secure material sharing.
  - **Data & Reporting:** Anonymized analytics (trend identification, outcome measurement).

### 3.10. Tech & Media Manager

- **Dashboard Features:**
  - **Live Streaming & Broadcast Management:** Stream control center (multi-platform broadcasting, bitrate monitoring), equipment automation.
  - **Media Production Pipeline:** Sermon post-production (automated workflow, highlight clipping, audio mastering).
  - **Digital Asset Management:** AI tagging system (scripture reference, speaker tagging).
  - **Website & App Maintenance:** Uptime monitoring, performance metrics dashboard, content updates (drag-drop editor, sandbox for volunteers, version control).
  - **Tech Support System:** Ticketing system (priority routing), equipment tracking (maintenance scheduling, predictive replacements).

### 3.11. Finance Administrator

- **Dashboard Features:**
  - **Contribution Management:** Intelligent giving tracking (real-time donation heatmap, anomaly detection), automated receipting (customizable templates).
  - **Financial Oversight:** Ministry budget control (drag-and-drop allocations, remaining balances), expense reconciliation (AI-powered receipt scanning, flagging unapproved spending).
  - **Reporting & Compliance:** Tax preparation (year-end automation, contribution statements), audit trail (immutable transaction log, user action tracking).
  - **Online Giving Optimization:** Payment gateway management (failover configuration), recurring gift oversight (expiration alerts).

### 3.12. Volunteer Coordinator

- **Dashboard Features:**
  - **Volunteer Recruitment:** Dynamic sign-up portal (role-based opportunities, filtering), automated onboarding (digital forms, background checks, training modules).
  - **Scheduling & Deployment:** Intelligent shift management (conflict-free scheduling, replacement pool), mobile check-in system (QR code verification).
  - **Volunteer Engagement:** Appreciation tools (milestone recognition, service hour thresholds), feedback collection (sentiment analysis, retention risk alerts).
  - **Reporting & Analytics:** Gap identification (heatmap visualization), retention metrics (turnover rate tracking).

### 3.13. Small Groups Leader (SGL)

- **Dashboard Features:**
  - **Group Facilitation Tools:** Meeting management (discussion guides, prayer requests, follow-ups), attendance tracking (anonymous check-in).
  - **Member Care:** Spiritual health monitoring (milestone celebrations), personalized follow-up (AI-assisted insights, reconnect strategies).
  - **Resource Distribution:** Digital library (role-specific materials), discussion archives.
  - **Communication Channels:** Secure messaging (encrypted prayer chains), automated check-ins (customizable triggers).

### 3.14. Children/Youth Director

- **Dashboard Features:**
  - **Ministry Program Management:** Age-specific curriculum builder (interactive lesson planner, biblical themes), digital check-in system (secure child matching, allergy/medical alerts).
  - **Volunteer Coordination:** Background-compliant teams (clearance tracking, expiration alerts), role-specific training (micro-certification portal).
  - **Family Engagement:** Parent partnership tools (take-home discussion kits), milestone celebrations (faith journey updates).
  - **Safety & Compliance:** Room monitoring (volunteer ratios dashboard), incident reporting (secure digital forms).

### 3.15. Secretary

- **Dashboard Features:**
  - **Centralized Communication Hub:** Unified inbox management (smart message routing), automated response system (pre-approved templates).
  - **Calendar & Scheduling:** Master calendar oversight (conflict resolution view), facility booking system (room utilization analytics, equipment reservation).
  - **Document Management:** Digital filing system (OCR searchable archives), template library (certificates, agreements).
  - **Member Services:** Database maintenance (bulk update tools, family relationship mapping), visitor follow-up (automated emails, connection card processing).

### 3.16. Communications Officer

- **Dashboard Features:**
  - **Content Creation & Distribution:** Unified publishing console (one-click multiplatform posting), brand asset management (logo/color/font libraries, AI style checker).
  - **Congregation Engagement:** Targeted communication (demographic-specific campaigns), interactive bulletin (digital flipbook, clickable links).
  - **Analytics & Optimization:** Performance dashboards (cross-platform metrics), A/B testing tools (sermon thumbnail effectiveness, email send times).
  - **Crisis Communication:** Emergency alert system (tiered notification levels), pre-approved statements (weather closure, pastoral transition).

### 3.17. Senior Pastor

- **Dashboard Features:**
  - **Spiritual Oversight:** Visualize weekly/monthly service attendance, track small group participation, monitor baptisms/new believers and discipleship program completion rates.
  - **Communication Hub:** Broadcast urgent announcements, send personalized pastoral emails.
  - **Preaching & Worship:** Manage annual preaching calendar, collaborate with worship leader on themes.
  - **Administrative Tools:** Assign/revoke admin privileges, approve ministry budgets.
  - **Pastoral Care:** Activate emergency prayer chains, triage counseling requests, view all prayer requests.
  - **Sacramental Tracking:** Manage baptism candidate lists, generate certificates.

### 3.18. Missions Pastor

- **Dashboard Features:**
  - **Mission Trip Management:** Create mission trip itineraries, track fundraising progress.
  - **Missionary Support:** Profile pages for supported missionaries, secure document uploads (visas, reports).
  - **Outreach Coordination:** Local outreach map (food banks, prison ministries), volunteer sign-up integration.
  - **Reporting Tools:** Impact metrics (souls saved/baptisms from missions), community service hours logged.
  - **Partnership Portal:** Manage MOUs with partner organizations, document sharing with international churches.

## 4. Key Modules/Sections (Public & General Access)

Beyond role-specific dashboards, the platform features several public and generally accessible modules:

- **About Us:** Information about the church's mission, vision, and values.
- **Blog:** Latest news, articles, and spiritual insights.
- **Contact Us:** Church contact information and inquiry forms.
- **Devotionals:** Daily spiritual readings and reflections.
- **Donations:** Secure online giving portal for various funds and projects.
- **Events:** Comprehensive calendar of upcoming church events with RSVP options.
- **Institutions:** Details about church-owned schools, clinics, and other community institutions.
- **Media Gallery:** Photos and videos from church services, events, and missions.
- **Ministries:** Overview of all church ministries with links to detailed pages.
- **Partnerships:** Information about organizations collaborating with the church.
- **Projects:** Public display of ongoing community projects with progress updates and ways to contribute.
- **Services:** Information about regular worship services and special gatherings.
- **Sign Up/Login:** User registration and authentication.
- **Testimonies Wall:** A platform for members to share their personal faith stories.
- **Volunteering:** Opportunities to serve the church and community.
- **Ask the Pastor:** A channel for members to submit questions to the pastoral team.
- **Newsletter Sign-Up:** Subscribe to receive regular updates.
- **Kids & Teens Zone:** Resources and activities tailored for younger members.

- **Marriage & Family Life:** Resources and programs for strengthening family bonds.
- **Online Community Tools:** Prayer wall, discussion forums, livestream integration, Bible reading plans, event RSVP & check-in.
- **Downloads & Resources:** Access to sermon notes, devotionals, church documents, and event flyers.
- **Member Area / Portal:** Personalized dashboard for members to track giving, volunteer schedules, view certificates, and update contact info.

## 5. Technical Considerations (High-Level)

The platform leverages modern technologies to ensure a seamless and secure experience:

- **Online Payments:** Integration with various payment gateways (Mpesa, card, bank, PayPal) for secure donations.
- **Notifications:** Reminders and updates via in-app notifications, emails, or WhatsApp messages (Twilio integration).
- **Shared Calendar Scheduling:** Efficient management of events and attendance tracking.
- **Cloud Storage:** Secure storage for images, documents, and other media.
- **YouTube Integration:** For live streaming and video content.

## 6. Getting Started

To begin using the Zion Hill Church Platform:

1. **Visit the Website:** Navigate to the main church website.
2. **Sign Up/Login:** If you are a new user, create an account. Existing members can log in with their credentials.
3. **Explore Your Dashboard:** Upon logging in, you will be directed to your personalized dashboard, offering features relevant to your role.
4. **Engage:** Explore ministries, events, resources, and community tools to deepen your faith and connect with others.

For any technical issues or support, please contact the church administration.
`;

interface Heading {
  id: string;
  level: number;
  text: string;
}

const DocumentationPage: React.FC = () => {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [isTocOpen, setIsTocOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");
  const sectionRefs = useRef<{ [key: string]: IntersectionObserverEntry }>({});

  useEffect(() => {
    const extractedHeadings: Heading[] = [];
    const lines = markdownContent.split("\n");

    lines.forEach((line) => {
      const match = line.match(/^(#{1,6})\s(.+)$/);
      if (match) {
        const level = match[1].length;
        const text = match[2].trim();
        const id = text
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "");
        extractedHeadings.push({ id, level, text });
      }
    });

    setHeadings(extractedHeadings);
  }, []);

  useEffect(() => {
    // Set up Intersection Observer to detect which section is in view
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          sectionRefs.current[entry.target.id] = entry;
        });

        // Find the section that's most visible
        const visibleSections = Object.values(sectionRefs.current).filter(
          (entry) => entry.isIntersecting
        );

        if (visibleSections.length > 0) {
          // Sort by intersection ratio to find the most visible section
          visibleSections.sort(
            (a, b) => b.intersectionRatio - a.intersectionRatio
          );
          setActiveSection(visibleSections[0].target.id);
        }
      },
      { threshold: 0.5, rootMargin: "-100px 0px -50% 0px" }
    );

    // Observe all section headings
    headings.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) {
        sectionRefs.current[id] = {} as IntersectionObserverEntry;
        observer.observe(element);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [headings]);

  const toggleToc = () => {
    setIsTocOpen(!isTocOpen);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 text-gray-900">
      <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-8 md:py-16 shadow-lg">
        <div className="container mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-3"
          >
            Platform Documentation
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base md:text-lg lg:text-xl opacity-90 max-w-3xl mx-auto"
          >
            Your comprehensive guide to understanding and utilizing the Zion
            Hill Church Platform.
          </motion.p>
        </div>
      </header>

      {/* Mobile TOC Toggle Button */}
      <div className="lg:hidden fixed top-20 right-4 z-50">
        <button
          onClick={toggleToc}
          className="bg-blue-600 text-white p-3 rounded-full shadow-lg flex items-center justify-center"
          aria-label="Toggle table of contents"
        >
          {isTocOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <main className="container mx-auto px-4 py-8 md:py-12 grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Table of Contents */}
        <motion.nav
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className={`lg:col-span-1 bg-white p-4 md:p-6 rounded-lg shadow-lg lg:sticky top-4 h-fit transition-all duration-300 ease-in-out ${isTocOpen ? "fixed inset-4 z-40 overflow-y-auto" : "hidden lg:block"}`}
          aria-label="Table of Contents"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold flex items-center text-blue-700">
              <BookOpen className="mr-2" size={20} />
              Contents
            </h2>
            <button
              onClick={() => setIsTocOpen(false)}
              className="lg:hidden text-gray-500 hover:text-gray-700"
              aria-label="Close table of contents"
            >
              <X size={20} />
            </button>
          </div>
          <ul className="space-y-2 max-h-[70vh] overflow-y-auto">
            {headings.map((heading) => (
              <li
                key={heading.id}
                className={`transition-colors duration-200 ${heading.level === 3 ? "ml-4 text-sm" : ""} ${heading.level === 4 ? "ml-6 text-xs italic" : ""} ${activeSection === heading.id ? "text-blue-600 font-semibold" : "text-gray-700 hover:text-blue-600"}`}
              >
                <a
                  href={`#${heading.id}`}
                  className="flex items-center py-1"
                  onClick={() => setIsTocOpen(false)}
                >
                  <ChevronRight
                    className={`mr-2 flex-shrink-0 ${heading.level === 2 ? "h-4 w-4" : "h-3 w-3"}`}
                  />
                  <span className="truncate">{heading.text}</span>
                </a>
              </li>
            ))}
          </ul>
        </motion.nav>

        {/* Overlay for mobile TOC */}
        {isTocOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
            onClick={() => setIsTocOpen(false)}
          />
        )}

        {/* Markdown Content */}
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="lg:col-span-3 bg-white p-4 md:p-6 lg:p-8 rounded-lg shadow-lg prose prose-blue max-w-none"
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ node, ...props }) => {
                const id = props.children
                  ?.toString()
                  .toLowerCase()
                  .replace(/[^a-z0-9]+/g, "-")
                  .replace(/^-+|-+$/g, "");
                return (
                  <h1
                    id={id}
                    {...props}
                    className={`text-2xl md:text-3xl lg:text-4xl font-extrabold text-gray-800 mt-6 md:mt-8 mb-3 md:mb-4 border-b pb-2 ${activeSection === id ? "text-blue-700" : ""}`}
                  />
                );
              },
              h2: ({ node, ...props }) => {
                const id = props.children
                  ?.toString()
                  .toLowerCase()
                  .replace(/[^a-z0-9]+/g, "-")
                  .replace(/^-+|-+$/g, "");
                return (
                  <h2
                    id={id}
                    {...props}
                    className={`text-xl md:text-2xl lg:text-3xl font-bold text-gray-700 mt-5 md:mt-6 mb-2 md:mb-3 border-b pb-1 ${activeSection === id ? "text-blue-600" : ""}`}
                  />
                );
              },
              h3: ({ node, ...props }) => {
                const id = props.children
                  ?.toString()
                  .toLowerCase()
                  .replace(/[^a-z0-9]+/g, "-")
                  .replace(/^-+|-+$/g, "");
                return (
                  <h3
                    id={id}
                    {...props}
                    className={`text-lg md:text-xl lg:text-2xl font-semibold text-gray-600 mt-4 md:mt-5 mb-2 ${activeSection === id ? "text-blue-500" : ""}`}
                  />
                );
              },
              h4: ({ node, ...props }) => {
                const id = props.children
                  ?.toString()
                  .toLowerCase()
                  .replace(/[^a-z0-9]+/g, "-")
                  .replace(/^-+|-+$/g, "");
                return (
                  <h4
                    id={id}
                    {...props}
                    className={`text-base md:text-lg lg:text-xl font-semibold text-gray-500 mt-3 md:mt-4 mb-1 ${activeSection === id ? "text-blue-400" : ""}`}
                  />
                );
              },
              p: ({ node, ...props }) => (
                <p {...props} className="mb-4 leading-relaxed text-gray-700" />
              ),
              ul: ({ node, ...props }) => (
                <ul
                  {...props}
                  className="list-disc list-inside mb-4 space-y-1 text-gray-700"
                />
              ),
              ol: ({ node, ...props }) => (
                <ol
                  {...props}
                  className="list-decimal list-inside mb-4 space-y-1 text-gray-700"
                />
              ),
              li: ({ node, ...props }) => <li {...props} className="mb-1" />,
              strong: ({ node, ...props }) => (
                <strong {...props} className="font-bold text-blue-800" />
              ),
              a: ({ node, ...props }) => (
                <a {...props} className="text-blue-600 hover:underline" />
              ),
              table: ({ node, ...props }) => (
                <table
                  {...props}
                  className="min-w-full divide-y divide-gray-200 my-6"
                />
              ),
              thead: ({ node, ...props }) => (
                <thead {...props} className="bg-gray-50" />
              ),
              th: ({ node, ...props }) => (
                <th
                  {...props}
                  className="px-4 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                />
              ),
              tbody: ({ node, ...props }) => (
                <tbody
                  {...props}
                  className="bg-white divide-y divide-gray-200"
                />
              ),
              td: ({ node, ...props }) => (
                <td
                  {...props}
                  className="px-4 md:px-6 py-2 md:py-4 whitespace-nowrap text-sm text-gray-700"
                />
              ),
              blockquote: ({ node, ...props }) => (
                <blockquote
                  {...props}
                  className="border-l-4 border-blue-500 pl-4 italic text-gray-600 my-4"
                />
              ),
              code: ({ node, inline, ...props }) => {
                if (inline) {
                  return (
                    <code
                      {...props}
                      className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono text-red-600"
                    />
                  );
                }
                return (
                  <pre>
                    <code
                      {...props}
                      className="block bg-gray-800 text-white p-4 rounded-md overflow-x-auto text-sm font-mono"
                    />
                  </pre>
                );
              },
            }}
          >
            {markdownContent}
          </ReactMarkdown>
        </motion.article>
      </main>

      {/* Current section indicator for mobile */}
      <div className="lg:hidden fixed bottom-4 left-0 right-0 flex justify-center">
        <div className="bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg text-sm">
          Current section:{" "}
          {headings.find((h) => h.id === activeSection)?.text || "Introduction"}
        </div>
      </div>
    </div>
  );
};

export default DocumentationPage;
