## src/app/(authenticated)/admin/baptism-candidates/page.tsx

- **Summary:** This page provides an administrative interface for managing baptism candidates. It displays a list of candidates and likely includes functionalities for senior pastors to see candidates, approve class completion, schedule baptism dates, search for candidates, and export data.

## src/app/(authenticated)/admin/budgets/page.tsx

- **Summary:** This page provides an administrative interface for managing ministry budgets and financial oversight. It allows setting an annual church budget limit, displays ministry budget allocations (allocated, spent, remaining), and supports editing allocated budgets with debounced updates. It also features charts for budget vs. actual spending, monthly spending trends, and budget allocation overview.

## src/app/(authenticated)/dashboard/page.tsx

- **Summary:** This page serves as the main spiritual dashboard for authenticated users. It displays a personalized welcome message and presents various user-specific data in a card-based layout, including user profile, upcoming events, recent sermons, giving history, Bible study progress, prayer requests, counseling sessions, and baptism application status.

## src/app/VolunteerHubDashboard/page.tsx

- Provides a dashboard for Volunteer Coordinators.
- Allows managing volunteering opportunities:
  - Create, edit, and delete opportunities.
  - Set required people, type, image URL, and custom fields.
  - Mark opportunities as "Fully Assigned".
  - Displays a list of volunteering opportunities with details like applicants, assigned people, and custom fields.
  - Manges volunteer applications:
    - View all applications.
    - Update application status (Pending, Approved, Rejected).
    - Add coordinator notes to applications.
    - Assign "COUNSELOR" role to approved applicants (if applicable).
  - Features a tabbed interface for "Opportunities" and "Applications".
  - Includes modals for creating/editing opportunities and reviewing applications.
  - Provides loading states and error handling.

## src/app/baptism-application/page.tsx

- Provides a public form for members to apply for baptism.
- Collects personal details: Full Name, Email, Phone Number, Date of Birth.
- Asks for the reason for baptism (personal testimony).
- Includes optional fields for previous church affiliation and how they heard about the church.
- Submits application data to the `/api/baptism-applications` endpoint.
- Features a visually appealing design with Framer Motion animations for a smooth user experience.
- Displays loading states during submission and success/error toasts.

## src/app/counseling-request/page.tsx

- Provides a form for users to request a counseling session.
- Automatically pre-fills client name and email if the user is logged in.
- Fetches available counseling topics from `/api/counseling-topics` to populate a dropdown.
- Allows users to select a topic of concern and provide a brief description of their need.
- Submits the counseling request to the `/api/counseling-requests` endpoint.
- Displays loading states during submission and success/error toasts.
- Redirects the user after successful submission.

## src/app/pastoralcare/dashboard/page.tsx

- Serves as the Pastoral Care and Mental Health Dashboard.
- Features a collapsible sidebar for navigation between different sections.
- Displays various pastoral care management sections based on the active selection:
  - Counseling Management
  - Resource Coordination
  - Crisis Intervention
  - Support Groups (with features for managing groups, adding prayer requests, and anonymous check-ins)
  - Data & Reporting
  - Counseling Topics (allows adding and managing counseling topics)
- Provides loading and error states for pastoral care data.
- Uses Framer Motion for smooth UI transitions.

## src/app/volunteering/page.tsx

- Displays a public list of available volunteering opportunities.
- Allows authenticated users to apply for opportunities.
- Users can view their application status (Pending, Approved, Rejected).
- Authenticated users can withdraw their pending applications.
- Provides details for each opportunity, including title, description, type, required people, current applicants, and coordinator.
- Indicates if an opportunity is fully assigned.
- Prompts unauthenticated users to log in to apply.
- Features a dedicated section to display "My Applications" for logged-in users.
- Includes loading states and success/error toasts for user feedback.

## src/app/(authenticated)/admin/certificates/page.tsx

- **Summary:** This page provides a comprehensive administrative interface for managing issued certificates. It displays a table of certificates with details such as recipient, type, issuer, and issued date. It allows searching, deleting, previewing (PDFs), and opening certificates in a new tab. It also includes a button to generate new certificates.

