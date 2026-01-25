### Church Web V2: Resource Inventory & Classification

I have reorganized your project structure, providing a total count for each functional group. I've separated the **135 APIs** and **119 Pages** into 9 logical modules based on your file structure and the technologies you're using (React/Next.js).

---

### **Summary Table**

| Group | Module Name | Pages | APIs | Total |
| :---- | :---- | :---- | :---- | :---- |
| 1 | **Auth & Security** | 6 | 9 | 15 |
| 2 | **Pastoral & Admin** | 12 | 16 | 28 |
| 3 | **Member & Social** | 22 | 22 | 44 |
| 4 | **Discipleship & Education** | 8 | 15 | 23 |
| 5 | **Events & Volunteering** | 10 | 11 | 21 |
| 6 | **Finance & Giving** | 5 | 15 | 20 |
| 7 | **Media & Communications** | 8 | 18 | 26 |
| 8 | **Public & Marketing** | 46 | 13 | 59 |
| 9 | **Infrastructure & System** | 2 | 16 | 18 |
| **Total** |  | **119** | **135** | **254** |

---

### **1\. Authentication & Security**

**Group Count:** 6 Pages | 9 APIs

* **Pages:** 1\. `auth`, 2\. `verify-email`, 3\. `reset-password`, 4\. `forgot-password`, 5\. `setup-profile`, 6\. `denied`.  
* **APIs:** 1\. `auth/[...nextauth]`, 2\. `generate-otp`, 3\. `verify-otp`, 4\. `verify-email`, 5\. `reset-password`, 6\. `forgot-password`, 7\. `resend-verification`, 8\. `register`, 9\. `register-token`.

### **2\. Senior Pastor & Church Admin**

**Group Count:** 12 Pages | 16 APIs

* **Pages:** 1\. `senior_pastor/admin-dashboard`, 2\. `senior_pastor/pastoral-care`, 3\. `senior_pastor/pastoralcare/dashboard`, 4\. `senior_pastor/role-management`, 5\. `senior_pastor/baptism-candidates`, 6\. `senior_pastor/certificates-view`, 7\. `senior_pastor/users`, 8\. `senior_pastor/senior-pastor`, 9\. `senior_pastor/prayer-requests`, 10\. `senior_pastor/certificate-generator`, 11\. `secretary/secretary`, 12\. `secretary/secretary/bookings`.  
* **APIs:** 1\. `pastoral-care`, 2\. `pastoral-care/messages/send`, 3\. `pastoral-care/messages/inbox`, 4\. `pastoral-care/messages/unread-count`, 5\. `pastoral-care-analytics/followups`, 6\. `pastoral-care-analytics/trends`, 7\. `pastors-desk`, 8\. `ask-the-pastor`, 9\. `baptism-candidates`, 10\. `roles`, 11\. `users/update-role`, 12\. `users/assign-role/[id]`, 13\. `admin-dashboard`, 14\. `admin-command-center`, 15\. `audit-logs`, 16\. `church-admin`.

### **3\. Member Experience & Community**

**Group Count:** 22 Pages | 22 APIs

* **Pages:** 1\. `member/dashboard`, 2\. `member/profile`, 3\. `member/family`, 4\. `member/family-life`, 5\. `member/announcements`, 6\. `member/birthdays`, 7\. `member/my-birthday`, 8\. `member/prayer-wall`, 9\. `member/testimonies-wall`, 10\. `member/chat`, 11\. `member/my-certificates`, 12\. `member/polls`, 13\. `member/discussion-forums`, 14\. `member/discussion-forums/[topicId]`, 15\. `member/members/[id]`, 16\. `member/worship-team`, 17\. `member/resources`, 18\. `member/ministry`, 19\. `member/ministry/[id]`, 20\. `member/member/[id]`, 21\. `member/counseling-request`, 22\. `counselor/counselor-dashboard`.  
* **APIs:** 1\. `profile`, 2\. `member-profile`, 3\. `family`, 4\. `family/[familyId]/members`, 5\. `all-families`, 6\. `families/search`, 7\. `prayer-wall`, 8\. `testimonies-wall`, 9\. `birthday-wishes`, 10\. `polls`, 11\. `discussion-forums`, 12\. `discussion-forums/topics`, 13\. `discussion-forums/topics/[topicId]`, 14\. `counseling-requests`, 15\. `counseling-sessions`, 16\. `counselors`, 17\. `counselor/sessions`, 18\. `counselor/clients`, 19\. `announcements`, 20\. `announcements/broadcast`, 21\. `members/[id]`, 22\. `family-life`.

### **4\. Discipleship & Bible Study**

**Group Count:** 8 Pages | 15 APIs

