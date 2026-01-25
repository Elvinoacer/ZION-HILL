# Project Analysis Report

## Phase 1: Project Configuration & Root

### [package.json](file:///home/elvin/Projects/businesses/church-web-v2/package.json)
**Type**: Configuration
**Role**: Defines project dependencies, scripts, and metadata.

**Key Dependencies**:
- **Framework**: `next` (15.4.5), `react` (19.1.0)
- **Database**: `prisma`, `@prisma/client`, `@auth/prisma-adapter`
- **Auth**: `next-auth` (v4), `jose`, `bcrypt`
- **UI/Styling**: `tailwindcss` (v4), `@radix-ui/*`, `lucide-react`, `framer-motion`, `recharts`
- **Forms/Validation**: `react-hook-form`, `zod`, `@hookform/resolvers`
- **State**: `zustand`
- **File Management**: `@vercel/blob`, `cloudinary`, `@aws-sdk/client-s3`
- **Communication**: `nodemailer`, `pusher`, `web-push`, `firebase-admin`
- **Utilities**: `date-fns`, `lodash`, `xlsx`, `jspdf`

**Scripts**:
- `dev`: Starts Next.js dev server.
- `build`: Generates Prisma client and builds Next.js app.
- `lint`: Runs linter.

**Observations**:
- Uses Next.js 15 (App Router).
- Extensive use of Radix UI primitives for accessible components.
- React 19 indicates bleeding-edge or RC usage.
- Tailwind 4 is the latest version.

---

### [tsconfig.json](file:///home/elvin/Projects/businesses/church-web-v2/tsconfig.json)
**Type**: Configuration
**Role**: TypeScript compiler configuration.

**Settings**:
- `target`: ES2017
- `strict`: true (High type safety)
- `paths`: Aliases `@/*` mapping to `./src/*` and `@/store/*` to `./src/store/*`.
- `plugins`: Includes Next.js plugin.

**Observations**:
- Project source code is located in `src/`.
- Strict mode ensures better code quality.

---

### [next.config.ts](file:///home/elvin/Projects/businesses/church-web-v2/next.config.ts)
**Type**: Configuration
**Role**: Next.js build and runtime configuration.

**Key Settings**:
- **Redirects**: `/login` and `/signup` redirect to `/auth`.
- **Images**: Remote patterns allow images from:
    - `i.pinimg.com`
    - `res.cloudinary.com`
    - `avatars.githubusercontent.com`
    - `cdn.jsdelivr.net`
- **Build ignores**: ESLint and TypeScript errors are ignored during build (risky, but common for rapid dev).

**Observations**:
- Auth routes are centralized.
- Image optimization is configured for specific CDNs.

---

### [tailwind.config.ts](file:///home/elvin/Projects/businesses/church-web-v2/tailwind.config.ts)
**Type**: Configuration
**Role**: Styling configuration for Tailwind CSS.

**Plugins**:
- `typography` (prose)
- `forms`
- `aspect-ratio`
- `line-clamp`

**Content Paths**:
- Includes `src/**/*.{js,ts,jsx,tsx,mdx}`.

**Observations**:
- Standard sophisticated Tailwind setup.

---

### [src/middleware.ts](file:///home/elvin/Projects/businesses/church-web-v2/src/middleware.ts)
**Type**: Middleware
**Role**: Protects routes based on user roles using NextAuth.

**Key Logic**:
- **`rolePermissions` Object**: Maps routes (e.g., `/admin`) to required roles (e.g., `["ADMIN", "SENIOR_PASTOR"]`).
- **Middleware Function**:
    1.  Checks `req.nextauth.token`.
    2.  Matches request path against `rolePermissions`.
    3.  Redirects to `/auth` if no token.
    4.  Redirects to `/denied` if user lacks required role.

**Protected Routes**:
- `/admin`, `/member`, `/volunteer_coordinator`, `/worship_leader`, and many ministry specific paths.

**Observations**:
- Centralized Role-Based Access Control (RBAC).
- `SENIOR_PASTOR` has access to almost all protected routes.

---

### [src/next-auth.d.ts](file:///home/elvin/Projects/businesses/church-web-v2/src/next-auth.d.ts)
**Type**: Type Definition
**Role**: Extends NextAuth types to include custom user fields.