## src/app/(authenticated)/certificates/page.tsx

- **Summary:** This page displays a public list of issued certificates. It shows certificate details such as recipient name, type, issuer, and issued date. It allows users to view a certificate in a new tab after a verification process.

## src/app/(authenticated)/certificate-generator/page.tsx

- **Summary:** This page provides an authenticated interface for generating church certificates. It allows users to create various types of certificates, collect recipient details, upload a church logo, generate a PDF preview, upload the PDF to Cloudinary, and assign the certificate to a specific user.

## src/app/(authenticated)/admin/dashboard/page.tsx

- **Summary:** This page serves as the main administrative dashboard for the church management system. It displays key metrics and statistics (total users, ministries, events, donations) and provides quick navigation links to different administrative sections like user management, ministry management, event management, financial overview, outreach programs, pastoral care, role management, and institutions management.

## src/app/(authenticated)/admin/events/page.tsx

- **Summary:** This page provides an administrative interface for managing church events. It allows administrators to add new events, edit existing event details, and delete events. It displays a table of all existing events with their details, including title, date, location, type, and image.

## src/app/(authenticated)/admin/financials/page.tsx

- **Summary:** This page provides an administrative interface for managing church financial records. It allows administrators to add new financial records (linked to events, with budget, expenses, and revenue), edit existing records, and delete records. It displays a table of all existing financial records with net calculations.

## src/app/(authenticated)/admin/institutions/page.tsx

- **Summary:** This page provides an administrative interface for managing church-owned institutions. It allows administrators to add new institutions, edit existing institution details, and delete institutions. It displays a table of all existing institutions with their details, including name, type, description, address, contact information, and an optional image.

## src/app/finance-administrator/donation-plans/[id]/page.tsx

- **Summary:** This page displays the details of a specific donation plan for finance administrators. It shows the plan's name, description, goal, image, type, and a list of associated transactions. It also allows administrators to edit the plan's details and delete the plan.

## src/app/(authenticated)/admin/bible-reading-plans/[id]/page.tsx

- **Summary:** This page provides an administrative interface for managing lessons within a specific Bible reading plan. It displays a list of lessons, allows administrators to add new lessons, edit existing lessons, and delete lessons.

## src/app/(authenticated)/admin/bible-reading-plans/page.tsx

- **Summary:** This page provides an administrative interface for managing Bible reading plans. It allows administrators to create new plans, edit existing plans (title and description), and delete plans. It also provides a link to manage lessons for each plan.

## src/app/(authenticated)/kids-teens-resources/page.tsx

- **Summary:** This page displays a public list of curated resources for kids, teens, and parents. It allows users to search and filter resources by type, and features sections for "Community Picks" and "Recently Added" resources.

## src/app/(authenticated)/admin/media/page.tsx

- **Summary:** This page provides an administrative interface for managing church media assets. It allows administrators to add new media assets (images, videos, audio, documents), edit existing asset details, and delete assets. It displays a paginated list of media assets with search functionality, type icons, and previews.

## src/app/(authenticated)/admin/ministries/[id]/page.tsx

- **Summary:** This page provides a detailed administrative view for a specific church ministry. It displays core ministry information (name, description, leader, photo, member count, event count) and features a tabbed interface to manage ministry members (add/remove) and events (create/edit/delete).

## src/app/(authenticated)/admin/ministries/page.tsx

- **Summary:** This page provides a comprehensive administrative interface for managing church ministries. It allows administrators to create, edit, and delete ministries, including details like name, description, leader, and a photo. It displays a table of all existing ministries and provides links to view detailed ministry pages.

## src/app/(authenticated)/admin/newsletter/page.tsx

- **Summary:** This page provides an administrative interface for composing and sending newsletters. It allows administrators to enter a subject and HTML content for the newsletter body, and then send it to subscribed users.