* **Pages:** 1\. `discipleship_leader/admin`, 2\. `discipleship_leader/admin/courses/[courseId]`, 3\. `discipleship_leader/courses/discipleship/theme-of-the-week/manage`, 4\. `member/bible-study`, 5\. `member/bible-study/[courseId]`, 6\. `member/bible-study/lesson/[lessonId]`, 7\. `small_groups_leader/small-group-leader`, 8\. `children_youth_director/admin/kids-teens-resources`.  
* **APIs:** 1\. `discipleship`, 2\. `discipleship-admin`, 3\. `theme-of-the-week`, 4\. `bible-study/course`, 5\. `bible-study/course/[courseId]/enroll`, 6\. `bible-study/lesson/[lessonId]/submit`, 7\. `bible-study/my-progress`, 8\. `bible-study/my-certificates`, 9\. `bible-reading-plans`, 10\. `lessons`, 11\. `lessons/[id]`, 12\. `kids-teens-resources`, 13\. `discipleship-safety`, 14\. `parental-controls`, 15\. `metrics/spiritual-growth`.

### **5\. Events & Volunteering**

**Group Count:** 10 Pages | 11 APIs

* **Pages:** 1\. `events_manager/events-manager`, 2\. `events_manager/events-manager/dashboard`, 3\. `events_manager/events-manager/create`, 4\. `events_manager/preaching-calendar`, 5\. `volunteer_coordinator/volunteer-coordinator`, 6\. `volunteer_coordinator/VolunteerHubDashboard`, 7\. `volunteer_coordinator/admin/volunteering/[id]`, 8\. `member/volunteering`, 9\. `member/volunteering/[id]`, 10\. `(public)/event-rsvp`.  
* **APIs:** 1\. `events`, 2\. `events/dates`, 3\. `events/rsvp`, 4\. `event-rsvp`, 5\. `volunteering-opportunities`, 6\. `volunteering-applications`, 7\. `volunteers`, 8\. `volunteer-shifts`, 9\. `volunteer-shifts/[id]`, 10\. `volunteer`, 11\. `events-manger-route`.

### **6\. Finance & Giving**

**Group Count:** 5 Pages | 15 APIs

* **Pages:** 1\. `finance_administrator/finance-administrator`, 2\. `finance_administrator/finance-administrator/giving-opportunities`, 3\. `member/giving`, 4\. `member/member-financial-support`, 5\. `(public)/donations/success`.  
* **APIs:** 1\. `giving`, 2\. `giving/analytics`, 3\. `donations`, 4\. `donation-plans`, 5\. `financial-support`, 6\. `financials`, 7\. `funds`, 8\. `transactions`, 9\. `transaction-status`, 10\. `intasend-checkout`, 11\. `intasend-webhook`, 12\. `member/giving-history`, 13\. `member/giving-summary`, 14\. `admin/budgets`, 15\. `admin/expenses`.

### **7\. Media, Worship & Communications**

**Group Count:** 8 Pages | 18 APIs

* **Pages:** 1\. `tech_media_manager/tech-media-manager`, 2\. `worship_leader/page.tsx`, 3\. `communications_officer/communications-officer`, 4\. `communications_officer/communications-officer/create-blog-post`, 5\. `communications_officer/admin/newsletter`, 6\. `tech_media_manager/DigitalHubDashboard`, 7\. `(public)/livestream-integration`, 8\. `outreach_director/outreach-director`.  
* **APIs:** 1\. `livestream`, 2\. `livestream-integration`, 3\. `worship-leader`, 4\. `worship-sets`, 5\. `worship-resources`, 6\. `song-search`, 7\. `song-proposals`, 8\. `music-proposals`, 9\. `blog`, 10\. `newsletter-subscriptions`, 11\. `newsletter-send`, 12\. `newsletter-templates`, 13\. `digital-hub`, 14\. `sermons`, 15\. `media`, 16\. `publish`, 17\. `brand-engagement`, 18\. `song-proposals/like`.

### **8\. Public Pages & Outreach**

**Group Count:** 46 Pages | 13 APIs

* **Pages:** Includes all `(public)` directory items like `about`, `contact`, `ministries`, `sermons`, `giving`, `partnerships`, `blog/[id]`, etc. (46 total).  
* **APIs:** 1\. `partnerships`, 2\. `partners`, 3\. `sponsors`, 4\. `outreach`, 5\. `outreach-programs`, 6\. `mission-outreach`, 7\. `institutions`, 8\. `trips`, 9\. `donor-records`, 10\. `projects`, 11\. `project-applications`, 12\. `feedback`, 13\. `subscribers/count`.

### **9\. Infrastructure & Future Canvas**

**Group Count:** 2 Pages | 16 APIs

* **Pages:** 1\. `admin/(futuristic-pages)/grok-editor`, 2\. `(future canvas)/canvas-designs/[id]`.  
* **APIs:** 1\. `fcm/subscribe`, 2\. `fcm/send`, 3\. `upload`, 4\. `upload-image`, 5\. `upload-document`, 6\. `upload-certificate`, 7\. `pusher`, 8\. `cron/send-birthday-notifications`, 9\. `revalidate-birthdays`, 10\. `link-preview`, 11\. `canvas-designs`, 12\. `canvas-designs/[id]`, 13\. `vapid-public-key`, 14\. `daily-rooms`, 15\. `sessions`, 16\. `certificates`.

---

**Next Step:** With over 250 endpoints and pages, your project is quite large. Would you like me to generate a **GSAP-powered dashboard layout** for your Admin sections to handle this volume of navigation smoothly?  