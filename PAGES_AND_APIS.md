# Project Pages and API Endpoints

This document lists all identified page and API endpoints within the project.

### Public Pages (Accessible to All)

1.  `/services` - GUEST, MEMBER, ADMIN
2.  `/counseling-request` - GUEST, MEMBER
3.  `/partnerships` - GUEST, MEMBER
4.  `/newsletter-subscriptions` - GUEST, MEMBER
5.  `/institutions` - GUEST, MEMBER
6.  `/event-rsvp` - GUEST, MEMBER
7.  `/devotionals` - GUEST, MEMBER
8.  `/contact` - GUEST, MEMBER
9.  `/about` - GUEST, MEMBER
10. `/livestream-integration` - GUEST, MEMBER
11. `/announcements` - GUEST, MEMBER
12. `/ask-the-pastor` - GUEST, MEMBER
13. `/baptism-application` - GUEST, MEMBER
14. `/bible-study` - GUEST, MEMBER
15. `/bible-study/[courseId]` - GUEST, MEMBER
16. `/bible-study/lesson/[lessonId]` - GUEST, MEMBER
17. `/blog` - GUEST, MEMBER
18. `/blog/[id]` - GUEST, MEMBER
19. `/denied` - GUEST, MEMBER
20. `/donations` - GUEST, MEMBER
21. `/donors` - GUEST, MEMBER
22. `/financial-support` - GUEST, MEMBER
23. `/login` - GUEST
24. `/media` - GUEST, MEMBER
25. `/ministries` - GUEST, MEMBER
26. `/ministries/[id]` - GUEST, MEMBER
27. `/my-certificates` - MEMBER
28. `/` - GUEST, MEMBER, ADMIN
29. `/polls` - MEMBER
30. `/projects` - GUEST, MEMBER
31. `/public/financial-support` - GUEST, MEMBER
32. `/signup` - GUEST
33. `/testimonies-wall` - GUEST, MEMBER

### Authenticated Member Pages

34. `/dashboard` - MEMBER
35. `/bible-reading-plans` - MEMBER
36. `/certificate-generator` - MEMBER
37. `/certificates` - MEMBER
38. `/chat` - MEMBER
39. `/discussion-forums` - MEMBER
40. `/discussion-forums/[topicId]` - MEMBER
41. `/events` - MEMBER
42. `/events/[id]` - MEMBER
43. `/family-life` - MEMBER
44. `/family` - MEMBER
45. `/kids-teens-resources` - MEMBER
46. `/member-profile` - MEMBER
47. `/member/[id]` - MEMBER
48. `/ministry` - MEMBER
49. `/ministry/[id]` - MEMBER
50. `/music-proposals` - MEMBER
51. `/prayer-requests` - MEMBER
52. `/prayer-wall` - MEMBER
53. `/profile` - MEMBER
54. `/resources` - MEMBER
55. `/testimonials` - MEMBER
56. `/volunteering` - MEMBER
57. `/volunteering/[id]` - MEMBER

### Admin & Role-Specific Pages

