# Project Pages and API Endpoints

This document lists all identified page and API endpoints within the project.

### Public Pages (Accessible to All)

1.  `/services` - GUEST,
2.  `/counseling-request` - MEMBER
3.  `/partnerships` - GUEST
4.  `/newsletter-subscriptions` - GUEST
5.  `/institutions` - GUEST
6.  `/event-rsvp` - GUEST
7.  `/devotionals` - GUEST
8.  `/contact` - GUEST
9.  `/about` - GUEST
10. `/livestream-integration` - GUEST
11. `/announcements` -MEMBER

12. `/baptism-application` -MEMBER
13. `/bible-study` -MEMBER
14. `/bible-study/[courseId]` -MEMBER
15. `/bible-study/lesson/[lessonId]` -MEMBER
16. `/blog` - GUEST
17. `/blog/[id]` - GUEST
18. `/denied` - anyone
19. `/donations` - GUEST
20. `/donors` - GUEST
21. `/member-financial-support` - MEMBER
22. `/login` - GUEST
23. `/media` - GUEST
24. `/ministries` - GUEST,
25. `/ministries/[id]` - GUEST,
26. `/my-certificates` - MEMBER
27. `/` - GUEST,
28. `/polls` - MEMBER
29. `/projects` - GUEST
30. `/financial-support` - GUEST
31. `/signup` - GUEST
32. `/testimonies-wall` -MEMBER

### Authenticated Member Pages

34. `/dashboard` - MEMBER
35. `/bible-reading-plans` - MEMBER
36. `/certificate-generator` - SENIOR_PASTOR
37. `/certificates` - MEMBER
38. `/chat` - MEMBER
39. `/discussion-forums` - MEMBER
40. `/discussion-forums/[topicId]` - MEMBER
41. `/events` - GUEST
42. `/events/[id]` - GUEST
43. `/family-life` - MEMBER
44. `/family` - MEMBER
45. `/kids-teens-resources` - MEMBER
46. `/member-profile` - MEMBER
47. `/member/[id]` - MEMBER
48. `/ministry` - MEMBER
49. `/ministry/[id]` - MEMBER
50. `/music-proposals` - MEMBER
51. `/prayer-wall` - MEMBER
52. `/profile` - MEMBER
53. `/resources` - MEMBER
54. `/testimonials` - MEMBER
55. `/volunteering` - MEMBER
56. `/volunteering/[id]` - MEMBER

### Admin & Role-Specific Pages

