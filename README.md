# CampusOS — Campus Management & Student Portal

A modern, responsive, full-stack Higher Education Campus Management & Student Portal web application built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, **Framer Motion**, and **Supabase**.

---

## 🏛️ System Overview

**CampusOS** provides an integrated academic environment for students, faculty, and university administrators:
- **Academic Dashboard**: Real-time overview of enrolled degree/diploma programs, live attendance tracking with 85% requirement gauge, fee clearance status, and digital ID card generation.
- **Courses & Study Notes**: Curriculum directory with downloadable syllabus PDFs, lecture slides, code repositories, and animated progress bars.
- **Campus Notice Board**: Real-time official bulletins with interactive category filtering (`All`, `Urgent`, `Exams`, `Events`, `Holidays`), search keywords, and pinned priority dean notices.
- **Events & Schedule**: Interactive campus symposium, career fair, and workshop schedule with **one-click RSVP / Register** functionality.
- **Faculty / Admin Panel**: Protected view restricted to `role = 'admin'` with forms to publish urgent campus notices, create courses/diplomas, schedule events, and view live student event registrations.

---

## 🛠️ Tech Stack & Architecture

- **Framework**: [Next.js](https://nextjs.org/) (App Router, Turbopack, React 19)
- **Language**: TypeScript (strict types for profiles, courses, notices, events, and registrations)
- **Styling**: Tailwind CSS with an academic SaaS aesthetic (slate, indigo, and emerald palette, sleek dark theme, glassmorphic cards)
- **Animations**: [Framer Motion](https://www.framer.com/motion/) for fluid page transitions, staggered entrances (`StaggerContainer`, `StaggerItem`), smooth section reveals (`FadeIn`), interactive tab indicators (`layoutId`), and modal popups
- **Icons**: [Lucide React](https://lucide.dev/)
- **Backend & Database**: [Supabase](https://supabase.com/) (`@supabase/supabase-js`, `@supabase/ssr`, PostgreSQL, RLS policies, triggers)
- **Notifications**: Reusable Toast notification provider with custom physics and loading skeletons

---

## 📂 Project Structure

```
├── supabase/
│   └── schema.sql                  # Complete PostgreSQL schema, RLS policies & seed data
├── src/
│   ├── app/
│   │   ├── admin/
│   │   │   └── page.tsx            # Protected Admin Portal (notices, courses, registrations)
│   │   ├── dashboard/
│   │   │   ├── layout.tsx          # Responsive layout: Desktop fixed sidebar + Mobile drawer
│   │   │   ├── page.tsx            # Student Overview (stat cards, timetable, digital ID modal)
│   │   │   ├── courses/
│   │   │   │   └── page.tsx        # Courses & downloadable study materials
│   │   │   ├── notices/
│   │   │   │   └── page.tsx        # Notice Board with animated category filters
│   │   │   └── events/
│   │   │       └── page.tsx        # Campus Events with 1-click RSVP
│   │   ├── login/
│   │   │   └── page.tsx            # Login with instant 1-click demo presets
│   │   ├── signup/
│   │   │   └── page.tsx            # Signup with role selection ('student' | 'admin')
│   │   ├── globals.css             # Tailwind v4 theme & custom scrollbar
│   │   ├── layout.tsx              # Root HTML & metadata wrapper with Providers
│   │   └── page.tsx                # Modern Landing Page with animated Hero & Features
│   ├── components/
│   │   ├── motion/
│   │   │   ├── FadeIn.tsx          # Framer Motion scroll-reveal wrapper
│   │   │   ├── StaggerContainer.tsx# Staggered entrance parent container
│   │   │   └── StaggerItem.tsx     # Staggered entrance child item
│   │   ├── providers/
│   │   │   └── AppProviders.tsx    # Unified Toast + Campus Provider wrapper
│   │   ├── ui/
│   │   │   ├── Skeleton.tsx        # Loading skeletons for cards and notices
│   │   │   └── Toast.tsx           # Toast notification provider & hook
│   │   ├── Features.tsx            # 4 Core Pillars feature grid
│   │   ├── Footer.tsx              # Campus branding & footer links
│   │   ├── Hero.tsx                # Hero section with animated metrics & CTAs
│   │   └── Navbar.tsx              # Responsive top navigation bar
│   ├── context/
│   │   └── CampusContext.tsx       # Auth & Realtime Data Store (Supabase + Local Demo fallback)
│   ├── lib/
│   │   ├── mockData.ts             # Rich academic initial datasets & demo accounts
│   │   └── supabase/
│   │       ├── client.ts           # Browser Supabase client helper
│   │       ├── server.ts           # Server Supabase client helper
│   │       └── middleware.ts       # Session refresh & protected route guard
│   └── types/
│       └── database.ts             # Database entity TypeScript definitions
├── .env.example                    # Environment variable template
└── package.json
```

---

## 🗄️ Supabase Database Setup

### 1. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Add your Supabase Project URL and Anon Key:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 2. Execute SQL Schema
Open the **SQL Editor** in your Supabase Dashboard and run the entire [supabase/schema.sql](file:///c:/Users/DELL/.gemini/antigravity/scratch/nextjs-supabase-framer-app/supabase/schema.sql) file.

The schema creates:
1. `profiles`: Linked to `auth.users(id)` with `email`, `full_name`, `role` (`'student' | 'admin'`), `course_name`, `student_id`, and `created_at`.
2. `courses`: `id`, `title`, `duration`, `description`, `syllabus_url`, `instructor`, `credits`, `enrolled_count`.
3. `notices`: `id`, `title`, `content`, `category` (`'Exams' | 'Events' | 'Holidays' | 'Urgent'`), `is_pinned`, `author_name`.
4. `events`: `id`, `title`, `event_date`, `location`, `description`, `capacity`.
5. `event_registrations`: `id`, `event_id`, `user_id`, `created_at` with unique compound index.
6. **Row Level Security (RLS)**: Authenticated students can read public campus data and register for events; administrators have full write permissions.
7. **Auth Trigger**: `handle_new_user()` automatically provisions a student or admin profile on signup.
8. **Seed Data**: Pre-populated courses, notices, and events.

---

## ⚡ Instant Demo Mode (Zero Config)

CampusOS includes an **automatic fallback state** when Supabase keys are pending or in local development:
- **Demo Student**: `alex.rivers@campus.edu` (Alex Rivers, B.Tech in AI & Data Science)
- **Demo Admin**: `sarah.vance@campus.edu` (Dean Sarah Vance, Campus Administration)
- Click **"Demo Student"** or **"Demo Admin"** on the Landing Page, Login Page, or Sidebar to switch between student and administrative views instantly!
- All mutations (creating notices, adding courses, scheduling events, RSVPing) update state optimistically with interactive feedback.

---

## 🚀 Running Locally

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

3. **Build for production**:
   ```bash
   npm run build
   ```
