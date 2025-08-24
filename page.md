
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

      

  
## src/app/(authenticated)/music-proposals/page.tsx

- **Summary:** This page provides an interface for authenticated users to suggest songs for church worship services or events. Users can search for songs (integrating with an external API for search results and audio previews), manually enter song details, and submit their proposals. The page displays a list of previously submitted proposals, including details like the song title, artist, proposer, and optional YouTube/Spotify links with embedded YouTube video playback. It also outlines guidelines for submitting proposals and includes a placeholder for "Top Requested Songs."

## src/app/(discipleship_leader)/admin/courses/[courseId]/page.tsx

- **Summary:** This page provides a detailed administrative view for a specific Bible study course. It displays key course information such as title, description, start and end dates, and various statistics including total lessons, total enrollments, completion rate, and active students. It also provides options to edit or duplicate the course and includes a tabbed interface (`CourseTabs`) for managing course-related data like lessons and enrollments.

## src/app/(discipleship_leader)/admin/page.tsx

- **Summary:** This page serves as the administrative dashboard for managing Bible study courses. It displays an overview of all courses, including total courses, total lessons, and total enrollments. It allows administrators to create new courses, manage existing courses (view details, edit, duplicate), and provides quick links to analytics and schedule management. If no courses are found, it prompts the user to create the first course.

## src/app/(admin)/(futuristic-pages)/docs-gpt5/page.tsx

- **Summary:** This page demonstrates a Tiptap Rich Text Editor. It allows users to input and edit content using a rich text editor interface and displays the corresponding HTML output in real-time.

## src/app/(admin)/(futuristic-pages)/docs-grok/page.tsx

- **Summary:** This page provides a dynamic document builder interface. Users can add various elements like headings and paragraphs, customize their styling (color, font size, style, decoration), and apply animations. The page offers a live preview of the document and allows users to export the generated content into multiple formats, including HTML, plain text, PDF, and DOCX.

## src/app/(admin)/(futuristic-pages)/grok-editor/page.tsx

- **Summary:** This page serves as a canvas editor, dynamically importing the `CanvasEditor` component. It provides an interface for creating and manipulating visual designs or layouts.

## src/app/(admin)/admin/devotionals/page.tsx

- **Summary:** This page provides an administrative interface for managing daily devotionals. Administrators can create new devotionals by providing a title, verse, and reference. They can also edit existing devotionals and delete them. The page displays a list of all devotionals in a card format, showing their title, verse, reference, and creation date.

## src/app/(admin)/admin/projects/page.tsx

- **Summary:** This page provides an administrative interface for managing church community projects. Administrators can create, edit, and delete projects, including details like title, description, fundraising goals, and banner images. It displays a table of all existing projects, showing their progress, and links to associated donation plans and volunteering opportunities. Authenticated users can also apply to projects, providing notes for their application.

## src/app/(admin)/AdminCommandCenterDashboard/page.tsx

- **Summary:** This page serves as the Administrative Command Center Dashboard, providing a centralized interface for church administration. It features a collapsible sidebar for navigation between different management sections: Communication Hub, Calendar & Scheduling, Document Management, and Member Services. Each section dynamically renders its respective component, offering tools for various administrative tasks.

## src/app/(authenticated)/announcements/page.tsx

- **Summary:** This page displays a list of public announcements from the church. It fetches announcement data, including title, content, URL, tags, and creation date, and presents them in a card-based layout. Users can view the details of each announcement and follow external links if provided.

## src/app/(authenticated)/bible-study/[courseId]/page.tsx

- **Summary:** This page displays the details of a specific Bible study course for authenticated users. It shows the course title, description, duration, number of lessons, and enrolled students. If the user is not enrolled, an "Enroll" button is displayed. Once enrolled, the page shows the user's progress through the lessons, marking completed lessons and allowing access to individual lesson pages. Lessons are locked until the user enrolls in the course.

## src/app/(authenticated)/bible-study/lesson/[lessonId]/page.tsx

- **Summary:** This page displays the content of a specific Bible study lesson for authenticated users. It fetches and renders the lesson's text content, and can include optional PDF notes, visual aids (images), and external resource links. If the lesson includes questions, it presents an interactive quiz to test the user's knowledge. After submitting the quiz, it provides a score and feedback.

## src/app/(authenticated)/member-financial-support/page.tsx

- **Summary:** This page provides a confidential form for authenticated members to request financial assistance from the church. Users can input their name, email (pre-filled if logged in), optional phone number, the requested amount, and a detailed reason for the request. The form includes validation, tracks submission progress, and displays a confirmation modal upon successful submission.

