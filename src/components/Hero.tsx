"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import {
  GraduationCap,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Calendar,
  BookOpen,
  Users,
  CheckCircle2,
  Zap,
} from "lucide-react";
import { useCampus } from "@/context/CampusContext";

export default function Hero() {
  const { loginAsDemo, isSupabaseConnected } = useCampus();

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-32">
      {/* Dynamic Background Gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[380px] bg-gradient-to-tr from-indigo-600/25 via-emerald-600/15 to-cyan-500/15 blur-[140px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-2/3 right-10 w-[350px] h-[350px] bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center"
        >
          {/* Badge */}
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-xs text-slate-300 mb-6 shadow-lg shadow-black/20"
          >
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-medium text-slate-200">
              CampusOS 2.0 Academic Portal
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              {isSupabaseConnected ? "Supabase Live" : "Demo Mode Active"}
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl leading-[1.12]"
          >
            Next-Gen Campus &{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-teal-300 to-emerald-400">
              Student Management
            </span>{" "}
            Platform
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            className="mt-6 text-base sm:text-xl text-slate-300 max-w-2xl font-normal leading-relaxed"
          >
            Seamlessly track enrolled courses, digital syllabi, real-time campus
            announcements, attendance percentages, and one-click event RSVPs in
            one responsive portal.
          </motion.p>

          {/* Primary Action Buttons */}
          <motion.div
            variants={itemVariants}
            className="mt-8 flex flex-wrap items-center justify-center gap-4"
          >
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-emerald-600 text-white font-semibold text-sm shadow-xl shadow-indigo-600/30 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              <GraduationCap className="w-4 h-4 text-emerald-300" />
              <span>Student Login</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-slate-200 font-medium text-sm hover:bg-slate-800 hover:border-slate-600 hover:text-white transition-all cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-indigo-400" />
              <span>Explore Campus</span>
            </Link>

            <Link
              href="/admin"
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-slate-950 border border-emerald-900/40 text-emerald-400 font-medium text-sm hover:bg-emerald-950/30 hover:border-emerald-700/60 transition-all cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Admin Portal</span>
            </Link>
          </motion.div>

          {/* Quick 1-Click Demo Login Bar */}
          <motion.div
            variants={itemVariants}
            className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400"
          >
            <span>Instant Demo Access:</span>
            <Link
              href="/dashboard"
              onClick={() => loginAsDemo("student")}
              className="px-3 py-1 rounded-lg bg-indigo-950/60 border border-indigo-800/50 text-indigo-300 hover:bg-indigo-900/60 transition-colors"
            >
              Demo Student (Alex)
            </Link>
            <Link
              href="/admin"
              onClick={() => loginAsDemo("admin")}
              className="px-3 py-1 rounded-lg bg-emerald-950/60 border border-emerald-800/50 text-emerald-300 hover:bg-emerald-900/60 transition-colors"
            >
              Demo Admin (Dean Vance)
            </Link>
          </motion.div>

          {/* Live Campus Metric Badges */}
          <motion.div
            variants={itemVariants}
            className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-4 w-full max-w-4xl"
          >
            {[
              {
                label: "Enrolled Students",
                value: "4,250+",
                sub: "Across 4 Disciplines",
                icon: Users,
                color: "text-indigo-400",
                bg: "from-indigo-950/40 to-slate-900/40",
              },
              {
                label: "Academic Attendance",
                value: "94.8%",
                sub: "Campus-wide Average",
                icon: CheckCircle2,
                color: "text-emerald-400",
                bg: "from-emerald-950/40 to-slate-900/40",
              },
              {
                label: "Upcoming Events",
                value: "14 Live",
                sub: "Instant 1-Click RSVP",
                icon: Calendar,
                color: "text-amber-400",
                bg: "from-amber-950/40 to-slate-900/40",
              },
              {
                label: "Real-time Notices",
                value: "100%",
                sub: "Supabase Synced",
                icon: Zap,
                color: "text-cyan-400",
                bg: "from-cyan-950/40 to-slate-900/40",
              },
            ].map((metric) => {
              const Icon = metric.icon;
              return (
                <div
                  key={metric.label}
                  className={`p-4 rounded-2xl bg-gradient-to-br ${metric.bg} border border-slate-800/80 backdrop-blur-md text-left transition-all hover:border-slate-700`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-slate-400 font-medium">
                      {metric.label}
                    </span>
                    <Icon className={`w-4 h-4 ${metric.color}`} />
                  </div>
                  <div className="text-2xl font-bold text-white tracking-tight">
                    {metric.value}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {metric.sub}
                  </div>
                </div>
              );
            })}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