**Extensions**:
- **Session**: Adds `id`, `roles` (`string[]`), `photo`, `image`.
- **JWT**: Adds `id`, `roles`.

**Observations**:
- Essential for TypeScript support when accessing `session.user.roles`.

---

### [.env (one-envcopy)](file:///home/elvin/Projects/businesses/church-web-v2/one-envcopy)
**Type**: Configuration (Environment Variables)
**Role**: Secrets and public keys for services.

**Key Services**:
- **Database**: PostgreSQL (Neon).
- **Payments**: Intasend.
- **Email**: Nodemailer (Gmail).
- **Storage**: Cloudinary, Vercel Blob.
- **Realtime**: Pusher.
- **Auth**: NextAuth, Firebase (for Push Notifications/Admin).
- **Video**: Daily.co.

**Observations**:
- Comprehensive integration with 3rd party services.
- `DATABASE_URL` uses connection pooling (`pgbouncer` likely via Neon).

---

## Phase 2: Database Layer

### [prisma/schema.prisma](file:///home/elvin/Projects/businesses/church-web-v2/prisma/schema.prisma)
**Type**: Data Model
**Role**: Defines the PostgreSQL database schema.

**Key Models**:
- **User Identity**: `User`, `Account`, `Session`, `VerificationToken`, `Role`, `FcmToken`.
- **Ministries & Organization**: `Ministry`, `MinistryMember`, `Group`, `Family`, `MinistryBudget`, `MinistryJoinRequest`.
- **Events & Logistics**: `Event`, `Participant`, `VolunteerShift`, `Resource`, `ResourceAllocation`, `Waiver`.
- **Content & Media**: `Asset` (central media table), `Sermon`, `Announcement`, `ThemeOfTheWeek`, `BirthdayWish`.
- **Worship**: `WorshipSet`, `SongProposal`, `SongLike`, `WorshipResource`, `WorshipMessage`.
- **Communication**: `Message`, `PushSubscription` (missing in schema but present in seed), `Feedback`.
- **Education/Discipleship**: `BibleStudyCourse`, `Lesson`, `QuizAttempt`, `Certificate`.
- **Finance**: `Choosing`, `Transaction`, `DonationPlan`, `Sponsor`, `Financials`.
- **Counseling**: `CounselingSession`, `CounselingTopic`, `FollowUp`.

**Problems & Recommendations**:
1.  **Missing `PushSubscription` Model**: `prisma/seed.js` tries to create `prisma.pushSubscription` but it does not exist in `schema.prisma`. This will cause the seed to fail.
    -   *Recommendation*: Add `model PushSubscription` to schema.
2.  **Missing `Fund` Model**: `prisma/seed.js` tries to create `prisma.fund` but `schema.prisma` has `DonationFund`.
    -   *Recommendation*: Rename `DonationFund` to `Fund` or update seed script.
3.  **Ambiguous `Asset` vs `WorshipResource`**: Both seem to handle files/media. `Asset` is linked to `Sermon`, while `WorshipResource` is linked to `Event`.
    -   *Recommendation*: Consolidate if possible or clearly define boundaries (e.g., `Asset` for storage, `WorshipResource` for usage context).
4.  **`User` Model Complexity**: The `User` model is extremely large with many relations (`roles`, `ledMinistries`, `shifts`, `transactions`, etc.).
    -   *Recommendation*: Consider breaking down user profile extensions (e.g., `MemberProfile`, `StaffProfile`).
5.  **Hardcoded Enums**: `CertificateFrequency`, `BaptismStatus`, `DonationPlanType` are useful, but ensure they cover all real-world edge cases.

---

### [prisma/seed.js](file:///home/elvin/Projects/businesses/church-web-v2/prisma/seed.js)
**Type**: Utility script
**Role**: Populates the database with initial fake data for testing.

**Logic**:
1.  Creates default test users (`test@example.com`, `pastor@example.com`).
2.  Creates Roles (`Admin`, `Member`, etc.).
3.  Creates randomly generated users, families, ministries, events, assets, and sermons.
4.  Seeds transactions, tickets, partners, and counseling sessions.