## src/app/(authenticated)/member/[id]/page.tsx

- **Summary:** This page displays a detailed profile for a specific church member, accessible by their ID. It fetches and presents comprehensive user information including their name, email, phone, address, membership date, birthdate, and assigned roles. It also indicates if the member is Christian and displays their profile picture.

## src/app/(authenticated)/my-certificates/page.tsx

- **Summary:** This page displays a collection of certificates earned by the authenticated user through their participation in Bible study courses and other church programs. It fetches and presents each certificate in a card format, showing details like the certificate type, associated course title, brief description, and issue date. Users can also download the PDF version of their certificates.

## src/app/(authenticated)/testimonies-wall/page.tsx

- **Summary:** This page serves as a "Wall of Testimonies" where authenticated users can share their personal stories of faith and inspiration. Users can submit new testimonies, optionally including an image, and view a chronological list of all submitted testimonies. Each testimony is displayed in a card format, showing the comment, an optional image, the user's name (or "Anonymous"), and the submission date.

## src/app/(authenticated)/worship-team/page.tsx

- **Summary:** This page serves as a central hub for the church's worship team. It provides various tabs for managing different aspects of worship, including an overview, songs, services, resources, and announcements. Team members can view song proposals, worship setlists, service schedules, and team-specific resources. It also features a chat modal for direct communication with the worship leader.

## src/app/(children_youth_director)/admin/kids-teens-resources/page.tsx

- **Summary:** This page provides an administrative interface for Children and Youth Directors to manage educational and fun resources for kids and teens. It allows them to add new resources (videos, audio, images, documents, activities) with titles, types, URLs, descriptions, and tags. Existing resources can be edited or deleted. The page displays a searchable and filterable grid of resources, each with an icon and color coding based on its type.

## src/app/(counselor)/counselor-dashboard/page.tsx

- **Summary:** This page serves as the dashboard for counselors, providing an overview and management tools for their assigned clients and counseling sessions. It displays statistics on total clients, upcoming sessions, and past sessions. Counselors can view details of their assigned clients, schedule new sessions, and manage existing sessions (view details, filter, search). It also integrates a pastoral care messaging system for communication.

## src/app/(discipleship_leader)/admin/courses/[courseId]/edit/page.tsx

- **Summary:** This page provides an administrative interface for Discipleship Leaders to edit the details of an existing Bible study course. Administrators can update the course's title, description, certificate frequency, and start and end dates. The page includes form validation, displays success or error messages, and redirects to the course details page upon successful update.

## src/app/(discipleship_leader)/admin/new/page.tsx

- **Summary:** This page provides an administrative interface for Discipleship Leaders to create new Bible study courses. It allows them to input a course title, description, certificate frequency, and start and end dates. The page also supports duplicating an existing course, pre-filling the form with the duplicated course's details. It includes form validation, displays success or error messages, and redirects to the newly created or duplicated course's details page upon successful submission.

## src/app/(discipleship_leader)/courses/discipleship/theme-of-the-week/create/page.tsx

- **Summary:** This page provides an administrative interface for Discipleship Leaders to create new "Theme of the Week" entries. It allows them to input a title for the theme, the full Bible verse text, and the corresponding Bible reference. The form includes validation for required fields and displays success or error messages. Upon successful creation, it redirects the user to the discipleship dashboard.

## src/app/(discipleship_leader)/courses/discipleship/theme-of-the-week/manage/page.tsx

- **Summary:** This page provides an administrative interface for Discipleship Leaders to manage "Theme of the Week" entries. It displays a list of existing themes, allowing administrators to view their title, verse, and reference. It also provides functionalities to create new themes, edit existing ones, and delete themes, with confirmation dialogs for deletion.

## src/app/(discipleship_leader)/DiscipleshipHubDashboard/page.tsx

- **Summary:** This page serves as the Discipleship & Community Building Hub for Discipleship Leaders. It features a collapsible sidebar for navigation between different management sections: Group Facilitation, Member Care, Resource Distribution, Communication Channels, and Manage Themes. It displays an overview of key metrics such as active groups, prayer requests, and resources. Each section dynamically renders its respective component, providing tools for managing discipleship activities and fostering community growth.

## src/app/(events_manager)/events-manager/dashboard/[id]/page.tsx

- **Summary:** This page provides a detailed view for Event Managers to manage RSVPs for a specific event. It displays event details (title, date, location, description) and a list of all participants who have RSVP'd. Event managers can view participant details, filter participants by status (confirmed, pending, cancelled), search by name or email, and export the participant list to a CSV file. It also shows RSVP statistics and event capacity.