58. `/counselor-dashboard` - COUNSELOR
59. `/pastoralcare/dashboard` - SENIOR_PASTOR
60. `/discipleship/theme-of-the-week/create` - DISCIPLESHIP_LEADER
61. `/events-manager` - EVENTS_MANAGER
62. `/admin/devotionals` - ADMIN
63. `/worship-leader` - WORSHIP_LEADER
64. `/worship-team` - MEMBER (but in worship team)
65. `/admin/baptism-candidates` - SENIOR_PASTOR
66. `/admin/budgets` - FINANCE_ADMINISTRATOR
67. `/admin/certificates` - SENIOR_PASTOR
68. `/admin/dashboard` - SENIOR_PASTOR
69. `/admin/events` - SENIOR_PASTOR, EVENTS_MANAGER
70. `/admin/financials` - SENIOR_PASTOR, FINANCE_ADMINISTRATOR
71. `/admin/institutions` - ADMIN, SENIOR_PASTOR
72. `/admin/kids-teens-resources` -CHILDREN_YOUTH_DIRECTOR
73. `/admin/media` - ADMIN
74. `/admin/ministries` -OVERALL_MINISTRIES_COORDINATOR
75. `/admin/ministries/[id]` - OVERALL_MINISTRIES_COORDINATOR
76. `/admin/newsletter` - COMMUNICATIONS_OFFICER
77. `/admin/outreach` - MISSIONS_PASTOR, OUTREACH_DIRECTOR
78. `/admin/pastoral-care` - ADMIN, SENIOR_PASTOR
79. `/admin/prayer-requests` - SENIOR_PASTOR, PRAYER_MANAGER
80. `/admin/preaching-calendar` - ADMIN, SENIOR_PASTOR
81. `/admin/role-management` - SENIOR_PASTOR
82. `/admin/users` - ADMIN,SENIOR_PASTOR
83. `/children-youth-director` - CHILDREN_YOUTH_DIRECTOR
84. `/communications-officer/create-blog-post` - COMMUNICATIONS_OFFICER
85. `/communications-officer/edit-blog-post/[id]` - COMMUNICATIONS_OFFICER
86. `/communications-officer` - COMMUNICATIONS_OFFICER
87. `/discipleship-leader` - DISCIPLESHIP_LEADER
88. `/discipleship/theme-of-the-week/manage` - DISCIPLESHIP_LEADER
89. `/events-manager/eventdashboard` - EVENTS_MANAGER
90. `/events-manager/inbox` - EVENTS_MANAGER
91. `/ministry-coordinator` - OVERALL_MINISTRIES_COORDINATOR
92. `/outreach-director` - OUTREACH_DIRECTOR
93. `/secretary` - SECRETARY
94. `/secretary/bookings` - SECRETARY
95. `/secretary/inbox` - SECRETARY
96. `/senior-pastor` - SENIOR_PASTOR// use real data
97. `/small-group-leader` - SMALL_GROUPS_LEADER
98. `/tech-media-manager` - TECH_MEDIA_MANAGER
99. `/volunteer-coordinator` - VOLUNTEER_COORDINATOR
100.  `/worship-leader/dashboard` - WORSHIP_LEADER
101.  `/admin/bible-study` - DISCIPLESHIP_LEADER
102.  `/admin/bible-study/new` - DISCIPLESHIP_LEADER
103.  `/admin/bible-study/[courseId]` - DISCIPLESHIP_LEADER
104.  `/admin/bible-study/[courseId]/edit` - DISCIPLESHIP_LEADER
105.  `/admin/projects` - ADMIN
106.  `/admin/volunteering/[id]` - VOLUNTEER_COORDINATOR
107.  `/AdminCommandCenterDashboard` - ADMIN
108.  `/BrandEngagementHubDashboard` - COMMUNICATIONS_OFFICER
109.  `/canvas-designs/[id]` - MEMBER, ADMIN
110.  `/DigitalHubDashboard` - TECH_MEDIA_MANAGER
111.  `/DiscipleshipHubDashboard` - DISCIPLESHIP_LEADER
112.  `/events-manager/dashboard` - EVENTS_MANAGER
113.  `/events-manager/dashboard/[id]` - EVENTS_MANAGER
114.  `/finance-administrator` - FINANCE_ADMINISTRATOR
115.  `/finance-administrator/donation-plans/[id]` - FINANCE_ADMINISTRATOR
116.  `/VolunteerHubDashboard` - VOLUNTEER_COORDINATOR
117.  `/members/[id]` - MEMBER, ADMIN

## Reserved pages:

1. `/docs-gpt5` - ADMIN
2. `/docs-grok` - ADMIN
3. `/grok-editor`-ADMIN

## API Endpoints (`src/app/api/**/*.ts`)