**Issues**:
- **Broken References**: As noted above, it references `prisma.fund` and `prisma.pushSubscription`, which do not match `schema.prisma` (uses `DonationFund` and missing `PushSubscription`).
- **`bibleStudy` vs `BibleStudyCourse`**: Seed uses `prisma.bibleStudy.create`, Schema has `BibleStudyCourse`.
- **`bibleStudyProgress` vs `LessonProgress`**: Seed uses `prisma.bibleStudyProgress`, Schema has `LessonProgress`.

**Recommendation**: The seed script is significantly out of sync with the schema. It needs a major refactor to match the current model names.

---

### [src/lib/prisma.ts](file:///home/elvin/Projects/businesses/church-web-v2/src/lib/prisma.ts)
**Type**: Utility
**Role**: Instantiates a singleton `PrismaClient`.

**Observations**:
- Correctly handles hot-reloading in development by attaching `prisma` to `global`.
- Uses a custom output path `@/generated/prisma/client`.

---

## Phase 3: Core Infrastructure & Utilities

### [src/lib/church-config.ts](file:///home/elvin/Projects/businesses/church-web-v2/src/lib/church-config.ts)
**Type**: Configuration (Constant)
**Role**: Centralizes hardcoded church details (Name, Mission, Vision, Team).

**Key Exports**:
- `churchConfig` (Object): Contains contact info, team array, social links, etc.

**Features Implemented**:
- Provides data for public pages (About Us, Contact, Footer) without needing backend storage.

**Observations**:
- Uses `Next.js` Static Images imports.
- Good for static content, but requires redeployment to update staff/hours.

---

### [src/lib/api.ts](file:///home/elvin/Projects/businesses/church-web-v2/src/lib/api.ts)
**Type**: Utility (Helper)
**Role**: A wrapper around `fetch` for standardized API calls.

**Key Exports**:
- `safeFetch<T>(url, options)`: Handles HTTP errors, parses JSON, and provides type safety.

**Logic**:
- Throws error if `!response.ok`.
- Attempts to parse error message from JSON response body.
- Returns empty object if status is 204 or content-type is non-JSON (a bit loose).

**Recommendation**: Explicitly returning `null` or `undefined` for empty responses might be safer than casting `{}` to `T`.

---

### [src/lib/firebase.ts](file:///home/elvin/Projects/businesses/church-web-v2/src/lib/firebase.ts)
**Type**: Utility (Third-Party)
**Role**: Client-side Firebase initialization for Messaging (FCM).

**Key Exports**:
- `getFCMToken()`: Requests permission and retrieves the registration token.
- `getMessagingObject()`: Returns the initialized messaging instance.

**Issues**:
- **Hardcoded Secrets**: `firebaseConfig` and `vapidKey` are hardcoded in the file. Ideally, these should be environment variables (`process.env.NEXT_PUBLIC_...`).

---

### [src/store](file:///home/elvin/Projects/businesses/church-web-v2/src/store)
**Type**: State Management (Zustand)
**Role**: Manages complex global client state instead of React Context.

**Key Stores**:
- **`userStore.ts`**: Manages `currentUser`, `familyMembers`, and loading states.
- **`roleStore.ts`**: fetches, creates, updates roles.
- **Others**: ~30 store files for almost every feature (events, giving, ministry, etc.).

**Observations**:
- **Pattern**: Each store typically has `loading`, `error`, `data`, and `fetch...` actions.
- **Scaling**: Having 32+ individual store files is a lot. It suggests a very "siloed" state approach.
- **Redundant Logic**: Many stores repeat the same `fetch` + `try/catch` + `toast` pattern. A generic store factory or hook could reduce boilerplate.

---

### [src/jobs/checkBirthdays.ts](file:///home/elvin/Projects/businesses/church-web-v2/src/jobs/checkBirthdays.ts)
**Type**: Background Job
**Role**: Sends birthday emails.

**Logic**:
1.  Queries `User` table for birthdays matching today (Month/Day).
2.  Iterates and sends emails using `sendEmail` helper.
3.  Calls an API endpoint (`/api/revalidate-birthdays`) to update cached content.