## src/app/(events_manager)/events-manager/dashboard/page.tsx

- **Summary:** This page serves as the main dashboard for Event Managers. It provides an overview of all church events, displaying statistics such as total events, upcoming events, and the number of unique event types. Event managers can create new events, and view, search, and filter existing events by type and status (upcoming/past). Each event is presented in a card format with key details and a link to manage its RSVPs.

## src/app/(finance_administrator)/_budgets/page.tsx

- **Summary:** This page serves as a container for the `BudgetsContent` component, which is responsible for displaying and managing ministry budgets and financial oversight. It acts as a wrapper for the core budget management functionality.

## src/app/(finance_administrator)/finance-administrator/page.tsx

- **Summary:** This page serves as the Finance Administrator's dashboard, providing a central hub for managing church finances. It features a responsive layout with a sidebar for navigation between different financial management sections: Contribution Management, Financial Oversight, Reporting & Compliance, Online Giving Optimization, Financial Support Requests, Donation Plans, and Budgets. Each section dynamically renders its respective component, offering comprehensive tools for financial administration.

## src/app/(leadership)/admin/events/page.tsx

- **Summary:** This page provides an administrative interface for managing church events. It displays an overview of all events, including total, upcoming, and past events. Administrators can add new events, edit existing event details, and delete events. The page features search and filter functionalities (by event type) to easily manage the event list. Events are displayed in a table format with details like date, location, type, and an optional image.

## src/app/(leadership)/admin/institutions/page.tsx

- **Summary:** This page provides an administrative interface for managing church-owned institutions such as schools, kindergartens, vocational training centers, health clinics, and libraries. Administrators can add new institutions, edit existing institution details (name, type, description, address, contact info, and image), and delete institutions. The page displays a searchable and filterable list of institutions in a table format, along with statistics on different types of institutions.

## src/app/(leadership)/canvas-designs/[id]/page.tsx

- **Summary:** This page displays a specific canvas design based on its ID. It fetches the design's JSON data from an API and renders it using the `ClientCanvasEditor` component, allowing for viewing or further editing of the design. If the design is not found or an error occurs during fetching, it displays an appropriate message.

## src/app/(leadership)/financials/page.tsx

- **Summary:** This page provides an administrative interface for managing church financial records. It displays an overview of total budget, expenses, revenue, and net profit/loss. Administrators can add new financial records linked to specific events, including budget, expenses, and revenue figures. Existing records can be edited or deleted. The page features search and filter functionalities (by profit/loss status) to manage the financial data, presented in a table format.

## src/app/(leadership)/members/[id]/page.tsx

- **Summary:** This page displays a public profile for a specific church member, accessible by their ID. It presents various details about the member, including their name, contact information (email, phone, location), membership date, a short bio, ministries they are involved in, their skills, and any achievements within the church community. The page is designed with tabs to organize this information and includes options to share the profile or send a message.

## src/app/(leadership)/pastoral-care/page.tsx

- **Summary:** This page provides an administrative interface for managing pastoral care and counseling sessions. It displays an overview of session statistics (total, scheduled, completed, in progress). Administrators can add new counseling sessions by selecting a counselor and client, setting a date, status, notes, and progress. Existing sessions can be edited or deleted. The page features search and filter functionalities (by status) to manage the session list, presented in a table format.

## src/app/(leadership)/prayer-requests/page.tsx

- **Summary:** This page provides an administrative interface for managing community prayer requests. It displays an overview of prayer request statistics (total, pending, ongoing, prayed, urgent). Users with the `PRAYER_MANAGER` role can view, search, and filter prayer requests by status and urgency. They can also update the status of a request and initiate an audio prayer room for "Ongoing" requests.

## src/app/(leadership)/preaching-calendar/page.tsx

- **Summary:** This page serves as a client-side wrapper for the `PreachingCalendarClient` component. It dynamically imports and renders the `PreachingCalendarClient` component, which is responsible for displaying and managing the church's preaching calendar.

## src/app/(leadership)/role-management/page.tsx

- **Summary:** This page provides an administrative interface for managing user roles and permissions within the church system. It displays an overview of total users, privileged users, and available roles. Administrators can assign new roles to users, revoke existing roles, and view a list of all users with privileged roles. The page includes search and filter functionalities for users, and a reference guide detailing each role's name and description.

## src/app/(leadership)/users/page.tsx

- **Summary:** This page provides a comprehensive administrative interface for managing church users. It displays an overview of user statistics (total users, admins, members, guests). Administrators can view, search, and filter users by name, email, and role. It also allows for adding new users with details like name, email, password, phone, address, membership date, birthdate, photo URL, and assigning multiple roles. Existing user details can be edited, and users can be deleted.

