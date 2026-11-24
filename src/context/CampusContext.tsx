"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import {
  Profile,
  Course,
  Notice,
  CampusEvent,
  EventRegistration,
  UserRole,
} from "@/types/database";
import {
  INITIAL_STUDENT_PROFILE,
  INITIAL_ADMIN_PROFILE,
  INITIAL_COURSES,
  INITIAL_NOTICES,
  INITIAL_EVENTS,
} from "@/lib/mockData";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

interface CampusContextType {
  user: Profile | null;
  isLoading: boolean;
  isSupabaseConnected: boolean;
  courses: Course[];
  notices: Notice[];
  events: CampusEvent[];
  registrations: EventRegistration[];
  // Auth methods
  signIn: (email: string, pass: string) => Promise<{ error?: string }>;
  signUp: (
    email: string,
    pass: string,
    fullName: string,
    role: UserRole,
    courseName?: string
  ) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  loginAsDemo: (role: UserRole) => void;
  // Mutations
  addNotice: (
    notice: Omit<Notice, "id" | "created_at">
  ) => Promise<{ error?: string }>;
  deleteNotice: (id: string) => Promise<{ error?: string }>;
  addCourse: (
    course: Omit<Course, "id" | "created_at">
  ) => Promise<{ error?: string }>;
  addEvent: (
    event: Omit<CampusEvent, "id" | "created_at" | "is_registered" | "registered_count">
  ) => Promise<{ error?: string }>;
  toggleRsvp: (eventId: string) => Promise<{ error?: string; status?: "registered" | "cancelled" }>;
  // Refresh
  refreshData: () => Promise<void>;
}

const CampusContext = createContext<CampusContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY_USER = "campus_portal_user";
const LOCAL_STORAGE_KEY_NOTICES = "campus_portal_notices";
const LOCAL_STORAGE_KEY_COURSES = "campus_portal_courses";
const LOCAL_STORAGE_KEY_EVENTS = "campus_portal_events";
const LOCAL_STORAGE_KEY_REGISTRATIONS = "campus_portal_registrations";

