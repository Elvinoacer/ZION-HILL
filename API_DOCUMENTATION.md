# API Documentation

This document lists all the API endpoints found in the project `src/app/api` directory.

**Total Endpoints:** 217

| Endpoint | Methods | Description |
| :--- | :--- | :--- |
| `/api/admin-command-center` | **GET, POST** | Manage Admin-command-center |
| `/api/admin-dashboard` | **GET, PUT** | Manage Admin-dashboard |
| `/api/admin/bible-study/course/[courseId]` | **GET** | Manage Admin Bible-study Course {courseid} |
| `/api/admin/budgets` | **GET, POST, PUT** | Manage Admin Budgets |
| `/api/admin/counseling` | **GET, PATCH** | Manage Admin Counseling |
| `/api/admin/expenses` | **GET, PUT** | Manage Admin Expenses |
| `/api/admin/financial-settings` | **GET, PUT** | Manage Admin Financial-settings |
| `/api/all-families` | **GET** | Manage All-families |
| `/api/analytics/service-duration` | **GET** | Manage Analytics Service-duration |
| `/api/analytics/team-participation` | **GET** | Manage Analytics Team-participation |
| `/api/analytics/top-songs` | **GET** | Manage Analytics Top-songs |
| `/api/announcements` | **GET, POST** | Manage Announcements |
| `/api/announcements/broadcast` | **POST** | Manage Announcements Broadcast |
| `/api/announcements/send` | **POST** | Manage Announcements Send |
| `/api/ask-the-pastor` | **DELETE, GET, POST, PUT** | Manage Ask-the-pastor |
| `/api/audit-logs` | **DELETE, GET, POST, PUT** | Manage Audit-logs |
| `/api/auth/forgot-password` | **POST** | Manage Auth Forgot-password |
| `/api/auth/generate-otp` | **POST** | Manage Auth Generate-otp |
| `/api/auth/resend-verification` | **POST** | Manage Auth Resend-verification |
| `/api/auth/reset-password` | **POST** | Manage Auth Reset-password |
| `/api/auth/verify-email` | **GET** | Manage Auth Verify-email |
| `/api/auth/verify-otp` | **POST** | Manage Auth Verify-otp |
| `/api/baptism-applications` | **POST** | Manage Baptism-applications |
| `/api/baptism-candidates` | **GET, PUT** | Manage Baptism-candidates |
| `/api/bible-reading-plans` | **DELETE, GET, POST, PUT** | Manage Bible-reading-plans |
| `/api/bible-reading-plans/[id]` | **GET** | Manage Bible-reading-plans {id} |
| `/api/bible-study` | **GET** | Manage Bible-study |
| `/api/bible-study/course` | **POST** | Manage Bible-study Course |
| `/api/bible-study/course/[courseId]` | **GET, PUT** | Manage Bible-study Course {courseid} |
| `/api/bible-study/course/[courseId]/enroll` | **POST** | Manage Bible-study Course {courseid} Enroll |
| `/api/bible-study/course/[courseId]/lesson` | **GET, POST** | Manage Bible-study Course {courseid} Lesson |
| `/api/bible-study/lesson/[lessonId]` | **DELETE, GET, PUT** | Manage Bible-study Lesson {lessonid} |
| `/api/bible-study/lesson/[lessonId]/question` | **GET, POST** | Manage Bible-study Lesson {lessonid} Question |
| `/api/bible-study/lesson/[lessonId]/submit` | **POST** | Manage Bible-study Lesson {lessonid} Submit |
| `/api/bible-study/lesson/reorder` | **POST** | Manage Bible-study Lesson Reorder |
| `/api/bible-study/my-certificates` | **GET** | Manage Bible-study My-certificates |
| `/api/bible-study/my-progress` | **GET** | Manage Bible-study My-progress |
| `/api/bible-study/question/[questionId]` | **DELETE, PUT** | Manage Bible-study Question {questionid} |
| `/api/birthday-wishes` | **GET, POST** | Manage Birthday-wishes |
| `/api/birthdays` | **GET** | Manage Birthdays |
| `/api/blog` | **DELETE, GET, POST, PUT** | Manage Blog |
| `/api/brand-engagement` | **GET, POST** | Manage Brand-engagement |
| `/api/canvas-designs` | **GET, POST** | Manage Canvas-designs |
| `/api/canvas-designs/[id]` | **GET, PUT** | Manage Canvas-designs {id} |
| `/api/certificate/[certificateId]/download` | **GET** | Manage Certificate {certificateid} Download |
| `/api/certificates` | **GET, POST** | Manage Certificates |
| `/api/certificates/[id]` | **DELETE** | Manage Certificates {id} |
| `/api/certificates/[id]/url` | **GET** | Manage Certificates {id} Url |
| `/api/certificates/public` | **GET** | Manage Certificates Public |
| `/api/church-admin` | **DELETE, GET, POST, PUT** | Manage Church-admin |
| `/api/counseling-requests` | **GET, POST** | Manage Counseling-requests |
| `/api/counseling-requests/[id]` | **PATCH** | Manage Counseling-requests {id} |
| `/api/counseling-sessions` | **DELETE, GET, POST, PUT** | Manage Counseling-sessions |
| `/api/counseling-topics` | **DELETE, GET, POST, PUT** | Manage Counseling-topics |
| `/api/counselor/clients` | **GET** | Manage Counselor Clients |
| `/api/counselor/sessions` | **GET** | Manage Counselor Sessions |
| `/api/counselors` | **DELETE, GET, POST** | Manage Counselors |
| `/api/courses/[courseId]` | **GET** | Manage Courses {courseid} |
| `/api/crisis-intervention` | **POST** | Manage Crisis-intervention |
| `/api/cron/send-birthday-notifications` | **POST** | Manage Cron Send-birthday-notifications |
| `/api/daily-rooms` | **POST** | Manage Daily-rooms |
| `/api/devotionals` | **DELETE, GET, POST, PUT** | Manage Devotionals |
| `/api/digital-hub` | **GET, POST** | Manage Digital-hub |
| `/api/discipleship` | **DELETE, GET, POST, PUT** | Manage Discipleship |
| `/api/discipleship-admin` | **GET, POST** | Manage Discipleship-admin |
| `/api/discipleship-safety` | **GET, POST** | Manage Discipleship-safety |
| `/api/discussion-forums` | **DELETE, GET, POST, PUT** | Manage Discussion-forums |
| `/api/discussion-forums/posts/[postId]/feedback` | **POST** | Manage Discussion-forums Posts {postid} Feedback |
| `/api/discussion-forums/posts/[postId]/user-feedback` | **GET** | Manage Discussion-forums Posts {postid} User-feedback |
| `/api/discussion-forums/topics` | **GET, POST** | Manage Discussion-forums Topics |
| `/api/discussion-forums/topics/[topicId]` | **DELETE, GET** | Manage Discussion-forums Topics {topicid} |
| `/api/discussion-forums/topics/[topicId]/feedback` | **POST** | Manage Discussion-forums Topics {topicid} Feedback |
| `/api/discussion-forums/topics/[topicId]/posts` | **GET, POST** | Manage Discussion-forums Topics {topicid} Posts |
| `/api/discussion-forums/topics/[topicId]/posts/[postId]/feedback` | **POST** | Manage Discussion-forums Topics {topicid} Posts {postid} Feedback |
| `/api/discussion-forums/topics/[topicId]/user-feedback` | **GET** | Manage Discussion-forums Topics {topicid} User-feedback |
| `/api/discussion-forums/topics/related` | **GET** | Manage Discussion-forums Topics Related |
| `/api/donation-plans` | **GET, POST** | Manage Donation-plans |
| `/api/donation-plans/[id]` | **DELETE, GET, PUT** | Manage Donation-plans {id} |
| `/api/donations` | **GET** | Manage Donations |
| `/api/donor-records` | **GET** | Manage Donor-records |
| `/api/email/send-pastoral-email` | **POST** | Manage Email Send-pastoral-email |
| `/api/event-rsvp` | **DELETE, GET, POST, PUT** | Manage Event-rsvp |
| `/api/events` | **DELETE, GET, POST, PUT** | Manage Events |
| `/api/events-manger-route` | **DELETE, GET, POST, PUT** | Manage Events-manger-route |
| `/api/events/[id]` | **PUT** | Manage Events {id} |
| `/api/events/dates` | **GET** | Manage Events Dates |
| `/api/events/rsvp` | **DELETE, GET, POST** | Manage Events Rsvp |
| `/api/families/search` | **GET** | Manage Families Search |
| `/api/family` | **GET, POST** | Manage Family |
| `/api/family-life` | **DELETE, GET, POST, PUT** | Manage Family-life |
| `/api/family/[familyId]/members` | **POST** | Manage Family {familyid} Members |
| `/api/fcm/send` | **POST** | Manage Fcm Send |
| `/api/fcm/subscribe` | **POST** | Manage Fcm Subscribe |
| `/api/feedback` | **POST** | Manage Feedback |
| `/api/financial-support` | **GET, POST** | Manage Financial-support |
| `/api/financial-support/[id]` | **PUT** | Manage Financial-support {id} |
| `/api/financials` | **DELETE, GET, POST, PUT** | Manage Financials |
| `/api/funds` | **DELETE, GET, POST, PUT** | Manage Funds |
| `/api/get-admin-course` | **GET** | Manage Get-admin-course |
| `/api/giving` | **GET** | Manage Giving |
| `/api/giving/[id]` | **DELETE, PUT** | Manage Giving {id} |
| `/api/giving/[id]/progress` | **GET** | Manage Giving {id} Progress |
| `/api/giving/analytics` | **GET** | Manage Giving Analytics |
| `/api/giving/giving` | **GET** | Manage Giving Giving |
| `/api/groups` | **GET, POST** | Manage Groups |
| `/api/institutions` | **DELETE, GET, POST, PUT** | Manage Institutions |
| `/api/intasend` | **POST** | Manage Intasend |
| `/api/intasend-checkout` | **POST** | Manage Intasend-checkout |
| `/api/intasend-webhook` | **POST** | Manage Intasend-webhook |
| `/api/kids-teens-resources` | **DELETE, GET, POST, PUT** | Manage Kids-teens-resources |
| `/api/lessons` | **POST** | Manage Lessons |
| `/api/lessons/[id]` | **DELETE, GET, PUT** | Manage Lessons {id} |
| `/api/link-preview` | **POST** | Manage Link-preview |
| `/api/livestream` | **GET, POST** | Manage Livestream |
| `/api/livestream-integration` | **DELETE, GET, POST, PUT** | Manage Livestream-integration |
| `/api/livestream/view` | **POST** | Manage Livestream View |
| `/api/media` | **DELETE, GET, POST, PUT** | Manage Media |
| `/api/member-profile` | **GET, PUT** | Manage Member-profile |
| `/api/member/giving-history` | **GET** | Manage Member Giving-history |
| `/api/member/giving-summary` | **GET** | Manage Member Giving-summary |
| `/api/members/[id]` | **GET** | Manage Members {id} |
| `/api/messages` | **DELETE, GET, POST, PUT** | Manage Messages |
| `/api/messages/[messageId]` | **DELETE** | Manage Messages {messageid} |
| `/api/metrics/spiritual-growth` | **GET** | Manage Metrics Spiritual-growth |
| `/api/ministries` | **GET, POST** | Manage Ministries |
| `/api/ministries/[id]/growth-data` | **GET** | Manage Ministries {id} Growth-data |
| `/api/ministries/check-membership` | **GET** | Manage Ministries Check-membership |
| `/api/ministry` | **DELETE, GET, POST, PUT** | Manage Ministry |
| `/api/ministry-join-requests` | **DELETE, GET, POST, PUT** | Manage Ministry-join-requests |
| `/api/ministry-members` | **DELETE, GET, POST** | Manage Ministry-members |
| `/api/ministry/add-member` | **POST** | Manage Ministry Add-member |
| `/api/mission-outreach` | **GET, POST** | Manage Mission-outreach |
| `/api/music-proposals` | **GET, POST** | Manage Music-proposals |
| `/api/newsletter-send` | **POST** | Manage Newsletter-send |
| `/api/newsletter-subscriptions` | **POST** | Manage Newsletter-subscriptions |
| `/api/newsletter-templates` | **GET** | Manage Newsletter-templates |
| `/api/outreach` | **DELETE, GET, POST, PUT** | Manage Outreach |
| `/api/outreach-programs` | **DELETE, GET, POST, PUT** | Manage Outreach-programs |
| `/api/parental-controls` | **GET, PUT** | Manage Parental-controls |
| `/api/participants` | **DELETE, GET, POST, PUT** | Manage Participants |
| `/api/partners` | **GET** | Manage Partners |
| `/api/partnerships` | **DELETE, GET, POST, PUT** | Manage Partnerships |
| `/api/pastoral-care` | **DELETE, GET, POST, PUT** | Manage Pastoral-care |
| `/api/pastoral-care-analytics/followups` | **GET** | Manage Pastoral-care-analytics Followups |
| `/api/pastoral-care-analytics/trends` | **GET** | Manage Pastoral-care-analytics Trends |
| `/api/pastoral-care/messages/inbox` | **GET** | Manage Pastoral-care Messages Inbox |
| `/api/pastoral-care/messages/send` | **POST** | Manage Pastoral-care Messages Send |
| `/api/pastoral-care/messages/unread-count` | **GET** | Manage Pastoral-care Messages Unread-count |
| `/api/pastors-desk` | **DELETE, GET, POST, PUT** | Manage Pastors-desk |
| `/api/polls` | **GET, POST** | Manage Polls |
| `/api/prayer-chain/activate` | **POST** | Manage Prayer-chain Activate |
| `/api/prayer-requests` | **GET** | Manage Prayer-requests |
| `/api/prayer-requests/[id]` | **PATCH** | Manage Prayer-requests {id} |
| `/api/prayer-wall` | **DELETE, GET, POST, PUT** | Manage Prayer-wall |
| `/api/profile` | **GET, POST, PUT** | Manage Profile |
| `/api/profile/setup` | **POST** | Manage Profile Setup |
| `/api/project-applications` | **GET, POST** | Manage Project-applications |
| `/api/projects` | **DELETE, GET, POST, PUT** | Manage Projects |
| `/api/publish` | **POST** | Manage Publish |
| `/api/pusher` | **POST** | Manage Pusher |
| `/api/register` | **POST** | Manage Register |
| `/api/register-token` | **POST** | Manage Register-token |
| `/api/resources` | **GET** | Manage Resources |
| `/api/resources-allocation` | **DELETE, GET, POST, PUT** | Manage Resources-allocation |
| `/api/revalidate-birthdays` | **POST** | Manage Revalidate-birthdays |
| `/api/roles` | **GET** | Manage Roles |
| `/api/secure-materials` | **POST** | Manage Secure-materials |
| `/api/send-email` | **POST** | Manage Send-email |
| `/api/send-notification` | **POST** | Manage Send-notification |
| `/api/send-receipt` | **POST** | Manage Send-receipt |
| `/api/sermons` | **GET** | Manage Sermons |
| `/api/services` | **DELETE, GET, POST, PUT** | Manage Services |
| `/api/sessions` | **GET** | Manage Sessions |
| `/api/song-proposals` | **GET** | Manage Song-proposals |
| `/api/song-proposals/like` | **POST** | Manage Song-proposals Like |
| `/api/song-search` | **GET** | Manage Song-search |
| `/api/sponsors` | **DELETE, GET, POST, PUT** | Manage Sponsors |
| `/api/subscribers/count` | **GET** | Manage Subscribers Count |
| `/api/testimonies-wall` | **DELETE, GET, POST, PUT** | Manage Testimonies-wall |
| `/api/theme-of-the-week` | **DELETE, GET, POST, PUT** | Manage Theme-of-the-week |
| `/api/therapists` | **GET** | Manage Therapists |
| `/api/tickets` | **DELETE, GET, POST, PUT** | Manage Tickets |
| `/api/transaction-status` | **POST** | Manage Transaction-status |
| `/api/transactions` | **GET, POST** | Manage Transactions |
| `/api/trips` | **GET** | Manage Trips |
| `/api/upload` | **POST** | Manage Upload |
| `/api/upload-certificate` | **POST** | Manage Upload-certificate |
| `/api/upload-document` | **POST** | Manage Upload-document |
| `/api/upload-image` | **POST** | Manage Upload-image |
| `/api/user-counseling-sessions` | **GET** | Manage User-counseling-sessions |
| `/api/users` | **DELETE, GET, PUT** | Manage Users |
| `/api/users/[userId]/bible-study-enrollments` | **GET** | Manage Users {userid} Bible-study-enrollments |
| `/api/users/[userId]/role` | **PUT** | Manage Users {userid} Role |
| `/api/users/all-with-roles` | **GET** | Manage Users All-with-roles |
| `/api/users/assign-role/[id]` | **PUT** | Manage Users Assign-role {id} |
| `/api/users/by-role` | **GET** | Manage Users By-role |
| `/api/users/count` | **GET** | Manage Users Count |
| `/api/users/profile` | **GET** | Manage Users Profile |
| `/api/users/revoke-role` | **PUT** | Manage Users Revoke-role |
| `/api/users/search` | **GET** | Manage Users Search |
| `/api/users/update-role` | **PUT** | Manage Users Update-role |
| `/api/users/with-roles` | **GET** | Manage Users With-roles |
| `/api/vapid-public-key` | **GET** | Manage Vapid-public-key |
| `/api/volunteer` | **GET, POST** | Manage Volunteer |
| `/api/volunteer-shifts` | **GET, POST** | Manage Volunteer-shifts |
| `/api/volunteer-shifts/[id]` | **DELETE, PUT** | Manage Volunteer-shifts {id} |
| `/api/volunteering-applications` | **GET, POST** | Manage Volunteering-applications |
| `/api/volunteering-applications/[id]` | **DELETE, PUT** | Manage Volunteering-applications {id} |
| `/api/volunteering-opportunities` | **GET, POST** | Manage Volunteering-opportunities |
| `/api/volunteering-opportunities/[id]` | **DELETE, GET, PUT** | Manage Volunteering-opportunities {id} |
| `/api/volunteering-opportunities/new-count` | **GET** | Manage Volunteering-opportunities New-count |
| `/api/volunteers` | **GET** | Manage Volunteers |
| `/api/waivers` | **GET** | Manage Waivers |
| `/api/worship-leader` | **GET, POST** | Manage Worship-leader |
| `/api/worship-messages` | **GET, POST** | Manage Worship-messages |
| `/api/worship-resources` | **DELETE, GET, POST, PUT** | Manage Worship-resources |
| `/api/worship-sets` | **GET, POST, PUT** | Manage Worship-sets |
