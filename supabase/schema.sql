-- ==============================================================================
-- CAMPUS MANAGEMENT & STUDENT PORTAL - SUPABASE DATABASE SCHEMA
-- ==============================================================================

-- 1. Enable UUID Extension
create extension if not exists "uuid-ossp";

-- 2. Create PROFILES Table (links to auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text not null,
  role text not null check (role in ('student', 'admin')) default 'student',
  course_name text default 'Computer Science & AI',
  student_id text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Create COURSES Table
create table if not exists public.courses (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  duration text not null,
  description text not null,
  syllabus_url text,
  instructor text default 'Dr. Alan Vance',
  credits integer default 4,
  enrolled_count integer default 120,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Create NOTICES Table
create table if not exists public.notices (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  content text not null,
  category text not null check (category in ('Exams', 'Events', 'Holidays', 'Urgent')),
  is_pinned boolean default false,
  author_name text default 'Dean of Academics',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Create EVENTS Table
create table if not exists public.events (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  event_date timestamp with time zone not null,
  location text not null,
  description text not null,
  capacity integer default 250,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. Create EVENT_REGISTRATIONS Table
create table if not exists public.event_registrations (
  id uuid primary key default uuid_generate_v4(),
  event_id uuid not null references public.events(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (event_id, user_id)
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

alter table public.profiles enable row level security;
alter table public.courses enable row level security;
alter table public.notices enable row level security;
alter table public.events enable row level security;
alter table public.event_registrations enable row level security;

-- PROFILES POLICIES
create policy "Public profiles are viewable by authenticated users"
  on public.profiles for select
  to authenticated
  using (true);

create policy "Users can update their own profile"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id);

create policy "Users can insert their own profile"
  on public.profiles for insert
  to authenticated
  with check (auth.uid() = id);

-- COURSES POLICIES
create policy "Anyone authenticated can view courses"
  on public.courses for select
  to authenticated
  using (true);

create policy "Public courses visible to anon"
  on public.courses for select
  to anon
  using (true);

create policy "Admins can insert courses"
  on public.courses for insert
  to authenticated
  with check (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

create policy "Admins can update courses"
  on public.courses for update
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

create policy "Admins can delete courses"
  on public.courses for delete
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

-- NOTICES POLICIES
create policy "Anyone can read campus notices"
  on public.notices for select
  to anon, authenticated
  using (true);

create policy "Only admins can insert notices"
  on public.notices for insert
  to authenticated
  with check (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

create policy "Only admins can update notices"
  on public.notices for update
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

create policy "Only admins can delete notices"
  on public.notices for delete
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

-- EVENTS POLICIES
create policy "Anyone can read campus events"
  on public.events for select
  to anon, authenticated
  using (true);

create policy "Only admins can insert events"
  on public.events for insert
  to authenticated
  with check (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

create policy "Only admins can update events"
  on public.events for update
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

create policy "Only admins can delete events"
  on public.events for delete
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

-- EVENT REGISTRATIONS POLICIES
create policy "Users can view their registrations or admins view all"
  on public.event_registrations for select
  to authenticated
  using (
    auth.uid() = user_id or
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

create policy "Authenticated students can register for events"
  on public.event_registrations for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can cancel their own event registration"
  on public.event_registrations for delete
  to authenticated
  using (auth.uid() = user_id);

-- ==============================================================================
-- AUTOMATIC PROFILE CREATION TRIGGER ON AUTH SIGNUP
-- ==============================================================================

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, role, course_name, student_id)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', 'Student User'),
    coalesce(new.raw_user_meta_data->>'role', 'student'),
    coalesce(new.raw_user_meta_data->>'course_name', 'B.Tech in Artificial Intelligence'),
    concat('STU-', upper(substring(new.id::text from 1 for 6)))
  )
  on conflict (id) do update set
    email = excluded.email,
    full_name = excluded.full_name;
  return new;
end;
$$ language plpgsql security definer;

-- Trigger execution
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ==============================================================================
-- SAMPLE SEED DATA
-- ==============================================================================

insert into public.courses (id, title, duration, description, syllabus_url, instructor, credits, enrolled_count)
values
  ('11111111-1111-1111-1111-111111111111', 'B.Tech in Artificial Intelligence & Data Science', '4 Years (8 Semesters)', 'Deep dive into machine learning, neural networks, computer vision, LLM engineering, and cloud deployment pipelines.', 'https://raw.githubusercontent.com/campus/syllabi/main/ai-ds-2026.pdf', 'Dr. Sarah Mitchell', 160, 240),
  ('22222222-2222-2222-2222-222222222222', 'M.Sc. Cybersecurity & Cloud Defense Systems', '2 Years (4 Semesters)', 'Advanced offensive and defensive security operations, penetration testing, cryptography, and containerized cloud defense.', 'https://raw.githubusercontent.com/campus/syllabi/main/cybersec-2026.pdf', 'Prof. Marcus Chen', 80, 95),
  ('33333333-3333-3333-3333-333333333333', 'Full Stack Web & Distributed Systems Diploma', '1 Year (2 Semesters)', 'Modern frontend architectures with Next.js & React, microservices with Go & Node, PostgreSQL database tuning, and Docker orchestration.', 'https://raw.githubusercontent.com/campus/syllabi/main/fullstack-diploma.pdf', 'Elena Rostova', 48, 310),
  ('44444444-4444-4444-4444-444444444444', 'Executive Diploma in DevOps & SRE Cloud Infra', '6 Months', 'CI/CD pipeline construction, Kubernetes cluster operations, Terraform infrastructure as code, and site reliability monitoring.', 'https://raw.githubusercontent.com/campus/syllabi/main/devops-sre.pdf', 'David K. Vance', 24, 180)
on conflict (id) do nothing;

insert into public.notices (id, title, content, category, is_pinned, author_name)
values
  ('55555555-5555-5555-5555-555555555555', 'Urgent: Mid-Term Examination Schedule & Hall Tickets Available', 'Mid-Term Examinations for all academic programs begin on December 10, 2026. Students must download their digital hall tickets from the portal before December 5th. No late admit cards will be issued.', 'Urgent', true, 'Dean of Academics'),
  ('66666666-6666-6666-6666-666666666666', 'Fall Semester Project Submissions & Code Reviews', 'All final year capstone project repositories must be finalized and tagged v1.0 on GitHub by Friday, Dec 4. Faculty viva and code walkthrough sessions will run Dec 6-8.', 'Exams', true, 'Department Head - CS'),
  ('77777777-7777-7777-7777-777777777777', 'National Youth Hackathon 2026 Registration Now Open', 'Represent our campus at the Inter-Collegiate 48-Hour Hackathon with cash awards over $25,000. Free accommodation, mentorship from tech leads, and direct job interviews for top finalists.', 'Events', false, 'Campus Innovation Cell'),
  ('88888888-8888-8888-8888-888888888888', 'Winter Break & Campus Library Extended Hours Notice', 'The academic campus will observe Winter Recess from Dec 24 through Jan 3. The Digital Commons and Main Campus Library will remain open 24/7 with badge access.', 'Holidays', false, 'Campus Administration')
on conflict (id) do nothing;

insert into public.events (id, title, event_date, location, description, capacity)
values
  ('99999999-9999-9999-9999-999999999999', 'InnovateX 2026: Campus Tech Symposium & Expo', timezone('utc'::text, now() + interval '5 days'), 'Main Auditorium & Turing Hall', 'Keynote talks by AI researchers, student research poster presentations, and live hardware robotics demonstrations.', 400),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Annual Campus Career Fair & Industry Mixer', timezone('utc'::text, now() + interval '12 days'), 'Campus Exhibition Arena - Hall B', 'Over 65 leading tech companies hiring for internships, software engineering, cloud, and product design roles.', 600),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Workshop: Building Production AI Agents with Next.js', timezone('utc'::text, now() + interval '18 days'), 'Lab 4 - Advanced Computing Wing', 'Hands-on coding workshop covering Next.js App Router, streaming UI components, Supabase Vector database, and model integration.', 80),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Annual Campus Cultural Night & Acoustic Concert', timezone('utc'::text, now() + interval '25 days'), 'Open Air Amphitheatre', 'Music performances by university bands, food trucks, theater club drama showcase, and student art gallery.', 800)
on conflict (id) do nothing;