**Issues**:
- **Schema Mismatch**: Uses raw SQL `SELECT * FROM "User" WHERE EXTRACT(...)`. This is fragile if column names change (e.g. `birthdate` vs `birthday`).
- **Execution**: This file is a standalone script. It needs a runner (Cron job, Vercel Cron, or manual trigger).

---

## Phase 4: Shared Components (UI Library)

### [src/components/ui](file:///home/elvin/Projects/businesses/church-web-v2/src/components/ui)
**Type**: Component Library (shadcn/ui)
**Role**: Provides atomic UI primitives built on Radix UI and styled with Tailwind CSS.

**Key Components**:
- `Button`: Enhanced with `framer-motion` for animations and supports `asChild` for polymorphism.
- `Dialog`, `Popover`, `Tooltip`, `Select`: All Radix UI primitives.
- `Form`: React Hook Form integration wrapper.

**Observations**:
- Standard shadcn/ui implementation.
- `button.tsx` has been customized to include animation props (`whileHover`, `whileTap`), transforming standard buttons into motion components automatically.

---

### [src/components/Sidebar.tsx](file:///home/elvin/Projects/businesses/church-web-v2/src/components/Sidebar.tsx)
**Type**: Layout Component
**Role**: Main navigation for the authenticated dashboard.

**Features**:
- **Dynamic Navigation**: Renders links based on user roles (`MEMBER`, `ADMIN`, etc.).
- **RBAC Check**: `hasRole` function filters menu items.
- **API Integration**: Checks specific ministry membership (e.g., Worship Team) on mount to toggle visibility.
- **Responsive**: Includes mobile drawer and desktop sidebar variants using `framer-motion`.

**Issues**:
- **Hardcoded Lists**: Nav items are hardcoded in the component. As the app grows, this file becomes monolithic (500+ lines).
- **Client-Side Fetching**: Fetches ministry membership inside `useEffect` on every mount. Could be optimized or moved to a layout server component.

---

### [src/components/Header.tsx](file:///home/elvin/Projects/businesses/church-web-v2/src/components/Header.tsx)
**Type**: Layout Component
**Role**: Global navigation bar for public pages.

**Features**:
- Responsive mobile menu.
- Conditional rendering for "Sign In" vs "Dashboard" button based on session.
- Sticky positioning with backdrop blur.

**Observations**:
- Clean separation between public (Header) and app (Sidebar) navigation.

---

### [src/components/AuthForm.tsx](file:///home/elvin/Projects/businesses/church-web-v2/src/components/AuthForm.tsx)
**Type**: Feature Component
**Role**: Unified Login/Signup interface.

**Features**:
- Uses `Radix UI Tabs` to toggle between Login and Signup.
- Smoothed transitions with `framer-motion`.
- Consistent styling with the rest of the application.

---

### [src/components/TiptapEditor.tsx](file:///home/elvin/Projects/businesses/church-web-v2/src/components/TiptapEditor.tsx)
**Type**: Utility Component
**Role**: Rich text editor wrapper.

**Logic**:
- Uses `next/dynamic` to load the actual editor (`TiptapEditorClient`) mostly client-side to avoid SSR issues with editor libraries.

**Observations**:
- Good practice for heavyweight client-only libraries.

---

## Phase 5: Authentication & Public Pages

### [src/app/(public)/layout.tsx](file:///home/elvin/Projects/businesses/church-web-v2/src/app/(public)/layout.tsx)
**Type**: Layout Wrapper
**Role**: Public layout wrapper.

**Features**:
- Renders `Header` and `Footer` for all public pages.
- Wraps content in a `flex-col` main container.

**Observations**:
- Clean separation of concerns.

---

### [src/app/(public)/page.tsx](file:///home/elvin/Projects/businesses/church-web-v2/src/app/(public)/page.tsx)
**Type**: Page (Landing)
**Role**: The main homepage of the application.

**Features**:
- **Hero Section**: Parallax effect, floating particles, and call-to-action buttons.
- **Dynamic Content**: Fetches `theme-of-the-week`, `projects`, and `events` from API on mount.
- **Animations**: Extensive use of custom CSS animations (`float`, `glow`, `slideInUp`) and `framer-motion`.
- **Static Content**: Uses `churchConfig` for mission statement.