## src/app/(outreach_director)/outreach-director/page.tsx

- **Summary:** This page serves as a client-side wrapper for the `OutreachDirectorDashboardClient` component. It dynamically imports and renders the `OutreachDirectorDashboardClient` component, which is responsible for displaying the main dashboard for Outreach Directors.

## src/app/(outreach_director)/outreach/page.tsx

- **Summary:** This page serves as a client-side wrapper for the `OutreachClient` component. It dynamically imports and renders the `OutreachClient` component, which is responsible for displaying and managing outreach programs and activities.

## src/app/(overall_ministries_coordinator)/admin/ministries/[id]/page.tsx

- **Summary:** This page provides a detailed administrative view for a specific church ministry. It displays core ministry information such as its name, description, leader, and photo. It features a tabbed interface to manage ministry members (add/remove) and events (create/edit/delete). The page also provides an overview of the number of members and upcoming events associated with the ministry.

## src/app/(overall_ministries_coordinator)/admin/ministries/page.tsx

- **Summary:** This page provides a comprehensive administrative interface for managing church ministries. It allows administrators to create new ministries, edit existing ministry details (name, description, leader, and photo), and delete ministries. The page displays a searchable list of all ministries in a table format, along with pending join requests from users. Administrators can approve or reject these join requests.

## src/app/(public)/blog/[id]/page.tsx

- **Summary:** This page displays a single blog post in detail. It dynamically fetches blog post content based on the provided ID, including the title, author, published date, tags, cover image, and the main content. The page renders the content, provides options to share the post on social media, and allows navigation back to the main blog listing.

## src/app/(public)/donors/page.tsx

- **Summary:** This page displays a "Wall of Gratitude" showcasing the church's donors and their contributions. It provides an overview of total donations, unique donors, and the total amount raised. The page lists individual donor records, including the donor's name, date of donation, amount, and the associated donation plan. It serves to celebrate and acknowledge the generous hearts supporting the church's mission.

## src/app/(public)/financial-support/page.tsx

- **Summary:** This page provides a public form for church members to request financial assistance. Users can optionally provide their name, email, and phone number, and are required to specify the amount requested and the reason for their request. The page emphasizes confidentiality and outlines the process for reviewing requests. It also includes an inspirational Bible verse.

## src/app/(public)/ministries/[id]/page.tsx

- **Summary:** This page displays detailed information about a specific church ministry for public viewing. It includes the ministry's name, description, leader, and an optional photo. It also shows the number of members and lists upcoming events associated with the ministry. Authenticated users can send a request to join the ministry, with a status indicator if a request is pending or approved.

## src/app/(public)/ministries/page.tsx

- **Summary:** This page displays a public list of all church ministries. It fetches ministry data, including name, description, leader, photo, and member count, and presents each ministry in a visually appealing card format. Each card provides a brief overview and a link to a detailed ministry page.

## src/app/(public)/donations/page.tsx

- **Summary:** This page allows public users to make online donations to the church. It displays various donation plans (funds, projects) with their progress towards fundraising goals. Users can select a specific fund to donate to or contribute to a general church fund. The page provides an overview of total donations, unique donors, and total amount raised, and integrates with a donation form for processing payments.

## src/app/(public)/livestream-integration/page.tsx

- **Summary:** This page provides a live streaming platform for church services and events. It dynamically fetches stream data, displays the live video feed, and shows the current viewer count. When the stream is offline, it presents a countdown to the next scheduled stream and options to be notified when it goes live. The page also includes basic stream information and audience statistics.

## src/app/(public)/newsletter-subscriptions/page.tsx

- **Summary:** This page allows public users to subscribe to the church's newsletter. It provides a simple form where users can enter their email address. Upon submission, it sends the email to an API for subscription and displays a success or error message. The page is designed to encourage users to stay updated with church news, sermons, and events.

## src/app/(public)/page.tsx

- **Summary:** This is the main homepage of the church website, designed to welcome visitors and provide an overview of the church's mission and activities. It features a prominent hero banner, sections highlighting the church's mission, featured services (Bible Study, Community, Sermons), and a "Weekly Inspiration" section displaying a Bible verse and theme. The page also showcases church accomplishments, upcoming events, and includes calls to action for joining services or learning more. It dynamically fetches data for the weekly theme, projects, and events.

## src/app/(public)/partnerships/page.tsx

- **Summary:** This page showcases the church's partnerships with various organizations. It fetches and displays a list of partners, including their name, type, contact information, and an optional link to their Memorandum of Understanding (MOU). The page aims to highlight collaborations that expand the church's reach and impact within the community and beyond.