## src/app/(authenticated)/admin/outreach/page.tsx

- **Summary:** This page provides an administrative interface for managing church outreach programs. It allows administrators to add new programs, edit existing program details, and delete programs. It displays a table of all existing outreach programs.

## src/app/(authenticated)/admin/pastoral-care/page.tsx

- **Summary:** This page provides an administrative interface for managing pastoral care sessions. It allows administrators to add new counseling sessions, edit existing session details (counselor, client, date, status, notes, progress), and delete sessions. It displays a table of all existing sessions with their details and status.

## src/app/(authenticated)/admin/prayer-requests/page.tsx

- **Summary:** This page provides an administrative interface for managing community prayer requests. It requires the user to have the `PRAYER_MANAGER` role. It displays a list of prayer requests, allows administrators to update the status of a request, and initiate an audio prayer room for "Ongoing" requests.

## src/app/(authenticated)/admin/preaching-calendar/page.tsx

- **Summary:** This page provides an administrative interface for managing the church's preaching calendar. It displays sermons in a calendar view (month, week, day, agenda), allows scheduling new sermons, and editing existing sermon details.

## src/app/(authenticated)/admin/users/page.tsx

- **Summary:** This page provides a comprehensive administrative interface for managing church users. It allows administrators to add, edit, and delete users, and assign multiple roles to them. It displays a table of all existing users with their details.

## src/app/(authenticated)/admin/role-management/page.tsx

- **Summary:** This page provides an administrative interface for managing user roles and permissions. It allows administrators to assign/change roles for any user and revoke specific roles from users. It displays a table of users with privileged roles.

## src/app/(authenticated)/bible-reading-plans/page.tsx

- **Summary:** This page displays a list of available Bible reading plans for authenticated users. It fetches the plans from an API and presents them in a card format.

## src/app/(authenticated)/bible-study/page.tsx

- **Summary:** This page displays a list of available Bible study programs for authenticated users. It fetches the studies from an API and presents them in a card format.

## src/app/(authenticated)/chat/page.tsx

- **Summary:** This page provides a real-time community chat interface for authenticated users. It uses Socket.IO for real-time messaging, supports native browser notifications and push notifications, and displays community guidelines and total members.

## I will remove this page

## src/app/(authenticated)/children-youth-director/page.tsx

- **Summary:** This page serves as the Discipleship & Safety Management Hub for Children and Youth Directors. It features a collapsible sidebar for navigation between different management sections, including Ministry Program Management, Volunteer Coordination, Family Engagement, and Safety & Compliance.

## src/app/(authenticated)/communications-officer/create-blog-post/page.tsx

- **Summary:** This page provides an authenticated interface for creating or editing blog posts. It allows users to input a title, content (using a rich text editor), tags, and a cover image URL. It supports image uploads to Cloudinary and publishes/updates the blog post.

## src/app/(authenticated)/communications-officer/edit-blog-post/[id]/page.tsx

- **Summary:** This page provides an authenticated interface for editing existing blog posts. It fetches the blog post details based on the ID, allows users to modify the title, content (using a rich text editor), tags, and cover image URL. It supports image uploads to Cloudinary and updates the blog post.

## src/app/(authenticated)/communications-officer/page.tsx

- **Summary:** This page serves as the dashboard for the Communications Officer. It displays lists of announcements and blog posts, and includes sections for creating new announcements and blog posts. It fetches data from API endpoints for announcements and blog posts.

## src/app/(authenticated)/dashboard/page.tsx

- **Summary:** This page serves as the main spiritual dashboard for authenticated users. It displays a personalized welcome message and presents various user-specific data in a card-based layout, including user profile, upcoming events, recent sermons, giving history, Bible study progress, prayer requests, counseling sessions, and baptism application status.

## src/app/(authenticated)/discipleship-leader/page.tsx

- **Summary:** This page serves as the Spiritual Formation & Growth Tracking dashboard for Discipleship Leaders. It features a collapsible sidebar for navigation between different management sections, including Discipleship Management, Curriculum Builder, Progress Tracking, Small Groups, Sacramental Preparation, and Seasonal Planning.