58. `/counselor-dashboard` - COUNSELOR
59. `/pastoralcare/dashboard` - SENIOR_PASTOR
60. `/discipleship/theme-of-the-week/create` - DISCIPLESHIP_LEADER
61. `/events-manager` - EVENTS_MANAGER
62. `/admin/devotionals` - ADMIN
63. `/worship-leader` - WORSHIP_LEADER
64. `/worship-team` - WORSHIP_LEADER, MEMBER
65. `/admin/baptism-candidates` - ADMIN, SECRETARY
66. `/admin/bible-reading-plans` - ADMIN, DISCIPLESHIP_LEADER
67. `/admin/bible-reading-plans/[id]` - ADMIN, DISCIPLESHIP_LEADER
68. `/admin/budgets` - ADMIN, FINANCE_ADMINISTRATOR
69. `/admin/certificates` - ADMIN, SECRETARY
70. `/admin/dashboard` - ADMIN
71. `/admin/events` - ADMIN, EVENTS_MANAGER
72. `/admin/financials` - ADMIN, FINANCE_ADMINISTRATOR
73. `/admin/institutions` - ADMIN
74. `/admin/kids-teens-resources` - ADMIN, CHILDREN_YOUTH_DIRECTOR
75. `/admin/media` - ADMIN, TECH_MEDIA_MANAGER
76. `/admin/ministries` - ADMIN, OVERALL_MINISTRIES_COORDINATOR
77. `/admin/ministries/[id]` - ADMIN, OVERALL_MINISTRIES_COORDINATOR
78. `/admin/newsletter` - ADMIN, COMMUNICATIONS_OFFICER
79. `/admin/outreach` - ADMIN, OUTREACH_DIRECTOR
80. `/admin/pastoral-care` - ADMIN, SENIOR_PASTOR
81. `/admin/prayer-requests` - ADMIN, PRAYER_MANAGER
82. `/admin/preaching-calendar` - ADMIN, SENIOR_PASTOR
83. `/admin/role-management` - ADMIN
84. `/admin/users` - ADMIN
85. `/children-youth-director` - CHILDREN_YOUTH_DIRECTOR
86. `/communications-officer/create-blog-post` - COMMUNICATIONS_OFFICER
87. `/communications-officer/edit-blog-post/[id]` - COMMUNICATIONS_OFFICER
88. `/communications-officer` - COMMUNICATIONS_OFFICER
89. `/discipleship-leader` - DISCIPLESHIP_LEADER
90. `/discipleship/theme-of-the-week/manage` - DISCIPLESHIP_LEADER
91. `/events-manager/eventdashboard` - EVENTS_MANAGER
92. `/events-manager/inbox` - EVENTS_MANAGER
93. `/ministry-coordinator` - OVERALL_MINISTRIES_COORDINATOR
94. `/outreach-director` - OUTREACH_DIRECTOR
95. `/secretary` - SECRETARY
96. `/secretary/bookings` - SECRETARY
97. `/secretary/inbox` - SECRETARY
98. `/senior-pastor` - SENIOR_PASTOR
99. `/small-group-leader` - SMALL_GROUPS_LEADER
100. `/tech-media-manager` - TECH_MEDIA_MANAGER
101. `/volunteer-coordinator` - VOLUNTEER_COORDINATOR
102. `/worship-leader/dashboard` - WORSHIP_LEADER
103. `/admin/bible-study` - ADMIN, DISCIPLESHIP_LEADER
104. `/admin/bible-study/new` - ADMIN, DISCIPLESHIP_LEADER
105. `/admin/bible-study/[courseId]` - ADMIN, DISCIPLESHIP_LEADER
106. `/admin/bible-study/[courseId]/edit` - ADMIN, DISCIPLESHIP_LEADER
107. `/admin/projects` - ADMIN
108. `/admin/volunteering/[id]` - ADMIN, VOLUNTEER_COORDINATOR
109. `/AdminCommandCenterDashboard` - ADMIN
110. `/BrandEngagementHubDashboard` - COMMUNICATIONS_OFFICER
111. `/canvas-designs/[id]` - MEMBER, ADMIN
112. `/DigitalHubDashboard` - TECH_MEDIA_MANAGER
113. `/DiscipleshipHubDashboard` - DISCIPLESHIP_LEADER
114. `/docs-gpt5` - ADMIN
115. `/docs-grok` - ADMIN
116. `/events-manager/dashboard` - EVENTS_MANAGER
117. `/events-manager/dashboard/[id]` - EVENTS_MANAGER
118. `/finance-administrator` - FINANCE_ADMINISTRATOR
119. `/finance-administrator/donation-plans/[id]` - FINANCE_ADMINISTRATOR
120. `/grok-editor` - ADMIN
121. `/VolunteerHubDashboard` - VOLUNTEER_COORDINATOR
122. `/members/[id]` - MEMBER, ADMIN

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