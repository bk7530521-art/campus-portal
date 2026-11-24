export type UserRole = "student" | "admin";

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  course_name: string;
  student_id: string;
  avatar_url?: string;
  created_at: string;
  updated_at?: string;
}

export interface Course {
  id: string;
  title: string;
  duration: string;
  description: string;
  syllabus_url: string;
  instructor: string;
  credits: number;
  enrolled_count: number;
  progress?: number;
  created_at: string;
}

export type NoticeCategory = "Exams" | "Events" | "Holidays" | "Urgent";

export interface Notice {
  id: string;
  title: string;
  content: string;
  category: NoticeCategory;
  is_pinned: boolean;
  author_name: string;
  created_at: string;
}

export interface CampusEvent {
  id: string;
  title: string;
  event_date: string;
  location: string;
  description: string;
  capacity: number;
  created_at: string;
  registered_count?: number;
  is_registered?: boolean;
}

export interface EventRegistration {
  id: string;
  event_id: string;
  user_id: string;
  created_at: string;
  event?: CampusEvent;
  user?: Profile;
}