## src/app/(authenticated)/counseling-coordinator/page.tsx

- **Summary:** This page serves as the dashboard for the Counseling Coordinator. It displays lists of counseling sessions and support groups, and includes a section for "Resource Coordination".

## src/app/(authenticated)/discussion-forums/[topicId]/page.tsx

- **Summary:** This page displays a specific discussion forum topic and its associated posts. It allows authenticated users to submit new posts, provide feedback on the topic and posts, and view embedded media.

## src/app/(authenticated)/discussion-forums/page.tsx

- **Summary:** This page serves as the main page for community discussions and forums. It displays a list of discussion topics and allows authenticated users to create new topics and provide feedback (like/dislike) on them.

## src/app/(authenticated)/events-manager/eventdashboard/page.tsx

- **Summary:** This page serves as the Event Lifecycle Management Dashboard for Event Managers. It features a collapsible sidebar for navigation between different event management sections, including Event Calendar, Resource Allocation, Participant Management, Financial Oversight, Sponsorship Management, and Post-Event Analysis.

## src/app/(authenticated)/events-manager/inbox/page.tsx

- **Summary:** This page provides an inbox for Event Managers to manage their messages. It displays messages, allows marking them as read or deleting them, and supports push notifications for new messages.

## src/app/(authenticated)/events-manager/page.tsx

- **Summary:** This page serves as the main dashboard for Event Managers. It displays summary metrics for total events, budget, sponsors, and unread messages. It also provides quick navigation links and sections for upcoming events, financial overview, and top sponsors.

## src/app/(authenticated)/events/page.tsx

- **Summary:** This page displays a list of upcoming church events for authenticated users. It fetches event data from an API and presents each event in a card format.

## src/app/(authenticated)/family-life/page.tsx

- **Summary:** This page displays resources and events aimed at strengthening family bonds and spiritual growth for authenticated users. It fetches family-related event data and presents it in a card format.

## src/app/(authenticated)/family/page.tsx

- **Summary:** This page provides an interface for managing family units within the church community. It allows authenticated users to create new family units, add existing users as members, and remove members. It displays lists of "Your Family Units" and "All Family Units".

## src/app/(authenticated)/finance-administrator/page.tsx

- **Summary:** This page serves as the Finance Administrator dashboard, providing a central hub for managing church finances. It features a collapsible sidebar for navigation between different financial management sections, including Contribution Management, Financial Oversight, Reporting & Compliance, and Online Giving Optimization.

## src/app/(authenticated)/livestream-integration/page.tsx

- **Summary:** This page serves as a placeholder for livestream integration and currently displays a "Coming Soon!" message, indicating that the feature is under development.

## src/app/(authenticated)/member-profile/page.tsx

- **Summary:** This page provides an authenticated interface for users to view and manage their personal profile information. It displays various profile details (name, email, phone, address, etc.), allows editing, and shows the user's giving history and volunteer schedules.

## src/app/(authenticated)/members/[id]/page.tsx

- **Summary:** This page displays a detailed profile page for a specific church member. It dynamically fetches user data and presents comprehensive user information including contact details, membership details, and Christian status.

## src/app/(authenticated)/ministry-coordinator/page.tsx

- **Summary:** This page serves as the main dashboard for Ministry Coordinators, providing a central hub for managing all ministries. It features a collapsible sidebar for navigation between different management sections, including Ministry Overview, Budget Monitoring, Performance Dashboard, Inter-Ministry Coordination, Ministry Health Monitoring, and Volunteer Management.

## src/app/(authenticated)/ministry/[id]/page.tsx

- **Summary:** This page provides a detailed view of a specific church ministry for authenticated users. It displays core ministry information, including members and events, and allows authenticated users to join the ministry or send a message to the leader.

## src/app/(authenticated)/ministry/page.tsx

- **Summary:** This page displays a public list of all church ministries. It fetches ministry data and presents each ministry in a visually appealing card format.