**Observations**:
- **Client-Side Fetching**: Data is fetched in `useEffect` rather than Server Components. This negates some SEO benefits of Next.js 13+.
- **Inline Styles**: Contains a large block of `<style jsx global>` for animations. Moving this to `globals.css` or a module would be cleaner.

---

### [src/app/(public)/auth/page.tsx](file:///home/elvin/Projects/businesses/church-web-v2/src/app/(public)/auth/page.tsx)
**Type**: Page (Auth)
**Role**: Entry point for authentication.

**Features**:
- Simply renders the `AuthForm` component.

**Observations**:
- Clean implementation, delegates logic to component.

---

## Phase 6: Member & Admin Portals

### [src/app/member/layout.tsx](file:///home/elvin/Projects/businesses/church-web-v2/src/app/member/layout.tsx)
**Type**: Layout Wrapper
**Role**: Authenticated member layout.

**Logic**:
- **Auth Guard**: Checks `session` and `userRoles`. **IMPORTANT**: It only *renders* the sidebar if user has `MEMBER` role, but relies on `middleware.ts` for actual route protection.
- **Structure**: Flexbox layout with a collapsible sidebar and a top header containing user profile and logo.

---

### [src/app/member/dashboard/page.tsx](file:///home/elvin/Projects/businesses/church-web-v2/src/app/member/dashboard/page.tsx)
**Type**: Page (Dashboard)
**Role**: The central hub for signed-in members.

**Features**:
- **Data Aggregation**: Uses complex `useDashboardStore` to fetch profile, sermons, giving, and more.
- **Notifications**: Requests browser notification permission on mount.
- **Theme of the Week**: Fetched independently.
- **UI Cards**: Dashboard widgets for events, sermons, bible study progress, and giving.

**Observations**:
- **Heavy Client Fetching**: The dashboard fires multiple concurrent fetch requests (`fetchDashboardData`, `fetchTheme`, `fetchAnnouncements`). This might cause waterfalls or slow initial load.
- **State Coupling**: Tightly coupled to `useDashboardStore`.

---

### [src/app/admin/layout.tsx](file:///home/elvin/Projects/businesses/church-web-v2/src/app/admin/layout.tsx)
**Type**: Layout Wrapper
**Role**: Admin portal layout.

**Logic**:
- Similar structure to Member layout but uses `AdminSidebar` and `AdminHeader`.
- Checks for `ADMIN` role to render sidebar.

---

## Phase 7: Ministry & Role-Specific Portals

### [src/app/worship_leader/page.tsx](file:///home/elvin/Projects/businesses/church-web-v2/src/app/worship_leader/page.tsx)
**Type**: Page (Dashboard)
**Role**: Comprehensive dashboard for the Worship Leader.

**Key Features**:
- **Service Management**: Create, update, delete services combined with an attendance tracker.
- **Chat System**: Integration with `WorshipMessage` to chat with team members.
- **Analytics**: Uses multiple specialized charts (`ServiceDurationChart`, `TeamParticipationChart`, `TopSongsChart`).
- **Ministry Management**: Checks for "Worship Ministry" existence and prompts creation if missing.

**Observations**:
- **Monolithic File**: This single file is 1200+ lines long. It handles UI, state, API calls, and logic for services, worship sets, teams, and chat.
- **Recommendations**: Refactor sub-features (Chat, ServiceForm, Analytics) into separate components.

---

### [src/app/outreach_director](file:///home/elvin/Projects/businesses/church-web-v2/src/app/outreach_director)
**Type**: Route Group
**Role**: Portal for Outreach Director.

**Structure**:
- **Layout**: Uses a separate `OutreachDirectorSidebar` inside a `Sheet` (mobile-friendly).
- **Navigation**: Dedicated sidebar for outreach-specific links.

---

### [src/app/counselor/counselor-dashboard](file:///home/elvin/Projects/businesses/church-web-v2/src/app/counselor/counselor-dashboard)
**Type**: Route
**Role**: Dashboard for Counselors.

**Features**:
- Likely contains session management and notes (inferred from file structure).

---