export function CampusProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [courses, setCourses] = useState<Course[]>(INITIAL_COURSES);
  const [notices, setNotices] = useState<Notice[]>(INITIAL_NOTICES);
  const [events, setEvents] = useState<CampusEvent[]>(INITIAL_EVENTS);
  const [registrations, setRegistrations] = useState<EventRegistration[]>([]);

  const isConfigured = isSupabaseConfigured();

  // Load initial data
  const loadData = useCallback(async () => {
    setIsLoading(true);
    const supabase = createClient();

    if (isConfigured && supabase) {
      try {
        // 1. Fetch Auth session
        const { data: authData } = await supabase.auth.getUser();
        if (authData?.user) {
          const { data: profileData } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", authData.user.id)
            .single();

          if (profileData) {
            setUser(profileData as Profile);
          } else {
            // Fallback profile if trigger hasn't fired yet
            setUser({
              id: authData.user.id,
              email: authData.user.email || "student@campus.edu",
              full_name: authData.user.user_metadata?.full_name || "Student User",
              role: (authData.user.user_metadata?.role as UserRole) || "student",
              course_name:
                authData.user.user_metadata?.course_name ||
                "B.Tech in Artificial Intelligence & Data Science",
              student_id: `STU-${authData.user.id.substring(0, 6).toUpperCase()}`,
              created_at: new Date().toISOString(),
            });
          }
        } else {
          setUser(null);
        }

        // 2. Fetch Courses
        const { data: coursesData } = await supabase
          .from("courses")
          .select("*")
          .order("created_at", { ascending: false });
        if (coursesData && coursesData.length > 0) {
          setCourses(coursesData);
        }

        // 3. Fetch Notices
        const { data: noticesData } = await supabase
          .from("notices")
          .select("*")
          .order("is_pinned", { ascending: false })
          .order("created_at", { ascending: false });
        if (noticesData && noticesData.length > 0) {
          setNotices(noticesData);
        }

        // 4. Fetch Events & Registrations
        const { data: eventsData } = await supabase
          .from("events")
          .select("*")
          .order("event_date", { ascending: true });

        let userRegs: string[] = [];
        if (authData?.user) {
          const { data: regData } = await supabase
            .from("event_registrations")
            .select("event_id")
            .eq("user_id", authData.user.id);
          userRegs = (regData || []).map((r) => r.event_id);
        }

        if (eventsData && eventsData.length > 0) {
          setEvents(
            eventsData.map((ev) => ({
              ...ev,
              is_registered: userRegs.includes(ev.id),
              registered_count: ev.capacity ? Math.floor(ev.capacity * 0.75) : 50,
            }))
          );
        }

        // 5. If admin, fetch all registrations
        const { data: allRegs } = await supabase
          .from("event_registrations")
          .select("*, event:events(*), user:profiles(*)");
        if (allRegs) {
          setRegistrations(allRegs as EventRegistration[]);
        }
      } catch (err) {
        console.warn("Supabase fetch failed, falling back to local state:", err);
        loadLocalFallback();
      }
    } else {
      loadLocalFallback();
    }
    setIsLoading(false);
  }, [isConfigured]);

  const loadLocalFallback = () => {
    if (typeof window === "undefined") return;

    // Load user
    const savedUser = localStorage.getItem(LOCAL_STORAGE_KEY_USER);
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        setUser(INITIAL_STUDENT_PROFILE);
      }
    } else {
      // Default initial session for seamless first-load demo
      setUser(INITIAL_STUDENT_PROFILE);
    }

    // Load notices
    const savedNotices = localStorage.getItem(LOCAL_STORAGE_KEY_NOTICES);
    if (savedNotices) {
      try {
        setNotices(JSON.parse(savedNotices));
      } catch {
        setNotices(INITIAL_NOTICES);
      }
    }

    // Load courses
    const savedCourses = localStorage.getItem(LOCAL_STORAGE_KEY_COURSES);
    if (savedCourses) {
      try {
        setCourses(JSON.parse(savedCourses));
      } catch {
        setCourses(INITIAL_COURSES);
      }
    }

    // Load events
    const savedEvents = localStorage.getItem(LOCAL_STORAGE_KEY_EVENTS);
    if (savedEvents) {
      try {
        setEvents(JSON.parse(savedEvents));
      } catch {
        setEvents(INITIAL_EVENTS);
      }
    }

    // Load registrations
    const savedRegs = localStorage.getItem(LOCAL_STORAGE_KEY_REGISTRATIONS);
    if (savedRegs) {
      try {
        setRegistrations(JSON.parse(savedRegs));
      } catch {
        setRegistrations([]);
      }
    }
  };

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Auth: Sign In
  const signIn = async (email: string, pass: string) => {
    const supabase = createClient();
    if (isConfigured && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: pass,
      });
      if (error) return { error: error.message };

      if (data.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", data.user.id)
          .single();

        if (profile) {
          setUser(profile as Profile);
        } else {
          setUser({
            id: data.user.id,
            email: data.user.email || email,
            full_name: data.user.user_metadata?.full_name || "Campus User",
            role: (data.user.user_metadata?.role as UserRole) || "student",
            course_name:
              data.user.user_metadata?.course_name ||
              "B.Tech in Artificial Intelligence & Data Science",
            student_id: `STU-${data.user.id.substring(0, 6).toUpperCase()}`,
            created_at: new Date().toISOString(),
          });
        }
      }
      return {};
    }

    // Fallback Mock Sign In
    const normalized = email.toLowerCase().trim();
    const isAdmin =
      normalized.includes("admin") ||
      normalized === "admin@campus.edu" ||
      normalized === "sarah.vance@campus.edu";

    const profile: Profile = isAdmin
      ? { ...INITIAL_ADMIN_PROFILE, email }
      : { ...INITIAL_STUDENT_PROFILE, email, full_name: email.split("@")[0] };

    setUser(profile);
    if (typeof window !== "undefined") {
      localStorage.setItem(LOCAL_STORAGE_KEY_USER, JSON.stringify(profile));
    }
    return {};
  };

  // Auth: Sign Up
  const signUp = async (
    email: string,
    pass: string,
    fullName: string,
    role: UserRole,
    courseName?: string
  ) => {
    const supabase = createClient();
    if (isConfigured && supabase) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password: pass,
        options: {
          data: {
            full_name: fullName,
            role,
            course_name: courseName || "B.Tech in Artificial Intelligence & Data Science",
          },
        },
      });

      if (error) return { error: error.message };

      if (data.user) {
        const profile: Profile = {
          id: data.user.id,
          email,
          full_name: fullName,
          role,
          course_name:
            courseName || "B.Tech in Artificial Intelligence & Data Science",
          student_id: `${role === "admin" ? "ADM" : "STU"}-${data.user.id
            .substring(0, 6)
            .toUpperCase()}`,
          created_at: new Date().toISOString(),
        };
        setUser(profile);
      }
      return {};
    }

    // Fallback Mock Sign Up
    const mockId = "user-" + Math.random().toString(36).substring(2, 9);
    const profile: Profile = {
      id: mockId,
      email,
      full_name: fullName,
      role,
      course_name:
        courseName || "B.Tech in Artificial Intelligence & Data Science",
      student_id: `${role === "admin" ? "ADM" : "STU"}-${Math.floor(
        100000 + Math.random() * 900000
      )}`,
      created_at: new Date().toISOString(),
    };

    setUser(profile);
    if (typeof window !== "undefined") {
      localStorage.setItem(LOCAL_STORAGE_KEY_USER, JSON.stringify(profile));
    }
    return {};
  };

  // Auth: Sign Out
  const signOut = async () => {
    const supabase = createClient();
    if (isConfigured && supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem(LOCAL_STORAGE_KEY_USER);
    }
  };

  // 1-Click Demo Login
  const loginAsDemo = (role: UserRole) => {
    const profile =
      role === "admin" ? INITIAL_ADMIN_PROFILE : INITIAL_STUDENT_PROFILE;
    setUser(profile);
    if (typeof window !== "undefined") {
      localStorage.setItem(LOCAL_STORAGE_KEY_USER, JSON.stringify(profile));
    }
  };

  // Mutation: Add Notice
  const addNotice = async (noticeData: Omit<Notice, "id" | "created_at">) => {
    const newNotice: Notice = {
      ...noticeData,
      id: "notice-" + Math.random().toString(36).substring(2, 9),
      created_at: new Date().toISOString(),
    };

    const supabase = createClient();
    if (isConfigured && supabase) {
      const { data, error } = await supabase
        .from("notices")
        .insert([noticeData])
        .select()
        .single();
      if (error) return { error: error.message };
      if (data) {
        setNotices((prev) => [data, ...prev]);
        return {};
      }
    }

    setNotices((prev) => {
      const updated = [newNotice, ...prev];
      if (typeof window !== "undefined") {
        localStorage.setItem(LOCAL_STORAGE_KEY_NOTICES, JSON.stringify(updated));
      }
      return updated;
    });
    return {};
  };

  // Mutation: Delete Notice
  const deleteNotice = async (id: string) => {
    const supabase = createClient();
    if (isConfigured && supabase) {
      const { error } = await supabase.from("notices").delete().eq("id", id);
      if (error) return { error: error.message };
    }

    setNotices((prev) => {
      const updated = prev.filter((n) => n.id !== id);
      if (typeof window !== "undefined") {
        localStorage.setItem(LOCAL_STORAGE_KEY_NOTICES, JSON.stringify(updated));
      }
      return updated;
    });
    return {};
  };

  // Mutation: Add Course
  const addCourse = async (courseData: Omit<Course, "id" | "created_at">) => {
    const newCourse: Course = {
      ...courseData,
      id: "course-" + Math.random().toString(36).substring(2, 9),
      created_at: new Date().toISOString(),
    };

    const supabase = createClient();
    if (isConfigured && supabase) {
      const { data, error } = await supabase
        .from("courses")
        .insert([courseData])
        .select()
        .single();
      if (error) return { error: error.message };
      if (data) {
        setCourses((prev) => [data, ...prev]);
        return {};
      }
    }

    setCourses((prev) => {
      const updated = [newCourse, ...prev];
      if (typeof window !== "undefined") {
        localStorage.setItem(LOCAL_STORAGE_KEY_COURSES, JSON.stringify(updated));
      }
      return updated;
    });
    return {};
  };

  // Mutation: Add Event
  const addEvent = async (
    eventData: Omit<CampusEvent, "id" | "created_at" | "is_registered" | "registered_count">
  ) => {
    const newEv: CampusEvent = {
      ...eventData,
      id: "event-" + Math.random().toString(36).substring(2, 9),
      is_registered: false,
      registered_count: 0,
      created_at: new Date().toISOString(),
    };

    const supabase = createClient();
    if (isConfigured && supabase) {
      const { data, error } = await supabase
        .from("events")
        .insert([eventData])
        .select()
        .single();
      if (error) return { error: error.message };
      if (data) {
        setEvents((prev) => [
          { ...data, is_registered: false, registered_count: 0 },
          ...prev,
        ]);
        return {};
      }
    }

    setEvents((prev) => {
      const updated = [newEv, ...prev];
      if (typeof window !== "undefined") {
        localStorage.setItem(LOCAL_STORAGE_KEY_EVENTS, JSON.stringify(updated));
      }
      return updated;
    });
    return {};
  };

  // Mutation: Toggle RSVP
  const toggleRsvp = async (eventId: string) => {
    if (!user) {
      return { error: "Please log in to RSVP for campus events." };
    }

    const currentEvent = events.find((e) => e.id === eventId);
    if (!currentEvent) return { error: "Event not found" };

    const willBeRegistered = !currentEvent.is_registered;

    const supabase = createClient();
    if (isConfigured && supabase) {
      if (willBeRegistered) {
        const { error } = await supabase
          .from("event_registrations")
          .insert([{ event_id: eventId, user_id: user.id }]);
        if (error) return { error: error.message };
      } else {
        const { error } = await supabase
          .from("event_registrations")
          .delete()
          .eq("event_id", eventId)
          .eq("user_id", user.id);
        if (error) return { error: error.message };
      }
    }

    // Optimistic UI state update
    setEvents((prev) => {
      const updated = prev.map((e) => {
        if (e.id === eventId) {
          const delta = willBeRegistered ? 1 : -1;
          return {
            ...e,
            is_registered: willBeRegistered,
            registered_count: Math.max(0, (e.registered_count || 0) + delta),
          };
        }
        return e;
      });
      if (typeof window !== "undefined") {
        localStorage.setItem(LOCAL_STORAGE_KEY_EVENTS, JSON.stringify(updated));
      }
      return updated;
    });

    // Update registrations list for admin
    if (willBeRegistered) {
      const newReg: EventRegistration = {
        id: "reg-" + Math.random().toString(36).substring(2, 9),
        event_id: eventId,
        user_id: user.id,
        created_at: new Date().toISOString(),
        event: currentEvent,
        user: user,
      };
      setRegistrations((prev) => {
        const next = [newReg, ...prev];
        if (typeof window !== "undefined") {
          localStorage.setItem(LOCAL_STORAGE_KEY_REGISTRATIONS, JSON.stringify(next));
        }
        return next;
      });
    } else {
      setRegistrations((prev) => {
        const next = prev.filter(
          (r) => !(r.event_id === eventId && r.user_id === user.id)
        );
        if (typeof window !== "undefined") {
          localStorage.setItem(LOCAL_STORAGE_KEY_REGISTRATIONS, JSON.stringify(next));
        }
        return next;
      });
    }

    return { status: willBeRegistered ? ("registered" as const) : ("cancelled" as const) };
  };

  return (
    <CampusContext.Provider
      value={{
        user,
        isLoading,
        isSupabaseConnected: isConfigured,
        courses,
        notices,
        events,
        registrations,
        signIn,
        signUp,
        signOut,
        loginAsDemo,
        addNotice,
        deleteNotice,
        addCourse,
        addEvent,
        toggleRsvp,
        refreshData: loadData,
      }}
    >
      {children}
    </CampusContext.Provider>
  );
}

export function useCampus() {
  const context = useContext(CampusContext);
  if (!context) {
    throw new Error("useCampus must be used within a CampusProvider");
  }
  return context;
}