## src/app/(authenticated)/outreach-director/page.tsx

- **Summary:** This page serves as the Mission & Outreach Hub dashboard for Outreach Directors. It features a collapsible sidebar for navigation between different management sections, including Mission Trips, Fundraising Progress, Missionary Support, Outreach Coordination, Reporting Tools, and Partnership Portal.

## src/app/(authenticated)/prayer-wall/page.tsx

- **Summary:** This page provides a public prayer wall interface for authenticated users to share and engage with prayer requests. It displays a list of community prayer requests and allows users to submit new requests or join an audio prayer room.

## src/app/(authenticated)/profile/page.tsx

- **Summary:** This page serves as a consolidated profile page for authenticated users. It renders components to display core personal information, family unit details, and membership status.

## src/app/(authenticated)/resources/page.tsx

- **Summary:** This page displays a list of available church resources for authenticated users. It fetches resource data and presents each resource in a card format.

## src/app/(authenticated)/secretary/bookings/page.tsx

- **Summary:** This page serves as a placeholder page for managing facility and equipment bookings for the Secretary and currently displays a message indicating that the booking management tools are under development.

## src/app/(authenticated)/secretary/inbox/page.tsx

- **Summary:** This page provides an inbox for the Secretary to manage messages. It displays messages, allows marking them as read or deleting them, and supports push notifications.

## src/app/(authenticated)/secretary/page.tsx

- **Summary:** This page serves as the Administrative Command Center for the Secretary. It features a collapsible sidebar for navigation between different management sections, including Centralized Communication Hub, Calendar & Scheduling, Document Management, and Member Services.

## src/app/(authenticated)/senior-pastor/page.tsx

- **Summary:** This page serves as the Senior Pastor's Dashboard, providing oversight of spiritual growth and church leadership. It features a collapsible sidebar for navigation between different management sections, including Spiritual Oversight, Communication Hub, and Administrative Tools.

## src/app/(authenticated)/small-group-leader/page.tsx

- **Summary:** This page serves as the Small Group Leader Dashboard. It provides an interface for managing small groups, including fetching and displaying group data. It also mentions sections for member care and resource distribution.

## src/app/(authenticated)/tech-media-manager/page.tsx

- **Summary:** This page serves as the Tech & Media Manager Dashboard. It displays media assets and mentions sections for live streaming and broadcast management, and website and app maintenance.

## src/app/(authenticated)/testimonials/page.tsx

- **Summary:** This page displays community testimonials. Authenticated users can submit new testimonials, and all testimonials are displayed in a card format.

## src/app/(authenticated)/volunteer-coordinator/page.tsx

- **Summary:** This page serves as the Volunteer Recruitment & Management Hub for Volunteer Coordinators. It features a collapsible sidebar for navigation between different management sections, including Volunteer Recruitment, Scheduling & Deployment, Volunteer Engagement, and Reporting & Analytics.

## src/app/(authenticated)/worship-leader/dashboard/page.tsx

- **Summary:** This page is a placeholder for the Worship Leader Dashboard and currently displays a "This page is under construction" message.

## src/app/(authenticated)/worship-leader/page.tsx

- **Summary:** This page serves as the Worship Leader Dashboard. It allows managing worship services (add, edit), tracking attendance for selected services, and includes components for worship team management, resource management, announcements, song proposals, and various analytics charts (service duration, team participation, top songs). It also has sections for live stream and song arrangement.

## src/app/about/page.tsx

- **Summary:** This page provides information about the church, its mission, and its dedication to serving God and neighbors.

## src/app/AdminCommandCenterDashboard/page.tsx

- **Summary:** This page serves as the Administrative Command Center Dashboard. It features a collapsible sidebar for navigation between different management sections, including Communication Hub, Calendar & Scheduling, Document Management, and Member Services.

## src/app/ask-the-pastor/page.tsx

- **Summary:** This page allows authenticated users to submit questions to the pastor and view previously submitted questions.