## src/app/(public)/projects/page.tsx

- **Summary:** This page displays a public list of the church's community projects. It fetches project data, including fundraising goals and progress, and presents each project in a card format. Users can view project details, including descriptions and images, and are provided with options to donate to specific projects or volunteer. The page includes pagination for navigating through multiple projects and displays loading and error states.

## src/app/(public)/services/page.tsx

- **Summary:** This page displays a public list of the church's services. It fetches service data, including title, date, location, and type, and presents each service in a card format. The page aims to inform visitors about the various worship opportunities and events offered by the church.

## src/app/(public)/signup/page.tsx

- **Summary:** This page provides a user registration interface for new members to create an account. Users can sign up by providing their name, email, and a password. Upon successful registration, the page displays a success message and automatically redirects the user to the login page. It includes basic form validation and error handling.

## src/app/(senior_pastor)/admin-dashboard/page.tsx

- **Summary:** This page serves as the main administrative dashboard for Senior Pastors, providing a high-level overview of key church metrics. It displays statistics such as total users, ministries, events, and donations. The dashboard also offers quick navigation links to various management sections, including User Management, Ministry Management, Event Management, Financial Overview, Outreach Programs, Pastoral Care, Role Management, and Institutions Management.

## src/app/(senior_pastor)/baptism-candidates/page.tsx

- **Summary:** This page serves as a container for the `BaptismCandidatesList` component, which is responsible for displaying and managing baptism candidates. It provides an administrative view for senior pastors to oversee the baptism process.

## src/app/(senior_pastor)/certificate-generator/page.tsx

- **Summary:** This page provides an administrative interface for Senior Pastors to generate various church certificates (e.g., Baptism, Membership, Dedication, Course Completion). Users can input recipient details, event information, pastor's name, church details, and an optional personalized message or church logo. The page generates a PDF preview of the certificate, uploads it to Cloudinary, and allows the administrator to assign the certificate to a specific user within the system.

## src/app/(senior_pastor)/certificates-view/page.tsx

- **Summary:** This page serves as a client-side wrapper for the `CertificatesViewClient` component. It dynamically imports and renders the `CertificatesViewClient` component, which is responsible for displaying and managing church certificates.

## src/app/(tech_media_manager)/tech-media-manager/page.tsx

- **Summary:** This page serves as the dashboard for the Tech & Media Manager. It provides an overview of media assets, including a list of uploaded assets with their titles, types, and tags. The page also highlights key areas of responsibility for the role, such as live streaming and broadcast management, and website and app maintenance, indicating where further functionalities would be integrated.

## src/app/(volunteer_coordinator)/VolunteerHubDashboard/page.tsx

- **Summary:** This page serves as the Volunteer Coordinator Dashboard, providing tools for managing volunteering opportunities and applications. Coordinators can create, edit, and delete opportunities, specifying details like title, description, type, required people, location, time commitment, and custom fields. It displays a searchable and filterable list of opportunities, along with a separate tab for managing volunteer applications. Coordinators can review application details, update their status (pending, approved, rejected), add notes, and assign the "COUNSELOR" role to approved applicants if applicable.

## src/app/(volunteer_coordinator)/admin/volunteering/[id]/page.tsx

- **Summary:** This page provides a detailed administrative view of a specific volunteering opportunity. It displays comprehensive information about the opportunity, including its title, description, location, date, duration, required skills, and the coordinator's details. Crucially, it lists all applicants for the opportunity, showing their names, emails, and phone numbers, allowing the coordinator to review and manage applications.

## src/app/(volunteer_coordinator)/volunteer-coordinator/page.tsx

- **Summary:** This page serves as the Volunteer Coordinator Dashboard, providing a comprehensive hub for managing volunteer activities. It features a responsive layout with a collapsible sidebar for navigation between different management sections: Volunteer Recruitment, Scheduling & Deployment, Volunteer Engagement, and Reporting & Analytics. Each section dynamically renders its respective component, offering tools for overseeing the entire volunteer lifecycle, from recruitment and scheduling to engagement and performance tracking.

## src/app/(worship_leader)/worship-leader/page.tsx

- **Summary:** This page serves as the Worship Leader Dashboard, providing a comprehensive interface for managing worship services, teams, and resources. It features various tabs for different functionalities: managing services (add, edit, delete, track attendance), team management (view members, message them), resource management (select service for resources), analytics (service duration, team participation, top songs), song proposals, and live stream management. It also includes a chat modal for direct communication with team members. If a "Worship Ministry" does not exist, it prompts the leader to create one.