- `/src/app/api/users/by-role/route.ts`
- `/src/app/api/pastoral-care/messages/inbox/route.ts`
- `/src/app/api/pastoral-care/messages/send/route.ts`
- `/src/app/api/members/[id]/route.ts`
- `/src/app/api/counselor/sessions/route.ts`
- `/src/app/api/counselor/clients/route.ts`
- `/src/app/api/users/search/route.ts`
- `/src/app/api/counselors/route.ts`
- `/src/app/api/events/route.ts`
- `/src/app/api/devotionals/route.ts`
- `/src/app/api/send-email/route.ts`
- `/src/app/api/event-rsvp/route.ts`
- `/src/app/api/worship-messages/route.ts`
- `/src/app/api/services/route.ts`
- `/src/app/api/worship-resources/route.ts`
- `/src/app/api/livestream/route.ts`
- `/src/app/api/livestream/view/route.ts`
- `/src/app/api/admin-command-center/route.ts`
- `/src/app/api/admin-dashboard/route.ts`
- `/src/app/api/admin/bible-study/course/[courseId]/route.ts`
- `/src/app/api/admin/budgets/route.ts`
- `/src/app/api/admin/counseling/route.ts`
- `/src/app/api/admin/expenses/route.ts`
- `/src/app/api/admin/financial-settings/route.ts`
- `/src/app/api/all-families/route.ts`
- `/src/app/api/analytics/service-duration/route.ts`
- `/src/app/api/analytics/team-participation/route.ts`
- `/src/app/api/analytics/top-songs/route.ts`
- `/src/app/api/announcements/broadcast/route.ts`
- `/src/app/api/announcements/route.ts`
- `/src/app/api/ask-the-pastor/route.ts`
- `/src/app/api/audit-logs/route.ts`
- `/src/app/api/auth/[...nextauth]/route.ts`
- `/src/app/api/baptism-applications/route.ts`
- `/src/app/api/baptism-candidates/route.ts`
- `/src/app/api/bible-reading-plans/[id]/route.ts`
- `/src/app/api/bible-reading-plans/route.ts`
- `/src/app/api/bible-study/course/[courseId]/enroll/route.ts`
- `/src/app/api/bible-study/course/[courseId]/lesson/route.ts`
- `/src/app/api/bible-study/course/[courseId]/route.ts`
- `/src/app/api/bible-study/course/route.ts`
- `/src/app/api/bible-study/lesson/[lessonId]/question/route.ts`
- `/src/app/api/bible-study/lesson/[lessonId]/route.ts`
- `/src/app/api/bible-study/lesson/[lessonId]/submit/route.ts`
- `/src/app/api/bible-study/lesson/reorder/route.ts`
- `/src/app/api/bible-study/my-certificates/route.ts`
- `/src/app/api/bible-study/my-progress/route.ts`
- `/src/app/api/bible-study/question/[questionId]/route.ts`
- `/src/app/api/bible-study/route.ts`
- `/src/app/api/blog/route.ts`
- `/src/app/api/brand-engagement/route.ts`
- `/src/app/api/canvas-designs/[id]/route.ts`
- `/src/app/api/canvas-designs/route.ts`
- `/src/app/api/certificate/[certificateId]/download/route.ts`
- `/src/app/api/certificates/[id]/route.ts`
- `/src/app/api/certificates/[id]/url/route.ts`
- `/src/app/api/certificates/public/route.ts`
- `/src/app/api/certificates/route.ts`
- `/src/app/api/church-admin/route.ts`
- `/src/app/api/counseling-requests/route.ts`
- `/src/app/api/counseling-sessions/route.ts`
- `/src/app/api/counseling-topics/route.ts`
- `/src/app/api/crisis-intervention/route.ts`
- `/src/app/api/daily-rooms/route.ts`
- `/src/app/api/digital-hub/route.ts`
- `/src/app/api/discipleship-admin/route.ts`
- `/src/app/api/discipleship-safety/route.ts`
- `/src/app/api/discipleship/route.ts`
- `/src/app/api/discussion-forums/posts/[postId]/feedback/route.ts`
- `/src/app/api/discussion-forums/posts/[postId]/user-feedback/route.ts`
- `/src/app/api/discussion-forums/route.ts`
- `/src/app/api/discussion-forums/topics/[topicId]/feedback/route.ts`
- `/src/app/api/discussion-forums/topics/[topicId]/posts/route.ts`
- `/src/app/api/discussion-forums/topics/[topicId]/route.ts`
- `/src/app/api/discussion-forums/topics/[topicId]/user-feedback/route.ts`
- `/src/app/api/discussion-forums/topics/related/route.ts`
- `/src/app/api/discussion-forums/topics/route.ts`
- `/src/app/api/donation-plans/[id]/route.ts`
- `/src/app/api/donation-plans/route.ts`
- `/src/app/api/donations/route.ts`
- `/src/app/api/donor-records/route.ts`
- `/src/app/api/email/send-pastoral-email/route.ts`
- `/src/app/api/events-manager/route.ts`
- `/src/app/api/events/[id]/route.ts`
- `/src/app/api/events/dates/route.ts`
- `/src/app/api/events/rsvp/route.ts`
- `/src/app/api/family-life/route.ts`
- `/src/app/api/family/[familyId]/members/route.ts`
- `/src/app/api/family/route.ts`
- `/src/app/api/feedback/route.ts`
- `/src/app/api/financial-support/[id]/route.ts`
- `/src/app/api/financial-support/route.ts`
- `/src/app/api/financials/route.ts`
- `/src/app/api/funds/route.ts`
- `/src/app/api/groups/route.ts`
- `/src/app/api/institutions/route.ts`
- `/src/app/api/intasend-webhook/route.ts`
- `/src/app/api/intasend/route.ts`
- `/src/app/api/kids-teens-resources/route.ts`
- `/src/app/api/lessons/[id]/route.ts`
- `/src/app/api/lessons/route.ts`
- `/src/app/api/link-preview/route.ts`
- `/src/app/api/livestream-integration/route.ts`
- `/src/app/api/media/route.ts`
- `/src/app/api/member-profile/route.ts`
- `/src/app/api/messages/[messageId]/route.ts`
- `/src/app/api/messages/route.ts`
- `/src/app/api/messages/send-to-admin/route.ts`
- `/src/app/api/ministries/[id]/growth-data/route.ts`
- `/src/app/api/ministries/route.ts`
- `/src/app/api/ministry-join-requests/route.ts`
- `/src/app/api/ministry-members/route.ts`
- `/src/app/api/ministry/add-member/route.ts`
- `/src/app/api/ministry/route.ts`
- `/src/app/api/mission-outreach/route.ts`
- `/src/app/api/music-proposals/route.ts`
- `/src/app/api/newsletter-send/route.ts`
- `/src/app/api/newsletter-subscriptions/route.ts`
- `/src/app/api/newsletter-templates/route.ts`
- `/src/app/api/outreach-programs/route.ts`
- `/src/app/api/outreach/route.ts`
- `/src/app/api/parental-controls/route.ts`
- `/src/app/api/participants/route.ts`
- `/src/app/api/partners/route.ts`
- `/src/app/api/partnerships/route.ts`
- `/src/app/api/pastoral-care-analytics/followups/route.ts`
- `/src/app/api/pastoral-care-analytics/trends/route.ts`
- `/src/app/api/pastoral-care/route.ts`
- `/src/app/api/pastors-desk/route.ts`
- `/src/app/api/polls/route.ts`
- `/src/app/api/prayer-chain/activate/route.ts`
- `/src/app/api/prayer-requests/[id]/route.ts`
- `/src/app/api/prayer-requests/route.ts`
- `/src/app/api/prayer-wall/route.ts`
- `/src/app/api/profile/route.ts`
- `/src/app/api/project-applications/route.ts`
- `/src/app/api/projects/route.ts`
- `/src/app/api/publish/route.ts`
- `/src/app/api/register/route.ts`
- `/src/app/api/resources-allocation/route.ts`
- `/src/app/api/resources/route.ts`
- `/src/app/api/roles/route.ts`
- `/src/app/api/secure-materials/route.ts`
- `/src/app/api/sermons/route.ts`
- `/src/app/api/sessions/route.ts`
- `/src/app/api/song-proposals/like/route.ts`
- `/src/app/api/song-proposals/route.ts`
- `/src/app/api/song-search/route.ts`
- `/src/app/api/sponsors/route.ts`
- `/src/app/api/subscribe-push/route.ts`
- `/src/app/api/subscribe/route.ts`
- `/src/app/api/testimonials/route.ts`
- `/src/app/api/testimonies-wall/route.ts`
- `/src/app/api/theme-of-the-week/route.ts`
- `/src/app/api/therapists/route.ts`
- `/src/app/api/tickets/route.ts`
- `/src/app/api/transactions/route.ts`
- `/src/app/api/trips/route.ts`
- `/src/app/api/upload-certificate/route.ts`
- `/src/app/api/upload-document/route.ts`
- `/src/app/api/upload-image/route.ts`
- `/src/app/api/upload/route.ts`
- `/src/app/api/user-counseling-sessions/route.ts`
- `/src/app/api/users/[userId]/role/route.ts`
- `/src/app/api/users/all-with-roles/route.ts`
- `/src/app/api/users/assign-role/[id]/route.ts`
- `/src/app/api/users/count/route.ts`
- `/src/app/api/users/profile/route.ts`
- `/src/app/api/users/revoke-role/route.ts`
- `/src/app/api/users/route.ts`
- `/src/app/api/users/update-role/route.ts`
- `/src/app/api/users/with-roles/route.ts`
- `/src/app/api/vapid-public-key/route.ts`
- `/src/app/api/volunteer-shifts/route.ts`
- `/src/app/api/volunteer/route.ts`
- `/src/app/api/volunteering-applications/[id]/route.ts`
- `/src/app/api/volunteering-applications/route.ts`
- `/src/app/api/volunteering-opportunities/[id]/route.ts`
- `/src/app/api/volunteering-opportunities/new-count/route.ts`
- `/src/app/api/volunteering-opportunities/route.ts`
- `/src/app/api/volunteers/route.ts`
- `/src/app/api/waivers/route.ts`
- `/src/app/api/worship-leader/route.ts`
- `/src/app/api/worship-sets/route.ts`
