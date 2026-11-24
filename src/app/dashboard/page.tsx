"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap,
  Calendar,
  CheckCircle2,
  DollarSign,
  ArrowRight,
  Bell,
  BookOpen,
  Download,
  Clock,
  Sparkles,
  MapPin,
  ExternalLink,
  CreditCard,
  X,
  FileCheck,
  TrendingUp,
} from "lucide-react";
import { useCampus } from "@/context/CampusContext";
import { FadeIn } from "@/components/motion/FadeIn";
import { StaggerContainer } from "@/components/motion/StaggerContainer";
import { StaggerItem } from "@/components/motion/StaggerItem";
import { useToast } from "@/components/ui/Toast";

export default function DashboardOverviewPage() {
  const { user, notices, events, courses } = useCampus();
  const { success, info } = useToast();
  const [showIdCardModal, setShowIdCardModal] = useState(false);

  const registeredEvents = events.filter((e) => e.is_registered);
  const urgentNotice = notices.find((n) => n.category === "Urgent") || notices[0];

  const handleDownloadId = () => {
    success("Digital Campus ID card downloaded as PDF.", "ID Card Generated");
  };

  const handlePayFees = () => {
    info("All semester academic fees are settled for this term.", "Account Status");
  };

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <FadeIn direction="up">
        <div className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-indigo-950/70 via-slate-900 to-slate-900 border border-indigo-500/30 overflow-hidden shadow-2xl">
          <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-80 h-80 bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-300 mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                Fall Semester 2026 • Active Term
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Welcome back, {user?.full_name || "Alex Rivers"}
              </h1>
              <p className="mt-1 text-sm text-slate-300 max-w-xl">
                Enrolled in{" "}
                <span className="font-semibold text-indigo-300">
                  {user?.course_name || "B.Tech in Artificial Intelligence & Data Science"}
                </span>{" "}
                • Student ID:{" "}
                <span className="font-mono text-emerald-400">
                  {user?.student_id || "STU-884210"}
                </span>
              </p>
            </div>

            <div className="flex flex-wrap gap-2.5">
              <button
                onClick={() => setShowIdCardModal(true)}
                className="px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 hover:border-slate-600 text-xs font-semibold text-white transition-all flex items-center gap-2 shadow-sm"
              >
                <CreditCard className="w-4 h-4 text-indigo-400" />
                <span>Digital ID Card</span>
              </button>
              <Link
                href="/dashboard/courses"
                className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white transition-all flex items-center gap-2 shadow-md shadow-indigo-600/20"
              >
                <BookOpen className="w-4 h-4" />
                <span>My Syllabus</span>
              </Link>
            </div>
          </div>
        </div>
      </FadeIn>

      {/* =========================================================================
          ANIMATED STAT OVERVIEW CARDS
      ========================================================================== */}
      <StaggerContainer
        staggerDelay={0.08}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
      >
        {/* Card 1: Enrolled Course */}
        <StaggerItem>
          <div className="h-full p-5 rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-md flex flex-col justify-between hover:border-indigo-500/40 transition-all shadow-lg group">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-slate-400">
                  Enrolled Program
                </span>
                <div className="p-2 rounded-xl bg-indigo-950/60 border border-indigo-800/50 text-indigo-400">
                  <GraduationCap className="w-4 h-4" />
                </div>
              </div>
              <div className="font-bold text-base text-white group-hover:text-indigo-300 transition-colors line-clamp-2">
                {user?.course_name || "B.Tech in Artificial Intelligence"}
              </div>
              <div className="text-xs text-slate-400 mt-1">
                Semester 5 of 8 • 160 Credits
              </div>
            </div>

            <div className="pt-4 mt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-indigo-400">
              <Link
                href="/dashboard/courses"
                className="flex items-center gap-1 hover:underline"
              >
                <span>Curriculum & Notes</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </StaggerItem>

        {/* Card 2: Attendance % */}
        <StaggerItem>
          <div className="h-full p-5 rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-md flex flex-col justify-between hover:border-emerald-500/40 transition-all shadow-lg group">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-slate-400">
                  Attendance Record
                </span>
                <div className="p-2 rounded-xl bg-emerald-950/60 border border-emerald-800/50 text-emerald-400">
                  <TrendingUp className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <div className="text-3xl font-extrabold text-white">92.4%</div>
                <span className="text-xs font-semibold text-emerald-400">
                  +1.8% this month
                </span>
              </div>
              <div className="text-xs text-slate-400 mt-1">
                Required minimum: 85.0%
              </div>
            </div>

            <div className="pt-4 mt-3 border-t border-slate-800/80">
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-emerald-500 to-teal-400 h-2 rounded-full"
                  style={{ width: "92.4%" }}
                />
              </div>
            </div>
          </div>
        </StaggerItem>

        {/* Card 3: Pending Fees */}
        <StaggerItem>
          <div className="h-full p-5 rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-md flex flex-col justify-between hover:border-cyan-500/40 transition-all shadow-lg group">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-slate-400">
                  Fee Status (Fall 2026)
                </span>
                <div className="p-2 rounded-xl bg-cyan-950/60 border border-cyan-800/50 text-cyan-400">
                  <DollarSign className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-extrabold text-white">$0.00</div>
              <div className="text-xs text-emerald-400 font-semibold mt-1 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                All term dues cleared
              </div>
            </div>

            <div className="pt-4 mt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <button
                onClick={handlePayFees}
                className="hover:text-white transition-colors"
              >
                View e-Receipt #7712
              </button>
              <span className="text-emerald-400 font-medium">Cleared</span>
            </div>
          </div>
        </StaggerItem>

        {/* Card 4: Upcoming Events */}
        <StaggerItem>
          <div className="h-full p-5 rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-md flex flex-col justify-between hover:border-amber-500/40 transition-all shadow-lg group">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-slate-400">
                  Events Registered
                </span>
                <div className="p-2 rounded-xl bg-amber-950/60 border border-amber-800/50 text-amber-400">
                  <Calendar className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-extrabold text-white">
                {registeredEvents.length} Active
              </div>
              <div className="text-xs text-slate-400 mt-1">
                {registeredEvents.length > 0
                  ? `Next: ${registeredEvents[0].title.substring(0, 24)}...`
                  : "No events registered yet"}
              </div>
            </div>

            <div className="pt-4 mt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-amber-400">
              <Link
                href="/dashboard/events"
                className="flex items-center gap-1 hover:underline"
              >
                <span>Browse Schedule</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </StaggerItem>
      </StaggerContainer>

      {/* =========================================================================
          TWO-COLUMN MAIN SECTION: TODAY'S SCHEDULE & URGENT CAMPUS NOTICES
      ========================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 Cols): Class Timetable & Program Progress */}
        <div className="lg:col-span-2 space-y-6">
          {/* Today's Classes Card */}
          <FadeIn direction="up">
            <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800/80 shadow-xl backdrop-blur-md">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">
                      Today&apos;s Lecture & Lab Schedule
                    </h2>
                    <p className="text-xs text-slate-400">
                      Tuesday • Building C & Computing Labs
                    </p>
                  </div>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                  2 Sessions Left
                </span>
              </div>

              <div className="space-y-3">
                {[
                  {
                    code: "CS-401",
                    subject: "Deep Learning Architectures & Transformers",
                    time: "10:00 AM - 11:30 AM",
                    venue: "Lecture Hall 4B",
                    faculty: "Dr. Sarah Mitchell",
                    status: "Completed",
                  },
                  {
                    code: "CS-415",
                    subject: "Cloud Security & Zero-Trust Lab",
                    time: "01:30 PM - 03:00 PM",
                    venue: "Lab 3 - Cyber Wing",
                    faculty: "Prof. Marcus Chen",
                    status: "Up Next",
                  },
                  {
                    code: "DS-420",
                    subject: "Capstone Engineering Studio & Standup",
                    time: "03:30 PM - 05:00 PM",
                    venue: "Innovation Hub",
                    faculty: "Elena Rostova",
                    status: "Scheduled",
                  },
                ].map((cls, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="px-2.5 py-1 rounded-lg bg-indigo-950/60 border border-indigo-800/40 text-xs font-mono font-bold text-indigo-300">
                        {cls.code}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-white">
                          {cls.subject}
                        </div>
                        <div className="text-xs text-slate-400 flex items-center gap-3 mt-1">
                          <span>{cls.faculty}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1 text-slate-400">
                            <MapPin className="w-3 h-3" />
                            {cls.venue}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center shrink-0">
                      <span className="text-xs font-medium text-slate-300">
                        {cls.time}
                      </span>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full mt-1 ${
                          cls.status === "Completed"
                            ? "bg-slate-800 text-slate-400"
                            : cls.status === "Up Next"
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 animate-pulse"
                            : "bg-indigo-500/10 text-indigo-300 border border-indigo-500/20"
                        }`}
                      >
                        {cls.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>

          {/* Active Courses Progress Bars */}
          <FadeIn direction="up">
            <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800/80 shadow-xl backdrop-blur-md">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-indigo-400" />
                  Syllabus Progress Breakdown
                </h2>
                <Link
                  href="/dashboard/courses"
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
                >
                  View All Materials
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="space-y-4">
                {courses.slice(0, 3).map((crs) => (
                  <div
                    key={crs.id}
                    className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/70 space-y-2.5"
                  >
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-semibold text-white">
                        {crs.title}
                      </span>
                      <span className="font-mono text-xs text-emerald-400 font-semibold">
                        {crs.progress || 75}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${crs.progress || 75}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-2 rounded-full"
                      />
                    </div>
                    <div className="flex justify-between text-xs text-slate-400">
                      <span>Instructor: {crs.instructor}</span>
                      <span>{crs.credits} Credits</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>

        {/* Right Column (1 Col): Urgent Notices & Quick Campus Actions */}
        <div className="space-y-6">
          {/* Urgent Notice Alert Card */}
          <FadeIn direction="up">
            <div className="p-6 rounded-3xl bg-gradient-to-b from-rose-950/40 via-slate-900/90 to-slate-900 border border-rose-500/30 shadow-xl backdrop-blur-md">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider text-rose-400">
                    High Priority Notice
                  </span>
                </div>
                <span className="text-[10px] text-slate-400">Dean Office</span>
              </div>

              <h3 className="text-base font-bold text-white mb-2 leading-snug">
                {urgentNotice.title}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed line-clamp-3 mb-4">
                {urgentNotice.content}
              </p>

              <Link
                href="/dashboard/notices"
                className="w-full py-2.5 px-4 rounded-xl bg-rose-600/20 border border-rose-500/40 hover:bg-rose-600/30 text-xs font-semibold text-rose-200 transition-colors flex items-center justify-center gap-2"
              >
                <span>Read Full Announcement</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </FadeIn>

          {/* Next Registered Event */}
          <FadeIn direction="up">
            <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800/80 shadow-xl backdrop-blur-md">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-amber-400" />
                  Your Next Campus Event
                </h3>
                <Link
                  href="/dashboard/events"
                  className="text-xs text-amber-400 hover:underline"
                >
                  View All
                </Link>
              </div>

              {registeredEvents.length > 0 ? (
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                  <div className="text-xs font-bold text-indigo-300 px-2.5 py-0.5 rounded-full bg-indigo-950/60 border border-indigo-800/50 inline-block">
                    Seat Confirmed ✓
                  </div>
                  <h4 className="text-sm font-bold text-white">
                    {registeredEvents[0].title}
                  </h4>
                  <div className="text-xs text-slate-400 space-y-1">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      <span>{new Date(registeredEvents[0].event_date).toLocaleDateString("en-US", { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" />
                      <span>{registeredEvents[0].location}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-5 rounded-2xl bg-slate-950/50 border border-slate-800 text-center">
                  <p className="text-xs text-slate-400 mb-3">
                    You haven&apos;t registered for any upcoming events yet.
                  </p>
                  <Link
                    href="/dashboard/events"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-semibold hover:bg-amber-500/30"
                  >
                    Browse Campus Events
                  </Link>
                </div>
              )}
            </div>
          </FadeIn>
        </div>
      </div>

      {/* =========================================================================
          DIGITAL ID CARD MODAL POPUP (FRAMER MOTION)
      ========================================================================== */}
      <AnimatePresence>
        {showIdCardModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.25 }}
              className="relative w-full max-w-md p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl text-white"
            >
              <button
                onClick={() => setShowIdCardModal(false)}
                className="absolute top-4 right-4 p-1.5 rounded-xl bg-slate-800/60 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-600/30 border border-indigo-500/40 text-indigo-400 mb-3">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white">Digital Student ID</h3>
                <p className="text-xs text-slate-400">CampusOS Verified Academic Identity</p>
              </div>

              {/* ID Badge Card Preview */}
              <div className="p-6 rounded-2xl bg-gradient-to-tr from-indigo-950 via-slate-950 to-slate-900 border border-indigo-500/40 relative overflow-hidden shadow-inner mb-6">
                <div className="flex items-center justify-between border-b border-indigo-500/20 pb-3 mb-4">
                  <span className="font-extrabold text-sm tracking-wider text-white">
                    CAMPUS UNIVERSITY
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    VALID 2026-2027
                  </span>
                </div>

                <div className="flex gap-4 items-center mb-4">
                  <div className="w-16 h-16 rounded-xl bg-indigo-600 flex items-center justify-center text-2xl font-bold text-white shrink-0 shadow-md">
                    {user?.full_name?.charAt(0) || "A"}
                  </div>
                  <div>
                    <div className="text-base font-bold text-white">
                      {user?.full_name || "Alex Rivers"}
                    </div>
                    <div className="text-xs text-indigo-300 font-mono">
                      ID: {user?.student_id || "STU-884210"}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      {user?.course_name || "B.Tech in Artificial Intelligence"}
                    </div>
                  </div>
                </div>

                {/* Simulated Barcode */}
                <div className="pt-3 border-t border-indigo-500/20 flex flex-col items-center">
                  <div className="font-mono text-[9px] tracking-widest text-slate-400 mb-1">
                    ||||| ||| ||||||| || |||| |||||| |||||
                  </div>
                  <div className="text-[9px] font-mono text-slate-500">
                    NFC & TURNSTILE GATE ENABLED
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleDownloadId}
                  className="flex-1 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white transition-colors flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download PDF Card</span>
                </button>
                <button
                  onClick={() => setShowIdCardModal(false)}
                  className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