## src/app/blog/page.tsx

- **Summary:** This page displays a list of blog posts. It fetches blog post data and presents each post in a card format with a link to read more.

## src/app/BrandEngagementHubDashboard/page.tsx

- **Summary:** This page serves as the Brand Stewardship & Multiplatform Engagement Hub. It features a collapsible sidebar for navigation between different management sections, including Content Creation & Distribution, Congregation Engagement, Analytics & Optimization, and Crisis Communication.

## src/app/canvas-designs/[id]/page.tsx

- **Summary:** This page displays a detailed view of a specific canvas design. It fetches design data based on the ID parameter and renders a `ClientCanvasEditor` component to display the design.

## src/app/contact/page.tsx

- **Summary:** This page provides contact information for the church, including email, phone, and address.

## src/app/denied/page.tsx

- **Summary:** This page is displayed when a user attempts to access a page without the necessary permissions. It informs the user that access is denied and provides a link to the login page.

## src/app/devotionals/page.tsx

- **Summary:** This page displays a list of daily devotionals. It fetches devotional data and presents each devotional in a card format with a link to read it.

## src/app/DigitalHubDashboard/page.tsx

- **Summary:** This page serves as the Digital Infrastructure and Content Production Hub. It features a collapsible sidebar for navigation between different management sections, including Stream Control, Media Production, Digital Assets, Website Maintenance, and Tech Support.

## src/app/DiscipleshipHubDashboard/page.tsx

- **Summary:** This page serves as the Discipleship & Community Building Hub. It features a collapsible sidebar for navigation between different management sections, including Group Facilitation, Member Care, Resource Distribution, Communication Channels, and Manage Themes. It fetches and displays data related to discipleship activities.

## src/app/docs-gpt5/page.tsx

- **Summary:** This page demonstrates a Tiptap Rich Text Editor. It allows users to input and edit content, and displays the HTML output.

## src/app/docs-grok/page.tsx

- **Summary:** This page provides a dynamic document builder. It allows users to add and edit elements (headings, paragraphs) with styling and animations, and export the document to various formats (HTML, Text, PDF, DOCX).

## src/app/donations/page.tsx

- **Summary:** This page allows users to make online donations. It displays various donation plans (funds, projects) with their progress, and allows users to select a specific fund or make a general donation. It integrates with a donation form for processing payments.

## src/app/event-rsvp/page.tsx

- **Summary:** This page allows users to RSVP for events and, for event managers, to check in participants. It fetches event details and existing RSVPs, and allows users to update their RSVP status, guest count, and notes. Event managers can select an event and mark participants as "Attended".

## src/app/events-manager/dashboard/[id]/page.tsx

- **Summary:** This page provides a detailed view of a specific event for event managers. It displays event details, attendees, sponsors, and financial information in a tabbed interface.

## src/app/events-manager/dashboard/page.tsx

- **Summary:** This page serves as the main dashboard for Event Managers. It displays a list of events with their details and provides links to view RSVPs for each event.

## src/app/events/[id]/page.tsx

- **Summary:** This page displays a detailed view of a specific event for public users. It shows event title, type, description, date, location, and an image. It also provides a button to RSVP for the event.

## src/app/events/page.tsx

- **Summary:** This page displays a list of upcoming church events for public users. It fetches event data and presents each event in a card format with a link to view more details.

## src/app/grok-editor/page.tsx

- **Summary:** This page provides a canvas editor for creating designs. It dynamically imports the `CanvasEditor` component.

## src/app/institutions/page.tsx

- **Summary:** This page displays a list of church-owned institutions. It fetches institution data and presents each institution in a card format with details like name, type, description, address, contact info, and an image.

## src/app/login/page.tsx

- **Summary:** This page provides a login interface for users. It allows users to log in with their email and password, or via Google. It handles login attempts and redirects to the dashboard upon successful login.

## src/app/media/page.tsx

- **Summary:** This page displays a media gallery of church assets. It fetches media assets (images, videos, audio) and renders them in a card format, allowing users to view them.

