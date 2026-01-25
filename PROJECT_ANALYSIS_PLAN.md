# Project Analysis Plan

This document outlines the strategy to analyze the entire `church-web-v2` project, file by file. Use this plan to track progress and maintain consistency across analysis phases.

## Analysis Report Format
For each file analyzed, generate a report in the following format:

```markdown
### [File Path]
**Type**: [e.g., Component, API Route, Configuration, Utility]
**Role**: [Brief description of what this file does]

**Key Exports/Parameters**:
- `ExportName` (Type): Description
- `ParameterName`: Description (if applicable)

**Dependencies**:
- `DependentFile/Package`: Why it's needed

**Features Implemented**:
- [Feature 1]
- [Feature 2]

**Observations/Notes**:
- [Any specific logic, potential issues, or security notes]
```

---

## Phases of Analysis

### Phase 1: Project Configuration & Root
**Goal**: Understand the build environment, dependencies, and project settings.
**Files**:
- `package.json`
- `tsconfig.json`
- `next.config.ts`
- `.env` (Structure only)
- `tailwind.config.ts`
- `middleware.ts`
- `next-auth.d.ts`

### Phase 2: Database Layer
**Goal**: Analyze the data model and access patterns.
**Files**:
- `prisma/schema.prisma`
- `prisma/seed.js` (and other seed scripts)
- `src/lib/prisma.ts` (if exists)

### Phase 3: Core Infrastructure & Utilities
**Goal**: helper functions, types, and state management.
**Directories**:
- `src/lib/`
- `src/types/`
- `src/store/`
- `src/generated/`
- `src/jobs/`

### Phase 4: Shared Components (UI Library)
**Goal**: Analyze reusable UI elements.
**Directories**:
- `src/components/`

### Phase 5: Authentication & Public Pages
**Goal**: Analyze entry points and auth flows.
**Directories**:
- `src/app/(public)`
- `src/app/auth`
- `src/app/(future canvas)`

### Phase 6: Member & Admin Portals
**Goal**: Analyze core application features for users.
**Directories**:
- `src/app/member`
- `src/app/admin`
- `src/app/admin-dashboard`
- `src/app/church-admin`

### Phase 7: Ministry & Role-Specific Portals
**Goal**: Analyze specialized dashboards.
**Directories**:
- `src/app/discipleship_leader`
- `src/app/events_manager`
- `src/app/finance_administrator`
- `src/app/outreach_director`
- `src/app/senior_pastor`
- `src/app/worship_leader`
- `src/app/volunteer_coordinator`
- `src/app/tech_media_manager`
- `src/app/small_groups_leader`
- `src/app/secretary`
- `src/app/overall_ministries_coordinator`
- `src/app/counselor`
- `src/app/communications_officer`
- `src/app/children_youth_director`

### Phase 8: API Layer (Deep Dive)
**Goal**: Detailed logic analysis of backend routes (building on previous overview).
**Directories**:
- `src/app/api/` (Detailed line-by-line logic breakdown)

---

## Execution Strategy
The user will prompt for each phase independently. The agent should:
1.  Read the target files for the current phase.
2.  Generate the analysis report based on the template.
3.  Append the analysis to a `PROJECT_ANALYSIS_REPORT.md` (or specific phase report) in the root.