## src/app/newsletter-subscriptions/page.tsx

- **Summary:** This page allows users to subscribe to the church newsletter. It collects the user's email address and submits it to an API for subscription.

## src/app/page.tsx

- **Summary:** This is the main homepage of the church website. It features a hero banner, sections for church mission, featured services (Bible Study, Community, Sermons), weekly inspiration (verse and theme), accomplishments, upcoming events, and a call to action. It also includes a header with navigation and a footer. It fetches weekly theme, projects, and events data.

## src/app/partnerships/page.tsx

- **Summary:** This page displays a list of the church's partnerships. It fetches partner data and presents each partner in a card format with details like name, type, contact, and a link to an MOU.

## src/app/polls/page.tsx

- **Summary:** This page allows users to participate in community polls. Authenticated users can create new polls, vote on existing polls, and view poll results.

## src/app/projects/page.tsx

- **Summary:** This page displays a public list of the church's community projects. It fetches project data, including fundraising goals and progress, and presents each project in a card format. It also includes pagination and links to donate or volunteer for specific projects.

## src/app/services/page.tsx

- **Summary:** This page displays a list of the church's services. It fetches service data and presents each service in a card format with details like title, date, location, and type.

## src/app/signup/page.tsx

- **Summary:** This page provides a signup interface for new users. It allows users to create an account with their name, email, and password. Upon successful signup, it redirects the user to the login page.

## src/app/testimonies-wall/page.tsx

- **Summary:** This page displays a wall of testimonies from community members. Authenticated users can submit new testimonies, and all testimonies are displayed in a card format.

## src/app/(authenticated)/volunteering/[id]/page.tsx

- **Summary:** This page displays a detailed view of a specific volunteering opportunity. It allows authenticated users to apply for the opportunity, view their application status, and withdraw pending applications. It also shows details like required people, type, and custom fields.

## src/app/admin/projects/page.tsx

- **Summary:** This page provides an administrative interface for managing church community projects. It allows administrators to create, edit, and delete projects, including details like title, description, fundraising goals, and images. It also integrates with donation plans and volunteering opportunities.

## src/app/admin/volunteering/[id]/page.tsx

- **Summary:** This page provides an administrative interface for reviewing and managing applications for a specific volunteering opportunity. It displays applicant details, allows administrators to update application status (Pending, Approved, Rejected), and add coordinator notes.

## src/app/(authenticated)/discipleship/theme-of-the-week/manage/page.tsx

- **Summary:** This page provides an administrative interface for managing weekly themes. It allows administrators to view, edit, and delete existing themes, and navigate to a page for creating new themes. It displays theme details such as title, verse, and reference.

## src/app/(authenticated)/discipleship/theme-of-the-week/create/page.tsx

- **Summary:** This page provides an authenticated interface for creating new weekly themes. Users can input a title, verse, and reference for the new theme, which is then submitted via an API.

## Testing Summary for Bible Reading Plans Feature

### 1. Admin: Bible Reading Plans List

- **URL:** `/admin/bible-reading-plans`
- **What to test:**
  - Can you successfully **create** a new Bible Reading Plan?
  - Can you **edit** the title and description of an existing plan?
  - Does the **delete** button work correctly (with the confirmation dialog)?
  - Does clicking the **"Manage Lessons"** button take you to the correct page for that specific plan?

### 2. Admin: Lesson Management Page

- **URL:** `/admin/bible-reading-plans/[some-id]`
- **What to test:**
  - After clicking "Manage Lessons," does this page load and show the correct plan title?
  - Can you **add** a new lesson to the plan?
  - Can you **edit** the content of an existing lesson?
  - Can you **delete** a lesson from the plan?

### 3. Public: Bible Reading Plans Page

- **URL:** `/bible-reading-plans`
- **What to test:** - Verify that the plans you create and edit in the admin section appear correctly on this public-facing page for users to see.

      todo remove

  ##src/app/api/upload/route.ts